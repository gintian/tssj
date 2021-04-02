<template>
  <div class="app-container">
    <div class="container-title">
      <h3>锚地</h3>
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
    <div class="container-middle">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd()">添加</el-button>
      <div class="select_query">
        <el-input
          v-model="listQuery.name"
          placeholder="输入名称"
          style="width: 200px;"
          class="filter-item"
          @input="query()"
        />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="query()">搜索</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" :header-cell-style="tableHeaderColor">
      <el-table-column prop="id" label="序号" align="center"></el-table-column>
      <el-table-column align="center" prop="name" label="名称"></el-table-column>
      <el-table-column align="center" prop="describe" label="描述"></el-table-column>
      <el-table-column align="center" prop="area" label="区域"></el-table-column>
      <el-table-column prop="type" label="锚地类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 0">圆形</span>
          <span v-if="scope.row.type == 1">矩形</span>
          <span v-if="scope.row.type == 2">多边形</span>
        </template>
      </el-table-column>
      <el-table-column prop="radius" label="区域半径" align="center">
        <template slot-scope="scope">
          <span>半径{{scope.row.radius}}海里</span>
        </template>
      </el-table-column>
      <el-table-column prop="lat,lon" label="位置" align="center" min-width="90%">
        <template slot-scope="scope">
          <span>经度：{{scope.row.lon}}</span>
          <br />
          <span>纬度：{{scope.row.lat}}</span>
        </template>
        <!-- align:	对齐方式,	值有left/center/right	默认left -->
      </el-table-column>

      <el-table-column label="查看地图" align="center">
        <template slot-scope="scope">
          <el-button @click="handleClickView(scope.row)" type="text" size="small" class="btn-upt">查看</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            class="btn-upt"
            @click="handleUpdate(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button type="text" size="small" class="btn-upt" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 查看地图弹窗 -->
    <el-dialog
      :visible.sync="dialog.showMap"
      width="520px"
      :show-close="false"
      custom-class="mapDialog"
    >
      <leaflet-tablemap
        :mapData="mapData"
        markerType="Anchorage"
        :option="{strokeColor:'blue ', strokeWeight:2, strokeOpacity:0.5}"
      ></leaflet-tablemap>
    </el-dialog>
    <!-- 新增弹层功能 -->
    <el-dialog
      title="添加锚地"
      :visible.sync="dialogFormVisible1"
      custom-class="addDialog"
      width="600px"
    >
      <el-form
        :model="formLabelAlign"
        label-position="left"
        label-width="100px"
        ref="ruleForm"
        :rules="formRules"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item v-for="item in addData" :key="item.id" :label="item.name" :prop="item.prop">
          <el-input
            v-model="formLabelAlign[item.prop]"
            v-if="item.id<5"
            :disabled="dialog.disabled"
          ></el-input>

          <el-select
            v-model="formLabelAlign.type"
            placeholder="请选择"
            v-if="item.id==6"
            prop="type"
            :disabled="dialog.disabled"
          >
            <el-option v-for="i in typeList" :key="i.value" :label="i.label" :value="i.value"></el-option>
          </el-select>
        </el-form-item>
        <div class="circle" v-show="formLabelAlign.type==0">
          <el-form-item>
            <el-row>
              <el-col :span="11">
                <el-form-item label="经度" label-position="‘left’" prop="lon">
                  <el-input v-model="formLabelAlign.lon" :disabled="dialog.disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="纬度 " prop="lat">
                  <el-input v-model="formLabelAlign.lat" :disabled="dialog.disabled"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :span="11">
                <el-form-item label="半径" label-position="‘left’" prop="radius">
                  <el-input v-model="formLabelAlign.radius" :disabled="dialog.disabled"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
        <div class="rectangle" v-show="formLabelAlign.type==2">
          <el-form
            :model="dynamicValidateForm"
            ref="dynamicValidateForm"
            label-width="80px"
            class="demo-dynamic"
          >
            <el-form-item v-for="(domain, index) in dynamicValidateForm.domains" :key="index">
              <el-row>
                <el-col :span="11">
                  <el-form-item
                    label="经度"
                    :rules="[{required: true, message: '请输入经度', trigger: 'blur'}]"
                    :prop="'domains.' + index + '.lon'"
                  >
                    <el-input v-model="domain.lon" :disabled="dialog.disabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item
                    label="纬度"
                    :rules="[{required: true, message: '请输入纬度', trigger: 'blur'}]"
                    :prop="'domains.' + index + '.lat'"
                  >
                    <el-input v-model="domain.lat" :disabled="dialog.disabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1">
                  <i
                    class="el-icon-circle-plus-outline"
                    @click="addDomain"
                    style="cursor: pointer;font-size:20px;color: #409eff;margin-left: ;"
                    v-show="interfaceType==='add'"
                  ></i>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <!-- <el-form-item>
                                <el-row>
                                    <el-col :span="11">
                                        <el-form-item label="经度" label-position=‘left’ prop="lon">
                                            <el-input v-model="formLabelAlign.lon" :disabled="dialog.disabled"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="纬度" label-position=‘left’ prop="lat">
                                            <el-input v-model="formLabelAlign.lat" :disabled="dialog.disabled"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
          </el-form-item>-->
          <!-- <el-form-item>
                                <el-row>
                                    <el-col :span="11">
                                        <el-form-item label="经度" label-position=‘left’ prop="lon">
                                            <el-input v-model="formLabelAlign.lon" :disabled="dialog.disabled"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="纬度" label-position=‘left’ prop="lat">
                                            <el-input v-model="formLabelAlign.lat" :disabled="dialog.disabled"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
          </el-form-item>-->
        </div>
        <div class="polygon" v-show="formLabelAlign.type==1">
          <el-form
            :model="dynamicValidateForm"
            ref="dynamicValidateForm"
            label-width="80px"
            class="demo-dynamic"
          >
            <el-form-item v-for="(domain, index) in dynamicValidateForm.domains" :key="index">
              <el-row>
                <el-col :span="11">
                  <el-form-item
                    label="经度"
                    :rules="[{required: true, message: '请输入经度', trigger: 'blur'}]"
                    :prop="'domains.' + index + '.lon'"
                  >
                    <el-input v-model="domain.lon" :disabled="dialog.disabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item
                    label="纬度"
                    :rules="[{required: true, message: '请输入纬度', trigger: 'blur'}]"
                    :prop="'domains.' + index + '.lat'"
                  >
                    <el-input v-model="domain.lat" :disabled="dialog.disabled"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1">
                  <i
                    class="el-icon-circle-plus-outline"
                    @click="addDomain"
                    style="cursor: pointer;font-size:20px;color: #409eff;margin-left: ;"
                    v-show="interfaceType==='add'"
                  ></i>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取消</el-button>
        <el-button type="primary" @click="AddData('dynamicValidateForm')">确定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑弹层功能 -->
    <el-dialog title="编辑锚地" :visible.sync="dialogFormVisible" width="600px">
      <el-form
        ref="updateForm"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <!-- <el-form-item label="类型" prop="type">
              <el-input v-model="temp.type" />
        </el-form-item>-->
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
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 删除弹层功能 -->
    <el-dialog :visible.sync="dialogDelVisible" custom-class="deleteDialog" width="200px">
      <p>确定删除？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelVisible = false">取消</el-button>
        <el-button type="primary" @click="delData()">删除</el-button>
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
      :total="rows"
    ></el-pagination>
  </div>
