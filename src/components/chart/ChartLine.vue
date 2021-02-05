<template>
    <div id="chart1">
    </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: 'charts',
    props: {
      // chartType:{
      //   type:String,
      //   default:'line'
      // }
      lineData: Array
    },
    data() {
      return {
        chart: null,
        fd: [
          { value: 5, name: '直接访问' },
          { value: 1, name: '邮件营销' }
        ]
      }
    },
    mounted() {
      this.lineChartInit()
    },
    watch: {
      lineData:function(v) {
          this.lineChartInit()
      }
    },
    methods: {

      lineChartInit() {
        let myChart = echarts.init(document.getElementById('chart1'))
        // 绘制图表
        let _this = this

        myChart.setOption({
          title: { text: '船舶',
            textStyle:{color: 'wheat'}
          },
          tooltip: {},
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: _this.lineData[0],
            axisLine: {
              lineStyle: {
                color: 'wheat',
                width: 1, //这里是为了突出显示加上的
              }
            },
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: 'wheat',
                width: 1, //这里是为了突出显示加上的
              }
            },
          },
          series: [{
            data: _this.lineData[1],
            type: 'line',
            areaStyle: {
              color: 'rgba(105,150,255,0.5)'
            },
            lineStyle: {
              color: '#6794fb'
            }
          }]
        })
      }

    }
  }
</script>

<style scoped>
    #chart1 {
        height: 100%;
        width:100%;

        min-height: 250px;
    }
</style>
