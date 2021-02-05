import { actions } from './noIf'
import { wgs84ToBD } from '../../utils/coordinateConvert'

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
      crs: crs,
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
    //  L.tileLayer('http://218.205.125.142:8001/{z}/{x}/{y}.png').addTo(this.map)//服务器上的离线地图
    this.baseLayer = L.tileLayer.colorFilter('http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20150518', {
      maxZoom: 18,
      minZoom: 3,
      subdomains: [0, 1, 2],
      tms: true,
      filter: myFilter
    })
    this.sateLayer = L.tileLayer.chinaProvider('Baidu.Satellite.Map', {
      maxZoom: 18,
      minZoom: 3,
      // subdomains: [0,1,2],
      tms: true
    })
    //高德地图
    this.seaLayer =  L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {//海图的API
      maxZoom: 18,
      minZoom: 3,
      // subdomains: [0,1,2],
      tms: true
    })
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
  },
  //统计国家数
  // flag(){
  //   this.service.get('/ship/flag').then(res=>{
  //     console.log("查询到的国家列表",res)
  //   })
  // },
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
      } else {
        this.loadAreaShip(1)
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
      console.log(this.websock2.readyState)
      // console.log(this.$store.getters.user.data.id)
      // console.log('发送数据', data)
      if(this.websock2.readyState===1){

        this.websocketsend2(data)
      }else{
        this.initWebSocket()
      }
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
    //   this.map.on('zoomstart',  debounce(()=>{
    //     // console.log('地图级数改变！')
    //     this.showPointCollectionImg=false
    //     this.map.removeLayer(this.ciLayer)
    //     this.ciLayer = L.canvasIconLayer({}).addTo(this.map)
    //   },300))
    //   this.map.on('zoomend', debounce(()=>{
    //     console.log('地图级数改变！')
    //     this.isZoom=true
    //     if (this.map.getZoom() < this.maxMapZoom) {
    //       this.addShipPointCollection(this.map.getSize())
    //     }else{
    //       this.loadAreaShip(1)
    //     }
    //     // this.map.scrollWheelZoom.disable();
    //     // this.map.dragging.disable();
    // },300))
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
const station = {
  loadStationMarker() {
    this.service.post('/station/findAll', {
      isfocus: this.focusButton
    }).then(res => {//加载资源站
      console.log( "加载资源站",res)
      for (let i of res.data) {
        if (i.showed) {
          // console.log(i)
          let color = '#1f4e72'
          if (i.isFocus) {
            color = '#cbcfa3'
          }
          let bd09Arr = wgs84ToBD(i.longitude, i.latitude)
          let circle = L.circle([bd09Arr[1], bd09Arr[0]], {
            //圆半径
            radius: i.scope * 1852,
            //颜色
            color: 'rgba(17,73,114,0.3)',
            //填充色
            fillColor: color,
            //填充色透明度
            fillOpacity: 0.1
          }).addTo(this.stationLayers)
            .on('dblclick', (event) => {
            // this.stationID=e.target.detail.id

            this.service.post('/station/detail', {
              id: i.id
            }).then(res => {
              // let a = Object.entries(this.showInfo)
              // a.forEach(e => {
              //   this.showInfo[e[0]] = false
              // })
              this.showInfo.station = true
              this.dialogInfo.stationInfo = res.data
            })
            // console.log(i)
            // console.log(this.stationCheck,e.target.detail.id)
            if (this.stationCheck.ais)            {
              const loadInfo = e => {
                this.service.post('/ais/view', {
                  id: e.id
                }).then(res => {
                  console.log(res)
                  this.showInfo.ais = true
                  this.dialogInfo.ais = res.data.columns

                })
              }
              this.service.post('/ais/findAll', {
                stationId: event.target.detail.id
              }).then(res => {
                console.log(res.data)
                res.data.forEach(e => {

                  loadInfo(e)
                  let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
                  let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 15, 15, require('../../assets/mapSigns/system3.png'), e.pAngle)('AIS基站')
                  ((ev) => {loadInfo(e)})
                  marker.addTo(this.stationLayerGroup)
                })
              })
            }
            if (this.stationCheck.camera) {
              const loadInfo = e => {
                this.service.post('/camera/view', {
                  id: e.id
                })
                  .then(res => {
                    // console.log(res)
                    this.dialogInfo.camera = [res.data]
                    this.showInfo.camera = true
                  })
              }
              this.service.post('/camera/findAll', {
                stationId: event.target.detail.id
              }).then(res => {
                console.log(res.data)
                this.dialogInfo.camera = res.data
                this.showInfo.camera = true
                res.data.forEach(e => {

                  let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
                  let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 15, 10, require('../../assets/mapSigns/system4.png'), e.pAngle)('视频监控站')
                  ((ev) => {loadInfo(e)})
                  marker.addTo(this.stationLayerGroup)
                })
              })
            }

            if (this.stationCheck.radar) {
              this.websocketsend(JSON.stringify({
                action: 'allRadar',
                data: { isshow: 1, attributionid: event.target.detail.id, uid: this.$store.getters.user.data.id }
              }))

            }
          })
          circle.signal = '综合观测站'
          circle.detail = i

        }
      }
    })
  }
}
// 下拉菜单
const menu = {
  // 无下拉框按钮 点击触发
  dropdownButton(val) {
    console.log("点击数据",val)
    const map = {
      '态势': () => {
        this.websocketsend(JSON.stringify({
          action: 'allRadar',
          data: { isshow: 1, uid: this.$store.getters.user.data.id }
        }))
      }, '测距': (checked) => {
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
      }, '海域': () => {
        this.showGroupView=true
      }, '打印': () => {
        window.print()
      },
      '复位': () => {
        location.reload()//页面刷新
      }, '图层': () => {
        this.showSelectMarker = true
      }, '关注': () => {
        let m
        this.focusButton= !this.focusButton
        this.showInfo.focus=true
        this.radarLayer.clearLayers()
        this.focusShipLayer.clearLayers()
        this.stationLayers.clearLayers()
        // this.seaLineLayer.clearLayers()
        this.seaLineLayer.clearLayers()
        this.loadStationMarker()
        this.loadSeaLineLayer()
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

        // console.log(this.markerLayersGroup.item)
        this.service.get('/project/focusType',).then(res=>{
          console.log(res.data)
          m=res.data
          m.splice(8,1)
        })
        // m.splice(8,1)
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
          // this.focusList=res.data
          // console.log( this.dialogInfo.focus)
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
  // 图层功能
  selectMarker(val) {
    console.log(val)
    // console.log(this.stationCheck)
    if (val.prop) this.stationCheck[val.prop] = val.is
    // if(val.name==='海防单位'&&val.is===true){
    //   for(let i=1;i<11;i++){
    //     console.log(this['orgLayer'+i])
    //     this.departmentLayers.addLayer(this['orgLayer'+i])
    //   }
    //   return
    // }
    this.clickedMarker = val
    let action = [...actions.bind(this)()].filter(([key, value]) => (key.test(`${val.is}_${val.name}`)))
    action.forEach(([key, resValue]) => {
      console.log(key, resValue)
      // return
      let func = resValue.bind(this)()
      //
      // this.clickedMarker=val
      if (!func.url) return
      // let swne =this.getMapBounds();
      // this.service[val.ishttpGET?'get':'post']( func.url, {
      //   'swLon': swne['swLon'],
      //   'swLat': swne['swLat'],
      //   'neLon': swne['neLon'],
      //   'neLat': swne['neLat'],
      //   'isfocus':this.focusButton
      // })
      //   .then(res=>{
      //     // console.log('res',res)
      //     if(val.name==='通信铁塔'){
      //       let markers=[],style=[];
      //       res.data.forEach(e => {
      //         markers.push( value.actionFun.bind(this)(e))
      //
      //       })
      //
      //       this.markerCluster = new BMapLib.MarkerClusterer(this.map, {markers:markers,maxZoom:14,gridSize:120});
      //       this.markerCluster.setStyles([{url:require('../../assets/mapicon/tower/1.png'),size: new BMap.Size(45,45),textColor:'#fff',textSize:14},
      //         {url:require('../../assets/mapicon/tower/2.png'),size: new BMap.Size(40,40),textColor:'#fff',textSize:12},
      //         {url:require('../../assets/mapicon/tower/3.png'),size: new BMap.Size(35,35),textColor:'#fff',textSize:12},
      //       ])
      //     }else{
      //       res.data.forEach(e => {
      //         func.actionFun.bind(this)(e);
      //       })
      //     }
      //
      //   })
    })
  },
  // 统计九宫格船只数量 密度
  shipCount() {
    let swne = this.getMapBounds()
    if (this.map_zoom < this.maxMapZoom) {
      this.$message.error('地图等级必须大于11级！')
    } else {
      if (this.areaShipData.length > 0) {
        this.showShipCount = true
        this.service.post('/ship/shipDensity', {
          'neLat': swne['neLat'],
          'swLat': swne['swLat'],
          'swLon': swne['swLon'],
          'neLon': swne['neLon']
        }).then(res => {
          console.log(res)
          for (let i of res.data) {
            i.columns.ais = parseFloat((i.columns.AisShip / i.columns.total * 100).toFixed(2))
            i.columns.anm = parseFloat((i.columns.abnormal / i.columns.total * 100).toFixed(2))
            i.columns.fusion = parseFloat((i.columns.fusionShip / i.columns.total * 100).toFixed(2))
            i.columns.nm = parseFloat((i.columns.normal / i.columns.total * 100).toFixed(2))
            i.columns.radar = parseFloat((i.columns.radarShip / i.columns.total * 100).toFixed(2))
          }
          this.shipCountData = res.data
        })
      } else {
        this.$message.error('等待船舶数据加载！')
      }

    }

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
          this.service.post('/ship/shipStatistical', {
            'neLat': neArr[1],
            'swLat': swArr[1],
            'swLon': swArr[0],
            'neLon': neArr[0]
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
    const map = {
      1: '海军',
      2: '陆军海防部队',
      3: '军分区',
      4: '海警局',
      5: '公安局',
      6: '海事局',
      7: '海洋与渔业局',
      8: '军民融合办',
      9: '海关',
      10: '边检'
    }
    this.service.post('/org/findAll', {}).then(res => {
      // console.log(res)
      // this.service.get('/project/orgType').then(res=>{
      //
      //   console.log(res)
      // })
      res.data.forEach(val => {
        // console.log(map[val.type])
        let bd09Arr = wgs84ToBD(val.longitude, val.latitude)
        let myMarker = this.createMarker(bd09Arr[1], bd09Arr[0], 15, 15, require('../../assets/mapSigns/organization' + val.type + '.png'))
        (map[val.type])
        ()
        this['orgLayer' + val.type].signal = map[val.type]
        // let x=new L.layer
        // this['orgLayer'+val.type]=
        myMarker.addTo(this['orgLayer' + val.type])
      })
      // }
    })
  },
  // 被动保障类基础设施初始化数据
  loadDefaultMarker() {
    this.loadSeaLineLayer()
    let url = [
      // {
      //   url:'/anchorage/findAll',
      //   signal:'锚地',
      //   name:'anchorage',
      //   click:true,
      //   http:'post',
      //   img:'/mapSigns/base8.png'
      // },
      {
        url: '/port/findAll',
        signal: '港区',
        name: 'port',
        click: true,
        http: 'post',
        img: '/mapSigns/base6.png'
      },
      {
        url: '/berth/findAll',
        signal: '码头泊位',
        click: true,
        name: 'berth',
        http: 'post',
        img: '/mapSigns/base7.png'
      },
      {
        url: '/apron/findAll',
        signal: '停机坪',
        click: false,
        http: 'get',
        img: '/mapSigns/base1.png'
      }
    ]
    for (let i of url) {
      this.service[i.http](i.url, {
        'isfocus': this.focusButton
      })
        .then(res => {
          console.log(res,i.url)
          for (let e of res.data) {
            let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
            let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 15, 15, require('../../assets' + i.img))(i.signal)(() => {
            })
            marker.isFocus = false

            //是否允许点击
            if (i.click) {
              marker.addTo(this.markerLayersGroup).on('click', (event) => {
                // console.log(event)
                this.service.post('/' + i.name + '/view', {
                  id: e.id
                }).then(res => {
                  console.log(res.data)
                  let a = Object.entries(this.showInfo)
                  a.forEach(e => {
                    this.showInfo[e[0]] = false
                  })
                  // this.showInfo=new Map(a)
                  this.showInfo[i.name] = true
                  this.dialogInfo[i.name] = res.data.columns
                })
              })
            }

            if (e.isFocus) {
              // let marker= this.createMarker(bd09Arr[1],bd09Arr[0],15,15,require('../../assets' +i.img))(i.signal)(()=>{})
              marker.isFocus = true
              // marker.addTo(this.markerLayersGroup)
            } else {
            }
          }
        })
    }
    this.service.post('/anchorage/findAll', {
      'isfocus': this.focusButton
    }).then(res => {
      for (let e of res.data) {
        let bd09Arr = wgs84ToBD(e.longitude, e.latitude)
        let marker = this.createMarker(bd09Arr[1], bd09Arr[0], 15, 15, require('../../assets/mapSigns/base8.png'))('锚地')
        ((event) => {
          this.service.post('/anchorage/view', {
            id: e.id
          }).then(res => {
            // console.log(res.data)
            let a = Object.entries(this.showInfo)
            a.forEach(e => {
              this.showInfo[e[0]] = false
            })
            this.showInfo.anchorage = true
            if (this.hasLayer(this.map, 'anchorage' + e.id).length > 0) {
              res.data.showed = true
            } else {
              res.data.showed = false
            }

            this.dialogInfo.anchorage = res.data
          })
        })
        marker.isFocus = false
        marker.addTo(this.markerLayersGroup)
        if (e.isFocus) {
          marker.isFocus = true
        }
      }
    })
    this.service.get('/road/findAllDetail').then(res => {
      for (let i of res.data) {
        // console.log(i)
        let p = []
        i.points.forEach(e => {
          let bd09Arr = wgs84ToBD(e.lon, e.lat)
          p.push([bd09Arr[1], bd09Arr[0]])
        })
        let arrow = L.polyline(p, {
          //颜色
          color: 'red'
        }).addTo(this.roadLayer)

      }
    })
  },
  //leaflet 折线 没有设置透明度属性 只能删除重新绘制
  loadSeaLineLayer(){
    this.service.post('/seaLine/findAll', {
      'isfocus':this.focusButton
    }).then(res => {
      for (let i of res.data) {
        // console.log(i)
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
          color: 'rgba(255,137,135,0.62)'
        }).addTo(this.seaLineLayer)
        arrow.signal=i
        arrow.isFocus=i.isFocus

        arrow.on('click', (e) => {
          let a = Object.entries(this.showInfo)
          a.forEach(e => {
            this.showInfo[e[0]] = false
          })
          // console.log(i)
          this.showInfo.seaLine = true
          this.dialogInfo.seaLine = i
        })

        var pd = L.polylineDecorator(r, {
          //添加模式
          patterns: [{
            //模式符号的偏移位置
            offset: 0,
            //模式符号的重复间隔
            repeat: 10,
            //符号实例
            symbol: L.Symbol.dash({
              //符号大小
              pixelSize: 5,
              pathOptions: {
                //颜色
                color: '#d42727',
                //线宽
                weight: 1,
                //透明度
                opacity: 1
              }

            })
          }]
        }).addTo(this.seaLineLayer)
        pd.signal=i
        pd.isFocus=i.isFocus
      }
    })
  },
  // 锚地消息框 点击事件
  showAnchArea(data) {
    // console.log(data)
    if (data) {
      // console.log(this.hasLayer(this.map,'anchorage'+this.dialogInfo.anchorage.id))
      // 0:圆形  2:矩形 1:多边形
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
        1: (waters) => {
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
        2: (waters) => {
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
        '1': 'polygon',
        '2': 'rectangle'
      }
      // map[this.dialogInfo.anchorage.waters.type](this.dialogInfo.anchorage.waters)
      this.createPolygon(m[this.dialogInfo.anchorage.waters.type],this.dialogInfo.anchorage.waters,'anchorage' + this.dialogInfo.anchorage.id,
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
  infoViewFocus(data) {
    console.log(data)
    if (!data.focus) {
      console.log('关注', data)
      this.service.post('/focus/add', {
        targetSign: data.targetSign,
        description: data.description,
        targetType: data.targetType
      }).then(res => {

        console.log(res)
      })
    } else {
      console.log('取消')
      this.service.post('/focus/deleteBySignAndType', {
        targetSign: data.targetSign,
        targetType: data.targetType
      }).then(res => {

        console.log(res)
        if (res.code === 0) {
          this.$message.success('成功')
        }
      })
    }
  },
  //雷达船舶信息框
  radarShipView() {
    this.websocketsend(JSON.stringify({ action: 'radarShip', data: { radarid: this.dialogInfo.radar.id } }))
    let a = Object.entries(this.showInfo)
    a.forEach(e => {
      this.showInfo[e[0]] = false
    })
    this.showInfo.radarShip = true
  },
  //ais船舶信息框
  aisShipView(){
    // console.log(this.dialogInfo.aisInfo)
    this.service.post('/ship/aisShip', {
      id: this.dialogInfo.ais.id,
      limit: 6,
      page: 1
    })
      .then(req => {
        // let arr = [req.data[0],req.data[1],req.data[2],req.data[3],req.data[4]]
        this.dialogInfo.aisShipTable = req.data
        this.dialogInfo.aisShipTable.id = this.dialogInfo.ais.id
        // this.AisDataTabTotal = req.data.totalRow
        this.showInfo.aisShip=true
        console.log('ais',req)
      })
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
    this.service.get('/project/crimal').then(res => {
      // console.log(res)
      this.leftDrawerData.row2=res.data
    })
  },
  loadLeftDrawerData2(){

    this.service.get('/project/mystatistics').then(res=>{
      // console.log(res)
      this.leftDrawerData.row4=res.data
    })
  },
  loadLeftDrawerStation1(){
    this.service.post('/station/findPage', {
      condition: this.leftDrawerData.station1.name,
      limit: 7,
      page: this.leftDrawerData.station1.page,
    }).then(res => {
      // console.log('station',res)

      this.leftDrawerData.station1.list=res.data.list
      // this.leftDrawerData.station1.page=res.data.pageNumber
      this.leftDrawerData.station1.total=res.data.totalRow
      this.leftDrawerData.station1={...this.leftDrawerData.station1}
    })
  },
  loadLeftDrawerStation2(){
    this.service.post('/apron/findPage', {
      condition: this.leftDrawerData.station2.name,
      limit: 7,
      page: this.leftDrawerData.station2.page,
    }).then(res => {
      // console.log('station',res)

      this.leftDrawerData.station2.list=res.data.list
      // this.leftDrawerData.station1.page=res.data.pageNumber
      this.leftDrawerData.station2.total=res.data.totalRow
      this.leftDrawerData.station2={...this.leftDrawerData.station2}
    })
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
  LeftDrawerStationChange1(page){
    this.leftDrawerData.station1.page=page
    this.loadLeftDrawerStation1()
  },
  leftDrawerDailyEvent(e){
    this.showDailyEvent=true
    let beginTime=e+' 00:00',endTime=e+' 23:59'
    // console.log(new Date(beginTime).getTime(),new Date(endTime).getTime())
    this.service.post('/criminal/pageAllOfShip',{
      limit:3,
      page:this.dailyEventPage,
      type:0,
      beginTime:new Date(beginTime).getTime(),
      endTime:new Date(endTime).getTime(),
    }).then(res=>{

      // console.log(res)

      this.dailyEventList=res.data
      this.dailyEventList.today=e
    })
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
          duration.push(800)
        })
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
    this.service.post('/ship/shipTrack', {
      mmsi: this.dialogInfo.ship.mmsi,
      radarId: this.dialogInfo.ship.radarid,
      targetId: this.dialogInfo.ship.targetid,
      urlType: this.dialogInfo.ship.urltype
    })
      .then(res => {

        console.log(res)
        this.service.post('/camera/findAll', {
          stationId: this.dialogInfo.ship.attributionid
        }).then(res => {
          res.data.forEach((value) => {
            this.dialogInfo.camera = [...res.data]
            this.showInfo.camera=true
          })
        })

      })
  },
  shipDetail(data){
    console.log('shipDetail',data)
    // this.removeMapDom('ShipDetail')
    this.service.post('/ship/shipArchives', {
      mmsi: data
    }).then(res => {
      console.log(res)
      this.dialogInfo.shipDetail = res.data
      this.showInfo.shipDetail=true
    })
  },
  setShipHistory(e) {
    // console.log(e)
    //console.log(this.shipDatePicker).
    if (e === null) {
      return
    }
    this.animateLayer.clearLayers()
    this.service.post('/ship/shipHistory', {
      beginTime: e[0],
      endTime: e[1],
      mmsi: this.dialogInfo.ship.mmsi

    })
      .then(res => {

        console.log(res)
        if (res.data.length < 1) {
          this.$message.warning('暂无轨迹');
        }else{
          let points = [],duration=[]
          res.data.forEach(e => {
            let bd09Arr = wgs84ToBD(parseFloat(e.lon), parseFloat(e.lat))
            points.push([bd09Arr[1], bd09Arr[0]])
            duration.push(800)
          })
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
// 海域功能
const area={
  resetForm(formName)/* 提交重置 */ {
    if (this.$refs[formName] !== undefined) {
      this.$refs[formName].resetFields()
    }
  },
  showAllArea()/*显示隐藏所有区域*/ {

    // console.log('1231313')
    if (this.showOrHide ==='1') {
      console.log('显示所有')
      this.$refs.groupTree.showAllArea(this.areaData, this.watersLevel)
      for (let i of this.areaData) {
        const m = {
          '0': 'circle',
          '1': 'polygon',
          '2': 'rectangle'
        }
        let icon={
          1:' ⛒ ',
          2:' ★ ',
          3:' ✷ ',
        }
        for (let x of this.watersLevel) {//设置文字内容
          if (x.value === i.lever) i.typeLabel = icon[i.lever]+x.name
        }
        // console.log(i)
        this.createPolygon(m[i.type], i,'area' +i.id,
          this.areaTypeStyle[i.lever]
        )(wgs84ToBD).addTo(this.areaLayer);
      }
    } else {
      console.log('隐藏所有')
      this.areaLayer.clearLayers()
      this.$refs.groupTree.hideAllArea(this.areaData, this.watersLevel)
    }
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
  },
  loadGroupData() {

    this.service.get('/region/getGroupUid').then(res => {
      // console.log(res.data)
      this.groupData = JSON.parse(JSON.stringify(res.data))
    })
    this.service.get('/project/watersLevel').then(res => {
      // console.log(res.data)
      this.watersLevel = res.data
    })
    this.service.get('/region/getAllByUid').then(res => {
      // console.log(res.data)
      let arr=[]
      res.data.forEach(e=>{

        if(!this.focusButton){

          arr.push(e)
          return true
        }else{
          if(e.isFocus){
            arr.push(e)
            return true
          }
          return false
        }
      })
      console.log(arr)
      this.areaData = arr
      this.areaLength = this.areaData.length
      this.hideAllArea()
      this.showAllArea()
    })
  },
  // 拖拽 移动分组
  allowDrop(data)  {
    this.service.post('/region/updateRegionGroup', {
      'id': data.id,
      'groupId': data.groupId
    }).then(req => {
      console.log(req)

    })
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
    // this.map.clearOverlays(BMAP_DRAWING_CIRCLE)
    // this.map.clearOverlays(BMAP_DRAWING_RECTANGLE)
    // this.map.clearOverlays(BMAP_DRAWING_POLYGON)
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
          map[this.isDrawType]()
          console.log(this.isDrawType)

        }
      } else {
        console.log('error submit!!')
        return false
      }
    })
    // console.log(this.isDrawType )
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
    // var b = (JSON.stringify(this.currentDraw));
    // console.log(this.currentDraw)
    // this.map.removeOverlay(this.currentDraw)//切换图形 删除之前的图形
    // this.map.removeOverlay(this.currentDrawLabel)//切换图形 删除之前的图形文字
    this.drawData.radius = ''
    // this.drawData.groupId=this.groupData[0].id
    this.isDrawType = index
    // this.map.on('pm:drawstart', ({ workingLayer }) => {
    //   workingLayer.on('pm:vertexadded', e => {
    //     console.log(e);
    //   });
    // })
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
        this.drawData.positions.push(point)
        this.drawData.radius = e.layer.options.radius
        // this.currentDraw = e.layer
        // console.log(point[0][0], point[0][1], point[2][0], point[2][1])
        // L.circle([point[1],point[0]], { radius: e.layer.options.radius, color: 'red', fillColor: '#f03', fillOpacity: 1 }).addTo(this.map);
        // // L.circle([point[2][1],point[2][0]], { radius: 30, color: 'red', fillColor: '#f03', fillOpacity: 1 }).addTo(this.map);
        // let neArr = bd09towgs84(point[2][0], point[2][1])
        // let swArr = bd09towgs84(point[0][0], point[0][1])
        // console.log(neArr, swArr)
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
        // L.circle([point[0][1],point[0][0]], { radius: 30, color: 'red', fillColor: '#f03', fillOpacity: 1 }).addTo(this.map);
        // L.circle([point[2][1],point[2][0]], { radius: 30, color: 'red', fillColor: '#f03', fillOpacity: 1 }).addTo(this.map);
        // this.drawData.positions.push(point[0],point[2])
        // let neArr = bd09towgs84(point[2][0], point[2][1])
        // let swArr = bd09towgs84(point[0][0], point[0][1])
        // console.log(neArr, swArr)
      })
    }
  },
  removeArea(data)/*删除区域/分组*/ {

    // console.log(data)

    if (data.type === 0) {
      // console.log('删除区域')
      // this.$emit('removeArea',{id:data.id,tpye:1})
      this.service.post('/region/deleteRegion', {
        'id': data.id
      }).then(res => {
        this.loadGroupData()
        console.log(res)
      })
    } else {
      // console.log('删除分组')
      // this.$emit('removeArea',{id:data.id,name: data.label,tpye:0})
      this.service.post('/region/deleteGroup', {
        'id': data.id,
        'name': data.label
      }).then(res => {
        this.loadGroupData()
      })
    }

    // this.loadGroupData()
    // let length=this.areaData.length
    // length--;
    // return length
  },
}
export default {
  ...map,
  ...menu,
  ...station,
  ...marker,
  ...leftDrawer,
  ...ship,
  ...area,
}
