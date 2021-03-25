<template>
  <div class="videoDiv" :style="{width: isBird.is?'auto':videoWidth,background:background}" >
    <div class="ordinaryDiv textColor" :style="{'color':textColor}">
      {{videoName===''?videoID:videoName}}
    </div>
    <div v-if="true" id="playerDiv" class="ordinaryDiv" ref="playerDiv"  style="display: grid;place-items: center;position: relative;">

        <div style="color:#Eee;position: absolute;top:0;padding: 5px;">

        </div>
        <div style="position: relative;">
          <div ref="VideoAIBox" class="VideoAIBox" v-show="isVideoAIBox"  style="position: absolute;"></div>
          <video v-if="DestroyIncomeStatistics == true"  class="demo-video" ref="player" id='player' muted autoplay >
            <div>
              视频无法播放
            </div>
          </video>
        </div>
        <div class="video-control-wrap" style="color:#Eee;position: absolute;bottom: 0;padding: 5px;">
         <!-- Footer Content — Header.com 2020 -->
              <div  v-show="isEnlarge"    class="ordinaryDiv">
              <!--<button class="MyButton" @click="pause()" >border-radius: 25px;
                <el-button size='mini' type="primary" icon="el-icon-video-pause"></el-button>

              </button>-->
              <div style="display: initial;" v-if='!isBird.is||isBird.row.cameraTypeSum>=2'>

                <button class="MyButton" title="向左转动摄像头" @mousedown="isBird.is?pTZControl('LEFT','1',isBird.row.indexCode):runPtz('childLeft')" @mouseup="isBird.is?pTZControl('LEFT','0',isBird.row.indexCode):stopPtz('childLeft')"  >
                  <el-button size='mini'   icon="el-icon-arrow-left" plain circle></el-button>
                  <!--<i class="el-icon-edit"></i>-->
                </button>
                <button class="MyButton" title="向上转动摄像头" @mousedown="isBird.is?pTZControl('UP','1',isBird.row.indexCode):runPtz('childUp')" @mouseup="isBird.is?pTZControl('UP','0',isBird.row.indexCode):stopPtz('childUp')" >
                  <el-button size='mini'   icon="el-icon-arrow-up" plain circle></el-button>
                </button>
                <button class="MyButton" title="向右转动摄像头" @mousedown="isBird.is?pTZControl('RIGHT','1',isBird.row.indexCode):runPtz('childRight')" @mouseup="isBird.is?pTZControl('RIGHT','0',isBird.row.indexCode):stopPtz('childRight')" >
                  <el-button size='mini'   plain circle><i class="el-icon-arrow-right"  ></i></el-button>
                </button>
                <button class="MyButton" title="向下转动摄像头" @mousedown="isBird.is?pTZControl('DOWN','1',isBird.row.indexCode):runPtz('childDown')" @mouseup="isBird.is?pTZControl('DOWN','0',isBird.row.indexCode):stopPtz('childDown')" >
                  <el-button size='mini'   icon="el-icon-arrow-down" plain circle></el-button>
                </button>

              </div>
              <button class="MyButton" v-if="extraChannels[1]" @click="switchExtraChannels" title="通道切换">
                <el-button size='mini'   icon="el-icon-help" plain circle></el-button>
              </button>
              <button class="MyButton"  title="放大" @mousedown="isBird.is?pTZControl('ZOOM_IN','1',isBird.row.indexCode):runPtz('childZoomIn')" @mouseup="isBird.is?pTZControl('ZOOM_IN','0',isBird.row.indexCode):stopPtz('childZoomIn')" >
                <el-button size='mini'   icon="el-icon-zoom-in" plain circle></el-button>
              </button>
              <button class="MyButton"  title="缩小" @mousedown="isBird.is?pTZControl('ZOOM_OUT','1',isBird.row.indexCode):runPtz('childZoomOut')" @mouseup="isBird.is?pTZControl('ZOOM_OUT','0',isBird.row.indexCode):stopPtz('childZoomOut')" >
                <el-button size='mini'   icon="el-icon-zoom-out" plain circle></el-button>
              </button>
              <button class="MyButton"   title="画中画" @click="isOpenVideoPicInPic(true)" >
                <el-button size='mini'   icon="el-icon-money" plain circle></el-button>
              </button>
              <button class="MyButton" title="全屏取消" @click="enlargeVideo" >
                <el-button size='mini'   icon="el-icon-full-screen" plain circle></el-button>
              </button>
            <!--<button @click="flvReload">flvReload</button> fullScreen($refs.player)
                <button @click="$refs.player.playbackRate = 1.5">1.5播放速度</button>
                <button @click="$refs.player.playbackRate = 2.0">2.0播放速度</button>
              <button class="MyButton" @click="videoOverload()">  el-icon-full-screen
                <el-button size='mini' type="primary" ></el-button>
              </button>
                  <button @click="player.play()">播放</button>
          <button @click="player.pause()">暂停</button>
          <button @click="player.unload()">卸载</button>
          <button @click="player.load()">加载</button>-->
          </div>
        </div>
    </div>
    <div v-else class="ordinaryDiv" style="position: relative;">
      {{}}
    </div>
          <div v-show="!isEnlarge"  class="ordinaryDiv">
          <!--<button class="MyButton" @click="pause()" >border-radius: 25px;
            <el-button size='mini' type="primary" icon="el-icon-video-pause"></el-button>

          </button>-->
          <div style="display: initial;" v-if='!isBird.is||isBird.row.cameraTypeSum>=2'>

            <button class="MyButton" title="向左转动摄像头" @mousedown="isBird.is?pTZControl('LEFT','1',isBird.row.indexCode):runPtz('childLeft')" @mouseup="isBird.is?pTZControl('LEFT','0',isBird.row.indexCode):stopPtz('childLeft')"  >
              <el-button size='mini'   icon="el-icon-arrow-left" plain circle></el-button>
              <!--<i class="el-icon-edit"></i>-->
            </button>
            <button class="MyButton" title="向上转动摄像头" @mousedown="isBird.is?pTZControl('UP','1',isBird.row.indexCode):runPtz('childUp')" @mouseup="isBird.is?pTZControl('UP','0',isBird.row.indexCode):stopPtz('childUp')" >
              <el-button size='mini'   icon="el-icon-arrow-up" plain circle></el-button>
            </button>
            <button class="MyButton" title="向右转动摄像头" @mousedown="isBird.is?pTZControl('RIGHT','1',isBird.row.indexCode):runPtz('childRight')" @mouseup="isBird.is?pTZControl('RIGHT','0',isBird.row.indexCode):stopPtz('childRight')" >
              <el-button size='mini'   plain circle><i class="el-icon-arrow-right"  ></i></el-button>
            </button>
            <button class="MyButton" title="向下转动摄像头" @mousedown="isBird.is?pTZControl('DOWN','1',isBird.row.indexCode):runPtz('childDown')" @mouseup="isBird.is?pTZControl('DOWN','0',isBird.row.indexCode):stopPtz('childDown')" >
              <el-button size='mini'   icon="el-icon-arrow-down" plain circle></el-button>
            </button>
          </div>
          <button class="MyButton" v-if="extraChannels[1]" @click="switchExtraChannels" title="通道切换">
            <el-button size='mini'   icon="el-icon-help" plain circle></el-button>
          </button>
          <button class="MyButton"  title="放大" @mousedown="isBird.is?pTZControl('ZOOM_IN','1',isBird.row.indexCode):runPtz('childZoomIn')" @mouseup="isBird.is?pTZControl('ZOOM_IN','0',isBird.row.indexCode):stopPtz('childZoomIn')" >
            <el-button size='mini'   icon="el-icon-zoom-in" plain circle></el-button>
          </button>
          <button class="MyButton"  title="缩小" @mousedown="isBird.is?pTZControl('ZOOM_OUT','1',isBird.row.indexCode):runPtz('childZoomOut')" @mouseup="isBird.is?pTZControl('ZOOM_OUT','0',isBird.row.indexCode):stopPtz('childZoomOut')" >
            <el-button size='mini'   icon="el-icon-zoom-out" plain circle></el-button>
          </button>
          <button class="MyButton"  title="画中画" @click="isOpenVideoPicInPic()" >
            <el-button size='mini'   icon="el-icon-money" plain circle></el-button>
          </button>
          <button class="MyButton"  title="全屏" @click="enlargeVideo" >
            <el-button size='mini'   icon="el-icon-full-screen" plain circle></el-button>
          </button>

        <!--<button @click="flvReload">flvReload</button> fullScreen($refs.player)
            <button @click="$refs.player.playbackRate = 1.5">1.5播放速度</button>
            <button @click="$refs.player.playbackRate = 2.0">2.0播放速度</button>
          <button class="MyButton" @click="videoOverload()">  el-icon-full-screen
            <el-button size='mini' type="primary" ></el-button>
          </button>
              <button @click="player.play()">播放</button>
      <button @click="player.pause()">暂停</button>
      <button @click="player.unload()">卸载</button>
      <button @click="player.load()">加载</button>-->
      </div>
  </div>
