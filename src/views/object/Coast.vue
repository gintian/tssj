<template>
 <div class="app-container" >
    <div class="container-title" >
        <h3>海防单位</h3>
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
    <el-table-column prop="id"  label="序号" align="center"> </el-table-column>
    <el-table-column align="center" prop="name" label="名称"></el-table-column>
    <el-table-column prop="parent_id" label="上级单位"  align="center"></el-table-column>
     <el-table-column  prop="type" label="类型"  align="center">
        <template slot-scope="scope">
            <span v-if="scope.row.type == 1">海军</span>
            <span v-if="scope.row.type == 2">陆军海防部队</span>
            <span v-if="scope.row.type == 3">军分区</span>
            <span v-if="scope.row.type == 4">海警局</span>
            <span v-if="scope.row.type == 5">公安局</span>
            <span v-if="scope.row.type == 6">海事局</span>
            <span v-if="scope.row.type == 7">海洋与渔业局</span>
            <span v-if="scope.row.type == 8">军民融合办</span>
            <span v-if="scope.row.type == 9">海关</span>
            <span v-if="scope.row.type == 10">边检</span>
      </template>
     </el-table-column>
     <el-table-column align="center" prop="description" label="描述"> </el-table-column>
    <el-table-column prop="lat,lon" label="位置" align="center"  min-width="90%">
       <template slot-scope="scope">   
            <span> 经度：{{scope.row.longitude}}</span><br>
            <span> 纬度：{{scope.row.latitude}}</span>
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
       <leaflet-tablemap :mapData="mapData"  markerType="coast" :option="{strokeColor:'blue ', strokeWeight:2, strokeOpacity:0.5}"></leaflet-tablemap>
</el-dialog>
 <!-- 新增弹层功能 -->
     <el-dialog title="添加海防单位" :visible.sync="dialogFormVisible1"  custom-class="addDialog"    width="600px">
      <el-form ref="updateForm"  :model="addsForm" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;"    :rules="formRules">
          <el-form-item label="名称" prop="name" >
              <el-input v-model="addsForm.name" />
            </el-form-item>  
          <el-form-item label="经度" prop="longitude">
              <el-input v-model="addsForm.longitude" />
            </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input v-model="addsForm.latitude" />
          </el-form-item>
          <el-form-item label="上级单位id" prop="parent_id">
            <el-input v-model="addsForm.parent_id" />
          </el-form-item>
          <el-form-item label="类型" prop="type">
              <el-select  v-model="addsForm.type"  class="selectInput"  :popper-append-to-body="false"  style="width: 301px;">
                  <el-option   v-for="item in options"  :value="item.value"   :label="item.label" :key="item.value">        
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="description">
              <el-input v-model="addsForm.description" />
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
     <el-dialog title="编辑AIS" :visible.sync="dialogFormVisible"  width="600px">
      <el-form ref="updateForm"  :model="temp" label-position="left" label-width="100px"
       style="width: 400px; margin-left:50px;" :rules="formRules">
            <el-form-item label="id" prop="id" >
              <el-input v-model="temp.id" />
            </el-form-item>
            <el-form-item label="名称" prop="name" >
              <el-input v-model="temp.name" />
            </el-form-item>
          <el-form-item label="上级单位id" prop="parent_id">
            <el-input v-model="temp.parent_id" />
          </el-form-item>
           <el-form-item label="经度" prop="longitude">
              <el-input v-model="temp.longitude" />
            </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input v-model="temp.latitude" />
          </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-input v-model="update" @change="changeu" />
            </el-form-item>
             <el-form-item label="描述" prop="description">
              <el-input v-model="temp.description" />
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

