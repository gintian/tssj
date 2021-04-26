<template>
  <div style=" width:512px;height: 455px; background: white;">
    <div id="Statistics">
      <div class="signChildContent" v-for="(item,index) in shipList" :key="index"  v-show='index<3'>
        <h3>{{item.name}}</h3>:
        <span>{{item.value}}</span>  
      </div>   
    </div>
      <div style=" width:453px;height: 394px;background: white;" id="piechart"> </div>
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
      // console.log("监听到的统计数据", val);
      this.shipList = val;
      this.pieChartInit(val)
    }
  },
  mounted() {
    // console.log("mounted shipList=====" + this.shipList);
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
        // console.log('data',data)
        let myChart = echarts.init(document.getElementById('piechart'), 'macarons')
        // 绘制图表
        let data0=[]
        for(let i in data){
          if(i>2){
            data0.push(data[i])
            // console.log('data0.',data0)
          }
        }
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
            width:'100%',
            top: '85%',
            left: 'center',
            bottom: 1,
            // itemGap: 10,  //每项之间的间隔
            itemWidth: 18,  //图例标记的宽度
            itemHeight: 10,
            textStyle: {
                    padding: [0, 2, 0, 10],
                    // fontStyle:'oblique',
                    fontWeight:'bolder',
                    color:'#333',
                    // fontSize:13
                },
            formatter: function (name) {
                    // return (name.length > 8? (name.slice(0, 6) + "...") : name +option.series[0].data[i].value);
                       var data = option.series[0].data;
                        var total = 0;
                        var tarValue;
                        for (var i = 0; i < data.length; i++) {
                          total += data[i].value;
                          if (data[i].name == name) {
                            tarValue = data[i].value;
                          }
                        }
                        // console.log("percent",name)
                        var v = tarValue;
                        // var p = Math.round(((tarValue / total) * 100));
                        return `${name}  ${v}`;
                       
              },
          },
          series: [
            {
              bottom: 0,
              top: '-10%',
              // name: '船舶类型',
              type: 'pie',
              radius: ['30%', '50%'],
              avoidLabelOverlap: true,//防止标签重叠策略  true 不重叠 
              emphasis: {   //鼠标经过时的显示
                label: {
                  show: true,
                  //  show: false,
                  // position: 'center',
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              label:{
                //show:false,
                // alignTo:'labelLine',
                fontSize:14,
                edgeDistance: 0,
                bleedMargin: 0,
              },
              labelLine:{
                // show:false,
                length: 16,
                length2: 26,
              },
              data: data0
            }
          ]
        }

        myChart.setOption(option)
        // myChart.resize();  // 自动调整canvas
        const resizeObserver = new ResizeObserver(entries => {
          for (let entry of entries) {
            // console.log(entry.target.style.width)
          }
        });
        resizeObserver.observe(document.querySelector('#piechart'));
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
