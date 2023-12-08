const Template = require('art-template');
const rule = Template.defaults.rules[1];
rule.test = new RegExp(rule.test.source.replace('{{', '<<{').replace('}}', '}>>'));

class indexVUEg {
    elementArray = []
    tableColumn = []
    dataList = []
    //key
    exportKeys = ['_id']
    // title
    exportHeader = ['_id']
    // 数据转化
    zhuanhua = []
    mountedList = []
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
            this.elementArrayItem()
            this.tableColumnItem()
            // this.dataListItem()
            this.exportTiaojianItem()
            this.getMountedItem()

            this.getDataItem()
        }
        return this.html()
    }
    /**
     * 获取data列表数据,选项数组
     * @param mod
     */
    getDataItem(elementM=this.elementM,describe=this.describe,mod=this.mod){
        let element = this.element
        let dataItem =''
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
    elementArrayItem() {
        let describe = this.describe
        let element = this.element
        let formItem = ''
        // 对象关联
        if (this.elementM.ref) {
            formItem = `
            <el-form-item label="${describe.title}">
              <el-select v-model="form.${element}" placeholder="选择${describe.title}" style="width: 150px;">
                <el-option label="全部" :value="''"></el-option>
                <el-option v-for="(item, index) in ${element}List" :key="index" :label="item.${describe.display}" :value="item._id"></el-option>
              </el-select>
            </el-form-item>
            `
        }else if (['el-input', 'el-input-textarea', 'el-input-number'].includes(describe.viewType) || !describe.viewType) {
            // 普通输入框
            formItem = `
            <el-form-item label="${describe.title}">
              <el-input type="text" v-model="form.${element}" clearable style="width: 150px;"></el-input>
            </el-form-item>
            `
        } else if (['el-select', 'el-radio', 'el-switch'].includes(describe.viewType)) {
            formItem = `
            <el-form-item label="${describe.title}">
              <el-select v-model="form.${element}" placeholder="选择${describe.title}" style="width: 150px;">
                <el-option label="全部" :value="''"></el-option>
                <el-option v-for="(item, index) in ${element}List" :key="index" :label="item" :value="index"></el-option>
              </el-select>
            </el-form-item>
            `
        } else if (['NumberArray'].includes(describe.viewType)) {
            // 普通输入框
            formItem = `
            <el-form-item label="${describe.title}">
              <el-input type="text" v-model="form.${element}" clearable style="width: 150px;"></el-input>
            </el-form-item>
            `
        }

        if (formItem) {
            this.elementArray.push(formItem)
        }
    }

    getMountedItem(mountedList=this.mountedList,elementM=this.elementM,describe=this.describe,mod=this.mod){
        let element = this.element
        if (elementM.ref) {
            if (!describe.display) {
                return
            }
            let multiple = (mod.feilds[element] instanceof Array) ? 'multiple' : ''
            let displayString = `{{item.${describe.display}}}`
            let displayLabel = describe.display
            if (describe.display instanceof Array) {
                displayString = ''
                displayLabel = describe.display[0]
                for (let i = 0; i < describe.display.length; i++) {
                    displayString += `{{item.${describe.display[i]}}} `
                }
            }
            // 添加请求
            mountedList.push(`
            this.$http.post('/${elementM.ref}/find', { }).then(res => {
              if (res.code === 200) {
                this.${element}List = res.data || []
              }
            })
          `)
        }
    }
    //表格列表
    tableColumnItem() {
        let element = this.element
        let elementM = this.elementM
        let tableColumnItem = ''
        let mod = this.mod
        let describe = this.describe
// 对象关联
        if (elementM.ref || describe.ref) {
            if (mod.feilds[element] instanceof Array) {
                if (describe.display instanceof Array) {
                    let displayList = ''
                    for (let i = 0; i < describe.display.length; i++) {
                        displayList += `{{item.${describe.display[i]}}} `
                    }
                    tableColumnItem = `
                <el-table-column prop="${element}" label="${describe.title}" min-width="100">
                    <template slot-scope="scope" v-if="scope.row.${element}">
                        <div  v-for="(item, index) in scope.row.${element}">
                            ${displayList}
                        </div>
                    </template>
                </el-table-column>
                `
                } else {
                    tableColumnItem = `
            <el-table-column prop="${element}" label="${describe.title}" min-width="100">
                <template slot-scope="scope" v-if="scope.row.${element}">
                    <div  v-for="(item, index) in scope.row.${element}">
                        {{item.${describe.display}}}
                    </div>
                </template>
            </el-table-column>
            `
                }
                // 一对一
            }else {
                if (describe.display instanceof Array) {

                    let displayList = ''
                    for (let i = 0; i < describe.display; i++) {
                        displayList += `{{scope.row.${element}.${describe.display[i]}}}`
                    }
                    tableColumnItem = `
            <el-table-column prop="${element}" label="${describe.title}" min-width="100">
                <template slot-scope="scope" v-if="scope.row.${element}">
                    ${displayList}
                </template>
            </el-table-column>
            `
                } else {
                    tableColumnItem = `
            <el-table-column prop="${element}" label="${describe.title}" min-width="100">
                <template slot-scope="scope" v-if="scope.row.${element}">
                {{scope.row.${element}.${describe.display}}}
                </template>
            </el-table-column>
            `
                }

            }
        } else if (['images-upload'].includes(describe.viewType)) {
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
                <div v-else >
                  <el-tag type="primary" disable-transitions>未上传</el-tag>
                </div>
              </template>
            </el-table-column>
            `
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
                <template slot-scope="scope" v-if="scope.row.${element}">{{scope.row.${element}.join(',')}}</template>
            </el-table-column>
            `
        } else if (['el-date-picker'].includes(describe.viewType)) {
            tableColumnItem = `
            <el-table-column prop="${element}" label="${describe.title}" min-width="150">
               <template slot-scope="scope">
                 {{ dateFormater('YY-mm-dd HH:MM:SS', scope.row.${element}) }}
               </template>
            </el-table-column>
            `
        }


        if (tableColumnItem) {
            this.tableColumn.push(tableColumnItem)
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
                ` else if (['${element}'].includes(k)) {
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
                ` else if (['${element}'].includes(k)) {
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
          <el-button type="primary" @click="init();getData()">查询</el-button>
          <el-button type="warning" @click="reset();getData()">重置</el-button>
          <el-button type="primary" @click="handleAdd" v-if="hasRole('add')">添加</el-button>
          <el-button type="primary" @click="handleImport" v-if="hasRole('import')">导入</el-button>
          <el-button type="danger" @click="deleteSelect" v-if="hasRole('delete')">批量删除</el-button>
          <el-button type="warning" :loading="exportLoading" @click="handleExport" v-if="hasRole('export')">导出</el-button>
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
          
          
          <el-button type="text" size="mini" @click="handleEdit(scope.row._id)" v-if="hasRole('edit')" style="color: #409EFF;">编辑</el-button>
          <el-button type="text" size="mini" @click="handleDelete(scope.row._id)" v-if="hasRole('delete')" style="color: #F56C6C;">删除</el-button> 
          <<{if ${!mod.tableRightButton}}>>
          <<{else}>>
            ${mod.tableRightButton || ''}
          <<{/if}>>
          
          
          <<{if ${!mod.indexRouterButton}}>>
          
          <<{else}>>
            <<{each mod.indexRouterButton}>>
                <<{if !$value.indexButtonHtml}>>
                <el-button type="text" size="mini" @click="$router.push({path:'/${mod.name}/<<{$value.path}>><<{$value.indexButtonParam}>>})" style="color: #F56C6C;"><<{$value.text}>></el-button>
                <<{else}>>
                <<{$value.indexButtonHtml}>>
                <<{/if}>>
            <<{/each}>>
          <<{/if}>>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination :page-sizes="pageSizes" :page-size="page.pageSize" :total="page.total"
                     layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import list from '@/mixin/list'
import permission from '@/mixin/permission'


let model = '${mod.text}'
export default {
  name: '${mod.name}List',
  mixins: [list, permission],
  components:{},
  data() {
    return {
      ${this.dataList.join(`,
      `)}<<{if ${this.dataList.length}>0}>>,<<{/if}>>
      listUrl: '/${mod.name}/findPage',
      form: {
      },
      // 导出
      exportName: this.$route.meta.title || '',
      exportHeader: ${JSON.stringify(exportHeader)},
      exportKeys: ${JSON.stringify(exportKeys)},
      multipleSelection:[]
    }
  },
  mounted() {
    this.initListData()
  },
  methods: {
    initListData(){
      ${this.mountedList.join('')}
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    handleAdd() {
      this.$router.push({
        path: '/${mod.name}/${mod.name}Add'
      })
    },
    handleEdit(_id) {
      this.$router.push({
        path: '/${mod.name}/${mod.name}Detail',
        query: {
          _id
        }
      })
    },
    handleDetail(_id) {
      this.$router.push({
        path: '/${mod.name}/${mod.name}Detail',
        query: {
          _id
        }
      })
    },
    handleDelete(_id) {
      this.$confirm('确定删除吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/${mod.name}/delete', {
          _id
        }).then(res => {
          console.log('res:', res)
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.init()
            this.getData()
          }
        })
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
        let _ids = this.multipleSelection.map(item=>item._id);
        this.$http.post('/${mod.name}/deleteSelect', _ids).then(res => {
          if (res.code === 200) {
            this.init()
            this.getData()
          }
        })
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    // 格式化excel数据显示
    formatJson(datas) {
      return datas.map((item, index) =>
        this.exportKeys.map(k => {
          if (['created', 'updated'].includes(k)) {
            return this.dateFormater('YY-mm-dd HH:MM:SS', item[k])
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
  }
}
</script>

<style lang="scss" scoped>
.block {
  margin-top: 10px;
}
</style>

    `
        return Template.render(src, this, {escape: false,});
    }
}

module.exports = indexVUEg
