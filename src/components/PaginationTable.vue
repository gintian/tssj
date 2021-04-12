<template>
  <div class="table-wrapper" >

    <!-- 主体表格 -->
    <div style="padding: 1em;min-height: 80%;">
      <el-table
        :data="tableData"
        border
         height="710px"
        style="width: 100%;height: 84%;"
         :header-cell-style="{background:'#DEE8FE',color:'#000'}">
        >
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
         v-for="t in tabTop" :key="t.id"
          :prop="t.prop"
          :label="t.name"
          >
        </el-table-column>

        <el-table-column
                label="查看轨迹"
                v-if="isTravel"
        >
          <template slot-scope="scope">

            <el-button v-if="isTravel" @click="handleClickTravel(scope.row)" type="text" size="small" class="btn-upt">查看</el-button>
          </template>

        </el-table-column>

        <el-table-column
          label="查看地图"
          v-if="isView"
          >
          <template slot-scope="scope">

            <el-button v-if="isView" @click="handleClickView(scope.row)" type="text" size="small" class="btn-upt">查看</el-button>
          </template>

        </el-table-column>


        <el-table-column
                label="处理情况"
                v-if="isPass"
        >
          <template slot-scope="scope">

            <div >

              <p v-if="scope.row.isThrough" style="display: inline-block;width: 50%;color:#2ac06d">
                <font-awesome-icon  icon='check-circle' style=" font-size: 16px;" class="" />
                通过</p>


              <el-popconfirm
                      title="确定通过吗？"
                      @onConfirm="handleClickPass(scope.row)"
              >
                <p  v-if="!scope.row.isThrough" style="display: inline-block;width: 50%;color: #ffd256;cursor: pointer" slot="reference">
                  <font-awesome-icon  icon='spinner' style=" font-size: 16px;" class="" />
                  待通过</p>
              </el-popconfirm>


            </div>
          </template>

        </el-table-column>

        <el-table-column
          v-if="isUpdata||isDelete||isMore"
          label="操作"
          >
          <template v-if="isUpdata||isDelete||isMore" slot-scope="scope">
            <el-button v-if="isMore" @click="handleClickMore(scope.row)" type="text" size="small" class="btn-upt">详情</el-button>
            <el-button v-if="isPlay" @click="handleClickPlay(scope.row)" type="text" size="small" class="btn-upt">播放</el-button>
            <el-button v-if="isUpdata" @click="handleClickUpdata(scope.row)" type="text" size="small" class="btn-upt" >编辑</el-button>
            <el-button v-if="isDelete"  @click="handleClickDelete(scope.row)" type="text" size="small"  slot="reference" class="btn-upt">删除</el-button>
            
            <!-- <el-popconfirm
                    title="确定删除吗？"
                    @onConfirm="handleClickDelete(scope.row)"
            >
              <el-button v-if="isDelete" type="text" size="small"  slot="reference" class="btn-upt">删除</el-button>
            </el-popconfirm> -->
          </template>
        </el-table-column>


        <el-table-column
                label="处理情况"
                v-if="isDeal"
        >
          <template slot-scope="scope">
            <div @click="handleClickDeal(scope.row)" style="cursor: pointer">
              <font-awesome-icon  :icon="icons[scope.row.status][0]" style=" font-size: 16px;" :class="icons[scope.row.status][0]" />
              <p style="display: inline-block;width: 50%">{{icons[scope.row.status][1]}}</p>
            </div>
          </template>

        </el-table-column>
      </el-table>
    </div>
      <!-- 分页 -->
    <div style="text-align: center;padding-bottom: 1em;margin-top: 1%;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 40, 60]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import LeafletTableMap from '../components/LeafletTableMap'
  import { MessageBox } from 'element-ui';
