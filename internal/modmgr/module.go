package modmgr

const DEFAULT_PRIORITY = 1000

type Module interface {
	DependsOn() []string
	Name() string
	Id() string
	Init(deps map[string]any)
	Start()
	Export(Module) any
}

type ModuleRegister struct {
	Module
	Priotiry int
}
