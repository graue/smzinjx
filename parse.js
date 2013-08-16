// Parse a Lisp expression starting at index start, and return a 2-array
// containing the parsed content and the numbers of tokens consumed.
function _parseLisp(tokens, start) {
    if (start === undefined)
        start = 0;

    if ('-0123456789'.indexOf(tokens[start][0]) !== -1)
        return [parseFloat(tokens[start]), 1];
    if (tokens[start] === '(')
        return parseList(tokens, start);
    return [tokens[start], 1];
}

// Parse a Lisp list starting at index start, and return a 2-array containing
// the parsed content and the number of tokens consumed.
function parseList(tokens, start) {
    var index = start;
    var content = [];
    if (tokens[index++] !== '(')
        throw new Error('parseList called on non-list');
    while (tokens[index] !== ')') {
        var res = _parseLisp(tokens, index);
        content.push(res[0]);
        index += res[1];
    }
    index++;
    return [content, index - start];
}

exports.parseLisp = function(tokens) {
    var res = _parseLisp(tokens);
    if (res[1] !== tokens.length) {
        console.log('throwing error, content is:');
        console.log(res[0]);
        console.log('and ' + res[1] + ' tokens were consumed');
        throw new Error("Unexpected token: " + tokens[res[1]]);
    }
    return res[0];
};
