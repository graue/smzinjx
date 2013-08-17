# Smzinjx

Toy Lisp interpreter, implementing the nine types of forms in Peter Norvig's
[Lispy](http://norvig.com/lispy.html):

* variable references
* literal numbers
* `quote`
* `if`
* `set!`
* `define`
* `lambda`
* `begin`
* procedure calls

Runs in Node.js or the browser. For a node REPL, run `node smzinjx.js`.
For a browser REPL, install [Browserify](http://browserify.org/), run `make`,
and navigate to browser/index.html.

I didn't want to think about a name for this, so I just hit random keys,
hence "Smzinjx". It's pronounced just the way it looks :P

This code is released under the [Creative Commons CC0 1.0 Public Domain
Dedication](https://creativecommons.org/publicdomain/zero/1.0/).
