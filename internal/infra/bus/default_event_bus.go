package bus

import (
	"errors"
	"fmt"
	"strings"

	"github.com/henriquemdimer/justconv/internal/domain"
)

type EventBus struct {
	handlers map[string]domain.EventHandler
}

func NewEventBus() domain.EventBus {
	return &EventBus{
		handlers: make(map[string]domain.EventHandler),
	}
}

func (self *EventBus) RegisterHandler(name string, handler domain.EventHandler) {
	self.handlers[name] = handler
}

func (self *EventBus) Publish(event domain.Event) error {
	name := strings.Split(fmt.Sprintf("%T", event), ".")[1]
	handler, exists := self.handlers[name]
	if !exists {
		return errors.New(fmt.Sprintf("Failed to find handler for %s", name))
	}

	handler(event)
	return nil
}
