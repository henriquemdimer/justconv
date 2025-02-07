package queue

import (
	"fmt"
)

type DefaultQueue[T any] struct {
	options     DefaultQueueOptions
	task_chan   chan Task[T]
	exit_chan   chan int
	result_chan chan TaskResult[T]
}

type DefaultQueueOptions struct {
	Workers int
}

func NewDefaultQueue[T any](options *DefaultQueueOptions) *DefaultQueue[T] {
	return &DefaultQueue[T]{
		options:     validateOptions(options),
		task_chan:   make(chan Task[T]),
		exit_chan:   make(chan int),
		result_chan: make(chan TaskResult[T]),
	}
}

func validateOptions(options *DefaultQueueOptions) DefaultQueueOptions {
	validatedOptions := &DefaultQueueOptions{
		Workers: 2,
	}

	if options != nil {
		if options.Workers != 0 {
			validatedOptions.Workers = options.Workers
		}
	}

	return *validatedOptions
}

func worker[T any](task_chan chan Task[T], exit chan int, result_chan chan TaskResult[T]) {
out:
	for {
		select {
		case task := <-task_chan:
			result := NewTaskResult(task.Id, task.Handle())
			result_chan <- result
		case <-exit:
			break out
		}
	}
}

func (self *DefaultQueue[T]) Init() {
	for i := 0; i < self.options.Workers; i++ {
		go worker(self.task_chan, self.exit_chan, self.result_chan)
	}

out:
	for {
		select {
		case data := <-self.result_chan:
			fmt.Println(data)
		case <-self.exit_chan:
			break out
		}
	}
}

func (self *DefaultQueue[T]) Deinit() {
	self.exit_chan <- 1
}

func (self *DefaultQueue[T]) Enqueue(task Task[T]) string {
	self.task_chan <- task
	return task.Id
}
