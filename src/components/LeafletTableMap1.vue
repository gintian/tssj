<template>
    <div>
        <div id="allmap1" ref="allmap1"></div>
        <p style="display: none">{{mapData}}</p>
    </div>
</template>

<script>
  import { wgs84ToBD } from '../utils/coordinateConvert'
  var esri = require('esri-leaflet')
  export default {
    name: 'LeafletTableMap',
    props: {
      mapData: {
        type: Array,
        default: () => []
      },
      // mapData:{
      //         type:Array,
      //         default:()=>[]
      //     },
      // trailData: {
      //   type: Object,
      //   default: () => {
      //     return {};
      //   }
      // },
      markerType: {
        type: String,
        default: ''
      },
      option: {
        type: Object,
        default: { strokeColor: 'blue ', strokeWeight: 2, strokeOpacity: 0.5 }
      }
    },
    data() {
      return {
        map: null,
        travelData: [],
        markData: {},
        dialogInfo: {
          anchorage: {}
        }
      }
    },
    watch: {
      mapData(val) {
        console.log('mapData', val)
        if (this.markerType === 'point') {
          this.map.setView([val[0].latitude, val[0].longitude], 13)
          this.createMarker(val[0].latitude, val[0].longitude, 25, 41,'https://cdn.bootcdn.net/ajax/libs/leaflet/1.7.1/images/marker-icon.png')('')(() => {
          }).addTo(this.map)
        } else if (this.markerType === 'polyline') {

          let pos = []
          val.forEach(e => {
            pos.push([e.lat, e.lon])
            L.circle([e.lat, e.lon], {
              radius: 50,
              color: '#28ea37',//边框颜色
              opacity: 0.8,
              fillColor: '#28ea37', //填充颜色
              fillOpacity: 0.4,
            }).addTo(this.map);
          })
          var polyline = L.polyline(pos, { color: 'red' }).addTo(this.map)
          this.map.fitBounds(polyline.getBounds());
        } else if(this.markerType === 'ship'){
          this.map.setView([val[0].latitude, val[0].longitude], 13)
          this.createMarker(val[0].latitude, val[0].longitude, 13, 22,require('../assets/mapSigns/02.png'),val[0].course)('')(() => {
          }).addTo(this.map)
        }
      }
    },
    //  computed:{
    //      msg(){
    //        return this.mapData;
    //      }
    //    },
    mounted() {
      this.mapInit()
      if (this.markerType === 'point') {
        this.map.setView([this.mapData[0].latitude, this.mapData[0].longitude], 13)
        this.createMarker(this.mapData[0].latitude, this.mapData[0].longitude, 25, 41,'https://cdn.bootcdn.net/ajax/libs/leaflet/1.7.1/images/marker-icon.png')('')(() => {
        }).addTo(this.map)
      } else if (this.markerType === 'polyline') {
        let pos = []
        this.mapData.forEach(e => {
          pos.push([e.lat, e.lon])
          L.circle([e.lat, e.lon], {
            radius: 50,
            color: '#28ea37',//边框颜色
            opacity: 0.8,
            fillColor: '#28ea37', //填充颜色
            fillOpacity: 0.4,
          }).addTo(this.map);
        })
        var polyline = L.polyline(pos, { color: 'red' }).addTo(this.map)
        this.map.fitBounds(polyline.getBounds());
      }
      else if(this.markerType === 'ship'){
        this.map.setView([this.mapData[0].latitude, this.mapData[0].longitude], 13)
        this.createMarker(this.mapData[0].latitude, this.mapData[0].longitude, 13, 22,require('../assets/mapSigns/ais.png'),this.mapData[0].course)('')(() => {
        }).addTo(this.map)
      }
    },
    updated() {
    },
    methods: {
      // 创建多边形区域
      createPolygon(type, waters, signal, style) {
        let map = {
          'circle': (wgs84ToBD) => {
            let bd09Arr = wgs84ToBD(waters.centerx, waters.centery)
            let circle = L.circle([bd09Arr[1], bd09Arr[0]], {
              //圆半径
              radius: waters.radius,
              ...style
            })
            circle.signal = signal
            return circle
          },
          'polygon': (wgs84ToBD) => {
            let points = []
            waters.points.forEach(e => {
              let bd09Arr = wgs84ToBD(e.lon, e.lat)
              points.push([bd09Arr[1], bd09Arr[0]])
            })
            let polygon = L.polygon(points, {
              ...style
            })
            polygon.signal = signal
            return polygon
          },
          'rectangle': (wgs84ToBD) => {
            let points = []
            let p1 = wgs84ToBD(waters.lon1, waters.lat1)
            let p2 = wgs84ToBD(waters.lon2, waters.lat2)
            var polygon = L.polygon([[p1[1], p1[0]], [p2[1], p1[0]], [p2[1], p2[0]], [p1[1], p2[0]]], {
              ...style
            })
            polygon.signal = signal
            return polygon
          }
        }
        return (wgs84ToBD) => {
          return map[type](wgs84ToBD)
        }
      },
      createMarker(lat, lng, width, height, img, Angle = 0) {
        //标记样式
        var icon = L.icon({
          //图标地址
          iconUrl: img,
          //图标大小
          iconSize: [width, height]
        })
        //标记
        var Marker = L.marker([lat, lng], {
          //添加图标
          icon: icon,
          rotationAngle: Angle
        })
        var clicked = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: require('../assets/mapicon/aim.png'),
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          })
        })
        return signal => {
          Marker.signal = signal
          return fun => {
            Marker.on('click', (val) => {
              //  Marker.signal=clicked;
              this.handleMapMarerClick(val)

            })

            return Marker
          }
        }
      },

      handleMapMarerClick(val) {
        console.log('item', val)
        let c = L.circle(val, { radius: 10, color: 'green', fillColor: 'greeb' }).addTo(this.map)
        var p1 = L.popup('<l-popup :content=\'profile1-1+\'</l-popup>')
          .setContent(() => {
            return `<ul class="info">`
              + `<li><span>经度：</span>${val.lon}</li>`
              + `<li><span>纬度：</span>${val.lat}</li>`
              + `<li><span>船舶名称：</span>${val.ship_name}</li>`
              + `<li><span>船舶类型：</span>${val.ship_type}</li>`
              + `<li><span>开始时间：</span>${val.creat_time}</li>`
              + `<li><span>结束时间：</span>${val.end_time}</li>`
              + `</ul>`
          })
        c.bindPopup(p1, { minWidth: 100, maxHeight: 200 }).openPopup()
      },

      mapInit() {
        this.map = L.map('allmap1', {
          crs: L.CRS.EPSG3857,
          attributionControl: false, //不添加属性说明控件
          center: [30.969907662611103, 122.50475884137897], //显示中心
          minZoom: 4,
          maxZoom: 16,
          zoom: 11, //当前显示等级
          zoomControl: false,
          doubleClickZoom: false
        })
        let tileMapLayer = esri.tiledMapLayer({
          url: 'http://59.255.46.51:8070/arcgis/rest/services/10019/MapServer?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzZXJ2ZGwiLCJpYXQiOjE2MTUzNTE3NDEsImV4cCI6MTYxNzk0Mzc0MX0.S9WYg22wW2PLMZiXpFByY9X4IsUTLDWGbkbbDeTL7EwBd-BRk1ePIydALSMOeZluCpZIEMC6jOr-U_Y-PftgDw'
        })
        this.map.addLayer(tileMapLayer)
      }
    }
  }
</script>

<style scoped>
    #allmap1 {
        /* width: 500px; */
        height: 400px;
    }
</style>
