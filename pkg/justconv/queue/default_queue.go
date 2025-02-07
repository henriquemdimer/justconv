package queue

import (
	"fmt"
)

type DefaultQueue struct {
	options     DefaultQueueOptions
	task_chan   chan Task
	exit_chan   chan int
	result_chan chan TaskResult
}

type DefaultQueueOptions struct {
	Workers int
}

func NewDefaultQueue(options *DefaultQueueOptions) *DefaultQueue {
	return &DefaultQueue{
		options:     validateOptions(options),
		task_chan:   make(chan Task),
		exit_chan:   make(chan int),
		result_chan: make(chan TaskResult),
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

func worker(task_chan chan Task, exit chan int, result_chan chan TaskResult) {
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

func (self *DefaultQueue) Init() {
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

func (self *DefaultQueue) Deinit() {
	self.exit_chan <- 1
}

func (self *DefaultQueue) Enqueue(task Task) string {
	self.task_chan <- task
	return task.Id
}
