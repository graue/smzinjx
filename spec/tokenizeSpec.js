var tokenize = require('../tokenize').tokenizeLisp;

describe('the tokenizer', function() {
    it('splits on whitespace', function() {
        expect(tokenize('foo bar baz')).toEqual(['foo', 'bar', 'baz']);
        expect(tokenize('\n\none\t  \ntwo\n\nthree\n'))
            .toEqual(['one', 'two', 'three']);
    });

    it('treats parens as their own token', function() {
        expect(tokenize('one(two(three)four)five'))
            .toEqual(['one', '(', 'two', '(', 'three', ')', 'four', ')',
                      'five']);
        var lisp = '(define square (lambda x (* x x)))';
        expect(tokenize(lisp)).toEqual(['(', 'define', 'square', '(',
                                        'lambda', 'x', '(', '*', 'x', 'x',
                                        ')', ')', ')']);
    });
});
