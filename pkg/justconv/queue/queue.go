package queue

type Queue[T any] interface {
	Init()
	Enqueue(task Task[T]) (id string)
	Deinit()
}
