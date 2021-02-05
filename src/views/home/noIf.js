// import {
//   addMyMarker,
//   addPolygon, addStationDom,
//   customMarker,
//   mapComopentFun
// } from './mapComponentFactory'
import { bd09towgs84, wgs84ToBD } from '../../utils/coordinateConvert'

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

      // console.log(obj,e)
      // if (obj.name === '锚地' || obj.name === '码头' || e.showed) {
      //   // if (obj.name === '码头泊位') {
      //   //   // console.log(obj)
      //   // }
      //   let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
      //   let myMarker = addMyMarker(bd09Arr[0], bd09Arr[1])
      //   (obj.height ? obj.height : obj.size, obj.width ? obj.width : obj.size, require('../../assets' + obj.img), e.pAngle)
      //   (obj.name)
      //   ((E) => obj.clickFun.bind(this)(e))
      //   myMarker.setZIndex(1)
      //   myMarker.idName = e.id + ',' + e.name
      //   // console.log(this.clickItem.name)
      //   this.map.addOverlay(myMarker)// 将标注添加到地图中
      // }

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

  const actionFunCmyPolyline = function(obj) {

    return (e) => {
      // let arr = []
      // // console.log(e)
      // // if (e.showed) {
      // e.points.forEach(point => {
      //   let bd09Arr = wgs84ToBD(point.lon, point.lat)
      //   arr.push(new BMap.Point(bd09Arr[0], bd09Arr[1]))
      // })
      // let polyline = new BMap.Polyline(arr, { strokeColor: '#d8587c', strokeWeight: 2, strokeOpacity: 1 })   //创建折线
      // polyline.idName = e.id + ',' + e.name
      // polyline.imei = obj.name
      // polyline.addEventListener('click', () => console.log(e))
      // this.map.addOverlay(polyline)          //增加折线
      //
      // let region = []
      // e.region.forEach(point => {
      //   let bd09Arr = wgs84ToBD(point.lon, point.lat)
      //   region.push(new BMap.Point(bd09Arr[0], bd09Arr[1]))
      // })
      // var polygon = new BMap.Polygon(region, {
      //   strokeColor: '#d80d3f',
      //   strokeWeight: 2,
      //   strokeOpacity: 0.8,
      //   fillColor: 'white',
      //   strokeStyle: 'dashed',
      //   fillOpacity: 0.1
      // })
      // polygon.addEventListener('click', () => obj.clickFun.bind(this)(e))
      // polygon.imei = obj.name
      // this.map.addOverlay(polygon)


    }
    // }

  }
  return new Map([
    [/^false_船舶目标$/, function() {

      this.isNormalShip = false
      this.isAbnormalShip = false
      this.shipMin5 = false//五分钟以内
      this.shipMin530 = false//五分钟到三十分钟
      this.shipMin30 = false//三十分钟以上
      this.shipRadar = false//雷达目标
      this.shipAis = false//Ais目标
      this.shipFusion = false//融合目标
      this.ciLayer.clearLayers()

      return {}

    }],
    [/^true_船舶目标$/, function() {

      this.isNormalShip = true
      this.isAbnormalShip = true
      this.shipMin5 = true//五分钟以内
      this.shipMin530 = true//五分钟到三十分钟
      this.shipMin30 = true//三十分钟以上
      this.shipRadar = true//雷达目标
      this.shipAis = true//Ais目标
      this.shipFusion = true//融合目标
      actionFunBmySendShipData.bind(this)()()

      return {}

    }],
    [/^true_正常船只$/, function() {

      this.isNormalShip = true
      actionFunBmySendShipData.bind(this)()()

      return {}

    }],
    [/^true_异常船只$/, function() {

      this.isAbnormalShip = true

      actionFunBmySendShipData.bind(this)()()

      return {}

    }],
    [/^true_5min以内$/, function() {

      this.shipMin5 = true

      actionFunBmySendShipData.bind(this)()()

      return {}

    }],
    [/^true_5-30 min$/, function() {
      this.shipMin530 = true
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^true_30min以上$/, function() {
      this.shipMin30 = true
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
    [/^true_AIS 目标$/, function() {
      this.shipAis = true
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^false_正常船只$/, function() {

      this.isNormalShip = false
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^false_异常船只$/, function() {

      this.isAbnormalShip = false
      actionFunBmySendShipData.bind(this)()()
      return {}
    }],
    [/^false_5min以内$/, function() {
      this.shipMin5 = false
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^false_5-30 min$/, function() {
      this.shipMin530 = false
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^false_30min以上$/, function() {
      this.shipMin30 = false
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
    [/^false_AIS 目标$/, function() {
      this.shipAis = false
      actionFunBmySendShipData.bind(this)()()
      return {}

    }],
    [/^true_资源站$/, function() {
      // return {
      //   url: '/station/findAll',
      //   actionFun: (obj)=>{
      //       console.log()
      //       // let bd09Arr = wgs84ToBD(i.longitude, i.latitude)
      //       // this.map.addOverlay(addStationDom(this.$refs['stationMarker' + i.id][0], i.scope)(bd09Arr[0], bd09Arr[1])('综合观测站'))
      //   }
      // }

    }],
    [/^true_雷达old$/, function() {
      let obj = {
        clickFun: function(e) {
          // console.log(e)
          this.removeMapDom('radarInfoView')
          this.service.post('/radar/view', {
            id: e.id
          }).then(res => {
            // console.log(res)
            this.dialogInfo.radarInfo = res.data
            this.map.addControl(mapComopentFun(this.$refs.radarInfoView))
            this.$refs.pierInfoView.style.top = '10%'
            this.$refs.pierInfoView.style.left = '20%'
          })
        }

      }
      return {
        // url: '/radar/findAll',
        // actionFun: actionFunCustomMarker.bind(this)(obj)
      }

    }],
    [/^true_AIS基站old$/, function() {

      // this.clickItem.name='资源站'

      let obj = {

        size: 15,
        img: '/mapSigns/system3.png',
        clickFun: function(e) {

          // console.log(e)
          this.removeMapDom('aisInfoView')
          this.service.post('/ais/view', {
            id: e.id
          }).then(res => {
            console.log(res)
            this.dialogInfo.aisInfo = res.data.columns
            this.map.addControl(mapComopentFun(this.$refs.aisInfoView))
            this.$refs.pierInfoView.style.top = '10%'
            this.$refs.pierInfoView.style.left = '20%'
          })
        }

      }

      return {
        // url: '/ais/findAll',
        // actionFun: actionFunAmyMarker.bind(this)(obj)
      }

    }],
    [/^true_主动探测类基础设施$/, function() {
      this.stationLayerGroup.addLayer(this.stationLayers)
      this.stationCheck.radar=true
      this.stationCheck.ais=true
      this.stationCheck.camera=true
      return {}
    }],
    [/^false_主动探测类基础设施$/, function() {
      this.stationLayerGroup.removeLayer(this.stationLayers)
      this.radarLayer.clearLayers()
      this.stationCheck.radar=false
      this.stationCheck.ais=false
      this.stationCheck.camera=false
      this.stationLayerGroup.clearLayers()
      return {}
    }],

    [/^false_综合观测站$/, function(){
      this.stationLayerGroup.removeLayer(this.stationLayers)
      return{}
    }],
    [/^true_综合观测站$/, function(){
      this.stationLayerGroup.addLayer(this.stationLayers)
      return{}
    }],
    [/^false_(AIS基站|视频监控站)$/, function() {
    // console.log('12313132213')
      this.stationLayerGroup.eachLayer(item=>{
        if(item.signal===this.clickedMarker.name){
          // item.setOpacity(1)
          // console.log(item)
          this.stationLayerGroup.removeLayer(item)
        }
      })
      return{}
    }],
    [/^false_雷达$/, function(){
      this.radarLayer.clearLayers()
      return{}
    }],
      [/^true_光电$/, function() {

      let obj = {
        size: 15,
        img: '/mapSigns/system4.png',
        clickFun: function(e) {

        }
      }
      return {
        url: '/camera/findAll',
        actionFun: actionFunAmyMarker.bind(this)(obj)
      }
    }],
    [/^true_视频监控站old$/, function() {
      return {}
      // return {
      //     url: '/camera/findAll',
      //     actionFun: actionFunAmyMarker.bind(this)({
      //         height: 15,
      //         width: 9,
      //         img: '/mapSigns/system5.png',
      //         clickFun: function(e) {
      //             console.log(e)
      //             this.removeMapDom('CameraVideoView')
      //             this.service.post('/camera/view', {
      //                 id: e.id
      //             })
      //               .then(res => {
      //                   console.log(res)
      //                   this.cameraInfoData = [res.data]
      //                   this.map.addControl(mapComopentFun(this.$refs.CameraVideoView))
      //               })
      //         }
      //     })
      // }
    }],
    [/^true_海底光缆old$/, function() {
      return {
        url: '/seaLine/findAll',
        actionFun: actionFunCmyPolyline.bind(this)({
          size: 15,
          name: '海底光缆',
          img: '/mapSigns/base6.png',
          clickFun: function(e) {

            console.log(e)
            // this.removeMapDom('towerInfoView')
            this.service.post('/seaLine/view', {
              id: e.id
            }).then(res => {
              // console.log(res)
              this.dialogInfo.seaLineInfo = res.data
              this.map.addControl(mapComopentFun(this.$refs.seaLineInfoView))
              this.$refs.pierInfoView.style.top = '10%'
              this.$refs.pierInfoView.style.left = '20%'
            })

          }
        })
      }
    }],
    [/^false_(海军|陆军海防部队|军分区|海警局|公安局|海事局|海洋与渔业局|军民融合办|海关|边检)/, function() {
      //  console.log(this.clickedMarker.name,groupMap[this.clickedMarker.name])
      // console.log(this.departmentLayers.getLayers(),this['orgLayer'+groupMap[this.clickedMarker.name]].getLayers())
      this.departmentLayers.removeLayer(this['orgLayer' + groupMap[this.clickedMarker.name]])
      // this.departmentLayers.rem
      // this.hideOverlay(this.clickItem.name)
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
        this.departmentLayers.addLayer(this['orgLayer' + i])
      }
      return {}
    }],
    [/^false_海防单位$/, function() {
      this.departmentLayers.clearLayers()
      return {}
    }],
    [/^true_被动保障类基础设施$/, function() {
      this.markerLayersGroup.eachLayer(item=>{
        // console.log(item)
        if(item.signal){
          item.setOpacity(1)
        }
      })
      this.markerLayersGroup.addLayer(this.roadLayer)
      this.markerLayersGroup.addLayer(this.seaLineLayer)
      return {}
    }],
    [/^false_被动保障类基础设施$/, function() {
      this.markerLayersGroup.eachLayer(item=>{
        // console.log(item)
        if(item.signal){
          item.setOpacity(0)
        }else{
          this.markerLayersGroup.removeLayer(this.roadLayer)
        }
      })
      this.markerLayersGroup.removeLayer(this.roadLayer)
      this.markerLayersGroup.removeLayer(this.seaLineLayer)
      return {}
    }],
    [/^true_(停机坪|执勤道路|执勤码头|港区|锚地|码头泊位|海底光缆)/, function() {

      if(this.clickedMarker.name==='执勤道路') this.markerLayersGroup.addLayer(this.roadLayer)
      else if(this.clickedMarker.name==='海底光缆') this.markerLayersGroup.addLayer(this.seaLineLayer)
      else{
        this.markerLayersGroup.eachLayer(item=>{
          if(item.signal===this.clickedMarker.name){
            item.setOpacity(1)
          }
        })
      }
      return {}
    }],
    [/^false_(停机坪|执勤道路|执勤码头|港区|锚地|码头泊位|海底光缆)/, function() {

      if(this.clickedMarker.name==='执勤道路') this.markerLayersGroup.removeLayer(this.roadLayer)
      else if(this.clickedMarker.name==='海底光缆') this.markerLayersGroup.removeLayer(this.seaLineLayer)
      else{
        this.markerLayersGroup.eachLayer(item=>{
          // console.log(item)
          if(item.signal===this.clickedMarker.name){
            item.setOpacity(0)
          }
        })
      }
      return {}
    }]
  ])
}
