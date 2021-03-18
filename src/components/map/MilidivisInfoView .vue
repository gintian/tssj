<template>
    <div class="main">
        <div style="display: grid;grid-template-columns: 88% 12%;background:#2770D4;color: #eee;    padding: 3px;">
            <div style="padding-left: 10px;">{{titleName}}军分区信息</div>
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
        return Math.ceil(this.ordArr.length / 2)
      }
    },
    watch: {
        tabObj(val){
          // console.log('zzhi',val)
        this.tabObj=val
        this.tabObj.showed=false
        // console.log('组织机构TabObj',val)
      }
    },
    mounted() {
      // console.log('组织机构TabObj',this.tabObj)
    },
    updated() {
      // console.log('shipTabObj',this.tabObj)
    },
    data() {
      return {
        ordArr: [
          { id: 0, name: '名称', prop: 'name' },
          // { id: 1, name: '所属区域', prop: 'area' },
          { id: 2, name: '经度', prop: 'longitude' },
          { id: 3, name: '纬度', prop: 'latitude' },
          { id: 4, name: '描述', prop: 'description' },
          // { id: 5, name: '通信联络', prop: 'communicate' },
          // { id: 6, name: '航行条件', prop: 'conditions' },
          // { id: 7, name: '码头设备', prop: 'equipment' },
          // { id: 8, name: '引航方式', prop: 'pilotagWay' },
          // { id: 9, name: '航法', prop: 'sailing' }
        ],
        //urltypeArr
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
        /* grid-template-rows: 15% 85%; */
        /* height: 210px; */
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
