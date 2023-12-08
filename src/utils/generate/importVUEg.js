
const Template = require('art-template');
const rule = Template.defaults.rules[1];
rule.test = new RegExp(rule.test.source.replace('{{', '<<{').replace('}}', '}>>'));
// Template.defaults.rules.splice(0,1)
// // 原始语法的界定符规则
// Template.defaults.rules[0].test = /<%(#?)((?:==|=#|[=-])?)[ \t]*([\w\W]*?)[ \t]*(-?)%>/;
// 标准语法的界定符规则
// Template.defaults.rules[1].test = /{{([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*}}/;


class importVUEg{
    constructor() {
    }
    // 必填项
    requiredHeader = []
    // 导入字段
    importHeader = ['_id']
    importKeys = ['_id']
    dataList = []
    // 枚举字段处理
    dataChuli = []
    // created查询关联字段list
    createdItem = []
    // 关联字段处理
    refChuli = []

    go(mod){
        this.mod = mod
        for (const element in mod.feilds) {
            this.element = element
            this.elementM = mod.feilds[element]
            this.describe = this.elementM.describe
            // 多对象数组情况
            if (mod.feilds[element] instanceof Array) {
                //一对多生成
                this.elementM = this.elementM[0]
                this.describe = this.elementM.describe
            }
            if (!this.describe) {
                continue
            }
            if (this.describe.vShow === undefined) {
                this.describe.vShow = ''
            }
            if (this.describe && this.describe.isShow === false) {
                continue
            }
            this.getRequiredHeader()
            this.getImportItem()
            this.getDataItem()
            this.getCreatedItem()
        }
        return this.html()
    }

    // 获取必填项提示文字
    getRequiredHeader(elementM=this.elementM,describe=this.describe,mod=this.mod){
        let element = this.element
        if (describe.isImport === false) {
            return
        }
        if (!describe.required) {
            return
        }
        let tip = describe.title || ''
        if (describe.data) {
            let enums = []
            for (let key in describe.data) {
                enums.push(`${key}是${describe.data[key]}`)
            }
            tip += `(${enums.join('、')})`
        }

        //加入组件
        if(tip){
            this.requiredHeader.push(tip)
        }
    }
    // 获取导入字段
    getImportItem(elementM=this.elementM,describe=this.describe,mod=this.mod){
        let element = this.element
        if (describe.isImport === false) {
            return
        }
        let header = element
        if (elementM.ref) {
            header += `_${describe.display}`
        } else if (['el-select', 'el-radio'].includes(describe.viewType)) {
            header += `_text`
        }
        this.importHeader.push(describe.title)
        this.importKeys.push(header)
    }
    getDataItem(methodList=this.methodList,elementM=this.elementM,describe=this.describe,mod=this.mod){
        let element = this.element
        let dataItem = ''
        let dataChuli = ''
        // 如果
        if (elementM.ref) {
            if (!describe.display) {
                return
            }
            dataItem = `${element}List: []`
            dataChuli = `
        // 根据填写的内容完善${describe.title}_id
        let find${element} = this.${element}List.find(v => v.${describe.display} === data.${element}_${describe.display})
        if (find${element}) {
          data.${element} = find${element}._id
        }`
        } else if (['el-select', 'el-radio'].includes(describe.viewType)) {
            dataItem = `${element}List: ${JSON.stringify(describe.data)}`
            dataChuli = `
        // 根据填写的内容完善${describe.title}
        for (let key in this.${element}List) {
          if (data.${element}_text === this.${element}List[key]) {
            data.${element} = key
          }
        }`
        }
        if(dataItem){
            this.dataList.push(dataItem)
        }
        if(dataChuli){
            this.dataChuli.push(dataChuli)
        }
    }
    // 获取created查询关联字段list
    getCreatedItem(elementM=this.elementM,describe=this.describe,mod=this.mod){
        let element = this.element
        if (describe.isImport === false) {
            return
        }
        if (!elementM.ref) {
            return
        }
        this.createdItem.push(`
    // 查询${describe.title}列表
    this.$http.post('/${elementM.ref}/find', {}).then(res => {
      if (res.code === 200) {
        this.${element}List = res.data || []
      }
    })`)
    }

