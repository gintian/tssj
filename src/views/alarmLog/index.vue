<template>
<!-- 业务告警日志 -->
  <div class="app-container">
    <div class="filter-container">
        <h3>业务异常（共{{total}}条）</h3>
        <div class="select_query">
        
            <div class="event_nav_msg">
                  <h4 >开始时间：</h4>
                        <el-date-picker
                          v-model="listQuery.beginTime"
                          type="datetime"
                          placeholder="请选择要查询的开始时间">
                        </el-date-picker>
            </div>
            <div  class="event_nav_msg">
                  <h4 >结束时间：</h4>
                        <el-date-picker
                          v-model="listQuery.endTime"
                          type="datetime"
                          placeholder="请选择要查询的结束时间">
                        </el-date-picker>
            </div>
            <div class="query-input">
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="query()" >
                  搜索
                </el-button>
            </div>
        </div>
    </div>
    <el-table
    :data="list"
    style="width: 100%"
    :header-cell-style="tableHeaderColor">
    
    <el-table-column
        prop="time"
        label="时间"
        align="center">
    </el-table-column> 

    <el-table-column
      prop="level"
      label="级别"
      align="center">
    </el-table-column>

    <el-table-column
      prop="content"
      label="内容"
      align="center">
    </el-table-column>
</el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNumber"
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
  data() {
    return {
      list: [],
      pages:1, //总页数
      total:1, //总条数
      listQuery:{
        pageNumber:1, //当前页面
        pageSize:10, //条数
        level:'' , //查询条件
        beginTime:'',
        endTime:'',
        content:"",
      },
      value1: '',
      value2: '',
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
       this.service.get( '/alarmlog/page?pageNumber='
       +this.listQuery.pageNumber+'&&pageSize='
       +this.listQuery.pageSize+'&&level='
       +this.listQuery.level
       +'&&beginTime='
       +this.listQuery.beginTime+'&&endTime='
       +this.listQuery.endTime+'&&content='
        +this.listQuery.content
       ).then(req => {
          console.log("业务告警日志数据",req)
          this.list = req.page.list
          this.total = req.page.totalRow //总条数
          this.pages = req.page.totalPage;  //总页数
        })
    },
    query(){ 
      console.log(new Date(this.listQuery.beginTime).toLocaleDateString().replace(/\//g,'-'),'beginTime')
      //  console.log(new Date(this.listQuery.time).toTimeString().split(' '),'beginTime')
      console.log(new Date(this.listQuery.endTime).toLocaleDateString().replace(/\//g,'-'),'endTime')
      // this.listQuery.time=new Date(this.listQuery.time).toLocaleDateString().replace(/\//g,'-') +new Date(this.listQuery.time).toTimeString().split(' ')
      this.listQuery.beginTime=new Date(this.listQuery.beginTime).toLocaleDateString().replace(/\//g,'-')
      this.listQuery.endTime=new Date(this.listQuery.endTime).toLocaleDateString().replace(/\//g,'-')
      this.getList();
      // console.log("查到的数据",this.getList())
    },
    //当前条数变化
     handleSizeChange(val=this.listQuery.pageSize ){
      this.listQuery.pageSize = val;
      this.getList();
    },
    //当前页变化
    handleCurrentChange(val=this.listQuery.pageNumber){
      this.listQuery.pageNumber = val;
      this.getList();
    // console.log(`当前页: ${val}`);
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
    grid-template-columns: 40% 60%;
    align-items: center;
    margin: 16px;
}

.filter-container .select_query{
    //   display: grid;
    // grid-template-columns: 50%  50%;
    // align-items: center;
    display: flex;
    justify-content: space-between;
}
.event_nav_msg{
    // display: flex;
    display: grid;
   grid-template-columns: 33% 69%;
    align-items: center;
}
.filter-item{
  margin:0;
border: 1px solid #0078FF;
}
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


@media  screen and  (max-width: 1366px) {
  .filter-container{
      display: grid;
    grid-template-columns: 37% 55%;
    align-items: center;
    margin: 16px;
  }
  .event_nav_msg{
    // display: flex;
    display: grid;
    grid-template-columns: 23% 44%;
    align-items: center;
    }
}
</style>
