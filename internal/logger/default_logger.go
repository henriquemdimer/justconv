package logger

import (
	"log"

	"github.com/henriquemdimer/justconv/internal/types"
)

type DefaultLogger struct {
	logger        *log.Logger
	initialPrefix string
}

func NewDefaultLogger(logger *log.Logger) types.Logger {
	return &DefaultLogger{
		logger:        logger,
		initialPrefix: logger.Prefix(),
	}
}

func (l *DefaultLogger) withPrefix(prefix string, cb func()) {
	l.logger.SetPrefix(l.initialPrefix + prefix + " ")
	cb()
	l.logger.SetPrefix(l.initialPrefix)
}

func (l *DefaultLogger) Info(in ...any) {
	l.withPrefix("INFO", func() {
		l.logger.Println(in...)
	})
}

func (l *DefaultLogger) Infof(format string, a ...any) {
	l.withPrefix("INFO", func() {
		l.logger.Printf(format, a...)
	})
}

func (l *DefaultLogger) Error(in ...any) {
	l.withPrefix("ERROR", func() {
		l.logger.Println(in...)
	})
}

func (l *DefaultLogger) Errorf(format string, a ...any) {
	l.withPrefix("ERROR", func() {
		l.logger.Printf(format, a...)
	})
}

func (l *DefaultLogger) Fatal(in ...any) {
	l.withPrefix("FATAL", func() {
		l.logger.Fatalln(in...)
	})
}

func (l *DefaultLogger) Fatalf(format string, in ...any) {
	l.withPrefix("FATAL", func() {
		l.logger.Fatalf(format, in...)
	})
}
