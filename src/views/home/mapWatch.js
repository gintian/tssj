// import { addMyMarker, mapComopentFun } from './mapComponentFactory'
import { wgs84ToBD } from '../../utils/coordinateConvert'
// import { addMyMarker, mapComopentFun,addPolygon } from '../../../../zhhf/src/views/home/mapComponentFactory'
import { addRadarDom } from '../../../src/views/home/mapComponentFactory'
// import { updateShipMapv, addShipPointCollection } from '../../../src/views/home/copyZfwMapFun'
let ShipDataImgMap = {
  1:(shipType)=>{
    if(shipType=='娱乐船'){
      return { imgName:'kc.png',sizeWidth:16, sizeHeight:22 };//客船
    } else if(shipType=='引航船'){
      return { imgName:'hc.png',sizeWidth:16, sizeHeight:22 };
    } else if(shipType=='拖轮船'){
      return { imgName:'yl.png',sizeWidth:16, sizeHeight:22 };
    } else if(shipType=='水下作业'){
      return { imgName:'dangerbuk.png',sizeWidth:16, sizeHeight:22 };
    } 
    //  else if(shipType=='潜水作业'){
    //   return { imgName:'dangerbuk.png',sizeWidth:16, sizeHeight:22 };
    // } else if(shipType=='补给船'){
    //   return { imgName:'dangerbuk.png',sizeWidth:16, sizeHeight:22 };
    // } else if(shipType=='防污染'){
    //   return { imgName:'dangerbuk.png',sizeWidth:16, sizeHeight:22 };
    // } else if(shipType=='顶推船'){
    //   return { imgName:'dangerbuk.png',sizeWidth:16, sizeHeight:22 };
    // } else if(shipType=='执法船'){
    //   return { imgName:'zf.png',sizeWidth:16, sizeHeight:22 };
    // }
    else{
      return { imgName:'another.png',sizeWidth:16, sizeHeight:22 };//其他
    } 
  },
  2:(shipType)=>{
    return { imgName:'aim02.png',sizeWidth:16, sizeHeight:26 }  //融合目标
  },
  3:(shipType)=>{
    return { imgName:'aim01.png',sizeWidth:26, sizeHeight:26 }  //雷达目标
  },
  4:(shipType)=>{
    return { imgName:'aim03.png',sizeWidth:26, sizeHeight:26 }  //异常目标
  },
}
// let flyDataImg=function(speed) {

//   if(speed<=120){
//     return 'fly1.svg'
//   }else if(speed<=360){
//     return 'fly2.svg'
//   }else if(speed<=1000){
//     return 'fly3.svg'
//   }else if(speed>1000){
//     return 'fly4.svg'
//   }

// }


