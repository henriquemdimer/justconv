CMD=justconv
BIN_NAME=main
LDFLAGS="-s -w"
GCFLAGS="-l -c 4"

all:
	go build  -tags netgo -gcflags=$(GCFLAGS) -mod=vendor -trimpath -ldflags $(LDFLAGS) -v -o bin/$(BIN_NAME) $(FLAGS) cmd/$(CMD)/main.go

run:
	./bin/$(BIN_NAME)
