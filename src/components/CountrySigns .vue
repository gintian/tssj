<template>
    <div id="countrySigns" >
        <div class="left">
            <div class="signParent" v-for="(item,index) in mapSigns" v-if="index<3">
                <button  class="signTitle" @click="dialogVisible = true">   
                      <img :src="item.img" alt="" @click="showChild(item.id)">
                </button>
                 <el-dialog
                        :visible.sync="dialogVisible"
                        width="23%"
                        :append-to-body="true">
                         <ul class="signChild" v-if="item.showChild" >
                              <li class="signChildContent" v-for="(child,index) in item.children">
                                  <!-- <img :src='child.img' alt=""> -->
                                  <p >{{child.label}}</p>
                              </li>
                          </ul>
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
         {
             label: '', 
             img:require('../assets/bu1.png'), 
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
        
          // this.service.get('/ship/flag').then(res=>{
          //   console.log(res.data)
          // })


      }
    }
  }
</script>

<style scoped lang="less">//图例样式
#countrySigns{
  .signParent{

  }
  .signTitle{

  }
  .signTitle img{
    position: absolute;
    top: 20%; 
    left: 20%;
  }
}

     // 弹出框
        /deep/.el-dialog{
               margin-top: 16vh;
                  width: 23%;
                  position: absolute;
                  left: 38px;
          .el-dialog__header{   
            background: rgb(39, 112, 212);
            .el-dialog__title{
                // color: white;
            }
          }
          .el-dialog__body{
            height: 180px;
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
                          top: -59%;
                          left: 20%;
                        }
                    }
                } 
            }
        }  
</style>
