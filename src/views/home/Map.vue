<template>
   <div id="home">
       <div id="map" ></div>
        <!-- 折叠开关国家显示-->
            <div  id="countrySigns" style="position: absolute;top: 3%;z-index: 400;left: 2%;background: #0075EE;width:37px;height:30px;" v-drag>
                <country-signs @flag='flag()'></country-signs>
            </div>
        <!-- 搜索框 -->
         <div class="query-input"  style="position: absolute;top: 3%;z-index: 400; right: 2%;">
                <el-input  placeholder="请输入船舶名称或MMSI" style="width: 200px;" class="filter-item" 
                @input="query()"/>
                <el-button style="background:#0075EE;font-size:14px;width:20px;" type="primary" icon="el-icon-search" @click="query()" >
                  搜索
                </el-button>
         </div>
       <!--     海量点-->
       <img :src="pointCollectionImg" alt=""  style="position: fixed;left: 20px;top: 94px;z-index: 400;pointer-events: none;" v-show="showPointCollectionImg">
       <!--     地图类型切换-->
       <div class="ButtonGroupDiv"  style="position: absolute; right: 30px;bottom: 5%;z-index: 400;">
           <ButtonGroup item1Text='地图' item2Text='卫星图' item3Text='海图' @clickItem='buttonGroupClickItem'/>
       </div>
       <!--      mapSigns 地图图例-->
       <div  id="mapSigns" style=" position: absolute;right:8px; bottom:35%;z-index: 400;" v-drag>
           <map-signs></map-signs>
       </div>
       <!-- 放大缩小的按钮 -->
       <div  id="mapControl" style=" position: absolute;right: 10px; bottom:24%;z-index: 400;">
           <mapControl v-model="mapZoom" @add="map.setZoom(map.getZoom()+1)" @minus="map.setZoom(map.getZoom()-1)" :ship="areaShipData.length"></mapControl>
       </div>
       <!-- 目标等6个图例 -->
       <div style="right: 0%;  top: 9%;  position: absolute;  z-index: 400;  background: #FAFAFA;   border-radius: 10px 0px 0px 10px;" ref='dropdown'>
           <Dropdown v-for="(item,index) in dropdownTitleData" @iconClick='dropdownButton' :item='item' :key="index"
                     :title='item.title' :titleIcon='item.icon' :dropdownData='item.dropdownInfoData'
                     @clickItem='' ref="dropDown"/>
       </div>

        <!--      图层（筛船）显示 覆盖物图层选择-->
       <div  id="selectMarker" style=" position: absolute;right: 5%; top:20%;z-index: 400;width: 350px"  v-drag v-show="showSelectMarker">
           <SelectMarker @selectMarker="selectMarker" @hide='showSelectMarker=false'  close-on-click-modal></SelectMarker>
       </div>
            <!-- 海域 -->
        <div  id="selectMarker1" style=" position: absolute;right: 5%; top:20%;z-index: 400;width: 350px"  v-drag >
           <SelectMarker1></SelectMarker1>
       </div>
       <!-- 船只信息 -->
       <div  style="height: auto;width: auto;position: absolute;left: 23%; top:10%;z-index: 500;" id='ShipDataInfo' v-drag v-show="showInfo.ship">
           <ShipInfoView :shipTabObj='dialogInfo.ship'
                         @remove='showInfo.ship=false'
                         @isFocus="infoViewFocus"
                         @track='shipTrack'
                         @histroy='showInfo.shipHistory=true'
                         @shipDetail='shipDetail'
           />
       </div>
       <!-- 船只详细信息 -->
       <div  style="height: auto;width: auto;position: absolute;left: 26%; top:15%;z-index: 500;" id='ShipDetail' v-drag v-show="showInfo.shipDetail">
           <ShipDetailView :shipTabObj='dialogInfo.shipDetail'
                           @remove='showInfo.shipDetail=false'
           />
       </div>

       <!-- 船舶跟踪轨迹时间选择 -->
       <div  style="height: auto;width: auto;position: absolute;right: 10%; top:45%;z-index: 500;"  v-drag v-show="showInfo.shipHistory">
           <ShipHistory
                   :targetName="dialogInfo.ship.mmsi"
                   @yes='setShipHistory'
                   @no='animateLayer.clearLayers()'
                   @destroy="()=>{showInfo.shipHistory=false,animateLayer.clearLayers()}"
           />
       </div>

       <!--            船舶密度功能-->
       <!-- <div  id="shipCount"  style="width: 100%;height: 100%;position: absolute;right: 0; top:0;z-index: 400;" v-show="showShipCount" >
           <ShipCount @hide="showShipCount=false" v-model="shipCountData"></ShipCount>
       </div> -->
       <!--            船舶统计功能-->
       <div  id="shipAreaCount"  style="width: 500px;height: 250px;position: absolute;right: 35%; top:10%;z-index: 400;" v-show="showShipAreaCount" >
           <ShipAreaCount @hide="showShipAreaCount=false,drawLayer.clearLayers()" v-model="shipAreaCountData"></ShipAreaCount>
       </div>

       <!-- 锚地 信息框 -->
       <div  id='anchInfoView'  style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500"   v-drag v-show="showInfo.anchorage">
           <AnchInfoView
                   :tabObj='dialogInfo.anchorage'
                   titleName=''
                   @remove='showInfo.anchorage=false'
                   @showAnchArea='showAnchArea'
                   @isFocus="infoViewFocus"
           />
       </div>
       <!-- 码头泊位 信息框 -->
       <div  id='pierInfoView'  style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500"   v-drag v-show="showInfo.berth">
           <PierInfoView
                   :tabObj='dialogInfo.berth'
                   titleName=''
                   @remove='showInfo.berth=false'
                   @isFocus="infoViewFocus"
           />
       </div>
       <!-- 港区 信息框 -->
       <div  id='portInfoView'  style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500"   v-drag v-show="showInfo.port">
           <PortInfoView
                   :tabObj='dialogInfo.port'
                   titleName=''
                   @remove='showInfo.port=false'
                   @isFocus="infoViewFocus"

           />
       </div>
       <!-- 海底光缆 信息框 -->
       <div  id='seaLineInfoView'  style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500" v-drag v-show="showInfo.seaLine">
           <SeaLineInfoView
                   :tabObj='dialogInfo.seaLine'
                   titleName=''
                   @remove='showInfo.seaLine=false'
                   @isFocus="infoViewFocus"
           />
       </div>

       <!-- 资源站 信息框 -->
       <div  id='stationInfoView'  style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500"   v-drag v-show="showInfo.station">
           <StationInfoView
                   :tabObj='dialogInfo.stationInfo'
                   titleName=''
                   @remove='showInfo.station=false'
                   @isFocus="infoViewFocus"
           />
       </div>
       <!-- radar 信息框 -->
       <div  id='radarInfoView'  style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500"   v-drag v-show="showInfo.radar">
           <RadarInfoView
                   :tabObj='dialogInfo.radar'
                   titleName=''
                   @remove='showInfo.radar=false'
                   @info='radarShipView'
                   @isFocus="infoViewFocus"
           />
       </div>
       <!-- radar表格信息 -->
       <div  class="radarShipDataInfo" style="height: auto;width: auto;position: absolute;left: 23%; top:10%;z-index: 500" v-drag @mouseover='' @mouseout="" v-show="showInfo.radarShip">
           <RadarDataTabView
                   :tableData='socketRadarShipData'
                   :titleName='dialogInfo.radar.name'
                   @remove='showInfo.radarShip=false'
           />
       </div>

       <!-- Ais 信息框 -->
       <div  id='aisInfoView'  style="height: auto;width: 400px;position: absolute;left: 23%; top:10%;z-index: 500"  v-drag v-show="showInfo.ais">
           <AisInfoView
                   :tabObj='dialogInfo.ais'
                   titleName=''
                   @remove='showInfo.ais=false'
                   @info='aisShipView'
                   @isFocus="infoViewFocus"
           />
       </div>
       <!-- AIS表格信息 -->
       <div   style="height: auto;width: auto;position: absolute;left: 23%; top:10%;z-index: 500"  v-drag v-show="showInfo.aisShip">
           <AisDataTabView
                   :tableData='dialogInfo.aisShipTable'
                   :titleName='dialogInfo.ais.name'
                   @remove='showInfo.aisShip=false'
           />
       </div>
       <!--摄像头视频-->
       <div  id='CameraVideoView' :style="{width: videoWidth}" style="height: auto;width: auto;position: absolute;right: 2%; top:10%;z-index: 500" v-drag v-show="showInfo.camera">
           <VideoView
                   v-for="(itme,index) in dialogInfo.camera" :key="index"
                   :videoName="itme.name"
                   :background="'#2770D4'"
                   :isBird="{is:false}"
                   :videoID='itme.id' :videoSrc='itme.videoUrl'
                   @enlarge='enlargeVideo'
           />
           <el-button type="text" @click="showInfo.camera=false"
                      style="position: absolute;top: 1px;right: 10px;color: #eee;">X
           </el-button>
       </div>

        <!-- 左侧抽屉 -->

       <!-- <div  id="leftDrawerView"  style="width: 440px;height: calc(100% - 121px);position: absolute;left:82px; top:95px;z-index: 400" :style="{width:showLeft?'440px':'20px'}" >
           <LeftDrawer ref="leftDrawer" :row1="leftDrawerData.row1" :row2="leftDrawerData.row2" :row3="leftDrawerData.row3" :row4="leftDrawerData.row4" v-on:showLeft="showLeft = $event"
                       :station1="leftDrawerData.station1" :station2="leftDrawerData.station2" @searchStation="loadLeftDrawerSearch"
                       @change1="LeftDrawerStationChange1" @showDailyEvent="leftDrawerDailyEvent" :map="map" @shipType="leftDrawerSelectShip"
           ></LeftDrawer>
       </div> -->
         <!-- 当天事件 -->
       <div  id="dailyEventDiag"   v-drag v-show="showDailyEvent" style="height: auto;width: auto;position: absolute;left: 23%; top:10%;z-index: 500">
           <DailyEventDiag  @hide='showDailyEvent=false' :dailyList="dailyEventList" @change1="changeDailyEvent" @search="searchDailyEvent"></DailyEventDiag>
       </div>

   <!--        关注按钮弹窗-->
       <div  id="focusDialog"   v-drag v-show="showInfo.focus" style="height: auto;width: auto;position: absolute;left:5%; top:10%;z-index: 500">
           <FocusDialog  @hide='showInfo.focus=false' :table-data="dialogInfo.focus" @rowClick="focusClick" ></FocusDialog>
       </div>
        <!--            区域分组显示-->
       <div id="groupView" ref='groupView' v-show="showGroupView" style="position: absolute;right: 10%; top:20%;z-index: 500" v-drag>


           <div class="groupViewTitle">
               <div>
                   <p>标绘区域</p>
                   <span @click="showGroupView=false">X</span>
               </div>
           </div>
           <div class="groupViewMain">

               <div class="mainTitle"><p>全部区域设置 <span>{{areaLength}}个</span></p>
                   <el-radio-group v-model="showOrHide" style="margin-top: -1rem;" @change="showAllArea">
                       <el-radio-button label="1">显示</el-radio-button>
                       <el-radio-button label="0">隐藏</el-radio-button>
                   </el-radio-group>
               </div>
               <div class="line"></div>
               <!--                    <div class="mainSearch">-->
               <!--                        <el-input placeholder="请输入区域名称搜索" v-model="search"></el-input>-->
               <!--                        <span @click="showDrawView=true" class="selectAdd">+</span></div>-->
               <div class="mainContent">

                   <group-tree @openDrawView="openDrawView" :map="map" :groupData="groupData" :areaLayer="areaLayer"
                               @allowDrop="" @updateGroupName=""
                               :areaData="areaData" ref="groupTree" @removeArea=''></group-tree>
               </div>

           </div>
       </div>
       <!--            区域绘制-->
       <div id="drawView" ref='drawView' v-show="showDrawView" style="position: absolute;right: 9%; top:30%;z-index: 500" >

           <div class="drawTitle groupViewTitle">
               <div>
                   <p>区域绘制</p>
                   <span @click="closeDraw">X</span>
               </div>
           </div>
           <div class="DrawMain">

               <!--            <div >-->
               <el-form label-position="left" :rules="formRules" status-icon label-width="80px" ref="ruleForm"
                        :model="drawData">
                   <div class="drawItem"><span>形状:</span>
                       <p v-for="(item,index) in DrawType" :key="index" :class="{'acitve':index===isDrawType}"
                          @click="drawArea(item.value,index)">{{item.label}}</p></div>
                   <el-row>
                       <el-col :span="15">
                           <el-form-item label="名称:" prop="name" label-width="60px">
                               <el-input class="nameInput" v-model="drawData.name"
                                         ref="nameInput" size="medium "/>
                           </el-form-item>
                       </el-col>
                   </el-row>
                   <el-row>
                       <el-col :span="15">

                           <el-form-item label="类型:" label-width="60px" prop="lever">
                               <el-select v-model="drawData.lever">
                                   <el-option
                                           v-for="item in watersLevel"
                                           :key="item.value"
                                           :label="item.name"
                                           :value="item.value">
                                   </el-option>
                               </el-select>
                           </el-form-item>
                       </el-col>
                   </el-row>
                   <el-row>
                       <el-col :span="15">

                           <el-form-item label="分组:" label-width="60px" prop="groupId">
                               <el-select v-model="drawData.groupId" placeholder="请选择">
                                   <el-option
                                           v-for="item in groupData"
                                           :key="item.id"
                                           :label="item.label"
                                           :value="item.id">
                                   </el-option>
                               </el-select>
                           </el-form-item>
                       </el-col>
                       <el-col :span="3"><span @click="showAddGroup=true" class="selectAdd selectAdd2">+</span>
                       </el-col>
                   </el-row>
                   <el-row>
                       <el-col :span="15">

                           <el-form-item label="描述:" label-width="60px">
                               <el-input v-model="drawData.description"
                                         type="textarea"/>
                           </el-form-item>
                       </el-col>
                   </el-row>
                   <div class="drawItem" v-show="drawData.positions[0]"><span>+新增点
                            <el-button  icon="el-icon-edit" circle size="mini" style="height: 27px;" @click="disabledDraw=false,drawData.preview=true" v-show="!drawData.preview"></el-button>
                            <el-button   type="success" icon="el-icon-check" circle size="mini" style="height: 27px;" v-show="drawData.preview" @click="drawPreview"></el-button>
                        </span>
                       <div class="drawRadius drawPos" v-if="isDrawType===0">
                           <el-form-item label="" label-width="0" prop="radius"><input v-model="drawData.radius" :disabled="disabledDraw"/>  <p>半径</p></el-form-item>
                       </div>
                       <div class="drawPos" v-for="(pos,index) in drawData.positions" :key="index">

                           <span>{{index+1}}.</span><input v-model="pos[0]" :disabled="disabledDraw"/>
                           <p>经</p> <input v-model="pos[1]" :disabled="disabledDraw"/>
                           <p>纬</p>
                       </div>


                   </div>
                   <div class="drawItem">
                       <el-button
                               @click="closeDraw">
                           取消
                       </el-button>
                       <el-button type="primary" @click="subDraw('ruleForm')">确认</el-button>
                   </div>
               </el-form>
               <!--            </div>-->
           </div>

       </div>
   </div>
