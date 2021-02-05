import { wgs84ToBD } from '../../utils/coordinateConvert'

/**
 * 百度地图自定义覆盖物构建函数
 * @param {view} DOM 元素
 */
export let mapComopentFun = (view)=>{
    function fun(){
        // 默认停靠位置和偏移量
        this.defaultAnchor = window.BMAP_ANCHOR_TOP_LEF;
        this.defaultOffset = new BMap.Size(10, 10);
    }
    fun.prototype = new BMap.Control();
    fun.prototype.initialize =  (map) =>{
        map.getContainer().appendChild(view);
        return view;
    }
    let okFun = new fun();
    return okFun;
}
/*
* 防抖函数
*/
export function debounce(fn,wait){
  var timer = null;
  return function(){
      if(timer !== null){
          clearTimeout(timer);
      }
      timer = setTimeout(fn,wait);
  }
}
/**
 * 添加地图绘制覆盖物
 * 创建多边形
 * type 0 是圆形 、 1 是多边形 、2 是矩形
 */
export let addPolygon = (waters,style) =>{
 // console.log('waters?',waters);

  let obj = {

    2:(wgs84ToBD)=>{
      let p1=wgs84ToBD(waters.lon1, waters.lat1)
      let p2=wgs84ToBD(waters.lon2,waters.lat2)
      let pStart = new BMap.Point(p1[0], p1[1]);
      let pEnd = new BMap.Point(p2[0],p2[1]);
      return new BMap.Polygon([
        new BMap.Point(pStart.lng,pStart.lat),
        new BMap.Point(pEnd.lng,pStart.lat),
        new BMap.Point(pEnd.lng,pEnd.lat),
        new BMap.Point(pStart.lng,pEnd.lat)
      ], { ...style });  //创建矩形
    },
    1:(wgs84ToBD)=>{
      let arr = [];

      waters.points.forEach( e => {
        let p=wgs84ToBD(e.lon,e.lat)
        arr.push(new BMap.Point(p[0],p[1]))
        //return new BMap.Point(e.lon,e.lat)
      } )
      return  new BMap.Polygon(arr,  { ...style });  //创建多边形;
    },
    0:(wgs84ToBD)=>{
      let p=wgs84ToBD(waters.centerx, waters.centery)
      let point = new BMap.Point(p[0],p[1]);
      return new BMap.Circle(point,waters.radius, { ...style }); //创建圆
    }
  }


  return (wgs84ToBD)=>{return obj[waters.type](wgs84ToBD)};
}
/**
 * 柯里化 函数
 * 添加 船舶 覆盖物
 */
export let addShipMarker = (x,y,c) => {

  let pt = new BMap.Point(x, y);// 创建点

  return (w,h,img) => {

    let myIcon = new BMap.Icon( img , new BMap.Size(w,h),{
      imageSize:new BMap.Size(w,h)
    });
    let marker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
    marker.setRotation(c);
    marker.setZIndex(2)
    return imei => {

      marker.imei = imei;

      return fun =>{

        marker.addEventListener("click", fun);

        return marker;
      }
    }
  }
}
/**
 * 添加 覆盖物 自定义图片
 */
export let addMyMarker = (x,y) => {
    let pt = new BMap.Point(x, y);// 创建点

    return (w,h,img,pAngle = 0) => {

      let myIcon = new BMap.Icon( img , new BMap.Size(w,h),{
        imageSize:new BMap.Size(w,h),
        //imageOffset:new BMap.Size(-w/2,-h/2)
      });
      //myIcon.setImageSize(w,h)
      let marker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
      marker.setRotation(pAngle);
     // marker.setRotation(c);

      return (imei) => {

        marker.imei = imei;
        //marker.setRotation(2);
        return fun =>{

          marker.addEventListener("click", fun);

          return marker;
        }
      }
    }
}
export let addPointImg = (dom,w,h) =>{

  let ComplexCustomOverlay = function(point,num) {
    this._point = point;
    this._num = num;
  };

  ComplexCustomOverlay.prototype = new BMap.Overlay();

  ComplexCustomOverlay.prototype.initialize = function(map){
    //console.log('pixel');
    let div =   dom;
    this._div =  dom;
    this._map = map;
    let pixel = map.pointToOverlayPixel(this._point);
    //console.log(dom);
    //this._div.style.position = "absolute";
    // console.log('width',this._div.style.width)
     this._div.style.width = w + 'px';
    this._div.style.height = h + 'px';
    map.getPanes().labelPane.style.zIndex = 400;
    map.getPanes().labelPane.appendChild(div)

    return div;
  }
  ComplexCustomOverlay.prototype.draw = function(){
    //console.log('width',this._div.style.width)
    let map = this._map;
    let pixel = map.pointToOverlayPixel(this._point);
    // this._div.style.left = 0  + 'px'
    // this._div.style.top = 0  + 'px'

  }

  return (lon,lat,num=0) => {

    let customOverlay = new ComplexCustomOverlay(new BMap.Point(lon,lat),num);
    //console.log('aaaa',lon,lat)
    return imei =>{

      customOverlay.imei = imei;
      return customOverlay;
    }
  }
}
/**
 * 添加  自定义覆盖物
 */
