const file = require("../../utils/fileTool")

module.exports = (koa,module,filePath)=> {
    if(!module.controller)return;
    const controllerOption = module.controller;
    const controllerPath = global.path.join(filePath,controllerOption.dirPath)
    file.getFileAllInfo(controllerPath,(fileName,filePath)=>{
        const route = require(filePath);
        const url = `/api/${fileName.split(".")[0]}`;
        route.prefix(url);
        koa.use(route.routes()).use(route.allowedMethods());
        global.logger.setLog({message:`接口：${url}`});
    })
}