</template>

<script>
  import mapComputeds from './mapComputed';
  import mapWatch from './mapWatch';
  import homeMethods from './methods';
  import mapSocketFun,{mapSocket} from './mapSocket';
  import mapUtils from '../../utils/mapUtils';
  import {mapData} from './mapData';
  import { actions } from './noIf';
  import Dropdown from '../../components/Dropdown.vue'
  import ButtonGroup from '../../components/ButtonGroup.vue'
  import MapControl from '../../components/map/MapControl'
  import SelectMarker from '../../components/map/SelectMarker'
  import SelectMarker1 from '../../components/map/SelectMarker1' //海域
  import ShipCount from '../../components/map/ShipCount'
  import ShipAreaCount from '../../components/map/ShipAreaCount'
  import AnchInfoView from '../../components/map/AnchInfoView'
  import PierInfoView from '../../components/map/PierInfoView'
  import PortInfoView from '../../components/map/PortInfoView'
  import SeaLineInfoView from '../../components/map/SeaLineInfoView'
  import StationInfoView from '../../components/map/StationInfoView'
  import RadarInfoView from '../../components/map/RadarInfoView'
  import RadarDataTabView from '../../components/map/RadarDataTab'
  import AisInfoView from '../../components/map/AisInfoView'
  import AisDataTabView from '../../components/map/AisDataTab'
  import VideoView from '../../components/map/VideoView'
  import LeftDrawer from '../../components/map/LeftDrawer'
  import DailyEventDiag from '../../components/map/DailyEventDiag';
  import ShipInfoView from '../../components/map/ShipInfoView';
  import ShipDetailView from '../../components/map/ShipDetailView';
  import ShipHistory from '../../components/map/ShipHistroyView';
  import FocusDialog from '../../components/map/FocusDialog'

   import groupTree from '../../components/groupTree.vue'
  import MapSigns from '../../components/MapSigns.vue'
  import CountrySigns  from '../../components/CountrySigns .vue'
  import { wgs84ToBD } from '../../utils/coordinateConvert'
  import { formRules } from '../../utils/formRules'
  export default {
    name: 'Map',
    components: {
      Dropdown, ButtonGroup,MapControl,SelectMarker,SelectMarker1,ShipCount,ShipAreaCount,AnchInfoView,PierInfoView,PortInfoView,SeaLineInfoView,StationInfoView,RadarInfoView,RadarDataTabView,
      AisInfoView,AisDataTabView,VideoView,LeftDrawer,DailyEventDiag,ShipInfoView,ShipDetailView,ShipHistory,FocusDialog,groupTree,
      'map-signs': MapSigns,
      'country-signs':CountrySigns 
    },
    data() {
      return {

        ...mapData,...mapSocket,
         formRules: formRules,
      }
    },
    computed:{
      ...mapComputeds,
    },
    watch:{
      ...mapWatch,

    },

    mounted() {
      this.flag()
      this.query()
      this.mapInit()
      this.initWebSocket()
      this.map.setView([30.37892927824675,122.19491755725795], 10);
      console.log(this.$store.getters.user.data)
      this.loadGroupData()
//       L.circle([31.421995400095337,122.84572901429688], { radius: 30000, color: 'red', fillColor: '#f03', fillOpacity: 1 }).addTo(this.map);
      this.stationLayerGroup= new L.FeatureGroup().addTo(this.map);
      this.leftDrawerShipTypeLayer= new L.FeatureGroup().addTo(this.map);
      this.drawLayer= new L.FeatureGroup().addTo(this.map);
      this.planeLayer= new L.FeatureGroup().addTo(this.map);
      this.animateLayer= new L.FeatureGroup().addTo(this.map);
      this.stationLayers = new L.FeatureGroup().addTo(this.stationLayerGroup);
      this.radarLayer = new L.FeatureGroup().addTo(this.map);
      this.focusShipLayer = new L.FeatureGroup().addTo(this.map);
      this.markerLayersGroup = new L.FeatureGroup({}).addTo(this.map);
      this.roadLayer = new L.FeatureGroup({}).addTo(this.markerLayersGroup);
      this.seaLineLayer = new L.FeatureGroup({}).addTo(this.markerLayersGroup);
      this.departmentLayers = new L.FeatureGroup().addTo(this.map);
      for(let i=1;i<11;i++){
        this['orgLayer'+i]=new L.FeatureGroup().addTo(this.departmentLayers)
      }
      // this.map.on('click', function (e) {
      //   //获取点击位置的坐标
      //   var coordinate = [e.latlng.lat, e.latlng.lng];
      //   //弹框提示点击位置的坐标
      //   alert("地图被单击了！点击位置为：" + coordinate);
      // })
      this.loadStationMarker()
      this.loadDefaultMarker()
      this.loadLeftDrawer()
      // this.websocketsend2(JSON.stringify({ action: 'fly' ,data:{}}))
      setTimeout(()=>{
        this.websocketsend(JSON.stringify({action:'allRadar',data:{isshow:1,uid:this.$store.getters.user.data.id}}))

      },500)
     

      // let icon = L.icon({
      //   iconUrl: require('../../assets/history/ship.png'),
      //   iconSize: [40,44],
      //   iconAnchor: [40,44]
      // })

      // var myMovingMarker = L.Marker.movingMarker([[30.446697803690274,121.23364833802734],[31.522516525076792,123.71961012268834]],
      //   [20000],{
      //     icon:icon
      //   }).addTo(this.map);
      // myMovingMarker.start();
      // setTimeout(()=>{ myMovingMarker.pause()},5000)
      // setTimeout(()=>{ myMovingMarker.resume()},8000)

    },
    methods: {
      query(){

      },
      //统计国家数
        flag(){
          this.service.get('/ship/flag').then(res=>{
            console.log("查询到的国家列表",res)
          })
        },
        ...mapUtils,...homeMethods,...mapSocketFun,
      //加载区域船舶
      loadAreaShip(isShow){
        // if(this.initLoadOnce){
          console.log('loadAreaShip')
           console.log(this.$store.getters.user.data.user.id)
          let swne = this.getMapBounds()
          let d = {
            'isshow': isShow,
            //attributionid: this.currentIslandObj.id,
            'maxLat': swne['neLat'],
            'minLat': swne['swLat'],
            'minLon': swne['swLon'],
            'maxLon': swne['neLon'],
            'uid':this.$store.getters.user.data.user.id?this.$store.getters.user.data.user.id:null
          }
          this.service.get('/ship/areaList',{params:{
            ...d
          }}).then(res=>{
            console.log(res)
            if (this.map.getZoom() >= this.maxMapZoom) {
              this.areaShipData = [...res.data.list]
            }

            this.leftDrawerData.row1 = res.data.targetMap.columns
            this.leftDrawerData.row3 = res.data.typeMap
            // console.log(this.leftDrawerData.row3)
            this.leftDrawerData.row3.typeList.forEach(e=>{if(this.leftDrawerShipType.name===e.name)this.leftDrawerShipType.num=e.num;})
          })
        // }
      },
      //初始化海量点
      addShipPointCollection(size, id = -1){
        let swne = this.getMapBounds()
          // console.log(size)
          this.service.post('/ship/drawSeaPoints', {
            width: size.x,
            height: size.y,
            attributionid: id,
            'neLat': swne['neLat'],
            'swLat': swne['swLat'],
            'swLon': swne['swLon'],
            'neLon': swne['neLon']
          }).then(res => {
            // console.log(res,'addShipPointCollection')

            this.pointCollectionImg = res.data
            this.showPointCollectionImg=true
            this.map.dragging.enable();
            // this.map.scrollWheelZoom.enable();
          })
      },
    },
    directives: {
      drag: function(el) {
        let dragBox = el; //获取当前元素
        dragBox.onmousedown = e => {
          //算出鼠标相对元素的位置
          let disX = e.clientX - dragBox.offsetLeft;
          let disY = e.clientY - dragBox.offsetTop;
          document.onmousemove = e => {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            // console.log(e.clientX,e.clientY)
            let left = e.clientX - disX;
            let top = e.clientY - disY;
            if(e.clientY<105){
              top = 110 - disY;
            }
            //移动当前元素
            dragBox.style.cursor = 'all-scroll';
            dragBox.style.left = left + "px";
            dragBox.style.top = top + "px";


          };
          document.onmouseup = e => {
            //鼠标弹起来的时候不再移动
            dragBox.style.cursor = 'default';

            document.onmousemove = null;
            //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
            document.onmouseup = null;
          };
        };
      }
    },
  }
