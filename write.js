function writeLispValue(val) {
    if (typeof val === 'string')
        return val;
    if (typeof val === 'number')
        return val.toString();
    if (val === true)
        return '#t';
    if (val === false)
        return '#f';
    if (val instanceof Array)
        return '(' + val.map(writeLispValue).join(' ') + ')';
    return '[function]';
}

exports.writeLispValue = writeLispValue;
