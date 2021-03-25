<template>
 <div class="app-container" >
    <div class="container-title" >
        <h3>锚地</h3>
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
      align="center"
      prop="describe"
      label="描述">
    </el-table-column>
    <el-table-column prop="type"  label="锚地类型" align="center">
      <template slot-scope="scope">
            <span v-if="scope.row.type == 0">圆形</span>
            <span v-if="scope.row.type == 1">矩形</span>
            <span v-if="scope.row.type == 2">多边形</span>
          </template>
    </el-table-column>
    <el-table-column  prop="radius"  label="区域"  align="center">
      <template slot-scope="scope">   
            <span> 半径{{scope.row.radius}}海里</span>
       </template>
    </el-table-column>
    <el-table-column prop="lat,lon" label="位置" align="center"  min-width="90%">
       <template slot-scope="scope">   
            <span> 经度：{{scope.row.lon}}</span><br>
            <span> 纬度：{{scope.row.lat}}</span>
       </template>
     <!-- align:	对齐方式,	值有left/center/right	默认left -->
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
     <el-dialog title="添加锚地" :visible.sync="dialogFormVisible1"  custom-class="addDialog"    width="600px">
      <el-form ref="updateForm"  :model="addsForm" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;">
          <!-- <el-form-item label="名称" prop="name" >
              <el-input v-model="addsForm.name" />
            </el-form-item> -->
            <el-form-item label="类型" prop="type">
              <el-input v-model="addsForm.type" />
            </el-form-item>
          <el-form-item label="经度" prop="lon">
              <el-input v-model="addsForm.lon" />
            </el-form-item>
            <el-form-item label="纬度" prop="lat">
            <el-input v-model="addsForm.lat" />
          </el-form-item>
          <el-form-item label="区域点集合（矩形/多边形时）" prop="points">
              <el-input v-model="addsForm.points" />
          </el-form-item>
            <el-form-item label="区域（为圆形时）" prop="radius">
            <el-input v-model="addsForm.radius" />
          </el-form-item>

            <el-form-item label="描述" prop="describe">
            <el-input v-model="addsForm.describe" />
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
     <el-dialog title="编辑锚地" :visible.sync="dialogFormVisible"     width="600px">
      <el-form ref="updateForm"  :model="temp" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;">
          <el-form-item label="名称" prop="name" >
              <el-input v-model="temp.name" />
            </el-form-item>
            <!-- <el-form-item label="类型" prop="type">
              <el-input v-model="temp.type" />
            </el-form-item> -->
          <el-form-item label="经度" prop="lon">
              <el-input v-model="temp.lon" />
            </el-form-item>
          <el-form-item label="纬度" prop="lat">
            <el-input v-model="temp.lat" />
          </el-form-item>
            <el-form-item label="描述" prop="describe">
            <el-input v-model="temp.describe" />
          </el-form-item>
          <!-- <el-form-item label="区域" prop="points">
              <el-input v-model="temp.points" />
            </el-form-item> -->
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
      :total="total">
    </el-pagination>
 </div>
</template>

<script>

// import TableMap from '../../../src/components/TableMap'
export default {
  name: 'ComplexTable',
  // components:{'table-map':TableMap},
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
        total:1, //总条数
      listQuery:{
        pageNumber:1, //当前页面
        pageSize:10, //条数
        name:''  //查询条件
      },
      dialogDelVisible:false, //删除弹层显示与隐藏
      dialogFormVisible:false, //编辑弹层显示与隐藏
      dialogFormVisible1:false, //新增弹层显示与隐藏
      addsForm:{   //新增数据
        // points:'',
        // name:'',
        lat:'', //维度
        lon:'', //经度
        type:'',  //类型
        describe:""
        // radius:'',
      },
      temp:{  //编辑的表单字段
        id:'',
        points:'',
        name:'',
        lat:'', //维度
        lon:'', //经度
        type:'',  //类型
        radius:'',
         describe:""
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
         this.service.get( '/anchorage/page',{
              params:{
                  pageNumber: this.listQuery.pageNo,
                  pageSize: this.listQuery.pageSize,
                  name: this.listQuery.name}
         }).then(req => {
          console.log("锚地数据",req)
             this.tableData = req.page.list
             this.total = req.page.totalRow //总条数
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
        const tHeader = ['序号', '名称','锚地类型','区域','经度','纬度']; // 表头
        const filterVal = ['id', 'name','type','radius','lat','lon']; // 值
        const list = this.tableData;
        console.log('后端返回的数据', list);
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '锚地数据excel');
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
      // this.temp = {...row};
        this.delid=row.id
        console.log("这行数据的id",this.delid)
        this.temp = {...row};
        this.dialogDelVisible = true; //弹层显示
    },
    //删除提交
    delData(){
        this.service.get( '/anchorage/delete?id='+this.delid,{
        }).then(req => {
            console.log("删除AIS数据",req)
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
        let {lat,lon,type,points,radius,describe} = userList;
          this.service.post('/anchorage/save',this.addsForm).then(res => {
            console.log("新增的锚地数据",res)
             this.getList(); 
          this.dialogFormVisible1 = false;}
          ); 
    },
    //编辑提交
    updateData(){
       this.service.post('/anchorage/update',{
          id:this.temp.id,
          lat:this.temp.lat,
          lon:this.temp.lon,
          type:this.temp.type,
          describe:this.temp.describe
       }).then(req => {
          console.log("编辑锚地信息",req)
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