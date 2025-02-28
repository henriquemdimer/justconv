package conversion

import (
	"github.com/google/uuid"
	"github.com/henriquemdimer/justconv/internal/domain"
	"github.com/henriquemdimer/justconv/pkg/justconv"
)

type Conversion struct {
	*domain.AggregateRoot
	id     string
	input  string
	taskId string
	format string
	status string
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
		status: justconv.STATUS[justconv.TASK_PENDING],
	}
}

func (self *Conversion) GetId() string {
	return self.id
}

func (self *Conversion) GetStatus() string {
	return self.status
}

func (self *Conversion) SetTaskId(id string) {
	self.taskId = id
}

func (self *Conversion) GetTaskId() string {
	return self.taskId
}

func (self *Conversion) SetStatus(status string) {
	self.status = status
}
