<template>
  <div style=" height: 404px; background: white;">
    <div id="Statistics">
      <div class="signChildContent" v-for="(item,index) in shipList" :key="index"  v-show='index<3'>
        <h3>{{item.name}}</h3>:
        <span>{{item.value}}</span>  
      </div>   
    </div>
      <div id="piechart"> </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/macarons.js'
// import * as echarts from 'echarts';


export default {
  name: "shipStatistics",
  data() {
    return {
      shipStatistics: "",

    };
  },
  props: {
    shipList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  watch: {
    shipList(val) {
      console.log("监听到的统计数据", val);
      this.shipList = val;
      this.pieChartInit(val)
    }
  },
  mounted() {
    console.log("mounted shipList=====" + this.shipList);
     this.pieChartInit(this.shipList)
  },
  methods: {
    pieChartInit(data) {
        let x=[],y=[]
        for(let i in data){
          // data[i].name=i
          // data[i].value=i
          // Object.keys(i)[0].name=i
          // Object.values(i)[0].value=i
          // console.log('data[i]',i)
          x.push(i.name)
          // console.log('x',x)
          // console.log('y',y)
          y.push(i.num)
        }
         data=JSON.parse(JSON.stringify(data).replace(/num/g, 'value'))
        console.log('data',data)
        // var echarts = require('echarts');
        let myChart = echarts.init(document.getElementById('piechart'), 'macarons')
        // 绘制图表
        let option = {
          tooltip: {
            trigger: 'item',
            // formatter: '{a} <br/>{b}: {c} ({d}%)'
            formatter: '{b}: {d}%'
          },
           grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                width: "820px",
                height: "280px",
                containLabel: true
            },
          legend: {
                  // textStyle:{
                  //         color:'#d0d6ed'
                  // },
            // orient: 'horizontal',
            // type: 'scroll',
            // right: 10,
            top: '85%',
            left: 'center',
            bottom: 1,
            itemGap: 15,
            // itemWidth: 9,
            itemHeight: 10,
            textStyle: {
                    padding: [0, 0, 0, 8],
                },
            formatter: function (name) {
                    return (name.length > 3 ? (name.slice(0, 3) + "...") : name);
              },
            // bottom: 20,
            // data: x
            // data:data
          },
          series: [
            {
              bottom: 0,
              top: '-10%',
              // name: '船舶类型',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,//防止标签重叠策略  true 不重叠 
              label: { 
                show: false,
                //  show: true,
                position: 'center'
              },
              emphasis: {   //鼠标经过时的显示
                label: {
                  show: true,
                  //  show: false,
                  // position: 'center',
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                // show: false
                // show: true,
                normal: {
									lineStyle: {
										color: 'rgba(255, 255, 255, 0.3)'
									},
									smooth: 0.2,
									// length: this.standSize / 50,
									// length2: this.standSize / 100,
								}
              },
              data: data
              //  data: [
              //   {value: 1048, name: '搜索引擎'},
              //   {value: 735, name: '直接访问'},
              //   {value: 580, name: '邮件营销'},
              //   {value: 484, name: '联盟广告'},
              //   {value: 300, name: '视频广告'}
              // ]
            }
          ]
        }

        myChart.setOption(option)

      }
  }
};
</script>

<style scoped lang="less">
#Statistics {
  width: 512px;
  // height: 271px;
  // background: white;
  padding: 20px 15px 0 15px;
  // display: flex;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.signChildContent {
  display: flex;
  // justify-content: space-evenly;
}
.signChildContent span {
  color: #0075ee;
  font-size: 18px;
  font-weight: 900;
  margin-left: 12px;
}
#piechart {
        width: 100%;
        // height: 100%;
        height: 397px;
        /*width: 200px;*/
    }
</style>
