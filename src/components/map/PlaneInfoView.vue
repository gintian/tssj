<template>
    <div id="plane">

      <div class="inner">

          <div class="content">

              <ul style=" list-style-type:none;overflow: hidden">
                  <li v-for="i in ordArr"  :key="i.id"><span>{{i.name}}</span> :{{obj[i.prop]}}
                  </li>

              </ul>
          </div>
          <div class="title">
              <i class="el-icon-circle-close" @click="remove"></i>
          </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'PlaneInfoView',
    props: {
      obj: {
        type: Object,
        default: {}
      },
    },
    watch:{
      obj(val){
        console.log('data',val)
        val.Timestamp=new Date(val.Timestamp).toISOString().split('T')[0] + ' ' +  new Date(val.Timestamp).toTimeString().split(' ')[0];
        val.Altitude=parseFloat(val.Altitude).toFixed(4)+ 'm'
        val.Longitude=parseFloat(val.Longitude).toFixed(4)+' °'
        val.Latitude=parseFloat(val.Latitude).toFixed(4)+' °'
        val.Speed=parseFloat(val.Speed).toFixed(4)+' km/h'
        val.Direction=parseFloat(val.Direction).toFixed(4)+' °'
        val.Owner=this.ownerArr[val.Owner]
        val.Device=this.deviceArr[val.Device]
        for(let i of this.ordArr){
          if(val[i.prop]===undefined||val[i.prop]===''||val[i.prop]==='null'){
            // console.log(i,val[i.prop])
            val[i.prop]=' —'
          }
        }
      }
    },
    mounted() {
      console.log(this.obj)
      // this.obj.Timestamp=new Date(this.obj.Timestamp).toISOString().split('T')[0] + ' ' +  new Date(this.obj.Timestamp).toTimeString().split(' ')[0];
      // this.obj.Altitude=parseFloat(this.obj.Altitude).toFixed(4)+ 'm'
      // this.obj.Longitude=parseFloat(this.obj.Longitude).toFixed(4)+' °'
      // this.obj.Latitude=parseFloat(this.obj.Latitude).toFixed(4)+' °'
      // this.obj.Speed=parseFloat(this.obj.Speed).toFixed(4)+' km/h'
      // this.obj.Direction=parseFloat(this.obj.Direction).toFixed(4)+' °'
      // this.obj.Owner=this.ownerArr[this.obj.Owner]
      // this.obj.Device=this.deviceArr[this.obj.Device]
      // for(let i of this.ordArr){
      //   if(this.obj[i.prop]===undefined||this.obj[i.prop]===''||this.obj[i.prop]==='null'){
      //     console.log(i,this.obj[i.prop])
      //     this.obj[i.prop]=' —'
      //   }
      // }
    },
    data() {
      return {
        ordArr: [
          { id: 0, name: '飞机编号', prop: 'ID' },
          { id: 1, name: '高度 米', prop: 'Altitude' },
          { id: 2, name: '经度', prop: 'Longitude' },
          { id: 3, name: '纬度', prop: 'Latitude' },
          { id: 4, name: '速度 km/小时', prop: 'Speed' },
          { id: 5, name: '航向', prop: 'Direction' },
          { id: 6, name: '数据来源', prop: 'Device' },
          { id: 7, name: '飞行器', prop: 'Owner' },
          { id: 8, name: '时戳', prop: 'Timestamp' },
          { id: 9, name: '定位状态', prop: 'MsgType' }
        ],
        ownerArr:{
          0:'通用航空',
          1:'运输航空',
          2:'军用航空',
        },
        deviceArr:{
          0:'GPRS 追踪器',
          1:'ADS-B',
          2:'数传电台',
          3:'北斗短报文通信',
          4:'GPRS 通信',
          5:'SkyConnector 数据',
        }

      }
    },

    methods:{
      remove() {
        this.$emit('remove')
      },
    }
  }
</script>

<style scoped lang="less">
    #plane {
        background: url("../../assets/mapSigns/plane/planeInfoBack.png") no-repeat;
        width: 314px;
        height: 234px;
        color: white;
        /*padding: 20px;*/
        .inner{
            width: 80%;
            /*height: 80%;*/
            margin: 0 auto;
            display: grid;
            grid-template-columns: 90% 10%;
            .title{
                font-size: 20px;
                margin-top: 10px;
            }
            .content{
                font-size: 14px;
                ul{
                    margin-left: 10px;
                    padding: 0;

                }
            }
        }

    }
</style>
