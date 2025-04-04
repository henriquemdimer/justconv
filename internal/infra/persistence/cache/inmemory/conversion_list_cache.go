package inmemory

import (
	"sync"

	"github.com/henriquemdimer/justconv/internal/domain"
	"github.com/henriquemdimer/justconv/internal/domain/cache"
	"github.com/henriquemdimer/justconv/internal/domain/conversion"
)

type InMemoryConversionListCache struct {
	list     map[string]*conversion.Conversion
	mu       sync.Mutex
	eventBus domain.EventBus
}

var instance *InMemoryConversionListCache
var once sync.Once

func NewInMemoryConversionListCache(eventBus domain.EventBus) cache.ConversionListCache {
	once.Do(func() {
		instance = &InMemoryConversionListCache{
			list:     make(map[string]*conversion.Conversion),
			mu:       sync.Mutex{},
			eventBus: eventBus,
		}
	})

	return instance
}

func (self *InMemoryConversionListCache) Save(conv *conversion.Conversion) {
	self.mu.Lock()
	defer self.mu.Unlock()

	for _, ev := range conv.GetUncommitedEvents() {
		self.eventBus.Publish(ev)
	}

	self.list[conv.GetId()] = conv
}

func (self *InMemoryConversionListCache) Remove(id string) {
	self.mu.Lock()
	defer self.mu.Unlock()

	delete(self.list, id)
}

func (self *InMemoryConversionListCache) Get(id string) *conversion.Conversion {
	return self.list[id]
}

func (self *InMemoryConversionListCache) GetByTaskId(task_id string) *conversion.Conversion {
	for _, conv := range self.list {
		if conv.GetTaskId() == task_id {
			return conv
		}
	}

	return nil
}
