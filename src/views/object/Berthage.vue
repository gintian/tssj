<template>
    <div id="plan">
        <div id="plan_main">
<!--            <editor v-model="content" :isClear="isClear" @change="change"></editor>-->
                <el-button type="primary" size="small" @click="add" icon="el-icon-plus" style="margin-left: 1rem">添加</el-button>
                <el-dialog
                        :title=dialog.title
                        :visible.sync=dialog.visible
                        width="45%"
                        custom-class="videoDialog"
                        :close-on-click-modal="false"
                        >
                    <el-form label-position="left" label-width="60px" :model="formLabelAlign" ref="ruleForm" :rules="formRules">
                        <el-form-item v-for="item in addData" :key="item.id" :label="item.name" :prop="item.prop">
                            <el-input v-model="formLabelAlign[item.prop]"  :disabled="dialog.disabled" ></el-input>
                        </el-form-item>
                    </el-form>
                    <editor v-model="content" :isClear="isClear"  ref="editor" :disabled="editorDisabled"></editor>
                    <span slot="footer" class="dialog-footer" v-show="dialog.showBtn">
          <el-button @click="content=''">清 空</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </span>
                </el-dialog>

                <div style="text-align: center; width: 250px;float: right;margin-right: 20px" id="search" >
                    <el-input size="small" placeholder="请输入关键词" class="input-with-select" v-model="searchTxt">
                        <el-button type="primary" slot="append" icon="el-icon-search" @click="queryData"></el-button>
                    </el-input>
                </div>

                <PaginationTab
                        :tableData='tableData'
                        :tabTop='tabTop'
                        :total='total'
                        :isUpdata=true
                        :isMore=true
                        :isPass=true
                        @handleClickMore='handleClickMore'
                        @handleClickPass='handleClickPass'
                        @handleSizeChange='handleSizeChange'
                        @handleCurrentChange='handleCurrentChange'
                        @handleClickUpdata='handleClickUpdata'
                        @handleClickDelete='handleClickDelete'
                />

                <el-dialog :visible.sync="dialog.showMap" width="520px" :show-close='false' custom-class="mapDialog">
                    <table-map :mapData="mapData"  markerType="point" :option="{strokeColor:'blue ', strokeWeight:2, strokeOpacity:0.5}"></table-map>
                </el-dialog>
            </div>
    </div>
</template>

