<template>
    <div id="selectShipDom">
        <div class="title">
            <i class="el-icon-close" @click="$emit('hide')"></i>
        </div>
        <div class="content" style="overflow: auto;height: calc(100% - 40px)">
           
                    <div class="signChildContent" v-for="(child,index) in  mapSigns" :key="index" @click="selectAll(child)">
                        <input  type="checkbox" checked>
                         <img :src='child.img' alt="">
                         <p >{{child.name}}</p>
                    </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'ObjectSelect',
    model:{
      prop:'zoom',
      event:'change',
    },
    props:{
      zoom:{
        type:Number,
        default:10
      },
      ship:{
        type:Number,
        default:0
      },
    },
    watch:{
      ship(val){
        this.ship=val
      }
    },

    data(){
      return{
        mapSigns: [ 
              { img: require('../../assets/mapicon/ship2.png'), is:true, name: 'AIS目标' },    
              { img: require('../../assets/mapSigns/aim01.png'),  is:true,name: '雷达目标' },
              { img: require('../../assets/mapicon/ship2rong.png'), is:true, name: '融合目标' },
              { img: require('../../assets/mapSigns/shiphong.png'),  is:true,name: '异常目标' },   
          ],
      }
    },
    methods:{
      
      selectAll(v){
        v.is=!v.is
        console.log(v)
        // for(let i of v.children){
        //   // console.log(i)
        //   i.is=v.is
        //   // this.$emit('ObjectSelect',i)
        // }
        this.$emit('ObjectSelect',v)
      }
    }
  }
</script>

<style scoped lang="less">
    *{
        margin: 0;
        padding: 0;
    }
#selectShipDom{
    width: 150px;
    height: 220px;
    background: white;
    .title{
        width: 100%;
        height: 46px;
        background: #2770D4;
        i{
            color: white;
            cursor: pointer;
            font-size: 20px;
            line-height: 46px;
            float: right;
            margin-right: 10px;
        }
    }
   .signChildContent {
    display: grid;
    grid-template-columns: 20% 20% 60%;
    margin: 17px 16px;
    align-items: center;
    }
}
</style>
