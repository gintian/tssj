<template>
    <div class="main">
        <div style="display: grid;grid-template-columns: 88% 12%;background: #2770D4;color: #eee;    padding: 3px;">
            <div style="padding-left: 10px;">{{titleName}} AIS设备信息</div>
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
            return Math.ceil(this.ordArr.length/2);
        },
    },
    watch:{
      tabObj(val){
        this.tabObj=val
        // this.tabObj.showed=false
        console.log('aisTabObj',this.tabObj)
      }
    },
    mounted(){
        //console.log('shipTabObj',this.shipTabObj)

      // this.tabObj.isFocus=false

    },
  data(){
        return {
            ordArr:[
                { id:0, name:'名称' ,prop:'name'},
                { id:1, name:'编号' ,prop:'station'},
                { id:2, name:'经度' ,prop:'lon'},
                { id:3, name:'纬度' ,prop:'lat'},
            //   { id:4, name:'设备编号' ,prop:'station'},
            //   { id:5, name:'是否异常' ,prop:'statusString'},
            //   { id:6, name:'是否使用' ,prop:'usedString'},
            //   { id:7, name:'是否展示' ,prop:'showedString'}
            ],
            //urltypeArr
          dialogVisible:false,
          description:'',
          tobj:{},

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

        // this.$nextTick(()=>{
          this.$set(this.tabObj,'isFocus',true)
        // })

        this.$emit('isFocus',{description:this.description,focus:false,targetType:2,targetSign:this.tabObj.id})
      },
      focus(){
          // console.log(this.tabObj.isFocus)
        this.dialogVisible=true
        this.tobj.isFocus=false
        // if(this.tabObj.isFocus===true){
        // }else{
        //   this.$emit('isFocus',{description:this.description,focus:this.tabObj.isFocus,targetType:2,targetSign:this.tabObj.id})
        // }
        // this.$emit('isFocus',this.focus)

      },
      disFocus(){

        // this.$nextTick(()=>{
          this.$set(this.tabObj,'isFocus',false)
        // })
        this.$emit('isFocus',{description:this.description,focus:true,targetType:2,targetSign:this.tabObj.id})
      },

    }
}
</script>
<style  scoped>
.main{

    display: grid;
   grid-template-rows: 20% 80%;
        height: 150px;
    width: auto;
    /* background: #305071; */
    background: white;
}
.title{
  /* text-align: right; */
  text-indent: 8px;
  font-size: 14px;
  font-weight: 400;
  color: black;
  width: 56px;
}
.value{
  /* color: #e2e2e2; */
  color: black;
  font-size: 14px;
  font-weight: 400;
}
.down{
    padding: 5px;
    display: grid;
    grid-template-columns: repeat(2,40.5%);
   /* grid-template-rows: 50% 50%;*/
    grid-row-gap: 1%;
    grid-column-gap: 1%;
}
</style>
