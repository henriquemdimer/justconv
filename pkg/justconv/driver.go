package justconv

type ConvDriver interface {
	GetSupportedFormats() []string
	GetName() string
	Convert(input string, format string) (string, error)
}
