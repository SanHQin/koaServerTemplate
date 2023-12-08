const Template = require('art-template');
const rule = Template.defaults.rules[1];
rule.test = new RegExp(rule.test.source.replace('{{', '<<{').replace('}}', '}>>'));
// Template.defaults.rules.splice(0,1)

class indexVUEg {
    // 表单筛选组件
    elementArray = []
    tableColumn = []
    dataList = []
    //key
    exportKeys = []
    // title
    exportHeader = []
    // 数据转化
    zhuanhua = []
    components = []
    // 组件模板组
    componentsTem={
    }
    go(mod) {
        this.mod = mod
        for (const element in mod.feilds) {
            this.element = element
            this.elementM = mod.feilds[element]
            this.describe = this.elementM.describe
            if (this.describe && this.describe.isShow === false) {
                continue
            }
            // 对象关联
            if (this.elementM.ref) {
                // 一对一
                if (this.elementM.ref) {
                    if (!this.describe.display) {
                        continue
                    }
                }
            } else if (this.elementM instanceof Array) {
                this.elementM = this.elementM[0]
                this.describe = this.elementM.describe
                if (!this.describe.display) {
                    continue
                }
            }
            this.tableColumnItem()
            this.dataListItem()
            this.exportTiaojianItem()
        }
        return this.html()
    }

    tableColumnItem() {
        let element = this.element
        let elementM = this.elementM
        let tableColumnItem = ''
        let mod = this.mod
        let describe = this.describe
        // 对象关联
        if (elementM.ref || elementM instanceof Array) {
            // 一对一
            if (elementM.ref) {
                if (describe.display instanceof Array) {

                    let displayList = ''
                    for (let i = 0; i < describe.display; i++) {
                        displayList += `{{scope.row.${element}.${describe.display[i]}}}`
                    }
                    tableColumnItem = `
            <el-table-column prop="${element}" label="${describe.title}" min-width="100">
                <template v-if="scope.row.${element}" slot-scope="scope">
                    ${displayList}
                </template>
            </el-table-column>
            `
                } else {
                    tableColumnItem = `
            <el-table-column prop="${element}" label="${describe.title}" min-width="100">
                <template v-if="scope.row.${element}" slot-scope="scope">
                {{scope.row.${element}.${describe.display}}}
                </template>
            </el-table-column>
            `
                }

            } else if (mod.feilds[element] instanceof Array) {
                if (describe.display instanceof Array) {
                    let displayList = ''
                    for (let i = 0; i < describe.display.length; i++) {
                        displayList += `{{item.${describe.display[i]}}} `
                    }
                    tableColumnItem = `
                <el-table-column prop="${element}" label="${describe.title}" min-width="100">
                    <template v-if="scope.row.${element}" slot-scope="scope">
                        <div  v-for="(item, index) in scope.row.${element}">
                            ${displayList}
                        </div>
                    </template>
                </el-table-column>
                `
                } else {
                    tableColumnItem = `
            <el-table-column prop="${element}" label="${describe.title}" min-width="100">
                <template v-if="scope.row.${element}" slot-scope="scope">
                    <div  v-for="(item, index) in scope.row.${element}">
                        {{item.${describe.display}}}
                    </div>
                </template>
            </el-table-column>
            `
                }
            }
        } else if (['images-upload'].includes(describe.viewType)) {
            if(elementM.type === Array){
                tableColumnItem = `
            <el-table-column prop="${element}" label="${describe.title}" min-width="100">
              <template slot-scope="{row}">
                
                <div v-if="row.${element}">
                  <el-popover v-for="(item, index) in row.${element}" trigger="hover" placement="top">
                    <el-image :src="item" fit="contain" style="width: 100%;height: 260px;"></el-image>
                    <div slot="reference" class="name-wrapper">
                      <el-image :src="item" fit="contain" style="width: 100%;height: 60px;"></el-image>
                    </div>
                  </el-popover>
                </div>
                <div v-else>
                  <el-tag type="primary" disable-transitions>未上传</el-tag>
                </div>
              </template>
            </el-table-column>
            `
            }else{
                tableColumnItem = `
            <el-table-column prop="${element}" label="${describe.title}" min-width="100">
              <template slot-scope="{row}">
                
                <div v-if="row.${element}">
                  <el-popover trigger="hover" placement="top">
                    <el-image :src="row.${element}" fit="contain" style="width: 100%;height: 260px;"></el-image>
                    <div slot="reference" class="name-wrapper">
                      <el-image :src="row.${element}" fit="contain" style="width: 100%;height: 60px;"></el-image>
                    </div>
                  </el-popover>
                </div>
                <div v-else>
                  <el-tag type="primary" disable-transitions>未上传</el-tag>
                </div>
              </template>
            </el-table-column>
            `
            }
        } else if (['el-input', 'el-input-textarea', 'el-input-number'].includes(describe.viewType) || !describe.viewType) {
            tableColumnItem = `
            <el-table-column sortable prop="${element}" label="${describe.title}" min-width="100"></el-table-column>
            `
        } else if (['el-select', 'el-radio', 'el-switch'].includes(describe.viewType)) {
            tableColumnItem = `
            <el-table-column sortable prop="${element}" label="${describe.title}" min-width="100">
                <template slot-scope="scope">
                {{${element}List[scope.row.${element}]}}
                </template>
            </el-table-column>
            `
        } else if (['vue-json-editor'].includes(describe.viewType)) {
            // tableColumnItem =`
            // <el-table-column prop="${element}" label="${describe.title}" min-width="100" max-height="100">
            //     <template slot-scope="scope">{{scope.row.${element}}}</template>
            // </el-table-column>
            // `
        } else if (['NumberArray'].includes(describe.viewType)) {
            tableColumnItem = `
            <el-table-column prop="${element}" label="${describe.title}" min-width="100">
                <template v-if="scope.row.${element}" slot-scope="scope">{{scope.row.${element}.join(',')}}</template>
            </el-table-column>
            `
        }
        if (tableColumnItem) {
            this.tableColumn.push(tableColumnItem)
        }
    }

