package commands

import (
	"mime/multipart"
)

type CreateUpload struct {
	File     multipart.File
	Filename string
	Format   string
	Id       string
}

type SetConversionStatus struct {
	TaskId string
	Status string
}
