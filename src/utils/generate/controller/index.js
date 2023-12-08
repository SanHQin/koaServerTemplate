const xlsx = require('node-xlsx');
const fs = require('fs');
const path = require('path');

const FileUtils = require('../../FileUtils');

// Parse a buffer
// const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`${__dirname}/controller.xlsx`));
// Parse a file
const workSheetsFromFile = xlsx.parse(`${__dirname}/controller.xlsx`);

// console.log("workSheetsFromFile",workSheetsFromFile)
// for (let i = 0; i < workSheetsFromFile.length; i++) {
//     console.log("workSheetsFromFile[i]",workSheetsFromFile[i])
// }

let data1 = workSheetsFromFile[0].data;
console.log("workSheetsFromFile[0].data",data1)

let tem = new Date().getTime()

let arrays = []
//从第2行开始循环
for (let i = 1; i < data1.length; i++) {
    let data = {
        project : data1[i][0],
        module : data1[i][1],
        fileName : data1[i][2],
        url : data1[i][3],
        remark : data1[i][4],
        add : data1[i][5],
    }
    arrays.push(data)
}

let data = {}
for (let i = 0; i < arrays.length; i++) {
    let fileP = data[arrays[i].project]
    if (!fileP){
        data[arrays[i].project] = {}
    }
    let fileM =data[arrays[i].project][arrays[i].module]
    if (!fileM){
        data[arrays[i].project][arrays[i].module] ={}
    }
    let fileF =data[arrays[i].project][arrays[i].module][arrays[i].fileName]
    if (!fileF){
        data[arrays[i].project][arrays[i].module][arrays[i].fileName] = []
    }
    data[arrays[i].project][arrays[i].module][arrays[i].fileName].push(arrays[i])
}
createController(data)
function createController(data){

    for (const key1 in data) {
        for (const key2 in data[key1]) {
            for (const key3 in data[key1][key2]) {
                createFile(key1,key2,key3,data[key1][key2][key3])
            }
        }
    }
    function createFile(project,module,fileName,data){
        console.log("data",data)
        console.log("__dirname",__dirname)
        let optionalParams = path.join(__dirname,`../../../modules/${project}/${module}/controller/`)
        let filePath = optionalParams+`${fileName}.js`
        let fileHtml=`
const router = require('koa-router')()
let Model = require("../model/${module}.js").model;

module.exports = router
        `
        if(FileUtils.exist(filePath)){
            fileHtml = FileUtils.readFile(filePath)
        }
        //如果存在会直接覆盖
        FileUtils.mkDirsSync(optionalParams)

        let jsList = []
        for (let i = 0; i < data.length; i++) {
            let {url,remark} = data[i]
            let item = `
 /**
 * ${remark}
 * 批次:${tem}
 **/
router.post('/${url}', function (ctx, next) {
   ctx.body = '${remark}'
})
            `
            jsList.push(item)
        }
        let jsAll=` 
${fileHtml}
${jsList.join(" ")}

`
        FileUtils.writeFile(filePath, jsAll)

        // console.log("path.resolve('.')",optionalParams)
    }
}


