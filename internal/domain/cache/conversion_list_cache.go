package cache

import "github.com/henriquemdimer/justconv/internal/domain/conversion"

type ConversionListCache interface {
	Save(*conversion.Conversion)
	Remove(string)
	Get(string) *conversion.Conversion
}
