<template>  
        <div id="btn"  >
            <!-- <button  @click="add" ><i class="el-icon-plus" style="width: 20px;padding: 5px"></i></button> -->
            <!-- <span style="color: black;margin: 0 7px">{{zoom}}级</span>
            <span style="color: black;margin: 0 4px">-</span>
             <p style="color: black" v-show="zoom>=9">{{ship}}艘</p> -->
           <!-- 当前区域船只： -->
            <!-- <button  @click="minus" ><i class="el-icon-minus" style="width: 20px;padding: 5px"></i></button> -->
            
        </div>
</template>

<script>
  export default {
    name: 'MapLang',
    // props:
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
    created(){
        this.MapLang()
    },
    methods:{
        // MapLang(){
        //     this.map.on('mousemove', (e) => {
        //         console.log('监听mousemove',e)

        //     });
        // }
    }
  }
</script>

<style scoped>
 #btn{
    position: absolute;
    bottom: 68px;
    left: 10px;
    text-align: center;
    border-radius: 3px;
    padding: 1px 3px;
    font-size: 12px;
    background-color: rgba(255, 255, 255, 0.63);
    color: #333;
    box-shadow: 2px 2px 6px rgb(0 0 0 / 27%);
    width: 100px;
    height: 40px;
}

</style>
