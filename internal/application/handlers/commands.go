package handlers

import (
	"github.com/henriquemdimer/justconv/internal/domain"
	"github.com/henriquemdimer/justconv/internal/domain/cache"
	"github.com/henriquemdimer/justconv/pkg/justconv"
)

type CommandHandler struct {
	eventBus   domain.EventBus
	conv_cache cache.ConversionListCache
	conversor  *justconv.JustConv
}

func NewCommandHandler(eventBus domain.EventBus, conv_cache cache.ConversionListCache, conversor *justconv.JustConv) *CommandHandler {
	return &CommandHandler{
		eventBus,
		conv_cache,
		conversor,
	}
}
