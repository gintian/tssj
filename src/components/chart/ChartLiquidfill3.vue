<template>
    <div id="chart6">
    </div>
</template>

<script>
  import echarts from 'echarts'
  import 'echarts-liquidfill';
  export default {
    name: 'charts4',
    props: {
      percent: Number,
      default:100
    },
    data() {
      return {
        chart: null,
      }
    },
    watch:{
      percent(val){
        console.log(val,'val')
        this.pieChartInit(val)
      }
    },
    mounted() {

      this.pieChartInit(this.percent)
      // this.pieChartInit()
      // if()
    },
    methods: {

      pieChartInit(val) {
        let myChart = echarts.init(document.getElementById('chart6'))
        // 绘制图表
        let data=[]
        let step=val/10.0
        for(let i=0.0;i<=val;i+=step){
          data.push(i)
        }
        let option = {
          series: [{
            type: 'liquidFill',
            data: data.reverse(),
            radius:'90%',
            backgroundStyle: {
              borderWidth: 5,
              borderColor: '#8E4AFF',
              color: '#6a37be'
            },
            outline: {
              show: false,
              borderDistance: 8,
              itemStyle: {
                color: 'none',
                borderColor: '#8E4AFF',
                borderWidth: 8,
                shadowBlur: 20,
                shadowColor: 'rgba(0, 0, 0, 0.25)'
              }
            },
            label: {
              show: true,
              color: '#5f31aa',
              insideColor: '#fff',
              fontSize: 50,
              fontWeight: 'bold',

              align: 'center',
              baseline: 'middle',
              position: 'inside'
            },
          }]
        };

        myChart.setOption(option)

      }

    }
  }
</script>

<style scoped>
    #chart6 {
        width: 90%;
        height: 85%;
        display: grid;
        place-items: center;
        /*width: 200px;*/
    }
</style>
