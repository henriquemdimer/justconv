package justconv

import (
	"errors"
	"path/filepath"
	"strings"

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

func (self *JustConv) Convert(input string, format string) (string, error) {
	input_ext := strings.TrimPrefix(filepath.Ext(input), ".")

	driver := self.GetDriver(input_ext, format)
	if driver == nil {
		return "", errors.New("Failed to find driver for specific format: " + format)
	}

	return driver.Convert(input, format)
}
