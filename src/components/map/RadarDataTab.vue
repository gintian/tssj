<template>
    <div class="main">
        <div style="display: grid;grid-template-columns: 88% 12%;background:#2770D4;color: #eee;padding: 5px;">
            <div style="padding-left: 10px;">{{titleName}} 雷达船舶信息列表</div>
            <div style="padding: 4px;text-align: right;">
                    <el-button type="text" @click="removeMapDom" style="padding: 0;color: #eee;">X</el-button>
            </div>
        </div>
        <div style="padding: 5px;text-align: center;overflow: auto;">

            <el-table
                    size="mini"
                    :data="tableData"
                    style="width: 100%"
                    :row-class-name="tableRowClassName"
                    @row-click="openDetails">
                <el-table-column
                        type="index"
                        width="50">
                </el-table-column>
                <el-table-column
                        v-for="(item,index) in tabAisTop"
                        :key="index"
                        :prop="item.prop"
                        :label="item.name"
                        >
                </el-table-column>

            </el-table>
        </div>
<!--        分页-->
<!--        <el-pagination-->
<!--            style="text-align: center;"-->
<!--            @current-change="handleCurrentChange"-->
<!--            :current-page="currentPage"-->
<!--            layout="total,  prev, pager, next, jumper"-->
<!--            :total="tableData.totalRow">-->
<!--        </el-pagination>-->
    </div>
</template>

<script>

export default {

    props:{
        tableData:{
            type:Array,
            default:[]
        },

      // tableData:{  分页
      //   type:Object,
      //   default:{}
      // },
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
      // console.log(this.tableData[1])
      // this.tableData[0].isselect=true

    },
  updated() {

  },
  data(){
        return { //船名、航速speed、距离distance、方位经纬度azimuth
            tabAisTop: [
              { id: 0, prop: 'targetid', name: '批号' },
              { id: 1, prop: 'speed', name: '航速' },
              { id: 2, prop: 'course', name: '航向' },//course
              { id: 3, prop: 'distance', name: '距离' },
              { id: 4, prop: 'azimuth', name: '方位' },
              { id: 5, prop: 'lon', name: '经度' },
              { id: 6, prop: 'lat', name: '纬度' },
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
      tableRowClassName({row, rowIndex}) {
        // console.log(row,rowIndex)
        if (row.isselect) {
          return 'warning-row';
        }
        return 'success-row';
      },
      openDetails(row){
          console.log(row)
        this.service.post('/ship/shipTrack', {
          mmsi: row.mmsi,
          radarId: row.radarid,
          targetId: row.targetid,
          urlType: row.urltype
        })
          .then(res => {

            console.log(res)
            // for(let i of this.tableData){
            //   i.isselect=false
            // }
            // row.isselect=true
          })
        // this.$emit('openDetails')
      }
    }
}
</script>
<style>
    .el-table .warning-row {
        background: #fd4935;
    }
    .el-table .success-row {
        background: #f0f9eb;
    }

</style>
<style scoped lang="less">
.main{
    height: 300px;
    display: grid;
    grid-template-rows: 11% 79%;
    background: #305071;
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
