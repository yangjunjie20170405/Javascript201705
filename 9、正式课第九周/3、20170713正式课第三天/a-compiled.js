function sum() {
    var total = null;
    for (var i = 0; i < arguments.length; i++) {
        var cur = Number(arguments[i]);
        if (!isNaN(cur)) {
            total += cur;
        }
    }
    return total;
}
module.exports.sum = sum;

//# sourceMappingURL=a-compiled.js.map