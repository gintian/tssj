<template>
 <div class="app-container" >
    <div class="container-title" >
        <h3  v-if="importVideo">摄像头</h3>
        <h3  v-if="!importVideo">视频列表</h3>
        <div  style="display: flex;justify-content: space-between;"  v-if="importVideo">
                <el-upload
                      class="upload-demo"
                       ref="upload"
                      :http-request="uploadSectionFile" 
                      accept=".xls"
                      multiple
                      :action="uploadUrl"
                      :file-list="fileList1">
                      <el-button class="filter-item" type="primary"  style=" margin-right: 40px;" @click="submitUpload"  >
                          导入
                      </el-button>
                 </el-upload>
                <el-button class="filter-item" type="primary"  @click="download()" >
                    导出
                </el-button>
         </div>
     </div>
    <div  class="container-middle" >
      <div>
          <el-button class="filter-item"  @click="importVideo=true"  v-if="!importVideo">返回</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-plus"  @click="AddVideo()" v-if="!importVideo">添加</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd()" v-if="importVideo" >添加</el-button>
      </div>
          <div class="select_query">
            <el-input v-model="listQuery.name" placeholder="输入名称" style="width: 200px;" class="filter-item" @input="query()"  v-if="importVideo"/>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="query()"   v-if="importVideo"> 搜索</el-button> 

            <el-input v-model="VideoList.name" placeholder="输入名称" style="width: 200px;" class="filter-item" @input="Videolist()"   v-if="!importVideo"/>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="Videolist()"   v-if="!importVideo"> 搜索</el-button>   
          </div>
    </div>

    <el-table
    v-if="importVideo"
    :data="tableData"
    style="width: 100%"
    :header-cell-style="tableHeaderColor">
    <el-table-column  prop="id"  label="序号" align="center"> </el-table-column>
    <el-table-column align="center" prop="name" label="名称"></el-table-column>  
    <el-table-column prop="lat,lon" label="位置" align="center"  min-width="90%">
       <template slot-scope="scope">   
            <span> 经度：{{scope.row.lon}}</span><br>
            <span> 纬度：{{scope.row.lat}}</span>
       </template>
    </el-table-column>
     <el-table-column align="center" prop="area" label="区域"></el-table-column>  
     <el-table-column  align="center" prop="status"  label="运行状态">
        <template slot-scope="scope">
            <span v-if="scope.row.status == true" style="color:red;">停用</span>
            <span v-if="scope.row.status == false">启动</span>
        </template>
    </el-table-column>
    <el-table-column  align="center" label="视频列表">
        <template slot-scope="scope">
            <el-button   @click="handleVideo(scope.row)" type="text" size="small" class="btn-upt" >查看</el-button>
       </template>
    </el-table-column>
    <el-table-column  label="查看地图"  align="center">
       <template slot-scope="scope">
          <el-button  @click="handleClickView(scope.row)" type="text" size="small" class="btn-upt">查看</el-button>
        </template>
    </el-table-column>

    <el-table-column align="center"  prop="videoUrl"  label="视频流地址"></el-table-column>
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button
          type="text" size="small" class="btn-upt" @click="handleUpdate(scope.$index, scope.row)"  >编辑</el-button>
        <el-button
          type="text" size="small" class="btn-upt" @click="handleDel(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

   <el-table
    v-if="!importVideo"
    :data="videoData"
    style="width: 100%"
    :header-cell-style="tableHeaderColor">
    <el-table-column
      align="center"
      prop="name"
      label="视频名称">
    </el-table-column>
    <el-table-column align="center" label="视频播放">
      <template slot-scope="scope">
            <el-button   @click="VideoShow(scope.row)" type="text" size="small" class="btn-upt" >查看</el-button>
       </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button
          type="text" size="small" class="btn-upt" @click="VideoUpdate(scope.$index, scope.row)"  >编辑</el-button>
        <el-button
          type="text" size="small" class="btn-upt" @click="VideoDel(scope.row)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
    <!-- 播放视频信息 -->
     <el-dialog :title="videotitle" :visible.sync="VideoshowedDialog"   custom-class="videoshowed"   width="600px"   v-if="!importVideo">
        <video :src="videosrc"   controls="controls"  style="width:100%; height：100%; object-fit: fill;"></video>
    </el-dialog> 
 <!-- 新增视频功能 -->
     <el-dialog title="添加视频" :visible.sync="AddVideodialog"  custom-class="addDialog"    width="600px"   v-if="!importVideo">
      <el-form   :model="AddVideoForm" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;"  :rules="formRules">
          <el-form-item label="名称" prop="name" >
              <el-input v-model="AddVideoForm.name" />
            </el-form-item>     
          <el-form-item label="视频文件" >
               <el-upload
                      :on-success="handleVodUploadSuccess"
                      :on-remove="handleVodRemove"
                      :before-remove="beforeVodRemove"
                      :on-exceed="handleUploadExceed"
                      :file-list="fileList"
                      :action="BASE_API+'/video/upload'"
                      :limit="1"
                      class="upload-demo">
                <el-button size="small" type="primary">上传视频</el-button>
                 <!-- <el-upload
                      class="upload-demo"
                       ref="upload"
                      :http-request="uploadVideoFile" 
                      :limit="1"
                      :action="uploadVideoUrl"
                      :file-list="fileList">
                      <el-button class="filter-item" type="primary"  style=" margin-right: 40px;" @click="submitVideoUpload"  >
                          上传视频
                      </el-button> -->
                <el-tooltip placement="right-end">
                    <div slot="content">最大支持1G，<br>
                        支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                        GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                        MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                        SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                    <i class="el-icon-question"/>
                </el-tooltip>
                </el-upload>
            </el-form-item>
          <!-- <el-form-item label="主键id" prop="camer_id">
            <el-input v-model="AddVideoForm.camer_id" />
          </el-form-item>
          <el-form-item label="视频流地址" prop="videoUrl">
            <el-input v-model="AddVideoForm.videoUrl" />
          </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AddVideodialog = false">
          取消
        </el-button>
        <el-button type="primary" @click="AddVideoData()">
          确定
        </el-button>
      </div>
    </el-dialog> 
     <!-- 编辑视频名称 -->
     <el-dialog title="编辑" :visible.sync="VideoTempdialog"     width="600px"   v-if="!importVideo">
      <el-form   :model="VideoTemp" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;"  :rules="formRules">
          <el-form-item label="名称" prop="name" >
              <el-input v-model="VideoTemp.name" />
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="VideoTempdialog = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateName()">
          确定
        </el-button>
      </div>
    </el-dialog> 
    <!-- 删除视频功能 -->
    <el-dialog  :visible.sync="VideoDeldialog"  custom-class="deleteDialog"   width="200px"   v-if="!importVideo">
      <p>确定删除？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="VideoDeldialog = false">
          取消
        </el-button>
        <el-button type="primary" @click="delVideo()">
          删除
        </el-button>
      </div>
    </el-dialog>
