<template>
    <div id="mapSigns" >
        <div class="left">
            <div class="signParent" v-for="(item,index) in mapSigns"  :key="index">
                <button  class="signTitle" @click="dialogVisible = true">   
                      <img :src="item.img" alt="" @click="showChild(item.id)">
                </button>
                 <el-dialog
                        title="图例"
                        :visible.sync="dialogVisible"
                        width="23%"
                        top="0vh"
                        :append-to-body="true">
                          <h4>基础设施</h4>
                         <div class="signChild" >
                              <div class="signChildContent" v-for="(child,index) in item.children1" :key="index+'1'">
                                  <img :src='child.img' alt="">
                                  <p >{{child.label}}</p>
                              </div>
                           </div>
                              <h4>船舶目标</h4>
                               <div class="signChild" >
                                  <div class="signChildContent" v-for="(child,index) in item.children2" :key="index+'2'">
                                      <img :src='child.img' alt="">
                                      <p >{{child.label}}</p>
                                  </div>
                              </div>
                              <h4>重点目标</h4>
                               <div class="signChild" >
                                  <div class="signChildContent" v-for="(child,index) in item.children3" :key="index+'3'">
                                      <img :src='child.img' alt=""  style="width: 20px; height: 20px;">
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
        item:'',
        mapSigns: [
         {
             img:require('../assets/example.png'), 
            children1: [
              { img: require('../assets/mapSigns/02.png'), label: '码头' },
              { img: require('../assets/mapSigns/03.png'), label: '锚地' },
              { img: require('../assets/mapSigns/ais.png'), label: 'AIS' },
              { img: require('../assets/mapSigns/01.png'), label: '雷达' }, 
            ],
             children2: [
              { img: require('../assets/mapSigns/aim01.png'), label: '雷达目标' },
              { img: require('../assets/mapSigns/aim02.png'), label: '融合目标' },
              // { img: require('../assets/mapSigns/kc.png'), label: '客船' },
              // { img: require('../assets/mapSigns/hc.png'), label: '货船' },
              // { img: require('../assets/mapSigns/yl.png'), label: '油轮' },
              // { img: require('../assets/mapSigns/dangerbuk.png'), label: '危险货物' },
               { img: require('../assets/mapSigns/kc.png'), label: '娱乐船' },
              { img: require('../assets/mapSigns/hc.png'), label: '引航船' },
              { img: require('../assets/mapSigns/yl.png'), label: '拖轮船' },
              { img: require('../assets/mapSigns/dangerbuk.png'), label: '水下作业' },

              { img: require('../assets/mapSigns/another.png'), label: '其他' },  
              { img: require('../assets/mapSigns/aim03.png'), label: '异常目标' }
              // { img: require('../assets/mapSigns/zf.png'), label: '执法船' }  
            ],
            children3: [
              { img: require('../assets/mapSigns/11.png'), label: '陆军海防部队' },
              { img: require('../assets/mapSigns/12.png'), label: '海军' },
              { img: require('../assets/mapSigns/13.png'), label: '海警局' },
              { img: require('../assets/mapSigns/14.png'), label: '军分区' },
              { img: require('../assets/mapSigns/15.png'), label: '海事局' },
              { img: require('../assets/mapSigns/16.png'), label: '公安局' },
              { img: require('../assets/mapSigns/17.png'), label: '军民融合办' },  
              { img: require('../assets/mapSigns/18.png'), label: '海洋与渔业局' },
              { img: require('../assets/mapSigns/19.png'), label: '边检' }  ,
              { img: require('../assets/mapSigns/10.png'), label: '海关' }  
            ],
          }
          ]
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
            position: absolute;
                right: 7%;
                top: 23%;
          .el-dialog__header{   
            background: rgb(39, 112, 212);
                padding: 8px 20px 10px;
            .el-dialog__title{
                color: white;
            }
            .el-dialog__headerbtn {
                position: absolute;
                top: 13px;
                right: 20px;
                padding: 0;
                background: 0 0;
                border: none;
                outline: 0;
                cursor: pointer;
                font-size: 16px;
            }
              .el-dialog__close{
                  color: white;
                }
          }
          .el-dialog__body{
            padding: 0;
            color: black;
            h4{
                margin-bottom: 10px;
                background: #E3EFFB;
                    padding: 14px;
            }
            .signChild {
                  padding: 6px 21px;
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
