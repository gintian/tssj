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
                        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;margin-left: 48px;">
                              <el-radio-button :label="true"  v-if="ship_showed">船舶</el-radio-button>
                              <el-radio-button :label="false" v-if="Basic_settings">基础设施</el-radio-button>
                        </el-radio-group> -->
                         <div class="btn_switch">
                              <button class="btn_anniu" @click="change(0)" :class="{ newStyle:0===number}">船舶</button>
                              <button class="btn_anniu" @click="change(1)" :class="{ newStyle:1===number}">基础设施</button>
                        </div>
                        <!-- :collapse="isCollapse" -->
                        <!-- <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"   v-if="ship_showed"> -->
                      <div  v-show="0===number">
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
                      </div>
                       <div  v-show="1===number">
                        <el-menu   v-if="Basic_settings">
                          暂无数据
                         </el-menu>
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
        props: {
          label: 'name',
          children: 'zones',
          isLeaf: 'leaf'
        },
        count: 1,
        flag:'未知' , //国家名称
        shipType:'其他',  //船舶类型
        firstMenu:[],
        number:0,
        isCollapse: true,
        ship_showed:true,
        Basic_settings:true
      };
    },
    mounted(){
      this.loadData()
    },
    methods: {
     change(index) {
         this.number = index; 
     },
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
            console.log('shipname',shipname)
            for(var i in shipname){
              var mmsi=shipname[i]
              console.log('shipname.mmsi',mmsi)
              //  this.$emit('ship_detail',mmsi);
            }
              // ship_detail(shipname)
              
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

<style scoped lang="less">
.btn_anniu{
    width: 50%;
    padding: 5px 0;
    font-size: 16px;
    font-weight: bold;
    color: #000;
    outline: none;
  }
  .newStyle{
    border: 2px solid rgb(39, 112, 212);
      background:  #0f5ecc;
    color: white;
    font-size: 16px;
  }

#countrySigns{
  .signTitle img{
    position: absolute;
    top: 20%; 
    left: 30%;
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
