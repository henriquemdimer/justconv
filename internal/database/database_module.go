package database

import (
	"github.com/henriquemdimer/justconv/internal/modmgr"
)

type DatabaseModule struct {
	driver DatabaseDriver
}

func New(driver DatabaseDriver) modmgr.Module {
	return &DatabaseModule{
		driver,
	}
}

func (d *DatabaseModule) Name() string {
	return "Database Abstraction Module"
}

func (d *DatabaseModule) Id() string {
	return "database"
}

func (d *DatabaseModule) DependsOn() []string {
	return []string{}
}

func (d *DatabaseModule) Export(_ modmgr.Module) any {
	return d.driver
}

func (d *DatabaseModule) Init(_ map[string]any) {}

func (d *DatabaseModule) Start() {
	d.driver.Init()
}
