class ControllerJS {
    mod = {}
    go(mod) {
        this.mod = mod

        return this.code()
    }
    code() {
        let src = `const router = require('koa-router')();
//获取文件名字
let selfName = StringUtil.getFileName(__filename);
const ModelClass = require('../model/'+selfName);
// 获取需要加载的对象
let sort = ModelClass.sort
let populate = StringUtil.getPopulate(ModelClass)
const Model = ModelClass.model;
const User = require('../../../user/model/user').model;
// router.prefix('/msg')

router.get('/', function (ctx, next) {
    ctx.body = 'this is a response!'
});

router.post('/add', async function (ctx, next) {
    let form = ctx.request.body;
    try {
        let model = new Model(form);
        const result = await model.save();
        ctx.body = {
            code: 200,
            data: result
        }
    } catch (e) {
        console.log('添加失败', e);
        ctx.body = {
            code: 500,
            msg: '添加失败'
        }
    }
});
router.post('/find', async function (ctx, next) {
    let form = ctx.request.body;
    try {
        if (ctx.header.token) {
            let user = await User.findOne({token: ctx.header.token});
            if (user) {
                form.user = user._id
            }
        }
        const result = await Model.find(form).sort(sort).populate(populate);
        // console.log('result', result)
        ctx.body = {
            code: 200,
            data: result
        }
    } catch (e) {
        console.log('查询失败', e)
        ctx.body = {
            code: 500,
            msg: '查询失败'
        }
    }
});

router.post('/findPage', async function (ctx, next) {
    const {pageNum = 0, pageSize = 10} = ctx.request.body.page;
    let {nickName, settleStartDate, settleEndDate, startDate, endDate, ...form} = ctx.request.body.form;
    for (let i in form) {
        if (form[i] === '') {
            delete form[i]
        }
    }
    try {
        if (ctx.header.token) {
            let user = await User.findOne({token: ctx.header.token});
            if (user) {
                form.user = user._id
            }
        }
        if (nickName) {
            let user = await User.findOne({nickName: new RegExp(nickName)}, {_id: 1});
            console.log('user', user);
            if (user) {
                form.user = user._id
            }
        }
        // 按时间区间查询
        if (settleStartDate && settleEndDate) {
            settleStartDate = typeof settleStartDate === 'object' ? settleStartDate : new Date(settleStartDate);
            settleEndDate = typeof settleEndDate === 'object' ? settleEndDate : new Date(settleEndDate);
            form.created = {$gte: settleStartDate, $lt: settleEndDate}
        }
        // 按时间区间查询
        if (startDate && endDate) {
            startDate = typeof startDate === 'object' ? startDate : new Date(startDate);
            endDate = typeof endDate === 'object' ? endDate : new Date(endDate);
            form.created = {$gte: startDate, $lt: endDate}
        }
        console.log('form', form);
        let total = await Model.find(form).count('total');
        let result = await Model.find(form).sort(sort).populate(populate).limit(pageSize).skip(pageNum * pageSize);
        ctx.body = {
            code: 200,
            data: {
                list: result,
                total
            }
        }
    } catch (e) {
        console.log('查询失败', e)
        ctx.body = {
            code: 500,
            msg: '查询失败'
        }
    }
});



router.post('/findOne', async function (ctx, next) {
    const form = ctx.request.body;
    try {
        const result = await Model.findOne(form);
        ctx.body = {
            data: result,
            code: 200
        }
    } catch (e) {
        console.log('查询失败', e)
        ctx.body = {
            code: 500,
            msg: '查询失败'
        }
    }
});

router.post('/update', async function (ctx, next) {
    console.log(ctx.request.body)
    const {_id, ...form} = ctx.request.body
    if (!_id) {
        return ctx.body = {
            code: 500,
            msg: '_id不能为空'
        }
    }
    try {
        await Model.updateOne({_id}, form)
        ctx.body = {
            code: 200
        }
    } catch (e) {
        console.log('修改失败', e)
        ctx.body = {
            code: 500,
            msg: '修改失败'
        }
    }
})

router.post('/delete', async function (ctx, next) {
    let {_id} = ctx.request.body
    try {
        let res = await Model.remove({_id})
        console.log('res', res)
        ctx.body = {
            code: 200
        }
    } catch (e) {
        console.log('删除失败', e)
        ctx.body = {
            code: 500,
            msg: '删除失败'
        }
    }
})

// 按某字段分组统计金额
router.post('/groupBy', async function (ctx, next) {
    const {key, ...form} = ctx.request.body
    try {
        if (form.user) {
            form.user = require('mongoose').Types.ObjectId(form.user)
        }
        let result = await Model.aggregate([
            {
                $match: form
            },
            {
                $group: {
                    _id: key,
                    sum: {$sum: '$value'}
                }
            }
        ])
        ctx.body = {
            code: 200,
            data: result
        }
    } catch (e) {
        console.log('查询失败', e)
        ctx.body = {
            code: 500,
            msg: '查询失败'
        }
    }
})


router.post('/deleteSelect', async function (ctx, next) {
    let _ids = ctx.request.body
    try {
        let res = await Model.remove({_id:_ids})
        console.log('res', res)
        ctx.body = {
            code: 200
        }
    } catch (e) {
        console.log('删除失败', e)
        ctx.body = {
            code: 500,
            msg: '删除失败'
        }
    }
})



module.exports = router;


/**
 * 以下为二次开发代码
 */


router.post('/findPage2', async function (ctx, next) {
    const {pageNum = 0, pageSize = 10} = ctx.request.body.page;
    let {nickName, settleStartDate, settleEndDate, startDate, endDate, ...form} = ctx.request.body.form;
    for (let i in form) {
        if (form[i] === '') {
            delete form[i]
        }
    }
    try {
        if (nickName) {
            let user = await User.findOne({nickName: new RegExp(nickName)}, {_id: 1});
            console.log('user', user);
            if (user) {
                form.user = user._id
            }
        }
        // 按时间区间查询
        if (settleStartDate && settleEndDate) {
            settleStartDate = typeof settleStartDate === 'object' ? settleStartDate : new Date(settleStartDate);
            settleEndDate = typeof settleEndDate === 'object' ? settleEndDate : new Date(settleEndDate);
            form.created = {$gte: settleStartDate, $lt: settleEndDate}
        }
        // 按时间区间查询
        if (startDate && endDate) {
            startDate = typeof startDate === 'object' ? startDate : new Date(startDate);
            endDate = typeof endDate === 'object' ? endDate : new Date(endDate);
            form.created = {$gte: startDate, $lt: endDate}
        }
        console.log('form', form);
        let total = await Model.find(form).count('total');
        let result = await Model.find(form).sort(sort).populate(populate).limit(pageSize).skip(pageNum * pageSize);
        ctx.body = {
            code: 200,
            data: {
                list: result,
                total
            }
        }
    } catch (e) {
        console.log('查询失败', e)
        ctx.body = {
            code: 500,
            msg: '查询失败'
        }
    }
});
        `
        return src
    }
}

module.exports = ControllerJS