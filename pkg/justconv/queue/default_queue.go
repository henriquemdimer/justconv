package queue

type DefaultQueue[T any] struct {
	tasks       map[TaskID]Task[T]
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
		tasks:       make(map[TaskID]Task[T]),
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
		case <-self.exit_chan:
			break out
		}
	}
}

func (self *DefaultQueue[T]) Deinit() {
	self.exit_chan <- 1
}

func (self *DefaultQueue[T]) Enqueue(task Task[T]) TaskID {
	self.tasks[task.Id] = task

	go func() {
		self.task_chan <- task
	}()

	return task.Id
}

func (self *DefaultQueue[T]) GetTask(task_id TaskID) Task[T] {
	return self.tasks[task_id]
}
