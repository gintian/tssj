<template>
 <div class="app-container" >
    <div class="container-title" >
        <h3>雷达</h3>
         <el-button class="filter-item" type="primary"  @click="download()" >
              导出
         </el-button>
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
    <el-table-column
      prop="id"
      label="序号"
      align="center">
    </el-table-column>
    <el-table-column
      align="center"
      prop="name"
      label="名称">
    </el-table-column>
    <el-table-column
      prop="id"
      label="编号"
      align="center">
    </el-table-column>
    <el-table-column
      prop="band"
      label="波段"
      align="center">
    </el-table-column>
    <el-table-column prop="lat,lon" label="位置" align="center"  min-width="90%">
       <template slot-scope="scope">   
            <span> 经度：{{scope.row.lon}}</span><br>
            <span> 纬度：{{scope.row.lat}}</span>
       </template>
    </el-table-column>
    <el-table-column
      prop="range"
      label="探距（海里）"
      align="center">
    </el-table-column>
    <el-table-column prop="status" label="运行状态" align="center">
      <template slot-scope="scope">
            <span v-if="scope.row.status == true">异常</span>
            <span v-if="scope.row.status == false">正常</span>
      </template>
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
          type="text" size="small" class="btn-upt" @click="handleUpdate(scope.$index, scope.row)"  >编辑</el-button>
        <el-button
          type="text" size="small" class="btn-upt" @click="handleDel(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
<!-- 查看地图弹窗 -->
<el-dialog :visible.sync="dialog.showMap" width="520px" :show-close='false' custom-class="mapDialog">
      <table-map :mapData="mapData"  markerType="point" :option="{strokeColor:'blue ', strokeWeight:2, strokeOpacity:0.5}"></table-map>
</el-dialog>
 <!-- 新增弹层功能 -->
     <el-dialog title="添加雷达" :visible.sync="dialogFormVisible1"  custom-class="addDialog"    width="600px">
      <el-form ref="updateForm"  :model="addsForm" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;">
          <el-form-item label="名称" prop="name" >
              <el-input v-model="addsForm.name" />
            </el-form-item>
            <el-form-item label="编号" prop="station">
              <el-input v-model="addsForm.station" />
            </el-form-item>
             <el-form-item label="波段" prop="band">
              <el-input v-model="addsForm.band" />
            </el-form-item>
          <el-form-item label="经度" prop="lon">
              <el-input v-model="addsForm.lon" />
            </el-form-item>
            <el-form-item label="纬度" prop="lat">
            <el-input v-model="addsForm.lat" />
          </el-form-item>
           <el-form-item label="探距（海里）" prop="range" lable-width="40px">
            <el-input v-model="addsForm.range" />
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
     <el-dialog title="编辑雷达" :visible.sync="dialogFormVisible"     width="600px">
      <el-form ref="updateForm"  :model="temp" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;">
          <el-form-item label="名称" prop="name" >
              <el-input v-model="temp.name" />
            </el-form-item>
            <el-form-item label="编号" prop="station">
              <el-input v-model="temp.station" />
            </el-form-item>
             <el-form-item label="波段" prop="band">
              <el-input v-model="temp.band" />
            </el-form-item>
          <el-form-item label="经度" prop="lon">
              <el-input v-model="temp.lon" />
            </el-form-item>
            <el-form-item label="纬度" prop="lat">
            <el-input v-model="temp.lat" />
          </el-form-item>
           <el-form-item label="探距（海里）" prop="range">
            <el-input v-model="temp.range" />
          </el-form-item>
          <el-form-item label="运行状态" prop="status">
              <el-input v-model="update" @change="changeu" />
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

import TableMap from '../../../src/components/TableMap'
export default {
  name: 'ComplexTable',
  components:{'table-map':TableMap},
  data() {
    return {
     dialog: {
          visible: false,
          title: '',
          showBtn:true,
          showMap:false,
          disabled:false
        },
      mapData:[],
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
      addsForm:{   //新增数据
        name:'',
        lat:'',
        lon:'',
        range:'',
        status:'',
        band:'',
        station:''
      },
       delid:'',
      temp:{  //编辑的表单字段
        id:'',
        station:'',
        name:'',
        lat:'',
        lon:'',
        range:'',
        status:'',
        band:''
      },
      Business_exception:null,
      update:'',
       options:[{
        value:'正常',
        lable:'正常'
      },{
        value:'异常',
        lable:'异常'
      }]
    }
  },
  filters:{},
  created() {
    this.getList();
  },
  methods: {
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
      }
    },
    getList(){  //获取数据
         this.service.get( '/radar/page',{
              params:{
           pageNumber: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          name: this.listQuery.name}
         }).then(req => {
          console.log("雷达数据",req)
          this.tableData = req.page.list
        }) 
    },
     handleClickView(row) {
        console.log('查看地图')
        this.dialog.showMap = true
        if (row.waters) {
          row = { ...row, ...row.waters }
        }
        this.mapData = [row]
      },
    // 数据写入excel
    download() {
      // var that = this;
      require.ensure([], () => {
        // eslint-disable-next-line camelcase,global-require
        const { export_json_to_excel } = require('@/vandor/export2Excel.js');
        const tHeader = ['序号', '名称','编号','波段','经度','纬度','探距(海里)','运行状态']; // 表头
        const filterVal = ['id', 'name','id','band','lat','lon','range','status']; // 值
        const list = this.tableData;
        console.log('后端返回的数据', list);
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '雷达数据excel');
      });
    },
    // 格式转换
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },

    query(){ //按名称查询
      this.getList();
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
      console.log(row)
       this.delid=row.id
       console.log("这行数据的id",this.delid)
      this.temp = {...row};
      this.dialogDelVisible = true; //弹层显示
    },
    //删除提交
    delData(){
       this.service.get( '/radar/delete?id='+this.delid,{     
         }).then(req => {
          console.log("删除radar数据",req)
          this.getList();
          this.dialogDelVisible = false;
        }) 
    },
     //编辑弹层
    handleUpdate(index,row){
     this.temp = Object.assign({}, row);  //获得所有数据显示在编辑信息模态框里面
       if(this.temp.status==true){
        this.update = "异常"
      }else if(this.temp.status==false){
       this.update = "正常"
      }
      this.dialogFormVisible = true; //弹层显示
    },
    // 添加雷达
     handleAdd(){
      this.dialogFormVisible1 = true; //弹层显示
    },
     AddData(){
         console.log("this.addsForm",this.addsForm)
        if(this.addsForm.status=='正常'){
          this.addsForm.status='false'
        }else if(this.addsForm.status=='异常'){
          this.addsForm.status='true'
        }
        let userList=this.addsForm;  
        let {station,name,lat,lon,range,band,status} = userList;
      
          this.service.post('/radar/save',this.addsForm).then(res => {
          console.log("新增的雷达数据",res)
          this.getList(); 
          this.dialogFormVisible1 = false;}
          );
    },
    //编辑提交
    updateData(){
       this.service.post('/radar/update',{
           id:this.temp.id,
          station:this.temp.station,
          name:this.temp.name,
          lat:this.temp.lat,
          lon:this.temp.lon,
          range:this.temp.range,
          status:this.temp.status,
          band:this.temp.band
       }).then(req => {
          console.log("编辑雷达信息",req)
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