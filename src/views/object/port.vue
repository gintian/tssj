<template>
    <div id="target">
        <div id="target_main">
            <div id="target_right">
                <div class="app-container" >
                  <div class="container-title" >
                    <h3>泊位</h3>
                    <div>
                            <el-button class="filter-item" type="primary"  style=" margin-right: 40px;" >
                                导入
                            </el-button>
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
                                <el-form label-position="left" label-width="80px" :model="formLabelAlign" ref="ruleForm" :rules="formRules">
                                    <el-form-item v-for="item in addData" :key="item.id" :label="item.name" :prop="item.prop">
                                        <el-input v-model="formLabelAlign[item.prop]" v-if="item.id<3||item.id>6&&item.id<16" :disabled="dialog.disabled" ></el-input>
                                        <div>
                                            <el-select v-model="formLabelAlign.inPort" placeholder="请选择" v-if="item.id==3"  :disabled="dialog.disabled" >
                                                <el-option
                                                        v-for="i in portData"
                                                        :key="i.id"
                                                        :label="i.name"
                                                        :value="i.id">
                                                </el-option>
                                            </el-select>
                                            <el-select v-model="formLabelAlign.status" placeholder="请选择" v-if="item.id==4" :disabled="dialog.disabled" >
                                                <el-option
                                                        v-for="i in statusSelect"
                                                        :key="i.value"
                                                        :label="i.label"
                                                        :value="i.value">
                                                </el-option>
                                            </el-select>

                                            <!-- <el-select v-model="formLabelAlign.showed" placeholder="请选择" v-if="item.id==5"  :disabled="dialog.disabled" >
                                                <el-option
                                                        v-for="i in isShowSelect"
                                                        :key="i.value"
                                                        :label="i.label"
                                                        :value="i.value">
                                                </el-option>
                                            </el-select> -->
                                            <!-- <el-select v-model="formLabelAlign.used" placeholder="请选择" v-if="item.id==6"  :disabled="dialog.disabled" >
                                                <el-option
                                                        v-for="i in isUsedSelect"
                                                        :key="i.value"
                                                        :label="i.label"
                                                        :value="i.value">
                                                </el-option>
                                            </el-select> -->
                                            <!-- <el-select v-model="formLabelAlign.health" placeholder="请选择" v-if="item.id==16"  :disabled="dialog.disabled" >
                                                <el-option
                                                        v-for="i in healthList"
                                                        :key="i.value"
                                                        :label="i.label"
                                                        :value="i.value">
                                                </el-option>
                                            </el-select>
                                            <el-select v-model="formLabelAlign.duty" placeholder="请选择" v-if="item.id==17"  :disabled="dialog.disabled" >
                                                <el-option
                                                        v-for="i in dutyList"
                                                        :key="i.value"
                                                        :label="i.label"
                                                        :value="i.value">
                                                </el-option>
                                            </el-select> -->
                                        </div>
                                    </el-form-item>

                                </el-form>
                                <span slot="footer" class="dialog-footer" v-show="dialog.showBtn">
                    <el-button @click="dialog.visible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
                    </span>
                            </el-dialog>
                            <div  class="select_query">
                                <el-input  placeholder="请输入内容" class="filter-item" v-model="searchTxt"  style="width: 200px;" />
                                    <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="queryData">搜索 </el-button>
                                <!-- </el-input> -->
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
          longitude: '',
          latitude: '',
          inPort: '',
          status: '',
          showed:'',
          used:'',
          ability:'',
          capacity:'',
          contact:'',
          depth:'',
          description:'',
          length:'',
          org_name:'',
          telphone:'',
          uses:'',
          health:'',
          duty:'',
        },
        addData: [
          {id: 0, prop: 'name', name: '名称'},
          {id: 1, prop: 'lon', name: '经度'},
          {id: 2, prop: 'lat', name: '纬度'},
          {id: 3, prop: 'jettyId', name: '所在码头编号'},
          {id: 11, prop: 'jettyName', name: '所在码头名称'},
          {id: 4, prop: 'status', name: '状态'},
          {id: 7, prop: 'ability', name: '兼靠能力'},
          {id: 8, prop: 'capacity', name: '靠泊能力'},
          {id: 9, prop: 'contact', name: '联系人'},
          {id: 10, prop: 'depth', name: '前沿水深'},
          {id: 12, prop: 'length', name: '泊位长度'},
          {id: 13, prop: 'org_name', name: '企业名称'},
          {id: 14, prop: 'telphone', name: '联系电话'},
          {id: 15, prop: 'uses', name: '用途'},
        ],
        dutyList: [{
          value: true,
          label: '是'
        }, {
          value: false,
          label: '否'
        }],
        healthList: [{
          value: 0,
          label: '正常'
        }, {
          value: 1,
          label: '待维护'
        },{
          value: 2,
          label: '无法使用'
        }],
        statusSelect: [{
          value: false,
          label: '正常'
        }, {
          value: true,
          label: '异常'
        }],
        urlTypeSelect:[],
        portData:[],
        isShowSelect:[{
          value: true,
          label: '显示'
        }, {
          value: false,
          label: '隐藏'
        }],
        isUsedSelect:[{
          value: true,
          label: '使用'
        }, {
          value: false,
          label: '废弃'
        }],

        mapData:[],

        // listQuery:{
            // pageNumber:1, //当前页面
            // pageSize:10, //条数
            // name:'' , //查询条件
        // },
        page: 1,
        limit: 10,
        total: 100,
        imageUrl: '',
        searchTxt:'',
        tableData: [],
        tabTop: [
          { id: 1, prop: 'name', name: '名称' },
          // { id: 1, prop: 'name', name: '所属资源站' },
          { id: 2, prop: 'lon', name: '经度' },
          { id: 3, prop: 'lat', name: '纬度' },
          { id: 4, prop: 'status2', name: '运行状态' }
        ]
      }
    },
    mounted() {
      this.queryData()
      this.loadportData()
      // this.queryData();
    },
    methods: {
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
            // this.pageSize = val;
            // this.loadportData();
        this.limit = val
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
        // this.pageNo = val;
        // this.loadportData();
        this.page = val
        console.log(`当前页: ${val}`)
        this.service.get(this.secondaryUrl + '/page', {
          'page': this.page,
          'limit': this.limit,
          'condition': this.searchTxt
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
        this.service.get(this.secondaryUrl + '/delete', {
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
            console.log(this.formLabelAlign)
            this.service.post(this.secondaryUrl + '/' + this.interfaceType, {
              ...this.formLabelAlign
            }).then(res => {
              console.log(res)
              if(res.code===0){
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
          'page': this.page,
          'limit': this.limit,
          'condition': this.searchTxt
        }).then(req => {
          console.log(req)
          this.tableData = req.page.list
          this.total = req.page.totalRow
          for (let d of this.tableData) {
            d['position'] = '经度' + d.longitude + ' 纬度' + d.latitude
            if (!d['status']) {
              d['status2'] = '正常'
            } else {
              d['status2'] = '异常'
            }
          }
        })
      },
      imgUp(e) {//图片上传
        var files = this.$refs.avatarInput.files

        // let pic = this.$refs.pic
        let can = this.$refs.can
        console.log(files[0].name)

        let imgStr = /\.(jpg|jpeg|png|bmp|BMP|JPG|PNG|JPEG)$/
        if (!imgStr.test(files[0].name)) {
          this.$message.error('只能上传图片!')
          // alert("文件不是图片类型");
          return false
        } else {
          this.formLabelAlign.imgFileName = files[0].name
          let img1 = new Image()
          img1.src = URL.createObjectURL(files[0])
          let context = can.getContext('2d')

          let _this = this

          img1.onload = function() {
            var nw = img1.naturalWidth
            var nh = img1.naturalHeight
            can.setAttribute('width', nw + 'px')
            can.setAttribute('height', nh + 'px')
            can.setAttribute('opacity', '0')
            //绘制进canvas
            context.drawImage(img1, 0, 0, nw, nh)
            //二进制流转化函数
            let bin = can.toDataURL('image/jpeg')
            //二进制流传入“显示图片”
            // pic.src = bin;
            _this.addPic = bin
            _this.formLabelAlign.imgFile = bin
          }

          // console.log(this.formLabelAlign)
        }

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
                    // height: 100%;
                    // height: 600px;
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
