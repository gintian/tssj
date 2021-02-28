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
                    <!-- <p>基本信息</p> -->
                    <ul style=" list-style-type:none;overflow: hidden">
                        <li v-for="i in ship"  :key="i.id"><span>{{i.name}}:</span>{{shipTabObj[i.prop]}}
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
      console.log('shipTabObj',this.shipTabObj)
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
        base:{
          'IMO':'null',
          'SHIPTYPE':'shiptype',
          'NAME':'name',
          'FROM':'from',
          'MMSI':'mmsi',
          'CALLSIGN' :'callsign',
          'DEST':'dest',
          'LON' :'lon',
          'LAST_TIME':'last_time',
          'LAT':'lat',
          'STATION':'station',
          'TRAIL':'trail',
          'WIDTH' :'width',
          'LENGTH':'length',
          'LEFT':'left',
          'ETA' :'eta',
          'ETA_STD' :'eta_std',
          'NAVISTAT':'navistat',
          'ROT':'rot',
          'DRAUGH':'draugh',
          'FLAG':'flag',
          'COG' :'cog',
          'DESTCODE':'destcode',
          'HDG':'hdg',
          'SOG':'sdg'
        },
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
