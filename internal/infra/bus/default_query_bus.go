package bus

import (
	"errors"
	"fmt"
	"strings"

	"github.com/henriquemdimer/justconv/internal/domain"
)

type DefaultQueryBus struct {
	handlers map[string]domain.QueryHandler
}

func NewDefaultQueryBus() *DefaultQueryBus {
	return &DefaultQueryBus{
		handlers: make(map[string]domain.QueryHandler),
	}
}

func (self *DefaultQueryBus) RegisterHandler(name string, handler domain.QueryHandler) {
	self.handlers[name] = handler
}

func (self *DefaultQueryBus) Ask(query domain.Query) (interface{}, error) {
	name := strings.Split(fmt.Sprintf("%T", query), ".")[1]
	handler, exists := self.handlers[name]
	if !exists {
		return nil, errors.New(fmt.Sprintf("Failed to find handler for %s", name))
	}

	return handler(query)
}
