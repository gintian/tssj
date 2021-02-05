<template>

    <div id="focus">

        <div class="title">

            <h4>我的关注 </h4>
            <i class="el-icon-close" @click="$emit('hide')"></i>
        </div>
        <div class="content" style="overflow: auto;height: calc(100% - 40px)">
            <el-table
                    :data="tableData"
                    height="97%"
                    :cell-style="{ textAlign: 'center' }"
                    border
                    @row-click="rowClick"
                    style="width: 100%">
                <el-table-column
                        type="index"
                        >
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="类型"
                        >
                </el-table-column>
                <el-table-column
                        prop="description"
                        label="备注">
                </el-table-column>
            </el-table>
<!--            <div class="item">-->
<!--                <p>船舶种类</p>-->
<!--                <a href="javascript:void(0)" v-for="i in item2" :class="[i.check?'':'choose']" @click="clickShip(i)">{{i.name}}</a>-->
<!--            </div>-->
<!--            <div class="item">-->
<!--                <p>AIS更新时间</p>-->
<!--                <a href="javascript:void(0)" v-for="i in item3" :class="[i.check?'':'choose']" @click="clickShip(i)">{{i.name}}</a>-->
<!--            </div>-->
        </div>
    </div>
</template>

<script>
  export default {
    name: 'SelectMarker',
    // props:
    model:{
      prop:'tableData',
      event:'change',
    },
    props:{
      tableData:{
        type:Array,
        default:()=>[]
      },
    },
    watch:{
      tableData(val){
        this.tableData=val
        // console.log('val',val)
      }
    },
    data(){
      return{
        checked1:true,
        base:[
          {
            title:'船舶目标',
            children:[{name:'正常船只',is:true},{name:'异常船只',is:true},{name:'雷达目标',is:true},{name:'AIS 目标',is:true},{name:'融合目标',is:true},{name:'5min以内',is:true},{name:'5-30 min',is:true},{name:'30min以上',is:true}]
          },
          {
            title:'主动探测类基础设施',
            children:[{name:'综合观测站',is:true},{name:'雷达',is:true,prop:'radar'},{name:'AIS基站',is:false,prop:'ais' },{name:'视频监控站',is:false,prop:'camera'},{name:'港区',is:true},{name:'码头',is:true},{name:'泊位',is:true},{name:'锚地',is:true},]
          },
          {
            title:'被动保障类基础设施',
            children:[{name:'停机坪',is:true},{name:'执勤道路',is:true},{name:'执勤码头',is:true},{name:'通信铁塔',is:true},{name:'海底光缆',is:true},{name:'港区',is:true},{name:'码头泊位',is:true},{name:'锚地',is:true},]
          },
          {
            title:'海防单位',
            children:[{name:'海军',is:true},{name:'陆军海防部队',is:true},{name:'军分区',is:true},{name:'海警局',is:true},{name:'公安局',is:true},{name:'海事局',is:true},{name:'海洋与渔业局',is:true},{name:'军民融合办',is:true},{name:'海关',is:true},{name:'边检',is:true},]
          },
        ],
      }
    },
    methods:{
      clickShip(i){
        i.is=!i.is
        // console.log(i)
        this.$emit('selectMarker',i)
      },
      rowClick(row, column, event) {
        // console.log(row)
        this.$emit('rowClick',row)
      }
    }
  }
</script>

<style scoped lang="less">
    *{
        margin: 0;
        padding: 0;
    }
#focus{
    width: 350px;
    height: 600px;
    background: white;
    .title{
        width: 100%;
        height: 46px;
        background: #2770D4;
        display: grid;
        grid-template-columns: 90% 10%;
        h4{
            color: white;
            font-weight: normal;
            height: 40px;
            font-size: 14px;
            line-height: 46px;
            padding-left: 10px;
            display: inline;
        }
        i{
            color: white;
            cursor: pointer;
            font-size: 20px;
            line-height: 46px;
        }
    }
    .item{
        margin: 8px 15px 8px 15px ;
        p{
            font-size: 14px;
            font-weight: 400;
            color: #666;
            margin-bottom: 10px;
        }
       .btn{
           display: grid;
           grid-template-columns: repeat(3,1fr);
           grid-template-rows: 30px;
           grid-row-gap: 5px;
           .choose{
               background: #ddd;
               color: #999;
           }
           a{
               border-radius: 2px;
               background: #2770D4;
               text-align: center;
               /*height: 30px;*/
               font-size: 12px;
               text-decoration: none;
               color: white;
               padding: 5px 10px;
               margin-left: 10px;
           }
       }

    }
}
</style>
