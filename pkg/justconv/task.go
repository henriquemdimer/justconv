package justconv

import "github.com/google/uuid"

type TaskStatus int
type TaskID string

const (
	TASK_PENDING = iota
	TASK_FAILED
	TASK_DONE
)

var STATUS = map[TaskStatus]string{
	TASK_PENDING: "PENDING",
	TASK_FAILED: "FAILED",
	TASK_DONE: "DONE",
}

type Task[T any] struct {
	Id     TaskID
	Handle func() (T, error)
	Status TaskStatus
	Result *TaskResult[T]
}

type TaskResult[T any] struct {
	Id     TaskID
	Result T
}

func NewTask[T any](handle func() (T, error)) *Task[T] {
	return &Task[T]{
		Id:     TaskID(uuid.New().String()),
		Handle: handle,
		Status: TASK_PENDING,
	}
}

func NewTaskResult[T any](id TaskID, result T) TaskResult[T] {
	return TaskResult[T]{
		Id:     id,
		Result: result,
	}
}
