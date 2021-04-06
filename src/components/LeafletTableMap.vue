<template>
  <div>
    <div id="allmap1" ref="allmap1"></div>
    <p style="display: none">{{mapData}}</p>
  </div>
</template>

<script>
import { wgs84ToBD } from "../utils/coordinateConvert";
export default {
  name: "LeafletTableMap",
  props: {
    mapData: {
      type: Object,
      default: () => {
        return {};
      }
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
    markerType:  {
        type: String,
        default: ''
      },
    option: {
      type: Object,
      default: { strokeColor: "blue ", strokeWeight: 2, strokeOpacity: 0.5 }
    }
  },
  data() {
    return {
      map: null,
      travelData: [],
      markData: {},
      dialogInfo:{
            anchorage:{},
        },
    };
  },
  watch: {
    
    mapData(val){
      console.log('mapData',val)
        if (this.markerType === "Anchorage") {
        this.createMarker(val.lat,val.lon,15,30,require("../assets/mapSigns/03.png"))(1)(() => {}).addTo(this.map);
        this.map.setView([val.lat, val.lon], 13);
        // const m = {
        //         '0': 'circle',
        //         '1': 'rectangle',
        //         '2': 'polygon',
        //     }

        // this.createPolygon(m[this.dialogInfo.anchorage.type],this.dialogInfo.anchorage,'1' + this.dialogInfo.anchorage.id,
        //     {  //颜色
        //     color: 'rgba(222,29,55,0.84)',
        //     //填充色
        //     fillColor: 'rgba(249,247,244,0.44)',
        //     //填充色透明度
        //     fillOpacity: 0.8
        //     }
        // )(wgs84ToBD).addTo(this.map);

        }else if(this.markerType === "ais"){
        this.createMarker(val.lat,val.lon,15,30,require("../assets/mapSigns/ais.png"))(2)(() => {}).addTo(this.map);
        this.map.setView([val.lat, val.lon], 13);
        }else if(this.markerType === "wharf"){
        this.createMarker(val.lat,val.lon,15,30,require("../assets/mapSigns/02.png"))(3)(() => {}).addTo(this.map);
        this.map.setView([val.lat, val.lon], 13);
        }else if(this.markerType === "radar"){
        this.createMarker(val.lat,val.lon,15,30,require("../assets/mapSigns/01.png"))(4)(() => {}).addTo(this.map);
        this.map.setView([val.lat, val.lon], 13);
        }else if(this.markerType === "Submarine"){
        this.createMarker(val.lat,val.lon,15,30,require("../assets/mapSigns/Submarine.png"))(4)(() => {}).addTo(this.map);
        this.map.setView([val.lat, val.lon], 13);
        }else if(this.markerType === "tower"){
        this.createMarker(val.lat,val.lon,15,30,require("../assets/mapSigns/tower.png"))(4)(() => {}).addTo(this.map);
        this.map.setView([val.lat, val.lon], 13);
        }else if(this.markerType === "camera"){
        this.createMarker(val.lat,val.lon,15,30,require("../assets/mapSigns/camera.png"))(4)(() => {}).addTo(this.map);
        this.map.setView([val.lat, val.lon], 13);
        }else if(this.markerType === "port"){
        this.createMarker(val.lat,val.lon,15,30,require("../assets/mapSigns/port.png"))(4)(() => {}).addTo(this.map);
        this.map.setView([val.lat, val.lon], 13);
        }
        else if(this.markerType === "suspicious"){
        this.createMarker(val.lat,val.lon,15,30,require("../assets/mapSigns/aim03.png"))(5)(() => {}).addTo(this.map);
        this.handleMapMarerClick(val)
        this.map.setView([val.lat, val.lon], 13);

        }else if(this.markerType === "suspiciousTrail"){
        this.createMarker(val.lat,val.lon,15,30,require("../assets/mapSigns/aim03.png"))(6)(() => {}).addTo(this.map);
        this.map.setView([val.lat, val.lon], 13);

        // let points = [],duration=[]
        // // res.data.forEach(val => {
        //   let bd09Arr = wgs84ToBD(parseFloat(val.lon), parseFloat(val.lat))
        //   points.push([bd09Arr[1], bd09Arr[0]])
        //   duration.push(800*i)
        // // })
        // // console.log("duration",duration)
        // L.marker(points[0], {
        //   icon:L.icon({
        //     iconUrl: require('../assets/history/start.png'),
        //     iconSize: [30,44],
        //     iconAnchor: [15,22]
        //   })
        // }).addTo(this.animateLayer);
        // L.marker(points[points.length-1], {
        //   icon:L.icon({
        //     iconUrl: require('../assets/history/end.png'),
        //     iconSize: [30,44],
        //     iconAnchor: [15,22]
        //   })
        // }).addTo(this.animateLayer);
        
        // var polyline = L.polyline(points, { color: 'red' }).addTo(this.animateLayer);
        // var myMovingMarker = L.Marker.movingMarker(points,
        //   duration,{
        //     icon:L.icon({
        //       iconUrl: require('../assets/history/ship.png'),
        //       iconSize: [40,44],
        //       iconAnchor: [20,22]
        //     })
        //   }).addTo(this.animateLayer);
        // myMovingMarker.start();

        }
    }

  },
  mounted() {
    this.mapInit();
    // console.log(this.mapData)
      this.createMarker(this.mapData.lat,this.mapData.lon,15,30,require("../assets/mapSigns/aim03.png"))(1)(() => {}).addTo(this.map);
      this.handleMapMarerClick(val)
      this.map.setView([this.mapData.lat,this.mapData.lon], 13);
    //   this.createMarker(this.mapData.lat,this.mapData.lon,15,30,require("../assets/mapSigns/ais.png"))(2)(() => {}).addTo(this.map);
    //   this.map.setView([this.mapData.lat,this.mapData.lon], 13);
    //   this.createMarker(this.mapData.lat,this.mapData.lon,15,30,require("../assets/mapSigns/02.png"))(3)(() => {}).addTo(this.map);
    //   this.map.setView([this.mapData.lat,this.mapData.lon], 13);
    //   this.createMarker(this.mapData.lat,this.mapData.lon,15,30,require("../assets/mapSigns/01.png"))(4)(() => {}).addTo(this.map);
    //     this.map.setView([this.mapData.lat,this.mapData.lon], 13);
  },
  updated(){
     this.addMarker(this.markerType)
  },
  methods: {
           addMarker(tp) {
              // console.log(this.markData)
                console.log(tp)
                const mp = {
                    'polyline': (wgs84ToBD) => {
                        // var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
                        //     scale: 0.6,//图标缩放大小
                        //     strokeColor:'#fff',//设置矢量图标的线填充颜色
                        //     strokeWeight: '2',//设置线宽
                        // });
                        // var icons = new BMap.IconSequence(sy, '10', '30');// 创建polyline对象
                      let pois = []
                      for(let i of this.mapData){
                        // console.log(i.lon,i.lat)
                        let bd09Arr = wgs84ToBD(val.lat,val.lon)
                        pois.push([bd09Arr[1], bd09Arr[0]])
                      }
                        var polyline =L.Polyline(pois, {
                            //颜色
                            color: 'rgba(255,137,135,0.62)'
                        });
                        return polyline
                    },
                }
                this.map.addOverlay(mp[tp]());
            },
    // 创建标记
   createMarker(lat,lng,width,height,img,Angle=0){
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
      rotationAngle: Angle,
    })
    return (signal)=>{
      Marker.signal=signal;
      return fun =>{
        Marker.on("click", fun);
        return Marker;
      }

    }
  },
     // 创建多边形区域
  createPolygon(type,waters,signal,style){
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
     return (wgs84ToBD)=>{ return map[type](wgs84ToBD)}
  },
    createMarker(lat, lng, width, height, img, Angle = 0) {
      //标记样式
      var icon = L.icon({
        //图标地址
        iconUrl: img,
        //图标大小
        iconSize: [width, height]
      });
      //标记
      var Marker = L.marker([lat, lng], {
        //添加图标
        icon: icon,
        rotationAngle: Angle
      });
      var  clicked= L.marker([lat, lng], {
          icon:L.icon({
            iconUrl: require('../assets/mapicon/aim.png'),
            iconSize: [32,32],
            iconAnchor: [16,16]
          })
        });
      return signal => {
        Marker.signal = signal;
        // console.log('signal',signal)
        return fun => {
            // console.log('fun',fun)
          // Marker.on("click", fun);
           Marker.on("click", (val)=>{
              //  Marker.signal=clicked;
             this.handleMapMarerClick(val);
            //  console.log('click',signal)
              //  Marker.signal=clicked;
              //  console.log('signal', Marker.signal)
              //   L.popup().setLatLng(signal.latlng)
		          //           .setContent(setContent(signal))
		          //           .openOn(this.map);

           });
         
          return Marker;
        };
      };
    },

//  handleMapMarerClick(lat, lng, name, type, creat_time=0, end_time = 0,status){
   handleMapMarerClick(val){
        console.log('item',val)
              //  if(val.status==0){
              //     return  "异常"
              //   }else if(val.status==1){
              //     return  val.status='正常'
              //   }
             let c=L.circle(val, {radius: 10,color:'green',fillColor:'greeb'}).addTo(this.map);
              var p1 = L.popup("<l-popup :content='profile1-1+'</l-popup>")
              .setContent(()=>{
                return `<ul class="info">`
                        + `<li><span>经度：</span>${val.lon}</li>`
                        + `<li><span>纬度：</span>${val.lat}</li>`
                        + `<li><span>船舶名称：</span>${val.ship_name}</li>`
                        + `<li><span>船舶类型：</span>${val.ship_type}</li>`
                        + `<li><span>开始时间：</span>${val.creat_time}</li>`
                        + `<li><span>结束时间：</span>${val.end_time}</li>`
                        // + `<li><span>运行状态：</span>${val.status}</li>`
                      +`</ul>`
              })
              c.bindPopup(p1,{minWidth:100,maxHeight:200}).openPopup() 
      // let content = `<div class="boundaryMask-popup" >`
      // // + `<p class="title">${name}</p>`
      //   + `<ul class="info">`
      //     + `<li><span>经度：</span>${val.lon}</li>`
      //     + `<li><span>纬度：</span>${val.lat}</li>`
      //     + `<li><span>船舶名称：</span>${val.ship_name}</li>`
      //     + `<li><span>船舶类型：</span>${val.ship_type}</li>`
      //     + `<li><span>开始时间：</span>${val.creat_time}</li>`
      //     + `<li><span>结束时间：</span>${val.end_time}</li>`
      //     + `<li><span>运行状态：</span>${val.status}</li>`
      //   +`</ul>`
      // +` </div>`;
      // L.popup({minWidth : 150})
      // // .setLatLng([val.lon, val.lat])
      // .setContent(content)
      // .openOn(this.map);
  },

    mapInit() {
      this.map = L.map("allmap1", {
        crs: L.CRS.EPSG3857,
        attributionControl: false, //不添加属性说明控件
        center: [30.969907662611103, 122.50475884137897], //显示中心
        minZoom: 4, 
        maxZoom: 16, 
        zoom: 11, //当前显示等级
        zoomControl: false,
        doubleClickZoom: false
      });
      this.baseLayer = L.tileLayer(
        "http://218.205.125.142:8001/{z}/{x}/{y}.png"
      ).addTo(this.map); //服务器上的离线海图

      //初始时加载矢量图层组
      this.map.addLayer(this.baseLayer);
    },
    addMarker(tp) {
      console.log(tp);
    }
  }
};
</script>

<style scoped>
#allmap1 {
  /* width: 500px; */
  height: 400px;
}
</style>
