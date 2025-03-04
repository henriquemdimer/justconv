package justconv

import (
	"errors"
	"path/filepath"
	"strings"

	"github.com/henriquemdimer/justconv/pkg/justconv/drivers"
	"slices"
)

type JustConv struct {
	drivers []ConvDriver
	queue   Queue[string]
	events  *EventBus
}

func New() *JustConv {
	eventBus := NewEventBus()
	return &JustConv{
		drivers: []ConvDriver{drivers.NewFFmpegDriver()},
		queue:   NewDefaultQueue[string](eventBus, nil),
		events:  eventBus,
	}
}

func (self *JustConv) GetDriver(input_format string, output_format string) ConvDriver {
	for _, driver := range self.drivers {
		supported_formats := driver.GetSupportedFormats()
		group := supported_formats[input_format]

		if slices.Contains(group, output_format) {
			return driver
		}
	}

	return nil
}

func (self *JustConv) Convert(input string, format string) (TaskID, error) {
	input_ext := strings.TrimPrefix(filepath.Ext(input), ".")

	driver := self.GetDriver(input_ext, format)
	if driver == nil {
		return TaskID(""), errors.New("Failed to find driver for specific format: " + format)
	}

	return self.queue.Enqueue(NewTask(func() (string, error) {
		return driver.Convert(input, format)
	}))
}

func (self *JustConv) Init() {
	self.queue.Init()
}

func (self *JustConv) Deinit() {
	self.queue.Deinit()
}

func (self *JustConv) GetQueue() Queue[string] {
	return self.queue
}

func (self *JustConv) GetEventBus() *EventBus {
	return self.events
}
