package bus

import (
	"errors"
	"fmt"
	"strings"

	"github.com/henriquemdimer/justconv/internal/domain"
)

type CommandBus struct {
	handlers map[string]domain.CommandHandler
}

func NewCommandBus() domain.CommandBus {
	return &CommandBus{
		handlers: make(map[string]domain.CommandHandler),
	}
}

func (self *CommandBus) RegisterHandler(name string, handler domain.CommandHandler) {
	self.handlers[name] = handler
}

func (self *CommandBus) Dispatch(command domain.Command) error {
	name := strings.Split(fmt.Sprintf("%T", command), ".")[1]
	handler, ex := self.handlers[name]
	if ex == false {
		return errors.New(fmt.Sprintf("Failed to find handler for %s", name))
	}

	handler(command)
	return nil
}
