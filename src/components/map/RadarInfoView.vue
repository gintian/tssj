<template>
    <div class="main">
      <div style="display: grid;grid-template-columns: 88% 12%;background:#2770D4;color: #eee;    padding: 3px;">
            <div style="padding:3px 0 3px 10px">{{titleName}}雷达信息</div>
            <div style="padding:4px;text-align: right;">
                <el-button type="text" @click="remove" style="padding: 0;color: #eee;">X
                </el-button>
            </div>
        </div>
        <div style="padding: 15px;">
            <div>
                <table style="width: 100%;">
                    <tr v-for="index in rowCount" :key="index">
                        <td class="title">{{ordArr[index-1].name}}：</td>
                        <td class="value">{{tabObj[ordArr[index-1].prop]}}</td>
                        <td class="title">{{ordArr[rowCount + index -1].name}}：</td>
                        <td class="value">{{tabObj[ordArr[rowCount + index -1].prop]}}</td>
                    </tr>
                    <tr v-if='ordArr.length%2===1'>
                        <td class="title">{{ordArr[ordArr.length-1].name}}：</td>
                        <td class="value">{{tabObj[ordArr[ordArr.length-1].prop]}}</td>
                    </tr>                    
                </table>
            </div>
        </div>
        <div class="down">  
           <!-- <el-button type="primary" @click="info"  style="margin-left: 0px;margin-top: 5px;"  size="mini" icon="el-icon-view">船舶列表</el-button>         -->
            <!-- <el-button type="primary" @click="focus"  style="margin-left: 5px;margin-top: 5px;"  size="mini" icon="el-icon-star-off" v-show="!tabObj.isFocus">关注</el-button>
            <el-button type="primary" @click="disFocus"  style="margin-left: 5px;margin-top: 5px;"  size="mini" icon="el-icon-star-on"  v-show="tabObj.isFocus">取关</el-button> -->
        </div>
        <el-dialog
                :modal="false"
                title="备注"
                :visible.sync="dialogVisible"
                width="30%"
                :show-close="false"
        >
            <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="description">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="subFocus">确 定</el-button>
            </span>
        </el-dialog>
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
            default:{}
        },
        titleName:{
            type:String,
            default:''
        }
    },
    computed: {
        rowCount: function() {
            return Math.floor(this.ordArr.length/2);
        },
    },
    watch:{
          tabObj(val){
        this.tabObj=val
        // this.tabObj.showed=false
        // console.log('雷达TabObj',this.tabObj)
      }
    },
    mounted(){
        // console.log(this.shipTabObj)
    },
    data(){
        return {
            ordArr:[
                { id:0, name:'名称' ,prop:'name'},              
                { id:1, name:'范围' ,prop:'range'},
                { id:2, name:'经度' ,prop:'lon'},
                { id:3, name:'纬度' ,prop:'lat'},
                { id:4, name:'波段' ,prop:'band'},
            ],
          dialogVisible:false,
          description:'',
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
      subFocus(){
        console.log(this.tabObj)
        this.dialogVisible=false
        this.$set(this.tabObj,'isFocus',true)
        this.$emit('isFocus',{description:this.description,focus:false,targetType:1,targetSign:this.tabObj.id})
      },
      focus(){
        // console.log(this.tabObj.isFocus)
        this.dialogVisible=true
        // if(this.tabObj.isFocus===true){
        // }else{
        //   this.$emit('isFocus',{description:this.description,focus:this.tabObj.isFocus,targetType:1,targetSign:this.tabObj.id})
        // }
        // this.$emit('isFocus',this.focus)

      },
      disFocus(){
        this.$set(this.tabObj,'isFocus',false)
        this.$emit('isFocus',{description:this.description,focus:true,targetType:1,targetSign:this.tabObj.id})
      },


    }
}
</script>
<style  scoped lang="less">
    /**{*/
    /*    margin: 0;*/
    /*    padding: 0;*/
    /*}*/
.main{

    display: grid;
    grid-template-rows: 24% 76%;
    height: auto;
    width: auto;
    background: white;
}
.title{
//   text-align: right;
  color: black;
  font-size: 14px;
  font-weight: 400;
  width: 46px;
}
.value{
//   color: #ffffff;
    color: black;
  font-size: 14px;
  font-weight: 400;
}
.down{
    padding:0 10px;
   /* display: grid;*/
   /* grid-template-columns: repeat(2,40.5%);*/
   /*!* grid-template-rows: 50% 50%;*!*/
   /* grid-row-gap: 1%;*/
   /* grid-column-gap: 1%;*/
}
p{
    // color: white;
    color: black;
}
    #content{
        display: grid;
        /*line-height: 50%;*/
        margin-top: 0.5rem;
        grid-template-columns: 48% 47%;
        grid-template-rows: 50% 50%;
        grid-column-gap: 10px;
        grid-row-gap: 10px;
        justify-content: center;
        text-align: center;
        .item p{
            margin-top: .5rem;
        }

        .item-2 {
            p {
                width: 47%;
                font-size: 14px;
                display: inline-block;
            }
            p:last-child {
                margin-left: .5rem;
            }
        }

        .item-3 {
            grid-column: 1;
            grid-row: 1;
            margin-right: .7rem
        }

        .item-4 {
            grid-column: 1;
            grid-row: 2;
            margin-right: .7rem
        }

        .item-5 {
            grid-column: 2;
            grid-row: 1;
            margin-left: .7rem
        }

        .item-6 {
            grid-column: 2;
            grid-row: 2;
            margin-left: .7rem
        }
        .title {
            color: #eee;
            font-weight: bold;
            font-size: .5rem;
            line-height: 1.5rem;
            /*background: rgb(235, 241, 254);*/
            background: #3e6791;
            height: 1.5rem;
            padding-left: 15px;
            // text-align: left ;
        }
        .first {
            display: grid;
            /*grid-template-columns: 40% 40%;*/
            /*grid-template-rows: 80px 80px;*/
            grid-column: 1;
            grid-row: 1;

        }

        .second {
            display: grid;
            grid-template-columns: 50% 50%;
            grid-template-rows: 60px 60px;

            grid-column: 1;
            grid-row: 2;
        }

        .third {
            display: grid;
            grid-template-columns: 45% 45%;
            grid-column-gap: 5%;
            grid-template-rows: 5rem;
            grid-column: 2;

            grid-row: 1;
            text-align: center;

            p{
                margin: 0;
            }
            .title {
                text-align: left;
            }

            img {
                margin: .5rem 0 .1rem 0
            }
        }

        .forth {
            display: grid;
            grid-template-columns: 45% 45%;
            grid-column-gap: 5%;
            grid-template-rows: 160px;
            grid-column: 2;
            grid-row: 2;
            text-align: center;
            p{
                margin: 0;
            }
            .title {
                text-align: left
            }

            img {
                margin: .5rem 0 .1rem 0
            }
        }
        .selectFrom {
            display: flex;
            width: 90%;
            margin: 1rem auto;
            .selectItem {
                flex: 1;
                margin-left: 3px;
                margin-top: 10px;
                .title{
                    margin-bottom: 10px;
                }
            }
        }
    }
</style>
