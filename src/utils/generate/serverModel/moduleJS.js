class ModuleJS {
    mod = {}
    go(mod) {
        this.mod = mod

        return this.code()
    }
    code() {
        let src = `module.exports = {
    controllers: {
        httpPath: "${this.mod.key}",
        dirPath: "controller"
    },
    mongodb: {
        modelPath: "model",
        initDataPath: "model/initData"
    }
}
        `
        return src
    }
}

module.exports = ModuleJS