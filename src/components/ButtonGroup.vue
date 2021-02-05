<template>
  <div class="buttonDiv">
    <div @click="setItemClass(1)" :class="{ item:true , itemClick:isItem1}">
        <div style=" position: relative;" >
                    <img  src="../assets/bg1.png"/>
                    <span style="">{{item1Text}}</span>
        </div>
    </div>
    <div @click="setItemClass(2)"  :class="{ item:true , itemClick:isItem2}">
        <div style=" position: relative;" >
                    <img  src="../assets/bg2.png"/>
                    <span>{{item2Text}}</span>
        </div>
    </div>
   <div @click="setItemClass(3)" :class="{ item:true , itemClick:isItem3}">
      <div style=" position: relative;" >
                    <img  src="../assets/bg3.png"/>
                    <span>{{item3Text}}</span>
        </div>
   </div>
  </div>
</template>

<script>
export default {
  name: 'ButtonGroup',
  props: {
    msg: String,
    item1Text:{
        type: String,
        default:'默认1'//海图
    },
    item2Text:{
        type: String,
        default:'默认2'//卫星图
    },
    item3Text:{
        type: String,
        default:'默认3'//地形图
    },
  },
  data() {
      return {
          isItem1:true,
          isItem2:false,
          isItem3:false,
      }
  },
  methods:{
      setItemClass(type){

        this['isItem' + type] = true;
        this.$emit('clickItem',{type:type});

        if(type === 1){
            this['isItem' +  2] = false;
            this['isItem' +  3] = false;
            return
        }
        if(type === 2){
            this['isItem' +  1] = false;
            this['isItem' +  3] = false;
            return
        }
        if(type === 3){
            this['isItem' +  1] = false;
            this['isItem' +  2] = false;
            return
        }
        //console.log();
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.buttonDiv{
    width: 413px;
    display: grid;
    user-select:none;
    grid-template-columns: repeat(3,33.33%);
    background: rgba(255, 255, 255, 0.6);
}
.buttonDiv  img{
    width: 120px;
    height: 102px;
   
}
.buttonDiv .item {
    /* background: rgba(97, 186, 216, 0.51); */
    padding: 5px 0px 5px 0;
    text-align: center;
    font-size: 10px;
}
.buttonDiv .itemClick {
    /* background: rgba(97, 186, 216, 0.81); */
}
.buttonDiv .item span{
     color: white;
     background: #727272;
     font-size: 16px;
     position: absolute;
    /* left: 112px; */
    bottom: 1%;
    padding: 5px;
     right: 0;
}
.buttonDiv .item:hover {
    background: rgba(97, 186, 216, 0.81);
     cursor:pointer;
}
</style>