export let customMarker = (longitude,latitude,scope) => {
  // console.log(longitude,latitude)
  let distant=scope*16.461 //一海里 === 16.46px
  // let _this = this
  let bd09Arr = wgs84ToBD(longitude, latitude)
  return (_this)=>{

    function ComplexCustomOverlay(point, text, mouseoverText) {
      this._point = point
      this._text = text
      this._overText = mouseoverText
    }

    ComplexCustomOverlay.prototype = new BMap.Overlay()
    ComplexCustomOverlay.prototype.initialize = function(map) {
      this._map = map
      var div = this._div = document.createElement('div')
      div.style.position = 'absolute'
      div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat)
      div.style.backgroundColor = 'rgba(37,72,119,0.74)'
      div.style.border = '1px solid rgba(255,255,255,0.5)'
      div.style.color = 'white'
      div.style.height = distant+'px'
      div.style.width = distant+'px'
      div.style.borderRadius = '50%'
      div.style.padding = '0px'

      var div2 = this._div2 = document.createElement('div')
      div2.style.background = ''
      div2.style.position = 'absolute'
      div2.style.backgroundColor = 'rgba(255,58,61,0.74)'
      div2.style.width = '5px'
      div2.style.height = '5px'
      div2.style.borderRadius = '50%'
      div2.style.top = 'calc(50% - 2px)'
      div2.style.left = 'calc(50% - 2px)'
      // div2.style.overflow = "hidden";
      div.appendChild(div2)

      _this.map.getPanes().labelPane.appendChild(div)
      // map.getPanes().labelPane.style.zIndex = 400;
      return div
    }
    ComplexCustomOverlay.prototype.draw = function() {
      // console.log( this._div.parentElement.style.zIndex)
      // this._div.parentElement.style.zIndex='300'
      // this._div.style.zIndex='-300'
      var map = _this.map
      var pixel = map.pointToOverlayPixel(this._point)
      let s = distant / (Math.pow(2, 10)) * Math.pow(2, _this.map.getZoom())
      let s2 = distant*0.02 / (Math.pow(2, 10)) * Math.pow(2, _this.map.getZoom())
      // console.log(pixel.x,pixel.y,s,_this.map.getZoom())
      this._div.style.left = pixel.x - 0.5095 * s + 'px'
      this._div.style.top = pixel.y - 0.51 * s + 'px'
      this._div.style.width = s + 'px'
      this._div.style.height = s + 'px'
      this._div2.style.width = s2 + 'px'
      this._div2.style.height = s2 + 'px'
    }
    ComplexCustomOverlay.prototype.addEventListener = function(event,fun){
      this._div['on'+event] = fun;
    }
    // console.log(this._div)
    var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(bd09Arr[0], bd09Arr[1]), '')
    return imei=>{
      myCompOverlay.imei = imei
        // myCompOverlay.addEventListener('click',function() {
        //
        //   alert(123)
        // });

        return myCompOverlay;
    }
  }



}
/**
 *
 */
export let updateMarkerSize = (marker,zoom,imei,idName) => {
    //console.log(zoom);
    let count = Math.pow(2,zoom-5); //100/(10/(5*zoom)) w/(2*s
    let myIcon = marker.getIcon();

        myIcon.setSize(new BMap.Size(count,count));
        myIcon.setImageSize(new BMap.Size(count,count));
        myIcon.setAnchor(new BMap.Size(count/2,count/2))
    let myPosition = marker.getPosition();
    let myMarker = new BMap.Marker(myPosition,{icon:myIcon});
        myMarker.imei = imei;
        myMarker.idName = idName;
        //myMarker.setOffset()

    return (fun)=>{

      myMarker.addEventListener("click", fun);

      return myMarker;
    }
}

