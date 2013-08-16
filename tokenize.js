exports.tokenizeLisp = function(txt) {
    return txt.replace(/([\(\)])/g, " $1 ").trim().split(/\s+/);
}
