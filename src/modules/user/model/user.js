const mongoose = require('mongoose');
const {Schema} = mongoose;
/**
 * 用户表
 *
 */

const fields = {
    name:{
        type:String,
        describe:{
            title:"用户名",
        }
    },
    phone:{
        type:String,
        describe:{
            title:"手机号"
        }
    },
    sex:{
        type:String,
        default:"1",
        describe:{
            title:"性别",
            data:{
                "0":"女",
                "1":"男"
            }
        }
    },
    invite:{
        type:Schema.Types.ObjectId || null,
        ref:"invite",
        default: null,
        describe:{
            title:"邀请人Id",
        }

    }
}


//获取文件名字
let selfName = global.path.basename(__filename).split(".")[0]
//自动添加更新时间创建时间:
let schema = new Schema(fields, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});

let model = mongoose.model(selfName, schema);
let describe ={
    fields,
    name:selfName,
    text:'用户',
    info:'用户管理'
}
module.exports = {model,describe,fields}