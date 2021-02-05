<template>
    <div class="main">
        <div style="display: grid;grid-template-columns: 88% 12%;background: linear-gradient(rgb(103, 143, 232) 0%, rgb(63, 81, 181) 100%);color: #eee;    padding: 3px;">
            <div style="padding-left: 10px;">{{titleName}} 雷达设备信息</div>
            <div style="padding: 4px;text-align: right;">
                <el-button type="text" @click="remove" style="padding: 0;color: #eee;">X
                </el-button>
            </div>
        </div>
<!--        <div style="padding: 5px;">-->
<!--            <div>-->
<!--                <table style="width: 100%;">-->
<!--                    <tr v-for="index in rowCount" :key="index">-->
<!--                    <td class="title">{{ordArr[index-1].name}}：</td>-->
<!--                    <td class="value">{{tabObj[ordArr[index-1].prop]}}</td>-->

<!--                    <td class="title">{{ordArr[rowCount + index -1].name}}：</td>-->
<!--                    <td class="value">{{tabObj[ordArr[rowCount + index -1].prop]}}</td>-->
<!--                    </tr>-->
<!--                </table>-->
<!--            </div>-->
<!--        </div>-->
        <div id="content">
            <div class="first">
                <div class="item item-1">
                    <div class="title" >设备型号</div>
                    <p>{{tabObj.name}}</p>
                </div>
                <div class="item item-2">
                    <div class="title">经度纬度</div>
                    <p>{{tabObj.longitude}}</p>
                    <p>{{tabObj.latitude}}</p>
                </div>
            </div>
            <div class="second">
                <div class="item item-3">
                    <div class="title">天线尺寸(m)</div>
                    <p>{{tabObj.antennaSize}}</p>
                </div>
<!--                <div class="item item-4">-->
<!--                    <div class="title">距离盲区</div>-->
<!--                    <p>{{tabObj.distanceBlindArea}}</p>-->
<!--                </div>-->
<!--                <div class="item item-5">-->
<!--                    <div class="title">量程(nm)</div>-->
<!--                    <p>{{tabObj.radarRange}}</p>-->
<!--                </div>-->
<!--                <div class="item item-6">-->
<!--                    <div class="title">距离分辨率</div>-->
<!--                    <p>{{tabObj.distanceResolution}}</p>-->
<!--                </div>-->
            </div>
            <div class="third">
                <div class="item item-7">
                    <div class="title">波束宽度</div>
                    <img src="../../assets/table/radar/6.svg" alt="">
                    <p>{{tabObj.horizonWaveWidth}}</p>
                </div>
                <div class="item item-8">
                    <div class="title">探测距离</div>
                    <img src="../../assets/table/radar/7.svg" alt="">
                    <p>{{tabObj.farDetectDistance}}</p>
                </div>
            </div>
            <div class="forth">
                <div class="item item-9">
                    <div class="title">最大扫描数</div>
                    <img src="../../assets/table/radar/8.svg" alt="">
                    <p>{{tabObj.maxDetectTargets}}</p>
                </div>
                <div class="item item-10">
                    <div class="title">波频</div>
                    <img src="../../assets/table/radar/5.svg" alt="">
                    <p>{{tabObj.waveFrequency}}</p>
                </div>
            </div>
<!--            <div class="selectFrom">-->
<!--                <div class="selectItem item-3">-->
<!--                    <div class="title">所属岛屿</div>-->
<!--                    <p>{{tabObj.attributionName}}</p>-->
<!--                </div>-->
<!--                <div class="selectItem item-3">-->
<!--                    <div class="title">运行状态</div>-->
<!--                    <el-select v-model="editRowData.status" placeholder="请选择" prop="status" size="small" :class="{disabled1:disabled}"-->
<!--                               :disabled="disabled">-->
<!--                        <el-option-->
<!--                                v-for="i in statusSelect"-->
<!--                                :key="i.value"-->
<!--                                :label="i.label"-->
<!--                                :value="i.value">-->
<!--                        </el-option>-->
<!--                    </el-select>-->
<!--                </div>-->
<!--                <div class="selectItem item-3">-->
<!--                    <div class="title">是否隐藏</div>-->
<!--                    <el-select v-model="editRowData.showed" placeholder="请选择" prop="status" size="small" :class="{disabled1:disabled}"-->
<!--                               :disabled="disabled">-->
<!--                        <el-option-->
<!--                                v-for="i in isShowSelect"-->
<!--                                :key="i.value"-->
<!--                                :label="i.label"-->
<!--                                :value="i.value">-->
<!--                        </el-option>-->
<!--                    </el-select>-->
<!--                </div>-->
<!--                <div class="selectItem item-3">-->
<!--                    <div class="title">波段</div>-->
<!--                    <el-select v-model="editRowData.waveType" placeholder="请选择" prop="waveType" size="small" :class="{disabled1:disabled}"-->
<!--                               :disabled="disabled">-->
<!--                        <el-option-->
<!--                                v-for="i in urlTypeSelect"-->
<!--                                :key="i.value"-->
<!--                                :label="i.name"-->
<!--                                :value="i.value">-->
<!--                        </el-option>-->
<!--                    </el-select>-->
<!--                </div>-->
<!--            </div>-->
        </div>
        <div class="down">
            <!--<el-button type="primary" @click="info" style="margin-left: 10px;margin-top: 5px;"  size="mini" icon="el-icon-warning-outline">信息</el-button>-->
            <el-button type="primary" @click="info"  style="margin-left: 0px;margin-top: 5px;"  size="mini" icon="el-icon-view">船舶列表</el-button>
<!--            <span style="display: inline-block;padding:0 10px">关注</span>-->
<!--            <el-switch-->
<!--                    v-model="tabObj.isFocus"-->
<!--                    active-color="#13ce66"-->
<!--                    @change="focus"-->
<!--            >-->
<!--            </el-switch>-->
<!--            <el-button type="primary" @click="focus"  style="margin-left: 5px;margin-top: 5px;"  size="mini" icon="el-icon-star-off" v-show="!tabObj.isFocus">关注</el-button>-->
<!--            <el-button type="primary" @click="disFocus"  style="margin-left: 5px;margin-top: 5px;"  size="mini" icon="el-icon-star-on"  v-show="tabObj.isFocus">取关</el-button>-->
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
        // console.log(this.shipTabObj)


    },
    data(){
        return {
            ordArr:[
                { id:0, name:'名称' ,prop:'name'},
                { id:1, name:'所属观测站' ,prop:'attributionName'},
                { id:2, name:'经度' ,prop:'longitude'},
                { id:3, name:'纬度' ,prop:'latitude'},
                { id:3, name:'设备编号' ,prop:'station'},
                { id:3, name:'天线尺寸' ,prop:'antennaSize'},
                { id:3, name:'天线重量' ,prop:'antennaWeight'},
                { id:3, name:'最远探测距离' ,prop:'farDetectDistance'},
                { id:3, name:'水平波宽' ,prop:'horizonWaveWidth'},
                { id:3, name:'安装高度' ,prop:'installationHeight'},
                { id:3, name:'最大探测目标' ,prop:'maxDetectTargets'},
                { id:3, name:'波频' ,prop:'waveFrequency'},
                { id:3, name:'工作站尺寸' ,prop:'workStationSize'},
                { id:3, name:'工作站重量' ,prop:'workStationWeight'},
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
    grid-template-rows: 10% 78% 12%;
    height: auto;
    width: auto;
    background: #305071;

}
.title{
  text-align: right;
  color: #eee;
  font-size: 14px;
  font-weight: 400;

}
.value{
  color: #ffffff;
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
    color: white;
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
            text-align: left ;
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