export let addStationDom = (dom,scope) =>{
  let distant=scope*16.461 //一海里 === 16.46px
  let ComplexCustomOverlay = function(point,num) {
    this._point = point;
    this._num = num;
  };

  ComplexCustomOverlay.prototype = new BMap.Overlay();

  ComplexCustomOverlay.prototype.initialize = function(map){
    //console.log('pixel');
    let div =   dom;
    this._div =  dom;
    this._map = map;
    let pixel = map.pointToOverlayPixel(this._point);
    //console.log(dom);
    //this._div.style.position = "absolute";
    // console.log('width',this._div.style.width)
    //  this._div.style.width = (2 * magnification) * range + 'px';
    //this._div.style.height = (2 * magnification) * range + 'px';

    //div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);

    // this._offsetWidth = parseInt(this._div.style.width.substring(this._div.style.width.length-2,0));
    // this._offsetHeight = parseInt(this._div.style.width.substring(this._div.style.width.length-2,0));
    // //console.log(pixel.x ,this._div.style.width)
    // this._div.style.position = "absolute";
    //
    //
    // this._div.style.left = pixel.x - this._offsetWidth / 2 + "px";
    // this._div.style.top  = pixel.y - this._offsetHeight / 2  + "px";
    // this._div.style.fontSize =  magnification*0.1<12?0:magnification*0.1 + 'px';
    map.getPanes().labelPane.style.zIndex = 400;
    map.getPanes().labelPane.appendChild(div)

    return div;
  }
  ComplexCustomOverlay.prototype.draw = function(){
    //console.log('width',this._div.style.width)
    let map = this._map;
    let pixel = map.pointToOverlayPixel(this._point);
    let s = distant / (Math.pow(2, 10)) * Math.pow(2, map.getZoom())
    let magnification  = 5/(Math.pow(2, 9))*Math.pow(2, map.getZoom())
    // this._div.style.fontSize =  magnification<8?0:magnification + 'px';
    // let s2 = distant*0.02 / (Math.pow(2, 10)) * Math.pow(2, _this.map.getZoom())
    // console.log(pixel.x,pixel.y,s,_this.map.getZoom())
    this._div.style.left = pixel.x - 0.5 * s + 'px'
    this._div.style.top = pixel.y - 0.50 * s + 'px'
    this._div.style.width = s + 'px'
    this._div.style.height = s + 'px'
    // this._div.style.fontSize = map.getZoom()/10 + 'px'
    //console.log(pixel);
  }
  return (lon,lat,num=0) => {

    let ok = new ComplexCustomOverlay(new BMap.Point(lon,lat),num);
    //console.log('aaaa',lon,lat)
    return imei =>{

      ok.imei = imei;
      return ok;
    }
  }
}
export let addRadarNodeStyle = {
  position: 'absolute',
  top: '45%',
  left: '45%',
  width: '10%',
  height: '10%',
  backgroundColor: '#0080e6',
  borderRadius: '50%',
  cursor: 'pointer',
  textAlign: 'center',
  boxShadow: '1px 7px 2px #5a5a5a',
  color: '#eee',
  zIndex: '5',
  display: 'flex',
}
/**
 * 地图雷达自定义DOM元素 添加函数
 * @param {dom元素} dom
 */
