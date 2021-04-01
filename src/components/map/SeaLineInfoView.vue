<template>
    <div class="main">
        <div style="display: grid;grid-template-columns: 88% 12%;background: #2770D4;color: #eee;    padding: 3px;">
            <div style="padding-left: 10px;">{{titleName}}海底光缆信息</div>
            <div style="padding:0 4px;text-align: right;">
                <el-button type="text" @click="remove" style="padding: 0;color: #eee;">X
                </el-button>
            </div>
        </div>
        <div style="padding: 5px;">
            <div>
                 <table style="width: 100%;">
                    <tr v-for="index in rowCount" :key="index">
                        <td class="title">{{ordArr[index-1].name}}：</td>
                        <td class="value" style="width: 150px;">{{tabObj[ordArr[index-1].prop]}}</td>
                        <td class="title">{{ordArr[rowCount + index -1].name}}：</td>
                        <td class="value">{{tabObj[ordArr[rowCount + index -1].prop]}}</td>
                    </tr>
                    <tr v-if='ordArr.length%2===1'>
                         <td class="title">{{ordArr[ordArr.length-1].name}}：</td>
                        <td class="value" style="width: 150px;">{{tabObj[ordArr[ordArr.length-1].prop]}}</td>
                    </tr> 
                </table>
                  <h4 style="margin: 5px 12px;color: red;">点位信息集合如下：</h4>
                 <table style="width: 100%;" v-if="tabObj.points">
                    <tr v-for="(item,index) in tabObj.points" :key="index">
                        <td class="title">经度：</td>
                        <td class="value">{{item.lon}}</td>
                        <td class="title">纬度：</td>
                        <td class="value">{{item.lat}}</td>
                    </tr>
                </table>
            </div>
        </div>
                <div class="down">
                    <div>
                        <!-- <el-button type="primary" @click="focus"  style="margin-left: 5px;margin-top: 5px;"  size="mini" icon="el-icon-star-off" v-show="!tabObj.isFocus">关注</el-button>
                        <el-button type="primary" @click="disFocus"  style="margin-left: 5px;margin-top: 5px;"  size="mini" icon="el-icon-star-on"  v-show="tabObj.isFocus">取关</el-button> -->
                    </div>
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
    
    },
    mounted(){
      // console.log('tabObj',this.tabObj)
    },
    updated() {
      // console.log('tabObj',this.tabObj)
    },
    data(){
      return {
        ordArr:[
          { id:0, name:'名称' ,prop:'name'},
          { id:1, name:'控制距离' ,prop:'controller_distance'},
          // { id:3, name:'点位信息' ,prop:'points'},
          { id:4, name:'总长度' ,prop:'total_length'}
        ],
        //urltypeArr
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
        this.$emit('isFocus',{description:this.description,focus:false,targetType:6,targetSign:this.tabObj.id})
      },
      focus(){
        this.dialogVisible=true
      },
      disFocus(){
        this.$set(this.tabObj,'isFocus',false)
        this.$emit('isFocus',{description:this.description,focus:true,targetType:6,targetSign:this.tabObj.id})
      },

    }
  }
</script>
<style  scoped>
    .main{

        display: grid;
        height:auto;
        width: auto;
        /* background: #305071; */
        background: white;
    }
    .title{ 
        text-indent: 10px;
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
        padding: 15px;
        display: grid;
        grid-template-columns: repeat(2,40.5%);
        /* grid-template-rows: 50% 50%;*/
        grid-row-gap: 1%;
        grid-column-gap: 1%;
    }
</style>
