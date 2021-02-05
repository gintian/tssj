<template>
<!-- 系统告警日志 -->
  <div class="app-container">
    <div class="filter-container">
        <h3>业务异常（共{{total}}条）</h3>
        <div class="select_query">
          <!-- 时间查询控制在最近六个月，并可选范围 -->
          <el-form> 
              <el-form-item label="开始时间" style="margin:0;">
                <selectdate @afterDateSelect="afterDateSelect" :endDate="endDt" :startDate="startDt" /> 
            </el-form-item>
          </el-form>
            <div>
                <el-input v-model="listQuery.name" placeholder="请输入" style="width: 200px;" class="filter-item" 
                @input="query()"/>
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
        prop="reg_time"
        label="时间"
        align="center">
     </el-table-column> 
  

  <el-table-column
      prop="creator"
      label="级别"
      align="center">
    </el-table-column>

    <el-table-column
      prop="loan_card"
      label="内容"
      align="center">
    </el-table-column>
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
import selectdate from "@/components/selectdate";
export default {
  name: 'ComplexTable',
  components:{
    selectdate
  },
  data() {
    return {
      list: null,
      // tableData: [], //表格展示的数据
      pages:1, //总页数
      total:1, //总条数
      listQuery:{
        pageNo:1, //当前页面
        pageSize:10, //条数
        name:''  //查询条件
      },
      Business_exception:null,
      // 日期范围
        startDate: "",
        endDt: "",
        startDt:"",
        dateRange: "",
    }
  },
  filters:{
    getDate(time){
      var d = new Date(time);
      var times=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      return times;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    afterDateSelect(time) {
      console.log("选择的时间",time);
      this.dateRange = time;
     },
      // 修改table header的背景色
        tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
          if (rowIndex === 0) {
            return 'background-color: #DEE8FE;color: #000;font-weight: 500;'
          }
        },
    getList(){  //获取数据
      this.service.get( '/alarmlog/page', {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          name: this.name
           }
        ).then(req => {
          console.log("13212132",req)
          this.list = req.list
          this.total = req.data.page.totalRow //总条数
          this.pages = req.data.page.totalPage;  //总页数
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
  }
}
</script>
<style  lang="less" scoped>
.el-pagination {
    text-align: center; 
}
.filter-container{
    display: grid;
    grid-template-columns: 40%  60%;
    align-items: center;
    margin: 16px;
}

.filter-container .select_query{
    display: grid;
    grid-template-columns: 50% 50%;
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
</style>
