export default {
  initWebSocket() { //初始化weosocket 218.205.125.100:8091   http://192.168.1.36:8093/
    const wsuri = 'ws://218.205.125.100:8093/websocket'
    const wsuri2 = 'ws://218.205.125.185:8091/zc_data/websocket'
    // const wsuri = 'ws://192.168.1.36:8093/websocket'
    // const wsuri2 = 'ws://192.168.1.36:8093/zc_data/websocket'
    this.websock = new WebSocket(wsuri)
    this.websock2 = new WebSocket(wsuri2)
    this.websock.onmessage = this.websocketonmessage
    this.websock.onopen = this.websocketonopen
    this.websock.onerror = this.websocketonerror
    this.websock.onclose = this.websocketclose

    this.websock2.onmessage = this.websocketonmessage2
    this.websock2.onopen = this.websocketonopen
    this.websock2.onerror = this.websocketonerror
    this.websock2.onclose = this.websocketclose
  },
  websocketonopen() { //连接建立之后执行send方法发送数据
    console.log('websock 连接成功')
  },
  websocketonerror() {//连接建立失败重连
    console.log('连接建立失败重连')
    this.initWebSocket()
  },
  websocketonmessage(e) { //数据接收

    const redata = JSON.parse(e.data)
    if (redata.action === 'areaShip') {

    } else if (redata.action === 'allRadar') {
      this.socketRadarData = redata.data.radarlist
      // console.log(this.socketRadarData )
    } else if (redata.action === 'criminal') {
      this.socketEventData = redata.data.newList
    } else if (redata.action === 'radarShip') {
      this.socketRadarShipData = redata.data.shiplist
      for (let i of this.socketRadarShipData) {
        i.speed = parseFloat(i.speed).toFixed(1)
        i.course = parseFloat(i.course).toFixed(3)
        i.distance = parseFloat(i.distance).toFixed(3)
        i.azimuth = parseFloat(i.azimuth).toFixed(3)
        i.lon = parseFloat(i.lon).toFixed(3)
        i.lat = parseFloat(i.lat).toFixed(3)
      }
      // console.log(this.socketRadarShipData )
    }
    // console.log('数据接收',new Date().toLocaleTimeString(),redata)
    // console.log('数据接收')
  },
  websocketonmessage2(e) { //数据接收

    const redata = JSON.parse(e.data)
    // console.log('数据接收',redata)
    let swne = this.getMapBounds()
    let nelat = redata.data.nelat
    let nelon = redata.data.nelon

    // console.log(swne.neLat,redata.data.nelat)
    if (swne.neLat === nelat && swne.neLon === nelon) {
      this.socketFlyData = redata.data.flyList
      // console.log('数据接收',new Date().toLocaleTimeString(),redata)
    }
  },
  websocketsend(Data) {//数据发送 websockSend

      // console.log('数据发送', Data )
      this.websock.send(Data)
  },
  websocketsend2(Data) {//数据发送 websockSend
    // console.log('数据发送',Data)
    this.websock2.send(Data)
  },
  websocketclose(e) {  //关闭
    console.log('断开连接', e)
  }
}
export let mapSocket = {
  websock: null,
  websock2: null
}
