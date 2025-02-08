package justconv

import (
	"errors"
	"path/filepath"
	"strings"

	"github.com/henriquemdimer/justconv/pkg/justconv/drivers"
	"github.com/henriquemdimer/justconv/pkg/justconv/queue"
)

type JustConv struct {
	drivers []ConvDriver
	queue queue.Queue[string]
}

func New() *JustConv {
	return &JustConv{
		drivers: []ConvDriver{drivers.NewFFmpegDriver()},
		queue: queue.NewDefaultQueue[string](nil),
	}
}

func (self *JustConv) GetDriver(input_format string, output_format string) ConvDriver {
	for _, driver := range self.drivers {
		supported_formats := driver.GetSupportedFormats()
		group := supported_formats[input_format]

		for _, tformat := range group {
			if tformat == output_format {
				return driver
			}
		}
	}

	return nil
}

func (self *JustConv) Convert(input string, format string) (queue.TaskID, error) {
	input_ext := strings.TrimPrefix(filepath.Ext(input), ".")

	driver := self.GetDriver(input_ext, format)
	if driver == nil {
		return queue.TaskID(""), errors.New("Failed to find driver for specific format: " + format)
	}

	id := self.queue.Enqueue(queue.NewTask(func() (string, error) {
		return driver.Convert(input, format)
	}))

	return id, nil
}

func (self *JustConv) Init() {
	self.queue.Init()
}

func (self *JustConv) Deinit() {
	self.queue.Deinit()
}

func (self *JustConv) GetQueue() queue.Queue[string] {
	return self.queue
}
