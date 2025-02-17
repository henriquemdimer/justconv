package bus

import (
	"errors"
	"fmt"
	"strings"

	"github.com/henriquemdimer/justconv/internal/domain"
)

type DefaultCommandBus struct {
	handlers map[string]domain.CommandHandler
}

func NewDefaultCommandBus() domain.CommandBus {
	return &DefaultCommandBus{
		handlers: make(map[string]domain.CommandHandler),
	}
}

func (self *DefaultCommandBus) RegisterHandler(name string, handler domain.CommandHandler) {
	self.handlers[name] = handler
}

func (self *DefaultCommandBus) Dispatch(command domain.Command) error {
	name := strings.Split(fmt.Sprintf("%T", command), ".")[1]
	handler, ex := self.handlers[name]
	if ex == false {
		return errors.New(fmt.Sprintf("Failed to find handler for %s", name))
	}

	return handler(command)
}
