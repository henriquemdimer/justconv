package justconv

type ConvDriver interface {
	GetSupportedFormats() map[string][]string
	GetName() string
	Convert(input string, format string) (string, error)
}
