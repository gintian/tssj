<template>
 <div class="app-container" >
    <div class="container-title" >
        <h3>AIS</h3>
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
      <!-- fixed:值有（true,left,right）列是否固定在左侧或者右侧，true 表示固定在左侧 -->
      <!-- column 的 key，如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件 -->
    </el-table-column>
    <el-table-column
      prop="id"
      label="编号"
      align="center">
    </el-table-column>
    
    <el-table-column prop="lat,lon" label="位置" align="center"  min-width="90%">
       <template slot-scope="scope">   
            <span> 经度：{{scope.row.lon}}</span><br>
            <span> 纬度：{{scope.row.lat}}</span>
       </template>
     <!-- align:	对齐方式,	值有left/center/right	默认left -->
    </el-table-column>
    <el-table-column prop="status" label="运行状态" align="center">
      <template slot-scope="scope">
            <span v-if="scope.row.status == true">正常</span>
            <span v-if="scope.row.status == false">异常</span>
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
     <el-dialog title="添加AIS" :visible.sync="dialogFormVisible1"  custom-class="addDialog"    width="600px">
      <el-form ref="updateForm"  :model="addsForm" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;">
          <el-form-item label="名称" prop="name" v-show="false">
              <el-input v-model="addsForm.name" />
            </el-form-item>
            <el-form-item label="编号" prop="station">
              <el-input v-model="addsForm.station" />
            </el-form-item>
          <el-form-item label="经度" prop="lon">
              <el-input v-model="addsForm.lon" />
            </el-form-item>
            <el-form-item label="纬度" prop="lat">
            <el-input v-model="addsForm.lat" />
          </el-form-item>
          <el-form-item label="运行状态" prop="status">
              <el-input v-model="addsForm.status" />
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
          <el-form-item label="名称" prop="name" v-show="false">
              <el-input v-model="temp.name" />
            </el-form-item>
            <el-form-item label="编号" prop="station">
              <el-input v-model="temp.station" />
            </el-form-item>
          <el-form-item label="经度" prop="lon">
              <el-input v-model="temp.lon" />
            </el-form-item>
            <el-form-item label="纬度" prop="lat">
            <el-input v-model="temp.lat" />
          </el-form-item>
          <el-form-item label="运行状态" prop="status">
              <el-input v-model="temp.status" />
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
        status:'',
        station:''
      },
      temp:{  //编辑的表单字段
        id:'',
        station:'',
        name:'',
        lat:'',
        lon:'',
        range:'',
        status:'',
      },
      Business_exception:null,
      //  visible: false,
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

    getList(){  //获取数据
         this.service.get( '/radar/page',{
             pageNumber: this.listQuery.pageNo,
              pageSize: this.listQuery.pageSize,
              name: this.listQuery.name
         }).then(req => {
          console.log("雷达数据",req)
          this.tableData = req.data.page.list
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
        const tHeader = ['考评单位名称', '得分']; // 表头
        const filterVal = ['evaluationCompanyName', 'acquisitionScore']; // 值
        const list = this.tableData;
        console.log('后端返回的数据', list);
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '下载数据excel');
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
      this.temp = {...row};
      this.dialogDelVisible = true; //弹层显示
    },
    //删除提交
    delData(){},
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
        let {station,name,lat,lon,status} = userList;
        //判断数据是否为空
        if(station==''||name==''||lat==''||lon==''||status==''){
          this.$message.error('新增内容每一项都不准为空')
        }else{
        //每一条都不为空时才向后台发送http请求
          this.service.post('/ais/save',this.addsForm).then(res => {
            console.log("新增的AIS数据",res)
            let {errCode,errMsg} = res.data;
            if(!errCode==1){
              this.$set(this.addsForm,{});
              this.getList();   //重新渲染数据列表
              this.dialogFormVisible1 = false;
            }else{
              this.$message.error(errMsg);  //弹出后台返回错误
            }
          }, response => {
          });
        }
    },
    //编辑提交
    updateData(){
       this.service.post('/ais/update',{
         id:this.temp.id,
          station:this.temp.station,
          name:this.temp.name,
          lat:this.temp.lat,
        lon:this.temp.lon,
        status:this.temp.status,
       }).then(req => {
          console.log("编辑AIS信息",req)
          this.getList();
      })
    }
  }
}
</script>
<style  lang="less" scoped>
@import '../../assets/css/object.less';
</style>