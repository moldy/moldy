build:
	@make install
	@gulp

clean:
	@rm -rf node_modules dist

install:
	@npm instal

release:
	@make clean
	@make build

.PHONY: build clean install release