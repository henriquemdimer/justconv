package justconv

import (
	"errors"
	"path/filepath"
	"strings"

	"slices"
)

type JustConv struct {
	drivers []ConvDriver
	queue   Queue[string]
	events  *EventBus
}

func New(drivers []ConvDriver) *JustConv {
	eventBus := NewEventBus()
	return &JustConv{
		drivers: drivers,
		queue:   NewDefaultQueue[string](eventBus, nil),
		events:  eventBus,
	}
}

func (self *JustConv) GetDriver(input_format string, output_format string) ConvDriver {
	for _, driver := range self.drivers {
		supported_formats := driver.GetSupportedFormats()
		for _, group := range supported_formats {
			formats := group[input_format]
			if slices.Contains(formats, output_format) {
				return driver
			}
		}
	}

	return nil
}

func (self *JustConv) GetFormatsTable() Formats {
	table := make(Formats)

	for _, driver := range self.drivers {
		supported_formats := driver.GetSupportedFormats()
		for label, group := range supported_formats {
			if table[label] == nil {
				table[label] = group
			} else {
				for key, formats := range group {
					table[label][key] = formats
				}
			}
		}
	}

	return table
}

func (self *JustConv) Convert(input string, format string) (TaskID, error) {
	input_ext := strings.TrimPrefix(filepath.Ext(input), ".")

	driver := self.GetDriver(input_ext, format)
	if driver == nil {
		return "", errors.New("Failed to find driver for specific format: " + format)
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