</template>

<script>
import { formRules } from "../../utils/formRules";
import LeafletTableMap from '../../../src/components/LeafletTableMap'
// import TableMap from '../../../src/components/TableMap'
export default {
  name: "Anchorage",
  components:{'leaflet-tablemap':LeafletTableMap},
  // components:{'table-map':TableMap},
  data() {
    const validateRules = {
      lon1: (rule, value, callback) => {
        if (this.formLabelAlign.type == 2) {
          let reg = /^\d+$|^\d+\.\d+$/g;
          if (!value) {
            callback(new Error("请输入经度"));
          } else if (!reg.test(value)) {
            callback(new Error("请输入数字"));
          } else {
            callback();
          }
        }
        callback();
      },
      lon2: (rule, value, callback) => {
        if (this.formLabelAlign.type == 2) {
          let reg = /^\d+$|^\d+\.\d+$/g;
          if (!value) {
            callback(new Error("请输入经度"));
          } else if (!reg.test(value)) {
            callback(new Error("请输入数字"));
          } else {
            callback();
          }
        }
        callback();
      },
      lat1: (rule, value, callback) => {
        if (this.formLabelAlign.type == 2) {
          let reg = /^\d+$|^\d+\.\d+$/g;
          if (!value) {
            callback(new Error("请输入纬度"));
          } else if (!reg.test(value)) {
            callback(new Error("请输入数字"));
          } else {
            callback();
          }
        }
        callback();
      },
      lat2: (rule, value, callback) => {
        if (this.formLabelAlign.type == 2) {
          let reg = /^\d+$|^\d+\.\d+$/g;
          if (!value) {
            callback(new Error("请输入纬度"));
          } else if (!reg.test(value)) {
            callback(new Error("请输入数字"));
          } else {
            callback();
          }
        }
        callback();
      },
      centerx: (rule, value, callback) => {
        if (this.formLabelAlign.type == 0) {
          let reg = /^\d+$|^\d+\.\d+$/g;
          if (!value) {
            callback(new Error("请输入经度"));
          } else if (!reg.test(value)) {
            callback(new Error("请输入数字"));
          } else {
            callback();
          }
        }
        callback();
      },
      centery: (rule, value, callback) => {
        if (this.formLabelAlign.type == 0) {
          let reg = /^\d+$|^\d+\.\d+$/g;
          if (!value) {
            callback(new Error("请输入纬度"));
          } else if (!reg.test(value)) {
            callback(new Error("请输入数字"));
          } else {
            callback();
          }
        }
        callback();
      },
      radius: (rule, value, callback) => {
        if (this.formLabelAlign.type == 0) {
          let reg = /^\d+$|^\d+\.\d+$/g;
          if (!value) {
            callback(new Error("请输入半径"));
          } else if (!reg.test(value)) {
            callback(new Error("请输入数字"));
          } else {
            callback();
          }
        }
        callback();
      }
    };
    return {
      Anchorage:null,
      interfaceType: "",
      dynamicValidateForm: {
        //多边形经纬度
        domains: [
          { lon: "", lat: "" },
          { lon: "", lat: "" }
        ]
      },
      rules: {
        lon1: [{ validator: validateRules.lon1, trigger: "blur" }],
        lat1: [{ validator: validateRules.lat1, trigger: "blur" }],
        lon2: [{ validator: validateRules.lon2, trigger: "blur" }],
        lat2: [{ validator: validateRules.lat2, trigger: "blur" }],
        centerx: [{ validator: validateRules.centerx, trigger: "blur" }],
        centery: [{ validator: validateRules.centery, trigger: "blur" }],
        radius: [{ validator: validateRules.radius, trigger: "blur" }],
        type: [{ required: true, message: "请选择区域类型", trigger: "change" }]
      },
      formRules: formRules,
      formLabelAlign: {
        name: "",
        lon: "",
        lat: "",
        attributionId: "",
        type: "",
        points: [{ lon: "", lat: "" }],
        // centerx: '',
        // centery: '',
        radius: ""
        // lat1: '',
        // lat2: '',
        // lon1: '',
        // lon2: '',
      },
      dialog: {
        visible: false,
        title: "",
        showBtn: true,
        showMap: false,
        disabled: false
      },
      mapData: {},
      tableData: [], //表格展示的数据
      pages: 1, //总页数
      total: 1, //总条数
      listQuery: {
        pageNumber: 1, //当前页面
        pageSize: 10, //条数
        name: "" //查询条件
      },
      addData: [
        { id: 0, prop: "name", name: "名称" },
        { id: 1, prop: "lon", name: "经度" },
        { id: 2, prop: "lat", name: "纬度" },
        { id: 3, prop: "describe", name: "描述" },
        { id: 4, prop: "ares", name: "区域" },
        { id: 6, prop: "type", name: "区域类型" }
      ],
      typeList: [
        {
          value: 0,
          label: "圆形"
        },
        {
          value: 2,
          label: "矩形"
        },
        {
          value: 1,
          label: "多边形"
        }
      ],
      dialogDelVisible: false, //删除弹层显示与隐藏
      dialogFormVisible: false, //编辑弹层显示与隐藏
      dialogFormVisible1: false, //新增弹层显示与隐藏
      addsForm: {
        //新增数据
        // points:'',
        // name:'',
        lat: "", //维度
        lon: "", //经度
        type: "", //类型
        describe: "",
        area:''
        // radius:'',
      },
        rows:1, //总条数
      temp: {
        //编辑的表单字段
        id: "",
        points: "",
        name: "",
        lat: "", //维度
        lon: "", //经度
        type: "", //类型
        radius: "",
        describe: "",
        area:""
      },
       uploadUrl:'anchorage/pushExcel',
       fileList: [],
      Business_exception: null
    };
  },
  mounted() {
    this.getList();
    Object.assign(this.formRules, this.rules);
  },
  methods: {
      submitUpload(){
          this.$refs.upload.submit();
          // this.importdialog=true
      },
       // 导入数据
       uploadSectionFile(item){
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
            },
            data: form,
          }).then((res) => {
            // console.log("返回数据：",res);
            //  console.log("返回数据状态码：",res.data.error);
            if(res.data.error==0){
              //  this.$message.success('成功导入船舶离线数据' + '!');
               this.$alert('成功导入1条船舶离线数据!');
              //  this.$message({
              //   type: 'success',
              //   message: '成功导入船舶离线数据!',
              //   offset:500
              // });
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
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: #DEE8FE;color: #000;font-weight: 500;";
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({ lng: "", lat: "" });
    },
    getList() {
      //获取数据
      this.service
        .get("/anchorage/page", {
          params: {
            pageNumber: this.listQuery.pageNo,
            pageSize: this.listQuery.pageSize,
            name: this.listQuery.name
          }
        })
        .then(req => {
          console.log("锚地数据", req);
          this.tableData = req.page.list;
          this.total = req.page.totalRow; //总条数
          this.rows=req.page.totalRow
        });
    },
    handleClickView(row) {
      console.log("查看地图",row);
      this.dialog.showMap = true;
      // if (row.waters) {
      //   row = { ...row, ...row.waters };
      // }
      this.mapData = row;
    },
    // 数据写入excel
    download() {
      // var that = this;
      require.ensure([], () => {
        // eslint-disable-next-line camelcase,global-require
        const { export_json_to_excel } = require("@/vandor/export2Excel.js");
        const tHeader = ["序号", "名称", "锚地类型", "区域", "经度", "纬度"]; // 表头
        const filterVal = ["id", "name", "type", "radius", "lat", "lon"]; // 值
        const list = this.tableData;
        console.log("后端返回的数据", list);
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "锚地数据excel");
      });
    },
    // 格式转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    query() {
      //按名称查询
      this.getList();
    },
    handleSubmit(row) {},
    //当前条数变化
    handleSizeChange(val = this.listQuery.pageSize) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    //当前页变化
    handleCurrentChange(val = this.listQuery.pageNo) {
      this.listQuery.pageNo = val;
      this.getList();
    },
    //删除弹层
    handleDel(row) {
      // this.temp = {...row};
      this.delid = row.id;
      console.log("这行数据的id", this.delid);
      this.temp = { ...row };
      this.dialogDelVisible = true; //弹层显示
    },
    //删除提交
    delData() {
      this.service.get("/anchorage/delete?id=" + this.delid, {}).then(req => {
        console.log("删除AIS数据", req);
        this.getList();
        this.dialogDelVisible = false;
      });
    },
    //编辑弹层
    handleUpdate(index, row) {
      this.temp = Object.assign({}, row); //获得所有数据显示在编辑信息模态框里面
      this.dialogFormVisible = true; //弹层显示
    },
    // 添加锚地
    handleAdd() {
      this.dialogFormVisible1 = true; //弹层显示
      this.interfaceType = "add";
      this.formLabelAlign = {};
      this.dynamicValidateForm.domains = [
        { lon: "", lat: "" },
        { lon: "", lat: "" }
      ];
    },
    AddData() /* 提交表单 */ {
      // alert('submit!'); /basicData/personnel/add
      console.log(this.formLabelAlign);
      (this.formLabelAlign.points = this.dynamicValidateForm.domains),
        this.service
          .post("/anchorage/save", {
            ...this.formLabelAlign
          })
          .then(res => {
            // console.log(res,'表单提交')

            this.getList();
            this.dialogFormVisible1 = false;
            if (res.code === 0) {
              this.dialog.visible = false;
            }
            // this.formLabelAlign={}
          })
          .catch(err => {
            this.$message({ message: err.msg, type: "error" });
            console.log(err);
            this.queryData();

            //  return false;
          });
    },

    //  AddData(formName, formName2)  /* 提交表单 */{
    //     let userList=this.addsForm;
    //     let {lat,lon,type,points,radius,describe} = userList;
    //       this.service.post('/anchorage/save',this.addsForm).then(res => {
    //         console.log("新增的锚地数据",res)
    //          this.getList();
    //       this.dialogFormVisible1 = false;}
    //       );
    // },
    //编辑提交
    updateData() {
      this.service
        .post("/anchorage/update", {
          id: this.temp.id,
          lat: this.temp.lat,
          lon: this.temp.lon,
          type: this.temp.type,
          describe: this.temp.describe,
          area:this.temp.area,
        })
        .then(req => {
          console.log("编辑锚地信息", req);
          this.getList();
          this.dialogFormVisible = false;
          //  if(req.data.waters.type===1){//多边形
          //   this.dynamicValidateForm.domains=[...req.data.waters.points]
          // }
          // console.log(this.dynamicValidateForm.domains)
          // req.data.type = req.data.waters.type;
          // this.formLabelAlign = {...req.data}
        });
    }
  }
};
</script>
<style  lang="less" scoped>
@import "../../assets/css/object.less";
</style>