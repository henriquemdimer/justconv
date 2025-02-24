package conversion

import (
	"github.com/google/uuid"
	"github.com/henriquemdimer/justconv/internal/domain"
)

type Conversion struct {
	*domain.AggregateRoot
	id     string
	input  string
	taskId string
	format string
}

func GenerateID() string {
	return uuid.New().String()
}

func NewConversion(id string, input string, format string) *Conversion {
	return &Conversion{
		AggregateRoot:  domain.NewAggregateRoot(&[]domain.Event{ConversionCreated{Id: id, Input: input, Format: format}}),
		id:    id,
		format: format,
		input: input,
	}
}

func (self *Conversion) GetId() string {
	return self.id
}

func (self *Conversion) Get() *Conversion {
	return self
}

func (self *Conversion) SetTaskId(id string) {
	self.taskId = id
}
