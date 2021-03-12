<template>
    <div id="selectShipDom">
        <div class="title">
            <i class="el-icon-close" @click="$emit('hide')"></i>
        </div>
        <div class="content" >     
                    <div class="signChildContent" v-for="(item,index) in  mapSigns" :key="index" >
                        <input  type="checkbox"  checked @click="selectAll(item)">
                         <img :src='item.img' alt=""  width="15px" height="22px">
                         <p   >{{item.name}}</p>
                    </div>
                    <!-- @click="selectClick(item,index)" -->
        </div>
    </div>
</template>

<script>
  export default {
    name: 'layerSelect',
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

    data(){
      return{
        mapSigns: [ 
              { img: require('../../assets/mapicon/radar.png'), is:true,name: '雷达' },    
              { img: require('../../assets/mapSigns/ais.png'), is:true,name: 'AIS' },
              { img: require('../../assets/mapSigns/02.png'), is:true,name: '码头' },
              { img: require('../../assets/mapSigns/03.png'), is:true,name: '锚地' },   
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
        this.$emit('layerSelect',v)
      },
      selectClick(item,index) {
        console.log('selectClick',item)
				if(!item.isShow) {   // 判断是否有isShow属性
					this.$set(item,'isShow',false)  // 没有则为当前对象设置该属性为false
					item.isShow = !item.isShow
				}else {
					item.isShow = !item.isShow
        }
         this.$emit('layerSelect',item)
			},  
    }
  }
</script>

<style scoped lang="less">
    *{
        margin: 0;
        padding: 0;
    }
#selectShipDom{
    width: 135px;
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
    grid-template-columns: 20% 25% 55%;
    margin: 17px 16px;
    align-items: center;
    }
}
</style>
