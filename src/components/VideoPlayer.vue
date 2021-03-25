<template>
  <div class="video-player-mian" :style="{width:width,'max-width':maxWidth }"><!-- 'max-width':maxWidth -->
    <div class="menu-video">
      <video class="play-box-video" ref="player" id='player' muted autoplay>
        <div>
          视频无法播放
        </div>
      </video>
      <div class="menu-video-control">
        <div class="menu-video-control-btn-box">
          <div style="border:2px solid #ebeef547">

          </div>
          <div class="menu-video-btn-list" >
            <div class="menu-video-btn-list-item" style="justify-content: left;">
              <button class="menu-video-btn" @click="flvAllLoad()"><i class="el-icon-refresh-right"></i></button>
              <span style="padding-top: 3px;color:#eee;">00:00/00:00</span> 
            </div>
            <div></div>
            <div class="menu-video-btn-list-item">
              <button class="menu-video-btn" v-if='cameraType/1000 !== 1 && cameraType/1000 === 2 || cameraType/1000 === 3' @mousedown='controlPtz("11",false)' @mouseup='controlPtz("11",true)'><i class="el-icon-zoom-in"></i></button>
              <button class="menu-video-btn" v-if='cameraType/1000 !== 1 && cameraType/1000 === 2 || cameraType/1000 === 3' @mousedown='controlPtz("12",false)' @mouseup='controlPtz("12",true)'><i class="el-icon-zoom-out"></i></button>

              <button class="menu-video-btn" v-if='cameraType/1000 !== 2 && cameraType/1000 === 1 || cameraType/1000 === 3' @mousedown='controlPtz("23",false)' @mouseup='controlPtz("23",true)'><i class="el-icon-arrow-left"></i></button>
              <button class="menu-video-btn" v-if='cameraType/1000 !== 2 && cameraType/1000 === 1 || cameraType/1000 === 3' @mousedown='controlPtz("24",false)' @mouseup='controlPtz("24",true)'><i class="el-icon-arrow-right"></i></button>
              <button class="menu-video-btn" v-if='cameraType/1000 !== 2 && cameraType/1000 === 1 || cameraType/1000 === 3' @mousedown='controlPtz("22",false)' @mouseup='controlPtz("22",true)'><i class="el-icon-arrow-down"></i></button>
              <button class="menu-video-btn" v-if='cameraType/1000 !== 2 && cameraType/1000 === 1 || cameraType/1000 === 3' @mousedown='controlPtz("21",false)' @mouseup='controlPtz("21",true)'><i class="el-icon-arrow-up"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="video-loading" v-show="isLoadIn" style="color:#EEE">
      <div class="loader"></div>
    </div>
     <!-- cameraType/1000 !== 1 && cameraType/1000 === 2 || cameraType/1000 === 3
          cameraType !== 1 && cameraType === 2 || cameraType === 3

          cameraType/1000 !== 2 && cameraType/1000 === 1 || cameraType/1000 === 3
       <div v-for="(value,index) in overlayBoxData.shapes"
        :key='index' ref='VideoAIBox'
        class="video-AI-box" v-show="!isLoadIn&&aiBoxShow&&rtsp===overlayBoxData.rtsp"
        style="position: absolute;"
        :style="getStyleObj(overlayBoxData.videoWidth,overlayBoxData.videoHeight,value,index,'VideoAIBox')"
      >{{value.str?value.str:''}}
      <div v-for="(itemValue,itemIndex) in value.list " :key='itemIndex' style="position: absolute;"
          :style="{
            top:getStyleTop(myVideoHeight,overlayBoxData.videoHeight,itemValue.y),
            left:getStyleLeft(myVideoWidth,overlayBoxData.videoWidth,itemValue.x)
          }" >overlayBoxData.shapes.filter(e=e.type===3)controls
      </div>
    </div>-->
    <svg v-show="!isLoadIn&&aiBoxShow&&rtsp===currentMakers.rtsp" :width='myVideoWidth' :height='myVideoHeight+75' xmlns="http://www.w3.org/2000/svg" version="1.1" style="position: absolute;left: 0;top:0;height: 100%;width: 100%;">
      <circle @click="test" :cx="parseInt( ( myVideoWidth / parseInt(currentMakers.videoWidth) ) * parseInt(value.list[0].x))" 
              :cy="parseInt( ( myVideoWidth / parseInt(currentMakers.videoWidth) ) * parseInt(value.list[0].y))" :r="value.radius" v-for="(value,index) in getShapesArrForType(0)" :key="index+4" 
              :style="{stroke:value.color, fill:parseInt(value.size)<0?value.color:'rgba(255, 0, 255, 0)', 'stroke-width': value.size}"></circle>
      <polygon  v-for="(value,index) in getShapesArrForType(1)" :key="index+1"
                :points="getPolygonRectangle(currentMakers.videoWidth)(value.x1,value.y1,value.x2,value.y2)"
                :style="{stroke:value.color, fill:parseInt(value.size)<0?value.color:'rgba(255, 0, 255, 0)', 'stroke-width': value.size}"></polygon>
      <polyline  v-for="(value,index) in getShapesArrForType(2)" :key="index+2"
          :points="getPolygonPoints(value.list)"
          :style="{stroke:value.color, fill:value.size<0?value.color:'rgba(255, 0, 255, 0)', 'stroke-width': value.size}"/>

      <polygon  v-for="(value,index) in getShapesArrForType(3)" :key="index+3"
                :points="getPolygonPoints(value.list)"
                :style="{stroke:value.color, fill:value.size<0?value.color:'rgba(255, 0, 255, 0)', 'stroke-width': value.size}"/>

      <text :x="parseInt( ( myVideoWidth / parseInt(currentMakers.videoWidth) ) * parseInt(value.x))"  v-for="(value,index) in getShapesArrForType(4)" :key='index+5'
            :y="parseInt( ( myVideoWidth / parseInt(currentMakers.videoWidth) ) * parseInt(value.y))"
            :style="{stroke:value.color}">{{value.str}}</text>
      <!-- fill:value.size<0?value.color:'rgba(255, 0, 255, 0)', 'stroke-width': value.size -->

      <svg v-for="(value,index) in getShapesArrForType(100)" :key="index">

        <polyline  v-for=" (item,myIndex) in getPeoplePoints(value.list)" :key="myIndex"
            :points="item"
            :style="{stroke:value.color, fill:value.size<0?value.color:'rgba(255, 0, 255, 0)', 'stroke-width': value.size}">
        </polyline>

      </svg>

    </svg>
  </div>
