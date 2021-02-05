<template>
    <div id="chart3">
    </div>
</template>

<script>
  import echarts from 'echarts'
  import 'echarts/theme/macarons.js'

  export default {
    name: 'charts3',
    props: {
      barData:{
        type:Array,
        default:()=>[]
      }
    },
    watch:{
      barData(val){
        this.pieChartInit(val)
      }
    },
    data() {
      return {
        chart: null,
      }
    },
    mounted() {

      this.pieChartInit(this.barData)
      // this.pieChartInit()
      // if()
    },
    methods: {

      pieChartInit(data) {
        let myChart = echarts.init(document.getElementById('chart3'),'macarons')
        // 绘制图表

        let y=[],x=[]
        for(let i of data){
          x.push({
            value: i.name,
            // 突出周一

          })
          y.push(i.num)
        }
        console.log(x,y)
        let option = {
          xAxis: {
            type: 'category',
            data: x,

            axisLine: {
              lineStyle: {
                color: 'white',
                width: 1, //这里是为了突出显示加上的
              }
            },
            axisLabel:{
              rotate: document.body.offsetWidth<2000?30:0,
            }
          },
          yAxis: {
            type: 'log',
            min:1,
            logBase:10,
            axisLine: {
              lineStyle: {
                color: 'white',
                width: 1, //这里是为了突出显示加上的
              }
            },
          },
          series: [{
            data: y,
            type: 'bar',
            name:'数量',
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: 'top', //在上方显示
                  textStyle: { //数值样式
                    color: 'white',
                    fontSize: 16
                  }
                }
              }
            },

          }]
        };


        myChart.setOption(option)

      }

    }
  }
</script>

<style scoped>
    #chart3 {
        width: 100%;
        height: 100%;
        text-align: center;
        /*width: 200px;*/
    }
</style>
