package health

import (
	"github.com/go-chi/chi/v5"
	"github.com/henriquemdimer/justconv/internal/domain"
)

func Load(r chi.Router, _ domain.CommandBus) {
	controller := NewController()
	r.Get("/", controller.GetHealth)
}
