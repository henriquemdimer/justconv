package justconv

import (
	"errors"

	"github.com/henriquemdimer/justconv/pkg/justconv/drivers"
)

type JustConv struct {
	drivers []ConvDriver
}

func New() *JustConv {
	return &JustConv{
		drivers: []ConvDriver{drivers.NewFFmpegDriver()},
	}
}

func (self *JustConv) GetDriver(format string) ConvDriver {
	for _, driver := range self.drivers {
		supported_formats := driver.GetSupportedFormats()
		for _, tformat := range supported_formats {
			if tformat == format {
				return driver
			}
		}
	}

	return nil
}

func (self *JustConv) Convert(input string, format string) (string, error) {
	driver := self.GetDriver(format)
	if driver == nil {
		return "", errors.New("Failed to find driver for specific format: " + format)
	}

	output, err := driver.Convert(input, format)
	return output, err
}
