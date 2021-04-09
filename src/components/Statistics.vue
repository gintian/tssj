<template>
  <div>
    <div id="Statistics">
      <div class="signChildContent" v-for="(item,index) in shipList" :key="index"  v-show='index<3'>
        <h3>{{Object.keys(item)[0]}}</h3>:
        <span>{{Object.values(item)[0]}}</span>  
      </div>
       <div id="piechart">
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/macarons.js'

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
        for(let i of data){
          x.push(i.name)
          y.push(i.num)
        }
         data=JSON.parse(JSON.stringify(data).replace(/num/g, 'value'))
        console.log('data',data)
        let myChart = echarts.init(document.getElementById('piechart'), 'macarons')
        // 绘制图表
        let option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
                  textStyle:{
                          color:'#d0d6ed'
                  },
            orient: 'horizontal',
            type: 'scroll',
            right: 10,
            top: '90%',
            bottom: 20,
            data: x
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
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: data
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
  height: 271px;
  background: white;
  padding: 20px 15px 0 15px;
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
        height: 100%;
        /*width: 200px;*/
    }
</style>