<script>
    import editor from '../../components/editor/editor'
    import {formRules} from '../../tools/formRules';
    import PaginationTab from '../../components/PaginationTable'
    // import VideoView from '../../../../zfwtowperiod/src/components/VideoView'
    import TableMap from '../../../src/components/TableMap'
  export default {
    name: 'Feedback',
    components:{
      editor,  PaginationTab,
    },
    data(){
      return{
        isClear: false,
        editorDisabled:false,
        content: `<span style="color: rgb(0,0,0);">请编辑内容</span><p><br></p>`,

        secondaryUrl: '/feedback',
        interfaceType:'',
        dialog: {
          visible: false,
          title: '',
          showBtn:true,
          showMap:false,
          disabled:false,
        },
        formRules:formRules,
        formLabelAlign: {
          title: '',
        },
        addData: [
          {id: 0, prop: 'title', name: '标题'},
        ],
        mapData:[],
        page: 1,
        limit: 10,
        total: 100,
        imageUrl: '',
        searchTxt:'',
        tableData: [],
        tabTop: [
          { id: 0, prop: 'title', name: '标题' },
          { id: 1, prop: 'name', name: '问题类型' },
          { id: 2, prop: 'creatTime1', name: '创建人' },
          { id: 3, prop: 'creatTime1', name: '创建时间' },
          { id: 4, prop: 'position', name: '处理人' },
          { id: 5, prop: 'status2', name: '处理时间' },
          { id: 6, prop: 'position', name: '处理情况' },
          { id: 7, prop: 'status2', name: '处理问题' },
          // { id: 4, prop: '', name: '附件' },
          // { id: 5, prop: 'status2', name: '处理时间' },
        ]

      }
    },
    mounted() {
      this.queryData()
      console.log(this.$ipConfig)
    },
    methods:{
      // change(val) {
      //   console.log(val)
      //   this.content=val
      //   // console.log(this.$refs['editor'].editorContent)
      // },
      clearEditor(){
        this.content=''
        // this.$refs.editor.clear();
      },
      add() {
        this.interfaceType = 'add'
        this.formLabelAlign = {}
        this.dialog.visible = true
        this.dialog.title = '添加'
        this.dialog.disabled=false
        this.dialog.showBtn = true;
        this.editorDisabled=false
        this.resetForm('ruleForm')//重置
        this.content=`<span style="color: rgb(0,0,0);">请编辑内容</span><p><br></p>`
      },
      handleSizeChange(val)/* 调整分页每页条数 */ {
        this.limit = val
        console.log(`每页 ${val} 条`)
        this.service.post(this.secondaryUrl + '/findPage', {
          'page': this.page,
          'limit': this.limit,
          'condition': this.searchTxt
        }).then(req => {
          console.log(req)
          this.tableData = req.data.list
          for(let i of this.tableData){
            i.creatTime1=new Date(i.creatTime).toLocaleDateString()
          }
          this.total = req.data.totalRow
        })
      },
      handleCurrentChange(val) /* 跳页 */ {
        this.page = val
        console.log(`当前页: ${val}`)
        this.service.post(this.secondaryUrl + '/findPage', {
          'page': this.page,
          'limit': this.limit,
          'condition': this.searchTxt
        }).then(req => {
          console.log(req)
          this.tableData = req.data.list
          for(let i of this.tableData){
            i.creatTime1=new Date(i.creatTime).toLocaleDateString()
          }
          this.total = req.data.totalRow
        })
      },
      handleClickUpdata(row)/* 修改 */ {
        console.log(row)
        this.resetForm('ruleForm')//重置
        this.interfaceType = 'update'
        this.formLabelAlign = {...row}
        this.dialog.title = '预案修改'
        this.editorDisabled=false
        this.dialog.disabled = false;
        this.dialog.visible = true
        this.dialog.showBtn = true
        this.service.post(this.secondaryUrl + '/detail', {
          id:row.id
        }).then(res=>{
          console.log(res)
          this.formLabelAlign = {...res.data}
          this.content=res.data.content
        })
      },
      handleClickMore(row)/* 详情 */ {
        console.log(row)
        this.resetForm('ruleForm')//重置
        this.interfaceType = 'more'
        // this.formLabelAlign = {...row}
        this.dialog.visible = true
        this.dialog.title  = '预案详情'
        this.dialog.disabled = true;
        this.dialog.showBtn = false
        this.editorDisabled=true
        this.service.post(this.secondaryUrl + '/detail', {
          id:row.id
        }).then(res=>{
          console.log(res)
          this.formLabelAlign = {...res.data}
          this.content=res.data.content
        })
      },
      handleClickDelete(row)/* 删除 */ {
        console.log(row)
        this.service.post(this.secondaryUrl + '/delete', {
          id: row.id
        }).then(req => {
          // this.tableData = req.data.list;
          this.queryData()
          console.log('success')
        }).catch(err => {
          this.queryData()
          //  return false;
        })
      },
      handleClickPass(row) {
        console.log(row)
        this.service.post(this.secondaryUrl + '/through', {
          id:row.id
        }).then(res=>{
          // console.log(res)
          this.queryData()
        })
      },
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      },
      submitForm(formName)/* 提交表单 */ {

        this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('submit!'); /basicData/personnel/add
            this.content=this.$refs['editor'].editorContent
            this.formLabelAlign.content=this.content
            console.log(this.formLabelAlign)

            this.service.post(this.secondaryUrl + '/' + this.interfaceType, {
              ...this.formLabelAlign
            }).then(req => {
              console.log(req)

              // this.tableData = req.data.list;
              this.dialog.visible = false
              this.queryData()
            }).catch(err => {
              this.$message({ message: err.msg, type: 'error' })
              console.log(err)
              this.queryData()

              //  return false;
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      queryData() /* 查询数据 */ {
        this.service.post(this.secondaryUrl + '/findPage', {
          'page': this.page,
          'limit': this.limit,
          'condition': this.searchTxt
        }).then(res => {
          console.log('反馈',res)
          this.tableData = res.data.list
          for(let i of this.tableData){
            i.creatTime1=new Date(i.creatTime).toLocaleDateString()
          }
          this.total = res.data.totalRow
        })
      },
      disMmsi(){
        // console.log(id,this.interfaceType)
        if(this.interfaceType=='update'){
          return false
        }else{
          if(this.interfaceType=='more'){
            return true
          }else{
            return false
          }
        }
      },
    }
  }
</script>
<style lang="less" scoped>
        #search {
            /deep/ .el-input__inner {
                background: var(--table-input-back);
                /*border:#66B1FF solid 1px;*/
            }

            /deep/ .el-input-group__append {
                background: #66B1FF;
                /*border: #66B1FF 2px solid;*/
                color: white;
            }
        }

</style>
<style scoped lang="less">
    /**{*/
    /*    margin: 0;*/
    /*    padding: 0;*/
    /*}*/

    @media screen and (max-width: 1366px) {
        #plan {
            /*height: calc(100% - 121px);*/
        }
    }
    @media screen and (min-width: 1367px) {
        #plan {
            height: calc(100% - 115px);
        }
    }


    #plan{
        padding: 0;
        /*height: calc(100% - 95px);*/
        /*height: 100%;*/
        display: flex;
        #plan_main{
            flex: 1;
            /*height: calc(100% - 2rem);*/
            /*height: 100%;*/
            padding: 1rem 2rem;
            /deep/.el-dialog__wrapper{
                overflow: hidden;
            }
            /deep/.videoDialog{
                height: 100%;
                max-height: 70%;
                .el-dialog__body {
                    overflow-y: auto;
                    /*max-height: 350px;*/
                    height:  calc(90% - 130px);
                }
            }
            /*/deep/.videoDialog .el-dialog__body{*/
            /*    overflow-y: auto;*/
            /*}*/
        }
    }
</style>
