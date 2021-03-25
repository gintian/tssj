<template>
    <div class="main">
        <div style="display: grid;grid-template-columns: 88% 12%;background: #2770D4;color: #eee;     align-items: center;   padding: 3px;">
            <div style="padding-left: 10px;">船舶信息</div>
            <div style="padding-right: 5px;text-align: right;">
                <el-button type="text" @click="remove" style="padding: 0;color: #eee;">X
                </el-button>
            </div>
        </div>
        <div style="overflow: auto;padding: 5px;">
            <div>
                <table style="width: 100%;">
                    <tr v-for="index in rowCount" :key="index">
                        <td class="title">{{ordArr[index-1].name}}：</td>
                        <td class="value" style="width: 150px;">{{shipTabObj[ordArr[index-1].prop]}}</td>
                        <td class="title">{{ordArr[rowCount + index -1].name}}：</td>
                        <td class="value">{{shipTabObj[ordArr[rowCount + index -1].prop]}}</td>
                    </tr>
                    <tr v-if='ordArr.length%2===1'>
                         <td class="title">{{ordArr[ordArr.length-1].name}}：</td>
                        <td class="value" style="width: 150px;">{{shipTabObj[ordArr[ordArr.length-1].prop]}}</td>
                    </tr> 
                </table>
            </div>
        </div>
        <div class="down">
          <!-- targettype1是Ais目标2是融合目标3是雷达目标,其中雷达目标是没有信息框的 -->
            <el-button type="primary" @click="shipDetail" style="margin-left: 10px;margin-top: 5px;"  size="mini" icon="el-icon-warning-outline" v-show="shipTabObj.targettype!==3">信息</el-button>
            <!-- <el-button type="primary" @click="track"  style="margin-left: 5px;margin-top: 5px;"  size="mini" icon="el-icon-view" v-show="shipTabObj.targettype!==1">跟踪</el-button> -->
            <el-button type="primary" @click="histroy"  style="margin-left: 5px;margin-top: 5px;"  size="mini" icon="el-icon-share" >轨迹</el-button>

            <div v-show="shipTabObj.targettype!==3">
                <!-- <el-button type="primary" @click="shipDetail"  style="margin-left: 5px;margin-top: 5px;"  size="mini" icon="el-icon-document" >船舶详情</el-button> -->
                <el-button type="primary" @click="focus"  style="margin-left: 5px;margin-top: 5px;"  size="mini" icon="el-icon-star-off" v-show="!shipTabObj.isFocus">关注</el-button>
                <el-button type="primary" @click="disFocus"  style="margin-left: 5px;margin-top: 5px;"  size="mini" icon="el-icon-star-on"  v-show="shipTabObj.isFocus">取关</el-button>
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
        shipTabObj:{
            type:Object,
            default:{}
        }
    },
    computed: {
        rowCount: function() {
            return Math.floor(this.ordArr.length/2);
        },
    },
    watch:{
        shipTabObj :function(val) {
          // console.log('shipTabObj',val.lasttime)
            if(val.targettype === 3){
                // console.log("targettype",val.targettype)
                this.ordArr = [
                    { id:6, name:'批号' ,prop:'targetid' },
                    //{ id:3, name:'方位' ,prop:'azimuth' },
                   // { id:4, name:'距离' ,prop:'distance' },
                    { id:5, name:'航向' ,prop:'course' },
                    { id:8, name:'经度' ,prop:'lon' },
                    { id:9, name:'纬度' ,prop:'lat'},
                ]
            }else {
              this.ordArr = [
                { id:0, name:'IMO' ,prop:'imo'},
                { id:1, name:'MMSI' ,prop:'mmsi'},
                { id:2, name:'更新时间' ,prop:'lasttime'},
                { id:3, name:'类型' ,prop:'shipType'},
                // { id:4, name:'航速' ,prop:'speed'},
                // { id:5, name:'状态' ,prop:'status'},
                // { id:6, name:'航向' ,prop:'course'},
                { id:7, name:'名称' ,prop:'name'},
                { id:8, name:'经度' ,prop:'lon' },
                { id:9, name:'纬度' ,prop:'lat'},
                // // { id:10, name:'船长度' ,prop:'length'},
                // // { id:11, name:'船宽度' ,prop:'width'},
                // // { id:12, name:'最大吃水' ,prop:'maxDraft'},
                // // { id:13, name:'船艏向' ,prop:'trueHead'},
                // // { id:14, name:'目的地' ,prop:'dest'},
                // //{ id:15, name:'预计航行时间' ,prop:'eta'},
                // // { id:16, name:'更新时间' ,prop:'updatetime'},
                 { id:16, name:'更新时间' ,prop:'lasttime'},
            ]
            }
        }
    },
    mounted(){
      // console.log('shipTabObj',this.shipTabObj)
    },
  updated() {
    // console.log('shipTabObj',this.shipTabObj)
    if(this.shipTabObj.imo==='null'){
      this.shipTabObj.imo='0'
    }
  },
  data(){
        return {
            ordArr:[
                { id:0, name:'IMO' ,prop:'imo'},
                { id:1, name:'MMSI' ,prop:'mmsi'},
                { id:2, name:'更新时间' ,prop:'lasttime'},
                { id:3, name:'类型' ,prop:'shipType'},
                // { id:4, name:'航速' ,prop:'speed'},
                // { id:5, name:'状态' ,prop:'status'},
                // { id:6, name:'航向' ,prop:'course'},
                { id:7, name:'名称' ,prop:'name'},
                { id:8, name:'经度' ,prop:'lon' },
                { id:9, name:'纬度' ,prop:'lat'},
                // // { id:10, name:'船长度' ,prop:'length'},
                // // { id:11, name:'船宽度' ,prop:'width'},
                // // { id:12, name:'最大吃水' ,prop:'maxDraft'},
                // // { id:13, name:'船艏向' ,prop:'trueHead'},
                // // { id:14, name:'目的地' ,prop:'dest'},
                // //{ id:15, name:'预计航行时间' ,prop:'eta'},
                // // { id:16, name:'更新时间' ,prop:'updatetime'},
                //  { id:16, name:'更新时间' ,prop:'lasttime'},
            ],
            //urltypeArr
          dialogVisible:false,
          description:'',
        }
    },
  methods: {
    remove() {
      this.$emit('remove')
    },
    info() {
      this.$emit('info')
    },
    track() {
      this.$emit('track')
    },
    histroy() {
      this.$emit('histroy')
    },
    report() {
      this.$emit('report')
    },
    datetoString(fmt) {
      var o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        'S': this.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    },
    subFocus() {
      // console.log(this.shipTabObj)
      this.dialogVisible = false
      this.$set(this.shipTabObj, 'isFocus', true)
      this.$emit('isFocus', {
        // description: this.description,
        focus: false,
        // targetType: 9,
        // targetSign: this.shipTabObj.mmsi
        mmsi: this.shipTabObj.mmsi ,  
        // focus:this.shipTabObj.focus
      })
    },
    focus() {
      this.dialogVisible = true
      if(this.shipTabObj.focus===true){
        // console.log("this.shipTabObj.focus",this.shipTabObj.focus)
      // }else{
        // this.$emit('isFocus',{description:this.description,focus:this.shipTabObj.isFocus,targetType:9,mmsi:this.shipTabObj.mmsi})
        this.$emit('isFocus',{mmsi:this.shipTabObj.mmsi,focus:this.shipTabObj.focus})
      // }
      this.$emit('isFocus',this.focus)
      }
    },
    disFocus() {
      this.$set(this.shipTabObj, 'isFocus', false)
      this.$emit('isFocus', {
        // description: this.description,
        // focus: true,
        // targetType: 9,
        mmsi: this.shipTabObj.mmsi ,  
        focus:this.shipTabObj.focus
      })
       
    },
    shipDetail(){
      this.$emit('shipDetail',this.shipTabObj.mmsi)
    },
  }
}
</script>
<style  scoped>
.main{
    display: grid;
    grid-template-rows: 11% 74% 15%;
    height: 300px;
    width: auto;
    /* background: #305071; */
    background: white;
}
.title{
  /* text-align: right; */
  color: black;
  font-size: 14px;
  font-weight: 400;
  text-indent: 9px;
}
.value{
  color: black;
  font-size: 14px;
  font-weight: 400;
}
.down{
    padding: 5px;
    display: flex;
   /* grid-template-columns: repeat(4,22%);*/
   /*!* grid-template-rows: 50% 50%;*!*/
   /* grid-row-gap: 1%;*/
   /* grid-column-gap: 1%;*/
}
</style>
