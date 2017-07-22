function fn() {
    console.log(1)
}
// 是把方法fn暴露出来，module.exports
module.exports.fn = fn;
// module.exports = {fn:fn,fn1:fn1}