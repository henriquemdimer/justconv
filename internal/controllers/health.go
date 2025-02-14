package controllers

import (
	"fmt"
	"net/http"
)

type HealthController struct {}

func NewHealthController() *HealthController {
	return &HealthController{}
}

func (self *HealthController) Load(mux *http.ServeMux) {
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "HEALTH OK")
	})
}
