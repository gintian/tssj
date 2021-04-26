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
                         <div class="btn_switch">
                              <button class="btn_anniu" @click="change(0)" :class="{ newStyle:0===number}">船舶</button>
                              <button class="btn_anniu" @click="change(1)" :class="{ newStyle:1===number}">基础设施</button>
                        </div>
               
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
                          <!-- accordion  :data="data"-->
                          <el-tree
                              :load="loadSettingNode"
                              :props="defaultProps"
                              highlight-current
                              lazy
                              @check-change="handleNodeCheckChange"
                              @node-click="handleNodeClick">
                          </el-tree>
                      </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
// import homeMethods from "../views/home/methods";
  export default {
    name: 'CountrySigns',
    data() {
      return {
        dialogVisible:false,
        item:'',
        props: {
          label: 'name',
          children: 'zones',
          isLeaf: 'leaf'
        },
         data: [{
          label: '雷达',
          children: [{
            // label: '二级 1-1'
          }]
        }, {
          label: 'AIS',
          children: [{
            // label: '二级 2-1'
          }]
        }, {
          label: '锚地',
          children: [{
            // label: '二级 3-1'
          }]
        },{
          label: '码头',
          children: [{
            // label: '二级 3-1'
          }]
        },{
          label: '摄像头',
          children: [{
            // label: '二级 3-1'
          }]
        },{
          label: '铁塔',
          children: [{
            // label: '二级 3-1'
          }]
        },{
          label: '泊位',
          children: [{
            // label: '二级 3-1'
          }]
        },{
          label: '海底光缆',
          children: [{
            // label: '二级 3-1'
          }]
        }
        ],
        defaultProps: {
          // children: 'children',
          // label: 'label'
           label: 'name',
          children: 'zones',
          isLeaf: 'leaf'
        },
        flag:'未知' , //国家名称
        shipType:'其他',  //船舶类型
        group:'东极',
        firstMenu:[],
        number:0,
      };
    },
    mounted(){
      this.loadData()
    },
    methods: {
       handleNodeClick(data, node, elem) {
        // console.log(node) 
       },
     change(index) {
         this.number = index; 
     },
       // 点击树节点事件处理
      handleTreeNodeClick(data, node, elem){
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
        // console.log(data, checked, indeterminate);
      },
      handleNodeCheckChange(data, checked, indeterminate) {
        // console.log(data, checked, indeterminate);
      },
      loadSettingNode(node,resolve){
        if (node.level === 0) {      
         return resolve([{ name: '雷达' },{ name: 'AIS' },{ name: '锚地' },{ name: '码头' },{ name: '摄像头' },
         { name: '铁塔' },{ name: '泊位' },{ name: '海底光缆' },{ name: '海防单位' }]);
        }
        if(node.data.name=='雷达'&& node.level === 1) {
          // console.log(node.level)  
         this.service.get('/radar/group',{  
          }).then(res=>{
            // console.log('雷达分组',res)
            let area=[]
             res.list.map(f => {
               area.push({name:f.area})
            })
            // console.log('area',area)
            for(var i in area){
             this.group= area[i].name
              // console.log('area[i]', i, area[i])
            }
              resolve(area)
          })
        }else  if(node.data.name=='AIS'&& node.level === 1) {
          console.log(node.level)  
         this.service.get('/ais/group',{  
          }).then(res=>{
            // console.log('AIS分组',res)
            let radarType=[]
             res.list.map(f => {
               radarType.push({name:f.area})
            })
              resolve(radarType)
          })
        }else  if(node.data.name=='锚地'&& node.level === 1) {
          console.log(node.level)  
         this.service.get('/anchorage/group',{  
          }).then(res=>{
            // console.log('锚地分组',res)
            let radarType=[]
             res.list.map(f => {
               radarType.push({name:f.area})
            })
              resolve(radarType)
          })
        } else  if(node.data.name=='码头'&& node.level === 1) {
          console.log(node.level)  
         this.service.get('/pier/group',{  
          }).then(res=>{
            // console.log('码头分组',res)
            let radarType=[]
             res.list.map(f => {
               radarType.push({name:f.area})
            })
              resolve(radarType)
          })
        } else  if(node.data.name=='摄像头'&& node.level === 1) {
          console.log(node.level)  
         this.service.get('/camera/group',{  
          }).then(res=>{
            // console.log('摄像头分组',res)
            let radarType=[]
             res.list.map(f => {
               radarType.push({name:f.area})
            })
              resolve(radarType)
          })
        } else  if(node.data.name=='铁塔'&& node.level === 1) {
          console.log(node.level)  
         this.service.get('/tower/group',{  
          }).then(res=>{
            // console.log('铁塔分组',res)
            let radarType=[]
             res.list.map(f => {
               radarType.push({name:f.area})
            })
              resolve(radarType)
          })
        } else  if(node.data.name=='泊位'&& node.level === 1) {
          console.log(node.level)  
         this.service.get('/berth/group',{  
          }).then(res=>{
            // console.log('泊位分组',res)
            let radarType=[]
             res.list.map(f => {
               radarType.push({name:f.uses})
            })
              resolve(radarType)
          })
        } else  if(node.data.name=='海底光缆'&& node.level === 1) {
          console.log(node.level)  
         this.service.get('/seaLine/group',{  
          }).then(res=>{
            // console.log('海底光缆分组',res)
            let radarType=[]
             res.list.map(f => {
               radarType.push({name:f.area})
            })
              resolve(radarType)
          })
        } else  if(node.data.name=='海防单位'&& node.level === 1) {
          console.log(node.level)  
         this.service.get('/org/group',{  
          }).then(res=>{
            // console.log('海防单位分组',res)
            let radarType=[]
             res.list.map(f => {
               radarType.push({name:f.group,label:f.type})
            })
              resolve(radarType)
          })
        }
         else if (node.level ===2) {
           // 先取当前节点的父节点
          //  console.log('node.data',node.data)
           let parentData = node.parent;
           var  coastData=node.data.label;
           var  nodeData=node.data.name;
           var  nodeBerthData=node.data.name;
          //  console.log('parentData',parentData)
            // console.log('parentData',node.data.name)
           if(node.parent.data.name=='雷达'){
                 this.service.get('/radar/groupList',{
                  params:{
                  group:nodeData,
                  }
              }).then(res=>{
                  // console.log('雷达区域分组',res)
                  // console.log('this.map',res.list)
                  let shipList=[]  
                  res.list.map(f => {
                    shipList.push({name:f.name, leaf: true})
                  })
                  //  console.log('雷达 asad',shipList)
                  // let  areaLangh=[]
                  //  res.list.map(f => {
                  //   areaLangh.push({lat:f.lat,lon:f.lon})
                  // })
                  var latitude,longitude
                  for(var i  in  res.list){
                     latitude=res.list[i].lat
                     longitude=res.list[i].lon
                      // console.log('雷达 asad',res.list[i].lat,res.list[i].lon)
                  }
                    resolve(shipList)
                   this.$emit('SettingNode',latitude,longitude);
              })
           }
           if(node.parent.data.name=='AIS'){
               this.service.get('/ais/groupList',{
                  params:{
                  group:nodeData,
                  }
              }).then(res=>{
                  console.log('AIS区域分组',res)
                  
                let shipList=[]  
                res.list.map(f => {
                  shipList.push({name:f.name, leaf: true})
                })
                // console.log('this.map',res.list)
                var latitude,longitude
                  for(var i  in  res.list){
                     latitude=res.list[i].lat
                     longitude=res.list[i].lon
                      // console.log('雷达 asad',res.list[i].lat,res.list[i].lon)
                  }
                    resolve(shipList)
                   this.$emit('SettingNode',latitude,longitude);
              }) 
           }
           if(node.parent.data.name=='锚地'){
              this.service.get('/anchorage/groupList',{
                  params:{
                  group:nodeData,
                  }
              }).then(res=>{
                  console.log('锚地区域分组',res)
                let shipList=[]  
                res.list.map(f => {
                  shipList.push({name:f.name, leaf: true})
                })
                   console.log('shipList',shipList)
                   for(var j in shipList){
                    //  console.log('锚地asad',shipList[j].name)
                     if(shipList[j].name==areaName){
                         this.$emit('SettingNode',latitude,longitude);
                     }
                   }
                  console.log('res.list',res.list)
                  var latitude,longitude,areaName
                  for(var i  in  res.list){
                    // console.log(res.list[i])
                     latitude=res.list[i].lat
                     longitude=res.list[i].lon
                     areaName=res.list[i].name
                      // console.log('锚地asad',res.list[i].lat,res.list[i].lon)
                       this.$emit('SettingNode',latitude,longitude);
                  }
                    resolve(shipList)
                    this.$emit('SettingNode',latitude,longitude);
              })
           }
          if(node.parent.data.name=='码头'){
              this.service.get('/pier/groupList',{
                  params:{
                  group:nodeData,
                  }
              }).then(res=>{
                  // console.log('码头区域分组',res)
                   
                let shipList=[]  
                res.list.map(f => {
                  shipList.push({name:f.name, leaf: true})
                })
                 
                var latitude,longitude
                  for(var i  in  res.list){
                     latitude=res.list[i].lat
                     longitude=res.list[i].lon
                      // console.log('雷达 asad',res.list[i].lat,res.list[i].lon)
                  }
                    resolve(shipList)
                   this.$emit('SettingNode',latitude,longitude);
              })
           }
          if(node.parent.data.name=='摄像头'){
              this.service.get('/camera/groupList',{
                  params:{
                  group:nodeData,
                  }
              }).then(res=>{
                  // console.log('摄像头区域分组',res)    
                let shipList=[]  
                res.list.map(f => {
                  shipList.push({name:f.name, leaf: true})
                })
                  var latitude,longitude
                  for(var i  in  res.list){
                     latitude=res.list[i].lat
                     longitude=res.list[i].lon
                      // console.log('雷达 asad',res.list[i].lat,res.list[i].lon)
                  }
                    resolve(shipList)
                   this.$emit('SettingNode',latitude,longitude);
              })
           }
          if(node.parent.data.name=='铁塔'){
              this.service.get('/tower/groupList',{
                  params:{
                  group:nodeData,
                  }
              }).then(res=>{
                  // console.log('铁塔区域分组',res)
                let shipList=[]  
                res.list.map(f => {
                  shipList.push({name:f.station_name, leaf: true})
                })
                  var latitude,longitude
                  for(var i  in  res.list){
                     latitude=res.list[i].lat
                     longitude=res.list[i].lon
                      // console.log('雷达 asad',res.list[i].lat,res.list[i].lon)
                  }
                    resolve(shipList)
                   this.$emit('SettingNode',latitude,longitude);
              })
           }
          if(node.parent.data.name=='泊位'){
              this.service.get('/berth/groupList',{
                  params:{
                  group:nodeBerthData,
                  }
              }).then(res=>{
                  // console.log('泊位区域分组',res)
                let shipList=[]  
                res.list.map(f => {
                  shipList.push({name:f.name, leaf: true})
                })
                  var latitude,longitude
                  for(var i  in  res.list){
                     latitude=res.list[i].lat
                     longitude=res.list[i].lon
                      // console.log('雷达 asad',res.list[i].lat,res.list[i].lon)
                  }
                    resolve(shipList)
                   this.$emit('SettingNode',latitude,longitude);
              })
           }
           if(node.parent.data.name=='海底光缆'){
              this.service.get('/seaLine/groupList',{
                  params:{
                  group:nodeData,
                  }
              }).then(res=>{
                  // console.log('海底光缆区域分组',res)
                  
                let shipList=[]  
                res.list.map(f => {
                  shipList.push({name:f.name, leaf: true})
                })
                  var latitude,longitude
                  for(var i  in  res.list){
                     latitude=res.list[i].lat
                     longitude=res.list[i].lon
                      // console.log('雷达 asad',res.list[i].lat,res.list[i].lon)
                  }
                    resolve(shipList)
                   this.$emit('SettingNode',latitude,longitude);
              })
           }
            if(node.parent.data.name=='海防单位'){
              this.service.get('/org/groupList',{
                  params:{
                  group:coastData,
                  }
              }).then(res=>{
                  // console.log('海防单位区域分组',res)
                   
                let shipList=[]  
                res.list.map(f => {
                  shipList.push({name:f.name, leaf: true})
                })
                   var latitude,longitude
                  for(var i  in  res.list){
                     latitude=res.list[i].latitude
                     longitude=res.list[i].longitude
                      // console.log('雷达 asad',res.list[i].lat,res.list[i].lon)
                  }
                    resolve(shipList)
                   this.$emit('SettingNode',latitude,longitude);
              })
           }
        }
        else{
          return resolve([]);
        }
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
/deep/.el-tree-node__label{
  font-size: 15px;
  font-weight: 900;
}
/deep/.el-tree-node__content {
    background: #f4edee;
    border-bottom: 1px solid #b9b0b0;
    margin: 10px 0;
    padding: 10px 0;
    line-height: 26px;
}
// 树形内容滚动条    
/deep/.el-tree-node>.el-tree-node__children {
        /* overflow: hidden; */
        background-color: transparent;
        overflow: auto;
        // height: 600px;
    }
    // 树形子节点选中
/deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
       background-color: #E3EFFB;
       color: rgb(0, 110, 255);
    }
    // 第二级节点内容
/deep/  .el-tree-node.is-expanded>.el-tree-node__children {
    background: #f4edee;
  }
  
/deep/ .el-tree-node__children{
     background-color: #E3EFFB;
}
// 图标
/deep/.el-tree-node__expand-icon {
    cursor: pointer;
    color: #67686b;
    font-size: 18px;
    transform: rotate(0);
    transition: transform .3s ease-in-out;
}
     // 弹出框
        /deep/.countrydialog{
               margin-top: 8vh;
                  width: 20%;
                  position: absolute;
                  left: 38px;
          .el-dialog__header{   
            background: rgb(39, 112, 212);
            // padding: 24px 20px 10px;
            // padding: 0;
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