<!-- 查看地图弹窗 -->
<el-dialog :visible.sync="dialog.showMap" width="520px" :show-close='false' custom-class="mapDialog">
      <leaflet-tablemap :mapData="mapData"  markerType="camera" :option="{strokeColor:'blue ', strokeWeight:2, strokeOpacity:0.5}"></leaflet-tablemap>
</el-dialog>
 <!-- 新增弹层功能 -->
     <el-dialog title="添加摄像头" :visible.sync="dialogFormVisible1"  custom-class="addDialog"    width="600px"  v-if="importVideo">
      <el-form   :model="addsForm" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;"  :rules="formRules">
          <el-form-item label="名称" prop="name" >
              <el-input v-model="addsForm.name" />
            </el-form-item>     
          <el-form-item label="经度" prop="lon">
              <el-input v-model="addsForm.lon" />
            </el-form-item>
          <el-form-item label="纬度" prop="lat">
            <el-input v-model="addsForm.lat" />
          </el-form-item>
          <el-form-item label="区域" prop="area">
            <el-input v-model="addsForm.area" />
          </el-form-item>
          <el-form-item label="视频流地址" prop="videoUrl">
            <el-input v-model="addsForm.videoUrl" />
          </el-form-item>
          <el-form-item label="运行状态" prop="status">
              <!-- <el-input v-model="addsForm.status" /> -->
              <el-select  v-model="addsForm.status"  class="selectInput"  :popper-append-to-body="false"  style="width: 301px;">
                  <el-option   v-for="item in options"  :value="item.value"   :label="item.label" :key="item.value">        
                  </el-option>
              </el-select>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">
          取消
        </el-button>
        <el-button type="primary" @click="AddData()">
          确定
        </el-button>
      </div>
    </el-dialog> 

  <!-- 编辑弹层功能 -->
     <el-dialog title="编辑摄像头" :visible.sync="dialogFormVisible"     width="600px"  v-if="importVideo">
      <el-form ref="updateForm"  :model="temp" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;"  :rules="formRules">
          <el-form-item label="名称" prop="name" >
              <el-input v-model="temp.name" />
            </el-form-item>
          <el-form-item label="经度" prop="lon">
              <el-input v-model="temp.lon" />
            </el-form-item>
          <el-form-item label="纬度" prop="lat">
            <el-input v-model="temp.lat" />
          </el-form-item>
          <el-form-item label="视频流地址" prop="videoUrl">
            <el-input v-model="temp.videoUrl" />
          </el-form-item>
          <el-form-item label="区域" prop="area">
              <el-input  v-model="temp.area" />
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确定
        </el-button>
      </div>
    </el-dialog> 

    <!-- 删除弹层功能 -->
    <el-dialog  :visible.sync="dialogDelVisible"  custom-class="deleteDialog"   width="200px"  v-if="importVideo">
      <p>确定删除？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="delData()">
          删除
        </el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination   v-if="importVideo"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNo"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="rows">
    </el-pagination>
      <!-- 视频分页 -->
    <el-pagination   v-if="!importVideo"
      @size-change="videoSizeChange"
      @current-change="videoCurrentChange"
      :current-page="VideoList.pageNo"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="VideoList.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="videoTotal">
    </el-pagination>
 </div>
