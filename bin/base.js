const app = require('../app');

const os = require("os");

const http = require("http");

// 获取本机的IP地址
function getIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iFace = interfaces[devName];
        for (let i = 0; i < iFace.length; i++) {
            const alias = iFace[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
// 检查端口号
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

//端口号
const PORT = normalizePort(process.env.PORT || "2004");

//主机地址
const myHost = global.config.host || getIPAddress();

const server = http.createServer(app.koa.callback());



const localhostUrl = `http://localhost:${PORT}/`;
const hostUrl = `http://${myHost}:${PORT}/`;

global.host = hostUrl;

//开启服务器
server.listen(PORT,(err) =>{
    if(err)return global.logger.setLog({type:"error",message:err});
    // global.logger.infoLog(`系统已启动 :${localhostUrl} or ${hostUrl} ╰(￣ω￣ｏ)`);
    global.logger.setLog({message:`系统已启动 :${localhostUrl} or ${hostUrl} ╰(￣ω￣ｏ)`})
});

