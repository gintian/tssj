<template>
    <div>
        <div id="allmap"></div>
        <p style="display: none">{{mapData}}</p>
    </div>
</template>

<script>
    export default {
        name: "TableMap",
        props: {mapData: Array, markerType: String, option: {type: Object,default:{strokeColor:'blue ', strokeWeight:2, strokeOpacity:0.5}}},
        data() {
            return {
                map: null,
              travelData:[],
              markData:{}

            }
        },
        mounted() {
            this.mapInit();
          // console.log(this.mapData)
          if(this.mapData.length===1) {//如果传进来长度是1 直接data变成对象
            // console.log('567678678')
            this.markData=this.mapData[0]
            this.map.centerAndZoom(new BMap.Point(this.markData.longitude, this.markData.latitude), 13);  // 初始化地图,设置中心点坐标和地图级别
          } else{
            this.travelData=this.mapData
            this.map.centerAndZoom(new BMap.Point(this.travelData[0].lon, this.travelData[0].lat), 13);  // 初始化地图,设置中心点坐标和地图级别
          }
            this.addMarker(this.markerType)
        },
        updated() {
            this.mapInit();
            this.map.clearOverlays();
            console.log(this.markerType)

            this.map.addEventListener("click", (e) => {
                console.log(e.point)
            })

          // this.markData=this.mapData
          if(this.mapData.length===1) {//如果传进来长度是1 直接data变成对象
            // console.log('567678678')
            this.markData=this.mapData[0]
            this.map.centerAndZoom(new BMap.Point(this.markData.longitude, this.markData.latitude), 13);  // 初始化地图,设置中心点坐标和地图级别
            // return false
          } else{
            this.travelData=this.mapData
            this.map.centerAndZoom(new BMap.Point(this.travelData[0].lon, this.travelData[0].lat), 13);  // 初始化地图,设置中心点坐标和地图级别
          }

            // if(this.marker==0){
            //     console.log('遮盖物')
          // console.log(this.travelData)
            this.addMarker(this.markerType)
            // }
            // this.map.panTo(new BMap.Point(this.mapData.longitude,this.mapData.latitude))
        },
        methods: {
            mapInit() {
                // 百度地图API功能
                this.map = new BMap.Map("allmap");    // 创建Map实例
                this.map.centerAndZoom(new BMap.Point(122.02092469279008, 30.231412233427587), 13);  // 初始化地图,设置中心点坐标和地图级别
              this.map.setMapStyleV2({
                styleId: '20cc61302c9ac0b284d3076e6647033a'
              });
                //添加地图类型控件
                this.map.addControl(new BMap.MapTypeControl({
                    mapTypes: [
                        BMAP_NORMAL_MAP,
                        BMAP_HYBRID_MAP
                    ]
                }));
                // this.map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
                this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

            },
            addMarker(tp) {
              // console.log(this.markData)
                console.log(tp)
                const mp = {

                    'ship':()=>{
                        var pt = new BMap.Point(this.markData.longitude, this.markData.latitude);
                        var myIcon = new BMap.Icon(require("../assets/mapicon/ship2.png"), new BMap.Size(13,22));
                        var marker = new BMap.Marker(pt,{icon:myIcon});
                        marker.setRotation(this.markData.course)
                        return marker
                    },
                    'point': () => {
                        let marker = new BMap.Marker(new BMap.Point(this.markData.longitude, this.markData.latitude), {
                            anchor: new BMap.Size(10, 30)
                        });
                        return marker
                    },
                    'polyline': () => {
                        var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
                            scale: 0.6,//图标缩放大小
                            strokeColor:'#fff',//设置矢量图标的线填充颜色
                            strokeWeight: '2',//设置线宽
                        });
                        var icons = new BMap.IconSequence(sy, '10', '30');// 创建polyline对象
                      let pois = []
                      for(let i of this.mapData){
                        // console.log(i.lon,i.lat)
                        pois.push(new BMap.Point(parseFloat(i.lon),parseFloat(i.lat)))
                      }
                        var polyline =new BMap.Polyline(pois, {
                            enableEditing: false,//是否启用线编辑，默认为false
                            enableClicking: true,//是否响应点击事件，默认为true
                            icons:[icons],
                            strokeWeight:'8',//折线的宽度，以像素为单位
                            strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
                            strokeColor:"#18a45b" //折线颜色
                        });
                        return polyline
                    },
                    'circle': () => {
                        var circle = new BMap.Circle(new BMap.Point(this.markData.centerx, this.markData.centery), this.markData.radius, {
                            strokeColor: this.option.strokeColor,
                            strokeWeight: this.option.strokeWeight,
                            strokeOpacity: this.option.strokeOpacity
                        });
                        return circle
                    },
                    'polygon': () => {
                        let points = [];
                        for (let i of this.markData.points) {
                            points.push(new BMap.Point(i.lon, i.lat),)
                        }
                        var polygon = new BMap.Polygon(points, {
                            strokeColor: this.option.strokeColor,
                            strokeWeight: this.option.strokeWeight,
                            strokeOpacity: this.option.strokeOpacity
                        });
                        return polygon
                    },
                    'rectangle': () => {
                        var rectangle = new BMap.Polygon([
                            new BMap.Point(this.markData.lon1, this.markData.lat1),
                            new BMap.Point(this.markData.lon2, this.markData.lat1),
                            new BMap.Point(this.markData.lon2, this.markData.lat2),
                            new BMap.Point(this.markData.lon1, this.markData.lat2)
                        ], {
                            strokeColor: this.option.strokeColor,
                            strokeWeight: this.option.strokeWeight,
                            strokeOpacity: this.option.strokeOpacity});
                        return rectangle
                    },

                }
              // console.log(this.markData)
                this.map.addOverlay(mp[tp]());

            },

        }
    }
</script>

<style scoped>
    #allmap {
        width: 500px;
        height: 400px;

    }
</style>
