import { actions } from './noIf'
import { wgs84ToBD } from '../../utils/coordinateConvert'
import {
  addMyMarker,
  addPolygon, customMarker, addStationDom,
  mapComopentFun, addRadarDom
} from './mapComponentFactory'

const map = {
  // 地图初始化
  mapInit() {
    let crs = new L.Proj.CRS('EPSG:3395',
      '+proj=merc +lon_0=0 +k=1 +x_0=140 +y_0=-250 +datum=WGS84 +units=m +no_defs',
      {
        resolutions: function() {
          var level = 19
          var res = []
          res[0] = Math.pow(2, 18)
          for (var i = 1; i < level; i++) {
            res[i] = Math.pow(2, (18 - i))
          }
          return res
        }(),
        origin: [0, 0],
        bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
      })
    this.map = L.map('map', {
      // crs: crs,
      crs: L.CRS.EPSG3857,
      //不添加属性说明控件
      attributionControl: false,
      //显示中心
      center: [30.969907662611103, 122.50475884137897],
      //最小显示等级
      minZoom: 4,
      //最大显示等级
      maxZoom: 16,
      //当前显示等级
      zoom: 11,
      zoomControl: false,
      doubleClickZoom: false,
      // url:'http://218.205.125.142:8001/{z}/{x}/{y}.png'
      // //限制显示地理范围
      // maxBounds: [[-90, -180], [90, 180]],
      // preferCanvas: true
    })
    // this.map.invalidateSize(true)   // 地图容器大小改变时,地图自适应新容器

    // this.map._onResize();
    let myFilter = [
      'blur:0px',
      'Grayscale: 0%',
      'brightness:100.5%',
      'contrast:200%',
      'Hue-Rotate:193deg',
      'grayscale:20%',
      'opacity:100%',
      'invert:90%',
      'Saturate:440%',
      'sepia:0%'
    ]
    //离线海图+天地卫星图+天地地图
    this.baseLayer = L.tileLayer('http://218.205.125.142:8001/{z}/{x}/{y}.png').addTo(this.map)//服务器上的离线海图
    // this.baseLayer = L.tileLayer('http://127.0.0.1:9001/{z}/{x}/{y}.png').addTo(this.map)//服务器上的离线海图

    this.sateLayer =L.tileLayer.chinaProvider(
      'TianDiTu.Satellite.Map',
      {
        // key: '5bc35f0a4fce14db0a93e3407ab5c17e',
        key:'0edce4abf031ad686066dc2fc90b4b61',
        maxZoom:18,
        minZoom:5,
      })

      this.seaLayer =L.tileLayer.chinaProvider(
      'TianDiTu.Normal.Map',
      {
        // key: '5bc35f0a4fce14db0a93e3407ab5c17e',
        key:'0edce4abf031ad686066dc2fc90b4b61',
        maxZoom:18,
        minZoom:5,
      })
    // this.baseLayer = L.tileLayer.colorFilter('http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20150518', {
    //   maxZoom: 18,
    //   minZoom: 3,
    //   subdomains: [0, 1, 2],
    //   tms: true,
    //   filter: myFilter
    // })
    // this.sateLayer = L.tileLayer.chinaProvider('Baidu.Satellite.Map', {
    //   maxZoom: 18,
    //   minZoom: 3,
    //   // subdomains: [0,1,2],
    //   tms: true
    // })
    
    // //高德地图
    // this.seaLayer =  L.tileLayer.chinaProvider('GaoDe.Satellite.Map', { //海图的API
    //   maxZoom: 18,
    //   minZoom: 3,
    //   // subdomains: [0,1,2],
    //   tms: true
    // })
    //设置图层组
    //  var vector = L.layerGroup([vectorMap]);
    // var  image = L.layerGroup([imageMap]);
    //  var baseLayers = {
    //    "矢量": vector,
    //    "影像": image
    //  }
    //初始时加载矢量图层组
    this.map.addLayer(this.baseLayer)
    //添加图层组控件
    // L.control.layers(baseLayers).addTo(this.map);

    // this.map.on('baselayerchange',  (e)=>{
    // })
    this.ciLayer = L.canvasIconLayer({}).addTo(this.map)
    this.mapEvent()
    // console.log('this.map', this.map)
    // this.map.mousemove(
    //   (e) => {
    //       console.log('监听mousemove',e)
    //     let latlng = e.latlng;
    //     console.log('监听mousemove经纬度',latlng );// {lat: 30.59, lng: 114.32}
    //   })
    //  // 监听 mousemove 事件
    //  this.map.on('mousemove', (e) => {
    //   console.log('监听mousemove',e)
    // let latlng = e.latlng;
    // console.log('监听mousemove经纬度',latlng );// {lat: 30.59, lng: 114.32}
    // });
    // // 取消 mousemove 事件
    // this.map.off('mousemove')


  },



  //地图事件
  mapEvent() {

    function debounce(fn, wait) {
      var timeout = null
      return function() {
        if (timeout !== null) clearTimeout(timeout)
        timeout = setTimeout(fn, wait)
      }
    }

    let start = () => {
      // console.log('地图移动！')
      this.showPointCollectionImg = false
      this.map.removeLayer(this.ciLayer)
      this.ciLayer = L.canvasIconLayer({}).addTo(this.map)
    }
    let end = () => {
      console.log('地图移动结束')
      if (this.map.getZoom() < this.maxMapZoom) {
        this.addShipPointCollection(this.map.getSize())
        this.loadAreaShip(0)
        this.ShipStatistical(0)
      } else {
        console.log(this.shipselect)
        this.loadAreaShip(1,[],this.shipselect,[])
        this.ShipStatistical(1,[],this.shipselect,[])
      }
      let swne = this.getMapBounds()
      let d = {
        'nelat': swne['neLat'],
        'swlat': swne['swLat'],
        'swlon': swne['swLon'],
        'nelon': swne['neLon'],
        'uid': this.$store.getters.user.data.id
      }
      let data = JSON.stringify({
        action: 'myfly',
        data: d
      })
    }

 
    this.map.on('moveend', debounce(() => {
      end()
    }, 350))
    this.map.on('move', () => {
      start()
    })
    this.map.on('zoomstart', () => {
      console.log('地图级数改变！')
    })
    this.map.on('zoomend', () => {
      console.log('地图级数改变结束！')
      this.mapZoom = this.map.getZoom()
    })

      //  监听 mousemove 事件
      this.map.on('mousemove', (e) => {
        // console.log('监听mousemove',e)
        // L.popup().setLatLng(e.latlng)
        // .setContent('经纬度'+e.latlng.toString())
        // .openOn(this.map)
        // L.popup({ 'closeButton': false,  'className': 'pollutant-green' })
        // .setLatLng(e.latlng)
        // .setContent(()=>{
        //   // return `<p>${e.latlng.lat,e.latlng.lng}</p>`
        //   return `<p>${(e.latlng.lat).toFixed(6)}
        //  <span>,</span>
        //   ${(e.latlng.lng).toFixed(6)}</p>`
        // })
        // .openOn(this.map);
      // let latlng = e.latlng;
      // console.log('监听mousemove经纬度',latlng );  
      });
      // 取消 mousemove 事件
      // this.map.off('mousemove')
  },

  //切换地图类型组件
  buttonGroupClickItem({ type }) {
    if (type === 1) {
      this.map.addLayer(this.baseLayer)
      this.map.removeLayer(this.sateLayer)
    }
    if (type === 2) {
      this.map.addLayer(this.sateLayer)
      this.map.removeLayer(this.baseLayer)
    }
    if (type === 3) {
      this.map.addLayer(this.seaLayer)
      this.map.removeLayer(this.sateLayer)
    }

  }
}