    html(){
        let mod = this.mod
        let src = `<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
    <div style="display: flex;justify-content: space-between;align-items: center;margin: 20px;">
      <el-button type="primary" size="mini" :loading="downloadLoading" @click="handleDownload">点击下载导入模板</el-button>
    </div>
    <div style="display: flex;justify-content: space-between;align-items: center;margin: 20px;">
      <div class="text" style="color: #ff2d51;font-size: 16px;margin: 10px;">注意事项：必填项：${this.requiredHeader.join('，')}</div>
    </div>
    <div style="display: flex;justify-content: space-between;align-items: center;margin: 20px;">
      <el-button v-if="tableData.length>0" type="success" size="mini" :loading="loading" @click="updateInfo">确定</el-button>
      <el-button v-if="failData.length>0" type="primary" size="mini" @click="showFailTable=true">查看失败的{{failData.length}}条</el-button>
    </div>
    <div class="text">excel预览</div>
    <el-table :data="tableData" border size="mini" highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column v-for="(item, index) in importHeader" :prop="importKeys[index]" :label="item" min-width="100"></el-table-column>
    </el-table>
    <!--    导入失败的-->
    <el-dialog :visible.sync="showFailTable" :close-on-press-escape="false" :close-on-click-modal="false" title="导入失败的数据" top="10vh" width="80%">
      <div style="display: flex;justify-content: space-between;align-items: center;margin: 20px;">
        <el-button type="primary" size="mini" :loading="downloadFailDataLoading" @click="handleDownloadFailData">导出</el-button>
      </div>
      <el-table :data="failData" border size="mini" highlight-current-row style="width: 100%;margin-top:20px;">
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column v-for="(item, index) in importHeader" :prop="importKeys[index]" :label="item" min-width="100"></el-table-column>
        <el-table-column prop="reason" label="失败原因" min-width="150"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  name: 'UploadExcel',
  components: {UploadExcelComponent},
  data() {
    return {
      tableHeader: [],
      tableData: [],
      loading: false,
      downloadLoading: false,
      showFailTable: false,
      failData: [],
      downloadFailDataLoading: false,
      // 导入字段
      importHeader: ${JSON.stringify(this.importHeader)},
      importKeys: ${JSON.stringify(this.importKeys)},
      ${this.dataList.join(`,
      `)}
    }
  },
  created() {${this.createdItem.join(``)}
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 10

      if (isLt1M) {
        return true
      }

      this.$message({
        // message: 'Please do not upload files larger than 1m in size.',
        message: '请不要上传大于1M的文件',
        type: 'warning'
      })
      return false
    },
    handleSuccess({results, header}) {
      console.log('results', results)
      console.log('header', header)
      results.map(item => {
        let data = {
          desc: '批量导入'
        }
        for (let i = 0; i < this.importHeader.length; i++) {
            if (item[this.importHeader[i]]) {
                data[this.importKeys[i]] = item[this.importHeader[i]]
            }
        }
        ${this.dataChuli.join(`
        `)}
        
        this.tableData.push(data)
      })
      console.log('this.tableData', this.tableData)
      this.tableHeader = header
    },
    updateInfo() {
      this.loading = true
      this.$http.post('/${this.mod.name}/import', {data: this.tableData}).then(res => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.tableData = []
        } else {
          this.$message({
            type: 'warning',
            message: '操作失败,请参照红色字体配置'
          })
        }
        if (res.data && res.data.length > 0) {
          this.failData = res.data
          this.showFailTable = true
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 下载模板
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.importHeader
        const data = [[]]
        for (let i = 0; i <= tHeader.length - 1; i++) {
          data[0].push('')
        }
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data: data, // 具体数据 必填
          filename: '${this.mod.text}导入模板', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
        this.$notify({
          title: '成功',
          message: '下载成功',
          type: 'success'
        });
        this.downloadLoading = false
      })
    },
    // 下载导入失败的数据
    handleDownloadFailData() {
      this.downloadFailDataLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [...this.importHeader, '失败原因']
        const tKeys = [...this.importKeys, 'reason']
        const data = this.failData.map((item, index) => {
          return tKeys.map(k => {
            return item[k]
          })
        })
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data: data, // 具体数据 必填
          filename: '${this.mod.text}导入失败数据', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
        this.$notify({
          title: '成功',
          message: '导出成功',
          type: 'success'
        });
        this.downloadFailDataLoading = false
      })
    }
  }
}
</script>
<style scoped>
.text {
  color: #606266;
  font-size: 15px;
  margin: 20px;
}
</style>
  `
        return Template.render(src, this, {escape: false,});
    }
}

module.exports = importVUEg
