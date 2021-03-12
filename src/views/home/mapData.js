//关于船舶的所有的变量
import nl from 'element-ui/src/locale/lang/nl'

const ship={
  pointCollectionImg:'',//海量点图片
  areaShipData:[],
  isNormalShip:true,
  isAbnormalShip:true,
  shipMin5:true,//五分钟以内
  shipMin10 : true,//五分钟到十分钟
  shipMin15 :true,//十分钟到十五分钟
  shipMin20 :true,//十五分钟到二十分钟
  shipMin24 :true,//二十分钟到二十四分钟
  bulkShip : true , //散货船
  containerShip : true  ,//集装箱船
  tanker : true , //油轮
  tug : true,//拖轮
  fishingBoat : true,//渔船
  passengerShip : true,//客船

  shipRadar:true,//雷达目标
  shipAis:true,//Ais目标
  shipFusion:true,//融合目标

  myMovingMarker:'',//轨迹线

  wharf : true, //码头
  peer : true, //锚地
  ais : true, //ais
  radar : true,//雷达
}
//关于各种信息框开关的所有的变量
const button={
  showPointCollectionImg:false,//控制海量点图片显隐
  showSelectMarker:false,//控制筛船功能显隐

  showimportexcel:false,//控制导入离线船只功能显隐
  showlayerSelect:false,  //控制图层筛选功能显隐
  showObjectSelect:false,  //控制目标筛选功能显隐

  showShipCount:false, //九宫格密度是否展示
  showShipAreaCount:false, //统计是否展示
  shipCountData:[],
  shipAreaCountData:{},
  focusButton:false,
  areaCountOverlay:undefined,
  showShipStatistics:false,   //控制左侧国家列表功能显隐
  showMapSign:false,    //控制图例功能显隐
  shipStatistics:[],

  // 高级搜索的5个筛选类型
  searchdialog:false,    // 高级搜索按钮弹窗
  objectname:'',//目标名称
  objectmmsi:'',//目标编号
  shipflag:''  , oshipType:'',//目标类型
  objectArea:'', type:'', //目标区域

  // 高级搜索的5个筛选类型弹窗
  dialogVisible1:false, namelist:'', //目标名称
  dialogVisible2:false, mmsilist:'', //目标编号
  dialogVisible3:false,   typelist:'',//目标类型
  dialogVisible4:false,  beginTime:'', endTime:'', timelist:'',//目标时间
  dialogVisible5:false,  arealist:'', //目标区域

  videoWidth:'400px',//摄像头视频宽度
  isEnlargeVideo:true,//是否允许放大缩小摄像头
  dialogInfo:{
    radarShipTable:[],
    // radarShipTable:{}, //分页
    ais:{},
    stationInfo:{
      aisList:[],
      radarList:[],
      cameraList:[],
    },
    aisShipTable:{},
    ship:{},
    shipDetail:{},
    port:{},
    berth:{},
    seaLine:{},
    towerInfo:{},
    anchorage:{},
    radar:{},
    camera:[],
    planeInfo:{

    },
    focus:[],
  },
  planeID:{id:undefined,class:undefined,layer:undefined}, //当前点击的飞机ID
  showInfo:{
    ship:false,//船舶开关
    shipDetail:false,//船舶详情开关
    shipHistory:false,//船舶历史轨迹开关
    anchorage:false,//锚地开关
    berth:false, //码头泊位开关
    port:false, //港区开关
    seaLine:false, //海底光缆开关
    station:false, //资源站开关
    radar:false, //雷达开关
    radarShip:false, //雷达船舶列表开关
    ais:false, //ais开关
    aisShip:false, //ais船舶列表开关
    camera:false, //摄像头开关
    focus:false,//关注列表开关
  },
  showGroupView:false,
}
//左边抽屉 所有的变量
const leftDrawer={
  showLeft:true,//显示隐藏
  leftDrawerData:{ //左边抽屉总数据
    row1:{},
    row2:{},
    row3:{},
    row4:[],
    station1:{
      list:[],
      name:'',
      page:1,
      total:1,
    },
    station2:{
      list:[],
      name:'',
      page:1,
      total:1,
    },
  },
  leftDrawerShipType:{name:'',num:0},

  showDailyEvent:false,
  dailyEventList:{},
  dailyEventPage:1, //分页的当前页
}
// 资源站
const station={

  stationID:undefined,

  // ais radar camera 点击
  stationCheck:{
    station:true,//控制地图移动中 资源站不能被点击显示详情框
    ais:false,
    radar:true,
    camera:false,
    ship:true,
    aShip:true,
  },
}

