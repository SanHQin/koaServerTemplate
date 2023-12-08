class addVUEg {
    constructor() {
    }
    getDefault(mod) {
        let defaultForm = []
        for (const element in mod.feilds) {
            let elementM = mod.feilds[element]
            let describe = elementM.describe
            // 多对象数组情况
            if (mod.feilds[element] instanceof Array) {
                //一对多生成
                elementM = elementM[0]
                describe = elementM.describe
            }
            if (!describe) {
                continue
            }
            if (describe && describe.isShow === false) {
                continue
            }

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
        return defaultForm
    }
    /**
     * 生成文件主体
     * @param mod
     * @returns {string}
     */
    go(mod) {
        let name = `${mod.name}Add`
        let vueForm = `${mod.name}Form`
        this.defaultForm = this.getDefault(mod)

        let html = `
<template>
  <div style="padding: 20px;">
    <${vueForm} ref="formRef" @onSubmit="onSubmit">
    </${vueForm}>
  </div>
</template>

<script>
  import { deepClone } from '@/utils/index'
  import ${vueForm} from "./form";


let formDefaultData = {${this.defaultForm.join('')}
        }
  export default {
    name: '${name}',
    components: {
      ${vueForm}
    },
    data() {
      return {
        form:deepClone(formDefaultData)
      }
    },
    mounted() {
        if (this.$route.query._id) {
        this.$http.post('/${mod.name}/getOne', { _id: this.$route.query._id }).then(res => {
          if (res.code === 200) {
            this.form = { ...res.data }
            this.$refs.formRef.setForm(this.form)
          }
        })
      }else{
        this.form = deepClone(formDefaultData)
        this.$refs.formRef.setForm(this.form)
      }
    },
    methods: {
      onSubmit(form) {
        console.log("form",form)
        let url = '/${mod.name}/add'
        if (this.$route.query._id) {
          url = '/${mod.name}/update'
        }
        this.$http.post(url, form).then(res => {
          if (res.code === 200) {
            this.$message.success('保存成功')
            this.$router.go(-1)
          }
        })
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
        return html
    }

}
module.exports = addVUEg
