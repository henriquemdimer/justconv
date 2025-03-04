package conversion

type ConversionCreated struct {
	Id     string
	Input  string
	Format string
}

type ConversionUpdated struct {
	Id     string
	Status string
}
