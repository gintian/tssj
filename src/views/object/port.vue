<template>
    <div id="target">
        <div id="target_main">
            <div id="target_right">
                <div class="app-container" >
                  <div class="container-title" >
                    <h3>泊位</h3>
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
                            <el-button type="primary"  class="filter-item"  @click="add" icon="el-icon-plus" >添加
                            </el-button>
                            <el-dialog
                                    :title=dialog.title
                                    :visible.sync=dialog.visible
                                    custom-class="videoDialog"
                                    width="30%"
                                    top='9vh'
                                    :before-close="handleClose">
                                    <!-- 控制input的显隐v-if="item.id<14"  -->
                                <el-form label-position="left" label-width="80px" :model="formLabelAlign" ref="ruleForm" :rules="formRules">
                                    <el-form-item v-for="item in addData" :key="item.id" :label="item.name" :prop="item.prop">
                                        <el-input v-model="formLabelAlign[item.prop]"  v-if="item.id<5||item.id>5&&item.id<14" :disabled="dialog.disabled" ></el-input>
                                        <div>
                                            <el-select v-model="formLabelAlign.status" placeholder="请选择" v-if="item.id==5" :disabled="dialog.disabled" >
                                                <el-option
                                                        v-for="i in statusSelect"
                                                        :key="i.value"
                                                        :label="i.label"
                                                        :value="i.value">
                                                </el-option>
                                            </el-select>
                                        </div>
                                    </el-form-item>
                                </el-form>
                                <span slot="footer" class="dialog-footer" v-show="dialog.showBtn">
                                  <el-button @click="dialog.visible = false">取 消</el-button>
                                  <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
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
                        :isDelete=true
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
                    <leaflet-tablemap :mapData="mapData"  markerType="port" :option="{strokeColor:'blue ', strokeWeight:2, strokeOpacity:0.5}"></leaflet-tablemap>
                </el-dialog>
            </div>
        </div>
     </div>
    </div>
</template>

<script>
  import {formRules} from '../../utils/formRules';
  import PaginationTab from '../../components/PaginationTable'