export default {
  name: 'BasalData',
  props: {
    msg: String,
    tabTop:Array,
    tableData:Array,
    markerType:String,
    rowData:{
      type:Object,
      default:()=>{}
    },
    isUpdata:{
      type:Boolean,
      default:true
    },
    isTravel:{
      type:Boolean,
      default:false
    },
    isMore:{
      type:Boolean,
      default:false
    },
    isPlay:{
      type:Boolean,
      default:false
    },
    isDelete:{
      type:Boolean,
      default:true
    },
    isView:{
      type: Boolean,
      default: false
    },
    isDeal:{
      type: Boolean,
      default: false
    },
    isPass:{
      type: Boolean,
      default: false
    },
    total:{
      type: Number,
      default: 100
    }
  },
  components: {
    // 'table-map':TableMap
    'leaflet-tablemap':LeafletTableMap
  },
  data() {
    return {
      currentPage:1,
      // total:100,
      // rowData:{},
      mapDialog:false,
      icons:{
        2:['check-circle','已处理'],
        1:['spinner','处理中'],
        0:['exclamation-circle','未处理']
      }
    }
  },
  mounted(){

  },
  methods: {
    // 修改table header的背景色
        // tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
        //   if (rowIndex === 0) {
        //     return 'background-color: #C331A9;color: #000;font-weight: 500;'
        //   }
        // }, 
    handleSizeChange(val) {
     // console.log(`每页 ${val} 条`);
      this.$emit('handleSizeChange',val)
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.$emit('handleCurrentChange',val)
    },
    handleClickPlay(row){
      //console.log(`编辑: ${row}`);
      this.$emit('handleClickPlay',row)
    },
    handleClickUpdata(row){
      console.log(`编辑: ${row}`);
       this.$emit('handleClickUpdata',row)

    },
    handleClickMore(row){
      //console.log(`编辑: ${row}`);
      this.$emit('handleClickMore',row)

    },
    handleClickDelete(row){
     console.log(`删除: ${row}`);
       this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('handleClickDelete',row)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      
    },
    handleClickTravel(row){
      this.$emit('handleClickTravel',row)
    },
    handleClickView(row){
      this.$emit('handleClickView',row)
    },
    handleClickDeal(row){

      if(row.status===1){
        MessageBox.prompt('请输入备注', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.$emit('handleClickDeal',row,value)
          this.$message({
            type: 'success',
            message: '你的备注是: ' + value
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '放弃处理'
          });
        });
      }else if(row.status===0){
        MessageBox.confirm('此操作将修改处理情况, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('handleClickDeal',row)
          this.$message({
            type: 'success',
            message: '处理成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消处理'
          });
        });
      }else{
        // this.$emit('handleClickDeal',row)
      }

    },
    handleClickPass(row){
      // console.log(row)
      this.$emit('handleClickPass',row)
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.check-circle{
  color: #2ac06d;
}
.spinner{
  /* color: rgb(255, 255, 255); */
  color: black;
}
.exclamation-circle{
  color: #bd3538;
}
.top-div {
  display: grid;
  grid-template-columns: 70% 20% 10%;
  padding: 1em 1em 0em 1em;
}
  .btn-upt{
    margin: 0 .5rem 0 0!important;
    /*margin: 0!important;*/
  }
  .mapDialog .el-dialog__header{
    padding: 0 !important;
  }
.mapDialog .el-dialog__body{
  padding: 10px !important;
}
.anchorBL {
  display: none;
}

</style>
<style lang="less" >

  @media screen and (max-width: 1366px) {
    .table-wrapper /deep/  .el-table--enable-row-transition .el-table__body td, .el-table .cell{
      background-color: transparent;
      padding: 2px;
    }
  }
  @media screen and (min-width: 1367px) {
    .table-wrapper /deep/  .el-table--enable-row-transition .el-table__body td, .el-table .cell{
      background-color: transparent;
    }
  }

  .table-wrapper{
    // height: 100%;
    // display: grid;
    // grid-template-rows: 90% 10%;
  }

  .table-wrapper .cell{
    // color: white;
    color: black;
  }
  .table-wrapper .el-table--border{
    border: none!important;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: rgba(0, 0, 0, 0) !important;
  }
  .table-wrapper .el-table td, .el-table th{
    text-align: center!important;
    // color: #c8c8c8;
  }
  .el-table th, .el-table tr{
    // background: none!important;
  }
  .el-table--border::after, .el-table--group::after, .el-table::before{
    background: none!important;
  }
  .el-table td, .el-table th{
    border: none!important;
  }
  
  .el-table{
    background: transparent!important;
  }

  ::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 0px;
  }
  ::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #535353;
  }
  ::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background   : #ededed;
  }
</style>
