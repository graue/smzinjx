var runtime = require('./runtime');

function shallowCopy(obj) {
    var clone = {};
    Object.keys(obj).forEach(function(key) {
        clone[key] = obj[key];
    });
    return clone;
}

function has(dict, key) {
    return Object.prototype.hasOwnProperty.call(dict, key);
}

function LispLambda(bindings, paramNames, body) {
    this.bindings = shallowCopy(bindings);
    this.paramNames = paramNames;
    this.body = body;
}

LispLambda.prototype = {};
// Apply method so we can call LispLambdas like regular functions.
LispLambda.prototype.apply = function(_, args) {
    var innerBindings = shallowCopy(this.bindings);
    this.paramNames.forEach(function(param, index) {
        innerBindings[param] =
            (args[index] !== undefined) ? args[index] : null;
    });
    return _evalLisp(this.body, innerBindings);
};

function _evalLisp(tree, bindings) {
    if (bindings === undefined)
        bindings = {};

    if (typeof tree === 'number')
        return tree;
    else if (typeof tree === 'string') {
        if (tree === '#t')
            return true;
        if (tree === '#f')
            return false;
        if (!has(bindings, tree))
            throw new Error('Unbound var: ' + tree);
        return bindings[tree];
    }

    // We have a list. Look at the thing in root position.
    if (tree[0] === 'quote')
        return tree[1];
    if (tree[0] === 'if') {
        var test = _evalLisp(tree[1], bindings);
        if (runtime.lispTruthy(test))
            return _evalLisp(tree[2], bindings);
        return _evalLisp(tree[3], bindings);
    }
    if (tree[0] === 'set!') {
        var varName = tree[1];
        if (!has(bindings, varName))
            throw new Error('Attempt to set! unbound var: ' + varName);
        bindings[varName] = _evalLisp(tree[2], bindings);
        return null;
    }
    if (tree[0] === 'begin') {
        var result;
        tree.forEach(function(exp, index) {
            if (index !== 0)
                result = _evalLisp(exp, bindings);
        });
        return result;
    }
    if (tree[0] === 'define') {
        var varName = tree[1], value = _evalLisp(tree[2], bindings);
        bindings[varName] = value;
        return null;
    }
    if (tree[0] === 'lambda')
        return new LispLambda(bindings, tree[1], tree[2]);

    // tree[0] is a function we'll be calling.
    // It could be a builtin, or something that when eval'd yields a
    // function.
    var func = runtime.builtins[tree[0]] || _evalLisp(tree[0], bindings);
    var args = tree.slice(1).map(function(exp) {
        return _evalLisp(exp, bindings);
    });
    if (func instanceof Function || func instanceof LispLambda)
        return func.apply(func, args);

    throw new Error("Attempt to call non-function: " + func.toString());
}

exports.evalLisp = _evalLisp;
