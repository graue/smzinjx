var evalLisp = require('./eval').evalLisp;
var parseLisp = require('./parse').parseLisp;
var tokenizeLisp = require('./tokenize').tokenizeLisp;
var writeLispValue = require('./write').writeLispValue;

// Simulate jQuery's $(document).ready for modern browsers
// Inspired by how ZeptoJS does it
function documentReady(callback) {
    if (/complete|loaded|interactive/.test(document.readyState))
        callback();
    else
        document.addEventListener('DOMContentLoaded', callback, false);
}

var history, textbox;

documentReady(function() {
    buffer = document.getElementById('history');
    textbox = document.getElementById('expr');
    textbox.onkeyup = function(event) {
        if (event.keyCode !== 13)
            return;
        this.disabled = true;
        var input = this.value, output, error = false;
        try {
            var result = evalLisp(parseLisp(tokenizeLisp(input)));
            output = writeLispValue(result);
        } catch (ex) {
            output = 'Error: ' + ex.message;
            error = true;
        }
        buffer.innerHTML += '> ' + input + "\n" + output + "\n";
        if (error)
            this.select();
        else
            this.value = '';
        this.disabled = false;
    };
});
