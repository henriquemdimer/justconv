package drivers

import (
	"path/filepath"
	"strings"

	"github.com/u2takey/ffmpeg-go"
)

type FFmpegDriver struct {}

func NewFFmpegDriver() *FFmpegDriver {
	return &FFmpegDriver{}
}

func (self *FFmpegDriver) GetSupportedFormats() map[string][]string {
	return map[string][]string {
		"png": {"jpg", "webp", "avif", "bmp"},
		"jpg": {"png", "webp", "avif", "bmp"},
		"webp": {"png", "jpg", "avif", "bmp"},
		"avif": {"png", "jpg", "webp", "bmp"},
		"bmp": {"png", "jpg", "webp", "avif"},
	}
}

func (self *FFmpegDriver) GetName() string {
	return "FFmpeg Driver"
}

func (self *FFmpegDriver) Convert(input string, format string) (string, error) {
	output := strings.TrimSuffix(input, filepath.Ext(input)) + "." + format
	err := ffmpeg_go.Input(input).
		Output(output).
		OverWriteOutput().
		Run()
	if err != nil {
		return "", err
	}

	return output, nil
}
