var write = require('../write').writeLispValue;

describe('the writer', function() {
    it('writes true/false as #t and #f', function() {
        expect(write(true)).toEqual('#t');
        expect(write(false)).toEqual('#f');
    });
    it('writes numbers by stringifying them', function() {
        expect(write(42)).toEqual('42');
        expect(write(-20.25)).toEqual('-20.25');
    });
    it('writes lists', function() {
        expect(write([1, 2, 'red', 'blue'])).toEqual('(1 2 red blue)');
        expect(write(['some', ['nested', ['lists']]]))
            .toEqual('(some (nested (lists)))');
    });
    it('renders functions opaque', function() {
        expect(write(function() {})).toEqual('[function]');
    });
    it('writes strings as symbols', function() {
        expect(write('test')).toEqual('test');
    });
    it('prints nil for undefined or null', function() {
        expect(write(undefined)).toEqual('nil');
        expect(write(null)).toEqual('nil');
    });
});
