export default {
  initWebSocket() { //初始化weosocket 218.205.125.100:8091   http://192.168.1.36:8093/
    // const wsuri = 'ws://218.205.125.100:8090/websocket'
    // const wsuri2 = 'ws://218.205.125.100:8090/zc_data/websocket'
    const wsuri = 'ws://192.168.1.36:8093/websocket'
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
    console.log('接受',redata)
    if (redata.action === 'focus') {
     
    } else if (redata.action === 'criminal') {
      this.socketEventData = redata.data.list
      // console.log(" this.socketEventData", this.socketEventData)
    
    }
  },
  websocketsend(Data) {//数据发送 websockSend

      console.log('数据发送', Data )
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
