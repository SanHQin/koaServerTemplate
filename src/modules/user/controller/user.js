const router = require("koa-router")();


router.get("/",async (ctx,next)=>{
    ctx.body="(*/ω＼*)";
})

router.get("/test",async ctx=>{
    let form =  ctx.query;
    ctx.body = {
        code:200,
        msg:"这是个测试GET",
        data:form
    }
})

router.post("/test2",async ctx=>{
    // console.log(ctx.request)
    let form = ctx.request.body;
    ctx.body={
        code:200,
        msg:"这是个测试POST",
        data:form
    }
})



module.exports = router;
