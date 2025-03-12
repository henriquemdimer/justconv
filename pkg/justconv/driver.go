package justconv

type Formats map[string]map[string][]string

type ConvDriver interface {
	GetSupportedFormats() Formats
	GetName() string
	Convert(input string, format string) (string, error)
}
