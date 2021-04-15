import {
  addMyMarker,
  addPolygon, addStationDom,
  customMarker,
  mapComopentFun
} from './mapComponentFactory'
import { bd09towgs84, wgs84ToBD } from '../../utils/coordinateConvert'

// export function exportMethod(data) {
//   axios({
//     method: data.method,
//     url: `${data.url}${data.params ? '?' + data.params : ''}`,
//     responseType: 'blob'
//   }).then((res) => {
//     const link = document.createElement('a')
//     let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
//     link.style.display = 'none'
//     link.href = URL.createObjectURL(blob)
//
//     // link.download = res.headers['content-disposition'] //下载后文件名
//     link.download = data.fileName //下载的文件名
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }).catch(error => {
//     this.$Notice.error({
//       title: '错误',
//       desc: '网络连接错误'
//     })
//     console.log(error)
//   })
// }

export let actions
actions = () => {
  const groupMap={
    '海军':1,
    '陆军海防部队':2,
    '军分区':3,
    '海警局':4,
    '公安局':5,
    '海事局':6,
    '海洋与渔业局':7,
    '军民融合办':8,
    '海关':9,
    '边检':10,
  }
 
  const actionFunAmyMarker = function(obj) {

    return (e) => {
      // if(e.showed){
      let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
      let marker= this.createMarker(bd09Arr[1],bd09Arr[0],obj.size,obj.size,require('../../assets' + obj.img))(obj.name)(()=>{})
      marker.addTo(this.markerLayersGroup)
        // this.markerLayers.add
        // marker.addTo(this.markerLayers)
      // }
    }
  }
  const actionMarkerCluster = function(obj) {
    return (e) => {
      let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
      let myMarker = addMyMarker(bd09Arr[0], bd09Arr[1])
      (obj.height ? obj.height : obj.size, obj.width ? obj.width : obj.size, require('../../assets' + obj.img), e.pAngle)
      (this.clickItem.name, obj.name)
      ((E) => obj.clickFun.bind(this)(e))
      myMarker.setZIndex(1)
      myMarker.idName = e.id + ',' + e.name
      myMarker.imei = '通信铁塔'

      return myMarker
    }
  }

  const actionFunBmySendShipData = function() /* 请求当前 区域 数据 */ {
    return () => {
      if (this.map.getZoom() < this.maxMapZoom) {
        // if (this.stationCheck.ship || this.stationCheck.aShip) {
        //   this.addShipPointCollection(this.map.getSize(), this.stationId)
        // } else {
          this.addShipPointCollection(this.map.getSize())
        // }
      } else {
        this.ciLayer.clearLayers()
        this.loadAreaShip(1)
      }
    }
  }

 
  return new Map([
   
    [/^false_船舶类型$/, function() {
      this.bulkShip = false  //散货船
      this.containerShip = false  //集装箱船
      this.tanker = false  //油轮
      this.tug = false//拖轮
      this.fishingBoat = false//渔船
      this.passengerShip = false//客船
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^true_船舶类型$/, function() {
      this.bulkShip = true  //散货船
      this.containerShip = true  //集装箱船
      this.tanker = true  //油轮
      this.tug = true//拖轮
      this.fishingBoat = true//渔船
      this.passengerShip = true//客船
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^false_出现时间$/, function() {
      this.shipMin5 = false//五分钟以内
      this.shipMin10 = false//五分钟到十分钟
      this.shipMin15 = false//十分钟到十五分钟
      this.shipMin20 = false//十五分钟到二十分钟
      this.shipMin24 = false//二十分钟到二十四分钟
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^true_出现时间$/, function() {
      this.shipMin5 = true//五分钟以内
      this.shipMin10 = true//五分钟到十分钟
      this.shipMin15 = true//十分钟到十五分钟
      this.shipMin20 = true//十五分钟到二十分钟
      this.shipMin24 = true//二十分钟到二十四分钟
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^false_区域$/, function() {
      this.area1 = true //区域一
      this.area2 = true //区域二
      this.area3 = true //区域三
      this.area4 = true //区域四
      this.area5 = true //区域五
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^true_区域$/, function() {
      this.area1 = true //区域一
      this.area2 = true //区域二
      this.area3 = true //区域三
      this.area4 = true //区域四
      this.area5 = true //区域五
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^true_散货船$/, function() {
      this.bulkShip = true
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^true_集装箱船$/, function() {
      this.containerShip = true
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^true_油轮$/, function() {
      this.tanker = true
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^true_拖轮$/, function() {
      this.tug = true
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^true_渔船$/, function() {
      this.fishingBoat = true
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^true_客船$/, function() {
      this.passengerShip = true
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^true_5min以内$/, function() {
      this.shipMin5 = true
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^true_5-10 min$/, function() {
      this.shipMin10 = true
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^true_10-15 min$/, function() {
      this.shipMin15 = true
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^true_15-20 min$/, function() {
      this.shipMin20 = true
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^true_20-24 min$/, function() {
      this.shipMin24 = true
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
   
    [/^true_区域一$/, function() {
      this.area1 = true
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^true_区域二$/, function() {
      this.area2 = true
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^true_区域三$/, function() {
      this.area3 = true
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^true_区域四$/, function() {
      this.area4 = true
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^true_区域五$/, function() {
      this.area5 = true
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^false_散货船$/, function() {
      this.bulkShip = false
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^false_集装箱船$/, function() {
      this.containerShip = false
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^false_油轮$/, function() {
      this.tanker = false
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^false_拖轮$/, function() {
      this.tug = false
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^false_渔船$/, function() {
      this.fishingBoat = false
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^false_客船$/, function() {
      this.passengerShip = false
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^false_5min以内$/, function() {
      this.shipMin5 = false
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^false_5-10 min$/, function() {
      this.shipMin10 = false
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    
    [/^false_10-15 min$/, function() {
      this.shipMin15 = false
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    
    [/^false_15-20 min$/, function() {
      this.shipMin20 = false
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^false_20-24 min$/, function() {
      this.shipMin24 = false
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^false_区域一$/, function() {
      this.area1 = false
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^false_区域二$/, function() {
      this.area2 = false
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^false_区域三$/, function() {
      this.area3 = false
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^false_区域四$/, function() {
      this.area4 = false
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^false_区域五$/, function() {
      this.area5 = false
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    
   

    [/^false_雷达$/, function(){
      // this.radarLayer.clearLayers()
      return{}
    }],
    [/^true_雷达$/, function(){
      // this.radarLayer.clearLayers()
      return{}
    }],
     
    
   
    [/^true_AIS目标$/, function() {
      this.shipAis = true
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^true_雷达目标$/, function() {
      this.shipRadar = true
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^true_融合目标$/, function() {
      this.shipFusion = true
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^true_异常目标$/, function() {
      this.isNormalShip = true
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
   
    [/^false_AIS目标$/, function() {
      this.shipAis = false
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^false_雷达目标$/, function() {
      this.shipRadar = false
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^false_融合目标$/, function() {
      this.shipFusion = false
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^false_异常目标$/, function() {
      this.isNormalShip = false
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],

    [/^true_铁塔$/, function() {
      console.log("MarkerClusterGroup",this.MarkerClusterGroup)
      // this.MarkerClusterGroup.addLayer(marker);
      this.MarkerClusterGroup.eachLayer(item=>{
        if(item.signal===this.clickedMarker.name){
          item.setOpacity(1)
        }
      })
      return {}
    }],
   
    [/^false_铁塔$/, function() {
      // this.MarkerClusterGroup.removeLayer(marker);
      this.MarkerClusterGroup.eachLayer(item=>{
        if(item.signal===this.clickedMarker.name){
          item.setOpacity(0)
        }
      })
      return {}
    }],
    [/^true_海底光缆$/, function() {
      console.log("seaLineLayer",this.seaLineLayer)
      // this.MarkerClusterGroup.addLayer(marker);
      this.seaLineLayer.eachLayer(item=>{
        if(item.signal===this.clickedMarker.name){
          item.setOpacity(1)
        }
      })
      return {}
    }],
   
    [/^false_海底光缆$/, function() {
      // this.MarkerClusterGroup.removeLayer(marker);
      this.seaLineLayer.eachLayer(item=>{
        if(item.signal===this.clickedMarker.name){
          item.setOpacity(0)
        }
      })
      return {}
    }],
    [/^true_(锚地|码头|ais|摄像头|泊位)$/, function() {
      console.log("markerLayersGroup",this.markerLayersGroup)
      this.markerLayersGroup.eachLayer(item=>{
        if(item.signal===this.clickedMarker.name){
          item.setOpacity(1)
        }
      })
      return {}
    }],
  
 
    [/^false_(锚地|码头|ais|摄像头|泊位)$/, function() {
      this.markerLayersGroup.eachLayer(item=>{
        if(item.signal===this.clickedMarker.name){
          item.setOpacity(0)
        }
      })
      return {}
    }],
  
    [/^false_(海军|陆军海防部队|军分区|海警局|公安局|海事局|海洋与渔业局|军民融合办|海关|边检)/, function() {
      //  console.log(this.clickedMarker.name,groupMap[this.clickedMarker.name])
      // console.log(this.departmentLayers.getLayers(),this['orgLayer'+groupMap[this.clickedMarker.name]].getLayers())
      this.departmentLayers.removeLayer(this['orgLayer' + groupMap[this.clickedMarker.name]])
      return {}
    }],
    [/^true_(海军|陆军海防部队|军分区|海警局|公安局|海事局|海洋与渔业局|军民融合办|海关|边检)/, function() {
      // this.showOverlay(this.clickItem.name)
      // console.log(this.clickedMarker.name)
      this.departmentLayers.addLayer(this['orgLayer' + groupMap[this.clickedMarker.name]])
      return {}
    }],
    [/^true_海防单位$/, function() {
      for (let i = 1; i < 11; i++) {
        // console.log(this['orgLayer'+i])
        // this.departmentLayers.addLayer(this['orgLayer' + i])
        this.departmentLayers.addLayer(i)
      }
      return {}
    }],
    [/^false_海防单位$/, function() {
      this.departmentLayers.clearLayers()
      return {}
    }],
    
   
  ])
}
