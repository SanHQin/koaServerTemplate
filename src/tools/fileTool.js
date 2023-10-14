const fs = require("fs");
const path = require("path");

function getFileAllInfo(filePath,callback){
    if(fs.statSync(filePath).isDirectory()){
        fs.readdirSync(filePath).forEach(i=>getFileAllInfo(path.join(filePath,i),callback));
    }else{
        callback(path.basename(filePath),filePath,path.dirname(filePath));
    }
}


module.exports = {
    getFileAllInfo,
};