    dataListItem() {
        let element =this.element
        let elementM =this.elementM
        let describe = this.describe
        let dataItem = ''
        // 如果
        if (elementM.ref) {
            if (!describe.display) {
                return
            }
            dataItem = `${element}List: []`
        } else if (['el-select'].includes(describe.viewType)) {
            // 选择框处理数据
            dataItem = `${element}List: ${JSON.stringify(describe.data)}`
        } else if (['el-radio'].includes(describe.viewType)) {
            // 单选按钮处理数据
            dataItem = `${element}List: ${JSON.stringify(describe.data)}`
        } else if (['el-switch'].includes(describe.viewType)) {
            // 开关处理数据
            dataItem = `${element}List: ${JSON.stringify(describe.data)}`
        }

        if(dataItem){
            this.dataList.push(dataItem)
        }
    }

    /**
     * 导出设置
     */
    exportTiaojianItem() {
        let element = this.element
        let elementM = this.elementM
        let describe = this.describe
        let zhuanhua = this.zhuanhua
        // 导出设置
        if (['el-select', 'el-radio', 'el-switch'].includes(describe.viewType)) {
            let item =
                `else if (['${element}'].includes(k)) {
            return this.${element}List[item[k]]
          }`
            zhuanhua.push(item)
        } else if (elementM instanceof Array) {

        } else if (describe.display instanceof Array) {
            //   let displayList = []
            //   for (let ix = 0; ix < describe.display.length; ix++) {
            //       displayList.push(`\${itemC.${describe.display[ix]}}`)
            //   }
            //   let item =
            // `else if (['${element}'].includes(k)) {
            //   let itemC = item[k]
            //   if(itemC){
            //     return \`${displayList.join(" ")}\`
            //   }
            // }`
            //   zhuanhua.push(item)
        } else if (describe.display) {
            let item =
                `else if (['${element}'].includes(k)) {
            let itemC = item[k]
            if(itemC){
              return itemC.${describe.display}
            }
          }`
            zhuanhua.push(item)
        }
        this.exportKeys.push(element)
        this.exportHeader.push(describe.title)
    }