// 功能菜单按钮
const menu={
  dropdownTitleData: [ //下拉框 视图渲染 数据
    { id: 1, icon:['fas', 'bullseye'], title: '目标' },
    // {
    //   id: 0, icon: ['fas','crosshairs'], title: '目标',
    //   // dropdownInfoData: [
    //   //   { id: 0, icon: 'ship', name: '正常船只', color: '#91FF91' ,prop:'ship',is:true},
    //   //   { id: 1, icon: 'ship', name: '异常船只', color: '#E91717',prop:'aShip',is:true },
    //   //   // { id: 2, icon: 'location-arrow', name: '5min以内', color: '#6fd6b4',is:true },
    //   //   // { id: 3, icon: 'location-arrow', name: '5-30 min', color: '#EEEE53',is:true },
    //   //   // { id: 4, icon: 'location-arrow', name: '30min以上', color: '#7E7E7E',is:true },
    //   //   { id: 5, icon: 'broadcast-tower', name: 'AIS 目标', color: '#91FF91',is:true },
    //   //   { id: 6, icon: 'satellite-dish', name: '雷达目标', color: '#91FF91',is:true },
    //   //   { id: 7, icon: 'atom', name: '融合目标', color: '#91FF91',is:true },
    //   // ]
    // },
    // {
    //   id: 1, icon:['fas', 'server'], title: '设备', dropdownInfoData: [
    //     { id: 1, icon: ['fas','satellite-dish'], name: '雷达' ,prop:'radar' ,is:true},
    //     { id: 2, icon:[ 'fas','broadcast-tower'], name: 'AIS',prop:'ais' },
    //     { id: 3, icon: ['fas','video'], name: '摄像头' ,prop:'camera'},
    //   ]
    // },
    // {
    //   id: 2, icon: 'edit', title: '标绘',
    //   // dropdownInfoData: [
    //   //   { id: 0, icon: 'circle', name: '圆形' },
    //   //   { id: 1, icon: 'square-full', name: '矩形' },
    //   //   { id: 2, icon: 'star', name: '多边形' }
    //   // ]
    // },
    { id: 2, icon: ['fas','ruler-combined'], title: '测距' },
    { id: 3, icon: ['far','object-group'], title: '区域' },
    { id: 4, icon:[ 'fas','print'], title: '打印' },
    { id: 5, icon: ['fas','sync'], title: '复位' },
    
   
    { id: 6, icon: ['fas','layer-group'], title: '图层'} ,
    { id: 7, icon: ['fas','filter'], title: '筛船' },
    { id: 8, icon: ['fas','download'], title: '导入' },
      // dropdownInfoData: [
      //   // { id: 0, icon: 'home', name: '资源站' ,ishttpGET:true},
      //   { id: 1, icon: 'anchor', name: '码头' ,is:true},
      //   { id: 2, icon: 'anchor', name: '锚地' ,is:true},
      //   { id: 3, icon: 'parking', name: '泊位',is:true},
      //   { id: 4, icon: 'gopuram', name: '铁塔' , ishttpGET:true},
      //   { id: 5, icon: 'ruler-horizontal', name: '海底光缆' ,is:true}
      // ]
    
    // { id: 6, icon: ['far','star'], title: '关注' },
    // { id: 7, icon: ['fas','vector-square'], title: '统计' },
    // { id: 8, icon: [ 'fas','th'], title: '密度' },
  ],
  measureRuler:null, //测距实例
  clickedMarker:{},//图层功能当前点击的覆盖物

   ruler1:null,//测距的方位实例1
   ruler2:null,
}

