var evalLisp = require('../eval').evalLisp;

describe('evaluation of scalars', function() {
    it('returns numbers unchanged', function() {
        expect(evalLisp(192)).toEqual(192);
    });
    it('looks up the value of variables', function() {
        expect(evalLisp('foo', {'foo': 42})).toEqual(42);
    });
    it('throws if you use an unbound variable', function() {
        expect(function() {
            evalLisp('bar', {'foo': 42});
        }).toThrow();
    });
    it('accepts boolean values', function() {
        expect(evalLisp('#t')).toEqual(true);
        expect(evalLisp('#f')).toEqual(false);
    });
});

describe('quoting', function() {
    it('quotes numbers', function() {
        expect(evalLisp(['quote', 42])).toEqual(42);
    });
    it('quotes strings', function() {
        expect(evalLisp(['quote', 'lambda'])).toEqual('lambda');
        expect(evalLisp(['quote', 'foobar'])).toEqual('foobar');
    });
    it('quotes lists', function() {
        expect(evalLisp(['quote', ['a', 'b', 'c']])).toEqual(['a', 'b', 'c']);
    });
});

describe('if statement', function() {
    it('evaluates the first thing if expression is true', function() {
        expect(evalLisp(['if', '#t', 1, 2])).toEqual(1);
        expect(evalLisp(['if', ['quote', 'a', 'b'], 1, 2])).toEqual(1);
    });
    it('doesn\'t evaluate second thing if expression is true', function() {
        expect(evalLisp(['if', '#t', 1, 'unbound-var'])).toEqual(1);
    });
    it('evaluates the second thing if expression is false', function() {
        expect(evalLisp(['if', '#f', 1, 2])).toEqual(2);
    });
    it('doesn\'t evaluate first thing if expression is false', function() {
        expect(evalLisp(['if', '#f', 'unbound-var', 2])).toEqual(2);
    });
    it('treats 0 and empty list as true', function() {
        expect(evalLisp(['if', 0, 1, 2])).toEqual(1);
        expect(evalLisp(['if', ['quote', []], 1, 2])).toEqual(1);
    });
    it('understands predicates', function() {
        expect(evalLisp(['if', ['eq?', 0, 0], 1, 2])).toEqual(1);
        expect(evalLisp(['if', ['eq?', 0, 2], 1, 2])).toEqual(2);
    });
});

describe('builtin functions', function() {
    it('do basic math', function() {
        expect(evalLisp(['+', 2, 10])).toEqual(12);
        expect(evalLisp(['-', 20, 100])).toEqual(-80);
        expect(evalLisp(['*', 0.5, 200])).toEqual(100);
        expect(evalLisp(['/', 48, 8])).toEqual(6);
    });
    it('do recursive math', function() {
        var expr = ['/', ['*', 10, 7],
                         ['+', 4, 1]];
        expect(evalLisp(expr)).toEqual(14);
    });
    it('negate booleans', function() {
        expect(evalLisp(['not', '#t'])).toEqual(false);
        expect(evalLisp(['if', ['not', '#f'], 1, 2])).toEqual(1);
    });
    it('respect truthiness of numbers and lists when negating', function() {
        expect(evalLisp(['not', 0])).toEqual(false);
        expect(evalLisp(['not', 42])).toEqual(false);
        expect(evalLisp(['not', ['quote', []]])).toEqual(false);
        expect(evalLisp(['not', ['quote', ['a']]])).toEqual(false);
    });
    it('test equality', function() {
        expect(evalLisp(['eq?', 2, 2])).toEqual(true);
        expect(evalLisp(['eq?', 2, 3])).toEqual(false);
    });
});

describe('defined vars', function() {
    it('can be accessed later on while in scope', function() {
        expect(evalLisp(['begin', ['define', 'x', 1337],
                                  'x'])).toEqual(1337);
    });
    it('can build on prior definitions', function() {
        expect(evalLisp(['begin', ['define', 'a', 100],
                                  ['define', 'b', ['+', 'a', 25]],
                                  'b'])).toEqual(125);
    });
});

describe('lambdas', function() {
    it('can be run', function() {
        expect(evalLisp([['lambda', [], 42]])).toEqual(42);
    });
    it('can manipulate an argument', function() {
        expect(evalLisp([['lambda', ['x'], ['*', 'x', 'x']], 3]))
            .toEqual(9);
    });
    it('can contain if statements', function() {
        expect(evalLisp([['lambda', ['n'], ['if', ['eq?', 'n', 0], 1, 2]],
                         0])).toEqual(1);
        expect(evalLisp([['lambda', ['n'], ['if', ['eq?', 'n', 0], 1, 2]],
                         35])).toEqual(2);
    });
});

describe('execution environment', function() {
    it('preserves bindings', function() {
        var bindings = {};
        evalLisp(['define', 'square',
                     ['lambda', ['x'], ['*', 'x', 'x']]],
                 bindings);
        expect(evalLisp(['square', 3], bindings)).toEqual(9);
    });
});

describe('the X combinator', function() {
    it('works', function() {
        var parse = require('../parse').parseLisp;
        var tokenize = require('../tokenize').tokenizeLisp;
        var X_comb =
            '(define X' +
            '  (lambda (f)' +
            '    ((lambda (x) (x x))' +
            '      (lambda (x)' +
            '        (f' +
            '          (lambda (v) ((x x) v)))))))';
        var fact =
            '(define fact' +
            '  (X (lambda (f) (lambda (n)' +
            '    (if (eq? n 0)' +
            '      1' +
            '      (* n (f (- n 1))))))))';
        var expr = ['begin',
                    parse(tokenize(X_comb)),
                    parse(tokenize(fact)),
                    ['fact', 10]];
        expect(evalLisp(expr)).toEqual(3628800);
    });
});
