//项目路径
global.appDir = __dirname;

//日志配置
global.logger = require('./src/utils/log4JS')

//path路径
global.path = require("path");

//初始化系统
const app = require("./src/core/initSystem");

module.exports = app;