</script>

<style scoped lang="less">
    *{
        margin: 0;
        padding: 0;
    }
 #home{

    //  height: calc(100% - 121px);
    height: 100%;
 }
    #map{
        height: 100%;
    }
    #map /deep/ .radarMarker{
        pointer-events: none;
    }
    #map /deep/ #radarSpin {
        top:  50%;
        left: 50%;
        width: 50%;
        height: 50%;
        animation:turn 3s linear infinite;
        transform-origin: 0% -0%
    }
    @keyframes turn{
        0%{-webkit-transform:rotate(-0deg);}
        25%{-webkit-transform:rotate(-90deg);}
        50%{-webkit-transform:rotate(-180deg);}
        75%{-webkit-transform:rotate(-270deg);}
        100%{-webkit-transform:rotate(-360deg);}
    }
    #map /deep/ .leaflet-div-icon{
    border: none;
        background: transparent;
}
    #map /deep/ #PlaneInfoView {

        background: none;
        pointer-events: none;
        #plane {
            pointer-events: none;
            background: url("../../assets/mapSigns/plane/planeInfoBack.png") no-repeat;
            width: 100%;
            height: 100%;
            background-size: contain;
            color: white;
            padding: 20px;

            .inner {
                width: 80%;
                /*height: 80%;*/
                margin: -10px auto;
                display: grid;
                grid-template-columns: 90% 10%;
                pointer-events: none;
                .title {
                    font-size: 20px;
                    margin-top: 3%;
                }

                .content {
                    pointer-events: none;
                    font-size: 14px;

                    ul {
                        margin-left: 10px;
                        padding: 0;

                    }


                }
            }
        }
    }
