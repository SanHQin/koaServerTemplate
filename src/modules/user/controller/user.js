const router = require("koa-router")();
const userModel = require("../model/user").model;


router.get("/",async ctx=>{
    ctx.body="(*/ω＼*)";
})

router.post("/add",async ctx=>{
    let form = ctx.request.body;
    try{
        await new userModel(form).save()
        ctx.body = {
            code:200,
            data:form
        }
    }catch (e){
        ctx.body = {
            code:500,
            msg:e.message
        }
    }
})





module.exports = router;
