<template>
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
    <div  class="container-middle" >
          <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd()" >添加</el-button>
          <div class="select_query">
            <el-input v-model="listQuery.name" placeholder="输入名称" style="width: 200px;" class="filter-item" @input="query()"/>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="query()" > 搜索</el-button>   
          </div>
    </div>
    <el-table
    :data="tableData"
    style="width: 100%"
    :header-cell-style="tableHeaderColor">
    <!-- <el-table-column
      prop="id"
      label="序号"
      align="center">
    </el-table-column> -->
    <el-table-column
      align="center"
      prop="station_name"
      label="名称">
    </el-table-column>
    <el-table-column
      align="center"
      prop="station_id"
      label="编号">
    </el-table-column>
    
    <el-table-column prop="lat,lon" label="位置" align="center"  min-width="90%">
       <template slot-scope="scope">   
            <span> 经度：{{scope.row.lon}}</span><br>
            <span> 纬度：{{scope.row.lat}}</span>
       </template>
    </el-table-column>
     <el-table-column
      align="center"
      prop="tower_height"
      label="铁塔高度">
    </el-table-column>

      <el-table-column
      align="center"
      prop="launch_power"
      label="发射功率">
    </el-table-column>

    <el-table-column
      label="查看地图" 
      align="center">
       <template slot-scope="scope">
          <el-button  @click="handleClickView(scope.row)" type="text" size="small" class="btn-upt">查看</el-button>
        </template>
    </el-table-column>
    
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
           <el-button
          type="text" size="small" class="btn-upt"  @click="handleClickMore(scope.row)"  >详情</el-button>
        <el-button
          type="text" size="small" class="btn-upt" @click="handleUpdate(scope.$index, scope.row)"  >编辑</el-button>
        <el-button
          type="text" size="small" class="btn-upt" @click="handleDel(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
<!-- 查看地图弹窗 -->
<el-dialog :visible.sync="dialog.showMap" width="520px" :show-close='false' custom-class="mapDialog">
      <leaflet-tablemap :mapData="mapData"  markerType="tower" :option="{strokeColor:'blue ', strokeWeight:2, strokeOpacity:0.5}"></leaflet-tablemap>
