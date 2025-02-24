package convert

import (
	"fmt"
	"net/http"

	"github.com/henriquemdimer/justconv/internal/application/commands"
	"github.com/henriquemdimer/justconv/internal/domain"
)

type Controller struct {
	commandBus domain.CommandBus
}

func NewController(commandBus domain.CommandBus) *Controller {
	return &Controller{
		commandBus,
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

	self.commandBus.Dispatch(commands.CreateUpload{
		Filename: header.Filename,
		File: file,
		Format: "webp",
	})

	w.WriteHeader(200)
	fmt.Fprintf(w, "OK")
}

func (self *Controller) CheckStatus(w http.ResponseWriter, r *http.Request) {}

func (self *Controller) Download(w http.ResponseWriter, r *http.Request) {}
