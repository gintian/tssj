<template>
    <div class="main">
        <div style="display: grid;grid-template-columns: 88% 12%;background: #2770D4;color: #eee;    padding: 3px;">
            <div style="padding-left: 10px;">船舶详细信息</div>
            <div style="padding-right: 5px;text-align: right;">
                <el-button type="text" @click="remove" style="padding: 0;color: #eee;">X
                </el-button>
            </div>
        </div>
        <div style="overflow: auto;padding: 5px;max-height: 400px;">
            <!-- <div v-if="Object.keys(shipTabObj).length<2" style="height: 150px;display: grid;place-items: center">暂无
            </div> -->
            <div >
                <div>
                    <p>基本信息</p>
                    <ul style=" list-style-type:none;overflow: hidden">
                        <li v-for="i in ship"  :key="i.id"><span>{{i.name}}:</span>{{shipTabObj[i.prop]}}
                        </li>
                    </ul>
                </div>

              <div style="margin-top: 10px">
                    <p>通讯信息</p>
                    <el-table
                            :data="shipTabObj.archivesCommunicationList"
                            border
                            style="width: 100%">
                        <el-table-column
                                v-for="(i,index) in communication"
                                :key="index"
                                :prop="i.prop"
                                :label="i.name"
                                width="60"
                        >
                        </el-table-column>

                    </el-table>
                </div>
                <div  style="margin-top: 10px">
                    <p>消耗信息</p>
                    <ul style=" list-style-type:none;overflow: hidden">
                        <li v-for="i in consumption" style="width: 40%;float: left;" :key="i.id"><span>{{i.name}}</span>:{{shipTabObj[i.prop]}}
                        </li>
                    </ul>
                </div>
                <div  style="margin-top: 10px">
                    <p>船员与乘客</p>
                    <ul style=" list-style-type:none;overflow: hidden">
                        <li v-for="i in crew" style="width: 40%;float: left;" :key="i.id"><span>{{i.name}}</span>:{{shipTabObj[i.prop]}}
                        </li>
                    </ul>
                </div>
                <div  style="margin-top: 10px">
                    <p>船舶尺寸</p>
                    <ul style=" list-style-type:none;overflow: hidden">
                        <li v-for="i in dimension" style="width: 40%;float: left;" :key="i.id"><span>{{i.name}}</span>:{{shipTabObj[i.prop]}}
                        </li>
                    </ul>
                </div>
                <div  style="margin-top: 10px">
                    <p>干货信息</p>
                    <ul style=" list-style-type:none;overflow: hidden">
                        <li v-for="i in dry" style="width: 40%;float: left;" :key="i.id"><span>{{i.name}}</span>:{{shipTabObj[i.prop]}}
                        </li>
                    </ul>
                </div>
                <div  style="margin-top: 10px">
                    <p>船舶引擎</p>
                    <el-table
                            :data="shipTabObj.archivesEngineList"
                            border
                            style="width: 100%">
                        <el-table-column
                                v-for="(i,index) in engine"
                                :key="index"
                                :prop="i.prop"
                                :label="i.name"
                                width="60"  >
                        </el-table-column>
                    </el-table>
                </div>
                <div  style="margin-top: 10px">
                    <p>船体</p>
                    <ul style=" list-style-type:none;overflow: hidden">
                        <li v-for="i in hull" style="width: 40%;float: left;" :key="i.id"><span>{{i.name}}</span>:{{shipTabObj[i.prop]}}
                        </li>
                    </ul>
                </div>
                <div  style="margin-top: 10px">
                    <p>起重设备</p>
                    <el-table
                            :data="shipTabObj.archivesLiftList"
                            border
                            style="width: 100%">
                        <el-table-column
                                v-for="(i,index) in lift"
                                :key="index"
                                :prop="i.prop"
                                :label="i.name"
                                width="60"
                        >
                        </el-table-column>
                    </el-table>
                </div>
                <div  style="margin-top: 10px">
                    <p>液货信息</p>
                    <ul style=" list-style-type:none;overflow: hidden">
                        <li v-for="i in liquid" style="width: 40%;float: left;" :key="i.id"><span>{{i.name}}</span>:{{shipTabObj[i.prop]}}
                        </li>
                    </ul>
                </div>
                <div  style="margin-top: 10px">
                    <p>机械设备</p>
                    <ul style=" list-style-type:none;overflow: hidden">
                        <li v-for="i in machinery" style="width: 40%;float: left;" :key="i.id"><span>{{i.name}}</span>:{{shipTabObj[i.prop]}}
                        </li>
                    </ul>
                </div>   
            </div>
        </div>

    </div>
