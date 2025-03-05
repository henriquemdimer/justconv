package justconv

const (
	TaskCreatedEvent = iota
	TaskStatusUpdateEvent
)

type Handler func(ev *Task[string])

type EventBus struct {
	handlers map[int][]Handler
}

func NewEventBus() *EventBus {
	return &EventBus{
		handlers: make(map[int][]Handler),
	}
}

func (self *EventBus) RegisterHandler(ev int, fn Handler) {
	self.handlers[ev] = append(self.handlers[ev], fn)
}

func (self *EventBus) Emit(ev int, data *Task[string]) {
	for _, fn := range self.handlers[ev] {
		fn(data)
	}
}
