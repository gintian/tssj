<template>
 <div class="app-container">
   <div class="container-head">
      <div class="container-head-left">
        <div  class="left-one">
          <h4>一类违规船只</h4>
          <span class="special-news">{{oneType}}</span>
        </div>
          <h4>入侵禁航区</h4>
      </div>
      <div class="container-head-right">
         <div  class="right-one">
          <h4>二类违规船只</h4>
          <span class="special-news">{{twoType}}</span>
        </div>
          <h4>关闭AIS船只</h4>
      </div>
   </div>
    <div class="container-title">
        <!-- <h3>全部用户（共{{Business_exception}}条）</h3> -->
            <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd()" >
              添加
            </el-button>
          <div class="select_query">
            <el-input v-model="listQuery.name" placeholder="输入船名/mmsi" style="width: 200px;" class="filter-item" 
            @input="query()"/>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="query()" >
              搜索
            </el-button>   
          </div>
    </div>

    <el-table
    :data="tableData"
    style="width: 100%"
    :header-cell-style="tableHeaderColor">
    <el-table-column
      prop="id"
      label="ID">
    </el-table-column>
    <el-table-column
      prop="ship_name"
      label="船名/MMSI"
      >
      <!-- fixed:值有（true,left,right）列是否固定在左侧或者右侧，true 表示固定在左侧 -->
      <!-- column 的 key，如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件 -->
    </el-table-column>
    <el-table-column prop="type" label="分类" align="center" >
     <!-- align:	对齐方式,	值有left/center/right	默认left -->
     <template slot-scope="scope">
            <span v-if="scope.row.type == 1">一类</span>
            <span v-if="scope.row.type == 2">二类</span>
      </template>
    </el-table-column>
    
    <el-table-column
      prop="reason"
      label="异常原因">
    </el-table-column>

    <el-table-column
      prop="creat_time" 
      label="开始时间" >
    </el-table-column>

    <el-table-column
      prop="end_time" 
      label="结束时间" >
    </el-table-column>
    <el-table-column label="查看轨迹" >
      <template slot-scope="scope">
        <el-button
          type="text" size="small" class="btn-upt" @click="handleUpdate(scope.$index, scope.row)">查看</el-button>
      </template>
    </el-table-column>

    <el-table-column label="查看地图" >
      <template slot-scope="scope">
        <el-button
          type="text" size="small" class="btn-upt" @click="handleUpdate(scope.$index, scope.row)">查看</el-button>
      </template>
    </el-table-column>

    <el-table-column label="事件信息" prop="reason" >
      <template slot-scope="scope">
        <el-button  type="text" size="small" class="btn-upt"  @click="visible = !visible">详情</el-button>
        <el-popover
              placement="bottom"
              width="200"
              trigger="click" 
               v-model="visible">
              <span>{{scope.row.reason}}</span>
        </el-popover>
        </template>
    </el-table-column>
  </el-table>

  

 <!-- 新增弹层功能 -->
     <el-dialog title="添加可疑事件" :visible.sync="dialogFormVisible1"  custom-class="addDialog"    width="600px">
      <el-form ref="updateForm"  :model="addsForm" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;">
          <el-form-item label="ID" prop="id" >
              <el-input v-model="addsForm.id" />
            </el-form-item>
            <el-form-item label="船名/MMSI" prop="mmsi">
              <el-input v-model="addsForm.mmsi" />
            </el-form-item>
          <el-form-item label="分类" prop="ship_type">
              <el-input v-model="addsForm.ship_type" />
            </el-form-item>
            <el-form-item label="异常原因" prop="reason">
            <el-input v-model.number="addsForm.reason" />
          </el-form-item>
          <el-form-item label="开始时间" prop="address1">
            <el-date-picker type="datetime" v-model="addsForm.birthday" />
          </el-form-item>
           <el-form-item label="结束时间" prop="birthday">
            <el-date-picker type="datetime" v-model="addsForm.birthday" />
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
export default {
  name: 'ComplexTable',
  data() {
    return { 
      visible:false,
      tableData: [], //表格展示的数据
      pages:1, //总页数
      rows:1, //总条数
      oneType:null, //一类
      twoType:null,  //二类
      listQuery:{
        pageNumber:1, //当前页面
        pageSize:10, //条数
        name:''  ,//查询条件
        beginTime:'', //开始事件
        type:'' //异常类型
      },
       addsForm:{   //新增数据
        creat_time:'',
        lat:'',
        lon:'',
        mmsi:'',
        reason:'',
        ship_name:'',
        ship_type:''
      },
      dialogFormVisible:false, //编辑弹层显示与隐藏
      dialogFormVisible1:false, //新增弹层显示与隐藏
      temp:{
        id:'',
        name:'',
        birthday:'',
      },
      Business_exception:null,
    }
  },
  filters:{
  },
  created() {
    this.getList();
    this.statistical();
    },
  methods: {
     // 修改table header的背景色
        tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
          if (rowIndex === 0) {
            return 'background-color: #DEE8FE;color: #000;font-weight: 500;'
          }
        }, 
       statistical(){
         this.service.get('/criminal/statistical',).then(res=>{
           console.log("统计获取数据",res)
           this.oneType=res.data.oneType,
            // console.log("统计获取数据",res.oneType)
           this.twoType=res.data.twoType
         })
       },
       getList(){  //获取数据
        this.service.get( '/criminal/page', {
          pageNumber: this.listQuery.pageNumber,
          pageSize: this.listQuery.pageSize,
          type: this.listQuery.type,
          beginTime:this.listQuery.beginTime
           })
        .then(req => {
          console.log("可疑事件的数据",req)
          this.tableData = req.data.page.list
        })
       
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
      this.temp = {...row};
      this.dialogDelVisible = true; //弹层显示
    },
   
     //详情弹层
    eventUpdate(index,row){
      //this.temp = Object.assign({}, row);  //获得所有数据显示在编辑信息模态框里面
      this.visible = true; //弹层显示
    },

    // 添加可疑事件
     handleAdd(){
      this.dialogFormVisible1 = true; //弹层显示
    },
     AddData(){
        let userList=this.addsForm;  
        let {creat_time,mmsi,lat,lon,reason,ship_name,ship_type} = userList;
        //判断数据是否为空
        if(creat_time==''||mmsi==''||lat==''||lon==''||reason==''||ship_name==''||ship_type==''){
          this.$message.error('新增内容每一项都不准为空')
        }else{
        //每一条都不为空时才向后台发送http请求
          this.service.post('/criminal/save',this.addsForm).then(res => {
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
    
  }
}
</script>
<style  lang="less" scoped>
.el-pagination {
    text-align: center; 
}
.container-head{
      display: flex;
    justify-content: space-around;
    background: #F7F7F7;
    padding-bottom: 10px;
    color: white;
    line-height: 57px;
}
 .container-head  .special-news{
  font-size: 36px;
}
  .container-head-left{
    width: 921px;
    height: 118px;
    background: linear-gradient(180deg, #FFB5BB 0%, #DA6C75 100%);
    border: 1px solid #979797;
    margin-right: 20px;
    margin-left: 16px;
    display: flex;
    justify-content: space-between;
    padding-left: 28px;
    padding-right: 26px;
  }
  .container-head-right{
    width: 921px;
    height: 118px;
    margin-right: 10px;
    background: linear-gradient(180deg, #F9D096 0%, #FCBF6A 100%);
    display: flex;
    justify-content: space-between;
    padding-left: 28px;
    padding-right: 26px;
  }

.container-title{
    display: flex;
    justify-content: space-between;
    margin: 16px;
}
.container-title .filter-item{
  margin:0;
border: 1px solid #0078FF;
}
/* 操作部分 */
  .btn-upt{   
    margin: 0 .5rem 0 0!important;
    color: #0075EE;
    padding-left: 14px;
  }
// 弹出框
/deep/.el-dialog{
  .el-dialog__header{
    background: white;
    .el-dialog__title,.el-dialog__close{
      color: black;
    }
  }
  .el-input__inner {
    border: 1px solid #a4a4a4;
}
  .el-dialog__footer{
    text-align: center;
  }
     
}
 /deep/ .deleteDialog{
          .el-dialog__header{
              background: white;
          }
          .el-dialog__body{
             text-align: center;
             padding:0;
          } 
    }
/deep/ .addDialog{
  .el-form-item__label::before{
    content: '*';
    color: red;
    margin-right: 10px;
    font-size: 20px;
    position: relative;
    top: 6px;
  }
}
/deep/.el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 301px;
}
// 分页
/deep/.el-input__inner{ 
border: 1px solid #0075EE;
}
/deep/.el-pager li.active{ 
background: #0075EE;
}
/deep/.el-pagination button:disabled,
/deep/.btn-next,
/deep/.el-pager li{  
background: #D8D8D8;
    margin-right: 10px;
}
/deep/.el-select__caret{
  color: black;
}
</style>