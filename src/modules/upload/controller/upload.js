const router = require("koa-router")();
const service = require("../service/uploadService")

router.post("/",async ctx=>{
    ctx.body = "(*/ω＼*)";
})

router.post("/upload",async ctx=>{
    const file = ctx.request.files.file;
    let filePath;
    if(file.length){//多个文件
        console.log("多个文件")
    }else{//单个文件
        filePath = service.saveFile(file)
    }
    console.log(filePath)
    ctx.body = {
        code:200,
        data:filePath
    }
})


module.exports = router;