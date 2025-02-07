package queue

type TaskStatus int

const (
	TASK_PENDING = iota
)

type Task[T any] struct {
	Id     string
	Handle func() T
	Status TaskStatus
	Result *TaskResult[T]
}

type TaskResult[T any] struct {
	Id     string
	Result T
}

func NewTask[T any](id string, handle func() T) Task[T] {
	return Task[T]{
		Id:     id,
		Handle: handle,
	}
}

func NewTaskResult[T any](id string, result T) TaskResult[T] {
	return TaskResult[T]{
		Id: id,
		Result: result,
	}
}
