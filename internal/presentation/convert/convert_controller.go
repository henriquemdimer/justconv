package convert

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/henriquemdimer/justconv/internal/application/commands"
	"github.com/henriquemdimer/justconv/internal/application/query"
	"github.com/henriquemdimer/justconv/internal/domain"
	"github.com/henriquemdimer/justconv/internal/domain/conversion"
	"github.com/henriquemdimer/justconv/internal/infra/bus"
)

type Controller struct {
	commandBus domain.CommandBus
	queryBus domain.QueryBus
	writer domain.Writer
}

func NewController(writer domain.Writer, commandBus domain.CommandBus, queryBus domain.QueryBus) *Controller {
	return &Controller{
		commandBus,
		queryBus, 
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

func (self *Controller) CheckStatus(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		http.Error(w, "Bad Request", 400)
		return
	}

	conv, err := bus.QueryAsk[conversion.Conversion](self.queryBus, query.GetConversion{Id: id})
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	self.writer.WriteJson(w, 200, domain.RequestResponse{
		Code: 200,
		Data: map[string]string{
			"status": conv.GetStatus(),
		},
	})
}

func (self *Controller) Download(w http.ResponseWriter, r *http.Request) {}
