import { wgs84ToBD } from './coordinateConvert'

export  default {
  // 删除指定标记图层
  removeLayer(layer,signal){
    layer.eachLayer((l)=>{
      // console.log(layer)
      if(l.signal===signal){
        // console.log(layer)
        layer.removeLayer(l)
      }
    });
  },
  // 获取所有图层
  // getLayers(){
  //   let arr=[]
  //   this.map.eachLayer(function(layer){
  //     // console.log(layer)
  //     arr.push(layer)
  //   });
  //   return arr
  // },
  hasLayer(layer,signal){
    let cube=[]
    layer.eachLayer((l)=>{
      // console.log(layer)
      if(l.signal===signal){
        // console.log(layer)
        cube.push(l)
      }
    });
    return cube
  },
  // 获取可视区域
  getMapBounds(){
    let bs = this.map.getBounds()   //获取可视区域
    let bssw = bs.getSouthWest()   //可视区域左下角
    let bsne = bs.getNorthEast()   //可视区域右上角
    // console.log(bssw,bsne)
    return {
      neLat: bsne.lat,
      swLat: bssw.lat,
      swLon: bssw.lng,
      neLon: bsne.lng
    }
  },
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
        // console.log(waters)
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
        // console.log(waters)
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
        console.log(waters)
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
}
