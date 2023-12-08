
const Template = require('art-template');
const rule = Template.defaults.rules[1];
rule.test = new RegExp(rule.test.source.replace('{{', '<<{').replace('}}', '}>>'));
// Template.defaults.rules.splice(0,1)
// // 原始语法的界定符规则
// Template.defaults.rules[0].test = /<%(#?)((?:==|=#|[=-])?)[ \t]*([\w\W]*?)[ \t]*(-?)%>/;
// 标准语法的界定符规则
// Template.defaults.rules[1].test = /{{([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*}}/;


class formVUEg{
    constructor() {
    }
    elementArray = []
    dataList = []
    defaultForm = []
    ruleList = []
    pickerOptions = ''
    watch=''
    mounted = []
    methodList = []
    mountedList=[]
    components = []
    // 组件模板组
    componentsTem={
        imagesUpload:{
            key:'imagesUpload',
            url:'@/components/imagesUpload'
        },
        videosUpload:{
            key:'videosUpload',
            url:'@/components/videosUpload'
        },
        filesUpload:{
            key:'filesUpload',
            url:'@/components/filesUpload'
        },
        richText:{
            key:'richText',
            url:'@/components/tinymce/index'
        },
        imagePaste:{
            key:'imagePaste',
            url:'@/components/imagePaste'
        }
    }
    go(mod){
        this.mod = mod
        if(mod.watch){
            if(!mod.watch.endsWith(',')){
                mod.watch+=','
            }
            this.watch = mod.watch
        }
        let componentKeys = []
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
            this.getElementItem()
            this.getDataItem()
            this.getMountedItem()
            this.getDefaultItem()
            this.getRuleListItem()
            this.getMethodItem()

            if (this.describe.viewType) {
                componentKeys.push(this.describe.viewType)
            }
        }
        // 加组件
        if (componentKeys.includes('images-upload')) {
            this.components.push(this.componentsTem.imagesUpload)
        }
        if (componentKeys.includes('videos-upload')) {
            this.components.push(this.componentsTem.videosUpload)
        }
        if (componentKeys.includes('files-upload')) {
            this.components.push(this.componentsTem.filesUpload)
        }
        if (componentKeys.includes('rich-text')) {
            this.components.push(this.componentsTem.richText)
        }
        if (componentKeys.includes('image-paste')) {
            this.components.push(this.componentsTem.imagePaste)
        }
        return this.html()
    }

    /**
     * 校验
     * @param elementM
     * @param describe
     * @param mod
     */
    getRuleListItem(elementM=this.elementM,describe=this.describe,mod=this.mod){
        let element = this.element
        if (describe.required) {
            let ruleItem = ''
            if (elementM.ref || ['el-select', 'el-radio', 'el-date-picker'].includes(describe.viewType)) {
                ruleItem = `
              ${element}: [
                {required:true, message: '请选择${describe.title}', trigger: ['change'] }
              ],`
            } else if (['images-upload', 'videos-upload', 'files-upload'].includes(describe.viewType)) {
                ruleItem = `
              ${element}: [
                {required:true, validator: (rule, value, callback) => {
                  if (!value) {
                    return callback('请上传${describe.title}')
                  }
                  if (typeof value === 'object' && value.length === 0) {
                    return callback('请上传${describe.title}')
                  }
                  callback()
                }, trigger: ['change'] }
              ],`
            } else {
                // 默认
                ruleItem = `
        ${element}: [
          {required:true, message: '请输入${describe.title}', trigger: ['blur', 'change'] }
        ],`
            }
            this.ruleList.push(ruleItem)
        }
    }

    /**
     * 获取表单内容
     * @param elementM
     * @param describe
     * @param mod
     */
    getElementItem(elementM=this.elementM,describe=this.describe,mod=this.mod){
        let element = this.element
        let formItemTip = ''
        if (describe.describe) {
            formItemTip = `<span slot="label">
            <el-tooltip class="item" effect="dark" content="${describe.describe}" placement="top">
              <span>${describe.title}</span>
            </el-tooltip>
          </span>
          `
        }
        // 头部
        let formItem = `<el-form-item${describe.vShow ? ' ' + describe.vShow : ''} label="${describe.title}"${describe.required ? ` prop="${element}"` : ''}>
          ${formItemTip}`
        // 如果
        if (elementM.ref) {
            if (!describe.display) {
                return
            }
            let multiple = (mod.feilds[element] instanceof Array) ? ' multiple' : ''
            let displayString = `{{item.${describe.display}}}`
            let displayLabel = describe.display
            if (describe.display instanceof Array) {
                displayString = ''
                displayLabel = describe.display[0]
                for (let i = 0; i < describe.display.length; i++) {
                    displayString += `{{item.${describe.display[i]}}} `
                }
            }
            // 下拉框
            formItem = `
        ${formItem}<el-select v-model="form.${element}" placeholder="选择${describe.title}"${multiple} filterable clearable class="el-input-x">
            <el-option v-if="item.${displayLabel}" v-for="(item, index) in ${element}List" :key="index" :label="item.${displayLabel}" :value="item._id">${displayString}</el-option>
          </el-select>
        </el-form-item>`
        } else if (['el-input'].includes(describe.viewType) || !describe.viewType) {
            let typeItem = `type="text"`
            if (elementM.type === Number) {
                typeItem = 'type="Number"'
            }
            // 普通输入框
            formItem = `
        ${formItem}<el-input ${typeItem} v-model="form.${element}" clearable class="el-input-x"></el-input>
        </el-form-item>`
        } else if (['el-input-textarea'].includes(describe.viewType)) {
            // 多行输入框
            formItem = `
        ${formItem}<el-input type="textarea" :rows="5" v-model="form.${element}" clearable class="el-input-x"></el-input>
        </el-form-item>`
        } else if (['el-input-number'].includes(describe.viewType)) {
            // 数字输入框
            formItem = `
        ${formItem}<el-input-number v-model="form.${element}" :min="0" :controls="false" :precision="0" clearable class="el-input-x"></el-input-number>
        </el-form-item>`
        } else if (['el-select'].includes(describe.viewType)) {
            // 下拉框
            formItem = `
        ${formItem}<el-select v-model="form.${element}" placeholder="选择${describe.title}" clearable class="el-input-x">
            <el-option v-for="(item, index) in ${element}List" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>`
        } else if (['el-radio'].includes(describe.viewType)) {
            // 单选按钮
            formItem = `
        ${formItem}<el-radio-group v-model="form.${element}">
            <el-radio v-for="(item, index) in ${element}List" :key="index" :label="index" :value="index">{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>`
        } else if (['el-switch'].includes(describe.viewType)) {
            // 开关按钮
            formItem = `
        ${formItem}<el-switch v-model="form.${element}"></el-switch>
        </el-form-item>`
        } else if (['images-upload', 'videos-upload', 'files-upload'].includes(describe.viewType)) {
            // 多张还是一张
            let maxLength = elementM.default instanceof Array? 100:1
            let accept = describe.accept||''
            // 图片上传、视频上传、文件上传
            formItem = `
        ${formItem}<${describe.viewType} :value="form.${element}" ${accept} :maxSize="5" :maxLength="${maxLength}" @success="handle${element[0].toLocaleUpperCase()+element.substr(1)}Success" tip=""></${describe.viewType}>
        </el-form-item>`
        } else if (['vue-json-editor'].includes(describe.viewType)) {
            // 图片上传、视频上传、文件上传
            formItem = `
        ${formItem}<${describe.viewType} v-model="form.${element}" :lang="'zh'" mode="code" :expandedOnStart="true"></${describe.viewType}>
        </el-form-item>`
        }else if (['NumberArray'].includes(describe.viewType)) {
            // NumberArray
            formItem =`
        ${formItem}<${describe.viewType} v-model="form.${element}" :min="0" :controls="false" :precision="0"></${describe.viewType}>
        </el-form-item>`
        }
        else if (['formTable'].includes(describe.viewType)&&mod.feilds[element] instanceof Array) {
            // formTable
            formItem =`
        ${formItem}<${element} v-model="form.${element}"></${element}>
        </el-form-item>`
            this.components.push({key:element,url: `@/views/extend/${describe.ref}/formTable`})
        }else if (['el-date-picker'].includes(describe.viewType)) {
            // 日期选择器
            formItem =`
        ${formItem}<el-date-picker v-model="form.${element}" type="datetime" placeholder="选择日期时间" align="right" :picker-options="pickerOptions" clearable class="el-input-x"></el-date-picker>
        </el-form-item>`
            // 增加默认选择项
            this.pickerOptions = `
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },`
        }else if (['rich-text'].includes(describe.viewType)) {
            // 富文本
            formItem =`
        <el-form-item label="${describe.title}">
            <richText editor-id="${element}" v-model="form.${element}" plugins="lists image wordcount"></richText>
        </el-form-item>`
        }else if (['image-paste'].includes(describe.viewType)) {
            // 图片粘贴上传
            formItem =`
        <el-form-item label="${describe.title}">
            <imagePaste v-model="form.${element}" width="150" height="150" @success="$event=>{form.${element}=$event;}"></imagePaste>
        </el-form-item>`
        }

        //加入组件
        if(formItem){
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
    getMethodItem(methodList=this.methodList,elementM=this.elementM,describe=this.describe,mod=this.mod){
        let element = this.element
        if (['images-upload', 'videos-upload', 'files-upload'].includes(describe.viewType)) {
            // 增加methods方法
            methodList.push(`handle${element[0].toLocaleUpperCase()+element.substr(1)}Success(res) {
                console.log("res",res)
                this.form.${element} = res
            },`)
        } else if (['vue-json-editor'].includes(describe.viewType)) {
            // 增加methods方法
            methodList.push(`handle${element[0].toLocaleUpperCase()+element.substr(1)}Success(res) {
                this.form.${element} = res
            },`)
        }

    }

    /**
     * 获取data列表数据,选项数组
     * @param mod
     */
    getDataItem(methodList=this.methodList,elementM=this.elementM,describe=this.describe,mod=this.mod){
        let element = this.element
        let dataItem =''
        // 如果
        if (elementM.ref) {
            if (!describe.display) {
                return
            }
            dataItem = `${element}List: []`
        } else if (['el-select'].includes(describe.viewType)) {
            //树来源项
            dataItem = `${element}List: ${JSON.stringify(describe.data)}`

        } else if (['el-radio'].includes(describe.viewType)) {
            // 单选按钮处理数据
            dataItem = `${element}List: ${JSON.stringify(describe.data)}`
        }
        if(dataItem){
            this.dataList.push(dataItem)
        }
    }

    /**
     * 获取默认值
     * @param methodList
     * @param elementM
     * @param describe
     * @param mod
     */
    getDefaultItem(methodList=this.methodList,elementM=this.elementM,describe=this.describe,mod=this.mod) {
        let element = this.element
        let defaultForm = this.defaultForm
        //处理默认值
        if (elementM.default !== undefined) {
            let formDataItem
            if (mod.feilds[element] instanceof Array) {
                // 添加表单默认值
                formDataItem = `${element}: [${JSON.stringify(elementM.default)}],`
            } else {
                formDataItem = `
    ${element}: ${JSON.stringify(elementM.default)},`
            }
            defaultForm.push(formDataItem)
        }if(['formTable'].includes(describe.viewType)&&mod.feilds[element] instanceof Array){
           let formDataItem = `
    ${element}: [],`
            defaultForm.push(formDataItem)
        }
    }
    html(){
        let mod = this.mod
        let src = `
<template>
  <el-form ref="form" :model="form" :rules="formRules" size="small" label-width="100px">
    <el-card shadow="hover">
      <div slot="header">基础信息</div>
      ${this.elementArray.join('')}
      <el-form-item>
        <el-button type="primary" @click="onSubmit(form)">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-card>
  </el-form>
</template>

<script>
import { deepClone } from '@/utils/index'

<<{each components}>>import <<{$value.key}>> from '<<{$value.url}>>';
<<{/each}>>
let formDefaultData = {${this.defaultForm.join('')}
}
export default {
  name: '${this.mod.name}Form',
  components: {
    <<{each components}>><<{$value.key}>>,
    <<{/each}>>
  },
  props:{
    // form:{
    //   type:Object,
    //   default(){
    //     return deepClone(formDefaultData)
    //   }
    // }
  },
  model:{
    // prop:'form'
  },
  data() {
    return {${this.pickerOptions}
      form:deepClone(formDefaultData),
      ${this.dataList.join(`,
      `)}<<{if ${this.dataList.length}>0}>>,<<{/if}>>
      formRules: {${this.ruleList.join('\n')}
      }
    }
  },
  ${this.watch}
  mounted() {
    this.initListData()
  },
  methods: {
    ${this.methodList.join('')}
    initListData(){
        //在使用弹窗是使用请求会报错
        // if (this.$route.query._id) {
      //   this.$http.post('/${mod.name}/findOne', { _id: this.$route.query._id }).then(res => {
      //     if (res.code === 200) {
      //       this.form = { ...res.data }
      //     }
      //   })
      // }
        
      ${this.mountedList.join('')}
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$emit('onSubmit',this.form)
        }
      })
    },
    clear(){
      this.form = deepClone(formDefaultData)
    },
    onCancel(){
      this.$emit('onCancel')
      this.$router.go(-1)
    },
    setForm(form){
      this.form = form
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input-x {
    width: 300px;
}
</style>
  `
        return Template.render(src, this, {escape: false,});
    }
}

module.exports = formVUEg
