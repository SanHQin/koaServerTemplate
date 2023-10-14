const fs = require("fs");
function saveFile(file){
    //目前文件路径
    const fileTempPath = file.filepath;
    //新文件名
    const newFileName = file.newFilename;
    //文件类型
    const fileType = file.mimetype;
    //原本文件名
    const oldFileName = file.originalFilename;
    //文件名后缀
    const suffix = oldFileName.split('.').pop();
    //文件路径
    let UrlFilePath = "";
    //判断文件类型是否是图片
    if(fileType.indexOf("image")!==-1){
        UrlFilePath = `file/image/${newFileName}.${suffix}`;
    }else{
        UrlFilePath = `file/other/${newFileName}.${suffix}`;
    }
    fs.renameSync(fileTempPath,`${global.appDir}/public/${UrlFilePath}`);
    return global.host+UrlFilePath;
}

module.exports = {
    saveFile,
}