/*          区域分组显示        */
    #groupView {
        /*right: 50px !important;*/
        /*top: 10% !important;*/
        display: flex;
        width: 350px;
        height: 691px;
        /*background: white;*/
        background: #305071;
        flex-flow: column;
    }

    .groupViewTitle {

        color: white;
        background: #2770D4;
        width: 100%;
        height: 40px;
    }

    .groupViewTitle div {

        padding: 10px;
    }

    .groupViewTitle p {
        display: inline;
    }

    .groupViewTitle span {

        cursor: pointer;
        float: right;
        font-size: 18px;
    }

    .groupViewMain {
        padding: 15px;
        background: #305071;
    }
    .groupViewMain /deep/.el-input__inner{
        background: transparent;
        color: white;
    }

    .groupViewMain p {
        display: inline;
        color: white;
    }

    .groupViewMain p span:nth-child(1) {
        color: #5586f9;
    }

    .el-radio-group {
        float: right;
    }

    #groupView  /deep/.el-radio-button__inner{
        padding: 5px;
        margin-top: .8rem;
    }
    .line {
        margin-top: 1.5rem;
        width: 100%;
        height: 1px;
        background: #e6e6e6;
        margin-bottom: 1rem;
    }

    .mainSearch {
    }

    .mainSearch .el-input {
        width: 92%;
    }

    .mainSearch .el-input .el-input__inner {
        height: 32px;
        line-height: 32px;
        border-radius: 0;
    }

    .selectAdd {
        /*border-radius: 4px;*/
        text-align: center;
        margin-left: -1px;
        width: 1.4rem;
        display: inline-block;
        height: 30px;
        line-height: 30px;
        border: 1px solid #DCDFE6;
        cursor: pointer;

    }

    .selectAdd2 {
        width: 1.8rem;
        height: 38px;
        line-height: 38px;
    }

    .mainSearch {
    }

    /*添加分组界面*/
    #addGroup {
        right: 170px !important;
        top: 13% ;
        display: flex;
        width: 350px;
        height: 200px;
        background: #ffffff;
        flex-flow: column;
        color: white;
    }

    #addGroup .addGroupItem .el-input__inner {
        width: 60%;
        height: 30px;

    }

    #addGroup .addGroupItem:first-child {
        display: flex;
        justify-content: center;
        text-align: center;
        margin-top: 1rem;
    }

    #addGroup .addGroupItem:last-child {
        margin-top: 2rem;
        /*display: flex;*/
        text-align: center;
    }

    #addGroup .addGroupItem span {

        /*width: 40%;*/
        height: 30px;
        line-height: 30px;
        text-align: right;
        /*margin-right: 1rem;*/
    }

    #addGroup .addGroupItem .el-input {
        width: 60%;
        text-align: left;
        margin-left: 1rem;
    }

    #addGroup .addGroupItem .el-button {

        width: 70px;
        height: 37px;
        line-height: 30px;
        padding: 0;
    }
    .radarShipDataInfo {
        width: 725px;
        height: 270px;
        background: #f2f6fc;
        right: 3% ;
        top: 20% ;
        box-shadow: 2px 4px 2px #000;
    }

    .ship-evens{
        display: grid;
        grid-template-rows: 20% 80%;
        background:#fff;
        height: 150px;
        width: 320px;
        bottom: 47%!important;
        right: 10px!important;
        box-shadow: 2px 2px 2px #222;
    }
    .ship-evens .top{
        background: linear-gradient(rgb(103, 143, 232) 0%, rgb(63, 81, 181) 100%);/*#007584;*/
        color: #eee;
        padding: 5px;
    }
    .ship-evens .main{
        background: #061C2B;
        color: #ffffff;
        padding: 10px;
        overflow: auto;
    }
    .ship-evens .main .box{
        border: #eee dashed 2px;
        /*border-style: dashed;*/
        padding: 2px 35px;
        background: url("../../assets/mapicon/shipEven.png") no-repeat;
        background-size: 100% 100%;
        text-align: center;
        font-size: 13px;
        margin-bottom: 5px;
        cursor: pointer;
    }
    .shipNotify{
        /*width: 280px;*/
        /*height: 50px;*/
        border: #eee dashed 2px;
        /*border-style: dashed;*/
        padding: 2px 35px;
        background: url("../../assets/mapicon/shipEven.png") no-repeat;
        background-size: 100% 100%;
        text-align: center;
        font-size: 12px;
        margin-bottom: 5px;
        cursor: pointer;
    }

    /*        绘制css        */
    #drawView {
        z-index: 999;
        /*background: url("../../assets/dataAnalysis/left1.png");*/
        width: 451px;
        height: 459px;
        /*background: #0a76a4;*/
        /*right: 250px !important;*/
        /*top: 15% !important;*/
        display: flex;
        flex-flow: column;
        background: #305071;
        /*position: relative;*/
    }

    #drawView.drawTitle {
        width: 100%;
        height: 50px;
    }

    .drawTitle span {
        /*width: 30px;*/
        /*height: 50px;*/
        /*text-align: center;*/
        /*line-height: 50px;*/
        /*float: right;*/
        margin-right: 10px;
        /*color: white;*/

        /*!*background: white;*!*/
        /*cursor: pointer;*/
        /*display: flex;*/
        /*position: absolute;*/
        /*right: 0;*/
        /*margin-left: 90%;*/
        /*margin-top: 2%;*/
    }

    .DrawMain {
        width: 86%;
        height: 80%;
        background: #305071;
        color: #ffffff;
        margin: 0 auto;
        max-height: 80%;
        overflow: auto;
    }

    #drawMainContent {
        width: 85%;
        margin: 0 auto;
        max-height: 80%;
    }

    .DrawMain .drawItem {
        margin: 10px 0;
    }

    .DrawMain /deep/.el-input__inner,.DrawMain /deep/.el-form-item__label,.DrawMain /deep/.el-textarea__inner{
        background: transparent;
        color: white;
    }
    #drawView .DrawMain .drawItem #el-select.el-input__inner {
        height: 32px;
    }

    #drawView .DrawMain .drawItem.el-select .el-input .el-select__caret {
        margin-top: 5px;
    }

    #drawView .DrawMain .drawItem.el-input--suffix .el-input__inner {
        height: 20px;
    }

    .DrawMain .drawItem p {
        display: inline-block;
        border-bottom: #3696ff 1px solid;
        margin: 0 5px;
        cursor: pointer;
        height: 22px;
        line-height: 22px;
    }

    .DrawMain .drawItem .acitve {
        color: #3696ff;
    }

    .DrawMain .drawItem textarea {
        outline: none;
        width: 54%;
        border: #d5d9e2 solid 1px;
    }

    .DrawMain .drawItem .nameInput {
        width: 180px;
        height: 27px;
        outline: none;
        border: #d5d9e2 solid 1px;
        border-radius: 3px;
    }

    .drawPos {

        margin-top: 10px;
    }

    .DrawMain .drawItem .drawPos p {

        color: white;
        border: none;
        padding: 1px 3px;
        background: #3696ff;
        cursor: default;
    }

    .drawPos input {
        outline: none;
        width: 90px;
        height: 20px;
        margin-left: 6%;
        border: #d5d9e2 solid 1px;
        border-radius: 3px;
    }

    .drawPos input:nth-child(4) {
        margin-left: 10%;
    }

    .drawItem:last-child {
        text-align: center;

        margin-left: -10%;

    }

    .drawRadius {
        padding-left: 25%;
    }

    .drawItem button {
        width: 70px;
        height: 37px;
    }
</style>
