build:
	@npm install
	@npm test

clean:
	@rm -rf node_modules dist

release:
	@make clean
	@make build
	@mkdir dist
	@./node_modules/.bin/browserify ./src/index.js -o dist/sgModel.js --standalone sgModel
	@./node_modules/.bin/uglifyjs ./dist/sgModel.js -o ./dist/sgModel.min.js

.PHONY: build clean release