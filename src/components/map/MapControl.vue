<template>

    <div>
        <!-- <p style="color: black" v-show="zoom>=11">当前区域船只：{{ship}}艘</p> -->
        <div id="btn">
          <div>
            <button  @click="add" ><i class="el-icon-plus" style="width: 20px;padding: 5px"></i></button>
            <!-- <span style="color: black;margin: 0 7px">{{zoom}}</span> -->
         </div>
            
            <div>
            <button  @click="minus" ><i class="el-icon-minus" style="width: 20px;padding: 5px"></i></button>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'MapControl',
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
    methods:{

      add(){

        this.$emit('add')
      },
      minus(){
        this.$emit('minus')
      }
    }
  }
</script>

<style scoped>
/* #btn{
    float: right;
} */
</style>
