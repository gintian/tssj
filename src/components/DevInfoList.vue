<template>
  <div class="devDiv">
     <div class="item">
         <div  class="dot" ></div>
         {{title}}
     </div>
     <div style=" background-color: #eee"></div>
     <div class="item" style="    padding: 0px 0px 0px 5px;" >
         <div style="flex: 5;">
             <font-awesome-icon :icon="iconName" style="color:rgba(70,199,254,1);padding-right: 5px;"  />
              总量 
        </div>
         <div style="flex: 2;">
            <div class="colorBar"></div>
         </div> 
        
     </div>
     <div class="item">
        <div style="flex: 8;" class="numText">
            {{num}}
        </div> 
        <div style="flex: 1;" class="unitText">{{unit}}</div>
        <div style="flex: 1;" class="lossText">{{loss}}</div>
     </div>
  </div>
</template>

<script>
export default {
  name: 'DevInfoList',
  props: {
    msg: String ,
    title:{
        type: String,
        default:'标题' 
    },
    iconName:{
        type: String,
        default:'podcast' 
    },
    num:{
        type: Number,
        default: 0 
    },
    unit:{
        type: String,
        default:'个' 
    },
    loss:{
        type: String,
        default:'100%' 
    },
  }
}
</script>

<style scoped>
.devDiv {
    width: 200px;
    height: 100px;
    /*background-color: aquamarine;*/
    display: grid;
    grid-template-rows: 20% 2% 15% 58%;
    color: #eee;
    grid-row-gap: 5px;
}
.devDiv .item {
    display: flex;
    vertical-align: middle;
    font-size: 15px
}
.devDiv .item .dot{
    width:5px;margin: 7px;
    height:10px;
    background:rgba(70,199,254,1);
}
.colorBar{
    width:57px;
    height:100%;
    background:linear-gradient(90deg,rgba(125,118,250,1) 0%,rgba(82,158,249,1) 16%,rgba(110,224,246,1) 33%,rgba(133,216,78,1) 47%,rgba(231,219,84,1) 62%,rgba(234,155,73,1) 82%,rgba(224,55,55,1) 100%);
}
.devDiv .item .numText{
    padding-left: 7px;
    font-size: 36px;
    font-weight: 400;
    font-family: PingFangSC-Regular,PingFang SC;
    line-height: 50px;
}
.devDiv .item .unitText {
    font-size:12px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    line-height: 50px;
}
.devDiv .item .lossText{
    font-size:18px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    line-height: 50px;
}
</style>
