<template>
    <div class="main">
        <div style="display: grid;grid-template-columns: 88% 12%;background:#2770D4;color: #eee;    padding: 3px;">
            <div style="padding-left: 10px;">{{titleName}}自定义区域</div>
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
                     <tr v-if='ordArr.length%2===1'>
                        <td class="title">{{ordArr[ordArr.length-1].name}}：</td>
                        <td class="value">{{tabObj[ordArr[ordArr.length-1].prop]}}</td>
                    </tr>
                </table>
                <!--<h4 style="margin: 5px 12px;color: red;" v-if="tabObj.type==0"></h4>-->
                <!--<table style="width: 100%;"  v-if="tabObj.type==0">-->
                    <!--<tr v-for="(item,index) in ordArr" :key="index">-->
                        <!--<td class="title">经度：</td>-->
                        <!--<td class="value">{{item.lon}}</td>-->
                        <!--<td class="title">纬度：</td>-->
                        <!--<td class="value">{{item.lat}}</td>-->
                    <!--</tr>-->
                <!--</table>-->
                <h4 style="margin: 5px 12px;color: red;" v-if="tabObj.type!=0">区域坐标点集合如下：</h4>
                <table style="width: 100%;" v-if="tabObj.type!=0">
                    <tr v-for="(item,index) in points" :key="index">
                        <td class="title">经度：</td>
                        <td class="value">{{item.lon}}</td>
                        <td class="title">纬度：</td>
                        <td class="value">{{item.lat}}</td>
                    </tr>
                </table>
                <!--<el-table-->
                        <!--:data="points"-->
                        <!--style="width: 100%">-->
                    <!--<el-table-column-->
                            <!--v-for="(item,index) in tableTop"-->
                            <!--:key="index"-->
                            <!--:prop="item.prop"-->
                            <!--:label="item.name"-->
                    <!--&gt;-->
                    <!--</el-table-column>-->
                <!--</el-table>-->
            </div>
        </div>
    </div>
</template>
<script>
  import ShipTab from '../ShipTab'

  export default {
    components: {
      ShipTab
    },
    props: {
        points:{
            type:Array,
            default: () => []
        },
      tabObj: {
        type: Object,
        default: ()=>{ return {} }
      },
      titleName: {
        type: String,
        default: ''
      },
    },
    computed: {
      rowCount: function() {
        return Math.ceil(this.ordArr.length / 2)
      }
    },
    watch: {
        tabObj(val){
        // this.tabObj=val
        // this.tabObj.showed=false
        // console.log('自定义区域TabObj',val)
        if(val.type==0){
          // return "圆形海域"
          val.type='圆形海域'
        }else if(val.type==1){
          // return  "矩形海域"
          val.type='矩形海域'
        }else  if(val.type==2){
          // return  "多边形海域"
          val.type='多边形海域'
        }
      },
        points(val){
            // console.log('points',val)
        }
    },
    mounted() {
      // console.log('自定义区域TabObj',this.tabObj)
    },
    updated() {
      // console.log('shipTabObj',this.tabObj)
    },
    data() {
      return {

          tableTop:[
            { id: 0, name: '纬度', prop: 'lat' },
            { id: 1, name: '经度', prop: 'lon' },
          ],
          ordArr: [
            { id: 0, name: '区域名称', prop: 'name' },
            { id: 1, name: '海域半径', prop: 'radius' },
            { id: 2, name: '描述', prop: 'descriptions' },
            { id: 3, name: '类型', prop: 'type' },
            { id: 4, name: '中心点纬度', prop: 'lat' },
            { id: 5, name: '中心点经度', prop: 'lon' },
        ],
        dialogVisible: false,
        description: ''
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
      subFocus() {
        console.log(this.tabObj)
        this.dialogVisible = false
        this.$set(this.tabObj,'isFocus',true)
        this.$emit('isFocus',{description:this.description,focus:false,targetType:5,targetSign:this.tabObj.id})
      },
      focus() {
        // console.log(this.tabObj.isFocus)
        this.dialogVisible = true
        // if (this.tabObj.isFocus === true) {
        // } else {
        //   this.$emit('isFocus', { description: this.description, focus: this.tabObj.isFocus, targetType: 5, targetSign: this.tabObj.id })
        // }
        // this.$emit('isFocus',this.focus)

      },
      disFocus(){
        this.$set(this.tabObj,'isFocus',false)
        this.$emit('isFocus',{description:this.description,focus:true,targetType:5,targetSign:this.tabObj.id})
      },

    }
  }
</script>
<style scoped>
    .main {

        display: grid;
       grid-template-rows: 20% 80%;
        /*height: 150px;*/
        height: 211px;
        width: auto;
        /* background: #305071; */
         background: white;
    }

    .title {
        /* text-align: right; */
         text-indent: 10px;
        color: black;
        font-size: 14px;
        font-weight: 400;
        width: 180px;
    }

    .value {
        /* color: #e2e2e2; */
        color: black;
        font-size: 14px;
        font-weight: 400;
        width: 131px;
    }

    .down {
        padding: 5px;
        padding-left: 15px;
        /*display: grid;*/
        /*grid-template-columns: repeat(2,40.5%);*/
        /* grid-template-rows: 50% 50%;*/
        /* grid-row-gap: 1%;*/
        /* grid-column-gap: 1%;*/
    }
</style>
