package database

import (
	"reflect"
	"sync"

	"github.com/henriquemdimer/justconv/internal/events"
	"github.com/henriquemdimer/justconv/internal/types"
	"github.com/henriquemdimer/justconv/pkg/bus"
)

type MemoryDriver struct {
	event_bus bus.Bus
	data      map[string][]any
	mu        sync.Mutex
}

func NewMemoryDriver(event_bus bus.Bus) DatabaseDriver {
	return &MemoryDriver{
		event_bus: event_bus,
		data: make(map[string][]any),
		mu:   sync.Mutex{},
	}
}

func (m *MemoryDriver) Init() {}

func (m *MemoryDriver) Deinit() {}

func (m *MemoryDriver) Insert(collection string, data any) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.event_bus.Dispatch(events.DATABASE_INSERT, data)
	m.data[collection] = append(m.data[collection], data)
	return nil
}

func (m *MemoryDriver) Query(collection string, filter types.Filter, dest any) error {
	var match any
	for _, data := range m.data[collection] {
		if matchFilter(data, filter) {
			match = data
		}
	}

	if match != nil {
		destValue := reflect.ValueOf(dest).Elem()
		destValue.Set(reflect.ValueOf(match))
	}

	return nil
}

func (m *MemoryDriver) Delete(collection string, filter types.Filter) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	for index, data := range m.data[collection] {
		if matchFilter(data, filter) {
			m.data[collection] = append(m.data[collection][:index], m.data[collection][index+1:]...)
		}
	}

	return nil
}

func (m *MemoryDriver) Update(collection string, filter types.Filter, data any) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	for index, found := range m.data[collection] {
		if matchFilter(found, filter) {
			m.data[collection][index] = data
		}
	}
	return nil
}

func matchFilter(data any, filter types.Filter) bool {
	for key, expected := range filter {
		result := make(map[string]any)
		v := reflect.ValueOf(data).Elem()

		t := v.Type()
		for i := range v.NumField() {
			field := t.Field(i)
			result[field.Name] = v.Field(i).Interface()
		}

		if actual, ok := result[key]; !ok || actual != expected {
			return false
		}
	}

	return true
}
