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

func (self *FFmpegDriver) GetSupportedFormats() []string {
	return []string{"png", "jpg", "gif", "webp", "avif"}
}

func (self *FFmpegDriver) GetName() string {
	return "FFmpeg Driver"
}

func (self *FFmpegDriver) Convert(input string, format string) (string, error) {
	output := strings.TrimSuffix(input, filepath.Ext(input)) + "." + format
	err := ffmpeg_go.Input(input).
		Output(output, ffmpeg_go.KwArgs{"q:v": "20"}).
		OverWriteOutput().
		Run()
	if err != nil {
		return "", err
	}

	return output, nil
}