import {formRules} from '../../utils/formRules';
import LeafletTableMap from '../../../src/components/LeafletTableMap'
export default {
  name: 'ComplexTable',
  components:{'leaflet-tablemap':LeafletTableMap},
  data() {
    return {
      ais:null,
     dialog: {
          visible: false,
          title: '',
          showBtn:true,
          showMap:false,
          disabled:false
        },
        
      formRules:formRules,
      mapData: {},
      tableData: [], //表格展示的数据
      pages:1, //总页数
      rows:1, //总条数
      listQuery:{
        pageNumber:1, //当前页面
        pageSize:10, //条数
        name:'' , //查询条件
        id:''
      },
      delid:'',
      dialogDelVisible:false, //删除弹层显示与隐藏
      dialogFormVisible:false, //编辑弹层显示与隐藏
      dialogFormVisible1:false, //新增弹层显示与隐藏
      addsForm:{   //新增数据
        name:'',
        latitude:'',
        longitude:'',
        type:'',
        parent_id:'',
        description:''
      },
      temp:{  //编辑的表单字段
        id:'',
        name:'',
        latitude:'',
        longitude:'',
        type:'',
        parent_id:'',
        description:''
      },
      update:'',
    
      options:[{
        value:'海军',
        lable:'海军'
      },{
        value:'陆军海防部队',
        lable:'陆军海防部队'
      },{
        value:'军分区',
        lable:'军分区'
      },{
        value:'海警局',
        lable:'海警局'
      },{
        value:'公安局',
        lable:'公安局'
      },{
        value:'海事局',
        lable:'海事局'
      },{
        value:'海洋与渔业局',
        lable:'海洋与渔业局'
      },{
        value:'军民融合办',
        lable:'军民融合办'
      },{
        value:'海关',
        lable:'海关'
      },{
        value:'边检',
        lable:'边检'
      }],
       uploadUrl:'org/pushExcel',
       fileList: [],
    }
  },
  filters:{},
  created() {
    this.getList();
    this.orgType()
  },
  methods: {
    // 组织机构枚举
    orgType(){
          this.service.get('/enum/orgType',{
          params:{
         }
         }).then(res => {
          console.log("组织机构枚举",res)
          var coastType=res.list
          for(var i in coastType){
            //  console.log('coastType',coastType[i])
          }
        }) 
    },
        submitUpload(){
          this.$refs.upload.submit();
      },
       // 导入数据
       uploadSectionFile(item){
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
            if(res.data.error==0){
               this.$message({
                type: 'success',
                message: res.data.message,
                offset:500
              });
               this.getList();
            }
          });
      } ,  
     // 修改table header的背景色
        tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
          if (rowIndex === 0) {
            return 'background-color: #DEE8FE;color: #000;font-weight: 500;'
          }
        }, 
    changeu(val){
      // console.log("val",val)
       if(val=='海军'){
          this.temp.type=1
        }else if(val=='陆军海防部队'){
          this.temp.type=2
        }else if(val=='军分区'){
          this.temp.type=3
        }else if(val=='海警局'){
          this.temp.type=4
        }else if(val=='公安局'){
          this.temp.type=5
        }else if(val=='海事局'){
          this.temp.type=6
        }else if(val=='海洋与渔业局'){
          this.temp.type=7
        }else if(val=='军民融合办'){
          this.temp.type=8
        }else if(val=='海关'){
          this.temp.type=9
        }else if(val=='边检'){
          this.temp.type=10
        }
    },
    getList(){  //获取数据
         this.service.get('/org/page',{
             params:{
           pageNumber: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          name: this.listQuery.name}
         }).then(req => {
          console.log("海防单位数据",req)
          this.tableData = req.page.list
          this.rows=req.page.totalRow
        }) 
    },
     handleClickView(row) {
        console.log('查看地图')
        this.dialog.showMap = true
          this.mapData = row;
      },
    // 数据写入excel _this2.formatJson is not a function
    download() {
      // var that = this;
      require.ensure([], () => {
        // eslint-disable-next-line camelcase,global-require
        const { export_json_to_excel } = require('@/vandor/export2Excel.js');
        const tHeader = ['序号', '名称','上级单位id','经度','纬度','类型','描述']; // 表头
        const filterVal = ['id', 'name','parent_id','longitude','latitude','type','description']; // 值
        const list = this.tableData;
        // console.log('后端返回的数据', list);
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '海防单位数据表');
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
      //  console.log("这行数据的id",this.delid)
      this.temp = {...row};
      this.dialogDelVisible = true; //弹层显示
    },
    //删除提交
    delData(){
         this.service.get( '/org/delete?id='+this.delid,{     
         }).then(req => {
          // console.log("删除组织机构数据",req)
          this.getList();
          this.dialogDelVisible = false;
        }) 
    },

     //编辑弹层
    handleUpdate(index,row){
     this.temp = Object.assign({}, row);  //获得所有数据显示在编辑信息模态框里面
    //  console.log('获取到的',this.temp)
      if(this.temp.type==1){
        this.update = "海军"
      }else if(this.temp.type==2){
       this.update = "陆军海防部队"
      }else if(this.temp.type==3){
       this.update = "军分区"
      }else if(this.temp.type==4){
       this.update = "海警局"
      }else if(this.temp.type==5){
       this.update = "公安局"
      }else if(this.temp.type==6){
       this.update = "海事局"
      }else if(this.temp.type==7){
       this.update = "海洋与渔业局"
      }else if(this.temp.type==8){
       this.update = "军民融合办"
      }else if(this.temp.type==9){
       this.update = "海关"
      }else if(this.temp.type==10){
       this.update = "边检"
      }
      this.dialogFormVisible = true; //弹层显示
    },
    // 添加雷达
     handleAdd(){
      this.dialogFormVisible1 = true; //弹层显示
    },
     AddData(){
        // console.log("this.addsForm",this.addsForm)
        if(this.addsForm.type=='海军'){
          this.addsForm.type=1
        }else if(this.addsForm.type=='陆军海防部队'){
          this.addsForm.type=2
        }else if(this.addsForm.type=='军分区'){
          this.addsForm.type=3
        }else if(this.addsForm.type=='海警局'){
          this.addsForm.type=4
        }else if(this.addsForm.type=='公安局'){
          this.addsForm.type=5
        }else if(this.addsForm.type=='海事局'){
          this.addsForm.type=6
        }else if(this.addsForm.type=='海洋与渔业局'){
          this.addsForm.type=7
        }else if(this.addsForm.type=='军民融合办'){
          this.addsForm.type=8
        }else if(this.addsForm.type=='海关'){
          this.addsForm.type=9
        }else if(this.addsForm.type=='边检'){
          this.addsForm.type=10
        }
        let userList=this.addsForm;  
        let {parent_id,name,latitude,longitude,type,description} = userList;
          this.service.post('/org/save',this.addsForm).then(res => {
            // console.log("新增的海防单位数据",res)
          this.getList(); 
          this.dialogFormVisible1 = false;}
          );
    },
    //编辑提交
    updateData(){
       this.service.post('/org/update',{
         id:this.temp.id,
          parent_id:this.temp.parent_id,
          name:this.temp.name,
          latitude:this.temp.latitude,
         longitude:this.temp.longitude,
        description:this.temp.description,
        type:this.temp.type,
       }).then(req => {
          // console.log("编辑海防单位信息",req)
          this.getList();
          this.dialogFormVisible = false;
      })
    }
  }
}
</script>
<style  lang="less" scoped>
@import '../../assets/css/object.less';
/deep/ .el-scrollbar__wrap{
      overflow: scroll;
    /* height: 100%; */
    height: 120px;
}
</style>