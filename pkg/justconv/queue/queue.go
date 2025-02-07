package queue

type Queue interface {
	Init()
	Enqueue(task Task) (id string)
	Deinit()
}

type Task struct {
	Id     string
	Handle func() string
}

type TaskResult struct {
	Id     string
	Result string
}

func NewTask(id string, handle func() string) Task {
	return Task{
		Id:     id,
		Handle: handle,
	}
}

func NewTaskResult(id string, result string) TaskResult {
	return TaskResult{
		Id: id,
		Result: result,
	}
}
