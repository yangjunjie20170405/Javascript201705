var http = require("http");
var fs = require("fs");
var url = require("url");
var server = http.createServer(function (req, res) {
    // 这个回调函数 ，每一次请求都会执行一次
    var urlObj = url.parse(req.url, true);
    var pathname = urlObj["pathname"];
    var query = urlObj["query"]; //加true {username:niu,password:123}
    var reg = /\.(HTML|JS|CSS|JSON|ICO)/i; // 忽略大小写
    if (reg.test(pathname)) {
        // console.log(reg.exec(pathname))
        var suffix = reg.exec(pathname)[1].toUpperCase(); // 转换成大写
        var suffixMIME = "text/plain";
        switch (suffix) {
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
        try {
            var conFile = fs.readFileSync("." + pathname, "utf-8");
            //设置响应头
            res.writeHead(200, { 'content-type': suffixMIME + ';charset=utf-8;' });
            res.end(conFile);
        } catch (e) {
            res.writeHead(404, { 'content-type': 'text/plain;charset=utf-8;' });
            res.end("request file is not found");
        }
    }

    var customPath = "./json/custom.json";
    var con = fs.readFileSync(customPath, "utf-8");
    con = JSON.parse(con);
    var result = { code: 1, msg: "", data: null
        //  1、获取所有的客户信息
    };if (pathname === "/getList") {
        if (con.length > 0) {
            result = {
                code: 0,
                msg: "成功",
                data: con
            };
        }
        console.log(con);
        res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
        res.end(JSON.stringify(result));
        return;
    }
    // 根据传递进来客户的ID去获取某一个客户的信息
    if (pathname === "/getInfo") {
        var customId = query["id"];
        for (var i = 0; i < con.length; i++) {
            if (con[i]["id"] == customId) {
                result = {
                    code: 0,
                    msg: "成功",
                    data: con[i]
                };
                break;
            }
        }
        res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
        res.end(JSON.stringify(result));
        return;
    };

    // 3、根据当前传进来客户ID去删除这个客户
    if (pathname === "/removeInfo") {
        customId = query["id"];
        console.log(customId);
        var flag = false;
        for (var i = 0; i < con.length; i++) {
            if (con[i]["id"] == customId) {
                con.splice(i, 1);
                flag = true;
                break;
            }
        }
        result.msg = "删除失败";
        if (flag) {
            fs.writeFileSync(customPath, JSON.stringify(con), "utf-8");
            result = {
                code: 0,
                msg: "删除成功"
            };
        }
        res.writeHead(200, { "content-type": "application/json;charset=utf-8;" });
        res.end(JSON.stringify(result));
        return;
    }
    // 4) 增加客户信息
    if (pathname === "/addInfo") {
        var str = "";
        req.on("data", function (chunk) {
            str += chunk;
        });
        req.on("end", function () {
            console.log(str);
            //str = '{"name":"","age":"".....}'
            if (str.length === 0) {
                res.writeHead(200, { "content-type": "application/json;charset=utf-8;" });
                res.end(JSON.stringify({
                    code: 1,
                    msg: "新增失败"
                }));
                return;
            }
            var data = JSON.parse(str);
            data["id"] = con.length === 0 ? 1 : parseFloat(con[con.length - 1]["id"]) + 1;
            con.push(data);

            fs.writeFileSync(customPath, JSON.stringify(con), "utf-8");
            res.writeHead(200, { "content-type": "application/json;charset=utf-8;" });
            res.end(JSON.stringify({
                code: 0,
                msg: "新增成功"
            }));
        });
        return;
    };
    // 5)修改客户
    if (pathname === "/updateInfo") {
        var str = "";
        req.on("data", function (chunk) {
            str += chunk;
        });
        req.on("end", function () {
            if (str.length === 0) {
                res.writeHead(200, { "content-type": "application/json;charset=utf-8;" });
                res.end(JSON.stringify({
                    code: 1,
                    msg: "修改失败"
                }));
                return;
            };
            var data = JSON.parse(str);
            var flag = false;
            for (var i = 0; i < con.length; i++) {
                if (con[i]["id"] === data["id"]) {
                    con[i] = data;
                    flag = true;
                    break;
                }
            }
            result.msg = "修改失败";
            if (flag) {
                fs.writeFileSync(customPath, JSON.stringfy(con), "utf-8");
                result = {
                    code: 0,
                    msg: "修改成功"
                };
            }
            res.writeHead(200, { "content-type": "application/json;charset=utf-8;" });
            res.end(JSON.stringify(result));
        });
        return;
    }
});
//监听服务
server.listen(80, function () {
    console.log("当前80端口已经监听成功");
});

//# sourceMappingURL=server-compiled.js.map