<template>
    <div class="main">
        <div style="display: grid;grid-template-columns: 88% 12%;background: #2770D4;color: #eee;padding: 5px;">
            <div style="padding-left: 10px;">{{titleName}} AIS船舶信息列表</div>
            <div style="padding: 4px;text-align: right;">
                    <el-button type="text" @click="removeMapDom" style="padding: 0;color: #eee;">X</el-button>
            </div>
        </div>
        <div style="padding: 5px;text-align: center;overflow: auto;">
            <el-table
                    size="mini"
                    :data="list"
                    style="width: 100%">
                <el-table-column
                        v-for="(item,index) in tabAisTop"
                        :key="index"
                        :prop="item.prop"
                        :label="item.name"
                        >
                </el-table-column>

            </el-table>
        </div>
        <el-pagination
            style="text-align: center;"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            layout="total,  prev, pager, next, jumper"
            :total="tableData.totalRow">
        </el-pagination>
    </div>
</template>

<script>
export default {
    props:{
        tableData:{
            type:Object,
            default:{}
        },
        // nowRadarId:{
        //     type:Number,
        //     default:-1
        // },
        // total:{
        //     type:Number,
        //     default:0
        // },
        titleName:{
            type:String,
            default:''
        }
    },
    mounted(){
      // this.id=this.tableData.id
      // this.list=this.tableData.list
      // console.log(this.tableData,this.id)
    },
  watch:{
    tableData(val){
      val.list.forEach(e=>{
        e.lon=parseFloat(e.lon).toFixed(6)
        e.lat=parseFloat(e.lat).toFixed(6)
      })
    }
  },
  updated() {
      // if()
    this.id=this.tableData.id
    // this.list=this.tableData.list
    // console.log(this.isChange)
    if(this.isChange){
      this.isChange=false
    }else{

      this.list=this.tableData.list
      // this.list.forEach(e=>{
      //   e.lon=parseFloat(e.lon).toFixed(5)
      //   e.lat=parseFloat(e.lat).toFixed(5)
      // })
    }
    // console.log(this.list,this.id,this.isChange)
  },
  data(){
        return { //船名、航速speed、距离distance、方位经纬度azimuth
            tabAisTop: [
                { id: 0, prop: 'mmsi', name: 'MMSI' },
                { id: 1, prop: 'course', name: '航向' },//course
                { id: 2, prop: 'lon', name: '经度' },
                { id: 3, prop: 'lat', name: '纬度' },
                // { id: 4, prop: 'speed', name: '航速' },
                { id: 4, prop: 'shipType', name: '类型' },
                { id: 5, prop: 'distance', name: '距离' },
                // { id: 7, prop: 'azimuth', name: '方位' },
            ],
            currentPage: 1,
          list:[],
          isChange:false,
          id:0,
        }
    },
    methods:{
        removeMapDom(){
           // console.log(this.tableData)
            this.$emit('remove')
        },

        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
          // let id=this.tableData.id
          this.service.post('/ship/aisShip', {
            id: this.id,
            limit: 6,
            page: val
          })
            .then(res => {
              // let arr = [req.data[0],req.data[1],req.data[2],req.data[3],req.data[4]]
              res.data.list.forEach(e=>{
                e.lon=parseFloat(e.lon).toFixed(6)
                e.lat=parseFloat(e.lat).toFixed(6)
              })
              this.list = res.data.list
              this.isChange=true
              // this.tableData.id=id
              // this.AisDataTabTotal = req.data.totalRow
              console.log(res)
            })
            // this.$emit('handleCurrentChange',val)

        }
    }
}
</script>
<style scoped lang="less">
.main{
    height: 350px;
    display: grid;
    grid-template-rows: 11% 75% 4%;
    background: #305071;
}
/deep/.el-pagination__total, /deep/.el-pagination__jump{
    color: white;
}
/deep/.cell{
    color: white;
}
/deep/.el-table--enable-row-hover /deep/.el-table__body tr:hover > td {
    background-color: transparent !important;
}

.el-table--border::after, .el-table--group::after, .el-table::before{
    background: none!important;
}
/deep/.el-table--border, /deep/.el-table--group, /deep/.el-table, /deep/.el-table th,/deep/ .el-table tr{
    background: transparent;
}
/deep/.el-table td, .el-table th{
    border: none;
}
</style>
