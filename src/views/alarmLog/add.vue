<template>
<!-- 系统操作日志 -->
  <div class="app-container">
    <div class="filter-container">
        <h3>业务异常（共{{total}}条）</h3>
        <div class="select_query"> 
            <el-form  style="display:grid;grid-template-columns: 1fr 1fr;"  :inline="true">
                <el-form-item label="开始时间："  style="display:flex;margin:0;" label-width="100px" size="medium" v-model="listQuery.time" >
                    <el-date-picker
                            v-model="filters.column.create_start_date"
                            type="date"
                            :picker-options="pickerBeginDateBefore"
                            format="yyyy-MM-dd"
                            placeholder="">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间：" style="display:flex;margin:0;"  label-width="100px" size="medium"  v-model="listQuery.time">
                    <el-date-picker
                            v-model="filters.column.create_end_date"
                            type="date"
                            format="yyyy-MM-dd"
                            :picker-options="pickerBeginDateAfter"
                            placeholder="">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <!-- 操作类型 -->
            <div class="oper-type" style="margin-left: 26px;">
                <span class="event_nav_msg">操作类型：</span>
                    <el-select  v-model="listQuery.level"  class="selectInput"  :popper-append-to-body="false" placeholder="全部">
                      <el-option   v-for="item in options"  :value="item.value"   :label="item.name" :key="item.value">
                        {{item.name}}
                      </el-option>
                    </el-select>
            </div>
            <div class="query-input">
                <el-input v-model="listQuery.name" placeholder="请输入姓名"  style="width:200px;"  class="filter-item" 
                @input="query()"/>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="query()" >
                  搜索
                </el-button>
            </div>
        </div>
    </div>
<el-table  :data="list"  style="width: 100%"  :header-cell-style="tableHeaderColor">
    <el-table-column  prop="username"  label="用户名"  align="center"></el-table-column> 
    <el-table-column  prop="email"  label="邮箱" align="center">  </el-table-column> 
     <el-table-column prop="realname" label="角色" align="center"> </el-table-column> 
    <el-table-column  prop="level" label="操作类型" align="center">
      <template slot-scope="scope">
            <span v-if="scope.row.level == 0">登录</span>
            <span v-if="scope.row.level == 1">添加</span>
            <span v-if="scope.row.level == 2">编辑</span>
            <span v-if="scope.row.level == 3">删除</span>
            <span v-if="scope.row.level == 4">退出</span>
          </template>
    </el-table-column>
    <el-table-column prop="time" label="请求时间"> </el-table-column>
</el-table>
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
export default {
  name: 'ComplexTable',
  components:{
    // Table,
    // pagination
    },
  data() {
    return {
      list: [], //表格展示的数据
      pages:1, //总页数
      total:1, //总条数
      listQuery:{
        pageNo:1, //当前页面
        pageSize:20, //条数
        name:'' , //查询输入条件
        beginTime:'' , //开始时间
        endTime:'',//结束时间
        level:'' //操作类型，默认显示全部(-1)
      },
       filters: {
            column: {
                create_start_date: '',
                create_end_date: ''
            },
        },
        pickerBeginDateBefore:{
            disabledDate: (time) => {
                let beginDateVal = this.filters.column.create_end_date;
                if (beginDateVal) {
                    return time.getTime() > beginDateVal;
                }
            }
        },
        pickerBeginDateAfter:{
            disabledDate: (time) => {
                let beginDateVal = this.filters.column.create_start_date;
                if (beginDateVal) {
                    return time.getTime() < beginDateVal;
                }
            }
        },
         options: [],    //操作类型
    }
  },
 
  filters:{
  },
  created() {
    this.getList();
  },
  mounted(){
    this.getType()
  },
  methods: {
      // 修改table header的背景色
        tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
          if (rowIndex === 0) {
            return 'background-color: #DEE8FE;color: #000;font-weight: 500;'
          }
        },
        getType(){
          this.service.get('/enum/solLevel').then(res=>{
            console.log("系统操作日志枚举",res)
             this.options=res.list
            //  console.log("数据",this.options)
          })
        },
    getList(){  //获取数据
       this.service.get( '/operationlog/page?pageNumber='
          +this.listQuery.pageNo+'&&pageSize='
          +this.listQuery.pageSize+'&&name='
          +this.listQuery.name+'&&level='
          +this.listQuery.level+'&&beginTime='
          +this.listQuery.beginTime+'&&endTime='
          +this.listQuery.endTime
        ).then(req => {
          console.log("系统操作日志数据",req)
          this.list = req.page.list
          this.total = req.page.totalRow //总条数
          this.pages = req.page.totalPage;  //总页数
        })
    },
    query(){ //查询
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
  }
}
</script>
<style  lang="less" scoped>



.el-pagination {
    text-align: center; 
}
.filter-container{
      display: grid;
    grid-template-columns: 20% 80%;
    align-items: center;
    margin: 16px;
}

// /deep/  .query-input  .filter-item  .el-input{
//      width: 200px;
//   }
.filter-container .select_query{
      display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
}
.filter-item{
  margin:0;
border: 1px solid #0078FF;
}
     /* 图标 */
      /*/deep/.el-input .el-select__caret{*/
        /*transform: rotateZ(180deg);*/
        /*cursor: pointer;*/
        /*width: 0;*/
        /*height: 0;*/
        /*border-left: 8px solid transparent;*/
        /*border-right: 8px solid transparent;*/
        /*border-bottom: 8px solid #303133;*/
        /*font-size: 0;*/
        /*line-height: 0;*/
        /*}*/
      /*/deep/  .el-input__suffix {*/
          /*right: 18px;*/
          /*transition: all .3s;*/
          /*position: absolute;*/
          /*top: 8px;*/
      /*}*/
     /*/deep/ .el-icon-arrow-up:before {*/
       /*content: "";*/
    /*}*/
/deep/.el-input__inner{ 
// border: 1px solid #0075EE;
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

@media  screen and  (max-width: 1366px) {
  .filter-container .select_query {
    display: grid;
    grid-template-columns: 50% 25% 25%;
    align-items: center;
    }
  /deep/  .el-date-editor.el-input {
    width: 132px;
      }
  /deep/  .el-input__inner{
       width: 120px;
    }
    .query-input {
      display: flex;
    justify-content: space-between;
    }
  /deep/   .filter-item  {
     width: 155px;
    
  }
}
</style>
