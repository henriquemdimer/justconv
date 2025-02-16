package health

import (
	"github.com/go-chi/chi/v5"
)

type Handler struct {
	controller *Controller
}

func NewHandler() *Handler {
	return &Handler{
		controller: NewController(),
	}
}

func (self *Handler) Load(r chi.Router) {
	r.Get("/", self.controller.GetHealth)
}
