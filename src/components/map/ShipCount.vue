<template>

    <div id="shipCount" @click="$emit('hide')">

        <div class="item" v-for="i in ship">

            <p>区域总数：{{i.columns.total}}</p>
            <div class="content">
                    <p>正常船只:</p><el-progress :text-inside="true" :stroke-width="26" :percentage="i.columns.nm" status="success"></el-progress><p>{{i.columns.normal}}</p>
                    <p>异常船只:</p><el-progress :text-inside="true" :stroke-width="26" :percentage="i.columns.anm" status="exception"></el-progress><p>{{i.columns.abnormal}}</p>
                    <p>AIS目标:</p><el-progress :text-inside="true" :stroke-width="26" :percentage="i.columns.ais"></el-progress><p>{{i.columns.AisShip}}</p>
                    <p>雷达目标:</p><el-progress :text-inside="true" :stroke-width="26" :percentage="i.columns.radar" status="warning"></el-progress><p>{{i.columns.radarShip}}</p>
                    <p>融合目标:</p><el-progress :text-inside="true" :stroke-width="26" :percentage="i.columns.fusion" color="#8446EA"></el-progress><p>{{i.columns.fusionShip}}</p>

            </div>

        </div>
<!--        <div class="item item2"></div>-->
<!--        <div class="item item3"></div>-->
<!--        <div class="item item4"></div>-->
<!--        <div class="item item5"></div>-->
<!--        <div class="item item6"></div>-->
<!--        <div class="item item7"></div>-->
<!--        <div class="item item8"></div>-->
<!--        <div class="item item9"></div>-->
    </div>
</template>

<script>
  export default {
    name: 'ShipCount',
    model: {
      prop: 'ship',
      event: 'change'
    },
    props: {
      zoom: {
        type: Number,
        default: 10
      },
      ship: {
        type: Array,
        default: ()=>[]
      }
    },
    watch: {
      ship(val) {
        console.log(val)
      }
    },
    // mounted() {
    // },
    // updated() {
    //   if(this.zoom<11){
    //     this.$emit('hide')
    //     this.$message.error('地图等级必须大于10级！');
    //   }
    // },
    methods: {}
  }
</script>

<style scoped lang="less">
    * {
        margin: 0;
        padding: 0;
    }

    #shipCount {
        background: rgba(88, 88, 88, 0);
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        grid-gap: 5px;

        .item {
            color: white;
            background: rgba(58, 58, 60, 0.66);
            display: grid;
            place-items: center;

            .content {
                width: 80%;
                height: 80%;
                display: grid;
                grid-template-columns: 18% 1fr 15%;
                    grid-template-rows: repeat(5,1fr);
                    p{
                            text-align: center;
                    }
                /deep/.el-progress-bar__outer{
                    background: rgba(255, 255, 255, 0.14);
                }
            }
        }

    }
</style>
