package conversion

import (
	"github.com/google/uuid"
	"github.com/henriquemdimer/justconv/internal/domain"
	"github.com/henriquemdimer/justconv/pkg/justconv"
)

type Conversion struct {
	*domain.AggregateRoot
	id          string
	input_path  string
	output_path string
	taskId      string
	format      string
	status      string
}

func GenerateID() string {
	return uuid.New().String()
}

func NewConversion(id string, input string, format string) *Conversion {
	return &Conversion{
		AggregateRoot: domain.NewAggregateRoot(&[]domain.Event{ConversionCreated{Id: id, Input: input, Format: format}}),
		id:            id,
		format:        format,
		input_path:    input,
		output_path:   "",
		status:        justconv.STATUS[justconv.TASK_PENDING],
		taskId:        "",
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

func (self *Conversion) SetOutputPath(output string) {
	self.output_path = output
}

func (self *Conversion) GetOutput() string {
	return self.output_path
}

func (self *Conversion) SetStatus(status string) {
	self.AppendEvent(ConversionUpdated{
		Id: self.id,
		Status: status,
	})
	self.status = status
}

func (self *Conversion) GetFormat() string {
	return self.format
}
