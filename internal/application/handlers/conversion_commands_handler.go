package handlers

import (
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/henriquemdimer/justconv/internal/application/commands"
	"github.com/henriquemdimer/justconv/internal/domain"
	"github.com/henriquemdimer/justconv/internal/domain/conversion"
)

func (self *CommandHandler) CreateUploadHandler(command domain.Command) error {
	if cmd, ok := command.(commands.CreateUpload); ok {
		tmpFile, err := os.CreateTemp("", fmt.Sprintf("*%s", filepath.Ext(cmd.Filename)))
		if err != nil {
			return errors.New("Failed to create temporary file")
		}

		_, err = io.Copy(tmpFile, cmd.File)
		if err != nil {
			return errors.New("Failed to write in temporary file")
		}

		conv := conversion.NewConversion(tmpFile.Name(), cmd.Format)
		self.conversor.Convert(tmpFile.Name(), cmd.Format)

		self.conv_cache.Append(conv)
	} else {
		return errors.New("Invalid command")
	}

	return nil
}
