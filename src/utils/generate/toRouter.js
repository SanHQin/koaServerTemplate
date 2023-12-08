const fs = require('fs');
const path = require('path');
const FileUtils = require('../FileUtils');

let cunzai={
    characterCard:`{
    path: '/characterCard',
    component: Layout,
    meta: { title: '玩家卡牌管理', icon: 'admin' },
    alwaysShow: false,
    redirect: '/characterCard/characterCard',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/extend/characterCard/index'),
        meta: { title: '玩家卡牌列表', icon: 'user' }
      },
      {
        path: 'add',
        name: 'add',
        component: () => import('@/views/extend/characterCard/add'),
        meta: { title: '添加玩家卡牌', icon: 'user' },
        hidden: true
      },
      {
        path: 'up',
        name: 'up',
        component: () => import('@/views/extend/characterCard/up'),
        meta: { title: '英雄升级', icon: 'user' },
        hidden: true
      }
    ]
  }`,
  characterGroupBattle:`{
    path: '/characterGroupBattle',
    component: Layout,
    meta: { title: '对战管理', icon: 'admin' },
    alwaysShow: false,
    redirect: '/characterGroupBattle/characterGroupBattle',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/extend/characterGroupBattle/index'),
        meta: { title: '对战列表', icon: 'user' }
      },
      {
        path: 'add',
        name: 'add',
        component: () => import('@/views/extend/characterGroupBattle/add'),
        meta: { title: '添加对战', icon: 'user' },
        hidden: true
      },
      {
        path: 'battle',
        name: 'battle',
        component: () => import('@/views/extend/characterGroupBattle/battle'),
        meta: { title: '对战', icon: 'user' },
        hidden: true
      }
    ]
  }`,
    characterGroupUser:`{
      path: '/characterGroupUser',
      component: Layout,
      meta: { title: '玩家战队管理', icon: 'admin' },
      alwaysShow: false,
      redirect: '/characterGroupUser/index',
      children: [
        {
            path: 'index',
            name: 'index',
            component: () => import('@/views/extend/characterGroupUser/index'),
            meta: { title: '玩家战队列表', icon: 'user' }
        },
        {
            path: 'add',
            name: 'add',
            component: () => import('@/views/extend/characterGroupUser/add'),
            meta: { title: '添加玩家战队', icon: 'user' },
            hidden: true
        },
        {
            path: 'autoBattle',
            name: 'autoBattle',
            component: () => import('@/views/extend/characterGroupUser/autoBattle'),
            meta: { title: '自动匹配', icon: 'user' },
            hidden: true
        }
      ]
    }`
}

module.exports =function toRouter(fileUrl,join,gitignore,extendPathc, filePath) {
    let extendPath = path.join(__dirname, fileUrl);

    let data=[]
    // 包含
    if(join){
        data = join
    }else{
        data = fs.readdirSync(extendPath, 'utf-8')
    }

    let fieldList = []
    for (const key of data) {
        let modelPath = `${extendPath}\\${key}\\model\\${key}.js`
        if (gitignore.findIndex(v => v === key) > -1) {
            continue
        }
        try {
            // let a = fs.readFileSync(modelPath,'utf-8')

            let mod = require(modelPath).describe;
            // console.log("a", mod)
            let fileName = `${key}.js`
            console.log("fileName", fileName)

            let sr = cunzai[key]

            if(!sr){

                let childern = getModRouterChildren(mod,key)
                sr = `
{
    path: '/${key}',
    component: Layout,
    meta: { title: '${mod.info}', icon: 'example' },
    alwaysShow: false,
    redirect: '/${key}/${key}',
    children: [
      {
        path: '${key}',
        name: '${key}',
        component: () => import('@/views${extendPathc}/${key}/index'),
        meta: { title: '${mod.text}列表', icon: 'example' },
        children: [
          {path: 'add', meta: {title: '添加'}, hidden: true, isBtn: true},
          {path: 'import', meta: {title: '导入'}, hidden: true, isBtn: true},
          {path: 'export', meta: {title: '导出'}, hidden: true, isBtn: true},
          {path: 'detail', meta: {title: '详情'}, hidden: true, isBtn: true},
          {path: 'edit', meta: {title: '编辑'}, hidden: true, isBtn: true},
          {path: 'delete', meta: {title: '删除'}, hidden: true, isBtn: true}
        ]
      },
      {
        path: '${key}Add',
        name: '${key}Add',
        component: () => import('@/views${extendPathc}/${key}/add'),
        meta: { title: '添加${mod.text}', icon: 'example' },
        hidden: true
      },
      {
        path: '${key}Detail',
        name: '${key}Detail',
        component: () => import('@/views${extendPathc}/${key}/add'),
        meta: { title: '${mod.text}详情', icon: 'example' },
        hidden: true
      },
      {
        path: '${key}Import',
        name: '${key}Import',
        component: () => import('@/views${extendPathc}/${key}/import'),
        meta: { title: '导入${mod.text}', icon: 'example' },
        hidden: true
      },
    ${childern}]
  }`
            }
            fieldList.push(sr)
        } catch (e) {
            console.log(`路由【${key}】写入失败`, e)
            return {
                code: 500,
                msg: `路由【${key}】写入失败`
            }
        }
    }
    let rout =
        `
import Layout from '@/layout'
const iviewRouter = [
    ${fieldList.join(",")}
]
export default iviewRouter
        `

    // write("\\workspace\\子曰动漫管理系统\\building-admin\\src\\router\\",'erpRouter.js',rout)
    // write(`${filePath}\\`,'extendRouter1.js',rout)

    // 二次开发时使用：生成后，手动复制路由，粘贴到对应的地方。
    write(`${filePath}\\src\\router\\`,'extendRouter1.js',rout)

    return {code: 200}
}

function write(filePath, fileName, content) {
    // console.log('本地路径', path.resolve('.') + filePath)
    let serverFileDir = path.resolve('.') + filePath
    let serverFilePath = serverFileDir + "\\" + fileName
    //如果存在会直接覆盖
    FileUtils.mkDirsSync(serverFileDir)
    FileUtils.writeFile(serverFilePath, content)

    console.log("已写入文件", serverFilePath)
}

//文件存在不覆盖
function writeUnCover(filePath, fileName, content) {
    // console.log('本地路径', path.resolve('.') + filePath)
    let serverFileDir = path.resolve('.') + filePath
    let serverFilePath = serverFileDir + "\\" + fileName
    //如果存在会直接覆盖
    FileUtils.mkDirsSync(serverFileDir)
    if(!FileUtils.exist(serverFilePath)){
        FileUtils.writeFile(serverFilePath, content)
    }
}
let routerChildrenTem = `
    <template>
    <div>
      12
    </div>
</template>

<script>
  export default {
    name: 'test'
  }
</script>

<style scoped>

</style>
`
/**
 * 获取模块子路由
 */
function getModRouterChildren(mod,key) {
    let rs = ''

    if(mod.indexRouterButton){
        for (let i = 0; i <mod.indexRouterButton.length; i++) {
            let chr = mod.indexRouterButton[i]
            writeUnCover(`\\..\\..\\..\\..\\..\\building-admin\\src\\views\\extend\\${key}`,chr.path+'.vue',routerChildrenTem)
        rs+=`
        {
            path: '${chr.path}',
            name: '${chr.path}',
            component: () => import('@/views/extend/${key}/${chr.path}'),
            meta: { title: '${chr.text}', icon: 'user' }
        },`
        }
    }

    return rs
}
