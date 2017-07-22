//  引入模块
var http = require("http");
var fs = require("fs");
var url = require("url");
var server = http.createServer(function (req,res) {
    // 当请求对应的端口号，执行这个函数
    // req.url
    // url.parse ()参数有true，在方法的返回值里面query属性值： url这个地址？后面的值当成键值对存储到query中;不加true是字符串，加true 就变成一个对象
    //www.zhufengpeixun.com?uername=12&password=199;
    // {query:{username:12,password:199}}
    var urlObj = url.parse(req.url,true);
    var pathname = urlObj["pathname"];
    var query = urlObj["query"]; //加true {username:niu,password:123}
    // 没有加true "username=niu&password=123"
    // console.log(urlObj)
    // if(pathname === "/index.html"){
    //     // 读取index.html 里面的内容
    //     var content = fs.readFileSync("./index.html","utf-8");
    //     res.end(content);
    //     return;
    // }
    // if(pathname === "/css/index.css"){
    //     var con = fs.readFileSync("./css/index.css","utf-8");
    //     res.end(con);
    //     return;
    // }
    // if(pathname === "/js/index.js"){
    //     var content = fs.readFileSync("./js/index.js","utf-8");
    //     res.end(content);
    //     return;
    // }
    // res.end()
    var reg = /\.(HTML|JS|CSS|JSON|ICO)/i;// 忽略大小写
    if(reg.test(pathname)){
        // console.log(reg.exec(pathname))
        var suffix = reg.exec(pathname)[1].toUpperCase();// 转换成大写
        var suffixMIME = "text/plain";
        switch(suffix){
            case "HTML":
                suffixMIME = "text/html";
                break;
            case "CSS":
                suffixMIME = "text/css";
                break;
            case "JS":
                suffixMIME = "text/javascript";
                break;
            case "JSON":
                suffixMIME = "application/json";
                break;
            case "ICO":
                suffixMIME = "application/octet-stream";
                break;
        }
    }
    try{
        var conFile = fs.readFileSync("."+pathname,"utf-8");
        //设置响应头
        res.writeHead(200,{'content-type':suffixMIME+';charset=utf-8;'});
        res.end(conFile)
    }catch(e){
        res.writeHead(404,{'content-type':'text/plain;charset=utf-8;'});
        res.end("request file is not found")
    }
});
//监听服务
server.listen(80,function () {
    console.log("当前80端口已经监听成功")
});
// MIME 类型
// m每一个文件都有自己的标识类型  比如：HTML文件 MIME类型 是"text/html"
// css 文件MIME 是 "text/css"
// 浏览器会按照代码的MIME 类型


