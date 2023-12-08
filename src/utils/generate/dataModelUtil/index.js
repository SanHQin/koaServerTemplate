
const fs = require('fs');
const path = require('path');
const FileUtils = require('../../../util/FileUtils');
const extendPath = '../../../modules/extend/'
// let exPath = '../../../modulesJson/'
const exPath = path.join(__dirname, extendPath);
/**
 * 获取所有模块
 */
function getAll(path=exPath){
    if (!FileUtils.exist(path)) {
        // 不存在目录直接返回[]
        return []
    }
    let data = fs.readdirSync(path, 'utf-8')
    let dataModel=[]
    for (const key of data) {
        try {
            let item = getItem(key,path)
            if(item){
                dataModel.push(item)
            }
        }catch (e) {
            console.log("失败读取模块：",key)
        }
    }
    return dataModel
}

/**
 * 获取单一模块
 * @param key
 * @returns {*}
 */
function getItem(key,path=exPath){
    let modelPath = path+key+'/model/'+key+'.js'
    if (FileUtils.exist(modelPath)) {
        let item = require(modelPath)
        item.key = key
        return item
    }
}

/**
 * 设置单一模块
 * @param key
 * @returns {*}
 */
async function setItem(key, form){
    if (!FileUtils.exist(exPath+key)) {
        // 不存在目录创建目录
        await FileUtils.mkDirsSync(exPath+key)
    }
    let modelPath = `${exPath}model/${key}.js`
        // exPath+key+'\\'+key+'.json'
    let content = JSON.stringify(form)
    // await FileUtils.writeFile(modelPath, content)
    // write(exPath, key + '.json', content)
}

/**
 * 删除单一模块
 * @param key
 * @returns {*}
 */
async function delItem(key){
    let modelPath = exPath+key+'\\'+key+'.json'
    // 删除文件
    // await FileUtils.unlink(modelPath)
    // 删除目录
    await FileUtils.rmdir(exPath+key)
}


module.exports = {getAll,getItem,setItem,delItem}
