<template>
    <div id="leftDrawer">
        <transition name="slide-fade">
            <div class="outMain" v-show="show">
                <div class="side">
                  <div @click="side1=true" ><p></p></div>
                    <!-- <div @click="side1=true" :style="{background:side1?'#2349A4':'#3665BF'}"><p>数据分析</p></div>
                    <div @click="side1=false" :style="{background:!side1?'#2349A4':'#3665BF'}"><p>观测站</p></div> -->
                </div>
                <div class="main">
                    <div class="main1" v-show="side1">
                        <div class="row1">

                            <h3>融合目标 <span>{{row1.fusionShip}}</span></h3>
                            <h3>雷达目标 <span>{{row1.radarShip}}</span></h3>
                            <h3>AIS目标 <span>{{row1.AisShip}}</span></h3>
                             <h3>散货船 <span>{{row1.fusionShip}}</span></h3>
                            <h3>集装箱船 <span>{{row1.radarShip}}</span></h3>
                            <h3>油轮 <span>{{row1.AisShip}}</span></h3>
                             <h3>拖轮船 <span>{{row1.fusionShip}}</span></h3>
                            <h3>渔船 <span>{{row1.radarShip}}</span></h3>
                            <h3>客船 <span>{{row1.AisShip}}</span></h3>
                             <h3>其他 <span>{{row1.AisShip}}</span></h3>
                        </div>
                        <!-- <div class="row2">
                            <div class="title">
                                <i class="el-icon-d-arrow-right"></i>
                                <label>每月发生事件数量</label>
                            </div>
                            <div class="content">
                                <div id="main" style="width: 100%;height:100%;"></div>
                            </div>
                        </div>
                        <div class="row3">
                            <div class="title">
                                <i class="el-icon-d-arrow-right"></i>
                                <label>区域内船舶统计</label>
                            </div>
                            <div class="content">
                                <div class="item" v-for="(i,index) in row3.typeList" @click="selectShip(i,index)" :class="{'active':i.color==='yellow'}">
                                    <div class="progress" >
                                        <el-progress type="circle" :percentage="100-(i.num/row3.total).toFixed(2)*100" :width="32" :show-text="false" :color="i.color" :stroke-width='3'></el-progress>
                                        <p>{{i.num}}</p>
                                    </div>
                                    <span :title="i.name">{{i.name}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="row4">
                            <div class="title">
                                <i class="el-icon-d-arrow-right"></i>
                                <label>基础设施</label>
                            </div>
                            <div class="content">
                                <div class="item" v-for="i in row4">
                                    <p>{{i.name}}</p><p>{{i.num}}</p><el-progress :text-inside="true" :stroke-width="8" :percentage="i.percentage" color="#57FAFC" :show-text="false"></el-progress>
                                </div>
                            </div>
                        </div>
                    </div> -->
                    <!-- <div class="main2" v-show="!side1">

                        <div class="row1">
                            <el-input
                                    placeholder="请输入内容"
                                    suffix-icon="el-icon-search"
                                    @input="searchStation"
                                    v-model="stationName">
                            </el-input>
                        </div>
                        <div class="row2">
                            <div class="title"><p>海面目标观测站</p> <span>总数:{{station1.total}}</span> </div>
                            <div class="content">

                                <ul>
                                    <li v-for="i in station1.list" @click="showStation(i,10)">{{i.name}}</li>
                                </ul>
                                <el-pagination
                                        layout="prev, pager, next"
                                        :hide-on-single-page="true"
                                        @current-change="handleCurrentChange"
                                        :page-size="7"
                                        :current-page="station1.page"
                                        :total="station1.total">
                                </el-pagination>
                            </div>
                        </div>
                        <div class="row3">
                            <div class="title"><p>低空目标观测站</p> <span>总数:{{station2.total}}</span></div>
                            <div class="content">

                                <ul>
                                    <li v-for="i in station2.list" @click="showStation(i,14)">{{i.name}}</li>
                                </ul>
                                <el-pagination
                                        layout="prev, pager, next"
                                        :hide-on-single-page="true"
                                        @current-change="handleCurrentChange"
                                        :page-size="7"
                                        :current-page="station2.page"
                                        :total="station2.total">
                                </el-pagination>
                            </div>
                        </div>
                        <!--                       <div class="row4">-->
                        <!--                            <div class="title"><p>水下目标观测站</p> <span>总数:30</span></div>-->
                        <!--                           <div class="content">-->

                        <!--                           </div>-->
                        <!--                       </div>-->
                    </div> 
                </div>
            </div>

        </transition>
        <div class="btn" @click="hideMain">
            <font-awesome-icon v-show="!show" icon="angle-double-right" id="angle-double-right" style="width: 100%; font-size: 20px;color: rgb(83,236,241);vertical-align: middle;cursor: pointer" />
            <font-awesome-icon v-show="show" icon="angle-double-left" id="angle-double-left" style="width: 100%; font-size: 20px;color: rgb(83,236,241);vertical-align: middle;cursor: pointer" />
        </div>


    </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    name: 'LeftDrawer',
    props: {
      map:{
        type:Object,
        default:()=>{}
      },
      row1:{
        type:Object,
        default:()=>{}
      },
      row2:{
        type:Object,
        default:()=>{}
      },
      row3:{
        type:Object,
        default:()=>{}
      },
      row4:{
        type:Array,
        default:()=>[]
      },
      station1:{
        type:Object,
        default:()=>{}
      },
      station2:{
        type:Object,
        default:()=>{}
      }
    },
    data(){
      return{
        show:true,
        side1:true,
        stationName:'',
        baseColor:'#53ecf1',
        activeColor:'yellow',
        shipCheckedIndex:-1,

      }
    },
    watch:{
      show(val){
        // console.log(val)
        this.$emit('showLeft',val)
      },
      row1(val){
        // console.log(val)
        this.row1=val
      },
      row2(val){
        // console.log(val)
        this.row2=val

        this.initChart()
      },
      row3(val){
        // console.log('update',val,this.shipCheckedIndex)
        this.row3=val

        if(val.total===0){ val.total=1;}
        val.typeList.forEach(e=>{
          e.color='#53ecf1'
        })
        if(this.shipCheckedIndex!==-1){
          val.typeList[this.shipCheckedIndex].color='yellow'
        }
        // val.typeList[this.shipCheckedIndex].color='yellow'
        this.row3=val
      },
      row4(val){
        // console.log(val)
        val.forEach(e=>{
          if(e.num===0){
            e.percentage=0
            return
          }
          e.percentage=parseFloat((e.health/e.num).toFixed(2))*100
        })
        this.row4=val
      },
      station1(val){
        // console.log(val)
        let t=val.list.filter((e) => {
          return e.showed
          // if(!e.showed){
          //   return false
          // }
        })
        // console.log(t)
        this.station1.list=t
        this.station1.total=t.length

      },
      station2(val){
        // console.log(val)
        this.station2=val
      },
    },
    mounted() {
      // this.initChart()
      // this.$axios.get('http://192.168.1.36:8093/project/crimal1').then(res=>{console.log(this.row2=res.data.data);this.initChart()})
    },
    methods:{
      searchStation(){
        this.$emit('searchStation',this.stationName)
      },
      hideMain(){
        this.show=!this.show
      },
      initChart(){
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        let xMonth=[],xMonthData=[]
        let xDay=[],xDayData=[]
        let map={
          '1':"一月",'2':"二月",'3':"三月",'4':"四月",'5':"五月",'6':"六月",'7':"七月",'8':"八月",'9':"九月",'10':"十月",'11':"十一月",'12':"十二月",
        }
        for(let i of this.row2.month){
          xMonth.push(map[i.content])
          xMonthData.push(i.num)
        }
        for(let i of this.row2.day){

          xDay.push(i.content)
          xDayData.push({date:i.content,value:i.num})

        }
        // console.log(xDayData)
        let option = {
          color:['#12daff'],
          // backgroundColor: "#05224d",
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              animation: false,
              label: {
                backgroundColor: '#505765'
              }
            }
          },
          grid: {
            top: '15%',
            left: '1%',
            right: '1%',
            bottom: '0%',
            containLabel: true,
          },
          legend: {
            itemGap: 50,
            data: ['注册总量' ,'最新注册量'],
            textStyle: {
              color: '#f9f9f9',
              borderColor: '#fff'
            },
          },
          xAxis: [
            //   {
            //   type: 'category',
            //     show:false,
            //   boundaryGap: true,
            //   axisLine: { //坐标轴轴线相关设置。数学上的x轴
            //     show: true,
            //     lineStyle: {
            //       color: 'rgba(249,249,249,0.45)',
            //       // type:'dashed'
            //     },
            //   },
            //   axisLabel: { //坐标轴刻度标签的相关设置
            //     textStyle: {
            //       color: '#d1e6eb',
            //       margin: 15,
            //     },
            //   },
            //   axisTick: {
            //     show: false,
            //   },
            //   data: xMonth,
            // },
            {
              type: 'category',
              boundaryGap: true,
              show:true,
              axisLine: { //坐标轴轴线相关设置。数学上的x轴
                show: true,
                lineStyle: {
                  color: 'rgba(249,249,249,0.45)',
                  // type:'dashed'
                },
              },
              axisLabel: { //坐标轴刻度标签的相关设置
                textStyle: {
                  color: '#d1e6eb',
                  margin: 15,
                },
              },
              axisTick: {
                show: false,
              },
              data: xDay,
            }
          ],
          yAxis: [
            //   {
            //   type: 'value',
            //   min: 0,
            //   // max: 140,
            //   splitNumber: 7,
            //   splitLine: {
            //     show: true,
            //     lineStyle: {
            //       color: 'rgba(113,113,113,0.64)',
            //       type:'dashed'
            //     }
            //   },
            //   axisLine: {
            //     show: false,
            //   },
            //   axisLabel: {
            //     margin: 20,
            //     textStyle: {
            //       color: '#d1e6eb',
            //     },
            //   },
            //   axisTick: {
            //     show: false,
            //   },
            // },
            {
              type: 'value',
              min: 0,
              // max: 140,
              splitNumber: 7,
              splitLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(113,113,113,0.64)',
                  type:'dashed'
                }
              },
              axisLine: {
                show: false,
              },
              axisLabel: {
                margin: 20,
                textStyle: {
                  color: '#d1e6eb',
                },
              },
              axisTick: {
                show: false,
              },
            }
          ],
          series: [
            {
              name: '当日事件',
              type: 'line',
              // smooth: true, //是否平滑曲线显示
              // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
              showAllSymbol: true,
              symbol: 'emptyCircle',
              symbolSize: 6,
              // clip: false, //裁剪超出部分
              smooth: 0.5,
              // xAxisIndex:1,
              // yAxisIndex:1,
              lineStyle: {
                normal: {
                  color: "#53ecf1", // 线条颜色
                },
                borderColor: '#f0f'
              },
              label: {
                show: false,
                position: 'top',
                textStyle: {
                  color: '#fff',
                }
              },
              itemStyle: {
                normal: {
                  color: "#53ecf1",

                }
              },
              tooltip: {
                show: true
              },
              areaStyle: { //区域填充样式
                normal: {
                  //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(83,236,241,0.54)'
                  },
                    {
                      offset: 1,
                      color: 'rgba(0,0,0, 0)'
                    }
                  ], false),
                  shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
                  shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                }
              },
              data: xDayData
            },
            //   {
            //   name: '数量',
            //   type: 'bar',
            //     xAxisIndex:0,
            //     yAxisIndex:0,
            //   barWidth: 20,
            //   tooltip: {
            //     show: false
            //   },
            //   label: {
            //     show: true,
            //     position: 'top',
            //     textStyle: {
            //       color: '#fff',
            //     }
            //   },
            //   itemStyle: {
            //     normal: {
            //       // barBorderRadius: 5,
            //       // color: new echarts.graphic.LinearGradient(
            //       //     0, 0, 0, 1,
            //       //     [{
            //       //             offset: 0,
            //       //             color: '#14c8d4'
            //       //         },
            //       //         {
            //       //             offset: 1,
            //       //             color: '#43eec6'
            //       //         }
            //       //     ]
            //       // )
            //       color: function(params) {
            //         var colorList = ['#0ec1ff', '#10cdff', '#12daff', '#15ebff', '#17f8ff', '#1cfffb', '#1dfff1'];
            //         return colorList[params.dataIndex];
            //       }
            //     }
            //   },
            //   data: xMonthData
            // }
          ]
        };

        let _this=this
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        myChart.on('click', function (params) {
          console.log(params.data.date);
          _this.$emit('showDailyEvent',params.data.date)
        });
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.$emit('change1',val)
      },
      showStation(e,zoom){
        // console.log(e)
        // console.log(this.map)
        this.map.setView([e.latitude,e.longitude], zoom);
      },
      selectShip(i,index){
        console.log(i,this.map.getZoom())
       if(this.map.getZoom() >= 11){
         if(i.color==='yellow'){
           this.shipCheckedIndex=-1
           this.row3.typeList.forEach(e=>{e.color='#53ecf1'})
           this.row3.typeList=[...this.row3.typeList]
           this.$emit('shipType',{name:'',num:0})
         }else{
           this.shipCheckedIndex=index
           this.row3.typeList.forEach(e=>{e.color='#53ecf1'})
           i.color='yellow'
           this.row3.typeList=[...this.row3.typeList]
           // console.log(i)
           if(i.num===0){
             this.$message.error('该类型船舶数量为0！');
           }else{

             this.$emit('shipType',{name:i.name,num:i.num})
           }
         }
       }else{
         this.$message.error('请将图层调整到11级以下！')
       }
        // console.log(i)
      }
    }
  }
