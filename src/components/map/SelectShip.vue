<template>

    <div id="selectShipDom">

        <div class="title">

            <h4>船舶筛选</h4>
            <i class="el-icon-close" @click="$emit('hide')"></i>
        </div>
        <div class="content">
            <div class="item">
                <p>船舶类型</p>
<!--                <el-checkbox v-model="checked1" label="备选项1" border size="mini"></el-checkbox>-->
                <a href="javascript:void(0)" v-for="i in item1" :class="[i.check?'':'choose']" @click="clickShip(i)">{{i.name}}</a>
            </div>
            <div class="item">
                <p>船舶种类</p>
                <a href="javascript:void(0)" v-for="i in item2" :class="[i.check?'':'choose']" @click="clickShip(i)">{{i.name}}</a>
            </div>
            <div class="item">
                <p>AIS更新时间</p>
                <a href="javascript:void(0)" v-for="i in item3" :class="[i.check?'':'choose']" @click="clickShip(i)">{{i.name}}</a>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'SelectShip',
    // props:
    model:{
      prop:'zoom',
      event:'change',
    },
    props:{
      zoom:{
        type:Number,
        default:10
      },
      ship:{
        type:Number,
        default:0
      },
    },
    watch:{
      ship(val){
        this.ship=val
      }
    },
    data(){
      return{
        checked1:true,
        item1:[{name:'正常船只',check:true},{name:'异常船只',check:true}],
        item2:[{name:'雷达目标',check:true},{name:'AIS 目标',check:true},{name:'融合目标',check:true}],
        item3:[{name:'5min以内',check:true},{name:'5-30 min',check:true},{name:'30min以上',check:true}],
      }
    },
    methods:{
      clickShip(i){
        i.check=!i.check
        // console.log(i)
        this.$emit('selectShip',i)
      }
    }
  }
</script>

<style scoped lang="less">
    *{
        margin: 0;
        padding: 0;
    }
#selectShipDom{
    width: 320px;
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
            height: 46px;
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
        margin: 20px;
        p{
            font-size: 14px;
            font-weight: 400;
            color: #666;
            margin-bottom: 10px;
        }
        a{
            background: #2770D4;
            width: 30px;
            height: 30px;
            font-size: 12px;
            text-decoration: none;
            color: white;
            padding: 5px 10px;
            margin-left: 10px;
        }
        .choose{
            background: #ddd;
            color: #999;
        }
    }
}
</style>
