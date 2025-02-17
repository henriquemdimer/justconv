package cache

import "github.com/henriquemdimer/justconv/internal/domain/conversion"

type ConversionListCache interface {
	Append(*conversion.Conversion)
	Remove(string)
	Get(string) *conversion.Conversion
	AttachTaskId(conv_id string, task_id string)
}
