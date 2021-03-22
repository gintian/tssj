<template>
    <div id="countrySigns" >
        <div class="left">
            <div class="signParent" >
                <button  class="signTitle" @click="dialogVisible = true">   
                      <img src="../assets/images/country.png" alt="" @click="showChild(item)">
                </button>
                 <el-dialog
                        :visible.sync="dialogVisible"
                        width="16%"
                        top="11vh"
                        custom-class="countrydialog"
                        :append-to-body="true">
                        <el-tree
                          :props="props"
                          :load="loadNode"
                          highlight-current
                          lazy
                          show-checkbox
                          @check-change="handleCheckChange"
                           @node-click="handleTreeNodeClick"
                          >
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
        item:'',
        props: {
          label: 'name',
          children: 'zones',
          isLeaf: 'leaf'
        },
        count: 1,
        flag:'未知' , //国家名称
        shipType:'其他',  //船舶类型
        firstMenu:[],
      };
    },
    mounted(){
      this.loadData()
    },
    methods: {
       // 点击树节点事件处理
      handleTreeNodeClick(data, node, elem){
                // data.id即为科室id，根据这个科室id触发医生表格数据的查询...
     },
      // 加载一级菜单数据
      loadData(){
            this.service.get('/ship/flag').then(res=>{
            // console.log("查询到的国家列表",res)
            //  console.log('node',res.flags)
             if(res.error===0){      
                res.flags.forEach( (item, index)=> {
                this.firstMenu.push({ name: item.flag})
                })
             }else{
                this.firstMenu.push( { name: '无' })           
             }
          })     
      },
       showChild(item) {
         this.dialogVisible=true
       
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
         return resolve(this.firstMenu);
        }
        if(node.level === 1) {
           // 查询到的国家中是否存在船只类型   
         this.service.get('/ship/shipType',{
              params:{
                flag:this.flag
              }
          }).then(res=>{
            let shipType=[]
             res.flags.map(f => {
               shipType.push({name:f.shipType})
            })
              resolve(shipType)
            // console.log('国家中的船舶类型',res)
          })
        }
        else if (node.level ===2) {
           this.service.get('/ship/shipList',{
              params:{
                flag:this.flag,
                shipType:this.shipType
              }
          }).then(res=>{
             let shipList=[]  
             res.shipList.map(f => {
               shipList.push({name:f.mmsi, leaf: true})
            })
            //  console.log('shipList',shipList)
            var shipname=[]
             res.shipList.map(f=>{
              shipname.push({mmsi:f.mmsi})
            })

            // console.log('shipname',shipname)
              // ship_detail(shipList)
              //  this.$emit('ship_detail',shipname);
              resolve(shipList)
            // console.log('船舶类型中的船舶信息',res)  
          })
          
        }else{
          return resolve([]);
        }
     
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
/deep/.el-tree-node__content:hover {
    background-color: #E3EFFB;
}
// 树形内容滚动条
/deep/.el-tree-node>.el-tree-node__children {
        /* overflow: hidden; */
        background-color: transparent;
        overflow: auto;
        height: 600px;
    }
     // 弹出框
        /deep/.countrydialog{
               margin-top: 8vh;
                  width: 20%;
                  position: absolute;
                  left: 38px;
          .el-dialog__header{   
            background: rgb(39, 112, 212);
            padding: 24px 20px 10px;
            .el-dialog__title{
                // color: white;
            }
            // 关闭的图标
            .el-dialog__headerbtn {
              position: absolute;
              top: 10px;
              right: 20px;
              padding: 0;
              background: 0 0;
              border: none;
              outline: 0;
              cursor: pointer;
              font-size: 16px;
          }
          .el-dialog__headerbtn .el-dialog__close {
                 color: #ffffff;
            }
          }
          .el-dialog__body{
            height: 755px;
            overflow: auto;
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
