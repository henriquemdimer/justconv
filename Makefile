SRC=$(wildcard cmd/*/main.go)
BIN_DIR=bin
LDFLAGS="-s -w"
GCFLAGS="-l -c 4"

all: deps build
	
deps:
	go mod tidy

build:
	$(foreach file, $(SRC), \
		output=$(BIN_DIR)/$(subst /,_,$(basename $(file))); \
		echo "Compiling $(file) -> $$output"; \
		go build -gcflags=$(GCFLAGS) -trimpath -ldflags $(LDFLAGS) -v -o $$output $(FLAGS) ./$(file);)

watch:
	air

clean:
	rm -rf $(BIN_DIR)
