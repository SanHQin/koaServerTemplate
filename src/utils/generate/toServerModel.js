const fs = require('fs');
const path = require('path');
const FileUtils = require('../FileUtils');
const ControllerJS = require("./serverModel/controllerJS");
const ModelJS = require("./serverModel/modelJS");
const ServiceJS = require("./serverModel/serviceJS");
const ModuleJS = require("./serverModel/moduleJS");



let filePath = '\\src\\modules\\extend'

module.exports = function toServerModel(mods) {
    for (const mod of mods) {
        try {

            let controllerJS = new ControllerJS()
            let controllerContent = controllerJS.go(mod)
            write(`${filePath}\\${mod.key}\\controller`, `${mod.key}.js`, controllerContent)

            let modelJS = new ModelJS()
            let modelContent = modelJS.go(mod)
            write(`${filePath}\\${mod.key}\\model`, `${mod.key}.js`, modelContent)

            let serviceJS = new ServiceJS()
            let serviceContent = serviceJS.go(mod)
            write(`${filePath}\\${mod.key}\\service`, `${mod.key}.js`, serviceContent)

            let moduleJS = new ModuleJS()
            let moduleContent = moduleJS.go(mod)
            write(`${filePath}\\${mod.key}`, `module.js`, moduleContent)

        } catch (e) {
            console.log(`model【${mod.key}】写入失败`, e)
            return {
                code: 500,
                msg: `model【${mod.key}】写入失败`
            }
        }
    }
    return {code: 200}
}

// 文件存在覆盖
function write(filePath, fileName, content) {
    // console.log('本地路径', path.resolve('.') + filePath)
    let serverFileDir = path.resolve('.') + filePath
    let serverFilePath = serverFileDir + "\\" + fileName
    //如果存在会直接覆盖
    FileUtils.mkDirsSync(serverFileDir)
    FileUtils.writeFile(serverFilePath, content)

    console.log("已写入文件", serverFilePath)
}

// 文件存在不覆盖
function writeUnCover(filePath, fileName, content) {
    // console.log('本地路径', path.resolve('.') + filePath)
    let serverFileDir = path.resolve('.') + filePath
    let serverFilePath = serverFileDir + "\\" + fileName
    //如果存在会直接覆盖
    FileUtils.mkDirsSync(serverFileDir)
    if(!FileUtils.exist(serverFilePath)){
        FileUtils.writeFile(serverFilePath, content)

        console.log("文件已存在", serverFilePath)
    }
}
