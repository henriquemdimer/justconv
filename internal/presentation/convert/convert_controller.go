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
	queryBus   domain.QueryBus
	writer     domain.Writer
}

func NewController(writer domain.Writer, commandBus domain.CommandBus, queryBus domain.QueryBus) *Controller {
	return &Controller{
		commandBus,
		queryBus,
		writer,
	}
}

func (self *Controller) Convert(w http.ResponseWriter, r *http.Request) {
	format := r.URL.Query().Get("format")
	if format == "" {
		self.writer.WriteError(w, 400, &domain.RequestResponseError{
			Error: "Missing format url query param",
		})
		return
	}

	err := r.ParseMultipartForm(100 << 24)
	if err != nil {
		self.writer.WriteError(w, 400, nil)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		self.writer.WriteError(w, 500, nil)
		return
	}

	id := conversion.GenerateID()
	err = self.commandBus.Dispatch(commands.CreateUpload{
		Filename: header.Filename,
		File:     file,
		Format:   format,
		Id:       id,
	})
	if err != nil {
		self.writer.WriteError(w, 500, &domain.RequestResponseError{
			Error: err.Error(),
		})
		return
	}

	self.writer.WriteJson(w, 201, domain.RequestResponse{
		Message: "Conversion enqueued",
		Code:    201,
		Data: map[string]any{
			"id": id,
		},
	})
}

func (self *Controller) CheckStatus(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		self.writer.WriteError(w, 400, &domain.RequestResponseError{
			Error: "Missing conversion id",
		})
		return
	}

	conv, err := bus.QueryAsk[conversion.Conversion](self.queryBus, query.GetConversion{Id: id})
	if err != nil {
		self.writer.WriteError(w, 404, nil)
		return
	}

	self.writer.WriteJson(w, 200, domain.RequestResponse{
		Code: 200,
		Data: map[string]any{
			"id": conv.GetId(),
			"status": conv.GetStatus(),
			"format": conv.GetFormat(),
		},
	})
}

func (self *Controller) Download(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		self.writer.WriteError(w, 400, &domain.RequestResponseError{
			Error: "Missing conversion id",
		})
		return
	}

	conv, err := bus.QueryAsk[conversion.Conversion](self.queryBus, query.GetConversion{Id: id})
	if err != nil {
		self.writer.WriteError(w, 404, nil)
		return
	}

	http.ServeFile(w, r, conv.GetOutput())
}
