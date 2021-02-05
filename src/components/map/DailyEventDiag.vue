<template>
    <div class="main">
        <div style="display: grid;grid-template-columns: 88% 12%;background: #2770D4;color: #eee;    padding: 3px;">
            <div style="padding-left: 10px;">当天事件</div>
            <div style="padding:0 4px;text-align: right;">
                <el-button type="text"@click="$emit('hide')" style="padding: 0;color: #eee;">X
                </el-button>
            </div>
        </div>
        <div style="overflow: auto;padding: 5px;" class="content">

            <div class="inner">
                <el-table
                        :data="dailyList.list"
                        @row-click="searchRow"
                        style="width: 100%">
                    <el-table-column
                            type="index"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            prop="mmsi"
                            label="MMSI"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="shipType"
                            label="船舶类型"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="reason"
                            label="原因"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="creatTime"
                            label="时间"
                            width="110">
                    </el-table-column>
                </el-table>
            </div>


            <el-pagination
                    layout="prev, pager, next"
                    :hide-on-single-page="true"
                    @current-change="handleCurrentChange"
                    :page-size="3"
                    :current-page="dailyList.pageNumber"
                    :total="dailyList.totalRow">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        dailyList:{
            type:Object,
            default:()=>{}
        },
    },
    computed: {
    },
    watch:{
      dailyList(e){
        // console.log(e)
        for(let i of e.list){

          i.creatTime=new Date(i.creatTime).toLocaleDateString().replace(/\//g,'-')+ ' ' +  new Date(i.creatTime).toTimeString().split(' ')[0];
        }

      }
    },
    mounted(){
        //console.log('shipTabObj',this.shipTabObj)

      // this.tabObj.isFocus=false

    },
  updated() {
  },
  data(){
        return {


        }

    },
  methods:{
    remove(){
      this.$emit('remove')
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.$emit('change1',{page:val,today:this.dailyList.today})
    },
    searchRow(row){
      // console.log(row)
      this.$emit('search',row)
    }
  }

}
</script>
<style  scoped lang="less">
.main{

    display: grid;
    grid-template-rows: 10% 90%;
    height: 310px;
    width: 550px;
    background: #305071;
}
    .content{
        display: grid;
        grid-template-rows: 90% 10%;
    }
/deep/.el-pagination{
    /*position: absolute;*/
    /*bottom: 0;*/
    /*right: 0;*/
    text-align: center;
    color: white;
    background: transparent;
    .btn-next,  .btn-prev{
        background: transparent;
        color: white;
        min-width: 15px;
    }
    .el-dialog, .el-pager li{
        background: transparent;
        min-width: 15px;
    }
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
