const fs = require("fs");
async function saveFile(file){
    //目前文件路径
    const fileTempPath = file.filepath;
    //新文件名
    const newFileName = file.newFilename;
    //原本文件名
    const oldFileName = file.originalFilename;
    //文件名后缀
    const suffix = oldFileName.split('.').pop();
    //缓存文件路径
    const newFilePath = global.path.join(global.appDir,global.config.fileDir,`${newFileName}.${suffix}`);
    const fileUrl = `${global.host}${global.config.fileDir.replace('/public/','')}/${newFileName}.${suffix}`;
    await fs.renameSync(fileTempPath,newFilePath);
    return fileUrl;

}

module.exports = {
    saveFile,
}