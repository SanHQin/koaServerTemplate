const log4js = require('log4js')

log4js.configure({
    replaceConsole: true,
    pm2: true,
    appenders: {
        console: {//控制台输出
            type: 'console'
        },
        info:{ //默认信息
            type:"dateFile",    //指定日志文件按时间打印
            filename:"logs/info",//指定输出文件路径
            pattern:"log",
            alwaysIncludePattern:true
        },
        req: {  //请求转发日志
            type: 'dateFile',    //指定日志文件按时间打印
            filename: "logs/req",  //指定输出文件路径
            pattern: 'log',
            alwaysIncludePattern: true
        },
        err: {  //错误日志
            type: 'dateFile',
            filename: "logs/err",
            pattern: 'log',
            alwaysIncludePattern: true
        },
    },
    categories: {
        default:{ appenders:["console","info"],level:"info"},
        info:{ appenders:["console","info"],level:"info"},
        req:{ appenders:["console","req"],level:"debug"},
        error: { appenders: ['console', 'err'], level: 'error' },
    }
});
function getLogger(name) {//name取categories项
    return log4js.getLogger(name || 'default')
}

function infoLog(message){
    getLogger("info").info(message);
}

function errLog(message){
    getLogger("error").error(message)
}

function reqLog(message){
    getLogger("req").info(message)
}

module.exports = {
    infoLog,
    errLog,
    reqLog
}
