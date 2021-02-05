<template>
    <div id="chart4">
    </div>
</template>

<script>
  import echarts from 'echarts'
  import 'echarts-liquidfill';
  export default {
    name: 'charts4',
    props: {
      percent: Number,
      default:1
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
        let myChart = echarts.init(document.getElementById('chart4'))
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
            radius:'95%',
            backgroundStyle: {
              borderWidth: 5,
              borderColor: 'rgba(255,121,228,0.73)',
              color: 'rgba(239,113,214,0.55)'
            },
            outline: {
              show: false,
              borderDistance: 8,
              itemStyle: {
                color: 'none',
                borderColor: 'rgb(255,121,228)',
                borderWidth: 8,
                shadowBlur: 20,
                shadowColor: 'rgba(0, 0, 0, 0.25)'
              }
            },
            label: {
              show: true,
              color: 'rgb(184,87,165)',
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

        window.addEventListener("resize", () => {
          myChart.resize();
        });
      }

    }
  }
</script>

<style scoped>
    #chart4 {
        width: 90%;
        height: 85%;
        display: grid;
        place-items: center;
        /*width: 200px;*/
    }
</style>
