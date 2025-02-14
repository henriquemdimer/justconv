package health

import (
	"net/http"
)

type Handler struct {
	controller *Controller
}

func NewHandler() *Handler {
	return &Handler{
		controller: NewController(),
	}
}

func (self *Handler) Load(mux *http.ServeMux) {
	mux.HandleFunc("/", self.controller.GetHealth)
}
