<template>
    <div style="position: relative;">
          <img style="    position: absolute;
    bottom: 25px;" v-show="downClickIs" src="../../assets/tuli.png" alt="">
        <div class="down-click" @click="downClickIs = !downClickIs">{{downClickIs?'▲':'▼'}} <span style="    margin-left: 5px;">图例信息</span> </div>
      
    </div>
</template>
<script>
export default {
    data(){
        return{
            downClickIs:false
        }
    }
}
</script>
<style scoped>
.down-click{
    
    color: #eee;
    background: linear-gradient(rgb(103, 143, 232) 0%, rgb(63, 81, 181) 100%)/*#2d5877*/;
    cursor: pointer;
    user-select: none;
    width: 133px;
    height: 25px;
    padding-left: 5px;
    padding-top: 1px;
    box-shadow: 0px 2px 2px #222;
}
</style>

