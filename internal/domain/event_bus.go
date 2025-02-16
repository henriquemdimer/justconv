package domain

type Event interface{}

type EventHandler func(event Event)

type EventBus interface {
	RegisterHandler(string, EventHandler)
	Publish(Event) error
}