</script>

<style scoped lang="less">

    *{
        padding: 0;
        margin: 0;
    }
    .active{
        color: yellow;
    }
    #leftDrawer{
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 96% 4%;
        .outMain{
            display: grid;
            grid-template-columns: 15px 1fr;
            .main{
                width: 100%;
                height: 100%;
                .main1{
                    width: 100%;
                    // height: 100%;
                    margin: 0;
                    background: white;
                    // background: url("../../assets/leftDrawer/back.png") no-repeat;
                    /*background-size: 100%;*/
                    // display: grid;
                    // grid-template-rows: .3fr 3fr 3.5fr 2.2fr;
                    grid-row-gap: 10px;
                    color: black;
                    height: 210px;
                    .title{
                        i{
                            font-size: 14px;
                            font-weight: bolder;
                        }
                        label{
                            font-size: 15px;
                            padding-top: -2px;
                        }
                    }
                    .row1{
                        // padding: 5px 10px 0 10px;
                        padding:36px 17px 2px 18px;
                        display: grid;
                        h3{
                            font-size: 15px;
                            margin-bottom: 20px;
                        }
                        grid-template-columns: repeat(3,1fr);
                        span{
                            // color: #57FAFC;
                            color: #0075EE;
                            font-size: 18px;
                        }
                    }
                    .row2{
                        padding: 10px 10px 0 10px;
                        background: url("../../assets/leftDrawer/border.png") no-repeat;
                        background-size:  100% 100%;
                        display: grid;
                        grid-template-rows: 20px 90%;
                        .content{

                        }
                    }
                    .row3{
                        padding: 10px 10px 0 10px;
                        background: url("../../assets/leftDrawer/border.png") no-repeat;
                        background-size: 100% 100%;
                        display: grid;
                        grid-template-rows: 8% 92%;
                        .content{
                            display: grid;
                            grid-template-columns: repeat(6,1fr);
                            grid-template-rows: repeat(4,1fr);
                            place-items: center;
                            .item{
                                width:100%;
                                display: grid;
                                place-items: center;
                                cursor: pointer;
                                .progress{
                                    width: 32px;
                                    height: 32px;
                                    position: relative;
                                    p{
                                        display: grid;
                                        place-items: center;
                                        position: absolute;
                                        left: 0;
                                        right: 0;
                                        margin: 0 auto;
                                        top: .5em;
                                        line-height: 20px;
                                        font-size: 12px;
                                    }
                                }
                                span{
                                    max-width: 100%;
                                    font-size: 12px;
                                    white-space:nowrap;
                                    overflow:hidden;
                                    text-overflow:ellipsis;
                                }
                            }
                        }
                    }
                    .row4{
                        padding: 10px 10px 5px 10px;
                        background: url("../../assets/leftDrawer/border.png") no-repeat;
                        background-size:  100% 100%;
                        display: grid;
                        grid-template-rows: 25px 88%;
                        .content{
                            font-size: 12px;
                            display: grid;
                            grid-template-rows: repeat(6,1fr);
                            grid-template-columns: repeat(2,1fr);
                            grid-column-gap: 10px;
                            .item{
                                display: grid;
                                grid-template-columns: 1fr .5fr 1fr ;
                                align-items: center;
                                /*p{*/
                                /*    text-align: center;*/
                                /*}*/
                                /deep/.el-progress{
                                    height: 10px;
                                }
                            }
                        }
                    }
                }
                .main2{
                    padding-top: 15px;
                    width: 100%;
                    height: 100%;
                    color: white;
                    background: url("../../assets/leftDrawer/back.png") no-repeat;
                    display: grid;
                    grid-template-rows: 0.1fr 1fr 1fr 1fr;
                    grid-row-gap: 15px;
                    .row1{
                        text-align: center;
                        /*padding-top: 10px;*/
                        /deep/.el-input{
                            margin: 0;
                            width: 80%;
                            /deep/.el-input__inner{
                                color: #dedede;
                                background: transparent!important;
                            }
                            /deep/.el-input__icon{
                            }
                        }
                    }
                    .row2{
                        padding-left: 5%;
                        /*width: 90%;*/
                        display: grid;
                        grid-template-rows: 6% 1fr;
                        position: relative;
                        .title{
                            border-left: white solid 8px;
                            padding-left: 10px;
                            line-height: 100%;
                            font-size: 14px;
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            span{
                                display: grid;
                                justify-content: end;
                                padding-right: 10px;
                            }
                        }
                        .content{
                            margin-top: 10px;
                            background: #1F385B;
                            background: url("../../assets/leftDrawer/stationBack.png") no-repeat;
                            ul{
                                height: 95%;
                                display: grid;
                                grid-template-rows: repeat(7,1fr);
                                margin-left: 30px;
                                margin-top: 15px;
                                list-style: none;
                                user-select: none;
                                li{
                                    font-size: 14px;
                                }
                            }
                            /deep/.el-pagination{
                                position: absolute;
                                bottom: 0;
                                right: 0;
                                color: white;
                                background: transparent;
                                .btn-next,  .btn-prev{
                                    background: transparent;
                                    color: white;
                                    min-width: 15px;
                                }
                                .el-dialog, .el-pager li{
                                    background: transparent;
                                    min-width: 15px;
                                }
                            }
                        }
                    }
                    .row3{
                        padding-left: 5%;
                        /*width: 90%;*/
                        display: grid;
                        grid-template-rows: 6% 1fr;
                        position: relative;
                        .title{
                            border-left: white solid 8px;
                            padding-left: 10px;
                            line-height: 100%;
                            font-size: 14px;
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            span{
                                display: grid;
                                justify-content: end;
                                padding-right: 10px;
                            }
                        }
                        .content{
                            margin-top: 10px;
                            background: #1F385B;
                            background: url("../../assets/leftDrawer/stationBack.png") no-repeat;
                            ul{
                                height: 95%;
                                display: grid;
                                grid-template-rows: repeat(7,1fr);
                                margin-left: 30px;
                                margin-top: 15px;
                                list-style: none;
                                user-select: none;
                                li{
                                    font-size: 14px;
                                }
                            }
                            /deep/.el-pagination{
                                position: absolute;
                                bottom: 0;
                                right: 0;
                                color: white;
                                background: transparent;
                                .btn-next,  .btn-prev{
                                    background: transparent;
                                    color: white;
                                    min-width: 15px;
                                }
                                .el-dialog, .el-pager li{
                                    background: transparent;
                                    min-width: 15px;
                                }
                            }
                        }
                    }
                    .row4{
                        padding-left: 5%;
                        /*width: 90%;*/
                        display: grid;
                        grid-template-rows: 6% 1fr;
                        position: relative;
                        .title{
                            border-left: white solid 8px;
                            padding-left: 10px;
                            line-height: 100%;
                            font-size: 14px;
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            span{
                                display: grid;
                                justify-content: end;
                                padding-right: 10px;
                            }
                        }
                        .content{
                            margin-top: 10px;
                            background: #1F385B;
                            background: url("../../assets/leftDrawer/stationBack.png") no-repeat;
                            ul{
                                height: 95%;
                                display: grid;
                                grid-template-rows: repeat(7,1fr);
                                margin-left: 30px;
                                margin-top: 15px;
                                list-style: none;
                                user-select: none;
                                li{
                                    font-size: 14px;
                                }
                            }
                            /deep/.el-pagination{
                                position: absolute;
                                bottom: 0;
                                right: 0;
                                color: white;
                                background: transparent;
                                .btn-next,  .btn-prev{
                                    background: transparent;
                                    color: white;
                                    min-width: 15px;
                                }
                                .el-dialog, .el-pager li{
                                    background: transparent;
                                    min-width: 15px;
                                }
                            }
                        }
                    }
                }
            }
            .side{
                /*background: #2349A4;*/
                height: 100%;
                display: grid;
                grid-template-rows: repeat(2,1fr);
                div{
                    display: grid;
                    user-select: none;
                    color: white;
                    font-size: 12px;
                    place-content: center;
                    font-weight: lighter;
                }
            }
        }
        .btn{
            width: 20px;
            height: 100%;
            float: left;
            /*background: rgba(87, 250, 252, 0.51);*/
            background-image: linear-gradient(to left, rgba(54, 100, 192, 0.35), rgba(54, 100, 192, 0.1));
            /*position: relative;*/
            /*top: 40%;*/
            /*right: 0;*/
            cursor: pointer;
            opacity: 0;
            display: grid;
            place-items: center;
        }
        .btn:hover{
            opacity: 1;
        }
    }
    /deep/.el-progress-bar__outer{
        background: rgba(255, 255, 255, 0.14);
        height: 10px;
    }
    .slide-fade-enter-active {
        transition: all  .5s ease;
    }
    .slide-fade-leave-active {
        transition: all .3s ease;
    }
    .slide-fade-enter,.slide-fade-leave-to{
        transform: translateX(-100px);
        opacity: 0;
    }
    .slide-fade-enter-to,.slide-fade-leave{
        transform: translateX(0px);
        opacity: 1;
    }

</style>
