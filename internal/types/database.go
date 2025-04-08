package types

type Filter map[string]any

type Database interface {
	Init()
	Deinit()
	Query(collection string, filter Filter, dest any) error
	Insert(collection string, data any) error
	Update(collection string, filter Filter, update any) error
	Delete(collection string, filter Filter) error
}
