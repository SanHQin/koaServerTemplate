const router = require("koa-router")();
// const service = require("../service/uploadService")

router.get('/',async ctx=>{
    ctx.body = '(｡･∀･)ﾉﾞ嗨';
})

router.post("/upload",async ctx=>{
    const file = ctx.request.files.file;
    console.log(file)
    ctx.body = {
        code:200,
        data:file
    }
})


module.exports = router;