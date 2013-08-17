.PHONY: all realAll clean

# The following fake "all" target silences make's
# "Nothing to be done for `all'" message.

all: realAll
	@true

realAll: browser/lisp.js

SCRIPTS = $(shell find . -maxdepth 1 -name "*.js")

browser/lisp.js: $(SCRIPTS)
	browserify browser.js -o browser/lisp.js

clean:
	rm browser/lisp.js
