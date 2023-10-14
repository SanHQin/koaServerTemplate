const { getFileAllInfo } = require("../../tools/fileTool");

module.exports = (koa,module,filePath)=> {
    if(!module.controller)return;
    const controllerOption = module.controller;
    const controllerPath = global.path.join(filePath,controllerOption.dirPath,controllerOption.httpPath);
    let route = require(controllerPath);
    const url = `/api/${controllerOption.httpPath}`;
    global.logger.infoLog(url)
    route.prefix(url);
    koa.use(route.routes()).use(route.allowedMethods());
    // koa.use(async (ctx, next) => {
    //     console.log("这是做什么的")
    //     // console.log('ctx.header.company', ctx.header.company)
    //     // console.log('ctx.request.body', ctx.request.body)
    //     // 填充公司字段
    //     if (ctx.header.company) {
    //         if (ctx.request.body.form) {
    //             ctx.request.body.form.company = ctx.header.company
    //         } else {
    //             ctx.request.body.company = ctx.header.company
    //         }
    //     }
    //     await next()
    //
    // })
}
