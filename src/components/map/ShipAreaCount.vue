<template>

    <div id="shipCount" >

        <div class="item" >
            <div class="title"> <p>区域总数：{{ship.total}}</p> <i class="el-icon-circle-close" @click="$emit('hide')"></i></div>
            <div class="content">
                    <p>正常船只:</p><el-progress :text-inside="true" :stroke-width="26" :percentage="ship.nm" status="success"></el-progress><p>{{ship.normal}}</p>
                    <p>异常船只:</p><el-progress :text-inside="true" :stroke-width="26" :percentage="ship.anm" status="exception"></el-progress><p>{{ship.abnormal}}</p>
                    <p>AIS目标:</p><el-progress :text-inside="true" :stroke-width="26" :percentage="ship.ais"></el-progress><p>{{ship.AisShip}}</p>
                    <p>雷达目标:</p><el-progress :text-inside="true" :stroke-width="26" :percentage="ship.radar" status="warning"></el-progress><p>{{ship.radarShip}}</p>
                    <p>融合目标:</p><el-progress :text-inside="true" :stroke-width="26" :percentage="ship.fusion" color="#8446EA"></el-progress><p>{{ship.fusionShip}}</p>

            </div>
<!--           <div class="title"> <p>区域总数：300</p> <i class="el-icon-circle-close" @click="$emit('hide')"></i></div>-->
<!--            <div class="content">-->
<!--                <p>正常船只:</p><el-progress :text-inside="true" :stroke-width="26" :percentage="10" status="success"></el-progress><p>1</p>-->
<!--                <p>异常船只:</p><el-progress :text-inside="true" :stroke-width="26" :percentage="10" status="exception"></el-progress><p>1</p>-->
<!--                <p>AIS目标:</p><el-progress :text-inside="true" :stroke-width="26" :percentage="10"></el-progress><p>1</p>-->
<!--                <p>雷达目标:</p><el-progress :text-inside="true" :stroke-width="26" :percentage="10" status="warning"></el-progress><p>1</p>-->
<!--                <p>融合目标:</p><el-progress :text-inside="true" :stroke-width="26" :percentage="10" color="#8446EA"></el-progress><p>1</p>-->

<!--            </div>-->

        </div>
    </div>
</template>

<script>
  export default {
    name: 'ShipAreaCount',
    model: {
      prop: 'ship',
      event: 'change'
    },
    props: {
      ship: {
        type: Object,
        default: ()=>{}
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
        /*grid-template-columns: 1fr 1fr 1fr;*/
        /*grid-template-rows: 1fr 1fr 1fr;*/
        /*grid-gap: 5px;*/

        .item {
            color: white;
            background: rgba(58, 58, 60, 0.66);
            display: grid;
            place-items: center;

            .title{
                width: 100%;
                display: grid;
                grid-template-columns: 90% 10%;
                p{
                    text-align: center;
                }
                i{
                    font-size: 22px;
                    cursor: pointer;
                }
            }
            .content {
                width: 80%;
                height: 90%;
                display: grid;
                grid-template-columns: 18% 1fr 15%;
                grid-gap: 10px 0;
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
