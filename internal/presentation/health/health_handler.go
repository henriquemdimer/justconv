package health

import (
	"github.com/go-chi/chi/v5"
	"github.com/henriquemdimer/justconv/internal/domain"
)

func Load(r chi.Router, writer domain.Writer, _ domain.CommandBus, queryBus domain.QueryBus) {
	controller := NewController(writer, queryBus)
	r.Get("/", controller.GetHealth)
}
