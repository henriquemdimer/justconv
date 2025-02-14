package handlers

import (
	"net/http"

	"github.com/henriquemdimer/justconv/internal/controllers"
)

type HealthHandler struct {
	controller *controllers.HealthController
}

func NewHealthHandler() *HealthHandler {
	return &HealthHandler{
		controller: controllers.NewHealthController(),
	}
}

func (self *HealthHandler) Load(mux *http.ServeMux) {
	mux.HandleFunc("/", self.controller.GetHealth)
}
