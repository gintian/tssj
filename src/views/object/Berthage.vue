<template>
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
      prop="total_length"
      label="总长度">
    </el-table-column>
    <el-table-column
      align="center"
      prop="controller_distance"
      label="控制距离">
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
      <leaflet-tablemap :mapData="mapData"  markerType="Submarine" :option="{strokeColor:'blue ', strokeWeight:2, strokeOpacity:0.5}"></leaflet-tablemap>
</el-dialog>
 <!-- 新增弹层功能 -->
     <el-dialog title="添加海底光缆" :visible.sync="dialogFormVisible1"  custom-class="addDialog"    width="600px">
      <el-form ref="updateForm"  :model="addsForm" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;">
          <el-form-item label="名称" prop="name" >
              <el-input v-model="addsForm.name" />
            </el-form-item>     
          <el-form-item label="控制距离" prop="controller_distance">
              <el-input v-model="addsForm.controller_distance" />
            </el-form-item>
          <el-form-item label="点位信息" prop="points">
            <el-input v-model="addsForm.points" />
          </el-form-item>
          <el-form-item label="总长度" prop="total_length ">
            <el-input v-model="addsForm.total_length " />
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
     <el-dialog title="编辑码头" :visible.sync="dialogFormVisible"     width="600px">
      <el-form ref="updateForm"  :model="temp" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;">
         <el-form-item label="名称" prop="name" >
              <el-input v-model="temp.name" />
            </el-form-item>     
          <el-form-item label="控制距离" prop="controller_distance">
              <el-input v-model="temp.controller_distance" />
            </el-form-item>
          <el-form-item label="点位信息" prop="points">
            <el-input v-model="temp.points" />
          </el-form-item>
          <el-form-item label="总长度" prop="total_length ">
            <el-input v-model="temp.total_length " />
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
      addsForm:{   //新增数据
        name:'',
        controller_distance:'',
        points :'',
        total_length:''
      },
      temp:{  //编辑的表单字段
        id:'',
        name:'',
        controller_distance:'',
        points :'',
        total_length:''
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
     submitUpload(){
          this.$refs.upload.submit();
      },
      // 导入数据
       uploadSectionFile(item){
         console.log(this.$store.getters.getJSESSIONID)
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
                message: res.data.message,
                offset:500
              });
               this.getList();

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
         this.service.get( '/berth/page',{
              params:{
           pageNumber: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          name: this.listQuery.name}
         }).then(req => {
          console.log("泊位数据",req)
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
        const tHeader = ['序号', '名称','控制距离','点位信息','总长度']; // 表头
        const filterVal = ['id', 'name','controller_distance','points','total_length']; // 值
        const list = this.tableData;
        console.log('后端返回的数据', list);
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '海底光缆数据excel');
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
       this.delid=row.id
      //  console.log("这行数据的id",this.delid) 
      this.temp = {...row};
      this.dialogDelVisible = true; //弹层显示
    },
    //删除提交
    delData(){
      this.service.get( '/berth/delete?id='+this.delid,{     
         }).then(req => {
          console.log("删除泊位数据",req)
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
        let {name,controller_distance,points,total_length} = userList;
          this.service.post('/berth/save',this.addsForm).then(res => {
            console.log("新增的泊位数据",res)
            this.getList(); 
          this.dialogFormVisible1 = false;}
          );
    },
    //编辑提交
    updateData(){
       this.service.post('/berth/update',{
          id:this.temp.id,
          name:this.temp.name,
          controller_distance:this.temp.controller_distance,
          points:this.temp.points,
          total_length:this.temp.total_length,
       }).then(req => {
          console.log("编辑泊位信息",req)
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