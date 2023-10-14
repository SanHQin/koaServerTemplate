const Koa = require("koa");
const koa = new Koa();
//json响应中间件
const json = require("koa-json");
//onerror错误处理程序
const onerror = require("koa-onerror");
//cors跨域中间件
const cors = require("koa2-cors");
//解析 Koa 的 xml 请求正文
const xmlParser = require("koa-xml-body");
//koa的主体解析器
const {koaBody} = require("koa-body");
// Koa 的简单会话中间件。默认为基于 Cookie 的会话并支持外部存储。
const session = require("koa-session");
//koa 的风格记录器中间件。与收到的请求兼容
const koaLogger = require("koa-logger");
const koaStatic = require('koa-static');
//使用跨域
koa.use(cors());

onerror(koa);

koa.keys = ['some secret hurr'];
const sessionConfig = {
    key: 'koa:sess',   //cookie key (default is koa:sess)
    maxAge: 3600000,  // cookie的过期时间60分钟
    overwrite: true,  //是否可以overwrite    (默认default true)
    httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true,   //签名默认true
    rolling: true,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
    renew: false,  //(boolean) renew session when session is nearly expired,
};
koa.use(session(sessionConfig, koa));

koa.use(xmlParser(undefined));

koa.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 100 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
        uploadDir:global.path.join(global.appDir,'./public/uploadTemp') //可以填写一个路径，不填写默认为 os.tmpDir()
    },
    enableTypes: ['json', 'form', 'text'],
    extendTypes: {
        text: ['text/xml', 'koalication/xml']
    }
}));

koa.use(json());

//请求日志
koa.use(koaLogger((str)=>{
    // global.logger.setLog({message:str.replace(/\[[0-9]+m/g,"")});
    console.log(str)
}));

//静态文件路径
koa.use(koaStatic(global.path.join(global.appDir,'./public'), {
    index: false,    // 默认为true  访问的文件为index.html  可以修改为别的文件名或者false
    hidden: false,   // 是否同意传输隐藏文件
    defer: true      // 如果为true，则在返回next()之后进行服务，从而允许后续中间件先进行响应
}));

// 发生错误
koa.on("error",(err,ctx)=>{
    // global.logger.errLog(err.message,ctx);
    global.logger.setLog({type:"error",message:err.message,ctx});
});


module.exports = koa;
