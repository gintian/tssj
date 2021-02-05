<template>
  <div class="dropdown">
      <div class="dropbtn" @click="iconClick($event)">
       <font-awesome-icon  :icon="titleIcon" size="lg"  />
       <br>
       {{title}}
      </div>
      <div class="dropdown-content" v-if="dropdownData.length !==0">
          <div v-for="(item,index) in dropdownData" :key='item.id' class="dropdown-content-div"
               @click="dropdownDivClick(item,index)" :ref="item.name"
               :class="{'click-dropdown-content-div':index==n||item.is}">
              <div>
                  <font-awesome-icon :icon="item.icon" :style="{color:item.color?item.color:'inherit'}"/>
              </div>
              <div>
                  {{item.name}}
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    msg: String,
    title: {
      type: String,
      default:'标题'
    },
    titleIcon: {
      type: Array,
      default:()=>[]
    },
    dropdownData: {
      type: Array,
      default:()=>[]
    },
    item:{
      type:Object,
      default:()=>{}
    }
  },
  data(){
    return {
      isDropDownClick:false,
      n: undefined
      /*title: '目标',
      titleIcon: 'server',
      dropdownData: [
        { id:0 , icon:'satellite-dish',name:'雷达' },
        { id:1 , icon:'broadcast-tower',name:'AIS' },
      ]*/
    }
  },
  watch:{
    dropdownData(val){
      console.log('watch',val)
    }
  },
  methods: {
    dropdownDivClick(val)/* 点击下拉框 下面的按钮 */ {
      // console.log(val)
      //this.$$refs[val.id].background = rgb(38, 98, 128);
      if(!val['is']){
        val['is'] = true;
        this.$emit('clickItem',val);
        this.$refs[val.name][0].className = 'click-dropdown-content-div';

      }else{
        val['is'] = false;
        this.$emit('clickItem',val);
        this.$refs[val.name][0].className = 'dropdown-content-div';

      }
    },
    iconClick(e) {
      // console.log(this.item)
      // console.log(e)
      // e.currentTarget.style.background='#eee'
      if(this.dropdownData.length !== 0) return;
      if(this.item.id===2){
        // e.currentTarget.style.backgroundColor='#eee'
        // console.log( e.currentTarget.style.backgroundColor)
        if( e.currentTarget.style.backgroundColor===''){
          e.currentTarget.style.backgroundColor='#eee'
          this.$emit('iconClick',{...this.item,clicked:true});
        }else{
          e.currentTarget.style.backgroundColor=''
          this.$emit('iconClick',{...this.item,clicked:false});
        }
      }else{
        this.$emit('iconClick',this.item);
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dropdown{
    position: relative;
    user-select:none;
    margin: 5px;
}
.dropbtn {
    /* background-color: #61BAD8; */
    color: #222;
    /*padding: 16px;
    font-size: 16px;*/
    border: none;
    cursor: pointer;
    width: 38px;
    height: 38px;
    border-radius: 25px;
    text-align: center;
    font-size: 11px;
    padding-top: 1px;
    line-height: 17px;
    /*display: grid;*/
    /*grid-template-rows: 50% 50%;*/
    /*font-weight: bold;*/
    /*font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;*/
}
.dropdown-content {
    display: none;
    position: absolute;
    padding-top: 55px;
    padding-bottom: 23px;
    background:rgba(31,82,108,1);
    width: 50px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    border-radius: 30px;
    top: 0px;
    z-index: -1;
    text-align: center;
    font-size: 14px;
    color: #4C95AE;
}

.dropdown:hover .dropdown-content {
    display: block;
}

.dropdown:hover .dropbtn {
    background-color: #BAEBFC;
}
.dropdown-content-div{
  padding: 5px;
}
.dropdown-content-div:hover {
  background:rgb(38, 98, 128);
  color: #eee;
  cursor:pointer;
}
.iconColr :hover{
  color: #eee;
  cursor:pointer;
}
.click-dropdown-content-div {
  padding: 5px;
  background:rgb(38, 98, 128);
  color: #eee;
  cursor:pointer;
}
</style>
