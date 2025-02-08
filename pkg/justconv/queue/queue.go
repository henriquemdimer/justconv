package queue

type Queue[T any] interface {
	Init()
	Enqueue(task Task[T]) TaskID
	GetTask(task_id TaskID) Task[T]
	Deinit()
}
