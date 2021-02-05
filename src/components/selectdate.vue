<template>
  <div style="border-radius:5px;height:33px;width:348px">
    <el-popover v-model="showPopover">
      <div>
        <div style="margin-top:5px;text-align:center;">
          <span>选择日期</span>
          <el-date-picker
            size="mini"
            v-model="beginDate"
            type="datetime"
            style="width:180px"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="beginDateOptions"
            placeholder="选择日期时间"
          ></el-date-picker>
          <span>至</span>
          <el-date-picker
            size="mini"
            v-model="finalDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            style="width:180px"
            placeholder="结束时间"
            :picker-options="fianlDateOptions"
          ></el-date-picker>
        </div>
        <div style="margin-top:5px;position:relative;left:50px">
          <el-row style="width:480px">
            <el-col :span="12">
              <el-button size="mini" type="text" @click="setDay(0)">今天</el-button>
            </el-col>
            <el-col :span="12" :pull="6">
              <el-button size="mini" type="text" @click="setDay(-1, true)">昨天</el-button>
            </el-col>
            <el-col :span="12">
              <el-button size="mini" type="text" @click="setDay(-7)">过去一周</el-button>
            </el-col>
            <el-col :span="12" :pull="6">
              <el-button size="mini" type="text" @click="setDay(-14)">过去两周</el-button>
            </el-col>
            <el-col
              :span="12"
              v-for="(m,index) in getMouth()"
              :key="index"
              :pull="(index+1)%2 == 0?6:0"
            >
              <el-button size="mini" type="text" @click="getformartDay(m)">{{m}}</el-button>
            </el-col>
          </el-row>
        </div>
        <hr style="border:1px solid #f0f0f0;margin: 5px 20px;" />
        <div style="text-align:right">
          <el-button size="mini" @click="showPopover = false">取消</el-button>
          <el-button type="primary" size="mini" @click="showPopover = false;handleConfirm()">确定</el-button>
        </div>
      </div>
      <div slot="reference" style="width:450px;display:inline-bloack">
        <el-input
          size="small"
          v-model="startDateInput"
          class="popover-input"
          placeholder="请选择日期"
          clearable
          @clear="handleConfirmClear(1)"
        ></el-input>
        <span>至</span>
        <el-input
          size="small"
          v-model="endDateInput"
          class="popover-input"
          placeholder="请选择日期"
          clearable
          @clear="handleConfirmClear(2)"
        ></el-input>
      </div>
    </el-popover>
  </div>
</template>
<script>
import dateUtil from "@/common/dateutil.js";

export default {
  props: {
    startDate: String,
    endDate: String
  },
  data() {
    return {
      beginDate: "",
      finalDate: "",
      showPopover: false,
      timeSpace: 0,
      startDateInput: "",
      endDateInput: "",
      beginDateOptions: {
        disabledDate: time => {
          return (
            time.getTime() > this.changeTimeOne() ||
            time.getTime() < this.changeTime()
          );
        }
      },
      fianlDateOptions: {
        disabledDate: time => {
          return (
            time.getTime() > this.changeTimeOne() ||
            time.getTime() < this.changeTime()
            //   new Date(this.beginDate).getTime() - 24 * 3600 * 1000
            // time.getTime() < new Date(this.timeSpace).getTime()
          );
        }
      }
    };
  },

  created() {},
  computed: {},
  methods: {
    handleConfirm() {
      this.startDateInput = this.beginDate;
      this.endDateInput = this.finalDate;
      let value = [this.beginDate, this.finalDate];
      this.$emit("afterDateSelect", value);
    },
    handleConfirmClear(type) {
      if (type == 1) {
        this.startDateInput = "";
      } else if (type == 2) {
        this.endDateInput = "";
      }
      let value = [this.startDateInput, this.endDateInput];
      this.$emit("afterDateSelect", value);
    },
    changeTimeOne() {
      if (this.timeSpace == -1) {
        return new Date(this.beginDate).getTime();
      } else {
        return Date.now();
      }
    },
    changeTime() {
      if (this.timeSpace == 1) {
        return new Date(this.beginDate).getTime() - 24 * 3600 * 1000;
      } else {
        return new Date().getTime() + (this.timeSpace - 1) * 24 * 3600 * 1000;
      }
    },
    // 过去几天
    setDay(day, isSingleDay) {
      this.timeSpace = day;
      if (day == -1 || day == 0) {
        this.beginDate = dateUtil.getDay(day, "beginDate");
      } else {
        this.beginDate = dateUtil.getDay(day);
      }
      if (isSingleDay) {
        this.finalDate = dateUtil.getDay(day, "finalDate");
      } else {
        this.finalDate = dateUtil.getDay(0);
      }
    },
    getformartDay(m) {
      this.timeSpace = 1;
      m = m.replace("年", "-");
      m = m.replace("月", "");
      let year = m.split("-")[0];
      let month = m.split("-")[1];
      month = month.replace("0", "");
      this.beginDate = dateUtil.getMonthStartDate(year, month - 1);
      this.finalDate = dateUtil.getMonthEndDate(year, month - 1);
    },
    getMouth() {
      let datelist = [];
      let date = new Date();
      let Y = date.getFullYear();
      let M = date.getMonth() + 1;
      for (let i = 0; i < 6; i++) {
        let dateoption = "";
        if (M - 1 !== 0) {
        } else {
          M = 12;
          Y = Y - 1;
        }
        let m = M;
        m = m < 10 ? "0" + m : m;
        dateoption = Y + "年" + m + "月";
        M--;
        datelist.push(dateoption);
      }
      return datelist;
    }
  },
  mounted() {
    // this.beginDate = this.startDate ? this.startDate : dateUtil.getDay(0);
    // this.finalDate = this.endDate ? this.endDate : dateUtil.getDay(0);
  }
};
</script>

<style  scoped>
.popover-input {
  border: none;
  height: 100%;
  width: 180px;
}
</style>