</template>

<script>

import LeafletTableMap from '../../../src/components/LeafletTableMap'
import {formRules} from '../../utils/formRules';
export default {
  name: 'ComplexTable',
  components:{'leaflet-tablemap':LeafletTableMap},
  data() {
    return {
    fileList: [],//上传视频文件列表
    uploadVideoUrl:'video/upload',
     BASE_API: 'http://192.168.1.36:8093' ,
     video: {
        title: '',
        sort: 0,
        free: false,
        videoSourceId: '',
        videoOriginalName: '',
     },
      importVideo:true,
      wharf:null,
      formRules:formRules,
      videoData:[],  //视频列表
     dialog: {
          visible: false,
          title: '',
          showBtn:true,
          showMap:false,
          disabled:false
        },
        delid:'',
        videoId:'',
      mapData:{},
      tableData: [], //表格展示的数据
      pages:1, //总页数
      rows:1, //总条数
      listQuery:{
        pageNumber:1, //当前页面
        pageSize:10, //条数
        name:''  //查询条件
      },
      VideoList:{
        id:"",
        pageNumber:1, 
        pageSize:10, 
        name:''  //查询条件
      },
      VideoTemp:{
          id:'',
         name:'',
      },
      videosrc:'',
      videotitle:'',
      AddVideodialog:false,
      VideoshowedDialog:false,  //视频播放
      VideoTempdialog:false,  //编辑视频弹层
      VideoDeldialog:false, //删除视频弹层
      dialogDelVisible:false, //删除弹层显示与隐藏
      dialogFormVisible:false, //编辑弹层显示与隐藏
      dialogFormVisible1:false, //新增弹层显示与隐藏
      AddVideoForm:{
        name:'',
        camer_id:'',
        videoUrl:'',
        // status:''
      },
      addsForm:{   //新增数据
        name:'',
        lat:'',
        lon:'',
        videoUrl:'',
        status:'',
        area:""
      },

      temp:{  //编辑的表单字段
        id:'',
        name:'',
        lat:'',
        lon:'',
        videoUrl:'',
        status:'',
        area:""
      },
       update:'',
      options:[{
          value: false,
          // label: '正常'
           label: '启动'
        }, {
          value: true,
          // label: '异常'
           label: '停用'
        }],
        uploadUrl:'camera/pushExcel',
       fileList1: [],
    }
  },
  created() {
    this.getList();
    this.Videolist();
  },
  methods: {
 //成功回调
  handleVodUploadSuccess(response, file, fileList) {
    console.log('response',response)
    this.AddVideoForm.videoUrl=response.src
    this.video.videoSourceId = response.data.videoId
    this.video.videoOriginalName = file.name;
},
//修改回掉
editVideo(videoId) {
    this.dialogVideoFormVisible = true
        video.getVideoInfoById(videoId).then(response => {
        this.video = response.data.item
        this.fileList = [{'name': this.video.videoOriginalName}]
    })
},
//视图上传多于一个视频
  handleUploadExceed(files, fileList) {
  this.$message.warning('想要重新上传视频，请先删除已上传的视频')
}, 

beforeVodRemove(file, fileList) {
  return this.$confirm(`确定移除 ${file.name}？`)
},
handleVodRemove(file, fileList) {
  console.log(file)
  vod.removeById(this.video.videoSourceId).then(response=>{
    this.$message({
      type: 'success',
      message: response.message
    })
  })
},
   handleVodRemove(file, fileList) {
    console.log(file)
    vod.removeById(this.video.videoSourceId).then(response => {
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
        this.fileList = []
        this.$message({
            type: 'success',
            message: response.msg
        })
    })
},
// 视频文件导入
    // uploadVideoFile(item){
    //    const fileObj = item.file;
    //     // FormData 对象
    //       const form = new FormData();
    //       // 文件对象
    //     form.append('file', fileObj);  
    //      this.$axios({
    //         method: 'post',
    //         url: 'http://192.168.1.36:8093/'+this.uploadVideoUrl,
    //         headers: {
    //           'Content-Type': 'multipart/form-data',
    //         },
    //         data: form,
    //       }).then((res) => {
    //         // console.log("返回数据：",res);
    //         //  console.log("返回数据状态码：",res.data.error);
    //         if(res.data.error==0){
    //            this.$alert('成功导入1条船舶离线数据!');
    //         }
    //       });
    // },
    // submitVideoUpload(){
    //       this.$refs.upload.submit();
    //   },
     submitUpload(){
          this.$refs.upload.submit();
      },
       // 导入数据
       uploadSectionFile(item){
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
               this.$alert('成功导入1条船舶离线数据!');
            }
          });
      },  
     // 修改table header的背景色
        tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
          if (rowIndex === 0) {
            return 'background-color: #DEE8FE;color: #000;font-weight: 500;'
          }
        }, 
      changeu(val){
      console.log("val",val)
      if(val=="异常"){
        this.temp.status=true
      }else if(val=='正常'){
        this.temp.status=false
        // console.log("this.temp.status",this.temp.status)
      }
    },
    getList(){  //获取数据
         this.service.get( '/camera/page',{
         params:{
          pageNumber: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          name: this.listQuery.name}
         }).then(req => {
          console.log("摄像头数据",req)
          this.tableData = req.page.list
          this.rows=req.page.totalRow
        }) 
    },
   Videolist(){ //视频列表
        this.service.get( '/video/page',{
        params:{
          id:this.VideoList.id,
          pageNumber: this.VideoList.pageNo,
          pageSize: this.VideoList.pageSize,
          name: this.VideoList.name}
         }).then(res => {
          console.log("视频列表数据",res)
          this.videoData = res.page.list
          this.videoTotal=res.page.totalRow
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
    // 数据写入excel
    download() {
      // var that = this;
      require.ensure([], () => {
        // eslint-disable-next-line camelcase,global-require
        const { export_json_to_excel } = require('@/vandor/export2Excel.js');
        const tHeader = ['序号', '名称','纬度','经度','视频流地址','状态']; // 表头
        const filterVal = ['id', 'name','lat','lon','videoUrl','status']; // 值
        const list = this.tableData;
        console.log('后端返回的数据', list);
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '摄像头数据excel');
      });
    },
    // 格式转换
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },

    query(){ //按名称查询
      this.getList();
    },
    handleSubmit(row){
      
    },
    //当前条数变化
    handleSizeChange(val=this.listQuery.pageSize ){
      this.listQuery.pageSize = val;
      this.getList();
    },
    videoSizeChange(val=this.VideoList.pageSize ){
      this.VideoList.pageSize = val;
      this.Videolist();
    },
    //当前页变化
    handleCurrentChange(val=this.listQuery.pageNo){
      this.listQuery.pageNo = val;
      this.getList();
    },
    videoCurrentChange(val=this.VideoList.pageNo){
      this.VideoList.pageNo = val;
      this.Videolist();
    },
    //删除弹层
    handleDel(row){
       this.delid=row.id
      //  console.log("这行数据的id",this.delid) 
      this.temp = {...row};
      this.dialogDelVisible = true; //弹层显示
    },
    //删除提交
    delData(){
      this.service.get( '/camera/delete?id='+this.delid,{     
         }).then(req => {
          console.log("删除摄像头数据",req)
          this.getList();
          this.dialogDelVisible = false;
        }) 
    },
    //编辑视频
    VideoUpdate(index,row){
      this.VideoTemp = Object.assign({}, row);  //获得所有数据显示在编辑信息模态框里面
      this.VideoTempdialog = true; //弹层显示
    },
    VideoDel(row){
      console.log('VideoDel',row)
      this.videoId=row.id
      this.VideoList.id=row.id
      //  console.log("这行数据的id",this.videoId) 
      this.VideoTemp = {...row};
      this.VideoDeldialog = true; //弹层显示
    },
     //删除视频提交
    delVideo(){
       this.service.get( '/video/delete?id='+this.videoId,{     
         }).then(req => {
          console.log("删除视频数据",req)
          this.VideoDeldialog = false;
            this.Videolist();
        }) 
    },
     //编辑弹层
    handleUpdate(index,row){
     this.temp = Object.assign({}, row);  //获得所有数据显示在编辑信息模态框里面
      this.dialogFormVisible = true; //弹层显示
    },
    handleVideo(row){  
      this.importVideo=false
      console.log('handleVideo',row)
      this.AddVideoForm.camer_id=row.id
      this.VideoList.id=row.id
      this.Videolist();
    },
    // 添加摄像头
     handleAdd(){
      this.dialogFormVisible1 = true; //弹层显示
    },
    AddVideo(){
      this.AddVideodialog = true; //弹层显示
    },
    AddVideoData(){
      let userList=this.AddVideoForm;  
        let {name,camer_id,videoUrl} = userList;
          this.service.post('/video/save',this.AddVideoForm).then(res => {
            console.log("新增的视频数据",res)
          this.Videolist(); 
          this.AddVideodialog = false;}
      );
    },
    VideoShow(row){
      console.log('VideoShow',row)
      this.VideoshowedDialog=true
      this.videosrc=this.BASE_API+row.videoUrl
      // console.log(' this.videosrc', this.videosrc)
      this.videotitle=row.name
        this.service.get('/video/view',{
          params:{
            id:row.id}   
       }).then(res => {
          console.log("播放视频信息",res)
      })
    },
     AddData(){
        let userList=this.addsForm;  
        let {name,lat,lon,videoUrl,status,area} = userList;
          this.service.post('/camera/save',this.addsForm).then(res => {
            // console.log("新增的摄像头数据",res)
            this.getList(); 
          this.dialogFormVisible1 = false;}
          );
    },
    // 编辑视频名称
    updateName(){
      this.service.post('/video/update',{
          id:this.VideoTemp.id,
          name:this.VideoTemp.name, 
       }).then(req => {
          console.log("编辑名称信息",req)
          this.Videolist();
          this.VideoTempdialog = false;
      })
    },
    //编辑提交
    updateData(){
       this.service.post('/camera/update',{
          id:this.temp.id,
          name:this.temp.name,
          lat:this.temp.lat,
          lon:this.temp.lon,
          videoUrl:this.temp.videoUrl,
          status:this.temp.status,
          area:this.temp.area,
       }).then(req => {
          console.log("编辑摄像头信息",req)
          this.getList();
          this.dialogFormVisible = false;
      })
    }
  }
}
</script>
<style  lang="less" scoped>
@import '../../assets/css/object.less';
/deep/.videoshowed {
  .el-dialog__header{
        background: #0075EE; 
        height: 40px;
        line-height: 40px;
        padding: 0;
        .el-dialog__title{
          color: white!important;
          padding-left: 20px;
        }
         .el-icon-close{
           color: white!important;
            }
        .el-dialog__headerbtn {
            position: absolute;
            top: 12px;
            right: 20px;
            padding: 0;
            background: 0 0;
            border: none;
            outline: 0;
            cursor: pointer;
            font-size: 16px;
        }
      }  
}
</style>