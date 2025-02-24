package convert

import (
	"github.com/go-chi/chi/v5"
	"github.com/henriquemdimer/justconv/internal/domain"
)

func Load(r chi.Router, writer domain.Writer, commandBus domain.CommandBus) {
	controller := NewController(commandBus, writer)

	r.Route("/convert", func(group chi.Router) {
		group.Post("/", controller.Convert)
		group.Get("/{id}", controller.CheckStatus)
		group.Get("/{id}/download", controller.Download)
	})
}
