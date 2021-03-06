import { wgs84ToBD } from '../../utils/coordinateConvert'
export default {
  initWebSocket() { //初始化weosocket 218.205.125.100:8091   http://192.168.1.36:8093/
    const wsuri = 'ws://192.168.1.36:8093/websocket'
    // const wsuri = 'ws://127.0.0.1:8093/websocket'
    // const wsuri2 = 'ws://192.168.1.36:8093/zc_data/websocket'
    this.websock = new WebSocket(wsuri)
    // this.websock2 = new WebSocket(wsuri2)
    this.websock.onmessage = this.websocketonmessage
    this.websock.onopen = this.websocketonopen
    this.websock.onerror = this.websocketonerror
    this.websock.onclose = this.websocketclose
  },
  websocketonopen() { //连接建立之后执行send方法发送数据
    console.log('websock 连接成功')
  },
  websocketonerror() {//连接建立失败重连
    console.log('连接建立失败重连')
    this.initWebSocket()
  },
  websocketonmessage(e) { //数据接收
    // console.log('接受',e)
    const redata = JSON.parse(e.data)
    // console.log('接受',redata)
    if (redata.action === 'focus') {
      this.socketEventData = redata.data.list
      // console.log("redata.data.list.length", redata.data.list.length)
      if (redata.data.list.length > 0) {
        for (let i in redata.data.list) {
          this.$notify.info({
            title: '关注船只',
            position: 'bottom-left',
            message: redata.data.list[i].message,
            customClass: 'notify-success'
          });
        }
      }
    } else if (redata.action === 'criminal') {
      const h = this.$createElement
      this.socketEventData = redata.data.list
      if (redata.data.list.length > 0) {
        for (let i in redata.data.list) {
          this.$notify({
            title: '异常船只',
            dangerouslyUseHTMLString: true,
            // duration: 60000,
            // offset: 200,
            type: 'warning',
            position: 'bottom-left',
            message: [redata.data.list[i].message, redata.data.list[i].mmsi],
            onClick: () => {
              this.ship_detail(redata.data.list[i].mmsi)
            },
            onClose: () => {
              console.log(`Notify已关闭，说明异常或已查看`)
            }
            // message:
            //     h('div', { class: 'message' }, [
            //               h('div', {class: 'btnList'} ,redata.data.list[i].message, [
            //                 h('span',
            //                     {
            //                       class: 'later',
            //                       on:{
            //                         // click:  this.ship_detail(),
            //                           // click: ()=>{this.ship_detail(redata.data.list[i].mmsi)}
            //                         }
            //                     },
            //                 ),
            //               ])
            //             ]),
            // message: [redata.data.list[i].message, redata.data.list[i].mmsi],
          });
        }
      }

    } else if (redata.action === 'allRadar') {
      this.socketRadarData = redata.data.radarlist
      // console.log("redatadata",  this.socketRadarData )   
  
      this.radarLayer.clearLayers()
      let mz = this.map.getZoom()
      //  console.log('当前的地图缩放级别是：',mz)
      function marker(e) {
        //  console.log('e',e)
        let size = 105 * Math.pow(2, 9 - mz)
        let bd09Arr = wgs84ToBD(e.lon, e.lat)
        let marker = L.marker([bd09Arr[1], bd09Arr[0]], {
          icon: L.divIcon({
            className: 'radarMarker',
            html: `<div  style="pointer-events: none;">
                     <img src=${require('../../assets/radar/back.png')} alt="radar" style="width: 100%;pointer-events: none;">
                     <img src=${require('../../assets/radar/spin.png')} alt="asdadad" style="pointer-events: none;position: absolute" id="radarSpin">
                      <div style="position: absolute;top: 55%;left: 50%;z-index: 3;border-radius: 50%;display: flex;" ><div style="position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);color: white;cursor: pointer;pointer-events: all;">${e.current_num}</div></div>
                     <div  style="display:${e.current_num > 0 ? 'block' : 'none'}">
                      <p style="position: absolute;top: calc(0% - 1.5em);left: calc(50% - 2em);z-index: 3;color: #eeeeee;font-size: 0.5em">${((Math.round(e.current_max_distance / 1852) / 5) * 5).toFixed(0)}海里</p>
                     <p style="position: absolute;top: calc(8% - 1em);left: calc(50% - 2em);z-index: 3;color: #eeeeee;font-size: 0.5em">${((Math.round(e.current_max_distance / 1852) / 5) * 4).toFixed(0)}海里</p>
                     <p style="position: absolute;top: calc(19% - 1em);left: calc(50% - 2em);z-index: 3;color: #eeeeee;font-size: 0.5em">${((Math.round(e.current_max_distance / 1852) / 5) * 3).toFixed(0)}海里</p>
                     <p style="position: absolute;top: calc(30% - 1em);left: calc(50% - 1.5em);z-index: 3;color: #eeeeee;font-size: 0.5em">${((Math.round(e.current_max_distance / 1852) / 5) * 2).toFixed(0)}海里</p>
                     </div>               
     `
            , iconAnchor: [e.current_max_distance / size / 2, e.current_max_distance / size / 2],
            iconSize: [e.current_max_distance / size, e.current_max_distance / size]
          })
        })
        marker.signal = '雷达'
        return marker
      }
      //  if ( this.stationCheck.radar) {
      // console.log('clickedMarker',this.clickedMarker)

      // if ( this.clickedMarker.name=='雷达'&&this.clickedMarker.is==false) {  
      if (this.clickedMarker.name == '雷达' && this.clickedMarker.is==false||
      this.clickedMarker.name == 'ais'&& this.clickedMarker.is==false
       ||this.clickedMarker.name == '码头'&& this.clickedMarker.is==false
       ||this.clickedMarker.name == '锚地' && this.clickedMarker.is==false
       ||this.clickedMarker.name == '海底光缆'&& this.clickedMarker.is==false
       ||this.clickedMarker.name == '铁塔' && this.clickedMarker.is==false
       ||this.clickedMarker.name == '摄像头'&& this.clickedMarker.is==false
       ||this.clickedMarker.name == '泊位' && this.clickedMarker.is==false
       ||this.clickedMarker.name == '海防单位' && this.clickedMarker.is==false)  {
        this.radarLayer.clearLayers()
        //  console.log('stationCheck',this.stationCheck.radar)
      } 
      else if (this.clickedMarker.name == '雷达' && this.clickedMarker.is == true ||
      this.clickedMarker.name == 'ais'&& this.clickedMarker.is == true ||
      this.clickedMarker.name == '码头'&& this.clickedMarker.is == true||
      this.clickedMarker.name == '锚地'&& this.clickedMarker.is == true||
     this.clickedMarker.name == '海底光缆'&& this.clickedMarker.is==true
      ||this.clickedMarker.name == '铁塔' && this.clickedMarker.is==true
      ||this.clickedMarker.name == '摄像头'&& this.clickedMarker.is==true
      ||this.clickedMarker.name == '泊位' && this.clickedMarker.is==true
      ||this.clickedMarker.name == '海防单位' && this.clickedMarker.is==true){
          for (let i of this.socketRadarData) {
            //  console.log('socketRadarData',i)
            // console.log(this.stationLayers)
            if (i.status == false) {
              if (i.id) {
                marker(i).addTo(this.radarLayer);
              }
            }
          }
      }
    
      else {
          for (let i of this.socketRadarData) {
            //  console.log('socketRadarData',i)
            // console.log(this.stationLayers)
            if (i.status == false) {
              if (i.id) {
                marker(i).addTo(this.radarLayer);
              }
            }
          }
      }
      
    }

  },
  websocketsend(Data) {//数据发送 websockSend

    console.log('数据发送', Data)
    this.websock.send(Data)

  },
  websocketclose(e) {  //关闭
    console.log('断开连接', e)
  }
}
export let mapSocket = {
  websock: null,
  websock2: null
}

