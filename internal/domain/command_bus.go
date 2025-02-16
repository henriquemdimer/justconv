package domain

type Command interface{}

type CommandHandler func(Command) error

type CommandBus interface {
	RegisterHandler(string, CommandHandler)
	Dispatch(Command) error
}
