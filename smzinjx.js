var fs = require('fs');
var evalLisp = require('./eval').evalLisp;
var parseLisp = require('./parse').parseLisp;
var tokenizeLisp = require('./tokenize').tokenizeLisp;
var writeLispValue = require('./write').writeLispValue;

if (process.argv[2]) {
    fs.readFile(process.argv[2], {encoding: "utf8"},
        function(err, data) {
            if (!err) console.log(evalLisp(parseLisp(tokenizeLisp(data))));
        }
    );
} else {
    var rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.setPrompt('> ');
    var bindings = {};
    rl.on('line', function(text) {
        try {
            var result = evalLisp(parseLisp(tokenizeLisp(text)), bindings);
            console.log(writeLispValue(result));
        } catch (ex) {
            console.log('Error: ' + ex.message);
        }
        rl.prompt();
    });
    rl.on('close', function() {
        process.exit();
    });
    rl.prompt();
}