</el-dialog>
 <!-- 新增弹层功能 -->
     <el-dialog title="添加铁塔" :visible.sync="dialogFormVisible1"  custom-class="addDialog"    width="600px">
      <el-form ref="updateForm"  :model="addsForm" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;">
          <el-form-item label="所属区域" prop="area" >
              <el-input v-model="addsForm.area" />
            </el-form-item>     
          <el-form-item label="创建时间" prop="bulid_date">
              <el-input v-model="addsForm.bulid_date" />
            </el-form-item>
          <el-form-item label="覆盖距离" prop="coverage">
            <el-input v-model="addsForm.coverage" />
          </el-form-item>
          <el-form-item label="发射功率" prop="launch_power ">
            <el-input v-model="addsForm.launch_power " />
          </el-form-item>
           <el-form-item label="等级" prop="level " >
              <el-input v-model="addsForm.level " />
            </el-form-item>     
          <el-form-item label="经度" prop="lon">
              <el-input v-model="addsForm.lon" />
            </el-form-item>
          <el-form-item label="纬度" prop="lat">
            <el-input v-model="addsForm.lat" />
          </el-form-item>
          <el-form-item label="天线方位角" prop="sky_line_azimuth">
            <el-input v-model="addsForm.sky_line_azimuth" />
          </el-form-item>
          <el-form-item label="天线方位" prop="sky_line_coverage">
            <el-input v-model="addsForm.sky_line_coverage" />
          </el-form-item>
          <el-form-item label="天线挂高" prop="sky_line_height">
            <el-input v-model="addsForm.sky_line_height" />
          </el-form-item>
          <el-form-item label="天线倾角" prop="skyline_pitch">
            <el-input v-model="addsForm.skyline_pitch" />
          </el-form-item>
           <el-form-item label="站点编号" prop="station_id">
            <el-input v-model="addsForm.station_id" />
          </el-form-item>
          <el-form-item label="站点名称" prop="station_name">
            <el-input v-model="addsForm.station_name" />
          </el-form-item>
          <el-form-item label="塔高" prop="tower_height">
            <el-input v-model="addsForm.tower_height" />
          </el-form-item>
          <el-form-item label="传输方式" prop="trans_type">
            <el-input v-model="addsForm.trans_type" />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-input v-model="addsForm.type" />
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
     <el-dialog title="编辑铁塔" :visible.sync="dialogFormVisible"     width="600px">
      <el-form ref="updateForm"  :model="temp" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;">
           <el-form-item label="所属区域" prop="area" >
              <el-input v-model="temp.area" />
            </el-form-item>     
          <el-form-item label="创建时间" prop="bulid_date">
              <el-input v-model="temp.bulid_date" />
            </el-form-item>
          <el-form-item label="覆盖距离" prop="coverage">
            <el-input v-model="temp.coverage" />
          </el-form-item>
          <el-form-item label="发射功率" prop="launch_power ">
            <el-input v-model="temp.launch_power " />
          </el-form-item>
           <el-form-item label="等级" prop="level " >
              <el-input v-model="temp.level " />
            </el-form-item>     
          <el-form-item label="经度" prop="lon">
              <el-input v-model="temp.lon" />
            </el-form-item>
          <el-form-item label="纬度" prop="lat">
            <el-input v-model="temp.lat" />
          </el-form-item>
          <el-form-item label="天线方位角" prop="sky_line_azimuth">
            <el-input v-model="temp.sky_line_azimuth" />
          </el-form-item>
          <el-form-item label="天线方位" prop="sky_line_coverage">
            <el-input v-model="temp.sky_line_coverage" />
          </el-form-item>
          <el-form-item label="天线挂高" prop="sky_line_height">
            <el-input v-model="temp.sky_line_height" />
          </el-form-item>
          <el-form-item label="天线倾角" prop="skyline_pitch">
            <el-input v-model="temp.skyline_pitch" />
          </el-form-item>
           <el-form-item label="站点编号" prop="station_id">
            <el-input v-model="temp.station_id" />
          </el-form-item>
          <el-form-item label="站点名称" prop="station_name">
            <el-input v-model="temp.station_name" />
          </el-form-item>
          <el-form-item label="塔高" prop="tower_height">
            <el-input v-model="temp.tower_height" />
          </el-form-item>
          <el-form-item label="传输方式" prop="trans_type">
            <el-input v-model="temp.trans_type" />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-input v-model="temp.type" />
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

 <!-- 查看弹层功能 -->
     <el-dialog title="铁塔详情" :visible.sync="dialogFormVisible2"     width="600px">
      <el-form ref="updateForm"  :model="more" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;"  :disabled="dialog.disabled">
           <el-form-item label="所属区域" prop="area" >
              <el-input v-model="more.area" />
            </el-form-item>     
          <el-form-item label="创建时间" prop="bulid_date">
              <el-input v-model="more.bulid_date" />
            </el-form-item>
          <el-form-item label="覆盖距离" prop="coverage">
            <el-input v-model="more.coverage" />
          </el-form-item>
          <el-form-item label="发射功率" prop="launch_power ">
            <el-input v-model="more.launch_power " />
          </el-form-item>
           <el-form-item label="等级" prop="level " >
              <el-input v-model="more.level " />
            </el-form-item>     
          <el-form-item label="经度" prop="lon">
              <el-input v-model="more.lon" />
            </el-form-item>
          <el-form-item label="纬度" prop="lat">
            <el-input v-model="more.lat" />
          </el-form-item>
          <el-form-item label="天线方位角" prop="sky_line_azimuth">
            <el-input v-model="more.sky_line_azimuth" />
          </el-form-item>
          <el-form-item label="天线方位" prop="sky_line_coverage">
            <el-input v-model="more.sky_line_coverage" />
          </el-form-item>
          <el-form-item label="天线挂高" prop="sky_line_height">
            <el-input v-model="more.sky_line_height" />
          </el-form-item>
          <el-form-item label="天线倾角" prop="skyline_pitch">
            <el-input v-model="more.skyline_pitch" />
          </el-form-item>
           <el-form-item label="站点编号" prop="station_id">
            <el-input v-model="more.station_id" />
          </el-form-item>
          <el-form-item label="站点名称" prop="station_name">
            <el-input v-model="more.station_name" />
          </el-form-item>
          <el-form-item label="塔高" prop="tower_height">
            <el-input v-model="more.tower_height" />
          </el-form-item>
          <el-form-item label="传输方式" prop="trans_type">
            <el-input v-model="more.trans_type" />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-input v-model="more.type" />
          </el-form-item>
      </el-form>
    </el-dialog> 
    <!-- 删除弹层功能 -->
    <el-dialog  :visible.sync="dialogDelVisible"  custom-class="deleteDialog"   width="200px">
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
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNo"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="rows">
    </el-pagination>
 </div>
</template>

