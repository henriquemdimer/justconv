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

		conv := conversion.NewConversion(cmd.Id, tmpFile.Name(), cmd.Format)
		id, err := self.conversor.Convert(tmpFile.Name(), cmd.Format)
		if err != nil {
			return errors.New(fmt.Sprintf("Failed to enqueue file to conversion: %s", err.Error()))
		}

		conv.SetTaskId(string(id))
		self.conv_cache.Save(conv)
	} else {
		return errors.New("Invalid command")
	}

	return nil
}

func (self *CommandHandler) UpdateConversionHandler(command domain.Command) error {
	if cmd, ok := command.(commands.UpdateConversion); ok {
		conv := self.conv_cache.GetByTaskId(cmd.TaskId)
		if conv == nil {
			return errors.New("Failed to find conversion in cache")
		}

		conv.SetStatus(cmd.Status)
		conv.SetOutputPath(cmd.OutputPath)
		self.conv_cache.Save(conv)

		return nil
	} else {
		return errors.New("Invalid command")
	}
}
