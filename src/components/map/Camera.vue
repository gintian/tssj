<template>
    <div class="main">
        <div style="display: grid;grid-template-columns: 88% 12%;background:#2770D4;color: #eee; align-items: center;   padding: 3px;">
            <div style="padding-left: 10px;">{{titleName}}摄像头信息</div>
            <div style="padding:0 4px;text-align: right;">
                <el-button type="text" @click="remove" style="padding: 0;color: #eee;">X
                </el-button>
            </div>
        </div>
        <div style="overflow: auto;padding: 5px;">
            <div v-if="Object.keys(tabObj).length<2" style="height: 150px;display: grid;place-items: center">暂无数据
            </div>
            <div   v-else>
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
    </div>
</template>
<script>
  import ShipTab from '../ShipTab'

  export default {
    components: {
      ShipTab
    },
    props: {
      tabObj: {
        type: Object,
        default: ()=>{ return {} }
      },
      titleName: {
        type: String,
        default: ''
      }
    },
    computed: {
      rowCount: function() {
        return Math.floor(this.ordArr.length / 2)
      }
    },
    watch: {
        tabObj(val){
          // console.log('zzhi',val)
        this.tabObj=val
        this.tabObj.showed=false
        // console.log('摄像头TabObj',val)
         if(val.status==true){
          val.status='异常'
        }else if(val.status==false){
          val.status='正常'
        }
      }
    },
    mounted() {
      // console.log('摄像头TabObj',this.tabObj)
    },
    updated() {
      // console.log('shipTabObj',this.tabObj)
    },
    data() {
      return {
        ordArr: [
          { id: 0, name: '名称', prop: 'name' },
          { id: 1, name: '状态', prop: 'status' },
          { id: 2, name: '经度', prop: 'lon' },
          { id: 3, name: '纬度', prop: 'lat' },
          // { id: 4, name: '播放刘地址', prop: 'videoUrl' },
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
        grid-template-rows: 20% 45% 35%;
        height: 150px;
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
    }

    .value {
        /* color: #e2e2e2; */
        color: black;
        font-size: 14px;
        font-weight: 400;
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
