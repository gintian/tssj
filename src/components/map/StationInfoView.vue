<template>
    <div class="main">
        <div style="background:#2770D4;color: #eee;    padding: 3px;">
            <div style="padding-left: 10px;display: inline-block;ine-height: 30px;">{{tabObj.name}} 资源站信息</div>
            <div style="padding-right: 4px;text-align: right;float: right;display: inline-block;">
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
           <div style="margin-left: 3%;">
               <el-collapse  @change="handleChange">
                   <el-collapse-item :title="'雷达列表 ：'+tabObj.radarList.length+'个'" name="1">
<!--                       <div style="text-align: center" v-if="tabObj.radarList.length<1">暂无</div>-->
                           <el-table
                                   :data="tabObj.radarList"
                                   style="width: 100%">
                               <el-table-column
                                       v-for="item in radarList"
                                       :key="item.id"
                                       :prop="item.prop"
                                       :label="item.name"
                                       width="110">
                               </el-table-column>

                           </el-table>
                   </el-collapse-item>
                   <el-collapse-item :title="'AIS列表 ：'+tabObj.aisList.length+'个'" name="2">
<!--                       <div style="text-align: center" v-if="tabObj.aisList.length<1">暂无</div>-->
                       <el-table
                               :data="tabObj.aisList"
                               style="width: 100%">
                           <el-table-column
                                   v-for="item in aisList"
                                   :key="item.id"
                                   :prop="item.prop"
                                   :label="item.name"
                                   width="110">
                           </el-table-column>

                       </el-table>
                   </el-collapse-item>
                   <el-collapse-item :title="'摄像头列表 ：'+tabObj.cameraList.length+'个'" name="3">
<!--                       <div style="text-align: center" v-if="tabObj.cameraList.length<1">暂无</div>-->
                       <el-table
                               :data="tabObj.cameraList"
                               style="width: 100%">
                           <el-table-column
                                   v-for="item in cameraList"
                                   :key="item.id"
                                   :prop="item.prop"
                                   :label="item.name"
                                   width="110">
                           </el-table-column>

                       </el-table>
                   </el-collapse-item>
               </el-collapse>
           </div>
        </div>
        <div class="down">
            <!--<el-button type="primary" @click="info" style="margin-left: 10px;margin-top: 5px;"  size="mini" icon="el-icon-warning-outline">信息</el-button>-->
<!--            <el-button type="primary" @click="info"  style="margin-left: 0px;margin-top: 5px;"  size="mini" icon="el-icon-view">船舶列表</el-button>-->
            <el-button type="primary" @click="focus"  style="margin-left: 5px;margin-top: 5px;"  size="mini" icon="el-icon-star-off" v-show="!tabObj.isFocus">关注</el-button>
            <el-button type="primary" @click="disFocus"  style="margin-left: 5px;margin-top: 5px;"  size="mini" icon="el-icon-star-on"  v-show="tabObj.isFocus">取关</el-button>
<!--           <div>-->
<!--               <span style="display: inline-block;padding:0 10px">关注</span>-->
<!--               <el-switch-->
<!--                       v-model="tabObj.isFocus"-->
<!--                       active-color="#13ce66"-->
<!--                       @change="focus"-->
<!--               >-->
<!--               </el-switch>-->
<!--           </div>-->
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
        /*shipTabObj :function(val) {
            if(val.urltype === 2){
                console.log(val)
                this.ordArr = [
                    { id:1, name:'MMSI' ,prop:'mmsi' },
                    { id:2, name:'名称' ,prop:'name' },
                    { id:3, name:'方位' ,prop:'azimuth' },
                    { id:4, name:'距离' ,prop:'distance' },
                    { id:5, name:'航向' ,prop:'course' },
                    { id:6, name:'航速' ,prop:'speed' },
                    { id:8, name:'经度' ,prop:'lon' },
                    { id:9, name:'纬度' ,prop:'lat'},
                ]
            }
        }*/
    },
    mounted(){
        //console.log('shipTabObj',this.shipTabObj)

      // this.tabObj.isFocus=false

    },
  updated() {
      // console.log(12313)
      // this.tobj={...this.tabObj}
  },
  data(){
        return {
            ordArr:[
              {id: 0, prop: 'name', name: '名称'},
              {id: 1, prop: 'longitude', name: '经度'},
              {id: 2, prop: 'latitude', name: '纬度'},
              {id: 3, prop: 'scope', name: '探测距离'},
              {id: 4, prop: 'description', name: '描述'},
              {id: 5, prop: 'statusString', name: '运行状态'},
              {id: 6, prop: 'showedString', name: '是否显示'},
              {id: 7, prop: 'usedString', name: '是否使用'},
            ],
          radarList:[ { id: 0, prop: 'name', name: '名称' },
            { id: 2, prop: 'longitude', name: '经度' },
            { id: 3, prop: 'latitude', name: '纬度' },
            // { id: 7, prop: 'status', name: '运行状态' },
            ],
          aisList:[ {id: 0, prop: 'name', name: '名称'},
            {id: 2, prop: 'longitude', name: '经度'},
            {id: 4, prop: 'latitude', name: '纬度'},
            // {id: 5, prop: 'status', name: '运行状态'},
            ],
          cameraList:[ {id: 0, prop: 'name', name: '名称'},
            {id: 2, prop: 'longitude', name: '经度'},
            {id: 3, prop: 'latitude', name: '纬度'},
            // {id: 19, prop: 'status', name: '运行状态'},
            ],
            //urltypeArr
          dialogVisible:false,
          description:'',
          tobj:{},

        }
    },
    methods:{
      handleChange(val) {
        console.log(val);
      },
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

        this.$emit('isFocus',{description:this.description,focus:false,targetType:0,targetSign:this.tabObj.id})
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
        this.$emit('isFocus',{description:this.description,focus:true,targetType:0,targetSign:this.tabObj.id})
      },

    }
}
</script>
<style  scoped>
.main{

    /*display: grid;*/
    /*grid-template-rows: 15% 65% 20%;*/
    /*height: 510px;*/
    width: auto;
    background: #305071;

}
.title{
  text-align: right;
  color: #ffffff;
    height: 35px;
  font-size: 14px;
  font-weight: 400;
}
.value{
  color: #dcdcdc;
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
    /deep/.el-collapse-item__header{
        background-color: transparent;
        border: none;
    }
    /deep/.el-collapse-item__content{
        background-color: transparent;
    }
/deep/.el-collapse{
    border: none;
}
/deep/.el-collapse-item__wrap{
    background-color: transparent;
}
/deep/.el-table, .el-table__expanded-cell{
    background:  transparent;
}
/deep/.el-collapse-item__header{
    color: white;
}
/deep/.el-table{
    color: white;
}
/deep/.el-table--enable-row-hover /deep/.el-table__body tr:hover > td {
    background-color: transparent !important;
}

.el-table--border::after, .el-table--group::after, .el-table::before{
    background: none!important;
}
/deep/.el-table--border, /deep/.el-table--group, /deep/.el-table, /deep/.el-table th,/deep/ .el-table tr{
    background: transparent;
}
/deep/.el-table td, .el-table th{
    border: none;
}

</style>