export let addRadarDom = (dom,range = 1) =>{

  let ComplexCustomOverlay = function(point,num) {
    this._point = point;
    this._num = num;
  };

  ComplexCustomOverlay.prototype = new BMap.Overlay();

  ComplexCustomOverlay.prototype.initialize = function(map){
    //console.log('pixel');
    let div =   dom;
    this._div =  dom;
    this._map = map;
    let magnification  = 5/(Math.pow(2, 9))*Math.pow(2, map.getZoom())
    let pixel = map.pointToOverlayPixel(this._point);
    //console.log(dom);
    //this._div.style.position = "absolute";
   // console.log('width',this._div.style.width)
  //  this._div.style.width = (2 * magnification) * range + 'px';
    //this._div.style.height = (2 * magnification) * range + 'px';

    //div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);

    this._offsetWidth = parseInt(this._div.style.width.substring(this._div.style.width.length-2,0));
    this._offsetHeight = parseInt(this._div.style.width.substring(this._div.style.width.length-2,0));
    //console.log(pixel.x ,this._div.style.width)
    this._div.style.position = "absolute";


    this._div.style.left = pixel.x - this._offsetWidth / 2 + "px";
    this._div.style.top  = pixel.y - this._offsetHeight / 2  + "px";
    this._div.style.fontSize =  magnification*0.1<12?0:magnification*0.1 + 'px';

    map.getPanes().labelPane.style.zIndex = 400;
    map.getPanes().labelPane.appendChild(div);

    return div;
  }
  ComplexCustomOverlay.prototype.draw = function(){
    //console.log('width',this._div.style.width)
    let map = this._map;
    let pixel = map.pointToOverlayPixel(this._point);
     //console.log('draw',this._offsetWidth,this._offsetWidth,this) let s=5/(Math.pow(2, 9))*Math.pow(2, this.map.getZoom())
      let magnification  = 4.2/(Math.pow(2,  8-map.getZoom()))
      let s  = 2/(Math.pow(2, 8-map.getZoom()))
      this._div.style.left = pixel.x -  (magnification*0.99) * range / 2 + "px";
      this._div.style.top  = pixel.y -  ( magnification*0.99) * range / 2  + "px";
      // console.log(s)
      this._div.style.fontSize = s<9?0:s + 'px';

      this._div.style.width = ( magnification) * range + 'px';
      this._div.style.height = ( magnification) * range + 'px';

    //console.log(pixel);
  }
  return (lon,lat,num=0) => {

    let ok = new ComplexCustomOverlay(new BMap.Point(lon,lat),num);
    //console.log('aaaa',lon,lat)
    return imei =>{

      ok.imei = imei;
      return ok;
    }
  }
}
/**
 * 地图信息框 添加函数
 * 需要在元素 style 里设置 高和宽 固定
 * @param {dom元素} dom
 */
export let addInfoBoxFun = (dom,is='') =>{

  let ComplexCustomOverlay = function(point,text,mouseoverText) {
    this._point = point;
    this._text = text;
    this._overText = mouseoverText;
  };

  ComplexCustomOverlay.prototype = new BMap.Overlay();

  ComplexCustomOverlay.prototype.initialize = function(map){
    console.log('pixel');
    let div = this._div =  dom;
    this._map = map;
    //let pixel = map.pointToOverlayPixel(this._point);
    div.style.position = "absolute";
    //div.style.display = 'block';
    //this._div.style.display = 'block';
    //div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    //div.style.left = pixel.x - div.offsetWidth / 2 + "px";
    //div.style.top  = pixel.y - div.offsetHeight - 10  + "px"; '275px'.substring('275px'.length-2,0)height
    this._offsetWidth = parseInt(dom.style.width.substring('275px'.length-2,0));
    this._offsetHeight = parseInt(dom.style.height.substring('275px'.length-2,0));
    //console.log(dom,dom)
    this._div.style.zIndex = 1000;
    map.getPanes().labelPane.style.zIndex = 9999;
    map.getPanes().labelPane.appendChild(div);

    return div;
  }
  ComplexCustomOverlay.prototype.draw = function(){
    let map = this._map;
    let pixel = map.pointToOverlayPixel(this._point);
    this._div.style.zIndex = 1000;
     //console.log('draw',this._offsetWidth,this._offsetWidth,this)
    if(is === 'radar'){
      this._div.style.left = pixel.x - this._offsetWidth / 2 + "px";
      this._div.style.top  = pixel.y - this._offsetHeight / 2  + "px";
    }else{
      this._div.style.left = pixel.x - this._offsetWidth / 2 + "px";
      this._div.style.top  = pixel.y - this._offsetHeight - 20  + "px";
    }

    //console.log(pixel);
  }
  return (lon,lat) => {

    let ok = new ComplexCustomOverlay(new BMap.Point(lon,lat), "",'');

    return imei =>{

      ok.imei = imei;
      return ok;
    }
  }
}
/**
 * 添加自定义图片标准
 * @param {*} x
 * @param {*} y
 * @param {*} imgUrl
 * @param {*} w
 * @param {*} h
 */
