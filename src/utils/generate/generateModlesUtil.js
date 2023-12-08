const fs = require('fs');
const path = require('path');
const FileUtils = require('../FileUtils');
const indexVUEg = require('./indexVUEg');
const formTableVUEg = require('./formTableVUEg');
let addVUEg = require('./addVUEg');
let formVUEg = require('./formVUEg');
let importVUEg = require('./importVUEg');
const toRouter = require('./toRouter');

// 不包含列表
let gitignore = [
    'productType', 'product', 'user', 'order', 'address', 'supplier', 'delivery', 'seller',
    'productionTask', // 制作任务
    'juji', // 剧集
    'manju', // 漫剧
    'jingtou', // 镜头
    'koubutu', // 抠补图
]
// 包含列表
let join = [
    'updateLog', // 更新日志
]

// 包含列表
let routerJoin = [
    'updateLog', // 更新日志
]

// let join = ['formCreateDesigner']
// let join = ['card', 'cardUpgradeRule', 'cardUpgrade']
// let join = ['characterSkillEffect']

// let fileUrl = '../../modules/extend'
let extendPathName = `\\\\extend`
let extendPathc = '/extend'
// let extendPathName = ''
// let extendPathc = ''
let fileUrl = '..\\..\\modules'+extendPathc
/**
 * 生成模板文件
 */
function gTemplate(joinList, filePath) {
    let extendPath = path.join(__dirname, fileUrl);
    // console.log("abcpath", extendPath)

    let data = fs.readdirSync(extendPath, 'utf-8')

    console.log('data', data)
    for (const key of data) {
        let modelPath = `${extendPath}\\${key}\\model\\${key}.js`
        // 不包含
        if (gitignore.findIndex(v => v === key) > -1) {
            continue
        }
        // 包含
        if(joinList&&joinList.length>0){
            if (joinList.findIndex(v => v === key) <0) {
                continue
            }
        }
        try {
            // let a = fs.readFileSync(modelPath,'utf-8')

            let mod = require(modelPath).describe;

            let indexVUEgModel = new indexVUEg()
            let index = indexVUEgModel.go(mod)
            write(`${filePath}\\${key}`, `index.vue`, index)

            let formTableVUEgModel = new formTableVUEg()
            let formTableVUEgHtml = formTableVUEgModel.go(mod)
            write(`${filePath}\\${key}`, `formTable.vue`, formTableVUEgHtml)



            let addVUEgModel = new addVUEg()
            let add = addVUEgModel.go(mod)
            write(`${filePath}\\${key}`, `add.vue`, add)

            let formVUEgModel = new formVUEg()
            let form = formVUEgModel.go(mod)
            write(`${filePath}\\${key}`, `form.vue`, form)

            let importVUEgModel = new importVUEg()
            let importVUE = importVUEgModel.go(mod)
            write(`${filePath}\\${key}`, `import.vue`, importVUE)

        } catch (e) {
            console.log(`页面【${key}】写入失败`, e)
            return {
                code: 500,
                msg: `页面【${key}】写入失败`
            }
        }
    }
    return {code: 200}
}



function write(filePath, fileName, content) {
    // console.log('本地路径', path.resolve('.') + filePath)
    let serverFileDir = path.resolve('.') + filePath
    let serverFilePath = serverFileDir + "\\" + fileName
    //如果存在会直接覆盖
    FileUtils.mkDirsSync(serverFileDir)
    FileUtils.writeFile(serverFilePath, content)

    console.log("已写入文件", serverFilePath)
}

// 部署项目时需要注释掉
// 新建项目、二次开发都要
// gTemplate(join, '\\..\\..\\..\\..\\building-admin\\src\\views\\extend')
// // 新建项目用上面的，二次开发用下面的
// toRouter(fileUrl,routerJoin,gitignore,extendPathc, '\\..\\..\\..\\..\\building-admin')
// toRouter(fileUrl,routerJoin,gitignore,extendPathc, '\\..\\..\\..\\..\\building-admin\\src\\router')


module.exports = {
    gTemplate,
    toRouter
}
