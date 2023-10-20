const logger = global.logger;
//获取系统开始加载时间戳
const starTime = new Date().getTime();
logger.setLog({message:"系统开始加载...(～﹃～)~zZ"})

//加载koa框架
const koa = require("./web/initKoa");
//初始化接口
const initKoaRouter = require("./web/initKoaRouter")
//连接数据库
const mongodb = require("./mongodb/initMongodb");
//初始化数据库表
const initModule = require('./mongodb/initModule')
//文件工具
const { getFileAllInfo } = require("../utils/fileTool");

mongodb(global.config.mongoDB,(db)=>{
    logger.setLog({message:"mongodb数据库连接成功! \\^o^/"})
    //modules文件路径
    let modulePath = global.path.join(global.appDir,'/src/modules');
    getFileAllInfo(modulePath,(fileName,filePath,parentPath)=>{
        if(fileName==="module.js"){
            const module = require(filePath);
            if(module) {
                //初始化http接口
                initKoaRouter(koa, module, parentPath);
                //初始化表
                initModule(db,module,parentPath);
            }
        }
    })
    logger.setLog({message:`路由与数据库加载完成！ ✧(≖ ◡ ≖✿) 耗时：${new Date().getTime() - starTime}ms`})
})

module.exports = koa;


