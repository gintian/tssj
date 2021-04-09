<template>
    <div class="main">
            <div class="top">
                {{title}}：{{targetName}}
            </div>
        <el-date-picker
                v-model="timeVal"
                type="datetimerange"
                size="small"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                value-format="timestamp"
                
        >
        </el-date-picker>
                    <div style="text-align: right;">
                          <el-button size='mini' @click="no">取消</el-button>
                          <el-button size='mini' @click="timePicker" type="primary">确认</el-button>
                    </div>
            <div style="padding: 4px;text-align: right;position: absolute;top: 1px;right: 1px;">
                <el-button type="text" @click="destroy"  style="padding: 0;color: #eee;">X</el-button>
            </div>
    </div>
</template>
<script>
export default {
    props:{
        title:{
            type:String,
            default:'查询轨迹'
        },
        targetName:{
            //type:String,
            default:''
        }
    },
    data(){
        return{
            shipDatePickerStart:'',
            shipDatePickerEnd:'',
          timeVal:'',
          pickerOptions: {
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              }
            }]
          },
        }
    },
    methods:{
        yes(){
            this.$emit('yes',[this.shipDatePickerStart,this.shipDatePickerEnd]);
        },
        no(){
            this.$emit('no');
        },
        destroy(){
            this.$emit('destroy');
        },
      timePicker() {
        console.log(this.timeVal)
        this.$emit('yes',this.timeVal);
      }
    }

}
</script>
<style scoped>
.main{
    display: grid;
    padding: 10px;
    background: rgb(255, 255, 255);
    grid-row-gap: 10px;
    position: relative;
    padding-top: 40px;
    box-shadow: 2px 2px 5px #777;
    width: 435px;
}
.main .top{
    height: 30px;
    /*background: linear-gradient(rgb(103, 143, 232) 0%, rgb(63, 81, 181) 100%);*/
background: #2770D4;
    position: absolute;
    width: 100%;
    color: #Eee;
    line-height: 30px;
    text-indent: 5px;
}
</style>

