package domain

type Query interface{}

type QueryHandler func(query Query) (interface{}, error)

type QueryBus interface {
	RegisterHandler(string, QueryHandler)
	Ask(Query) (interface{}, error)
}