    html() {
        let mod = this.mod
        let elementArray = this.elementArray
        let tableColumn = this.tableColumn
        let dataList = this.dataList
        //key
        let exportKeys = [...this.exportKeys, 'created']
        // title
        let exportHeader = [...this.exportHeader, '创建时间']

        // 数据转化
        let zhuanhua = this.zhuanhua
        let src =
            `
<template>
  <div style="padding: 20px;">
    <div>
      <el-form size="mini" label-width="100px" inline>
        ${elementArray.join("")}
        <el-form-item>
          <el-button type="primary" @click="handleAdd" v-if="hasRole('add')">添加</el-button>
          <el-button type="danger" @click="deleteSelect" v-if="hasRole('delete')">批量删除</el-button>
<!--          <el-button type="warning" :loading="exportLoading" @click="handleExport">导出</el-button>-->
          <!--<el-button type="primary" @click="handleImport">导入</el-button>-->
        </el-form-item>
      </el-form>
    </div>
    <el-table @selection-change="handleSelectionChange" max-height="750" :data="list" border size="small" style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="#" type="index" width="50"></el-table-column>
        ${tableColumn.join('')}
      <el-table-column prop="created" label="创建时间" min-width="150">
        <template slot-scope="scope">
          {{ dateFormater('YY-mm-dd HH:MM:SS', scope.row.created) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="90">
        <template slot-scope="scope">
          ${mod.tableRightButton || ''}
          <el-button type="text" size="mini" @click="handleEdit(scope.row)" style="color: #409EFF;">编辑</el-button>
          <el-button type="text" size="mini" @click="handleDelete(scope.row)" style="color: #F56C6C;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-dialog
      title="${mod.text}"
      :visible.sync="dialogVisible"
      width="100%"
      :modal="false"
      @open="openDialog"
      fullscreen>
      <modelForm ref="formRef" @onSubmit="formSubmit" @onCancel="formCancel"></modelForm>
    </el-dialog>
  </div>
</template>

<script>
import modelForm from "./form";

let model = '${mod.text}'
export default {
  name: '${mod.name}List',
  components:{
    modelForm
  },
  props:{
    list:{
      type:Array,
      default(){
        return []
      }
    }
  },
  model:{
    prop:'list'
  },
  data() {
    return {
      dialogVisible: false,
      selectModel: undefined,
      ${this.dataList.join(`,
      `)}<<{if ${this.dataList.length}>0}>>,<<{/if}>>
      listUrl: '/${mod.name}/findPage',
      // 导出
      exportName: this.$route.meta.title || '',
      exportHeader: ${JSON.stringify(exportHeader)},
      exportKeys: ${JSON.stringify(exportKeys)},
      multipleSelection:[]
    }
  },
  methods: {
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    //本模块提交数据
    formSubmit(value){
        if(!this.selectModel){
            this.list.push(value)
            
        }else{
            console.log("this.selectModel==value",this.selectModel==value)
        }
        this.dialogVisible=false
    },
    //本模块数据编辑取消
    formCancel(){
      this.dialogVisible=false
      this.selectModel=undefined
    },
    handleAdd() {
      this.dialogVisible = true
      this.$refs.formRef.clear()
    },
    handleEdit(row) {
      this.dialogVisible=true
      this.selectModel = row
      this.$refs.formRef.setForm(row)
    },
    openDialog(){
      this.$refs.formRef.initListData()
    },
    handleDetail(_id) {
      this.$router.push({
        path: '/${mod.name}/${mod.name}Detail',
        query: {
          _id
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定删除吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let index = this.list.findIndex(v=>v== row)
        console.log("index",index)
        this.list.splice(index,1)
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    // 重造
    deleteSelect() {
       this.$confirm('确定删除吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          let list = [...this.multipleSelection]
          list.map(v=>{
            this.list.splice(this.list.findIndex(v2=>v2==v),1)
          })
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    // 格式化excel数据显示
    formatJson(datas) {
      return datas.map(item =>
        this.exportKeys.map(k => {
          if (k === 'index') {
            return index + 1
          } else if (k === 'sex') {
            return item.sex === 1 ? '男' : item.sex === 0 ? '女' : '未知'
          } else if (k === 'status') {
            return item.status === '1' ? '启用' : item.status === '0' ? '禁用' : ''
          } else if (k === 'created') {
            return this.dateFormater('YY-mm-dd HH:MM:SS', item.created)
          } ${zhuanhua.join('')} else {
            return item[k]
          }
        })
      )
    },
    // 导入
    handleImport() {
      this.$router.push({
        path: \`/${mod.name}/${mod.name}Import\`
      })
    }
  },
  mounted() {
    this.dialogVisible = false
  },
}
</script>

<style lang="scss" scoped>
.block {
  margin-top: 10px;
}
</style>

    `
        return Template.render(src, this, {escape: false});
    }
}

module.exports = indexVUEg