</template>

<script>
import flvjs from "flv.js";
//import 'remixicon/fonts/remixicon.css'
//import { videoconsolelog } from '../tools/index.js'
// import { config } from '../config.js'

export default {
  components: {

  },
  //inject:['reload'],
  props: {
    videoSrc: {
      type: String,
      required: true,
        default:'rtsp://218.205.125.185/vc85Yl2c'
    },
    videoID: {
      type: Number ,
      required: true,
      default: 0
    },
    isBird:{
      type:Object,
      default:()=>{
        return {
          is:false
        }
      }
    },
    videoName:{
      type:String,
      default:''
    },
    textColor:{
      type:String,
      default:''
    },
    background:{
      type:String,
      default:''
    },
    extraChannels:{
      type:Array,
      default:()=>[]
    }
  },
  data () {
    return {
          id: "1",
          rtsp: 'rtsp://192.168.1.39/tRFgv3bIKhBgxmGR49Os',//"rtsp://admin:bsak8888@183.245.246.103:554/MPEG-4/ch1/main/av_stream",
          player: null,
          isPlay:true,
          isVideoAIBox:false,
          DestroyIncomeStatistics:true,
          hash:'',
          cleanBuff:null,
          countDecodedFrames:0,
          self_destruction_time:null,
          domFunVisibilitychange:()=> {
                    if(document.webkitVisibilityState === 'visible') { //do something}
                      let videoEleObj = document.getElementsByTagName('video');
                      for(let video in videoEleObj){
                      let buffered = videoEleObj[video].buffered;
                        if(buffered && buffered.length > 0){
                          videoEleObj[video].currentTime = buffered.end(0) - 1;
                        }
                      }
                      console.log('视频暂停,触发。调整指针位置');
                    }
          },
          videoWidth:'400px',
          isEnlarge:false,
          websock:null,
          MyisOpenVideoPicInPic:true,
          switchINum:1
    }
  },
  watch:{
    videoSrc(val){
      console.log('videoSrc 变化',val)
    }
  },
  componentDidMount() {
       // this.cleanBuff = setInterval(this.jumpToEndBuffer, 3 * 10 * 1000)
  },
  mounted () {
    console.log('aaaaasasdasd',this.videoSrc)
    let hash = this.randomString(8);
    this.cleanBuff = setInterval(()=>this.jumpToEndBuffer(), 3 * 10 * 1000);
    this.self_destruction_time = setInterval(()=>this.flvReload(), 10 * 6 * 10 * 1000);
    document.addEventListener("fullscreenchange", this.isEnlargeFun)
    if(this.isBird.is){
       this.flvInit(this.videoSrc);
      return
    }
     this.service.post('/video/rtspAgent',{
            "url":this.videoSrc
        })
    .then(json=>{
       console.log(json);
       this.flvInit(json.data);

    }).catch(err=>{
      this.$notify({
        title: '网络错误',
        message: '推流地址网络请求失败,'+'摄像头id：'+this.videoID,
        type: 'warning'
      });
      console.log(err,'推流地址网络请求失败');
    })
    this.getXgdVideoPosition(this.videoID)

  },
  beforeDestroy()/* VUE 生命周期 销毁前触发 */{
    clearTimeout(this.cleanBuff);
    clearTimeout(this.self_destruction_time);
      this.player.pause();
      this.player.unload();
      this.player.detachMediaElement();
      this.player.destroy();
      this.player = null;
      if(this.websock){
        this.websock.close();
      }
    document.removeEventListener("visibilitychange",this.domFunVisibilitychange);
    document.removeEventListener("visibilitychange",this.domFunVisibilitychange);
    document.removeEventListener("fullscreenchange", this.isEnlargeFun);

  },
  methods: {
    escapeUrlofVideo(string){
      let text = '';
      let regex = /[a-zA-Z0-9.]/;
      for(let char of string){
        if(!regex.exec(char)){
         text += '%' + char.charCodeAt(0).toString(16).toUpperCase();
        }else{
          text += char;
        }
      }
      return text
    },
    jumpToEndBuffer() {
      if (this.$refs.player) {
        let buffered = this.$refs.player.buffered;
          if (buffered.length > 0) {
            //  console.log('心跳');
              let end = buffered.end(0)
              if (end - this.$refs.player.currentTime > 0.15) {
                  console.log('心跳  ','当前时间：' + this.$refs.player.currentTime , '总共时间：'+end);
                  this.$refs.player.currentTime = end - 0.1
              }
          }
      }
    },
    flvInit(rtsp){
     // console.log(rtsp)
      if (flvjs.isSupported()) {
        let video = this.$refs.player;

        if (video) {
          this.$refs.player.playbackRate = 1.5  ;
            //videoconsolelog(video);
              this.player = flvjs.createPlayer({
                  type: "flv",
                  isLive: true,
                  url: `ws://218.205.125.185:8888/rtsp/1/?url=rtsp://218.205.125.185/vc85Yl2c`,
              },
              {
                 isLive: true,
                 autoCleanupSourceBuffer:true,
                 //enableWorker: true,
                 enableStashBuffer: false,
                 stashInitialSize: 128,
                 duration:3000
              });

              this.player.attachMediaElement(video);
            try {
                this.player.load();
                this.player.play();
                //this.isVideoAIBox = true;
                this.$refs.player.addEventListener('error',(err)=>{
                    console.log('视频错误');
                    this.flvDestroy();
                    this.flvLoad();
                    this.$emit('fatherMethod');
                })

                document.addEventListener('visibilitychange', this.domFunVisibilitychange)
                let _this = this;
                  video.addEventListener('ended', function(e) {
                    console.log('视频播放完了')
                    console.log(e)
                    //this.player.getFeatureList();
                    setTimeout(()=>{
                      console.log('视频重载')
                      _this.flvDestroy();
                      _this.flvLoad();
                    },5000)
                  })
              this.player.on(flvjs.Events.ERROR, (errType, errDetail) => {
              // errType是 NetworkError时，对应errDetail有：Exception、HttpStatusCodeInvalid、ConnectingTimeout、EarlyEof、UnrecoverableEarlyEof
              // errType是 MediaError时，对应errDetail是MediaMSEError

                console.log(errType);
                console.log(errDetail);

                this.flvDestroy();
                this.flvLoad();
              });
              this.player.on(flvjs.ErrorTypes.NETWORK_ERROR, (errType, errDetail) => {
                // errType是 NetworkError时，对应errDetail有：Exception、HttpStatusCodeInvalid、ConnectingTimeout、EarlyEof、UnrecoverableEarlyEof
                // errType是 MediaError时，对应errDetail是MediaMSEError
                  console.log('网络错误');
                  console.log(errType);
                  console.log(errDetail);
              });
             /* this.player.on(flvjs.Events.STATISTICS_INFO, (errType, errDetail) => {
                // errType是 NetworkError时，对应errDetail有：Exception、HttpStatusCodeInvalid、ConnectingTimeout、EarlyEof、UnrecoverableEarlyEof
                // errType是 MediaError时，对应errDetail是MediaMSEError
                //  console.log('播放统计信息',errType);
                  if(errType.decodedFrames===0){
                    this.countDecodedFrames = this.countDecodedFrames + 1;
                    if(this.countDecodedFrames + 1>=10){
                      console.log('解码帧数为0，十次重新拉流'+this.videoID);
                     // this.flvDestroy();
                     // this.flvLoad();
                       this.countDecodedFrames = 0;
                    }
                  }
              });*/
              this.$refs.player.addEventListener('pause', (e) =>{
                  this.$refs.player.play();
                  //this.flvOverload()
              });

            } catch (error) {
                console.log('错误',error);
            };
        }

      }else{
          alert('您的游览器不支持H5视频播放');
      }
    },
    test(){
      console.log('test');
    },
    pause(){
      if(this.isPlay){
        this.player.pause();
        this.isPlay = false;
      }else{
        this.player.play();
        this.isPlay = true;
      }

    },
    childUp(name) {
      this.$emit('mousedown',name);
    },
    childDown(name) {
      this.$emit('mouseup',name);
    },
    setCountData( sw ,sh ,w ,h ,x ,y , camerid){
      //console.log('camerid',camerid,'videoID',this.videoID)
      if(camerid !== this.videoID){
        this.isVideoAIBox = false;
        return
      }
   //   console.log('player',this.$refs.player.offsetWidth)
      if(!this.$refs.player.offsetWidth||!this.$refs.player.offsetWidth){
        return
      }
      let videoWidth = this.$refs.player.offsetWidth;
      let videoHeight =  this.$refs.player.offsetHeight;

      this.isVideoAIBox = true;

      this.setVideoAIBox((videoWidth/sw)*x,(videoHeight/sh)*y,(videoWidth/sw)*w,(videoHeight/sh)*h);
     // console.log('通过')



    },
    setVideoAIBox( x ,y , width , height ){

       width = width?width:20;
       height = height?height:20;
        //console.log(this.$refs.player.offsetHeight , y);
      /*if(this.$refs.player.offsetWidth < x || this.$refs.player.offsetHeight < y ){
        console.log('超出范围')
         this.isVideoAIBox = false;
        return
      }
      if( this.$refs.player.offsetWidth < x + width || this.$refs.player.offsetHeight < y + height ){
         console.log('超出范围')
         this.isVideoAIBox = false;
        return
      }*/
      this.$refs.VideoAIBox.style.top = y  + 'px';
      this.$refs.VideoAIBox.style.left = x + 'px';

      this.$refs.VideoAIBox.style.width = width + 'px';
      this.$refs.VideoAIBox.style.height = height + 'px';

    },
    flvReload(){
      this.flvDestroy();
      this.flvLoad();
    },
    flvLoad(){
      if(this.isBird.is){
         this.flvInit(this.videoSrc);
         return
      }
      console.log(this.hash);
      this.service.post('/video/rtspAgent',{
          "url":url
      })
      .then(json=>{
        console.log(json);
        this.flvInit(json.data);
      }).catch(err=>{
        this.$notify({
          title: '网络错误',
          message: '推流地址网络请求失败,'+'摄像头id：'+this.videoID,
          type: 'warning'
        });
        console.log(err,'推流地址网络请求失败');
      })
    },
    flvDestroy(){
      this.player.pause();
      this.player.unload();
      this.player.detachMediaElement();
      this.player.destroy();
      this.player = null;
    },
    randomString(len, charSet) {
      charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var randomString = '';
      for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
      }
      return randomString;
    },
    isOpenVideoPicInPic(){
      //let i = this.MyisOpenVideoPicInPic;

      if(!document.pictureInPictureElement){
        this.$refs.player.requestPictureInPicture()
        .then(res=>{
           this.MyisOpenVideoPicInPic = !this.MyisOpenVideoPicInPic;
        })
        .catch(error => {
          console.log(error,'Video failed to enter Picture-in-Picture mode.');
        });

      }else{
        document.exitPictureInPicture().then(res=>{
          this.MyisOpenVideoPicInPic = !this.MyisOpenVideoPicInPic;
        }).catch(e=>{
           this.MyisOpenVideoPicInPic = true ;
        });
         //this.MyisOpenVideoPicInPic = true;
      }

    },
        	// 进入全屏
    fullScreen(element){
       // this.isEnlarge = true;
        var doc = element;
       //  doc.webkitRequestFullScreen();
       //  return
        if (doc.requestFullscreen) {
          console.log(1);
            doc.requestFullscreen();
        } else if (doc.mozRequestFullScreen) {
          console.log(2);
            doc.mozRequestFullScreen();
        } else if (doc.webkitRequestFullScreen) {
            console.log(3);
            doc.webkitRequestFullScreen();
        }
    },
    // 退出全屏
    exitFullScreen(){

        var doc = document;
        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        } else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
        } else if (doc.webkitCancelFullScreen) {
            doc.webkitCancelFullScreen();
        }
    },
    enlargeVideo(){
      //console.log('cccc')
    if(this.isEnlarge){
       this.exitFullScreen(this.$refs['playerDiv'])
    }else{
       this.fullScreen(this.$refs['playerDiv'])
    }
    //  this.videoWidth = this.videoWidth==='400px'?document.body.offsetWidth + 'px':'400px' //this.videoWidth==='auto'?'400px':'auto'

    //this.videoWidth = this.videoWidth==='400px'?  '1200px':'400px'
     // this.$emit('enlarge')
    },
    isEnlargeFun(){
      if (document.fullscreenElement) {
        console.log('进入全屏')
        this.isEnlarge = true;
      } else {
        console.log('退出全屏')
        this.isEnlarge = false;
      }

    },
    runPtz(name){
        console.log(this.videoID)
        let obj = {
        'childLeft':23,
        'childUp':21,
        'childRight':24,
        'childDown':22,
        'childZoomIn':11,
        'childZoomOut':12
      }
      this.service.post('/ship/startPTZ',{
            cameraId:this.videoID,
            dwPTZCommand:obj[name],
      })
      .then(json => {
          console.log(json)
      })
    },
    stopPtz(name){
        let obj = {
            'childLeft':23,
            'childUp':21,
            'childRight':24,
            'childDown':22,
            'childZoomIn':11,
            'childZoomOut':12
        }
      this.service.post('/ship/stopPTZ',{
            cameraId:this.videoID,
            dwPTZCommand:obj[name],

      })
      .then(json => {
          console.log(json)
      })
    },
    pTZControl(command,action,indexCode){
      this.service.post('/artemis/pTZControl',{
          action:parseInt( action ),
          command:command,
          cameraIndexCode :indexCode,
          //speed:4
      })
    },
    switchVideoUrl(url){
     // this.videoSrc = url;
      this.flvDestroy();
      if(this.isBird.is){
         this.flvInit(url);
         return
      }
      //console.log(this.hash);
      this.service.post('/video/rtspAgent',{
          "url":url
      })
      .then(json=>{
        console.log(json);
        this.flvInit(json.data);
      }).catch(err=>{
        this.$notify({
          title: '网络错误',
          message: '推流地址网络请求失败,'+'摄像头id：'+this.videoID,
          type: 'warning'
        });
        console.log(err,'推流地址网络请求失败');
      })
    },
    switchExtraChannels(){
      console.log(this.extraChannels,this.switchINum)
      this.switchVideoUrl(this.extraChannels[this.switchINum].videoUrl)

      this.switchINum++

      if(this.switchINum>=this.extraChannels.length){
        this.switchINum = 0;
      }
    },
    getXgdVideoPosition(id){
      if( id===1 || id===2 ){

        this.initWebSocket()
      }
    },
    initWebSocket(){ //初始化weosocket
      const wsuri = "ws://218.205.125.100/zfw/websocket";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen(){ //连接建立之后执行send方法发送数据
      console.log('websock 连接成功');
      let position = {action:'position',data:{}};
      this.websocketsend(JSON.stringify(position));
    },
    websocketonerror(){//连接建立失败重连
      console.log('连接建立失败重连')
      this.initWebSocket();
    },
    websocketonmessage(e){ //数据接收
      const redata = JSON.parse(e.data);
      if(redata.action === "position"){
        let data = redata.data;
          //console.log('数据接收',data);

        this.setCountData(data.sw,data.sh,data.w,data.h,data.x,data.y,data.camerid)
        //console.log(this.$refs.CameraVideoView)
        //  this.$refs.CameraVideoView.forEach( ref => ref.setCountData(data.sw,data.sh,data.w,data.h,data.x,data.y,data.camerid))
          //console.log(this.$refs.CameraVideoView)
          //console.log(this.$refs.CameraVideoView)
        // this.$refs.CameraVideoView.setCountData(data.sw,data.sh,data.w,data.h,data.x,data.y,data.camerid);

      }
      ///console.log('数据接收 type:',redata)
    },
    websocketsend(Data){//数据发送
      console.log('数据发送',Data)
      this.websock.send(Data);
    },
    websocketclose(e){  //关闭
      console.log('断开连接',e);
    },
  }
}
</script>

<style scoped  >
    .videoDiv {
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
     /* background-color: #303f5f;
      background: linear-gradient(rgb(137, 173, 254) 0%, rgb(71, 124, 248) 100%);*/
      padding: 5px;
      margin: 5px;

    }
    .demo-video {
        width: 100%;
        /*max-height: 660px;*/
    }
    .ordinaryDiv {
      height: 100%;
      text-align: center;
    }
    .ordinaryDiv .MyButton {
      padding: 0px;
      margin: 3px;
      border-radius: 25px;
    }
    .textColor {
     /* color: #eee;*/
      margin-bottom: 5px;
      text-align: left;
    }
    .VideoAIBox{
      width: 20px;
      height: 20px;
      border: 1px solid #ff0000ab;
    }
    .container {
        display: grid;
        grid-template-rows: auto 1fr auto;
    }
    /*video::-webkit-media-controls-timeline {
      display: none;
    }
    video::-webkit-media-controls-current-time-display{
      display: none;
    }*/


</style>
