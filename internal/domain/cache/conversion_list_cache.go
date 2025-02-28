package cache

import "github.com/henriquemdimer/justconv/internal/domain/conversion"

type ConversionListCache interface {
	Save(*conversion.Conversion)
	Remove(string)
	GetByTaskId(string) *conversion.Conversion
	Get(string) *conversion.Conversion
}
