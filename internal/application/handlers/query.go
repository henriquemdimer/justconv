package handlers

import (
	"github.com/henriquemdimer/justconv/internal/domain/cache"
	"github.com/henriquemdimer/justconv/pkg/justconv"
)

type QueryHandler struct {
	conv_cache cache.ConversionListCache
	conversor  *justconv.JustConv
}

func NewQueryHandler(conv_cache cache.ConversionListCache,
	conversor *justconv.JustConv) *QueryHandler {
	return &QueryHandler{
		conv_cache,
		conversor,
	}
}
