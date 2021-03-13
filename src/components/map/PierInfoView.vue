<template>
    <div class="main">
        <div style="display: grid;grid-template-columns: 88% 12%;background:#2770D4;color: #eee;    padding: 3px;">
            <div style="padding:3px 0 3px 10px">{{titleName}}码头信息</div>
            <div style="padding: 0 4px;text-align: right;">
                <el-button type="text" @click="remove" style="padding: 0;color: #eee;">X
                </el-button>
            </div>
        </div>
        <div style="padding: 5px;">
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
        <!-- <div class="down">       </div> -->
        <div class="satify_time" >
          <!-- <h4>统计时间：</h4> -->
                    <el-table
                            :data="namelist"
                            border
                            style="width: 502px;  overflow: auto;height: 300px;">
                        <el-table-column
                                v-for="(i,index) in lift"
                                :key="index"
                                :prop="i.prop"
                                :label="i.name"
                                width="100"
                        >
                        </el-table-column>
                    </el-table>
        </div>
    </div>
</template>
<script>
  import ShipTab from '../ShipTab'

  export default {
    data(){
       return{
        //  namelist:[],
       }
    },
    components: {
      ShipTab
    },
    props: {
      tabObj: {  //接受信息框的内容
        type: Object,
        default: {}
      },
      titleName: {
        type: String,
        default: ''
      },
       namelist: {
        type: Array,
        default: []
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
        // console.log('码头TabObj',val)
      }
    },
    mounted() {
      // console.log('码头shipTabObj',this.tabObj)
      // this.stify()
    },
    updated() {
      // console.log('shipTabObj',this.tabObj)
    },
    data() {
      return {
        
        ordArr: [
          { id: 0, name: '名称', prop: 'name' },
          // { id: 1, name: '所属码头', prop: 'attributionName' },
          { id: 2, name: '经度', prop: 'lon' },
          { id: 3, name: '纬度', prop: 'lat' },
          { id:4, name:'描述' ,prop:'describe'},
          // { id: 5, name: '是否正常', prop: 'statusString' },
          // { id: 6, name: '是否使用', prop: 'usedString' },
          // { id: 7, name: '兼靠能力', prop: 'ability' },
          // { id: 8, name: '靠泊能力', prop: 'capacity' },
          // { id: 9, name: '联系人', prop: 'contact' },
          // { id: 10, name: '前沿水深', prop: 'depth' },
          // { id: 11, name: '描述', prop: 'description' },
          // { id: 12, name: '泊位长度', prop: 'length' },
          // { id: 13, name: '企业名称', prop: 'orgName' },
          // { id: 14, name: '联系电话', prop: 'telphone' }
        ],
         lift: [
          { id: 1, name: '时间', prop: 'lasttime' ,width:'600px'},
           { id: 8, name: 'mmsi', prop: 'mmsi' },
          { id: 2, name: '船名', prop: 'name' },
          { id: 3, name: 'imo', prop: 'imo' , width:'10px'},
          { id: 4, name: '呼号', prop: 'callsign' , width:'10px'},
          { id: 7, name: '类型', prop: 'shipType' },
          { id: 5, name: '速度', prop: 'sog' , width:'10px'},
          { id: 6, name: '航向', prop: 'cog', width:'10px' }     
        ],
        dialogVisible:false,
        description:'',
      }
    },
    methods: {
      // stify(){
      //      this.service.get('/pier/portShip',{
      //           params:{id:this.tabObj.id}
      //           }).then(res=>{
      //       // console.log("码头统计时间",res)
      //       this.namelist=res.list
      //       console.log("码头统计时间", this.namelist)
      //     }) 
      // },
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
      subFocus(){
        console.log(this.tabObj)
        this.dialogVisible=false
        this.$set(this.tabObj,'isFocus',true)
        this.$emit('isFocus',{description:this.description,focus:false,targetType:10,targetSign:this.tabObj.id})
      },
      focus(){
        // console.log(this.tabObj.isFocus)
        this.dialogVisible=true
        // if(this.tabObj.isFocus===true){
        // }else{
        //   this.$emit('isFocus',{description:this.description,focus:this.tabObj.isFocus,targetType:10,targetSign:this.tabObj.id})
        // }
        // this.$emit('isFocus',this.focus)

      },
      disFocus(){
        this.$set(this.tabObj,'isFocus',false)
        this.$emit('isFocus',{description:this.description,focus:true,targetType:10,targetSign:this.tabObj.id})
      },

    }
  }
</script>
<style scoped  lang="less">
/deep/.el-table__header{
  width: 0;
}
    .main {
        display: grid;
        /*grid-template-rows: 12% 70% 17%;*/
        /*height: 210px;*/
        width: auto;
        /* background: #305071; */
        background: white;
    }

    .title {
        text-align: right;
        /* color: #ffffff; */
        color: black;
        font-size: 14px;
        font-weight: 400;
        width: 70px;
    }

    .value {
        /* color: #e2e2e2; */
        color: black;
        font-size: 14px;
        font-weight: 400;
        /*flex: 1;*/
    }

    .down {
        padding: 5px 15px;
        /*display: grid;*/
        /*grid-template-columns: repeat(2,40.5%);*/
        /*!* grid-template-rows: 50% 50%;*!*/
        /*grid-row-gap: 1%;*/
        /*grid-column-gap: 1%;*/
    }
    .satify_time{
      margin-top:20px;
      border-top:2px solid rgb(39, 112, 212);
      padding: 20px;
    }
    .satify_time  h4{
      color: rgb(39, 112, 212) ;
      margin: 10px;
    }
      .satify_time  span{
        margin-left: 45%;
      }
</style>
