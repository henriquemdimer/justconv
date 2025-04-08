package config

import (
	"log"
	"os"

	"github.com/knadh/koanf/parsers/toml"
	"github.com/knadh/koanf/providers/file"
	"github.com/knadh/koanf/v2"
)

type Config struct{
	Auth AuthConfig
	Net NetConfig
}

type AuthConfig struct {
	Required               bool
	UsersCanCreateAccounts bool
}

type NetConfig struct {
	Port string
}

var Content *Config = &Config{}
var Is_loaded bool = false
var File_path string

func Load() {
	File_path = os.Getenv("CONFIG_PATH")
	if File_path == "" {
		File_path = "config/server-config.toml"
	}

	k := koanf.New(".")
	log.Printf("Loading config from: %s\n", File_path)

	f := file.Provider(File_path)
	if err := k.Load(f, toml.Parser()); err != nil {
		panic("Failed to read server config")
	}

	Content.Auth = AuthConfig{
		Required: k.Bool("auth.required"),
		UsersCanCreateAccounts: k.Bool("auth.users_can_create_accounts"),
	}

	port := k.String("net.port")
	if port == "" {
		port = "8080"
	}

	Content.Net = NetConfig{
		Port: port,
	}

	Is_loaded = true
}
