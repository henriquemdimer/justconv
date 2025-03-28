BIN_DIR=bin
SRC=cmd/justconv/main.go
TARGET=$(BIN_DIR)/justconv

LDFLAGS="-s -w"
GCFLAGS="-l -c 4"
CMDFLAGS=-v -trimpath

.PHONY: dev run build clean deps

all: deps build

build: $(BIN_DIR)
	go build -o $(TARGET) -gcflags=$(GCFLAGS) -ldflags=$(LDFLAGS) $(CMDFLAGS) $(SRC)

$(BIN_DIR):
	mkdir -p $(BIN_DIR)

run:
	@./$(TARGET)

dev: build run

clean:
	@rm -rf $(BIN_DIR)
