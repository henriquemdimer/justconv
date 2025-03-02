package justconv

type Queue[T any] interface {
	Init()
	Enqueue(task *Task[T]) (TaskID, error)
	GetTask(task_id TaskID) *Task[T]
	Deinit()
}
