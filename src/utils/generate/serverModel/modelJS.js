const mongoose = require('mongoose');
const {Schema, Model} = mongoose;
const typeList = {
    'String': String,
    'Number': Number,
    'Boolean': Boolean,
    'Array': Array,
    'Object': Object,
    'Date': Date,
    'Schema.Types.ObjectId': Schema.Types.ObjectId,
}



/**
 * 对象转json字符串
 * @param obj
 */
function jsonParse(obj) {
    let str = []
    // 循环对象
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            str.push(`${key}: '${obj[key]}'`)
        }
        if (typeof obj[key] === 'object') {
            str.push(`${key}: ${jsonParse(obj[key])}`)
        }
    }
    str = `{
    ${str.join(`,
    `)}
}`
    // console.log('str', str)
    return str
}

class ModelJS {
    mod = {}
    sort = {}
    populate = {}
    feilds = {}
    feildsString = ''
    go(mod) {
        this.mod = mod
        // 获取排序规则
        this.getSort()
        // 获取填充字段
        this.getPopulate()
        // 获取字段列表
        this.getFeilds()
        return this.code()
    }
    getSort() {
        if (!this.mod.sorts) {
            return
        }
        for (let item of this.mod.sorts) {
            this.sort[item.key] = Number(item.sortType)
        }
    }
    getPopulate() {
        this.populate = [...this.mod.populates]
    }
    getFeilds() {
        if (!this.mod.feilds) {
            return
        }
        for (let item of this.mod.feilds) {
            let describe = {title: item.title}
            // 可有可无字段
            let keys = ['display', 'describe', 'required', 'data', 'viewType']
            keys.map(v => {
                if (item[v]) {
                    describe[v] = ['required'].includes(v) ? JSON.parse(item[v]) : item[v]
                }
            })

            let feild = {
                type: item.type,
                describe
            }
            // 可有可无字段
            keys = ['ref', 'default']
            keys.map(v => {
                if (item[v]) {
                    feild[v] = item[v]
                }
            })
            this.feilds[item.key] = feild
        }

        // this.feildsString = JSON.stringify(this.feilds)
        this.feildsString = jsonParse(this.feilds)
        console.log('this.feildsString', this.feildsString)
        // TODO 字段的type不能是字符串，所以需要去掉转json字符串之后的引号
        for (let key in typeList) {
            this.feildsString = this.feildsString.replace(new RegExp(`"${key}"`, 'g'), key)
        }
    }
    code() {
        let src = `/**
 * ${this.mod.name}表
 * @type {module:mongoose}
 */
const mongoose = require('mongoose');
const {Schema, Model} = mongoose;
let sort = ${JSON.stringify(this.sort)}
let populate = ${JSON.stringify(this.populate)}
const feilds = ${this.feildsString}
//获取名字
const StringUtil = require('../../../../util/stringUtil');
//获取文件名字
let selfName = StringUtil.getFileName(__filename);
console.log('selfName', selfName)
//自动添加更新时间创建时间:
let schema = new Schema(feilds, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});
let model = mongoose.model(selfName, schema);
let describe ={
    feilds,
    name:selfName,
    text:'${this.mod.name}',
    info:'${this.mod.name}管理'
}
module.exports = {model,describe,feilds,sort,populate}
        `
        return src
    }
}

module.exports = ModelJS