export default {
  
  async shipData(val) {
    console.log('数据变化',val);// #d61c44 #26B574 handler
    this.ciLayer.clearLayers()
    this.leftDrawerShipTypeLayer.clearLayers()
    for (let i of val) {
      var  normal=i.normal
      // console.log('normal',normal)
      
      // let sim=ShipDataImgMap[i.targettype](i.abnormal, i.time)
      let sim=ShipDataImgMap[i.targettype](i.shipType)
      // console.log('sim',sim)
      let bd09Arr = wgs84ToBD(parseFloat(i.lon), parseFloat(i.lat))

      // let icon = L.icon({
      //   iconUrl: require('../../assets/mapSigns/' + sim.imgName),
      //   iconSize: [sim.sizeWidth*0.8,sim.sizeHeight*0.8],
      //   iconAnchor: [sim.sizeWidth*0.55, sim.sizeWidth*0.55]
      // })

      // if(normal==1){
      //   let icon =  L.icon({
      //     iconUrl: require('../../assets/mapSigns/aim03.png'),
      //     iconSize: [32,32],
      //     iconAnchor: [16,16]
      //   })
      // }

      let icon;
      if(normal==1){
        icon =  L.icon({
          iconUrl: require('../../assets/mapSigns/aim03.png'),
          iconSize: [16,22],
          iconAnchor: [16,16]
        })
      }else{
           icon = L.icon({
            iconUrl: require('../../assets/mapSigns/' + sim.imgName),
            iconSize: [sim.sizeWidth*0.8,sim.sizeHeight*0.8],
            iconAnchor: [sim.sizeWidth*0.55, sim.sizeWidth*0.55]
          })
      }

      let rotationAngle=parseFloat(i.course)
      // console.log(rotationAngle)
      // rotationAngle: parseFloat(i.course)
      let marker = L.marker([bd09Arr[1], bd09Arr[0]], {
        rotationAngle: rotationAngle,
        icon:icon
      })
      marker.signal=i
      if(i.isFocus===this.focusButton&&this.focusButton){

        this.ciLayer.addLayer(marker)
      }
      if(!this.focusButton){
        this.ciLayer.addLayer(marker)
      }

      if (this.leftDrawerShipType.name === i.shipType &&this.leftDrawerShipType.num <50) {

        let myMarker = this.createMarker(bd09Arr[1], bd09Arr[0], 40, 30, require('../../assets/asdad.png'))
        ('shipType')
        (()=>{}).addTo(this.leftDrawerShipTypeLayer)
      }
    }



    this.ciLayer.addOnClickListener((e,data)=>{
      
      this.animateLayer.clearLayers()
      let info=data[0].data.signal
      let bd09Arr = wgs84ToBD(parseFloat(info.lon), parseFloat(info.lat))
      L.marker([bd09Arr[1],bd09Arr[0]], {
        icon:L.icon({
          iconUrl: require('../../assets/mapicon/aim.png'),
          iconSize: [32,32],
          iconAnchor: [16,16]
        })
      }).addTo(this.animateLayer);

      console.log(data[0].data.signal);
      // 1是Ais目标2是融合目标3是雷达目标
      if(info.targettype === 3){
        this.dialogInfo.ship = info
        this.showInfo.ship = true
        return
      }
      this.ship_detail(info.mmsi)
      
    })
    this.map.dragging.enable();
    // this.map.scrollWheelZoom.enable();
  },
  
  
  socketRadarData(val) {
//     // console.log('socketRadarData',val)
//       this.radarLayer.clearLayers()
//     let mz=this.map.getZoom()
//     function marker(e) {
//       let size=105*Math.pow(2,10-mz)
//       let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
//       let marker = L.marker([bd09Arr[1], bd09Arr[0]], {
//         icon: L.divIcon({
//           className: 'radarMarker',
//           html: `<div  style="pointer-events: none;">
//                 <img src=${require('../../assets/radar/back.png')} alt="radar" style="width: 100%;pointer-events: none;">
//                 <img src=${require('../../assets/radar/spin.png')} alt="asdadad" style="pointer-events: none;position: absolute" id="radarSpin">
//                  <div style="position: absolute;top: 55%;left: 50%;z-index: 3;border-radius: 50%;display: flex;" ><div style="position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);color: white;cursor: pointer;pointer-events: all;">${e.current_num}</div></div>
//                 <div  style="display:${e.current_num>0?'block':'none'}">
//                  <p style="position: absolute;top: calc(0% - 1.5em);left: calc(50% - 2em);z-index: 3;color: #eeeeee;font-size: 0.5em">${((Math.round(e.current_max_distance / 1852) / 5) * 5).toFixed(0)}海里</p>
//                 <p style="position: absolute;top: calc(8% - 1em);left: calc(50% - 2em);z-index: 3;color: #eeeeee;font-size: 0.5em">${((Math.round(e.current_max_distance / 1852) / 5) * 4).toFixed(0)}海里</p>
//                 <p style="position: absolute;top: calc(19% - 1em);left: calc(50% - 2em);z-index: 3;color: #eeeeee;font-size: 0.5em">${((Math.round(e.current_max_distance / 1852) / 5) * 3).toFixed(0)}海里</p>
//                 <p style="position: absolute;top: calc(30% - 1em);left: calc(50% - 1.5em);z-index: 3;color: #eeeeee;font-size: 0.5em">${((Math.round(e.current_max_distance / 1852) / 5) * 2).toFixed(0)}海里</p>
//                 </div>               
// `
//           , iconAnchor: [e.current_max_distance / size / 2, e.current_max_distance / size / 2],
//           iconSize: [e.current_max_distance / size, e.current_max_distance / size]
//         })
//       })
//       marker.signal = '雷达'
//       return marker
//     }
//     if (this.stationCheck.radar) {
//       console.log('socketRadarData',val)
//       for (let i of val) {
//         console.log('socketRadarData',i)
//         // console.log(this.stationLayers)
//         if (i.showed) {
//           // if(i.attributionId===this.stationID){
//           //   marker(i).addTo(this.radarLayer);
//           // }else if(this.stationID===undefined){
//           //   marker(i).addTo(this.radarLayer);
//           // }
//           if(this.focusButton){
//             this.stationLayers.eachLayer(item=>{
//               if(item.detail.id===i.attributionId&&item.detail.isFocus===this.focusButton&&this.focusButton){
//                 marker(i).addTo(this.radarLayer).on('click',  (e) =>{
//                   this.service.post('/radar/view', {
//                     id: i.id
//                   }).then(res => {
//                     console.log(res)
//                     let a=Object.entries(this.showInfo)
//                     a.forEach(e=>{
//                       this.showInfo[e[0]]=false
//                     })
//                     this.dialogInfo.radar = res.data
//                     this.showInfo.radar=true
//                   })
//                 });
//               }
//             })
//           }else{
//             marker(i).addTo(this.radarLayer).on('click',  (e) =>{
//               this.service.post('/radar/view', {
//                 id: i.id
//               }).then(res => {
//                 console.log(res)
//                 let a=Object.entries(this.showInfo)
//                 a.forEach(e=>{
//                   this.showInfo[e[0]]=false
//                 })
//                 this.dialogInfo.radar = res.data
//                 this.showInfo.radar=true
//               })
//             });
//           }

//         }

//       }
//     } else {
//       this.radarLayer.clearLayers()
//     }

  },
  socketEventData(val) {
     console.log('socketEventData',val)
    // const h = this.$createElement
    //    this.$notify({
    //         title: 'msg',
    //       type: 'success',
    //        message: h('div', { class: 'message' }, [
    //             h('div', { class: 'btnList' }, [
    //               h('span', {on: {click: this.doSomeThing(val)}}, '你导出的数据报表已生成，点击'),
    //               h(
    //                 'span',
    //                 {
    //                   class: 'later',
    //                   on: {
    //                     click: this.doSomeThing
    //                   }
    //                 },
    //                 '下载文件'
    //               )
    //             ])
    //           ]),
    //     });
      // },
      //   doSomeThing(e){
      //     // this.map.setView([30.37892927824675,122.19491755725795], 13);
      //     // alert(e)
          
      // },
    // console.log(val,this.$route.name)
    // if (this.$route.name === 'Home') {
    //   if (val.length > 0) {
    //     const h = this.$createElement
    //     // console.log(this.$refs['shipNotify'])
    //     this.$notify({
    //         title: '异常船只',
    //         duration: 60000,
    //         offset: 200,
    //         dangerouslyUseHTMLString: true,
    //         message: h('div', null, this.createNode(val))
    //       }
    //     )
    //   }
    // }
  },

  async socketFlyData(val) {
    // console.log('数据变化',val)
    this.planeLayer.clearLayers()
    let mz=this.map.getZoom()
    function createMarker(e) {
      // let size=105*Math.pow(2,10-mz)
      let bd09Arr = wgs84ToBD(e.Longitude, e.Latitude)
      let form= {
        form:[
          { id: 0, name: '飞机编号', prop: 'ID' },
          { id: 1, name: '高度', prop: 'Altitude' },
          { id: 2, name: '经度', prop: 'Longitude' },
          { id: 3, name: '纬度', prop: 'Latitude' },
          { id: 4, name: '速度', prop: 'Speed' },
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
        },
        currentId:undefined,
      }
      e.Timestamp = new Date(parseInt(e.Timestamp + '000')).toLocaleDateString().split('T')[0] + ' ' + new Date(parseInt(e.Timestamp + '000')).toTimeString().split(' ')[0]
      e.Altitude = parseFloat(e.Altitude).toFixed(4) + 'm'
      e.Longitude = parseFloat(e.Longitude).toFixed(4) + ' °'
      e.Latitude = parseFloat(e.Latitude).toFixed(4) + ' °'
      e.Speed = parseFloat(e.Speed).toFixed(4) + ' km/h'
      e.Direction = parseFloat(e.Direction).toFixed(4) + ' °'
      e.Owner = form.ownerArr[e.Owner]
      e.Device = form.deviceArr[e.Device]
      for (let i of form.form) {
        if (e[i.prop] === undefined || e[i.prop] === '' || e[i.prop] === 'null') {
          // console.log(i,e[i.prop])
          e[i.prop] = ' —'
        }
      }
      let marker = L.marker([bd09Arr[1], bd09Arr[0]], {
        icon: L.divIcon({
          // className: 'planeInfo',
          html: `<div  class="PlaneInfoView" style="width: 314px;height: 234px;position: absolute;z-index: 500" id='PlaneInfoView' >
           <div id="plane" >
               <div class="inner">
                   <div class="content">
                       <ul style=" list-style-type:none;overflow: hidden">
                           <li><span>${form.form[0].name}</span> :${e.ID}</li>
                           <li><span>${form.form[1].name}</span> :${e.Altitude}</li>
                           <li><span>${form.form[2].name}</span> :${e.Longitude}</li>
                           <li><span>${form.form[3].name}</span> :${e.Latitude}</li>
                           <li><span>${form.form[4].name}</span> :${e.Speed}</li>
                           <li><span>${form.form[5].name}</span> :${e.Direction}</li>
                           <li><span>${form.form[6].name}</span> :${e.Device}</li>
                           <li><span>${form.form[7].name}</span> :${e.Owner}</li>
                           <li><span>${form.form[8].name}</span> :${e.Timestamp}</li>
                           <li><span>${form.form[9].name}</span> :${e.MsgType}</li>
                       </ul>
                   </div>
                   <div class="title">
                       <i class="el-icon-circle-close" style="pointer-events: all"></i>
                   </div>
               </div>
           </div>
       </div>`
          , iconAnchor: [15, 255],
          iconSize: [5, 5]
        })
      })
      marker.signal = 'planeInfo'
      return marker
    }
    let count=0
    for (let i of val) {
      // console.log(i.Latitude)
      // console.log(i.ID+'/'+this.planeID.id+'/')
      // if (i.ID=== this.planeID.id) {
      //   console.log(this.planeID.id)
      //   if(this.planeID.class){this.planeLayer.removeLayer(this.planeID.class);}
      //   createMarker(i).addTo(this.planeLayer).on('click',  (ev) =>{console.log(ev);this.planeLayer.removeLayer(ev.target);this.planeID.class=ev.target})
      // }
      // else if(i.ID.trim() !== this.planeID.id.trim()&&this.planeID.id!==undefined){
      //   count++
      // }
      let shipimgdata = {}
      let arr = []
      shipimgdata = flyDataImg(i.Speed)
      let bd09Arr = wgs84ToBD(parseFloat(i.Longitude), parseFloat(i.Latitude))
      let icon = L.icon({
        iconUrl: require('../../assets/mapSigns/plane/'+shipimgdata ),
        iconSize: [15,75],
        iconAnchor: [7, 45]
      })
      let rotationAngle=parseFloat(i.Direction)
      let marker = L.marker([bd09Arr[1], bd09Arr[0]], {
        rotationAngle: rotationAngle,
        icon:icon
      }).addTo(this.planeLayer).on('click',  (e) =>{
        this.planeLayer.removeLayer(this.planeID.class);
        this.planeID.id=i.ID
        createMarker(i).addTo(this.planeLayer).on('click',  (ev) =>{console.log(ev);this.planeLayer.removeLayer(ev.target);this.planeID.class=ev.target})
      })
      marker.signal=i

      i.Trajectory.forEach(point => {
        let bd09Arr = wgs84ToBD(point.Longitude, point.Latitude)
        arr.push([bd09Arr[1], bd09Arr[0]])
      })
      // console.log(arr)
      let arrow = L.polyline(arr, {
        //颜色
        color: '#26E9EA'
      }).addTo(this.planeLayer)
      // console.log(arr)

    }
  },
}
