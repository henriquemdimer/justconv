package bus

type Bus interface {
	Init()
	Deinit()
	Subscribe(string, func(any))
	Dispatch(string, any)
}