const socket={
  socketRadarData:undefined,
  socketRadarShipData:[],
  socketFlyData:[],
}
const area={
  showDrawView: false,//描绘区域是否展示
  isDrawType: undefined,//判断选中的类型
  DrawType: [{ label: '圆', value: 1 }, { label: '矩形', value: 2 }, { label: '多边形', value: 3 }],
  drawData: {
    preview:false,
    lever: '1',
    name: '',
    description: '',
    centerx: '',
    centery: '',
    radius: '',
    positions: [],
    groupId: ''
  },
  // drawData:{
  //   level: '',
  //   name: '',
  //   type: '',
  //   lat: '',
  //   lon: '',
  //   radius: ''
  // },
  disabledDraw:true,
  showGroupView: false,//是否展示绘制分组界面
  showAddGroup: false,//是否展示添加分组界面
  groupName: '',//添加分组界面分组名称
  groupData: [],
  currentDraw: {},//当前绘制的图形
  currentDrawLabel: {},//当前绘制的图形的文字信息
  areaData: [],
  areaLength: 0,  //区域设置显示
  showOrHide: '1',
  watersLevel: [],
  areaTypeStyle: {
    1: {
      color: '#eaeaea',
      opacity: 0.8,
      fillColor: '#ff3a3d',
      strokeStyle: 'dashed',
      fillOpacity: 0.4
    },
    2: {
      color: '#eaeaea',
      opacity: 0.8,
      fillColor: '#FFFC82',
      strokeStyle: 'dashed',
      fillOpacity: 0.4
    },
    3: {
      color: '#eaeaea',
      opacity: 0.8,
      fillColor: '#fc923a',
      strokeStyle: 'dashed',
      fillOpacity: 0.4
    }
  }
}


//关于地图的变量
const map={
  shipselect:[ "散货船", "集装箱船", "油轮", "客船", "渔船", "拖轮","其他"],
  timeselect:[],
  areaselect:[],
  map: null,
  ciLayer: null,//船舶覆盖物图层
  focusShipLayer: null,//关注船舶图层
  maxMapZoom:11,
  mapZoom:10,//当前地图等级
  baseLayer:null,//海图图层
  sateLayer:null,//卫星图图层

  drawLayer:null,//手动绘制图层
  
  animateLayer:null,//轨迹动画图层
  planeLayer:null,//飞机图层
  areaLayer:null,//飞机图层
  leftDrawerShipTypeLayer:null,//侧边栏船舶类型图层
  stationLayerGroup:null,//资源站覆盖物group
  stationLayer:null,//资源站图层
  radarLayer:null,//雷达图层
  markerLayersGroup:null,//被动保障类覆盖物group
  roadLayer:null,//执勤道路
  seaLineLayer:null,//海底光缆
  departmentLayerGroup:null,//部门group
  anchLayer:null,//锚地图层
  apronLayer:null,//停机坪图层
  orgLayer1:null,//海军图层
  orgLayer2:null,//陆军海防部队图层
  orgLayer3:null,//军分区图层
  orgLayer4:null,//海警局图层
  orgLayer5:null,//公安局图层
  orgLayer6:null,//海事局图层
  orgLayer7:null,//海洋渔业图层
  orgLayer8:null,//军民融合图层
  orgLayer9:null,//海关图层
  orgLayer10:null,//边检图层

}
export let mapData ={
  ...ship,
  ...station,
  ...button,
  ...leftDrawer,
  ...map,
  ...menu,
  ...socket,
  ...area,
}
