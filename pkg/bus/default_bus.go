package bus

type DefaultBus struct {
	handlers map[string][]func(any)
}

func NewDefaultBus() Bus {
	return &DefaultBus{
		handlers: make(map[string][]func(any)),
	}
}

func (b *DefaultBus) Init() {}

func (b *DefaultBus) Deinit() {}

func (b *DefaultBus) Subscribe(name string, handler func(any)) {
	b.handlers[name] = append(b.handlers[name], handler)
}

func (b *DefaultBus) Dispatch(name string, payload any) {
	for _, handler := range b.handlers[name] {
		handler(payload)
	}
}