</template>
<script>
import flvjs from "flv.js";
 

export default {
  name: 'VideoPlayer',
  props:{
   width:{
     type:String,
     default:'100%'
   },
   maxWidth:{
     type:String,
     default:'100%'
   },
   rtsp:String,
   serverIp:String,
   id:{
     type:[String,Number],
     default:'1'
   },
   overlayBoxData:{
     type:Object,
     default:()=>{
       return { shapes:[] }
     }
   },
   aiBoxShow: {
     type:Boolean,
     default:true
   },
   cameraType:{
     type:[Number],
     default:3000
   }
  },
  computed:{
    wAndh:function(){
      return 100/(this.myVideoWidth/this.myVideoHeight)
    }
  },
  watch:{
    overlayBoxData(val){
      this.myVideoWidth   = this.$refs.player.offsetWidth;
      this.myVideoHeight  = this.$refs.player.offsetHeight;

      if( val.rtsp === this.rtsp ){
        this.currentMakers = val;
      }
    },
    rtsp(val){
      this.flvAllLoad(val)
    }
  },
  mounted(){
    console.log('加载视频组件')
    this.flvAllLoad()
    //let { rtsp , serverIp , id } = this
    //this.flvInit('rtsp://10.80.16.118/BI9k1hsO','218.205.125.185:8888',1)
    //this.flvInit(rtsp,serverIp,id)
    /*window.addEventListener('resize', ()=> {
      this.myVideoWidth   = this.$refs.player.offsetWidth;
      this.myVideoHeight  = this.$refs.player.offsetHeight;
    })*/
  },
  beforeDestroy(){
    this.flvDestroy()
  },
  data(){
    return {
      player:null,
      videoAIBoxArr:[],
      myVideoWidth:0,
      myVideoHeight:0,
      isLoadIn:true,
      currentMakers:{},
      testData:{
        '1':{}
      }
    }
  },
  methods:{
    test(){
      console.log('xxxx')
    },
    flvInit(rtsp,myUrl,videoID){
     // console.log(rtsp)
      if (flvjs.isSupported()) {
        let video = this.$refs.player;

        if (video) {
          this.isLoadIn = true //视频加载状态改变
         // console.log(flvjs.getFeatureList())
          this.$refs.player.playbackRate = 1.5  ;
            //videoconsolelog(video);
              this.player = flvjs.createPlayer({
                  type: "flv",
                  isLive: true,
                  url: `ws://`+ myUrl + ':8888'+`/rtsp/${videoID}/?url=${rtsp}`,
              },
              {
                 isLive: true,
                 autoCleanupSourceBuffer:true,
                 //enableWorker: true,
                 enableStashBuffer: false,
                 stashInitialSize: 128,
                 duration:3000,
                 //deferLoadAfterSourceOpen:false
              });

              this.player.attachMediaElement(video);
              
            try {
                this.player.load();
                this.player.play();
                 this.myVideoWidth   = this.$refs.player.offsetWidth;
                 this.myVideoHeight  = this.$refs.player.offsetHeight;
                this.$refs.player.addEventListener('playing',(e)=>{
                    console.log("开始播放");
                    this.isLoadIn = false //视频加载状态改变
                    this.myVideoWidth   = this.$refs.player.offsetWidth;
                    this.myVideoHeight  = this.$refs.player.offsetHeight;
                    this.$emit('videoLoadPlay',this.myVideoHeight,this.myVideoWidth)
                });

                //this.isVideoAIBox = true;
                this.$refs.player.addEventListener('error',(err)=>{
                    console.log('视频错误');
                    this.flvAllLoad()
                    //this.flvDestroy();
                    //this.flvLoad();
                    //this.$emit('fatherMethod');
                })
                document.addEventListener('visibilitychange', this.domFunVisibilitychange)
                //let _this = this;
                  video.addEventListener('ended', function(e) {
                    setTimeout(()=>{
                      console.log('视频重载')
                     // _this.flvDestroy();
                     // _this.flvLoad();
                    },5000)
                  })
              this.$refs.player.addEventListener('pause', (e) =>{
                  this.$refs.player.play();
                  //this.flvOverload()
              });
              this.player.on(flvjs.Events.ERROR, (errType, errDetail) => {
                console.log('视频错误')
              });
              //console.log('flv字符串打印',flvjs.ErrorDetails.MEDIA_MSE_ERROR)
              this.player.on(flvjs.ErrorTypes.OTHER_ERROR,(errType, errDetail)=>{
                console.log('视频解析错误')
              })
              this.player.on(flvjs.ErrorDetails.MEDIA_CODEC_UNSUPPORTED, (errType, errDetail) => {
                console.log('视频错误')
              });
              this.player.on('error', err => {
                console.log('err', err);
              });
              /*this.$refs.player.addEventListener("timeupdate",(e)=>{
                  var timeDisplay;
                //用秒数来显示当前播放进度
                timeDisplay = Math.floor(this.$refs.player.currentTime);
                //console.log(Math.floor(this.$refs.player.currentTime) ,this.$refs.player.currentTime)
                  //当视频播放到 4s的时候做处理
                if(timeDisplay == 4){
                        //处理代码
                    // this.setVideoAIBox((40/10)*1,(40/10)*1,(40/10)*1,(40/10)*1);
                }
              },false);*/

            } catch (error) {
                console.log('错误',error);
            };
        }

      }else{
          alert('您的游览器不支持H5视频播放');
      }
    },
    flvAllLoad(val){
      let { rtsp , serverIp, id , flvDestroy , flvInit } = this;
      let isRtsp = val?val:rtsp;
      if(this.player){
        flvDestroy();
        this.player = null;
      }
      flvInit(isRtsp,serverIp,id)
    },
    flvDestroy(){
      this.player.pause();
      this.player.unload();
      this.player.detachMediaElement();
      this.player.destroy();
      this.player = null;
    },
    getPolygonRectangle(videoWidth)/* 获取对角线 */{
      let sim = ( this.myVideoWidth / parseInt(videoWidth) )
      return (x1,y1,x2,y2)=>{
        x1 = parseInt(sim * parseInt(x1));
        y1 = parseInt(sim * parseInt(y1));
        x2 = parseInt(sim * parseInt(x2));
        y2 = parseInt(sim * parseInt(y2));
        if(isNaN(x1)||isNaN(y1)||isNaN(x2)||isNaN(y2)){
          console.log(x1,y1,x2,y2)
          return []
        }
        return [
                x1,y1,
                x1,y2,
                x2,y2,
                x2,y1
              ]
      }
    },
    getPolygonPoints(list)/* 获取点 */{
      let arr = []
      let sim = ( this.myVideoWidth / parseInt(this.currentMakers.videoWidth) )

      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        if(isNaN(parseInt(element.x)*sim)){
          break
        }
        arr.push( parseInt( parseInt(element.x) *sim ) )
        arr.push( parseInt( parseInt(element.y) *sim ) )
      }
      if(arr.length<list.length){
        return []
      }
      return arr
    },
    getAllPeoplePolyline(allList){
      let obj = {...allList};
      let arr = [];
      for (let i = 0; i < allList.length; i++) {
        arr.push(this.getPeoplePoints(allList[i].list))
      }
      obj.list = arr
      return obj
    },
    getPeoplePoints(list) /* 获取人型数据 */ {
      let sim = ( this.myVideoWidth / parseInt(this.currentMakers.videoWidth) )
      let head     = [3,1,0,2,4]  //头
      let leftArm  = [8,6,5]      //左手臂
      let rightArm = [0,5,7,9]    //右手臂
      let rightLeg = [5,11,13,15] //右腿
      let leftLeg  = [5,10,12,14] //左腿
      let peopleArr = [head,leftArm,rightArm,rightLeg,leftLeg]
      let pointPeopleArr = []

      for (let i = 0; i < peopleArr.length; i++) {
        const element = peopleArr[i];
        let arr = []
        for (let j = 0; j < element.length; j++) {
          arr.push( parseInt( parseInt(list[element[j]].x) * sim ) )
          arr.push( parseInt( parseInt(list[element[j]].y) * sim ) )
        }

        pointPeopleArr.push(arr);
      }

      return pointPeopleArr
    },
    getShapesArrForType(type){
      if(!this.currentMakers.shapes){
        return []
      }
      return this.currentMakers.shapes.filter(e=>e.type==type)
    },
    getNumsText(){
      let sim = ( this.myVideoWidth / parseInt(this.currentMakers.videoWidth) )
      let textArr = [];
      let i = 0
      if(!this.currentMakers.shapes){
        console.log(this.currentMakers,'无')
        return []
      }
      this.currentMakers.shapes.forEach(e=>{
        let x = e.list?e.list[0].x:e.x1?e.x1:e.x

        textArr.push({
          id:i,
          nums:e.nums,
          color:e.color,
          x:parseInt( parseInt(
            e.list?e.list[0].x:e.x1?e.x1:e.x
          ) * sim ),
          y:parseInt( parseInt(
            e.list?e.list[0].y:e.y1?e.y1:e.y
          ) * sim )
        })
        i++
      })
      return textArr
    },
    
    controlPtz(command,is,speed = 4)/* 控制云台转动 */{

      // if(is==true){
      //   console.log('is',is)
      //    this.$axios({
      //       method: 'post',
      //       // url: `ws://218.205.125.185:8888/rtsp/1/?url=rtsp://218.205.125.185/vc85Yl2c`,
      //       url:"http://218.205.215.100/zfw/zczj/dist/ptzstart",
      //       data: {
      //           "cameraId": this.id,
      //           "command": command,
      //           "isStop": is,
      //           "speed": speed 
      //       }
      //     }).then((res) => {});
      // }else{
      //     // this.$httpWrapPOST('/nvr/controlPtz', { 
      // this.$axios({
      //       method: 'post',
      //       // url: `ws://218.205.125.185:8888/rtsp/1/?url=rtsp://218.205.125.185/vc85Yl2c`,
      //       url:"http://218.205.215.100/zfw/zczj/dist/ptzstop",
      //       data: {
      //           "cameraId": this.id,
      //           "command": command,
      //           "isStop": is,
      //           "speed": speed 
      //       }
      //     }).then((res) => {});
      // }
      
    this.service.post('/nvr/controlPtz', {    
        "cameraId": this.id,
        "command": command,
        "isStop": is,
        "speed": speed } )

    }
  }
}
/*
{
 "color":"#FF00FF",
 "size":10,
 "type":1,
 "list":[]
}

type:
0 圆 (x,y,radius)
1 矩形 (x1,y1,x2,y2)
2 线段 (x1,y1,x2,y2)
3 多边形 (list -> x,y)
4 文字 (str,x,y)
100 人

{
 "time":123,
 "shapes":[]
}

*/
</script>
<style scoped>
.menu-video {
  position: relative;
}
/*.menu-video:hover .menu-video-control{
  
}*/
.menu-video-control {
  opacity:0;
  position: absolute;
  top: 0;
  left: -1px;
  width: 100.2%;
  height: 99.7%;
  transition: all .15s;  
}
.menu-video-btn {
  background: #f0f8ff00;
  color: aliceblue;
  font-size: 16px;
  outline: none;
  cursor: pointer;
}
.menu-video-control:hover {
  opacity:1
}
.menu-video-control-btn-box {
  position: absolute;
  bottom: 0;
  width: calc(100% - 20px);
  padding: 0 10px;
  height: 50px;
  background-image: linear-gradient(
   rgba(238, 238, 238, 0) ,
   #222  
  );
}
.menu-video-btn-list {
  height: calc(100% - 4px);
  display: grid;
  /* place-content: center; */
  grid-template-columns: 20% 40% 40%;
}
.menu-video-btn-list-item {
  display: grid;
  align-content: center;
  justify-content: end;
  padding-right: 10px;
  grid-auto-flow: column;
  grid-gap: 0px 10px;
}
.play-box-video {
  width: 100%;
  outline: none;
}
.video-player-mian{
  /*height: 100%;*/
  /*width: 100%;*/

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.video-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /*background: #30313385;*/
}
.loader{
    position: absolute;
    top: calc( 50% - 50px);
    left: calc( 50% - 50px);
    display: inline-block;
    border:16px solid #f3f3f3;
    border-radius:50%;
    border-top:16px solid #31889400;
    width:100px;
    height:100px;
    /* animation-name:load; */
    animation:load 2s linear infinite;
}
@keyframes load{
    0%{
        transform: rotate(0deg);
    }
    100%{
        transform:rotate(360deg);
    }
}
</style>
