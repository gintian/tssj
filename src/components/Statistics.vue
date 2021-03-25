<template>
<div>
    <div id="Statistics" >     
        <div  class="signChildContent" v-for="(item,index) in shipList" :key="index">
            <h3>{{Object.keys(item)[0]}}</h3>: <span>{{Object.values(item)[0]}}</span>
        </div>
    </div>
</div>
    
</template>

<script>
//  import mapUtils from '../utils/mapUtils';
  export default {
    name: 'shipStatistics',
    data() {
      return {
        shipStatistics:'',  
      }  
    },
    props:{
      shipList:{
        type: Array,
        default: function () {
          return []
          }
      }
    },
    watch:{
      shipList(val){
        console.log('监听到的统计数据',val)
        this.shipList=val
      }
    },
    mounted(){
       console.log('mounted shipList=====' + this.shipList)
    },
    methods: {}
  }
</script>

<style scoped lang="less">
     #Statistics{
       width: 512px;
        height: 271px;
       background: white;
       padding: 20px 15px 0 15px;
        display: grid;
        grid-template-columns: repeat(3,1fr);
     }
    .signChildContent{
          display: flex;
          // justify-content: space-evenly;
    }
    .signChildContent span{
      color:#0075EE;
      font-size: 18px;
      font-weight: 900;
      margin-left: 12px;
    }
</style>
