<template>
 <div class="app-container">
    <div class="container-title">
        <h3>全部用户（共{{total}}条）</h3>
        <div style="display:flex;justify-content: space-between;">
            <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd()" >
              添加新用户
            </el-button>
          <div class="select_query">
            <el-input v-model="listQuery.name" placeholder="输入姓名/账号/手机号" style="width: 200px;" class="filter-item"   @input="query()"/>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList()" >
              搜索
            </el-button>   
          </div>
        </div>
    </div>

    <el-table
    :data="tableData"
    style="width: 100%"
    :header-cell-style="tableHeaderColor">
    <el-table-column
      prop="username"
      label="姓名"
      align="center">
    </el-table-column>
    <el-table-column
      align="center"
      prop="realname"
      label="账号">
      <!-- fixed:值有（true,left,right）列是否固定在左侧或者右侧，true 表示固定在左侧 -->
      <!-- column 的 key，如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件 -->
    </el-table-column>
    <el-table-column
      prop="telphone"
      label="手机号"
      align="center">
     <!-- align:	对齐方式,	值有left/center/right	默认left -->
    </el-table-column>
    
    <el-table-column
      prop="email"
      label="邮箱"
      align="center">
    </el-table-column>

    <el-table-column prop="group" label="分组" align="center">
      <template slot-scope="scope">
            <span v-if="scope.row.group == 0">查看者</span>
            <span v-if="scope.row.group == 1">编辑者</span>
            <span v-if="scope.row.group == 2">管理员</span>
          </template>
    </el-table-column>

    <el-table-column  prop="enable"  label="是否允许登录"  align="center">
      <template slot-scope="scope">
            <span v-if="scope.row.enable == true" style="color:#34AA44;" @click="allowLogin(scope.row)">是</span>
            <span v-if="scope.row.enable == false"  style="color:#F85A5A;" @click="notallowLogin(scope.row)" >否</span>
      </template>
    </el-table-column>
    
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button
          type="text" size="small" class="btn-upt" @click="handleUpdate(scope.$index, scope.row)" >编辑</el-button>
        <el-button
          type="text" size="small" class="btn-upt" @click="reset(scope.row)" >重置密码</el-button>
      </template>
    </el-table-column>
  </el-table>

 <!-- 新增弹层功能 -->
     <el-dialog title="添加新用户" :visible.sync="dialogFormVisible1"  custom-class="addDialog"    width="600px">
      <el-form ref="updateForm"  :model="addsForm" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;">

          <el-form-item label="ID" prop="id" v-show="false">
              <el-input v-model="addsForm.id" />
            </el-form-item>
            <el-form-item label="账号" prop="realname">
              <el-input v-model="addsForm.realname" />
            </el-form-item>
          <el-form-item label="姓名" prop="username">
              <el-input v-model="addsForm.username" />
            </el-form-item>
            <el-form-item label="手机号" prop="telphone">
            <el-input v-model.number="addsForm.telphone" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
              <el-input v-model="addsForm.email" />
        </el-form-item>
         <el-form-item label="密码" prop="password">
              <el-input v-model="addsForm.password" />
            </el-form-item>
           <el-form-item label="分组">
              <el-radio-group v-model="add" @change="change">
                <el-radio label="查看者" ></el-radio>
                <el-radio label="编辑者" ></el-radio>
                <el-radio label="管理员" ></el-radio>
              </el-radio-group>
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
     <el-dialog title="编辑用户" :visible.sync="dialogFormVisible"    custom-class="addDialog"    width="600px">
      <el-form ref="updateForm"  :model="temp" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;">
          <el-form-item label="ID" prop="id" v-show="false">
              <el-input v-model="temp.id" />
            </el-form-item>
            <el-form-item label="账号" prop="realname">
              <el-input v-model="temp.realname" />
            </el-form-item>
          <el-form-item label="姓名" prop="username">
              <el-input v-model="temp.username" />
            </el-form-item>
            <el-form-item label="手机号" prop="telphone">
            <el-input v-model.number="temp.telphone" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
              <el-input v-model="temp.email" />
            </el-form-item>
           <el-form-item label="分组">
              <el-radio-group v-model="update" @change="changeu">
                <el-radio label="查看者"></el-radio>
                <el-radio label="编辑者"></el-radio>
                <el-radio label="管理员"></el-radio>
              </el-radio-group>
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
import { sha512 } from 'js-sha512'
export default {
  name: 'ComplexTable',
  data() {
    return {
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
      add:'',
      update:"",
      addsForm:{   //新增数据
        realname:'',
        username:'',
        email:'',
        group:'',
        telphone:'',
        password:''
      },
      temp:{
        id:'',
        realname:'',
        username:'',
        email:'',
        group:'',
        telphone:'',
        password:''
      },
     repassword:'' ,//接受密码
     reid:''
    }
  },
  filters:{},
  created() {
    this.getList();
    
  },
  methods: {
    change(val){
      console.log("val",val)
      if(val=="查看者"){
        this.addsForm.group='0'
      }else if(val=='编辑者'){
        this.addsForm.group='1'
      }else if(val=="管理员"){
        this.addsForm.group='2'
      }
    },
    changeu(val){
      console.log("val",val)
      if(val=="查看者"){
        this.temp.group='0'
      }else if(val=='编辑者'){
        this.temp.group='1'
      }else if(val=="管理员"){
        this.temp.group='2'
      }
    },
     // 修改table header的背景色
        tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
          if (rowIndex === 0) {
            return 'background-color: #DEE8FE;color: #000;font-weight: 500;'
          }
        }, 
    getList(){  //获取数据
    console.log(this.listQuery)
         this.service.get( '/user/page' ,{
          params:{
           pageNumber: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          name: this.listQuery.name}
           }).then(req => {
          console.log("用户数据",req)
          this.tableData = req.page.list
           this.total = req.page.totalRow //总条数
           this.pages = req.page.totalPage;  //总页数
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
  
    // 重置密码
      reset(row){
        // console.log(row)
        this.reid=row.id
         this.repassword=row.password
          this.$confirm('是否重置密码？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消', type: 'warning' })
          .then(() => { 
            this.service.post('/user/changePassword',{
              id:this.reid,
              password:sha512(this.repassword)
            }).then((response) => {
              console.log('重置密码',response)


              this.$message.success('成功设置密码' + '!');
              this.getList()})
            .catch((response) => {
              this.$message.error('设置失败!');
            });
            
          }) 
          .catch(() => {
          this.$message.info('已取消操作!');
        });
      },
     //编辑弹层
    handleUpdate(index,row){
      this.temp = Object.assign({}, row);  //获得所有数据显示在编辑信息模态框里面

      if(this.temp.group=='0'){
        this.update = "查看者"
      }else if(this.temp.group=='1'){
       this.update = "编辑者"
      }else if(this.temp.group=='2'){
       this.update = "管理员"
      }
      
      this.dialogFormVisible = true; //弹层显示
    },
    // 添加新用户
     handleAdd(){
      // this.temp = {...row};
      this.dialogFormVisible1 = true; //弹层显示
    },

    AddData(){
      // console.log("this.addsForm",this.addsForm)
        let userList=this.addsForm;  
        let {realname,username,email,group,telphone,password} = userList;
          this.service.post('/user/save',this.addsForm).then(res => {
          //  console.log("新增的用户S数据",res)
          this.getList(); 
          this.dialogFormVisible1 = false;}
          );
    },
    //编辑提交
    updateData(){
      this.service.post('/user/update',
        {
        telphone:this.temp.telphone,
        email:this.temp.email,
        id:this.temp.id,
        group:this.temp.group,
        realname:this.temp.realname,
        username:this.temp.username
           }
        ).then(req => {
          console.log("编辑用户信息",req)
          this.getList();
          this.dialogFormVisible = false;
      })
    },
    // 是否允许登录
    allowLogin(row){
      // console.log(row)
        this.reid=row.id
    this.$confirm('是否不允许登录？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消', type: 'warning' })
    .then(() => { 
      this.service.get('/user/changeEnable?id='+this.reid).then((response) => {
        this.$message.success('成功设置为不允许登录' + '!');this.getList()})
        .catch((response) => {
          this.$message.error('设置失败!');
        });
    }) .catch(() => {
    this.$message.info('已取消操作!');
      });
    },


    // 是否允许登录
    notallowLogin(row){
      // console.log(row)
    this.reid=row.id
    this.$confirm('是否允许登录？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消', type: 'warning' })
    .then(() => { 
      this.service.get('/user/changeEnable?id='+this.reid).then((response) => {
        // this.$message.success('成功设置为不允许登录' + '!');
        this.getList()})
        .catch((response) => {
          this.$message.error('设置失败!');
        });
    }) .catch(() => {
    this.$message.info('已取消操作!');
      });
    }
  }
}
</script>
<style  lang="less" scoped>
.el-pagination {
    text-align: center; 
}
.container-title{
    //     display: grid;
    // grid-template-columns: 60% 10% 30%;
    // align-items: center;
    display: flex;
   justify-content: space-between;
   line-height: 42px;
    margin: 16px;
}

.container-title .select_query{
    //   display: grid;
    // grid-template-columns: 45% 20%;
    align-items: center;
    margin-left: 20px;
}
.container-title .filter-item{
  margin:0;
}
/* 操作部分 */
  .btn-upt{   
    margin: 0 .5rem 0 0!important;
    color: #0075EE;
    padding-left: 14px;
  }
// 弹出框
/deep/.el-dialog{
  background: white;
  .el-dialog__header{
    // background: #0075EE;
      color: black;
    .el-dialog__title,.el-dialog__close{
      color: black;
    }
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

/deep/.el-radio{ //单选框的默认样式
    border: 1px solid #DCDFE6;
    width: 80px;
    line-height: 34px;
    padding-left: 3px;
}
/deep/.el-radio::hover {  //按钮点击选中的状态
      border: 1px solid #1989FA;
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