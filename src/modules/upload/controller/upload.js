const router = require("koa-router")();
const service = require("../service/uploadService")

router.get('/',async ctx=>{
    ctx.body = '(｡･∀･)ﾉﾞ嗨';
})

router.post("/upload",async ctx=>{
    try {
        const file = ctx.request.files.file;
        let fileUrl = null;
        if(!file.length){
            fileUrl = await service.saveFile(file)
        }else{
            fileUrl = [];
            for(let i=0;i<file.length;i++){
                fileUrl.push(await service.saveFile(file[i]))
            }
        }
        ctx.body = {
            code:200,
            data:fileUrl
        }
    } catch (error) {
        ctx.body = {
            code:500,
            msg:error
        }
    }
    
})


module.exports = router;