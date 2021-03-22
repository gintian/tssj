<template>
    <div id="selectShipDom">
        <div class="title"  >
            <h4  @click="selecship()">筛船信息 </h4>
             <!-- <h4  @click="selecarea()">信息 </h4> -->
            <i class="el-icon-close" @click="$emit('hide')"></i>
        </div>
        <div class="content" style="overflow: auto;height: calc(100% - 40px)">
            <div class="item" v-for="(item,index1) in base" :key="index1">
                <p style="line-height: 20px">
                <!-- 父级标题 -->
                    {{item.name}}
                    <i class="el-icon-view" style="font-size: 16px;vertical-align: middle;cursor: pointer" v-show="item.is" @click="selectAll(item)"></i>
                    <font-awesome-icon :icon="['far','eye-slash']" style="font-size: 14px;color: red;vertical-align: middle;cursor: pointer" @click="selectAll(item)"  v-show="!item.is"/>
                </p>
                <!-- 父级里的子内容 -->
               <div class="btn">
                   <a href="javascript:void(0)" v-for="(i,index2) in item.children"  :key="index2"
                    :class="[i.is?'':'choose']" @click="clickShip(i)">{{i.name}}</a>
               </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'SelectMarker',
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
        loadShip:{
            type:Array,
            default:()=>[]
        },
        selecarea:{
            type:Array,
            default:()=>[]
        },
    },
    watch:{
      ship(val){
        this.ship=val
      },
        loadShip(val){
          // console.log('asddddddddd',val)

            for(let i of val){
                this.base[0].children.push({name:i.shipType,is:true,ship:true})
            }
        },
        selecarea(val){
            for(let i of val){
                this.base[2].children.push({name:i.name,is:true,selectarea:true,id:i.id})
            }
        }
    },

    data(){
      return{
        base:[
          {
            name:'船舶类型',
            is:true,
            parShip:true,
            children:[]
          },
          {
            name:'出现时间',
            is:true,
            parTime:true,
            children:[{name:'00:00-05:00',is:true,appear_time:true,index:1},{name:'05:00-10:00',is:true,appear_time:true,index:2},
            {name:'10:00-15:00',is:true,appear_time:true,index:3},{name:'15:00-20:00',is:true,appear_time:true,index:4},
            {name:'20:00-24:00',is:true,appear_time:true,index:5}]
          },
          {
            name:'区域',
            is:true,
            parArea:true,
            children:[]
          },
        ],
      }
    },
    mounted(){
      // this.loadShip()
      // this.selecarea()
    },
    methods:{

      clickShip(i){
        i.is=!i.is
        // console.log("选中点击",i)
        this.$emit('selectMarker',i)
      },
      selectAll(v){
        v.is=!v.is
        // console.log(v)
        for(let i of v.children){
          // console.log(i)
          i.is=v.is
          // this.$emit('selectMarker',i)
        }
        this.$emit('selectMarker',v)
          this.$emit('loadShip',v)
          this.$emit('selecarea',v)
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
    width: 350px;
    height: 400px;
    // background: #305071;
    background: white;
    .title{
        width: 100%;
        height: 46px;
        background: #2770D4;
        display: grid;
        grid-template-columns: 90% 10%;
        h4{
            color: white;
            font-weight: 100;
            font-weight: normal;
            height: 40px;
            font-size: 14px;
            line-height: 46px;
            padding-left: 10px;
            display: inline;
        }
        i{
            color: white;
            cursor: pointer;
            font-size: 20px;
            line-height: 46px;
        }
    }
    .item{
        margin: 8px 15px 8px 15px ;
        p{
            font-size: 14px;
            // font-weight: 400;
           color: black;
            font-weight: 100;
            margin-bottom: 10px;
        }
       .btn{
           display: grid;
           grid-template-columns: repeat(3,1fr);
           grid-template-rows: 30px;
           grid-row-gap: 5px;
           .choose{
               background: #ddd;  //当点击时呈现淡灰色
               color: #999;
           }
           a{
               border-radius: 2px;
               background: #2770D4;
               text-align: center;
               /*height: 30px;*/
               font-size: 12px;
               text-decoration: none;
               color: white;
               padding: 5px 10px;
               margin-left: 10px;
           }
       }

    }
}
</style>
