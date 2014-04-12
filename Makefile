build:
	@npm install

clean:
	@rm -rf node_modules dist .tmp

release:
	@make clean
	@make build

.PHONY: build clean release