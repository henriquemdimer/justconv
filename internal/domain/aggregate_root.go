package domain

type AggregateRoot struct {
	events []Event
}

func NewAggregateRoot(events *[]Event) *AggregateRoot {
	return &AggregateRoot{
		events: *events,
	}
}

func (self *AggregateRoot) GetUncommitedEvents() []Event {
	ev := self.events

	self.events = []Event{}
	return ev
}

func (self *AggregateRoot) AppendEvent(event Event) {
	self.events = append(self.events, event)
}
