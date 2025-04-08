package logger

import (
	"fmt"
	"log"

	"github.com/henriquemdimer/justconv/internal/modmgr"
)

type LoggerModule struct {}

func New() modmgr.Module {
	return &LoggerModule{}
}

func (l *LoggerModule) Name() string {
	return "Logging Module"
}

func (l *LoggerModule) Id() string {
	return "logger"
}

func (l *LoggerModule) DependsOn() []string {
	return []string{}
}

func (l *LoggerModule) Export(caller modmgr.Module) any {
	return NewDefaultLogger(
		log.New(
			log.Default().Writer(),
			fmt.Sprintf("[%s] ", caller.Id()),
			log.Default().Flags() | log.Lmsgprefix,
		),
	)
}

func (l *LoggerModule) Init(_ map[string]any) {}
func (l *LoggerModule) Start() {}