// 下拉菜单
const menu = {
  // 无下拉框按钮 点击触发
  dropdownButton(val) {
    console.log("点击数据",val)
    const map = {
      // '态势': () => {
      //   this.websocketsend(JSON.stringify({
      //     action: 'allRadar',
      //     data: { isshow: 1, uid: this.$store.getters.user.data.id }
      //   }))
      // }, 
      '目标': () => {
        this.showObjectSelect=true},
      '测距': (checked) => {
        
        if (checked) {
          this.measureRuler = new L.Control.LinearMeasurement({
            unitSystem: 'metric',
            color: '#e1dd8e',
            type: 'line',
            display: 'none'
          })
          this.map.addControl(this.measureRuler)
          this.measureRuler.initRuler()
        } else {
          this.measureRuler.resetRuler(true)
        }
      }, '区域': () => {
        this.showGroupView=true
        this.areadefineLayer.clearLayers()
      }, '打印': () => {
        window.print()
      },
      '复位': () => {
        location.reload()//页面刷新
      }, '图层': () => {
        this.showlayerSelect = true
      }, '筛船': () => {
        this.showSelectMarker = true
      },'导入': () => {
        this.showimportexcel = true
      },
       '关注': () => {
        let m
        this.focusButton= !this.focusButton
        this.showInfo.focus=true
        this.radarLayer.clearLayers()
        this.focusShipLayer.clearLayers()
        this.stationLayers.clearLayers()
        this.seaLineLayer.clearLayers()
        this.loadStationMarker()
        // this.loadSeaLineLayer()
        this.map.setView([30.37892927824675,122.19491755725795], 10);
        this.markerLayersGroup.eachLayer(item=>{
          // console.log(item,this.focusButton)
          if(!item.isFocus&&item.signal&&this.focusButton){
            item.setOpacity(0)
          }
          if(!this.focusButton&&item.signal){
            item.setOpacity(1)
          }
        })

        console.log(this.markerLayersGroup.item)
        this.service.get('/project/focusType',).then(res=>{
          // console.log(res.data)
          m=res.data
          m.splice(8,1)
        })
        m.splice(8,1)
        this.service.post('/focus/findAll',{}).then(res=>{
          // console.log(res.data)
          this.dialogInfo.focus=[]
          for(let i of res.data){

            for(let y of m){
              if(i.targetType===y.value){

                i.type=y.name
                this.dialogInfo.focus.push(i)
              }
            }
          }
        })
      }, 
      '统计': (check) => {
        this.shipAreaCount()
      }, 
      '密度': () => {
        this.shipCount()
      }

    }
    map[val.title](val.clicked)
  },
  // 筛船功能
  selectMarker(val) {
    console.log("sele",val,this.shipselect,this.areaselect,this.timeselect)
    // 船舶类型筛选
    if(val.parShip){
      if(val.is){
        val.children.forEach(e=>{
          this.shipselect.push(e.name)
        })
        // console.log('拼接的',this.shipselect)
        this.loadAreaShip(1,this.timeselect,this.shipselect,this.areaselect)
      }else{
        this.shipselect=[]
        // console.log('拼接的',this.shipselect)
        this.loadAreaShip(1,this.timeselect,this.shipselect,this.areaselect)
      }
    }
    if(val.ship){
      // console.log('val.ship',val.ship)
      if(val.is){
        this.shipselect.push(val.name)
        // console.log('拼接的',this.shipselect)
        this.loadAreaShip(1,this.timeselect,this.shipselect,this.areaselect)
      }else{
        this.shipselect.splice(this.shipselect.findIndex((item)=>{return item===val.name}),1);
        // console.log('拼接的', this.shipselect)
        this.loadAreaShip(1,this.timeselect,this.shipselect,this.areaselect)
      }
    }
     // 出现时间筛选
      if(val.parTime){
        // console.log("etime",val.parTime)
        if(val.is){
          val.children.forEach(e=>{
            // console.log("etime",e)
            let maxtime,mintime
            mintime=e.name.split('-')[0].replace('：','')
            maxtime=e.name.split('-')[1].replace(':','')
            console.log(mintime,maxtime,'1111111111111111111111111111111111111111111111111111')
            this.timeselect.push({mintime:mintime,maxtime:maxtime})
          })
          // console.log('拼接的时间',this.timeselect)
          this.loadAreaShip(1,this.timeselect,this.shipselect,this.areaselect)
        }else{
          this.timeselect=[]
          // console.log('拼接的时间',this.timeselect)
          this.loadAreaShip(1,this.timeselect,this.shipselect,this.areaselect)
        }
      }
      if(val.appear_time){
        // console.log('val.appear_time',val.appear_time)
        if(val.is){
          let maxtime,mintime
          mintime=val.name.split('-')[0].replace(':','')
          maxtime=val.name.split('-')[1].replace(':','')
          // console.log(mintime,maxtime,'1111111111111111111111111111111111111111111111111111')
          this.timeselect.push({mintime:mintime,maxtime:maxtime,index:val.index})
          // console.log('拼接的',this.timeselect)
          this.loadAreaShip(1,this.timeselect,this.shipselect,this.areaselect)
        }else{  
         
          this.timeselect.splice(this.timeselect.findIndex((item)=>{return item.index===val.index}),1);
          // console.log('拼接的', this.timeselect)
          this.loadAreaShip(1,this.timeselect,this.shipselect,this.areaselect)
        }
      }
    //  区域筛选
    if(val.parArea){
      if(val.is){
        val.children.forEach(e=>{
          this.areaselect.push(e.id)
        })
        console.log('拼接的111',this.areaselect)
        this.loadAreaShip(1,this.timeselect,this.shipselect,this.areaselect)
      }else{
        this.areaselect=[]
        console.log('拼接的111',this.areaselect)
        this.loadAreaShip(1,this.timeselect,this.shipselect,this.areaselect)
      }
    }
      if(val.selectarea){
        //  console.log('val.selectarea',val.selectarea)
        if(val.is){
          this.areaselect.push(val.id)
          // console.log('拼接的1',this.areaselect)
          this.loadAreaShip(1,this.timeselect,this.shipselect,this.areaselect)
        }else{
          this.areaselect.splice(this.areaselect.findIndex((item)=>{return item===val.id}),1);
          // console.log('拼接的2', this.areaselect)
          this.loadAreaShip(1,this.timeselect,this.shipselect,this.areaselect)
        }
      } 
  },
  //获取船舶类型
  loadShip(){
    this.service.get('/ship/shipType',{parmas:{
      }}).then(res=>{
      // console.log("船舶类型",res)
      this.loadShipData=res.flags
      for( var i of this.loadShipData){
        this.shipselect.push(i.shipType)
      }
    })
  },
  //获取区域类型
  selecarea(){
    this.service.get('/water/allList',{parmas:{
      }}).then(res=>{
      // console.log("allList",res)
     this.selectAreaData=res.list
      for( var i of this.selectAreaData){
        this.areaselect.push(i.id)
      }
    })
  },
  // 目标筛选
  ObjectSelect(val) {
    console.log('目标',val)
    this.clickedMarker = val
    if(val.name=='异常目标'){
      this.isAbnormalShip=val.is
    }
    if(val.name=='AIS目标'){
      this.shipAis=val.is
    }
    if(val.name=='雷达目标'){
      this.shipRadar=val.is
    }
    if(val.name=='融合目标'){
      this.shipFusion=val.is
    }
   // this.loadAreaShip(1,'',this.shipselect.toString(),'')
    this.loadAreaShip(1,this.timeselect,this.shipselect,this.areaselect)
  },
  // 图层筛选
  layerSelect(val) {
    console.log("图层",val)
    this.clickedMarker = val
    let action = [...actions.bind(this)()].filter(([key, value]) => (key.test(`${val.is}_${val.name}`)))
    action.forEach(([key, resValue]) => {
      console.log(key, resValue)
      let func = resValue.bind(this)()
      if (!func.url) return 
    }) 
  },
 
  // 统计区域内船只数量 统计
  shipAreaCount() {
    if (this.map_zoom < this.maxMapZoom) {
      this.$message.error('地图等级必须大于11级！')
    } else {

      if (this.areaShipData.length > 0) {
        this.map.pm.enableDraw('Rectangle', {
          snappable: true,
          snapDistance: 20
        })
        this.map.pm.setGlobalOptions({ layerGroup: this.drawLayer })
        // this.map.pm.disableDraw('Polygon');
        this.map.on('pm:create', e => {
          // console.log(e.layer.toGeoJSON().geometry.coordinates[0]);
          let point = e.layer.toGeoJSON().geometry.coordinates[0]
          this.showShipAreaCount = true
          console.log(point[0][0], point[0][1], point[2][0], point[2][1])
          // L.circle([point[0][1],point[0][0]], { radius: 30, color: 'red', fillColor: '#f03', fillOpacity: 1 }).addTo(this.map);
          // L.circle([point[2][1],point[2][0]], { radius: 30, color: 'red', fillColor: '#f03', fillOpacity: 1 }).addTo(this.map);
          let neArr = bd09towgs84(point[2][0], point[2][1])
          let swArr = bd09towgs84(point[0][0], point[0][1])
          console.log(neArr, swArr)
          let swne = this.getMapBounds()
          let d = {
            'maxLat': swne['neLat'],
            'minLat': swne['swLat'],
            'minLon': swne['swLon'],
            'maxLon': swne['neLon'],
            'times':[],
            'types':[],
            "waters":[],
          }
        this.service.post('/ship/statistical',{
          ...d
        }).then(res => {
            // console.log(res)
            let obj = res.data.columns
            if (obj.total === 0) {
              obj.ais = 0
              obj.anm = 0
              obj.fusion = 0
              obj.nm = 0
              obj.radar = 0
            } else {
              obj.ais = parseFloat((obj.AisShip / obj.total * 100).toFixed(2))
              obj.anm = parseFloat((obj.abnormal / obj.total * 100).toFixed(2))
              obj.fusion = parseFloat((obj.fusionShip / obj.total * 100).toFixed(2))
              obj.nm = parseFloat((obj.normal / obj.total * 100).toFixed(2))
              obj.radar = parseFloat((obj.radarShip / obj.total * 100).toFixed(2))
            }

            this.shipAreaCountData = obj
          })
        })

      } else {
        this.$message.error('等待船舶数据加载！')
      }
    }

  },
  // 关注列表的点击事件
  focusClick(row){

    console.log(row)

    this.service.post('/focus/view',{
      id:row.id
    }).then(res=>{
      console.log(res)
      if(res.data.target.lat){
        res.data.target.latitude=res.data.target.lat
        res.data.target.longitude=res.data.target.lon
      }
      if(row.type==='海底光缆'){
        res.data.target.latitude=res.data.target.points[Math.ceil(res.data.target.points.length/2)].lat
        res.data.target.longitude=res.data.target.points[Math.ceil(res.data.target.points.length/2)].lon
      }
      if(row.type==='资源站'||row.type==='海底光缆'){
        this.map.setView([res.data.target.latitude,res.data.target.longitude],11)
      }else{
        this.map.setView([res.data.target.latitude,res.data.target.longitude],14)
      }

      if(row.type==='船舶'){

        let e=res.data.target
        let bd09Arr = wgs84ToBD(parseFloat(e.longitude),parseFloat( e.latitude))

      }
      this.map.setView([res.data.target.latitude,res.data.target.longitude], 12);

    })

  },
}
// 覆盖物
const marker = {
  // 部门初始化数据
  loadGroupData() {
    // const map = {
    //   1: '海军',
    //   2: '陆军海防部队',
    //   3: '军分区',
    //   4: '海警局',
    //   5: '公安局',
    //   6: '海事局',
    //   7: '海洋与渔业局',
    //   8: '军民融合办',
    //   9: '海关',
    //   10: '边检'
    // }
    // this.service.get('/org/allList', {}).then(res => {
    //   console.log("组织机构",res)
    //   res.data.forEach(val => {
    //     // console.log(map[val.type])
    //     let bd09Arr = wgs84ToBD(val.longitude, val.latitude)
    //     let myMarker = this.createMarker(bd09Arr[1], bd09Arr[0], 15, 15, require('../../assets/mapSigns/organization' + val.type + '.png'))
    //     (map[val.type])
    //     ()
    //     this['orgLayer' + val.type].signal = map[val.type]
    //     // let x=new L.layer
    //     // this['orgLayer'+val.type]=
    //     myMarker.addTo(this['orgLayer' + val.type])
    //   })
    //   // }
    // })
  },
  //初始化数据
  loadDefaultMarker() {
    this.loadSeaLineLayer()
    //   {
    //     signal: '公安局',
    //     click: true,
    //     name: 'port5',
    //     img: '/mapSigns/16.png'
    //   },
    //   {
    //     signal: '军民融合办',
    //     click: false,
    //     name: 'port6',
    //     img: '/mapSigns/17.png'
    //   },
    //   {
    //     signal: '海洋与渔业局',
    //     click: true,
    //     name: 'port7',
    //     img: '/mapSigns/18.png'
    //   },
    //   {
    //     signal: '边检',
    //     click: false,
    //     name: 'port8',
    //     img: '/mapSigns/19.png'
    //   }   
    // ]
    // for (let i of url) {
    //   this.service.get('/org/allList').then(res => {
    //       console.log(res,i.url)
    //       for (let e of res.data) {
    //         let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
    //         let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 15, 15, require('../../assets' + i.img))(i.signal)(() => {
    //         })
    //         // 是否允许点击
    //         if (i.click) {
    //           marker.addTo(this.markerLayersGroup).on('click', (event) => {
    //             // console.log(event)
    //             this.service.get('/org/view', {
    //               params:{
    //                 id:e.id
    //               }
    //             }).then(res => {
    //               console.log(res.data)
    //               let a = Object.entries(this.showInfo)
    //               a.forEach(e => {
    //                 this.showInfo[e[0]] = false
    //               })
    //               // this.showInfo=new Map(a)
    //               this.showInfo[i.name] = true
    //               if (this.hasLayer(this.map, 'name' + e.id).length > 0) {
    //                           res.name.showed = true
    //                         } else {
    //                           res.name.showed = false
    //                         }
    //               // this.dialogInfo[i.name] = res.data.columns
    //             })
    //           })
    //         }
    //       }
    //     })
    // }
    // 陆军海防部队
    this.service.get('/org/allList').then(res => {
      // console.log("组织机构",res)
      for (let e of res.list) {
        if(e.type==2){
        let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
        let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 20, 20, require('../../assets/mapSigns/11.png'))('军区')
        ((event) => {
          //组织机构信息框
          this.service.get('/org/view', {
            params:{
              id:e.id
            }
          }).then(res => {
            console.log("组织机构选项",res)
            let a = Object.entries(this.showInfo)
            // console.log('组织机构',a)
            a.forEach(e => {
              this.showInfo[e[0]] = false
            })
          //   this.map.setView([latitude,longitude], 12 , { 
          //     pan: { animate: true , duration: 0.5 }, 
          //     zoom: { animate: true }, 
          //     animate: true
          // })
            this.showInfo.port = true
            if (this.hasLayer(this.map, 'port' + e.id).length > 0) {
              res.org.showed = true
            } else {
              res.org.showed = false
            }
            this.dialogInfo.port = res.org
            // console.log('this.dialogInfo.port',this.dialogInfo.port)
          })
        })
        marker.addTo(this.departmentLayers)
      }
      }
    })
        // 海军
        this.service.get('/org/allList').then(res => {
          // console.log("组织机构",res)
          for (let e of res.list) {
            if(e.type==1){
            let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
            let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 20, 20, require('../../assets/mapSigns/12.png'))('海军')
            ((event) => {
              //组织机构信息框
              this.service.get('/org/view', {
                params:{
                  id:e.id
                }
              }).then(res => {
                // console.log("组织机构选项",res)
                let a = Object.entries(this.showInfo)
                // console.log('组织机构',a)
                a.forEach(e => {
                  this.showInfo[e[0]] = false
                })
                this.showInfo.navy = true
                if (this.hasLayer(this.map, 'navy' + e.id).length > 0) {
                  res.org.showed = true
                } else {
                  res.org.showed = false
                }
                this.dialogInfo.navy = res.org
                // console.log('this.dialogInfo.berth',this.dialogInfo.berth)
              })
            })
            marker.addTo(this.departmentLayers)
           }
          }
        })
         // 海警局
         this.service.get('/org/allList').then(res => {
          // console.log("组织机构",res)
          for (let e of res.list) {
            if(e.type==4){
            let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
            let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 20, 20, require('../../assets/mapSigns/13.png'))('海警局')
            ((event) => {
              //组织机构信息框
              this.service.get('/org/view', {
                params:{
                  id:e.id
                }
              }).then(res => {
                // console.log("组织机构选项",res)
                let a = Object.entries(this.showInfo)
                // console.log('组织机构',a)
                a.forEach(e => {
                  this.showInfo[e[0]] = false
                })
                this.showInfo.mary = true
                if (this.hasLayer(this.map, 'mary' + e.id).length > 0) {
                  res.org.showed = true
                } else {
                  res.org.showed = false
                }
                this.dialogInfo.mary = res.org
              })
            })
            marker.addTo(this.departmentLayers)
           }
          }
        })
         // 军分区
         this.service.get('/org/allList').then(res => {
          for (let e of res.list) {
            if(e.type==3){
            let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
            let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 20, 20, require('../../assets/mapSigns/14.png'))('军分区')
            ((event) => {
              //组织机构信息框
              this.service.get('/org/view', {
                params:{
                  id:e.id
                }
              }).then(res => {
                // console.log("组织机构选项",res)
                let a = Object.entries(this.showInfo)
                // console.log('组织机构',a)
                a.forEach(e => {
                  this.showInfo[e[0]] = false
                })
                this.showInfo.milidivi = true
                if (this.hasLayer(this.map, 'milidivi' + e.id).length > 0) {
                  res.org.showed = true
                } else {
                  res.org.showed = false
                }
                this.dialogInfo.milidivi = res.org
              })
            })
            marker.addTo(this.departmentLayers)
           }
          }
        })
              // 海事局
              this.service.get('/org/allList').then(res => {
                for (let e of res.list) {
                  if(e.type==6){
                  let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
                  let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 20, 20, require('../../assets/mapSigns/15.png'))('海事局')
                  ((event) => {
                    //组织机构信息框
                    this.service.get('/org/view', {
                      params:{
                        id:e.id
                      }
                    }).then(res => {
                      // console.log("组织机构选项",res)
                      let a = Object.entries(this.showInfo)
                      // console.log('组织机构',a)
                      a.forEach(e => {
                        this.showInfo[e[0]] = false
                      })
                      this.showInfo.msa = true
                      if (this.hasLayer(this.map, 'msa' + e.id).length > 0) {
                        res.org.showed = true
                      } else {
                        res.org.showed = false
                      }
                      this.dialogInfo.msa = res.org
                    })
                  })
                  marker.addTo(this.departmentLayers)
                 }
                }
              })
           // 公安局
           this.service.get('/org/allList').then(res => {
            for (let e of res.list) {
              if(e.type==5){
              let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
              let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 20, 20, require('../../assets/mapSigns/16.png'))('公安局')
              ((event) => {
                //组织机构信息框
                this.service.get('/org/view', {
                  params:{
                    id:e.id
                  }
                }).then(res => {
                  // console.log("组织机构选项",res)
                  let a = Object.entries(this.showInfo)
                  // console.log('组织机构',a)
                  a.forEach(e => {
                    this.showInfo[e[0]] = false
                  })
                  this.showInfo.psb = true
                  if (this.hasLayer(this.map, 'psb' + e.id).length > 0) {
                    res.org.showed = true
                  } else {
                    res.org.showed = false
                  }
                  this.dialogInfo.psb = res.org
                })
              })
              marker.addTo(this.departmentLayers)
             }
            }
          })  
      // 军民融合办
      this.service.get('/org/allList').then(res => {
        for (let e of res.list) {
          if(e.type==8){
          let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
          let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 20, 20, require('../../assets/mapSigns/17.png'))('军民融合办')
          ((event) => {
            //组织机构信息框
            this.service.get('/org/view', {
              params:{
                id:e.id
              }
            }).then(res => {
              // console.log("组织机构选项",res)
              let a = Object.entries(this.showInfo)
              // console.log('组织机构',a)
              a.forEach(e => {
                this.showInfo[e[0]] = false
              })
              this.showInfo.cmio = true
              if (this.hasLayer(this.map, 'cmio' + e.id).length > 0) {
                res.org.showed = true
              } else {
                res.org.showed = false
              }
              this.dialogInfo.cmio = res.org
            })
          })
          marker.addTo(this.departmentLayers)
         }
        }
      })    
       // 海洋与渔业局
       this.service.get('/org/allList').then(res => {
        for (let e of res.list) {
          if(e.type==7){
          let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
          let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 20, 20, require('../../assets/mapSigns/18.png'))('海洋与渔业局')
          ((event) => {
            //组织机构信息框
            this.service.get('/org/view', {
              params:{
                id:e.id
              }
            }).then(res => {
              // console.log("组织机构选项",res)
              let a = Object.entries(this.showInfo)
              // console.log('组织机构',a)
              a.forEach(e => {
                this.showInfo[e[0]] = false
              })
              this.showInfo.ofa = true
              if (this.hasLayer(this.map, 'ofa' + e.id).length > 0) {
                res.org.showed = true
              } else {
                res.org.showed = false
              }
              this.dialogInfo.ofa = res.org
            })
          })
          marker.addTo(this.departmentLayers)
         }
        }
      }) 
           // 边检
           this.service.get('/org/allList').then(res => {
            for (let e of res.list) {
              if(e.type==10){
              let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
              let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 20, 20, require('../../assets/mapSigns/19.png'))('边检')
              ((event) => {
                //组织机构信息框
                this.service.get('/org/view', {
                  params:{
                    id:e.id
                  }
                }).then(res => {
                  // console.log("组织机构选项",res)
                  let a = Object.entries(this.showInfo)
                  // console.log('组织机构',a)
                  a.forEach(e => {
                    this.showInfo[e[0]] = false
                  })
                  this.showInfo.fi = true
                  if (this.hasLayer(this.map, 'fi' + e.id).length > 0) {
                    res.org.showed = true
                  } else {
                    res.org.showed = false
                  }
                  this.dialogInfo.fi = res.org
                })
              })
              marker.addTo(this.departmentLayers)
             }
            }
          }) 
             // 海关
             this.service.get('/org/allList').then(res => {
              for (let e of res.list) {
                if(e.type==9){
                let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
                let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 20, 20, require('../../assets/mapSigns/10.png'))('海关')
                ((event) => {
                  //组织机构信息框
                  this.service.get('/org/view', {
                    params:{
                      id:e.id
                    }
                  }).then(res => {
                    var  latitude=res.org.lat
                    var  longitude=res.org.lon
                    // console.log("组织机构选项",res)
                    let a = Object.entries(this.showInfo)
                    // console.log('组织机构',a)
                    a.forEach(e => {
                      this.showInfo[e[0]] = false
                    })
                    this.map.setView([latitude,longitude], 12 , { 
                      pan: { animate: true , duration: 0.5 }, 
                      zoom: { animate: true }, 
                      animate: true
                  })
                    this.showInfo.customs = true
                    if (this.hasLayer(this.map, 'customs' + e.id).length > 0) {
                      res.org.showed = true
                    } else {
                      res.org.showed = false
                    }
                    this.dialogInfo.customs = res.org
                  })
                })
                marker.addTo(this.departmentLayers)
               }
              }
            }) 
        // ais
        this.service.get('/ais/allList', {
          // 'isfocus': this.focusButton
        }).then(res => {
          console.log("区域内ais信息",res)
          for (let e of res.list) {
            let bd09Arr = wgs84ToBD(e.lon, e.lat)
            let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 15, 26, require('../../assets/mapSigns/ais.png'))('ais')
            ((event) => {
              //ais信息框
              this.service.get('/ais/view', {
                params:{
                  id:e.id
                }
              }).then(res => {
                var  latitude=res.ais.lat
                var  longitude=res.ais.lon
                console.log("ais详细信息",res)
                let a = Object.entries(this.showInfo)  //返回一个键值对数组
                a.forEach(e => {
                  this.showInfo[e[0]] = false
                })
                this.map.setView([latitude,longitude], 12 , { 
                  pan: { animate: true , duration: 0.5 }, 
                  zoom: { animate: true }, 
                  animate: true
              })
                this.showInfo.ais = true
                if (this.hasLayer(this.map, 'ais' + e.id).length > 0) {
                  res.ais.showed = true
                } else {
                  res.ais.showed = false
                }
    
                this.dialogInfo.ais = res.ais
              })
            })
            marker.isFocus = false
            marker.addTo(this.markerLayersGroup)
            // console.log( "marker",this.markerLayersGroup)
            if (e.isFocus) {
              marker.isFocus = true
            }
          }
        })
    // 雷达
    this.service.get('/radar/allList', {
      // 'isfocus': this.focusButton
    }).then(res => {
      // console.log("区域内雷达信息",res)
      for (let e of res.list) {
        let bd09Arr = wgs84ToBD(e.lon, e.lat)
        let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 15, 26, require('../../assets/mapSigns/01.png'))('雷达')
        ((event) => {
          // 雷达扫描圈
          // this.service.get('/radar/radarCalculate', {
          //   params:{
          //     id:e.id
          //   }
          // }).then(res => {
          //   console.log("雷达统计",res)
          // })
          //雷达信息框
          // console.log("雷达信息",e)
          this.service.get('/radar/view', {
            params:{
              id:e.id
            }
          }).then(res => {
            var  latitude=res.radar.lat
            var  longitude=res.radar.lon
            // console.log("雷达详细信息",res)
            let a = Object.entries(this.showInfo)
            a.forEach(e => {
              this.showInfo[e[0]] = false
            })
            this.map.setView([latitude,longitude], 12 , { 
              pan: { animate: true , duration: 0.5 }, 
              zoom: { animate: true }, 
              animate: true
          })
            this.showInfo.radar = true
            if (this.hasLayer(this.map, 'radar' + e.id).length > 0) {
              res.radar.showed = true
            } else {
              res.radar.showed = false
            }

            this.dialogInfo.radar = res.radar
          })
        })
        // marker.isFocus = false
        marker.addTo(this.markerLayersGroup)
        // if (e.isFocus) {
        //   marker.isFocus = true
        // }
      }
    })
    // 锚地
    this.service.get('/anchorage/allList', {
      // 'isfocus': this.focusButton
    }).then(res => {
      // console.log("区域内锚地信息",res)
      for (let e of res.list) {
        let bd09Arr = wgs84ToBD(e.lon, e.lat)
        let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 15, 26, require('../../assets/mapSigns/03.png'))('锚地')
        ((event) => {
          //锚地信息框
          this.service.get('/anchorage/view', {
            params:{
              id:e.id
            }
          }).then(res => {
            var  latitude=res.anchorage.lat
            var  longitude=res.anchorage.lon
            // console.log("锚地详细信息",res)
            let a = Object.entries(this.showInfo)
            a.forEach(e => {
              this.showInfo[e[0]] = false
            })
            this.map.setView([latitude,longitude], 12 , { 
              pan: { animate: true , duration: 0.5 }, 
              zoom: { animate: true }, 
              animate: true
          })
            this.showInfo.anchorage = true
            if (this.hasLayer(this.map, 'anchorage' + e.id).length > 0) {
              res.anchorage.showed = true
            } else {
              res.anchorage.showed = false
            }

            this.dialogInfo.anchorage = res.anchorage
          })
        })
        // marker.isFocus = false
        marker.addTo(this.markerLayersGroup)
        // if (e.isFocus) {
        //   marker.isFocus = true
        // }
      }
    })
    // 码头
    this.service.get('/pier/allList'/*, {
      // 'isfocus': this.focusButton
    }*/).then(res => {
      // console.log("区域内码头信息",res)
      for (let e of res.list) {
        let bd09Arr = wgs84ToBD(e.lon, e.lat)
        let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 15, 26, require('../../assets/mapSigns/02.png'))('码头')
        ((event) => {
          //码头信息框
          // console.log("码头信息",e)
          this.service.get('/pier/view', {
            params:{
              id:e.id
            }
          }).then(res => {
            // console.log("码头详细信息",res)
            var  latitude=res.pier.lat
            var  longitude=res.pier.lon
            let a = Object.entries(this.showInfo)
            // console.log('码头的',a)
            a.forEach(e => {
              this.showInfo[e[0]] = false
            })
            this.map.setView([latitude,longitude], 12 , { 
              pan: { animate: true , duration: 0.5 }, 
              zoom: { animate: true }, 
              animate: true
          })
            this.showInfo.berth = true
            if (this.hasLayer(this.map, 'berth' + e.id).length > 0) {
              res.pier.showed = true
            } else {
              res.pier.showed = false
            }
            this.dialogInfo.berth = res.pier
            // console.log('this.dialogInfo.berth',this.dialogInfo.berth)
          })
             //码头的统计时间
            this.service.get('/pier/portShip',{
                 params:{id:e.id}
                 }).then(res=>{
            //  console.log("码头统计时间",res)
             this.namelist=res.list
            //  console.log("码头统计时间", this.namelist)
           }) 
        })
        marker.addTo(this.markerLayersGroup)
      }
    })
     // 摄像头
     this.service.get('/camera/allList').then(res => {
      // console.log("区域内摄像头信息",res)
      for (let e of res.list) {
        let bd09Arr = wgs84ToBD(e.lon, e.lat)
        let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 15, 26, require('../../assets/mapSigns/camera.png'))('摄像头')
        ((event) => {
          //摄像头信息框
          // console.log("摄像头信息",e)
          this.service.get('/camera/view', {
            params:{
              id:e.id
            }
          }).then(res => {
            // console.log("摄像头详细信息",res)
            var  latitude=res.camera.lat
             var  longitude=res.camera.lon
            let a = Object.entries(this.showInfo)
            // console.log('摄像头的',a)
            a.forEach(e => {
              this.showInfo[e[0]] = false
            })
            this.map.setView([latitude,longitude], 12 , { 
              pan: { animate: true , duration: 0.5 }, 
              zoom: { animate: true }, 
              animate: true
          })
            this.showInfo.camera = true
            if (this.hasLayer(this.map, 'camera' + e.id).length > 0) {
              res.camera.showed = true
            } else {
              res.camera.showed = false
            }
            this.dialogInfo.camera = res.camera
          })
            
        })
        marker.addTo(this.markerLayersGroup)
      }
    })
    // 铁塔
    // this.service.get('/tower/findAll').then(res => {
    //   // console.log(res.data,'tower')
    //   for (let i of res.data) {
    //     // console.log(i)
    //     let bd09Arr = wgs84ToBD(i.longitude, i.latitude)
    //     let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 15, 15, require('../../assets/mapSigns/base4.svg'))('铁塔')(() => {})
    //     this.MarkerClusterGroup.addLayer(marker);
    //   }
    
    // })
    this.service.get('/tower/allList').then(res => {
      // console.log("区域内铁塔信息",res)
      for (let e of res.list) {
        let bd09Arr = wgs84ToBD(e.lon, e.lat)
        let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 15, 26, require('../../assets/mapSigns/tower.png'))('铁塔')(() => {})   
        this.MarkerClusterGroup.addLayer(marker);

        marker.on('click',(event) => {
          // console.log("铁塔信息",e)
          this.service.get('/tower/view', {
            params:{
              station_id:e.station_id
            }
          }).then(res => {
            // console.log("铁塔详细信息",res)
            let a = Object.entries(this.showInfo)
            // console.log('铁塔的',a)
            a.forEach(e => {
              this.showInfo[e[0]] = false
            })
            this.showInfo.tower = true
            if (this.hasLayer(this.map, 'tower' + e.id).length > 0) {
              res.tower.showed = true
            } else {
              res.tower.showed = false
            }
            this.dialogInfo.tower = res.tower
          })
        })
      }
    })
     // 泊位
     this.service.get('/berth/allList',{
      params:{
        name:1
      }
    }).then(res => {
      // console.log("区域内泊位信息",res)
      for (let e of res.list) {
        let bd09Arr = wgs84ToBD(e.lon, e.lat)
        let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 15, 26, require('../../assets/mapSigns/port.png'))('泊位')
        ((event) => {
          //摄像头信息框
          // console.log("泊位信息",e)
          this.service.get('/berth/view', {
            params:{
              id:e.Id
            }
          }).then(res => {
            // console.log("泊位详细信息",res)
            var  latitude=res.berth.lat
            var  longitude=res.berth.lon
            let a = Object.entries(this.showInfo)
            // console.log('泊位的',a)
            a.forEach(e => {
              this.showInfo[e[0]] = false
            })
            // console.log('mapset',this.map)
          
            this.map.setView([latitude,longitude], 12 , { 
              pan: { animate: true , duration: 0.5 }, 
              zoom: { animate: true }, 
              animate: true
          })
            this.showInfo.berthage = true
            if (this.hasLayer(this.map, 'berth' + e.id).length > 0) {
              res.berth.showed = true
            } else {
              res.berth.showed = false
            }
            this.dialogInfo.berthage = res.berth
            // console.log('this.dialogInfo.tower',this.dialogInfo.tower)
          })
            
        })
        marker.addTo(this.markerLayersGroup)
      }
    })
    // 组织机构
    // this.service.get('/org/allList').then(res => {
    //   console.log("组织机构",res)
    //   for (let e of res.list) {
    //     let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
    //     let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 20, 20, require('../../assets/mapSigns/11.png'))('军区')
    //     ((event) => {
    //       //组织机构信息框
    //       this.service.get('/org/view', {
    //         params:{
    //           id:e.id
    //         }
    //       }).then(res => {
    //         // console.log("组织机构选项",res)
    //         let a = Object.entries(this.showInfo)
    //         // console.log('组织机构',a)
    //         a.forEach(e => {
    //           this.showInfo[e[0]] = false
    //         })
    //         this.showInfo.port = true
    //         if (this.hasLayer(this.map, 'port' + e.id).length > 0) {
    //           res.port.showed = true
    //         } else {
    //           res.port.showed = false
    //         }
    //         // this.dialogInfo.port = res.pier
    //         // console.log('this.dialogInfo.berth',this.dialogInfo.berth)
    //       })
    //     })
    //     // marker.isFocus = false
    //     marker.addTo(this.markerLayersGroup)
    //     // if (e.isFocus) {
    //     //   marker.isFocus = true
    //     // }
    //   }
    // })
  },


