class ServiceJS {
    mod = {}
    go(mod) {
        this.mod = mod

        return this.code()
    }
    code() {
        let src = `const log = global.logger
//获取文件名字
let selfName = StringUtil.getFileName(__filename);
const Model = require('../model/'+selfName).model;


class ${this.mod.key} {
    constructor() {
    }
    delete(){

    }
}

let service = new ${this.mod.key}()
module.exports = service;
        `
        return src
    }
}

module.exports = ServiceJS