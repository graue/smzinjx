var fs = require('fs');
var evalLisp = require('./eval').evalLisp;
var parseLisp = require('./parse').parseLisp;
var tokenizeLisp = require('./tokenize').tokenizeLisp;

fs.readFile((process.argv[2] || '/dev/stdin'), {encoding: "utf8"},
    function(err, data) {
        if (!err) evalLisp(parseLisp(tokenizeLisp(data)));
    }
);
