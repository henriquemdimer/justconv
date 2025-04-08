package modmgr

import (
	"log"
	"slices"

	"github.com/henriquemdimer/justconv/internal/events"
	"github.com/henriquemdimer/justconv/pkg/bus"
)

type ModMgr struct {
	modules map[string]ModuleRegister
	refModules map[string]Module
	event_bus bus.Bus
}

func New(event_bus bus.Bus) *ModMgr {
	return &ModMgr{
		modules: make(map[string]ModuleRegister),
		refModules: make(map[string]Module),
		event_bus: event_bus,
	}
}

func (m *ModMgr) Register(mod Module) {
	m.modules[mod.Id()] = ModuleRegister{Module: mod, Priotiry: DEFAULT_PRIORITY}
}

func (m *ModMgr) initModule(mod Module) {
	if m.refModules[mod.Id()] != nil {
		return
	}

	deps := mod.DependsOn()
	exportedDeps := make(map[string]any)

	for _, dep := range deps {
		module, exists := m.modules[dep]
		if !exists {
			log.Panicf("Module %s depends on %s which is not present", mod.Id(), dep)
		}

		m.initModule(module)
		exportedDeps[dep] = m.refModules[dep].Export(mod)
	}

	mod.Init(exportedDeps)
	m.refModules[mod.Id()] = mod
	m.event_bus.Dispatch(events.MODULE_LOADED, mod.Id())
}

func (m *ModMgr) Init() {
	var mods []ModuleRegister
	for _, val := range m.modules {
		mods = append(mods, val)
	}

	slices.SortFunc(mods, func(a ModuleRegister, b ModuleRegister) int {
		return a.Priotiry - b.Priotiry
	})

	for _, mod := range mods {
		m.initModule(mod)
	}

	m.event_bus.Dispatch(events.MODULE_LOADING_DONE, nil)

	for _, mod := range mods {
		mod.Start()
	}
}
