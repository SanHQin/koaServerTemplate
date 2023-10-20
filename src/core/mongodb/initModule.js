const path = require("path");
const file = require("../../utils/fileTool")


module.exports = (mongodb,moduleData,parentPath) =>{
    // 如果没有数据库模型则直接退出
    if(!moduleData.mongodb)return;
    //数据库模型路径
    const moduleDB = moduleData.mongodb;
    const model = path.join(parentPath,moduleDB.dirPath);
    file.getFileAllInfo(model,async (fileName,filePath)=>{
        const table = require(filePath);
        global.logger.setLog({message:`表：${table.describe.name}`})
    })
}