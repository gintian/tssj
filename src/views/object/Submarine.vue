<template>
    <div id="target">
        <div id="target_main">
            <div id="target_right">
                 <div class="app-container" >
                  <div class="container-title" >
                    <h3>海底光缆</h3>
                    <div  style="display: flex;justify-content: space-between;">
                <el-upload
                      class="upload-demo"
                       ref="upload"
                      :http-request="uploadSectionFile" 
                      accept=".xls"
                      multiple
                      :action="uploadUrl"
                      :file-list="fileList">
                      <el-button class="filter-item" type="primary"  style=" margin-right: 40px;" @click="submitUpload"  >
                          导入
                      </el-button>
                 </el-upload>
                <el-button class="filter-item" type="primary"  @click="download()" >
                    导出
                </el-button>
         </div>
                </div>
                <div  class="container-middle">
                <el-button type="primary" size="small" @click="add" icon="el-icon-plus" style="margin-left: 1rem">添加
                </el-button>
                <el-dialog
                        :title=dialog.title
                        :visible.sync=dialog.visible
                        custom-class="videoDialog"
                        width="30%"
                        :before-close="handleClose">
                    <el-form label-position="left" label-width="80px" :model="formLabelAlign" ref="ruleForm" :rules="formRules">
                        <el-form-item v-for="item in addData" :key="item.id" :label="item.name" :prop="item.prop">
                            <el-input v-model="formLabelAlign[item.prop]" v-if="item.id<3" :disabled="dialog.disabled" ></el-input>  
                        </el-form-item>
                    </el-form>
                    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="55px" width="40%" label-position="right"
                             class="demo-dynamic">
                        <el-form-item
                                v-for="(domain, index) in dynamicValidateForm.domains" :key="index">
                            <el-row>
                                <el-col :span="3">第{{index+1}}个点</el-col>
                                <el-col :span="9">
                                    <el-form-item label="经度"
                                                  :rules="[{required: true, message: '请输入经度', trigger: 'blur'}]"
                                                  :prop="'domains.' + index + '.lon'">
                                        <el-input v-model="domain.lon" :disabled="dialog.disabled"></el-input >
                                    </el-form-item>
                                </el-col>
                                <el-col :span="9">
                                    <el-form-item label="纬度"
                                                  :rules="[{required: true, message: '请输入纬度', trigger: 'blur'}]"
                                                  :prop="'domains.' + index + '.lat'">
                                        <el-input v-model="domain.lat" :disabled="dialog.disabled"></el-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="1"><i class="el-icon-circle-plus-outline" @click="addDomain"
                                                     style="cursor: pointer;font-size:20px;color: #409eff;margin-left: .5rem" v-show="interfaceType==='save'"> </i>
                                </el-col>
                                <el-col :span="1" style="margin-left: 10px  "><i class="el-icon-remove-outline" @click="reduceDomain(domain)"
                                                     style="cursor: pointer;font-size:20px;color: #409eff;margin-left: .5rem" v-show="interfaceType==='save'"> </i>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer" v-show="dialog.showBtn">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="handleRules('ruleForm','dynamicValidateForm')">确 定</el-button>
        </span>
                </el-dialog>
                <div  class="select_query">
                                <el-input  placeholder="请输入名称" class="filter-item" v-model="listQuery.name"  style="width: 200px;" />
                                    <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="queryData">搜索 </el-button>
                            </div>
  </div>
                <PaginationTab
                        :tableData='tableData'
                        :tabTop='tabTop'
                        :total='total'
                        :isUpdata=true
                        :isView=true
                        markerType='point'
                        :isMore=true
                        @handleClickMore='handleClickMore'
                        @handleSizeChange='handleSizeChange'
                        @handleCurrentChange='handleCurrentChange'
                        @handleClickUpdata='handleClickUpdata'
                        @handleClickDelete='handleClickDelete'
                        @handleClickView='handleClickView'
                />

                <el-dialog :visible.sync="dialog.showMap" width="520px" :show-close='false' custom-class="mapDialog">
      <leaflet-tablemap :mapData="mapData"  markerType="Submarine" :option="{strokeColor:'blue ', strokeWeight:2, strokeOpacity:0.5}"></leaflet-tablemap>
</el-dialog>
            </div>
        </div>
</div>
    </div>
</template>

