<template>
<div>
  <!--<table class="mailTable" :style="styleObject" v-if="!s_showByRow">
    <tr v-for="index in rowCount" :key="index.id">
      <td class="column">{{tableData[index*2-2].key}}</td>
      <td>{{tableData[index*2-2].value}}</td>
      <td class="column">{{tableData[index*2-1] !== undefined ? tableData[index*2-1].key : ''}}</td>
      <td>{{tableData[index*2-1] !== undefined ? tableData[index*2-1].value : ''}}</td>
    </tr>border-left: solid 3px #3a8ee6;
  </table>v-else-->
  <table class="mailTable" :style="styleObject" >
    <tr v-for="index in rowCount" :key="index.id">
      <td class="column" style="    padding: 0.3em;">{{tableData[index-1].key}}：</td>
      <td style="padding-left: 7px;">{{tableData[index-1].value}}</td>
      <td class="column" style="    padding: 0.3em;">{{tableData[rowCount+index-1] !== undefined ? tableData[rowCount+index-1].key : ''}}：</td>
      <td style="padding-left: 7px;">{{tableData[rowCount+index-1] !== undefined ? tableData[rowCount+index-1].value : ''}}</td>
    </tr>
  </table>
  <!--<table ><tbody><tr><td class="infotd">编号：</td><td class="infotd">11</td><td class="infotd">设备名称：</td><td class="infotd">徐公岛雷达</td></tr><tr><td class="infotd">所在区域：</td><td class="infotd">徐公岛</td><td class="infotd">位置：</td><td class="infotd">浙江省舟山市嵊泗县徐公岛</td></tr><tr><td class="infotd">安装日期：</td><td class="infotd">2019-04-18</td><td class="infotd">经度：</td><td class="infotd">122.28888</td></tr><tr><td class="infotd">纬度：</td><td class="infotd">30.64354</td><td class="infotd">设备型号：</td><td class="infotd">未知</td></tr><tr><td class="infotd">设备直径：</td><td class="infotd">81x174x160(mm)</td><td class="infotd">设备重量(kg)：</td><td class="infotd">1.5</td></tr><tr><td class="infotd">频率范围：</td><td class="infotd">156.025~162.025MHz(全频道)</td><td class="infotd">带宽(kHz)：</td><td class="infotd">25</td></tr><tr><td class="infotd">输出速率：</td><td class="infotd">38400bps</td><td class="infotd">机械接口：</td><td class="infotd">BNC(VHF天线)</td></tr><tr><td class="infotd">供电：</td><td class="infotd">24VDC</td><td class="infotd">数据接口：</td><td class="infotd">RS232/RS422 NMEA-0183，38400bps</td></tr><tr><td class="infotd">探测范围(海里)：</td><td class="infotd">30</td><td class="infotd">接口对接：</td><td class="infotd">1</td></tr></tbody></table>
    -->
</div>

</template>

<script>
/* 

export let AISObj = {
    ID:'编号',
    Jurisdiction:'所在区域',
    InstallationData: '安装日期',
    Latitude: '纬度',
    Diameter: '设备直径',
    Frequency: '频率范围',
    DataOutputSpeed: '输出速率',
    PowerSupply: '供电',
    Coverage: '探测范围(海里)',
    name: '	设备名称',
    Position:'位置',
    Type: '设备型号',
    Weight: '设备重量(kg)',
    Bandwidth: '带宽',
    MechanicalInterface:'机械接口',
    DataInterface: '数据接口',
    urltype: '接口对接'
}

*/
export default {
  data() {
    return {
      styleObject: {},
      s_showByRow: true,
      tableData:[
          {key:'编号',value:'11'},
          {key:'所在区域',value:'徐公岛'},
          {key:'安装日期',value:'2019-04-18'},
          {key:'纬度',value:122.28888},
          {key:'设备直径',value:'81x174x160(mm)'},
          {key:'频率范围',value:'156.025~162.025MHz(全频道)'},
          {key:'输出速率',value:'38400bps'},
          {key:'供电',value:12},
          {key:'设备名称',value:'徐公岛雷达'},
          {key:'位置',value:'浙江省舟山市嵊泗县徐公岛'},
          {key:'精度', value: 	30.64354},
          {key:'设备型号',value:'未知'},
          {key:'设备重量(kg)',value:1.5},
          {key:'带宽',value:25},
          {key:'机械接口',value:'BNC(VHF天线)'},
          {key:'数据接口',value:'RS232/RS422 NMEA-0183，38400bps'},
          {key:'接口对接',value:'BNC(VHF天线)'},
      ]
    };
  },
  props: ['tableData1', 'tableStyle', 'showByRow'],
  computed: {
    rowCount: function() {
      return Math.ceil(this.tableData.length/2);
    },
  },
  watch:{

  },
  created() {
    this.styleObject = this.tableStyle;
    if(this.showByRow !== undefined){
      this.s_showByRow = this.showByRow;
    }
  },
  methods:{
      updata (data,name) {
        console.log(data)
        this.tableData = this.radarTabData(data,name);
      },
      radarTabData(data,name){/**
export let ShipObj = {
    Port: '所在码头',
    Latitude: '纬度',
    used: '是否正常使用',
    Turehead: "船艏向",
    Build: '建造时间',
    Course: "对地航向",
    Width: "船宽度",
    MaximumDraft: '最大吃水',
    Status: "状态",
    Speed: '速度',
    Dest: '目的地',
    Steering: "转向率",
    Callsign: "呼号",
    Imo: "船舶编号",
    Flag: '所属国家',
    Longitude: '经度',
    AISID: "AISID",
    Mmsi: "Mmsi",
    Eta: '预计航行时间',
    Length: "船长度",
    
    updatetime: "最后一次数据更新时间",    pangle:'水平旋转角度',
    tangle:'垂直旋转角度'
    ShipType: "船舶类型",
    Name:'船舶名称'
} 


 */
        console.log('data',data,name)
        let obj ={
          '雷达':['编号','经度','最大探测数量','最远探测距离','水平波宽','工作站尺寸','天线尺寸','安装平台','名称','纬度','当前探测数量','采集精度','起始角度','工作站重量','天线重量','供电'],
          'AIS基站':['编号','经度','设备直径','探测范围','带宽','名称','纬度','设备重量','频率范围','输出速率'],
          '摄像头':['编号','经度','旋转速度','照射角度','水平旋转角度','名称','纬度','最大焦距','分辨率','垂直旋转角度'],
          '船舶':[
            'Mmsi','呼号','IMO','类型','状态','船长度','船宽度','最大吃水',
          '船艏向','航迹向','航速','纬度','经度','目的地','预到时间','更新时间']
        };
        let newarr = []
        obj[name].forEach(e=>{
            data.forEach(de=>{
              if(de.key === e){
                newarr.push({
                  key:e,
                  value:de.value
                })
              }
            })
        })
        return newarr
      }
  }
}
</script>
<style scoped>
　 　.mailTable, .mailTable tr, .mailTable tr td{ 
      border:0px solid #E6EAEE; 
    }
    .mailTable table {
          border-spacing: 0px 1px;  
    }
　　.mailTable{ 
     /* font-size: 12px; color: #71787E;*/
    }
　　.mailTable tr td{ 
      /*border:1px solid #E6EAEE; */
      /*width: 150px; */
      /*height: 35px; */
      color: #222;
      
     /* line-height: 35px; 
      box-sizing: border-box; 
      padding: 0 10px; */
    }
    /*.mailTable  tr:nth-child(odd){background: #0a4b88;}
    .mailTable  tr:nth-child(even){background: #396992;}*/
</style>