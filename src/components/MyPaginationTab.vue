<template>
  <div >
    <!-- 主体表格 -->
    <table style="width: 100%;">
        <thead style="font-size: 15px;font-weight: bold;">
            <tr>
                <td v-for="itme in tabTop" :key="itme.id">
                    {{itme.name}}
                </td>
            </tr>
        </thead>
        <tbody id="body">
            <tr class="tab-body-tr" v-bind:class='{ bg:index === isactive }' v-for="(itmeone,index) in tableData" :key="itmeone.id" @click="tronClick(index,itmeone)" :ref="'tab'+itmeone.azimuth">
                <td v-for="itmetow in tabTop" :key='itmetow.id' >
                    {{itmeone[itmetow.prop]}}
                </td>
            </tr>
        </tbody>
    </table>

  </div>
</template>

<script>
export default {
  name: 'MyPaginationTab',
  props: {
    msg: String,
    tabTop:Array,
    tableData:Array,
    isUpdata:{
      type:Boolean,
      default:true
    },
    isDelete:{
      type:Boolean,
      default:true
    },
    isView:{
      type: Boolean,
      default: false
    },
    nowRadarId:{
      type:Number,
      default:0
    },
    isClick:{
      type:Boolean,
      default:false
    }
  },  
  data() {
    return {
      currentPage:1,
      total:100,
      isactive:-1
    }
  },
  watch:{
    'tableData':function(val){
      let is = true;
      //console.log(this)
      for (let i = 0; i < val.length; i++) {
        //const element = val[i];
          if(val[i].isselect){
            this.isactive = i;
            is = false;
          }
          if(is){
            this.isactive = -1;
          }

        val[i].speed = parseFloat(val[i].speed).toFixed(2);
        val[i].azimuth = parseFloat(val[i].azimuth).toFixed(2);
        val[i].course = parseFloat(val[i].course).toFixed(2);
        val[i].distance = parseFloat(val[i].distance).toFixed(2);
        val[i].lon = parseFloat(val[i].lon).toFixed(2);
        val[i].lat = parseFloat(val[i].lat).toFixed(2);

      }
    }
  },

  mounted(){
    console.log(this.tabTop);
  },
  methods: {
    tronClick(index,itmeone){

      if(!this.isClick){return}

      this.isactive = index;
      console.log(itmeone)
      this.$httpWrapPOST('/ship/shipTrack',{
        param:{
          radarid:this.nowRadarId,
          targetid:itmeone.targetid,
          urltype:itmeone.urltype
        }  
      })
      //console.log(this.$refs['tab'+time])
    },
    handleSizeChange(val) {
     // console.log(`每页 ${val} 条`);
      this.$emit('handleSizeChange',val)
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.$emit('handleCurrentChange',val)
    },
    handleClickUpdata(row){
      //console.log(`编辑: ${row}`);
       this.$emit('handleClickUpdata',row)
    },
    handleClickDelete(row){
     // console.log(`删除: ${row}`);
       this.$emit('handleClickDelete',row)
    },
    handleClickView(row){
      console.log(row);
      this.$emit('handleClickView',row)
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

/*.el-table >>> .el-table__body {
  width: 100%!important;
}
.el-table >>> .el-table__header{
  width: 100%!important;
}*/

.top-div {
  display: grid;
  grid-template-columns: 70% 20% 10%;
  padding: 1em 1em 0em 1em;
}
  .btn-upt{
    margin: 0 1rem;
  }
  .tab-body-tr {
    cursor: pointer;
  }
  .bg {
    background: #F44336;
    color: #fff;
  }
</style>
