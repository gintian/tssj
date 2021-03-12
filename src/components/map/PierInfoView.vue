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
        <div class="down">  
           <!-- <el-button type="primary" @click="shipDetail" style="margin-left: 10px;margin-top: 5px;"  size="mini" icon="el-icon-warning-outline">船舶信息</el-button> -->
           <!-- <el-button type="primary" @click="info"  style="margin-left: 0px;margin-top: 5px;"  size="mini" icon="el-icon-view">船舶列表</el-button>         -->
            <!-- <el-button type="primary" @click="focus"  style="margin-left: 5px;margin-top: 5px;"  size="mini" icon="el-icon-star-off" v-show="!tabObj.isFocus">关注</el-button>
            <el-button type="primary" @click="disFocus"  style="margin-left: 5px;margin-top: 5px;"  size="mini" icon="el-icon-star-on"  v-show="tabObj.isFocus">取关</el-button> -->
        </div>
        <div class="satify_time">
          <h4>统计时间：</h4>
          <span>暂无数据</span>
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
    components: {
      ShipTab
    },
    props: {
      tabObj: {
        type: Object,
        default: {}
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
        // this.tabObj=val
        // this.tabObj.showed=false
        console.log('码头TabObj',val)
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
        //urltypeArr
        dialogVisible:false,
        description:'',
      }
    },
    methods: {
      // stify(){
      //      this.service.get('/pier/portShip',{
      //           params:{id:this.tabObj.id}
      //           }).then(res=>{
      //       console.log("码头统计时间",res)
      //       // this.namelist=res.result
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
<style scoped>
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
