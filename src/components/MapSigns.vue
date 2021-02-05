<template>
    <div id="mapSigns" >
        <div class="left">
            <div class="signParent" v-for="(item,index) in mapSigns" v-if="index<3">
                <button  class="signTitle" @click="dialogVisible = true">   
                      <img :src="item.img" alt="" @click="showChild(item.id)">
                </button>
                 <el-dialog
                        title="图例信息"
                        :visible.sync="dialogVisible"
                        width="23%"
                        :append-to-body="true">
                          <!-- <p>{{item.label}}</p> -->
                         <div class="signChild" v-if="item.showChild" >
                              <div class="signChildContent" v-for="(child,index) in item.children">
                                  <img :src='child.img' alt="">
                                  <p >{{child.label}}</p>
                              </div>
                          </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'MapSigns',
    data() {
      return {
        dialogVisible:false,
        mapSigns: [
        //   {
        //   label: '统计', 
        //   img:require('../assets/Statistics.png'), 
        //   icon: 'caret-up', showChild: false, id: 1,
        //   children: [{ img: require('../assets/mapSigns/base1.png'), label: '海防直升机停机坪' },
        //     { img: require('../assets/mapSigns/base2.png'), label: '海防执勤码头' },
        //     { img: require('../assets/mapSigns/base3.png'), label: '海防执勤道路' },
        //     { img: require('../assets/mapSigns/base4.png'), label: '铁塔' },
        //     { img: require('../assets/mapSigns/base5.png'), label: '海底光缆' },
        //     { img: require('../assets/mapSigns/base6.png'), label: '港区' },
        //     { img: require('../assets/mapSigns/base7.png'), label: '码头泊位' },
        //     { img: require('../assets/mapSigns/base8.png'), label: '锚地' }]
        // },
          
        //   {
        //     label: '计算', 
        //     img:require('../assets/calculation.png'), 
        //     icon: 'caret-up', showChild: false, id: 3,
        //     children: [{ img: require('../assets/mapSigns/organization1.png'), label: '海军' },
        //       { img: require('../assets/mapSigns/organization2.png'), label: '陆军海防部队' },
        //       { img: require('../assets/mapSigns/organization3.png'), label: '军分区' },
        //       { img: require('../assets/mapSigns/organization4.png'), label: '海警局' },
        //       { img: require('../assets/mapSigns/organization5.png'), label: '公安局' },
        //       { img: require('../assets/mapSigns/organization6.png'), label: '海事局' },
        //       { img: require('../assets/mapSigns/organization7.png'), label: '海洋与渔业局' },
        //       { img: require('../assets/mapSigns/organization8.png'), label: '军民融合办' },
        //       { img: require('../assets/mapSigns/organization9.png'), label: '海关' },
        //       { img: require('../assets/mapSigns/organization10.png'), label: '边检' },
        //       ]
        //   },
         {
             label: '图例', 
             img:require('../assets/example.png'), 
             icon: 'caret-up', showChild: false, id:2,
            children: [{ img: require('../assets/mapSigns/1.png'), label: '延迟≤5分钟' },
              { img: require('../assets/mapSigns/2.png'), label: '5分钟≤延迟≤30分钟' },
              { img: require('../assets/mapSigns/3.png'), label: '30分钟≤延迟≤2小时' },
              { img: require('../assets/mapSigns/aim01.png'), label: '雷达目标' },
              { img: require('../assets/mapSigns/aim02.png'), label: '融合目标' },
              { img: require('../assets/mapSigns/aim03.png'), label: '异常目标' },
              { img: require('../assets/mapSigns/02.png'), label: '码头' },
              { img: require('../assets/mapSigns/03.png'), label: '锚地' },
              { img: require('../assets/mapSigns/ais.png'), label: 'AIS' },
              { img: require('../assets/mapSigns/01.png'), label: '雷达' }
            ]
          }]
      }
    },
    methods: {
      showChild(id) {
        
        for (let i of this.mapSigns) {
          if (i.id === id) {
            if (i.showChild) {
              i.showChild = false
              // i.icon = 'caret-up'
            } else {
              i.showChild = true
              // i.icon = 'sort-down'
            }
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">//图例样式
     // 弹出框
        /deep/.el-dialog{
          .el-dialog__header{   
            background: rgb(39, 112, 212);
            .el-dialog__title{
                color: white;
            }
          }
          .el-dialog__body{
            height: 200px;
            color: black;
            .signChild {
                display: grid;
                grid-template-columns: 1fr 1fr;
                    .signChildContent {
                    position:relative;
                    margin-bottom:10px;
                        height: 26px;
                        p {
                          position: absolute; 
                          top: 1%;
                          left: 20%;
                        }
                    }
                } 
            }
        }  
</style>
