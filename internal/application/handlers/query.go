package handlers

import (
	"github.com/henriquemdimer/justconv/internal/domain/cache"
)

type QueryHandler struct {
	conv_cache cache.ConversionListCache
}

func NewQueryHandler(conv_cache cache.ConversionListCache) *QueryHandler {
	return &QueryHandler{
		conv_cache,
	}
}
