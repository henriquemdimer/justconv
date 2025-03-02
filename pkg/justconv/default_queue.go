package justconv

import (
	"errors"
	"runtime"
)

type DefaultQueue[T any] struct {
	tasks       map[TaskID]*Task[string]
	options     DefaultQueueOptions
	task_chan   chan *Task[string]
	exit_chan   chan int
	result_chan chan TaskResult[string]
	events      *EventBus
	exiting     bool
}

type DefaultQueueOptions struct {
	Workers int
}

func NewDefaultQueue[T any](events *EventBus, options *DefaultQueueOptions) *DefaultQueue[T] {
	return &DefaultQueue[T]{
		tasks:       make(map[TaskID]*Task[string]),
		options:     validateOptions(options),
		task_chan:   make(chan *Task[string]),
		exit_chan:   make(chan int),
		result_chan: make(chan TaskResult[string]),
		events:      events,
		exiting:     false,
	}
}

func validateOptions(options *DefaultQueueOptions) DefaultQueueOptions {
	validatedOptions := &DefaultQueueOptions{
		Workers: runtime.NumCPU(),
	}

	if options != nil {
		if options.Workers != 0 {
			validatedOptions.Workers = options.Workers
		}
	}

	return *validatedOptions
}

func worker[T any](task_chan chan *Task[T], exit chan int, result_chan chan TaskResult[T]) {
out:
	for {
		select {
		case task := <-task_chan:
			data, _ := task.Handle()
			result := NewTaskResult(task.Id, data)
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
		case result := <-self.result_chan:
			task := self.tasks[result.Id]
			task.Result = &result
			task.Status = TASK_DONE

			self.tasks[task.Id] = task
			go self.events.Emit(TaskDoneEvent, task)

			if self.exiting {
				pending_tasks := self.checkPendingTasks()
				if len(pending_tasks) <= 0 {
					close(self.exit_chan)
				}
			}
		case <-self.exit_chan:
			break out
		}
	}
}

func (self *DefaultQueue[T]) checkPendingTasks() map[string]*Task[string] {
	pending_tasks := make(map[string]*Task[string])

	for _, task := range self.tasks {
		if task.Status == TASK_PENDING {
			pending_tasks[string(task.Id)] = task
		}
	}

	return pending_tasks
}

func (self *DefaultQueue[T]) Deinit() {
	self.exiting = true

	pending_tasks := self.checkPendingTasks()
	if len(pending_tasks) <= 0 {
		close(self.exit_chan)
	} else {
		_ = <- self.exit_chan
		return
	}
}

func (self *DefaultQueue[T]) Enqueue(task *Task[string]) (TaskID, error) {
	if self.exiting {
		return "", errors.New("Queue is exiting, cannot enqueue new tasks.")
	}

	self.tasks[task.Id] = task
	go func() {
		self.task_chan <- task
	}()

	return task.Id, nil
}

func (self *DefaultQueue[T]) GetTask(task_id TaskID) *Task[string] {
	return self.tasks[task_id]
}
