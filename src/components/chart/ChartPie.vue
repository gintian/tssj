<template>
    <div id="chart2">
    </div>
</template>

<script>
  import echarts from 'echarts'
  import 'echarts/theme/macarons.js'

  export default {
    name: 'charts2',
    props: {
      pieData:{
        type:Array,
        default:()=>[]
      }
    },
    data() {
      return {
        chart: null,
      }
    },
    watch:{
      pieData(val){
        console.log(val,'val')
        this.pieChartInit(val)
      }
    },
    mounted() {

      this.pieChartInit(this.pieData)
      // this.pieChartInit()
      // if()
    },
    methods: {

      pieChartInit(data) {
        let x=[],y=[]
        for(let i of data){
          x.push(i.name)
          y.push(i.num)
        }
         data=JSON.parse(JSON.stringify(data).replace(/num/g, 'value'))
        console.log(data)
        let myChart = echarts.init(document.getElementById('chart2'), 'macarons')
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
              name: '船舶类型',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
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
  }
</script>

<style scoped>
    #chart2 {
        width: 100%;
        height: 100%;
        /*width: 200px;*/
    }
</style>
