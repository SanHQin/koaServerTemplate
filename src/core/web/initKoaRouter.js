module.exports = (koa,module,filePath)=> {
    if(!module.controller)return;
    const controllerOption = module.controller;
    const controllerPath = global.path.join(filePath,controllerOption.dirPath,controllerOption.httpPath);
    let route = require(controllerPath);
    const url = `/api/${controllerOption.httpPath}`;
    global.logger.setLog({message:url});
    route.prefix(url);
    koa.use(route.routes()).use(route.allowedMethods());
}
