var parse = require('../parse').parseLisp;

describe('the parser', function() {
    it('parses numbers', function() {
        expect(parse(['243'])).toEqual(243);
        expect(parse(['-1667.5'])).toEqual(-1667.5);
    });

    it('parses symbols', function() {
        expect(parse(['lambda'])).toEqual('lambda');
    });

    it('parses lists', function() {
        var listA = ['(', ')'];
        var listB = ['(', '1337', ')'];
        var listC = ['(', '+', '2', '5', ')'];
        expect(parse(listA)).toEqual([]);
        expect(parse(listB)).toEqual([1337]);
        expect(parse(listC)).toEqual(['+', 2, 5]);
    });

    it('parses nested lists', function() {
        var nestedA = ['(', '(', 'lambda', '(', 'x', ')', 'x', ')', '4', ')'];
        var nestedB = ['(', '(', ')', '(', 'foobar', '42', ')', ')'];
        expect(parse(nestedA)).toEqual([['lambda', ['x'], 'x'], 4]);
        expect(parse(nestedB)).toEqual([[], ['foobar', 42]]);
    });
});
