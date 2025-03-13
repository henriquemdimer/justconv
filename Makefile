BIN_DIR=bin
SRC=cmd/justconv/main.go
TARGET=$(BIN_DIR)/justconv

LDFLAGS="-s -w"
GCFLAGS="-l -c 4"
CMDFLAGS=-v -trimpath

.PHONY: deps clean run dev

all: deps $(TARGET)

$(TARGET): $(BIN_DIR)
	go build -o $(TARGET) -gcflags=$(GCFLAGS) -ldflags=$(LDFLAGS) $(CMDFLAGS) $(SRC)

$(BIN_DIR):
	@mkdir -p $(BIN_DIR)

deps:
	go mod tidy

run:
	@./$(TARGET)

dev: $(TARGET) run
