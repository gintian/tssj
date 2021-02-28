<template>
    <div id="countrySigns" >
        <div class="left">
            <div class="signParent" >
                <button  class="signTitle" @click="dialogVisible = true">   
                      <img src="../assets/images/country.png" alt="" @click="showChild(item)">
                </button>
                 <el-dialog
                        :visible.sync="dialogVisible"
                        width="23%"
                        :append-to-body="true">
                        <el-tree
                          :props="props"
                          :load="loadNode"
                          highlight-current
                          lazy
                          show-checkbox
                          @check-change="handleCheckChange">
                        </el-tree>
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
        //  labelCheckedList:[], //接收被勾选的
        props: {
          label: 'name',
          children: 'zones'
        },
        count: 1,
        flag:'日本' , //国家名称
        shipType:'其他'  //船舶类型
      };
    },
    methods: {
       showChild(item) {
         dialogVisible=true
       
      },
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      handleNodeClick(data) {
        console.log(data);
      },
      loadNode(node, resolve) {
        // 传入查询到的国家
        if (node.level === 0) {
          return resolve([{ name: 'region1' }, { name: 'region2' }]);
        }
        if (node.level > 3) return resolve([]);
        // 查询到的国家中是否存在船只类型
        
        //  this.service.get('/ship/shipType',{
        //       params:{
        //         flag:this.flag
        //       }
        //   }).then(res=>{
        //     console.log('国家中的船舶类型',res)
        //     // resolve(res.flag.shipType)
        //   })
        // 船只类型中的船只信息
          var hasChild;
        if (node.data.name === 'region1') {
          hasChild = true;
        } else if (node.data.name === 'region2') {
          hasChild = false;
        } else {
          hasChild = Math.random() > 0.5;
        }
        setTimeout(() => {
          // this.service.get('/ship/shipList',{
          //     params:{
          //       flag:this.flag,
          //       shipType:this.shipType
          //     }
          // }).then(res=>{
          //   console.log('国家中船舶类型中的船只信息',res)
          // })

          var data;
          if (hasChild) {
            data = [{
              name: '类型：' + this.count++
            }, {
              name: '类型：' + this.count++
            }];
          } else {
            data = [];
          }

          resolve(data);

          
        }, 500);



      }
    
    }
  }
</script>

<style scoped lang="less">//图例样式
#countrySigns{

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
            // height: 180px;
            height: 100%;
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
