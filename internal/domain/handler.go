package domain

import (
	"github.com/go-chi/chi/v5"
)

type Handler func(chi.Router, Writer, CommandBus)