//   import TableMap from '../../../src/components/TableMap'
import LeafletTableMap from '../../../src/components/LeafletTableMap'
  export default {
    name: 'port',
    components: {
      PaginationTab,
      // VideoView,
    //   'table-map':TableMap
    'leaflet-tablemap':LeafletTableMap
    },
    data() {
      return {
        secondaryUrl: '/berth',
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
          lon: '',
          lat: '',
          jettyId: '',
          jettyName:'',
          status: '',
          ability:'',
          capacity:'',
          contact:'',
          depth:'',
          // description:'',
          length:'',
          org_name:'',
          telphone:'',
          uses:'',
          // health:'',
          // duty:'',
        },
        addData: [
          {id: 0, prop: 'name', name: '名称'},
          {id: 1, prop: 'lon', name: '经度'},
          {id: 2, prop: 'lat', name: '纬度'},
          {id: 3, prop: 'jettyId', name: '所在码头编号'},
          {id: 4, prop: 'jettyName', name: '所在码头名称'},
          {id: 5, prop: 'status', name: '状态'},
          {id: 6, prop: 'ability', name: '兼靠能力'},
          {id: 7, prop: 'capacity', name: '靠泊能力'},
          {id: 8, prop: 'contact', name: '联系人'},
          {id: 9, prop: 'depth', name: '前沿水深'},
          {id: 10, prop: 'length', name: '泊位长度'},
          {id: 11, prop: 'org_name', name: '企业名称'},
          {id: 12, prop: 'telphone', name: '联系电话'},
          {id: 13, prop: 'uses', name: '用途'},
        ],
        statusSelect: [{
          value: false,
          label: '正常'
        }, {
          value: true,
          label: '异常'
        }],
        // urlTypeSelect:[],
        portData:[],
        mapData:[],

        listQuery:{
            pageNumber:1, //当前页面
            pageSize:10, //条数
            name:'' , //查询条件
        },
        total: 100,
        imageUrl: '',
        tableData: [],
        tabTop: [
          { id: 1, prop: 'name', name: '名称' },
          { id: 2, prop: 'lon', name: '经度' },
          { id: 3, prop: 'lat', name: '纬度' },
          { id: 4, prop: 'status2', name: '运行状态' }
        ],
         uploadUrl:'berth/pushExcel',
          fileList: [],
      }
    },
    mounted() {
      this.queryData()
      this.loadportData()
      // this.queryData();
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
              'my-session':this.$store.getters.getJSESSIONID
            },
            data: form,
          }).then((res) => {
            // console.log("返回数据：",res);
            //  console.log("返回数据状态码：",res.data.error);
            if(res.data.error==0){
              //  this.$message.success('成功导入船舶离线数据' + '!');
              //  this.$alert('成功导入1条船舶离线数据!');
               this.$message({
                type: 'success',
                message: res.data.msg,
                offset:500
              });
              // this.$notify({
              //   type: 'success',
              //   message: '成功导入1条船舶离线数据!'
              //   //  duration: 0
              //   //  position: 'bottom-left' 默认右上角
              // });
            }
          });
      } ,  
      // 数据写入excel
    download() {
      // var that = this;
      require.ensure([], () => {
        // eslint-disable-next-line camelcase,global-require
        const { export_json_to_excel } = require('@/vandor/export2Excel.js');
        const tHeader = ['序号', '名称','经度','纬度','运行状态']; // 表头
        const filterVal = ['id', 'name','lon','lat','status2']; // 值
        const list = this.tableData;
        // console.log('后端返回的数据', list);
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '泊位数据表');
      });
    },
    // 格式转换
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
      loadportData(){
        this.service.get('/berth/page',{ params:{
            pageNumber: this.pageNo,
            pageSize: this.pageSize,
            name: this.name}}).then(res=>{
          this.portData=res.page.list
          console.log(res)
        })
      },
      add() {
        this.interfaceType = 'save'
        this.formLabelAlign = {}
        this.dialog.visible = true
        this.dialog.title = '码头泊位添加'
        this.dialog.disabled=false
        this.dialog.showBtn = true;
        this.resetForm('ruleForm')//重置
      },
      handleClose(done) {
        done()
      },
   
      handleSizeChange(val)/* 调整分页每页条数 */ {
        this.listQuery.pageSize=val
        console.log(`每页 ${val} 条`)
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
        console.log(`当前页: ${val}`)
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
        console.log(row)
        this.resetForm('ruleForm')//重置
        this.interfaceType = 'update'
        this.formLabelAlign = {...row}
        this.dialog.title = '码头泊位修改'
        this.dialog.disabled = false;
        this.dialog.visible = true
        this.dialog.showBtn = true
      },
      handleClickMore(row)/* 详情 */ {
        console.log(row)
        this.resetForm('ruleForm')//重置
        this.interfaceType = 'more'
        this.formLabelAlign = {...row}
        this.dialog.visible = true
        this.dialog.title  = '码头泊位详情'
        this.dialog.disabled = true;
        this.dialog.showBtn = false
      },
      handleClickDelete(row)/* 删除 */ {
        console.log(row)
        // console.log(row.id)
        this.service.get(this.secondaryUrl + '/delete?id='+row.Id, 
          // params:{
          // id: row.id}
        ).then(res => {
        console.log('删除',res)
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
         this.mapData = row;
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
            console.log('提交数据',this.formLabelAlign)
            this.service.post(this.secondaryUrl + '/' + this.interfaceType, {
              ...this.formLabelAlign
            }).then(res => {
              console.log(res)
              if(res.error===0){
                this.dialog.visible = false
              }
              this.queryData()
            }).catch(err => {
              this.$message({ message: err.msg, type: 'error' })
              console.log(err)
              this.queryData()
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      queryData() /* 查询数据 */ {
        //    this.loadportData();
        this.service.get(this.secondaryUrl + '/page', {
          params:{
            pageNumber: this.listQuery.pageNo,
            pageSize: this.listQuery.pageSize,
            name: this.listQuery.name}
        }).then(req => {
          // console.log('查询数据',req)
          this.tableData = req.page.list
          this.total = req.page.totalRow
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

<style scoped lang="less">
 @import '../../assets/css/object.less';
    #target {
        #target_main {
            display: flex;
            #target_right {
                flex: 1;
                /deep/.el-dialog__wrapper{
                    overflow: hidden;
                }
                /deep/.videoDialog{
                    overflow: auto;
                    max-height: 70%;
                    .el-dialog__header {
                        background: white;
                        position: fixed;
                        z-index: 9999;
                        width: 30%;
                    }
                    .el-dialog__body {
                            margin-top: 40px;
                        // overflow-y: scroll;
                        // /*max-height: 350px;*/
                        // height:  calc(90% - 130px);
                    }
                    .el-dialog__footer{
                       position: -webkit-sticky;
                        position: sticky;
                        top: 0;
                        // position:sticky;
                        //   position: fixed;
                        // z-index: 99999999999;
                        // width: 30%;
                    }
                }
            }
        }
    }
</style>