// 海底光缆
  loadSeaLineLayer(){
    this.service.get('/seaLine/allList', {
        params:{
            name:""
          }
    }).then(res => {
      console.log("区域内海底光缆信息",res)
      for (let i of res.list) {
        console.log('海底光缆信息',i)
        let p = [], r = []
        i.points.forEach(e => {
          let bd09Arr = wgs84ToBD(e.lon, e.lat)
          p.push([bd09Arr[1], bd09Arr[0]])
        })

        i.region.forEach(e => {
          // r.push([e.lat, e.lon])
          let bd09Arr = wgs84ToBD(e.lon, e.lat)
          r.push([parseFloat(bd09Arr[1].toFixed(6)), parseFloat(bd09Arr[0].toFixed(6))])
        })
        r.push(r[0])

        let arrow = L.polyline(p, {
          //颜色
          color: 'rgba(195,49,169,0.9)',
        }).addTo(this.seaLineLayer)

        let fillbg = L.polygon(r, {
          //颜色
          // color: 'rgba(255,z55,255,0.9)'
          color: 'rgba(255,137,135,0.5)'
          // fillColor:'#ffffff',
          // fillOpacity:0.5,
        }).addTo(this.seaLineLayer)

        arrow.signal=i
        arrow.on('click', (e) => {
          console.log("海底光缆信息",e)
          let a = Object.entries(this.showInfo)
          a.forEach(e => {
            this.showInfo[e[0]] = false
          })
          // console.log(i)
          this.showInfo.seaLine = true
          this.dialogInfo.seaLine = i
        })

        // var polygon = L.polygon(r, {color: "#ff7800", weight: 1}).addTo(this.seaLineLayer);
        var pd = L.polylineDecorator(r,{
          // fillColor:'#ffffff',
          // fillOpacity:.5,
          //添加配置
          patterns: [{
            //模式符号的偏移位置
            offset: 0,
            //模式符号的重复间隔
            repeat: 10,
            // fill:true,
            // fillColor:'#ff7800',
            //符号实例
            symbol: L.Symbol.dash({  
              //符号大小
              pixelSize: 5,
              pathOptions: {
                // fill:true,
                // fillColor:'#ff7800',
                // fillOpacity:0.5,
                // stroke: true,
                //颜色
                // color: '#d42727',
                // color: '#585858', 
                color: '#ff7800', 
                //线宽
                weight: 1,
                //透明度
                opacity: 1
              }
            })
          }]
        }).addTo(this.seaLineLayer)
        pd.signal=i

      }
    })
  },
  // 锚地消息框 点击事件
  showAnchArea(data) {
    // console.log(data)
    if (data) {
      // console.log(this.hasLayer(this.map,'anchorage'+this.dialogInfo.anchorage.id))
      // 0:圆形  1:矩形 2:多边形
      const map = {
        0: (waters) => {
          // console.log(waters)
          let bd09Arr = wgs84ToBD(waters.centerx, waters.centery)
          let circle = L.circle([bd09Arr[1], bd09Arr[0]], {
            //圆半径
            radius: waters.radius,
            //颜色
            color: 'rgba(222,29,55,0.84)',
            //填充色
            fillColor: 'rgba(249,247,244,0.44)',
            //填充色透明度
            fillOpacity: 0.8
          }).addTo(this.map)
          circle.signal = 'anchorage' + this.dialogInfo.anchorage.id
        },
        2: (waters) => {
          // console.log(waters)
          let points = []
          waters.points.forEach(e => {
            let bd09Arr = wgs84ToBD(e.lon, e.lat)
            points.push([bd09Arr[1], bd09Arr[0]])
          })
          let polygon = L.polygon(points, {
            //颜色
            color: 'red'
          }).addTo(this.map)
          polygon.signal = 'anchorage' + this.dialogInfo.anchorage.id
        },
        1: (waters) => {
          console.log(waters)
          let points = []
          let p1 = wgs84ToBD(waters.lon1, waters.lat1)
          let p2 = wgs84ToBD(waters.lon2, waters.lat2)
          var polygon = L.polygon([[p1[1], p1[0]], [p2[1], p1[0]], [p2[1], p2[0]], [p1[1], p2[0]]], {
            //颜色
            color: 'red'
          }).addTo(this.map)
          polygon.signal = 'anchorage' + this.dialogInfo.anchorage.id
        }
      }
      const m = {
        '0': 'circle',
        '1': 'rectangle',
        '2': 'polygon',
      }

      // map[this.dialogInfo.anchorage.waters.type](this.dialogInfo.anchorage.waters)
      this.createPolygon(m[this.dialogInfo.anchorage.type],this.dialogInfo.anchorage,'anchorage' + this.dialogInfo.anchorage.id,
        {  //颜色
          color: 'rgba(222,29,55,0.84)',
          //填充色
          fillColor: 'rgba(249,247,244,0.44)',
          //填充色透明度
          fillOpacity: 0.8
        }
      )(wgs84ToBD).addTo(this.map);
    } else {
      this.removeLayer(this.map, 'anchorage' + this.dialogInfo.anchorage.id)
    }
  },
  // 信息框关注按钮
  cancelFocus(data){
    console.log(data)
    // this.service.get('/ship/cancelFocus',
    // {
    //   parmas:{
    //      mmsi: data.mmsi
    //   }
    // }).then(res=>{
    //   console.log("关注接口",res)
    //   if (res.error === 0) {
    //         this.$message.success('取消关注成功！')
    //       }
    // })
  },

  infoViewFocus(data) {
    console.log('infoViewFocus',data)
    if (!data.focus) {
      console.log('关注', data.mmsi)
        this.service.get('/ship/focus?mmsi='+ data.mmsi,
          ).then(res=>{
            console.log("关注接口",res)
            if (res.error === 0) {
               this.$message.success('关注成功！')
            }
          })
    }
     else {
      this.service.get('/ship/cancelFocus',
      {
        parmas:{
           mmsi: data.mmsi
        }
      }).then(res=>{
        console.log("关注接口",res)
        if (res.error === 0) {
              this.$message.success('取消关注成功！')
            }
      })
    }
  },
  //雷达船舶信息框
  radarShipView() {
    // this.websocketsend(JSON.stringify({ action: 'radarShip', data: { radarid: this.dialogInfo.radar.id } }))
    // let a = Object.entries(this.showInfo)
    // a.forEach(e => {
    //   this.showInfo[e[0]] = false
    // })
    // this.showInfo.radarShip = true
  
  },
  //ais船舶信息框
  aisShipView(){
    console.log("aisInfo",this.dialogInfo.aisInfo)
    // this.service.post('/ship/aisShip', {
    //   id: this.dialogInfo.ais.id,
    //   limit: 6,
    //   page: 1
    // })
    //   .then(req => {
    //     // let arr = [req.data[0],req.data[1],req.data[2],req.data[3],req.data[4]]
    //     this.dialogInfo.aisShipTable = req.data
    //     this.dialogInfo.aisShipTable.id = this.dialogInfo.ais.id
    //     // this.AisDataTabTotal = req.data.totalRow
    //     this.showInfo.aisShip=true
    //     console.log('ais',req)
    //   })
    //  this.service.get('/ais/allList', {
    //   // 'isfocus': this.focusButton
    // }).then(res => {
    //   console.log("ais信息",res)
    //   for (let e of res.ais) {
    //     let bd09Arr = wgs84ToBD(e.lon, e.lat)
    //     let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 15, 15, require('../../assets/mapSigns/ais.png'))('ais')
    //     ((event) => {
    //       //雷达信息框
    //       // console.log("雷达信息",e)
    //       this.service.get('/ais/view', {
    //         params:{
    //           id:e.id
    //         }
    //       }).then(res => {
    //         console.log("ais详细信息",res)
    //         let a = Object.entries(this.showInfo)  //返回一个键值对数组
    //         a.forEach(e => {
    //           this.showInfo[e[0]] = false
    //         })
    //         this.showInfo.ais = true
    //         if (this.hasLayer(this.map, 'ais' + e.id).length > 0) {
    //           res.ais.showed = true
    //         } else {
    //           res.ais.showed = false
    //         }

    //         this.dialogInfo.ais = res.ais
    //       })
    //     })
    //     marker.isFocus = false
    //     marker.addTo(this.markerLayersGroup)
    //     if (e.isFocus) {
    //       marker.isFocus = true
    //     }
    //   }
    // })
  },
  //摄像头放大缩小
  enlargeVideo(){
    if(this.isEnlargeVideo){
      this.videoWidth = '1200px';
    }else{
      this.videoWidth = '400px';
    }

    this.isEnlargeVideo = !this.isEnlargeVideo;
  },
}
// 侧边栏
const leftDrawer={
  //加载侧边栏
  loadLeftDrawer(){
    this.loadLeftDrawerData1()
    this.loadLeftDrawerData2()
    this.loadLeftDrawerStation1()
    this.loadLeftDrawerStation2()
  },

  loadLeftDrawerData1(){
    // this.service.get('/project/crimal').then(res => {
    //   // console.log(res)
    //   this.leftDrawerData.row2=res.data
    // })
  },
  loadLeftDrawerData2(){

    // this.service.get('/project/mystatistics').then(res=>{
    //   // console.log(res)
    //   this.leftDrawerData.row4=res.data
    // })
  },
  loadLeftDrawerStation1(){
    // this.service.post('/station/findPage', {
    //   condition: this.leftDrawerData.station1.name,
    //   limit: 7,
    //   page: this.leftDrawerData.station1.page,
    // }).then(res => {
    //   // console.log('station',res)

    //   this.leftDrawerData.station1.list=res.data.list
    //   // this.leftDrawerData.station1.page=res.data.pageNumber
    //   this.leftDrawerData.station1.total=res.data.totalRow
    //   this.leftDrawerData.station1={...this.leftDrawerData.station1}
    // })
  },
  loadLeftDrawerStation2(){
    // this.service.post('/apron/findPage', {
    //   condition: this.leftDrawerData.station2.name,
    //   limit: 7,
    //   page: this.leftDrawerData.station2.page,
    // }).then(res => {
    //   // console.log('station',res)

    //   this.leftDrawerData.station2.list=res.data.list
    //   // this.leftDrawerData.station1.page=res.data.pageNumber
    //   this.leftDrawerData.station2.total=res.data.totalRow
    //   this.leftDrawerData.station2={...this.leftDrawerData.station2}
    // })
  },


  loadLeftDrawerSearch(name){
    this.leftDrawerData.station1.name=name
    this.leftDrawerData.station2.name=name
    this.leftDrawerData.station1.page=1
    this.leftDrawerData.station2.page=1
    this.loadLeftDrawerStation1()
    this.loadLeftDrawerStation2()
    // console.log(name)
  },
  // 左侧抽屉
  LeftDrawerStationChange1(page){
    this.leftDrawerData.station1.page=page
    this.loadLeftDrawerStation1()
  },
  leftDrawerDailyEvent(e){
    this.showDailyEvent=true
    let beginTime=e+' 00:00',endTime=e+' 23:59'
    // console.log(new Date(beginTime).getTime(),new Date(endTime).getTime())
    // this.service.post('/criminal/pageAllOfShip',{
    //   limit:3,
    //   page:this.dailyEventPage,
    //   type:0,
    //   beginTime:new Date(beginTime).getTime(),
    //   endTime:new Date(endTime).getTime(),
    // }).then(res=>{
    //   // console.log(res)
    //   this.dailyEventList=res.data
    //   this.dailyEventList.today=e
    // })
  },
  leftDrawerSelectShip(e){
    // console.log('shipType',e)
    this.leftDrawerShipType=e
  },

  changeDailyEvent(e){

    this.dailyEventPage=e.page
    this.leftDrawerDailyEvent(e.today)

  },
  searchDailyEvent(e){

    console.log(e)
    this.animateLayer.clearLayers()
    let bd09Arr = wgs84ToBD(e.lon, e.lat)
    this.map.setView([bd09Arr[1], bd09Arr[0]], 15);
    L.marker([bd09Arr[1], bd09Arr[0]], {
      icon:L.icon({
        iconUrl: require('../../assets/mapSigns/shiphong.png'),
        iconSize: [13,22],
        iconAnchor: [6,11]
      })
    }).addTo(this.animateLayer);
    this.service.post('/region/findById',{
      id:e.watersId
    }).then(res=>{
      const m = {
        '0': 'circle',
        '1': 'polygon',
        '2': 'rectangle'
      }
      console.log(res)
      // let water=addPolygon(res.data,{ strokeColor: 'white', strokeWeight: 3, strokeOpacity: 0.6, fillColor: '#ff3a3d', strokeStyle: 'dashed', fillOpacity: 0.4 })(wgs84ToBD)
      // water.imei='daily'
      // this.map.addOverlay(water)
      this.createPolygon(m[res.data.type],res.data,'area',
        {  //颜色
          color: 'rgba(222,29,55,0.84)',
          //填充色
          fillColor: 'rgba(249,247,244,0.44)',
          //填充色透明度
          fillOpacity: 0.8
        }
      )(wgs84ToBD).addTo(this.animateLayer);
    })
    this.service.post('/ship/shipHistory',{
      beginTime:new Date( e.creatTime).getTime(),
      endTime: e.endTime,
      mmsi:e.mmsi
    }).then(res=>{
      console.log(res.data)
      if(res.data.length<1){
        this.$message.warning('暂无轨迹');
      }else {
        let points = [],duration=[]
        res.data.forEach(e => {
          let bd09Arr = wgs84ToBD(parseFloat(e.lon), parseFloat(e.lat))
          points.push([bd09Arr[1], bd09Arr[0]])
          duration.push(800*i)
        })
        console.log("duration",duration)
        L.marker(points[0], {
          icon:L.icon({
            iconUrl: require('../../assets/history/start.png'),
            iconSize: [30,44],
            iconAnchor: [15,22]
          })
        }).addTo(this.animateLayer);
        L.marker(points[points.length-1], {
          icon:L.icon({
            iconUrl: require('../../assets/history/end.png'),
            iconSize: [30,44],
            iconAnchor: [15,22]
          })
        }).addTo(this.animateLayer);
        var polyline = L.polyline(points, { color: 'red' }).addTo(this.animateLayer);
        var myMovingMarker = L.Marker.movingMarker(points,
          duration,{
            icon:L.icon({
              iconUrl: require('../../assets/history/ship.png'),
              iconSize: [40,44],
              iconAnchor: [20,22]
            })
          }).addTo(this.animateLayer);
        myMovingMarker.start();
      }
    })

  },
}
const ship={

  shipTrack() {
    if (this.dialogInfo.ship.targettype === 1) {
      console.log('AIS 目标')
      this.$message({
        message: 'AIS 目标，无法跟踪',
        type: 'warning'
      })
      return
    }
    console.log(this.dialogInfo.ship)
    // this.service.post('/ship/shipTrack', {
    //   mmsi: this.dialogInfo.ship.mmsi,
    //   radarId: this.dialogInfo.ship.radarid,
    //   targetId: this.dialogInfo.ship.targetid,
    //   urlType: this.dialogInfo.ship.urltype
    // })
    //   .then(res => {
    //     console.log(res)
    //     this.service.post('/camera/findAll', {
    //       stationId: this.dialogInfo.ship.attributionid
    //     }).then(res => {
    //       res.data.forEach((value) => {
    //         this.dialogInfo.camera = [...res.data]
    //         this.showInfo.camera=true
    //       })
    //     })
    //   })
  },
  ship_detail(mmsi){
    this.service.get('/ship/view', {
      params:{
       mmsi: mmsi
      }
     }).then(res => {
      //  console.log('船舶信息11111',res)
       this.dialogInfo.ship = res.ais
       var  latitude=res.ais.lat
       var  longitude=res.ais.lon
       if (res.error === 0) {
        let bd09Arr = wgs84ToBD(parseFloat(longitude), parseFloat(latitude))
        L.marker([bd09Arr[1],bd09Arr[0]], {
          icon:L.icon({
            iconUrl: require('../../assets/mapicon/aim.png'),
            iconSize: [32,32],
            iconAnchor: [16,16]
          })
        }).addTo(this.animateLayer);
         this.map.setView([latitude,longitude], 12 , { 
             pan: { animate: true , duration: 0.5 }, 
             zoom: { animate: true }, 
             animate: true
         })
         this.showInfo.ship=true
       }
  
     })
  },

  SettingNode(lat, lon){
    let bd09Arr = wgs84ToBD(parseFloat(lon), parseFloat(lat))
        L.marker([bd09Arr[1],bd09Arr[0]], {
          icon:L.icon({
            iconUrl: require('../../assets/mapicon/aim.png'),
            iconSize: [32,32],
            iconAnchor: [16,16]
          })
        }).addTo(this.animateLayer);
    // console.log(this.map)
        this.map.setView([lat,lon], 12 , { 
          pan: { animate: true , duration: 0.5 }, 
          zoom: { animate: true }, 
          animate: true
      })
  },

  // 船舶详细信息框的船舶详情
  shipDetail(data){
    console.log('shipDetail',data)
     this.service.get('/ship/archives', {
     params:{mmsi: data} 
    }).then(res => {
      // console.log("船舶详细信息",res)
      this.dialogInfo.shipDetail = res.archivesShip
      this.showInfo.shipDetail=true
    })

  },
  // 船舶详细信息框的历史轨迹
  setShipHistory(e) {      
    // console.log('历史轨迹时间戳',e)
    console.log(this.dialogInfo.ship)
    if (e === null) {
      return
    }
    this.animateLayer.clearLayers()
    
    // datetoString(new Date(e), 'yyyy-MM-dd h:m:s');
      // var d = new Date(e);    
      // var date = (d.getFullYear()) + "-" + 
      //           // (d.getMonth() + 1) + "-" +
      //           (d.getMonth()+1 < 10 ? '0'+(d.getMonth()+1) : d.getMonth()+1)+ "-" +
      //           (d.getDate()) + " " + 
      //           (d.getHours()) + ":" + 
      //           (d.getMinutes()) + ":" + 
      //           (d.getSeconds());
      var date1 = (new Date(e[0]).toLocaleDateString().replace(/\//g,'-')+' '+new Date(e[0]).toTimeString().split(' ')[0])
      var date2 = (new Date(e[1]).toLocaleDateString().replace(/\//g,'-')+' '+new Date(e[1]).toTimeString().split(' ')[0])
      //  console.log('data',date1,date2);
      if(this.dialogInfo.ship.targettype===3){

        this.service.get('/radar/radarHistory', {
          params:{
            station:this.dialogInfo.ship.radarid,
            targetid:this.dialogInfo.ship.targetid
            // beginTime: date1,
            // endTime: date2,
            // mmsi: this.dialogInfo.ship.mmsi
          }   
        })
          .then(res => {
            console.log('shipHistory',res)
            if (res.list.length < 1) {
              this.$message.warning('暂无轨迹');
            }else{
              var points = [],duration=[],bd09Arr=[]
            res.list.forEach(e => {
               bd09Arr = wgs84ToBD(parseFloat(e.lon), parseFloat(e.lat))
              // console.log('bd09Arr',bd09Arr)
              var po=points.push([bd09Arr[1], bd09Arr[0]])
                // console.log("points",po)
              duration.push(8000)
            })
           L.marker(points[0], {
              icon:L.icon({
                iconUrl: require('../../assets/history/start.png'),
                iconSize: [30,44],
                iconAnchor: [15,22],
                shadowSize: [41, 41]
              })
            }).addTo(this.animateLayer);
            
            // marker1.enableTemporaryHighlight();   //临时调用高亮显示
            L.marker(points[points.length-1], {
              icon:L.icon({
                iconUrl: require('../../assets/history/end.png'),
                iconSize: [30,44],
                iconAnchor: [15,22],
                shadowSize: [41, 41]
              })
            },{highlight: 'permanent'}).addTo(this.animateLayer);
            var polyline = L.polyline(points, { color: 'red' }).addTo(this.animateLayer);

            // Marker.moveTo(bd09Arr,1000,function(){
            //   alert('进行中。。。'); 
            //   });

            points.forEach(item=>{
              // console.log('item',item)

              item[0]=item[0]*1000000
              item[1]=item[1]*1000000
              // console.log('item1',item)
              item[0]=item[0]-item[0]%1
              item[1]=item[1]-item[1]%1
              // console.log('item2',item)
              item[0]=item[0]/1000000
              item[1]=item[1]/1000000
              // console.log('item3',item)

              let c=L.circle(item, {radius: 50,color:'green',fillColor:'greeb'}).addTo(this.animateLayer);
              var p1 = L.popup("<l-popup :content='profile1-1+'</l-popup>")
              .setContent(()=>{
                return `<p>经纬度为：${item}</p>`
              })
              c.bindPopup(p1,{minWidth:100,maxHeight:200}).openPopup() 
            })
            
            this.myMovingMarker = L.Marker.movingMarker(points,
              duration,{
                icon:L.icon({
                  iconUrl: require('../../assets/history/ship.png'),
                  iconSize: [40,44],
                  iconAnchor: [20,22]
                })
              }).addTo(this.animateLayer);
                this.myMovingMarker.start();
            }
          })

      }else{
        this.service.get('/ship/shipHistory', {
        params:{
          beginTime: date1,
          endTime: date2,
          mmsi: this.dialogInfo.ship.mmsi
        }   
      })
        .then(res => {
          console.log('shipHistory',res)
          if (res.list.length < 1) {
            this.$message.warning('暂无轨迹');
          }else{
            var points = [],duration=[],bd09Arr=[]
            res.list.forEach(e => {
               bd09Arr = wgs84ToBD(parseFloat(e.lon), parseFloat(e.lat))
 
              // console.log('bd09Arr',bd09Arr)
              var po=points.push([bd09Arr[1], bd09Arr[0]])
                // console.log("points",po)
              duration.push(8000)
            })
           var marker1= L.marker(points[0], {
              icon:L.icon({
                iconUrl: require('../../assets/history/start.png'),
                iconSize: [30,44],
                iconAnchor: [15,22],
                shadowSize: [41, 41]
              })
            }).addTo(this.animateLayer);
            
            
            // marker1.enableTemporaryHighlight();   //临时调用高亮显示

            var marker2= L.marker(points[points.length-1], {
              icon:L.icon({
                iconUrl: require('../../assets/history/end.png'),
                iconSize: [30,44],
                iconAnchor: [15,22],
                shadowSize: [41, 41]
              })
            },{highlight: 'permanent'}).addTo(this.animateLayer);

            // marker2.moveTo(lat, duration)

            var polyline = L.polyline(points, { color: 'red' }).addTo(this.animateLayer);

            points.forEach(item=>{
                // console.log('item',item)
                item[0]=item[0]*1000000
                item[1]=item[1]*1000000
                // console.log('item1',item)
                item[0]=item[0]-item[0]%1
                item[1]=item[1]-item[1]%1
                // console.log('item2',item)
                item[0]=item[0]/1000000
                item[1]=item[1]/1000000
                // console.log('item3',item)
                 //小数点保留六位
            //  if (item.indexOf('.') > 0) {　　　　　　　　
            //      const longlatsplit = item.split('.');　　　　　　　
            //      if (longlatsplit.length >= 2) {　　　　　　　　　　
            //          return  parseFloat(longlatsplit[0] === "" ? 0 : longlatsplit[0]) + parseFloat("." + longlatsplit[1].slice(0, 6));　　　　　　　　
            //       }　　　　　　
            //   }
                let c=L.circle(item, {radius: 50,color:'green',fillColor:'greeb'}).addTo(this.animateLayer);
                var p1 = L.popup("<l-popup :content='profile1-1+'</l-popup>")
                .setContent(()=>{
                  return `<p>经纬度为：${item}</p>`
                })
                c.bindPopup(p1,{minWidth:100,maxHeight:200}).openPopup() 
              })
            
            this.myMovingMarker = L.Marker.movingMarker(points,
              duration,{
                icon:L.icon({
                  iconUrl: require('../../assets/history/ship.png'),
                  iconSize: [40,44],
                  iconAnchor: [20,22]
                })
              }).addTo(this.animateLayer);

           
            //   this.myMovingMarker.once('click', function () {
            //     this.myMovingMarker.start();
            //     this.myMovingMarker.on('click', function () {
            //         if ( this.myMovingMarker.isRunning()) {
            //           this.myMovingMarker.pause();
            //         } else {
            //           this.myMovingMarker.moveTo(bd09Arr,1000,function(){
            //             alert('进行中。。。'); 
            //             });
            //         }
            //     });
            // });
            // this.backMarker = L.Marker.movingMarker([[48.8567, 2.3508],[50.45, 30.523333]],
            //   [20000]).addTo(this.animateLayer);

                this.myMovingMarker.start(); //开始 若已暂停则恢复
                this.myMovingMarker.stop(); //手动停止  若在之后调用`start`，则标记将从起点再次开始折线。
                this.myMovingMarker.pause();//暂停
                this.myMovingMarker.resume();//重置  恢复动画

                // var lnglat = new L.LngLat(48.8567, 2.3508);
                // this.backMarker.moveTo(lnglat,9000);
          }
        })
      }
  },
}
// 海域功能
const area={
  resetForm(formName)/* 提交重置 */ {
    if (this.$refs[formName] !== undefined) {
      this.$refs[formName].resetFields()
    }
  },
  showAllArea()/*显示隐藏所有区域*/ {

    // console.log('1231313',this.showOrHide)
    if (this.showOrHide ==='1') {
      console.log('显示所有')
      console.log('areaData',this.areaData)

      // this.showInfo.customArea = true
      // this.dialogInfo.customArea=this.areaData[0]

      for (let i of this.areaData) {
        const m = {
          '0': 'circle',
          '2': 'polygon',
          '1': 'rectangle'
        }
        let icon={
          1:' ⛒ ',
          2:' ★ ',
          3:' ✷ ',
        }
        // var latlngs = [[30.09404881287048, 122.53051757812501],[31.09404881287048, 122.53051757812501],[31.09404881287048, 123.53051757812501]];

        // var polygon = L.polygon(latlngs, {color: 'red'}).addTo(this.map);
        
        // polygon.on('click', function(e) {
        //   alert(1231)
        //     })
        i.centerx=i.lon
        i.centery=i.lat
      if(i.type===1){
        i.lat1=i.points[0].lat
        i.lon1=i.points[0].lon
        i.lat2=i.points[1].lat
        i.lon2=i.points[1].lon
      }
        // console.log('i.type',i)

        var createPolygon=  this.createPolygon(m[i.type], i,'area' +i.id,
          this.areaTypeStyle[i.level],
          // console.log('this.areaTypeStyle',this.areaTypeStyle[i.level]),
        )(wgs84ToBD).addTo(this.areaLayer);

        // console.log('areaTypeStyle',createPolygon),
        createPolygon.on('click', (e) =>{
          // alert(1231)
          // console.log('e',e)
          this.showInfo.customArea=true
          this.dialogInfo.customArea = i
          this.dialogInfo.points=i.points
          })
      }
    } else {
      console.log('隐藏所有')
      this.areaLayer.clearLayers()
      this.$refs.groupTree.hideAllArea(this.areaData, this.watersLevel)
    }
  },
  labelOverlay(data,label) {

    let _this=this;
    let s=5/(Math.pow(2, 9))*Math.pow(2, this.map.getZoom())
    let p=wgs84ToBD(data.centerLon, data.centerlat)

    let style={
      1:'#ff6161',
      2:'#ffd461',
      3:'#ff9661',
    }

    function ComplexCustomOverlay(point, text, mouseoverText) {
      this._point = point
      this._text = text
      this._overText = mouseoverText
    }
    ComplexCustomOverlay.prototype = new BMap.Overlay()
    ComplexCustomOverlay.prototype.initialize = function(map) {
      _this._map = map
      var div = this._div = document.createElement('div')
      div.style.position = 'absolute'
      div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat)
      div.style.backgroundColor = style[data.lever]
      // div.style.border = '1px solid #BC3B3A'
      div.style.color = 'black'
      div.style.height = "15px"
      // div.style.width = "px"
      div.style.padding = '2px'
      div.style.lineHeight =  "15px"
      div.style.whiteSpace = 'nowrap'
      div.style.MozUserSelect = 'none'
      div.style.fontSize =  "10px"
      var span = this._span = document.createElement('span')
      div.appendChild(span)
      span.appendChild(document.createTextNode(this._text))
      var that = this
      _this.map.getPanes().labelPane.appendChild(div)
      return div
    }
    ComplexCustomOverlay.prototype.draw = function() {
      var map = _this._map
      var pixel = map.pointToOverlayPixel(this._point)
      let s=5/(Math.pow(2, 9))*Math.pow(2, map.getZoom())
      // console.log(s)
      this._div.style.left = pixel.x-25 - 0.55*s + "px";
      this._div.style.top  = pixel.y - 0.78*s  + "px";
      this._div.style.zIndex = "0"
      if(_this.map.getZoom()>10||_this.map.getZoom()<9)/*地图缩放到9级以下 对文字隐藏*/{
        this._div.style.height = "0px"
        this._div.style.lineHeight =  "0px"
        this._div.style.width = "0px"
        this._div.style.fontSize =  "0px"
        this._div.style.padding = '0'
      }else{
        this._div.style.padding = '2px'
        this._div.style.height = s+"px"
        this._div.style.lineHeight = s+"px"
        this._div.style.width = "auto"
        this._div.style.fontSize =  s+"px"
      }
    }
    ComplexCustomOverlay.prototype.addEventListener = function(event,fun){
      this._div['on'+event] = fun;
    }
    var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(p[0], p[1]), data.typeLabel)

    // myCompOverlay.imm
    // myCompOverlay.tp = 'areaLabel'
    // myCompOverlay.mmsi = data.id
    this.map.addOverlay(myCompOverlay)
    myCompOverlay.addEventListener('click',() =>{
      this.showInfo.customArea = true
      // this.dialogInfo.customArea=this.drawData[i]
      // console.log(label)
      // this.areaInfo.dialog=true
      // this.areaInfo.label=label
      // this.areaInfo.description=data.description
    })
  },
  hideAllArea() {
    // this.$refs.groupTree.hideAllArea(this.areaData)
  },
  openDrawView() {
    // console.log(this.groupData)
    this.showDrawView = true
    // this.map.clearOverlays(BMAP_DRAWING_CIRCLE)
    // this.map.clearOverlays(BMAP_DRAWING_RECTANGLE)
    // this.map.clearOverlays(BMAP_DRAWING_POLYGON)
    this.drawData = {
      lever: '1',
      name: '',
      description: '',
      centerx: '',
      centery: '',
      radius: '',
      positions: [],
      groupId: undefined
    }
    // this.drawData={
    //   level: '',
    //   name: '',
    //   type: '',
    //   lat: '',
    //   lon: '',
    //   radius: ''
    // }
  },
  loadGroupData() {

    this.service.get('/water/allList').then(res => {
      // console.log(res)
      this.groupData = JSON.parse(JSON.stringify(res.list))
    })
    this.service.get('/enum/waterLevel').then(res => {
      // console.log(res.data)
      this.watersLevel = res.data
    })
    this.service.get('/water/allList').then(res => {
      console.log("全部区域个数",res)
      // let arr=[]
      // res.data.forEach(e=>{
      //   if(!this.focusButton){
      //     arr.push(e)
      //     return true
      //   }else{
      //     if(e.isFocus){
      //       arr.push(e)
      //       return true
      //     }
      //     return false
      //   }
      // })
      this.areaData = res.list
      // this.areaLength = this.areaData.length
      this.areaLength = res.list.length
      // console.log('this.areaLength',this.areaLength)
      this.hideAllArea()
      this.showAllArea()
    })
  },
  // 拖拽 移动分组
  allowDrop(data)  {
    // this.service.post('/region/updateRegionGroup', {
    //   'id': data.id,
    //   'groupId': data.groupId
    // }).then(req => {
    //   console.log(req)

    // })
  },

  closeDraw() {
    // this.removeOverlay('图形')
    // this.map.removeOverlay(this.currentDraw)//切换图形 删除之前的图形
    // this.showDrawView = false
    this.drawLayer.clearLayers()
    this.resetForm('ruleForm')//重置
    this.drawData = {
      name: '',
      description: '',
      centerx: '',
      centery: '',
      radius: '',
      positions: [],
      groupId: undefined
    }
    this.isDrawType = undefined
    this.showDrawView = false
  },
  subDraw(formName) /*提交绘制结果*/ {
    // this.removeOverlay('图形')

    this.$refs[formName].validate((valid) => {
      if (valid) {
        console.log('success')
        if (this.isDrawType === undefined||this.drawData.positions[0] === undefined) {
          this.$message.error({ message: '请绘制图形', })
          return false
        } else {
          let p=[]
          this.drawData.positions.forEach((e,index)=>{
            p.push({lat:e[1],lon:e[0],ordered:index})
          })
          console.log('drawData',this.drawData)
          this.service.post( '/water/save',{
                  level: this.drawData.lever,
                  type: this.isDrawType,
                  lat:this.drawData.positions[0][1],
                  lon:this.drawData.positions[0][0],
                  radius:this.drawData.radius,
                  points:p,
                  name:this.drawData.name
             }).then(res => {
              console.log("新增绘制的数据",res)
              if(res.error===0){this.$message.success({ message: '成功', })}this.closeDraw()
                this.loadGroupData();this.drawLayer.clearLayers()
              // console.log("导入数据的状态",req.error)
             })



          const map={
      
            0:()=>{
              let arr = bd09towgs84(this.drawData.positions[0][0], this.drawData.positions[0][1])
              this.service.post('/region/addCircle', {
                centerx: arr[0],
                centery: arr[1],
                lever: this.drawData.lever,
                description: this.drawData.description,
                groupId: this.drawData.groupId,
                radius: this.drawData.radius,
                name: this.drawData.name
              //  this.service.post( '/water/save',{
              //     level: level,
              //     type: type,
              //     lat:lat,
              //     lon:lon,
              //     radius:radius,
              //     points:points
              }).then(res => {if(res.code===0){this.$message.success({ message: '成功', })}this.closeDraw()
                this.loadGroupData();this.drawLayer.clearLayers()})},
            1:()=>{
              let arr = bd09towgs84(this.drawData.positions[0][0], this.drawData.positions[0][1])
              let arr2 = bd09towgs84(this.drawData.positions[1][0], this.drawData.positions[1][1])
              console.log(arr,arr2)
              if(arr[0]===arr2[0]||arr[1]===arr2[1]){
                this.$message.error('区域非法');
              }else{
                this.service.post('/region/addRectangle', {
                  lat1: arr[1],
                  lon1: arr[0],
                  lat2: arr2[1],
                  lon2: arr2[0],
                  description: this.drawData.description,
                  groupId: this.drawData.groupId,
                  lever: this.drawData.lever,
                  name: this.drawData.name
                }).then(res => {if(res.code===0){this.closeDraw()
                  this.loadGroupData();this.$message.success({ message: '成功', });this.drawLayer.clearLayers()}})
              }
            },
            2:()=>{
              let _this = this
              let points = []
              for (let i of this.drawData.positions) {
                let arr = bd09towgs84(i[0], i[1])
                points.push({lon:arr[0],lat:arr[1]})
                // i.lon = arr[0]
                // i.lat = arr[1]
              }
              this.service.post('/region/addPolygon', {
                points: points,
                description: this.drawData.description,
                groupId: this.drawData.groupId,
                lever: this.drawData.lever,
                name: this.drawData.name
              }).then(res => {
                if(res.code===0){this.closeDraw()
                  this.loadGroupData();this.$message.success({ message: '成功', });this.drawLayer.clearLayers()}
              })
            },
          }
          // map[this.isDrawType]()
          console.log('isDrawType',this.isDrawType)

        }
      } else {
        console.log('error submit!!')
        return false
      }
    })
  },
  //预览
  drawPreview(){

    console.log(this.drawData.positions,this.isDrawType)
    this.drawLayer.clearLayers()//切换图形 删除之前的图形

    if(this.isDrawType===0){
    }
    const map={
      0:()=>{
        // let point = new BMap.Point(p[0],p[1]);

        let circle = L.circle([this.drawData.positions[0][1], this.drawData.positions[0][0]], {
          //圆半径
          radius: this.drawData.radius,
          color: '#3388ff',
          opacity: 0.8,
          fillColor: '#3388ff',
          fillOpacity: 0.2
        })
        return circle
      },
      1:()=>{
        let p1=this.drawData.positions[0],p2=this.drawData.positions[1]
        var polygon = L.polygon([[p1[1], p1[0]], [p2[1], p1[0]], [p2[1], p2[0]], [p1[1], p2[0]]], {
          color: '#3388ff',
          opacity: 0.8,
          fillColor: '#3388ff',
          fillOpacity: 0.2
        })
        return polygon
      },
      2:()=>{
        let p=[]
        this.drawData.positions.forEach(e=>{
          p.push([e[1],e[0]])
        })
        let polygon = L.polygon(p, {
          color: '#3388ff',
          opacity: 0.8,
          fillColor: '#3388ff',
          fillOpacity: 0.2
        })
        return polygon
      },
    }
    map[this.isDrawType]().addTo(this.drawLayer)
    // this.map.addOverlay(map[this.isDrawType]())
  },
  drawArea(id, index) /*三种图形绘制*/ {

    this.disabledDraw=true
    this.drawData.radius = ''
    // this.drawData.groupId=this.groupData[0].id
    this.isDrawType = index
    this.drawLayer.clearLayers()



    if (id === 1) {//圆形
      this.map.pm.enableDraw('Circle', {
        snappable: true,
        snapDistance: 20
      })
      this.map.pm.setGlobalOptions({ layerGroup: this.drawLayer })
      // this.map.pm.disableDraw('Polygon');
      this.map.on('pm:create', e => {
        // console.log(e.layer.toGeoJSON().geometry.coordinates,e.layer.options.radius);
        this.drawData.positions = []
        let point = e.layer.toGeoJSON().geometry.coordinates
        console.log('points',e.layer.toGeoJSON().geometry.coordinates);
        this.drawData.positions.push(point)
        this.drawData.radius = e.layer.options.radius
      })
    } else if (id === 2) {//矩形
      this.map.pm.enableDraw('Rectangle', {
        snappable: true,
        snapDistance: 20
      })
      this.map.pm.setGlobalOptions({ layerGroup: this.drawLayer })
      // this.map.pm.disableDraw('Polygon');
      this.map.on('pm:create', e => {
        // console.log(e.layer.toGeoJSON().geometry.coordinates);
        this.drawData.positions = []
        let point = e.layer.toGeoJSON().geometry.coordinates[0]
        // console.log(point[0][0], point[0][1], point[2][0], point[2][1])
        // L.circle([point[0][1],point[0][0]], { radius: 30, color: 'red', fillColor: '#f03', fillOpacity: 1 }).addTo(this.map);
        // L.circle([point[2][1],point[2][0]], { radius: 30, color: 'red', fillColor: '#f03', fillOpacity: 1 }).addTo(this.map);
        this.drawData.positions.push(point[0],point[2])
        // let neArr = bd09towgs84(point[2][0], point[2][1])
        // let swArr = bd09towgs84(point[0][0], point[0][1])
        // console.log(neArr, swArr)
      })
    } else if (id === 3) {//多边形
      this.map.pm.enableDraw('Polygon', {
        snappable: true,
        snapDistance: 20
      })
      this.map.pm.setGlobalOptions({ layerGroup: this.drawLayer })
      // this.map.pm.disableDraw('Polygon');
      this.map.on('pm:create', e => {
        this.drawData.positions = []
        // console.log(e.layer.toGeoJSON().geometry.coordinates);
        let point = e.layer.toGeoJSON().geometry.coordinates[0]
        // console.log(point[0][0], point[0][1], point[2][0], point[2][1])
        for(let i=0;i<point.length-1;i+=1){
          this.drawData.positions.push(point[i])
          // L.circle([point[i][1],point[i][0]], { radius: 30, color: 'red', fillColor: '#f03', fillOpacity: 1 }).addTo(this.map);
        }
      })
    }
  },
  removeArea(data)/*删除区域*/ {
    console.log('删除区域id',data)
      this.service.get('/water/delete', {
        params:{'id': data.id}
      }).then(res => { 
        //  console.log('drawLayer',this.drawLayer)
        this.areaLayer.clearLayers()
        // this.drawLayer.clearLayers()
       this.loadGroupData()
        console.log('删除区域返回',res)
      })
  },
}
export default {
  ...map,
  ...menu,
  ...marker,
  ...leftDrawer,
  ...ship,
  ...area,
}
