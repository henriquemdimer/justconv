package convert

import (
	"net/http"

	"github.com/henriquemdimer/justconv/internal/application/commands"
	"github.com/henriquemdimer/justconv/internal/domain"
	"github.com/henriquemdimer/justconv/internal/domain/conversion"
)

type Controller struct {
	commandBus domain.CommandBus
	writer domain.Writer
}

func NewController(commandBus domain.CommandBus, writer domain.Writer) *Controller {
	return &Controller{
		commandBus,
		writer,
	}
}

func (self *Controller) Convert(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(100 << 24)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	id := conversion.GenerateID()
	err = self.commandBus.Dispatch(commands.CreateUpload{
		Filename: header.Filename,
		File: file,
		Format: "webp",
		Id: id,
	})
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.WriteHeader(200)
	self.writer.WriteJson(w, 201, domain.RequestResponse{
		Message: "Conversion enqueued",
		Code: 201,
		Data: map[string]string{
			"id": id,
		},
	})
}

func (self *Controller) CheckStatus(w http.ResponseWriter, r *http.Request) {}

func (self *Controller) Download(w http.ResponseWriter, r *http.Request) {}
