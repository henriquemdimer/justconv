package types

type Logger interface {
	Info(...any)
	Infof(format string, a ...any)
	Error(...any)
	Errorf(format string, a ...any)
	Fatal(...any)
	Fatalf(format string, a ...any)
}
