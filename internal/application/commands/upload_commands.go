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

type UpdateConversion struct {
	TaskId     string
	Status     string
	OutputPath string
}
