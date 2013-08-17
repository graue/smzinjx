// Returns true if the value is truthy for Lisp's purposes.
exports.lispTruthy = function(value) {
    return value !== false && value !== null && value !== undefined;
}

exports.builtins = {
    '+': function(a, b) { return a + b; },
    '-': function(a, b) { return a - b; },
    'eq?': function(a, b) { return a === b; },
    'not': function(a) { return !exports.lispTruthy(a); },
    'number?': function(a) { return typeof a === 'number'; },
    'string?': function(a) { return typeof a === 'string'; },
    '*': function(a, b) { return a * b; },
    '/': function(a, b) { return a / b; },
    '<': function(a, b) { return a < b; },
    '>': function(a, b) { return a > b; },
    '<=': function(a, b) { return a <= b; },
    '>=': function(a, b) { return a >= b; }
};

