<template>
    <div id="target">
        <div id="target_main">
                <div id="target_right">
                    <div class="app-container" >
                    <div class="container-title" >
                        <h3>铁塔</h3>
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
                        width="30%"
                        custom-class="videoDialog"
                        :before-close="handleClose">
                    <el-form label-position="left" label-width="80px" :model="formLabelAlign" ref="ruleForm" :rules="formRules">
                        <el-form-item v-for="item in addData" :key="item.id" :label="item.name" :prop="item.prop">
                            <el-input v-model="formLabelAlign[item.prop]" v-if="item.id!=17" :disabled="dialog.disabled" ></el-input>  
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
                    <leaflet-tablemap :mapData="mapData"  markerType="tower" :option="{strokeColor:'blue ', strokeWeight:2, strokeOpacity:0.5}"></leaflet-tablemap>
                </el-dialog>
            </div>
        </div>
  </div>
    </div>
</template>

<script>
  import {formRules} from '../../utils/formRules';
  import PaginationTab from '../../components/PaginationTable'
  // import VideoView from '../../../../zfwtowperiod/src/components/VideoView'
 import LeafletTableMap from '../../../src/components/LeafletTableMap'
  export default {
    name: 'tower',
    components: {
      PaginationTab,
      // VideoView,
       'leaflet-tablemap':LeafletTableMap
    },
    data() {
      return {
        secondaryUrl: '/tower',
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
          stationName: '',
          stationId: '',
          longitude: '',
          latitude: '',
          area: '',
          bulidDate:'',
          coverage:'',
          launchPower:'',
          level:'',
          skyLineAzimuth:'',
          skyLineCoverage:'',
          skyLineHeight:'',
          skylinePitch:'',
          towerHeight:'',
          transType:'',
          type:'',
          health:'',
        },
        addData: [
          {id: 0, prop: 'station_name', name: '铁塔名称'},
          {id: 1, prop: 'station_id', name: '编号'},
          {id: 2, prop: 'lon', name: '经度'},
          {id: 4, prop: 'lat', name: '纬度'},
          {id: 5, prop: 'area', name: '地区'},
          {id: 6, prop: 'bulid_date', name: '修建时间'},
          {id: 7, prop: 'coverage', name: '覆盖距离'},
          {id: 8, prop: 'launch_power', name: '发射功率'},
          {id: 9, prop: 'level', name: '等级'},
          {id: 10, prop: 'sky_line_azimuth', name: '天线方位角'},
          {id: 11, prop: 'sky_line_coverage', name: '天线范围'},
          {id: 12, prop: 'sky_line_height', name: '天线高度'},
          {id: 13, prop: 'skyline_pitch', name: '天线倾角'},
          {id: 14, prop: 'tower_height', name: '铁塔高度'},
          {id: 15, prop: 'trans_type', name: '传输方式'},
          {id: 16, prop: 'type', name: '类型'}
        ],
        mapData:[],
        page: 1,
        limit: 10,
        total: 100,
        imageUrl: '',
        searchTxt:'',
        tableData: [],
        tabTop: [
          { id: 1, prop: 'station_name', name: '名称' },
          // { id: 1, prop: 'name', name: '所属资源站' },
          { id: 2, prop: 'station_id', name: '编号' },
          { id: 3, prop: 'lon', name: '经度' },
          { id: 4, prop: 'lat', name: '纬度' }
        ],
         uploadUrl:'tower/pushExcel',
            fileList: [],
      }
    },
    mounted() {
      this.queryData()
      // this.loadStationData()
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
            },
            data: form,
          }).then((res) => {
            // console.log("返回数据：",res);
            //  console.log("返回数据状态码：",res.data.error);
            if(res.data.error==0){
              //  this.$message.success('成功导入船舶离线数据' + '!');
               this.$alert('成功导入1条船舶离线数据!');
            }
          });
      } ,  
      loadStationData(){
        this.service.get('/station/findAll').then(res=>{
          this.stationData=res.data
          console.log(res)
        })
        this.service.get('/project/aisUrlType').then(res=>{
          this.urlTypeSelect=res.data
          console.log(res)
        })
      },
      add() {
        this.interfaceType = 'add'
        this.formLabelAlign = {}
        this.dialog.visible = true
        this.dialog.title = '铁塔添加'
        this.dialog.disabled=false
        this.dialog.showBtn = true;
        this.resetForm('ruleForm')//重置
      },
      handleClose(done) {
        done()
      },
      loadIslandList() {

        this.service.get('/tower/page').then(res => {
          // console.log(res.data)
          this.islandList = res.page.list
        })
      },
      handleSizeChange(val)/* 调整分页每页条数 */ {
        this.limit = val
        console.log(`每页 ${val} 条`)
        this.service.get(this.secondaryUrl + '/page', {
          'page': this.page,
          'limit': this.limit,
          'condition': this.searchTxt
        }).then(req => {
          console.log(req)
          this.tableData = req.page.list
          this.total = req.page.totalRow
          // let islandName = {}
          // for (let i of this.islandList) {//将岛屿id 与 name 提取
          //   islandName[i.id] = i.name
          // }
          // // console.log(islandName)
          for (let d of this.tableData) {
            d['position'] = '经度' + d.longitude + ' 纬度' + d.latitude
            // d['islandName'] = islandName[d['attributionId']]
            // if (d['status']) {
            //   d['status2'] = '正常'
            // } else {
            //   d['status2'] = '异常'
            // }
          }
        })
      },
      handleCurrentChange(val) /* 跳页 */ {
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
          // let islandName = {}
          // for (let i of this.islandList) {//将岛屿id 与 name 提取
          //   islandName[i.id] = i.name
          // }
          // // console.log(islandName)
          for (let d of this.tableData) {
            d['position'] = '经度' + d.longitude + ' 纬度' + d.latitude
            // d['islandName'] = islandName[d['attributionId']]
            // if (d['status']) {
            //   d['status2'] = '正常'
            // } else {
            //   d['status2'] = '异常'
            // }
          }
        })
      },
      handleClickUpdata(row)/* 修改 */ {
        console.log(row)
        this.resetForm('ruleForm')//重置
        this.interfaceType = 'update'
        this.formLabelAlign = {...row}
        this.dialog.title = '铁塔修改'
        // if (row.imgUrl) {
        //   this.addPic = row.imgUrl
        //
        // } else {
        //   // this.addPic = require('../../../assets/政法委无人岛日间/Page 13基础设施-雷达_slices/编组 9.png')
        // }
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
        this.dialog.title  = '铁塔详情'
        this.dialog.disabled = true;
        this.dialog.showBtn = false
      },
      handleClickDelete(row)/* 删除 */ {
        console.log(row)
        this.service.get(this.secondaryUrl + '/delete', {
          id: row.stationId
        }).then(req => {
          // this.tableData = req.data.list;
          this.queryData()
          console.log('success')
        }).catch(err => {
          this.queryData()
          //  return false;
        })
      },
      handleClickView(row) {
        console.log('查看地图')
        this.dialog.showMap = true
        // if (row.waters) {
        //   row = { ...row, ...row.waters }
        // }
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
            // console.log(this.formLabelAlign)
            this.service.post(this.secondaryUrl + '/' + this.interfaceType, {
              ...this.formLabelAlign
            }).then(res => {
              // console.log(res)

              // this.tableData = req.data.list;
              if(res.code===0){
                this.dialog.visible = false
              }
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
        this.service.get(this.secondaryUrl + '/page', {
          'page': this.page,
          'limit': this.limit,
          'condition': this.searchTxt
        }).then(req => {
          // console.log(req)
          this.tableData = req.page.list
          this.total = req.page.totalRow
          // let islandName = {}
          // for (let i of this.islandList) {//将岛屿id 与 name 提取
          //   islandName[i.id] = i.name
          // }
          // // console.log(islandName)
          for (let d of this.tableData) {
            d['position'] = '经度' + d.longitude + ' 纬度' + d.latitude
            // d['islandName'] = islandName[d['attributionId']]
            // if (d['status']) {
            //   d['status2'] = '正常'
            // } else {
            //   d['status2'] = '异常'
            // }
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