<script>
  import {formRules} from '../../utils/formRules';
  import PaginationTab from '../../components/PaginationTable'
 import LeafletTableMap from '../../../src/components/LeafletTableMap'
  export default {
    // name: 'seaLine',
    components: {
      PaginationTab,
      // VideoView,
     'leaflet-tablemap':LeafletTableMap
    },
    data() {
      return {
        secondaryUrl: '/seaLine',
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
          name: '',
          total_length: '',
          points: '',
        },
        
        addData: [
          {id: 0, prop: 'name', name: '名称'},
          {id: 1, prop: 'total_length', name: '总长度'},
          {id: 2, prop: 'controller_distance', name: '控制距离'},
          {id: 3, prop: 'points', name: '海底光缆节点集'},
        ],
        
        dynamicValidateForm: {//多边形经纬度
          domains: [{lon: '', lat: '',ordered:''}, {lon: '', lat: '',ordered:''}],
        },
        name:'',
        mapData:[],
         listQuery:{
            pageNumber:1, //当前页面
            pageSize:10, //条数
            name:'' , //查询条件
        },
        total: 100,
        uploadUrl:'seaLine/pushExcel',
       fileList: [],
        tableData: [],
        tabTop: [
          { id: 1, prop: 'name', name: '名称' },
          { id: 2, prop: 'total_length', name: '总长度' },
          {id: 3, prop: 'controller_distance', name: '控制距离'},
        ]
      }
    },
    mounted() {
      this.queryData()
    },
    methods: {
          submitUpload(){
          this.$refs.upload.submit();
          // this.importdialog=true
      },
       // 导入数据
       uploadSectionFile(item){
        //  console.log("导入的数据",item,process.env.VUE_APP_BASE_API+this.uploadUrl)
           const fileObj = item.file;
        // FormData 对象
          const form = new FormData();
          // 文件对象
          form.append('file', fileObj);  
         this.$axios({
            method: 'post',
            url: 'http://192.168.1.36:8093/'+this.uploadUrl,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            data: form,
          }).then((res) => {
            // console.log("返回数据：",res);
            //  console.log("返回数据状态码：",res.data.error);
            if(res.data.error==0){
              //  this.$message.success('成功导入船舶离线数据' + '!');
               this.$alert('成功导入1条船舶离线数据!');
              //  this.$message({
              //   type: 'success',
              //   message: '成功导入船舶离线数据!',
              //   offset:500
              // });
              // this.$notify({
              //   type: 'success',
              //   message: '成功导入1条船舶离线数据!'
              //   //  duration: 0
              //   //  position: 'bottom-left' 默认右上角
              // });
            }
          });
      } ,  
      addDomain() {
        this.dynamicValidateForm.domains.push({lon: '', lat: ''});
      },
      reduceDomain(item){
          var index = this.dynamicValidateForm.domains.indexOf(item)
          if (index !== -1) {
            this.dynamicValidateForm.domains.splice(index, 1)
          }
      },
      
      add() {
        this.interfaceType = 'save'
        this.formLabelAlign = {}
        this.dynamicValidateForm.domains=[{lon: '', lat: '',ordered:''}, {lon: '', lat: '',ordered:''}];
        this.dialog.visible = true
        this.dialog.title = '海底光缆添加'
        this.dialog.disabled=false
        this.dialog.showBtn = true;
        this.resetForm('ruleForm')//重置
      },
      handleClose(done) {
        done()
      },
       handleSizeChange(val)/* 调整分页每页条数 */ {
        this.listQuery.pageSize=val
        // console.log(`每页 ${val} 条`)
        this.service.get(this.secondaryUrl + '/page', {
        params:{
            pageNumber: this.listQuery.pageNo,
            pageSize: this.listQuery.pageSize,
            name: this.listQuery.name}
         }).then(req => {
          console.log(req)
          this.tableData = req.page.list
          this.total = req.page.totalRow
        })
      },
      handleCurrentChange(val) /* 跳页 */ {
        this.listQuery.pageNo=val
        // console.log(`当前页: ${val}`)
        this.service.get(this.secondaryUrl + '/page', {
           params:{
            pageNumber: this.listQuery.pageNo,
            pageSize: this.listQuery.pageSize,
            name: this.listQuery.name}
        }).then(req => {
          console.log(req)
          this.tableData = req.page.list
          this.total = req.page.totalRow
        })
      },
     
      handleClickUpdata(row)/* 修改 */ {
        // console.log('update_row',row)
        this.resetForm('ruleForm')//重置
        this.resetForm('dynamicValidateForm')
        this.interfaceType = 'update'
        this.dialog.title = '海底光缆修改'
        this.service.get(this.secondaryUrl + '/view', {
              params:{
          id: row.id}
        }).then(res => {
        //   console.log('update',res)
          this.formLabelAlign = res.sealine
          this.dynamicValidateForm.domains= res.sealine.points
        }).catch(err => {
          this.queryData()
        })
        this.dialog.disabled = false;
        this.dialog.visible = true
        this.dialog.showBtn = true
      },
      handleClickMore(row)/* 详情 */ {
        // console.log('row',row)
        this.resetForm('dynamicValidateForm')
        this.resetForm('ruleForm')//重置
        this.interfaceType = 'more'
        this.service.get(this.secondaryUrl + '/view', {
            params:{
          id: row.id}
        }).then(res => {
        //   console.log('详情',res)
          this.formLabelAlign = res.sealine
          this.dynamicValidateForm.domains= res.sealine.points
        }).catch(err => {
          this.queryData()
        })
        this.dialog.visible = true
        this.dialog.title  = '海底光缆详情'
        this.dialog.disabled = true;
        this.dialog.showBtn = false
      },
      handleClickDelete(row)/* 删除 */ {
        console.log('删除row',row)
        this.service.get(this.secondaryUrl + '/delete', {
            params:{
          id: row.id}
        }).then(req => {
          this.queryData()
          console.log('success')
        }).catch(err => {
          this.queryData()
        })
      },
      handleClose(done)/* 点击遮罩触发 */ {
        done() //取消弹框
      },
      handleClickView(row) {
        console.log('查看地图')
        this.dialog.showMap = true
        if (row.points) {
          this.mapData = [...row.points]
        }
        // this.mapData = [row]
        console.log(this.mapData)
      },
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      },
      handleRules(formName, formName2)/* 提交表单 */ {
        this.$refs[formName].validate((valid) => {
          console.log(valid)
          if (valid) {
              this.$refs[formName2].validate((valid) => {
                if (valid) {
                  this.submitForm();
                } else {
                  console.log('error submit!!');
                  return false;
                }
              });
              // console.log()
            }else{
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitForm()/* 提交表单 */ {
            this.formLabelAlign.points=this.dynamicValidateForm.domains,
            console.log(this.formLabelAlign)
            this.service.post(this.secondaryUrl + '/' + this.interfaceType, {
              ...this.formLabelAlign
            }).then(res => {
              if(res.error===0){
                this.dialog.visible = false
              }
              this.queryData()
            }).catch(err => {
              this.$message({ message: err.msg, type: 'error' })
              console.log(err)
              this.queryData()
            })
      },
      queryData() /* 查询数据 */ {
        this.service.get(this.secondaryUrl + '/page', {
           params:{
            pageNumber: this.listQuery.pageNo,
            pageSize: this.listQuery.pageSize,
            name: this.listQuery.name}
        }).then(req => {
        //   console.log('查询数据',req)
          this.tableData = req.page.list
          this.total = req.page.totalRow     
        })
      },
    }
  }
</script>
<style lang="less" scoped>

    @media screen and (max-width: 1366px) {
        /deep/.videoDialog {
            width: 45% !important;
        }
    }
    @media screen and (min-width: 1367px) {
        /deep/.videoDialog {
            width: 30% !important;
        }
    }

    #target {
        #search{
            /deep/.el-input__inner {
                background: #0D2037;
                /*border:#66B1FF solid 1px;*/
            }

            /deep/.el-input-group__append {
                background: #66B1FF;
                /*border: #66B1FF 2px solid;*/
                color: white;
            }
        }


    }
</style>
<style scoped lang="less">
@import '../../assets/css/object.less';
    #target {
        #target_main {
            /*padding: 1rem 2rem;*/
            display: flex;
            /*height: calc(100% - 2rem);*/

            #target_right {
                /*margin-left: 2rem;*/
                flex: 1;
                /*overflow: hidden;*/

                /deep/.el-dialog__wrapper{
                    overflow: hidden;
                }
                /deep/.videoDialog{
                    height: 100%;
                    max-height: 70%;
                    .el-dialog__body {
                        overflow-y: scroll;
                        /*max-height: 350px;*/
                        height:  calc(90% - 130px);
                    }
                }
               
                /deep/.demo-dynamic{
                    width: 90%;
                    margin: 0 auto;
                    margin-top: -62px;
                }
            }
        }
    }


</style>