<script>
import LeafletTableMap from '../../../src/components/LeafletTableMap'
export default {
  name: 'ComplexTable',
  components:{'leaflet-tablemap':LeafletTableMap},
  data() {
    return {
      wharf:null,
     dialog: {
          visible: false,
          title: '',
          showBtn:true,
          showMap:false,
          disabled:false
        },
        delid:'',
      mapData:{},
      tableData: [], //表格展示的数据
      pages:1, //总页数
      rows:1, //总条数
      listQuery:{
        pageNumber:1, //当前页面
        pageSize:10, //条数
        name:''  //查询条件
      },
      dialogDelVisible:false, //删除弹层显示与隐藏
      dialogFormVisible:false, //编辑弹层显示与隐藏
      dialogFormVisible1:false, //新增弹层显示与隐藏
      dialogFormVisible2:false,  //查看
      addsForm:{   //新增数据
        area:'',bulid_date:'',coverage:'',station_id:'',
        lat:'',launch_power:'',level :'',skyline_pitch:'',
        lon:'',sky_line_azimuth:'',sky_line_coverage:'',sky_line_height:'',
        station_name:'',tower_height:'',trans_type :'',type:''
      },
      temp:{  //编辑的表单字段
        area:'',bulid_date:'',coverage:'',station_id:'',
        lat:'',launch_power:'',level :'',skyline_pitch:'',
        lon:'',sky_line_azimuth:'',sky_line_coverage:'',sky_line_height:'',
        station_name:'',tower_height:'',trans_type :'',type:''
      },
      more:{  //编辑的表单字段
        area:'',bulid_date:'',coverage:'',station_id:'',
        lat:'',launch_power:'',level :'',skyline_pitch:'',
        lon:'',sky_line_azimuth:'',sky_line_coverage:'',sky_line_height:'',
        station_name:'',tower_height:'',trans_type :'',type:''
      },
      Business_exception:null,
      //  visible: false,
       uploadUrl:'tower/pushExcel',
       fileList: [],
    }
  },
  created() {
    this.getList();
  },
  methods: {
     handleClickMore(row)/* 详情 */ {
        // console.log(row)
          this.more = Object.assign({}, row);  //获得所有数据显示在编辑信息模态框里面
        this.dialogFormVisible2 = true; //弹层显示
          this.dialog.disabled = true;
      },
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
     // 修改table header的背景色
        tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
          if (rowIndex === 0) {
            return 'background-color: #DEE8FE;color: #000;font-weight: 500;'
          }
        }, 

    getList(){  //获取数据
         this.service.get( '/tower/page',{
              params:{
           pageNumber: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          name: this.listQuery.name}
         }).then(req => {
          console.log("铁塔数据",req)
          this.tableData = req.page.list
          this.rows=req.page.totalRow
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
        
      require.ensure([], () => {
        const { export_json_to_excel } = require('@/vandor/export2Excel.js');
        const tHeader = ['所属区域', '创建时间','覆盖距离','纬度','发射功率','等级','经度','天线方位角','天线方位',
        '天线挂高','天线倾角','站点编号','塔高','站点名称','传输方式','类型']; // 表头
        const filterVal = ['area','bulid_date','coverage','lat','launch_power','level','lon','sky_line_azimuth','sky_line_coverage',
        'sky_line_height','skyline_pitch','station_id','tower_height','station_name','trans_type','type']; // 值
        const list = this.tableData;
        console.log('后端返回的数据', list);
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '铁塔数据excel');
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
    //当前页变化
    handleCurrentChange(val=this.listQuery.pageNo){
      this.listQuery.pageNo = val;
      this.getList();
    },
    //删除弹层
    handleDel(row){
       this.delid=row.station_id
      //  console.log("这行数据的id",this.delid) 
      this.temp = {...row};
      this.dialogDelVisible = true; //弹层显示
    },
    //删除提交
    delData(){
      this.service.get( '/tower/delete?station_id='+this.delid,{     
         }).then(req => {
          console.log("删除铁塔数据",req)
          this.getList();
          this.dialogDelVisible = false;
        }) 
    },
     //编辑弹层
    handleUpdate(index,row){
     this.temp = Object.assign({}, row);  //获得所有数据显示在编辑信息模态框里面
      this.dialogFormVisible = true; //弹层显示
    },
    // 添加雷达
     handleAdd(){
      this.dialogFormVisible1 = true; //弹层显示
    },
     AddData(){
        let userList=this.addsForm;  
        let {area,bulid_date,coverage,station_id,lat,launch_power,skyline_pitch,level,lon,sky_line_azimuth,sky_line_coverage,
        sky_line_height,tower_height,station_name,trans_type,type} = userList;
          this.service.post('/tower/save',this.addsForm).then(res => {
            console.log("新增的铁塔数据",res)
            this.getList(); 
          this.dialogFormVisible1 = false;}
          );
    },
    //编辑提交
    updateData(){
         let userList=this.temp;  
        let {area,bulid_date,coverage,station_id,lat,launch_power,skyline_pitch,level,lon,sky_line_azimuth,sky_line_coverage,
        sky_line_height,tower_height,station_name,trans_type,type} = userList;
       this.service.post('/tower/update',this.temp).then(req => {
          console.log("编辑铁塔信息",req)
          this.getList();
          this.dialogFormVisible = false;
      })
    }
  }
}
</script>
<style  lang="less" scoped>
@import '../../assets/css/object.less';
</style>