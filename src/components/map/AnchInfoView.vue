<template>
    <div class="main">
        <div style="display: grid;grid-template-columns: 88% 12%;background: #2770D4;color: #eee;    padding: 3px;">
            <div style="padding-left: 10px;">{{titleName}} 锚地信息</div>
            <div style="padding:0 4px;text-align: right;">
                <el-button type="text" @click="remove" style="padding: 0;color: #eee;">X
                </el-button>
            </div>
        </div>
        <div style="overflow: auto;padding: 5px;">
            <div>
                <table style="width: 100%;">
                    <tr v-for="index in rowCount" :key="index">
                    <td class="title">{{ordArr[index-1].name}}：</td>
                    <td class="value">{{tabObj[ordArr[index-1].prop]}}</td>

                    <td class="title">{{ordArr[rowCount + index -1].name}}：</td>
                    <td class="value">{{tabObj[ordArr[rowCount + index -1].prop]}}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="down">
            <el-button type="primary" @click="showAnchArea"  style="margin-left: 5px;margin-top: 5px;"  size="mini"  icon="el-icon-view" v-show="!tabObj.showed">显示</el-button>
            <el-button type="primary" @click="showAnchArea"  style="margin-left: 5px;margin-top: 5px;"  size="mini"  icon="el-icon-view" v-show="tabObj.showed">隐藏</el-button>
            <!-- <el-button type="primary" @click="focus"  style="margin-left: 5px;margin-top: 5px;"  size="mini" icon="el-icon-star-off" v-show="!tabObj.isFocus">关注</el-button>
            <el-button type="primary" @click="disFocus"  style="margin-left: 5px;margin-top: 5px;"  size="mini" icon="el-icon-star-on" v-show="tabObj.isFocus">取关</el-button> -->
        </div>
    </div>
</template>
<script>
import ShipTab from '../ShipTab'
export default {
    components:{
        ShipTab
    },
    props:{
        tabObj:{
            type:Object,
            default:()=>{}
        },
        titleName:{ 
            type:String,
            default:''
        }
    },
    computed: {
        rowCount: function() {
            return Math.ceil(this.ordArr.length/2);
        },
    },
    watch:{
      tabObj(val){
        this.tabObj=val
        // this.tabObj.showed=false
        // console.log('锚地TabObj',this.tabObj)
      }
    },
    mounted(){
        // console.log('锚地shipTabObj',this.shipTabObj)
    },
  data(){
        return {
            ordArr:[
                { id:0, name:'名称' ,prop:'name'},
                { id:1, name:'描述' ,prop:'describe'},
                { id:2, name:'经度' ,prop:'lon'},
                { id:3, name:'纬度' ,prop:'lat'},
              // { id:4, name:'设备编号' ,prop:'station'},
              // { id:5, name:'是否异常' ,prop:'statusString'},
              // { id:6, name:'是否使用' ,prop:'usedString'},
              // { id:7, name:'是否展示' ,prop:'showedString'}
            ],
          switchs:false,
          dialogVisible:false,
          description:'',
            //urltypeArr
        }
    },
    methods:{
        remove(){
            this.$emit('remove')
        },
        info(){
            this.$emit('info')
        },
        track(){
            this.$emit('track')
        },
        histroy(){
            this.$emit('histroy')
        },
        report(){
            this.$emit('report')
        },
        // 显示或隐藏
      showAnchArea(){
        this.tabObj.showed=!this.tabObj.showed
        this.$emit('showAnchArea',this.tabObj.showed)
      },
    }
}
</script>
<style  scoped>
.main{

    display: grid;
    grid-template-rows: 20% 45% 35%;
    height: 150px;
    width: auto;
    /* background: #305071; */
    background: white;
}
.title{
  text-align: right;
  color: black;
  font-size: 14px;
  font-weight: 400;
}
.value{
  color: black;
  font-size: 14px;
  font-weight: 400;
}
.down{
    margin-left: 5%;
    padding: 5px;
}
</style>