</template>
<script>
  export default {
    props: {
      shipTabObj: {
        type: Object,
        default: {}
      }
    },

    mounted() {
      // console.log('shipTabObj',this.shipTabObj)
    },
    watch: {
      shipTabObj: function(val) {
        console.log('数据变化',val)
      }
    },
    updated() {
      // console.log('shipTabObj', this.shipTabObj, Object.keys(this.shipTabObj).length)
    },
    data() {
      return {
        ship: [
          { id: 1, name: 'IMO', prop: 'imo' },
          { id: 2, name: '船舶类型', prop: 'shipType' },
          { id: 3, name: '船舶名称', prop: 'name' },
          { id: 4, name: '来源', prop: 'FROM'},
          { id: 5, name: '船舶呼号', prop: 'callsign' },
          { id: 6, name: '航迹向', prop: 'cog' },
          { id: 7, name: '目的地', prop: 'DEST' },
          { id: 8, name: '目的地代码', prop: 'destcode' },
          { id: 9, name: '纬度', prop: 'lon' },
          { id: 10, name: '国籍', prop: 'flag' },
          { id: 11, name: '更新时间', prop: 'lasttime' },
          { id: 12, name: '经度', prop: 'lat' },
          { id: 13, name: '吃水', prop: 'draugh' },
          { id: 14, name: '监测的ais设备编号', prop: 'station' },
          { id: 15, name: '尾距', prop: 'trail' },
          { id: 16, name: '船舶宽度', prop: 'width' },
          { id: 17, name: '船舶长度', prop: 'length' },
           { id: 18, name: '转向率', prop: 'rot' },
          { id: 19, name: '船舶航行状态', prop: 'navistat' },
           { id: 20, name: '船首向', prop: 'hog' },
          { id: 21, name: '速度', prop: 'sog' },
           { id: 22, name: '预计到达时间', prop: 'ata' },
          { id: 23, name: '标准化预计到达时间', prop: 'eta_std' },
           { id: 24, name: '左舷距', prop: 'left' },
        ],
         communication: [
          { id: 1, name: '终端类型', prop: 'TERMINAL_TYPE' },
          { id: 2, name: '船舶类型', prop: 'SHIPTYPE_KEY' },
          { id: 3, name: '号码', prop: 'TERMINAL_NO' },
          { id: 4, name: '卫星系统类型', prop: 'SYSTEM_TYPE' },
          { id: 5, name: '卫星使用类型', prop: 'USE_TYPE_CD' },
          { id: 6, name: '备注', prop: 'DESC' },
          { id: 7, name: '来源', prop: 'SUPPLIER' },
          { id: 8, name: '更新时间', prop: 'LAST_UPD_DT' }

        ],
        consumption: [
          { id: 1, name: '空载IFO耗油量', prop: 'IFOBALLAST' },
          { id: 2, name: '满载IFO耗油量', prop: 'IFOLOADED' },
          { id: 3, name: '港口IFO耗油量', prop: 'IFOPORT' },
          { id: 4, name: '航行MDO耗油量', prop: 'MDOSTEAM' },
          { id: 5, name: '港口MDO耗油量', prop: 'MDOPORT' },
          { id: 6, name: 'FWCapacity', prop: 'FWCAPACITY' },
          { id: 7, name: 'DOCapacity', prop: 'DOCAPACITY' },
          { id: 8, name: 'FOCapacity', prop: 'FOCAPACITY' },
          { id: 9, name: 'WBCapacity', prop: 'WBCAPACITY' },
          { id: 10, name: 'AUX', prop: 'AUX' }
        ],
        crew: [
          { id: 1, name: '最少船员数', prop: 'MIMCREW' },
          { id: 2, name: '舱内乘客数', prop: 'PSGBERTHED' },
          { id: 3, name: '甲板乘客数', prop: 'PSGDECK' },
          { id: 4, name: '总乘客数', prop: 'PSGTOTAL' }
        ],
        dimension: [
          { id: 1, name: '船体总长', prop: 'LOA' },
          { id: 2, name: '船舶型长', prop: 'LBP' },
          { id: 3, name: '最大宽度', prop: 'MAXBEAM' },
          { id: 4, name: '船舶型宽', prop: 'BEAMMOULDED' },
          { id: 5, name: '高度', prop: 'HEIGHT' },
          { id: 6, name: '深度(型深)', prop: 'DEPTH' },
          { id: 7, name: '吃水', prop: 'DRAFT' },
          { id: 8, name: 'Freeborad', prop: 'FREEBORAD' },
          { id: 9, name: '备注', prop: 'REMARK' }
        ],
        dry: [
          { id: 1, name: '捆包货物容量', prop: 'BALE' },
          { id: 2, name: '谷物容量', prop: 'GRAIN' },
          { id: 3, name: '集装箱容量', prop: 'TEU' },
          { id: 4, name: '仓内轻便梯', prop: 'RAMPSINTERNAL' },
          { id: 5, name: '货仓数量情况', prop: 'HOLDS' },
          { id: 6, name: 'DryDes', prop: 'DRYDES' },
          { id: 7, name: '最大舱盖尺寸', prop: 'HATCHESSIZEMAX' },
          { id: 8, name: '舱盖情况', prop: 'HATCHES' },
          { id: 9, name: '冷藏箱TEU', prop: 'REEFER_TEU' },
          { id: 10, name: '冷藏箱CAPACITY', prop: 'REEFER_CAPACITY' }
        ],
        engine: [
          { id: 1, name: '序号', prop: 'SEQNO' },
          { id: 2, name: '制造商名称', prop: 'BUILDER' },
          { id: 3, name: '缸数', prop: 'CYLINDER' },
          { id: 4, name: '主机型号', prop: 'MODEL' },
          { id: 5, name: '引擎数量', prop: 'NUMBER' },
          { id: 6, name: '转速', prop: 'RPM' },
          { id: 7, name: '冲程', prop: 'STROKE' },
          { id: 8, name: '缸径', prop: 'BORE' },
          { id: 9, name: '引擎功率千瓦', prop: 'POWERKW' },
          { id: 10, name: '引擎功率马力', prop: 'POWERHP' }

        ],
        hull: [
          { id: 1, name: 'HullNo', prop: 'HULLNO' },
          { id: 2, name: '材料', prop: 'MATERAL' },
          { id: 3, name: '材料类型', prop: 'MATERIALTYPE' },
          { id: 4, name: '材料描述', prop: 'MATERIALDES' },
          { id: 5, name: 'BulkHeads', prop: 'BULKHEADS' },
          { id: 6, name: 'HullDes', prop: 'HULLDES' },
          { id: 7, name: '球形艏', prop: 'BULBOWSBOW' },
          { id: 8, name: '系住拉力', prop: 'BOLLARDPULL' },
          { id: 9, name: '甲板数量', prop: 'DECKS' },
          { id: 10, name: '双层船底', prop: 'DBLBOTTOM' },
          { id: 11, name: '双层甲板', prop: 'DBLDECK' },
          { id: 12, name: '双层船舷', prop: 'DBLSIDESKINS' },
          { id: 13, name: '双层船壳', prop: 'DBLHULL' },
          { id: 14, name: '冰体加强', prop: 'ICESTRENGTHENED' },
          { id: 15, name: '重货加强', prop: 'HEAVYCARGOSTRENGTHENED' }

        ],
        lift: [
          { id: 1, name: '序号', prop: 'SEQ' },
          { id: 2, name: '材料', prop: 'LIFTTYPE' },
          { id: 3, name: '材料类型', prop: 'NAME' },
          { id: 4, name: '材料描述', prop: 'BUILDER' },
          { id: 5, name: 'BulkHeads', prop: 'NUMBER' },
          { id: 6, name: 'HullDes', prop: 'CAPACITY' },
          { id: 7, name: '球形艏', prop: 'REMARK' }

        ],
        liquid: [
          { id: 1, name: '液体容量', prop: 'LIQUID' },
          { id: 2, name: '制惰性气体发生系统造商名称', prop: 'IGS' },
          { id: 3, name: '原油洗仓系统', prop: 'COW' },
          { id: 4, name: '泵数量排量说明', prop: 'PUMP' },
          { id: 5, name: '泵总排量', prop: 'PUMPCAPACITY' },
          { id: 6, name: 'LiquidDes', prop: 'LIQUIDDES' },
          { id: 7, name: '液仓情况', prop: 'TANKS' }

        ],
        machinery: [
          { id: 1, name: '锅炉', prop: 'BOILER' },
          { id: 2, name: '发电机', prop: 'GENERATOR' },
          { id: 3, name: '电台', prop: 'RADIO' },
          { id: 4, name: '导航', prop: 'NAVI' },
          { id: 5, name: '救援', prop: 'RESCUE' },
          { id: 6, name: '系泊', prop: 'MOORING' },
          { id: 7, name: '螺旋桨', prop: 'PROPELLER' },
          { id: 8, name: '制冷', prop: 'REFRIGERATING' },
          { id: 9, name: 'Other', prop: 'OTHER' }
        ],
        dialogVisible: false,
        description: '',
        formShip:{},
      }
    },
    methods: {
      remove() {
        this.$emit('remove')
      }
    }
  }
</script>
<style scoped lang="less">
    .main {
        display: grid;
        /*grid-template-rows: 11% 74% 15%;*/
        width: 500px;
        max-width: 600px;
        background: white;
        // background: #eeeeee;
        color: black;
        // opacity: .9;
    }

    p {
        margin: 0;
        padding: 0;
    }

    ul {
        font-size: 13px;
        margin: 0;
        display: grid;
        grid-template-columns: 47% 47%;
        /*grid-column-gap: 5%;*/
        padding: 0 0 0 5%;
    }

    li{
        text-align: left;
    }
    li span {    
    margin-right: 20px;
    }

    li:nth-child(2n) {
        /*float: left;*/
        margin-left: 10%;
    }
    /deep/.cell{
        color: white;
    }

    /deep/.cell{
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
    
</style>
