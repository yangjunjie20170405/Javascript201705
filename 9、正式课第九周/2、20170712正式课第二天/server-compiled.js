// 导入我们常用三个模块
var http = require("http"),
    fs = require("fs"),
    url = require("url");
// http  :
// http.createServer() ; 创建一个服务,变量server就是我们创建出来的那个服务
var server = http.createServer(function (request, response) {
    // 当客户端向服务器这个端口号发送一个请求，并且当前的服务已经成功接收到这个请求后会执行这个函数
    // request (请求)  ： 存放的是客户端请求信息;包含客户端访问服务器url,问号传参的方式
    // request.url : 存放的客户端请求文件资源的目录以及传给服务器的参数
    // response : (响应) 服务器响应给客户端的信息
    console.log(request.url);
    //  url.parse   把request的属性url的属性值转换成对象
    var urlObj = url.parse(request.url);
    var pathname = urlObj.pathname;
    console.log(urlObj);
    if (pathname === "/index.html") {
        //  读物服务器上文件的内容
        var content = fs.readFileSync("./index.html", "utf-8");
        // 把读取的内容给了响应
        // response : 提供了向客户端返回内容和数据的方法
        // response.write : 向客户端返回内容
        // response.end : 告诉服务器，响应结束了
        response.write(content);
        response.end();
    }
});
// 监听当前的服务
server.listen(83, function () {
    //  80: 端口号
    // 回调函数执行 ： 当服务创建成功，并且端口号也监听成功之后执行这个回调函数
    console.log("server is success");
});
//localhost: 本地
// 端口号..
// 当前资源文件路径
// ?_=math.random()  : 为了不走缓存

//# sourceMappingURL=server-compiled.js.map