export let addMarker = (x,y,imgUrl,scale,w=52,h=52) =>{
    if(scale!=null){
        w =w/scale;
        h =h/scale;
    }
    var map = new BMap.Map();
    console.log(w)
    let pt = new BMap.Point(x, y);
    let myIcon = new BMap.Icon(require("../../assets"+imgUrl), new BMap.Size(w,h),{imageSize:new BMap.Size(w,h)});
    let marker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
    var sContent =
        "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>天安门</h4>" +
        "<img style='float:right;margin:4px' id='imgDemo' src='../img/tianAnMen.jpg' width='139' height='104' title='天安门'/>" +
        "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>天安门坐落在中国北京市中心,故宫的南侧,与天安门广场隔长安街相望,是清朝皇城的大门...</p>" +
        "</div>";
    var infoWindow = new BMap.InfoWindow(sContent);
    return (imei)=>{
        marker.imei = imei;
        return (map)=>{
            marker.addEventListener("click",  (e)=>{
                map.panTo(new BMap.Point(e.point.lng,e.point.lat));


                map.openInfoWindow(infoWindow);
            } );
            map.addOverlay(marker)// 将标注添加到地图中
            return marker;
        };
    }

}
export let removeOverlay=(map,imei='all')=>{
    let allOverlay = map.getOverlays();
    // console.log(allOverlay)
    if(imei=='all'){
        map.clearOverlays();
    }else{
        for (let i = 0; i < allOverlay.length; i++) {
            if (allOverlay[i].imei === imei) {
                // console.log(allOverlay)
                // allOverlay[i].enableMassClear();
                map.removeOverlay(allOverlay[i]); //
            }
        }
    }

}

export let modifyMarker=(map,marker,imgUrl,mapZoom=14,w=100,h=100)=>{
    removeOverlay(map)
    if(mapZoom<=12){
        // var map = new BMap.Map()
        // console.log(marker)


        if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
            var points = [];  // 添加海量点数据

            for(let i of marker){
                points.push(new BMap.Point(i.point.lng, i.point.lat));
            }
            var options = {
                size: BMAP_POINT_SIZE_SMALL,
                shape: BMAP_POINT_SHAPE_STAR,
                color: '#d340c3'
            }
            // removeOverlay(map)
            var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
            // pointCollection.addEventListener('click', function (e) {
            //     alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
            // });

            map.addOverlay(pointCollection);  // 添加Overlay
            console.log(pointCollection)
        } else {
            alert('请在chrome、safari、IE8+以上浏览器查看本示例');

    }}
    else if(mapZoom>=13&&mapZoom<=15){
        //console.log(marker)
        let s=4

        // console.log(t)

        for(let i in marker){
            let t=new BMap.Icon(require("../../assets"+imgUrl), new BMap.Size(w,h))
            t.imageSize=new BMap.Size(w/s,h/s)
            t.anchor=new BMap.Size(w/(2*s),h/(2*s))
            var marker2 = new BMap.Marker(new BMap.Point(marker[i].point.lng,marker[i].point.lat));
            marker2.setIcon(t)
            // console.log(marker[i])
            // marker[i].setIcon(new BMap.Icon(require("../../assets"+imgUrl), new BMap.Size(w*scale,h*scale)))
            map.addOverlay(marker2)
        }

    }
    else if(mapZoom>=16&&mapZoom<=18){
        let s=2
        let t=new BMap.Icon(require("../../assets"+imgUrl), new BMap.Size(w,h))
        t.imageSize=new BMap.Size(w/s,h/s)
        t.anchor=new BMap.Size(w/(2*s),h/(2*s))
        // t.imageUrl= 'http://placehold.it/300&text=C7SKY.COM'
        // console.log(t)
        for(let i in marker){
            let t=new BMap.Icon(require("../../assets"+imgUrl), new BMap.Size(w,h))
            t.imageSize=new BMap.Size(w/s,h/s)
            t.anchor=new BMap.Size(w/(2*s),h/(2*s))
            var marker2 = new BMap.Marker(new BMap.Point(marker[i].point.lng,marker[i].point.lat));
            marker2.setIcon(t)
            // console.log(marker[i])
            // marker[i].setIcon(new BMap.Icon(require("../../assets"+imgUrl), new BMap.Size(w*scale,h*scale)))
            map.addOverlay(marker2)
        }

    }




}
