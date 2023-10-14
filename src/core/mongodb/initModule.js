const path = require("path");
function initModule(){

}


module.exports = (mongodb,moduleData,parentPath) =>{
    // 如果没有数据库模型则直接退出
    if(!moduleData.mongodb)return;
    //数据库模型路径
    const modelPath = path.join(parentPath,moduleData.mongodb.dirPath);


}