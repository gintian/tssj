var now = new Date(); //当前日期 
var nowDayOfWeek = now.getDay(); //今天本周的第几天 
var nowDay = now.getDate(); //当前日 
var nowMonth = now.getMonth(); //当前月 
var nowYear = now.getYear(); //当前年 
nowYear += (nowYear < 2000) ? 1900 : 0; //

var lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
var lastYear = lastMonthDate.getYear();
var lastMonth = lastMonthDate.getMonth();

let dateUtil = {
    // 获取几天前/后的日期
    getDay: function (day, isSingleDay) {
        var today = new Date();
        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码
        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        var h = today.getHours();
        h = h < 10 ? "0" + h : h;
        var minute = today.getMinutes();
        minute = minute < 10 ? "0" + minute : minute;
        var second = today.getSeconds();
        second = second < 10 ? "0" + second : second;
        tMonth = this.doHandleMonth(tMonth + 1);
        tDate = this.doHandleMonth(tDate);
        if (isSingleDay) {
            if (isSingleDay == 'finalDate') {
                return tYear + "-" + tMonth + "-" + tDate + ' ' + '23' + ':' + '59' + ':' + '59';
            } else {
                return tYear + "-" + tMonth + "-" + tDate + ' ' + '00' + ':' + '00' + ':' + '00';
            }
        } else {
            return tYear + "-" + tMonth + "-" + tDate + ' ' + h + ':' + minute + ':' + second;
        }
    },
    doHandleMonth: function (month) {
        var m = month;
        if (month.toString().length == 1) {
            m = "0" + month;
        }
        return m;
    },

    //格式化日期：yyyy-MM-dd 
    formatDate: function (date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();

        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday);
    },

    //获得某月的天数 
    getMonthDays: function (myMonth) {
        var monthStartDate = new Date(nowYear, myMonth, 1);
        var monthEndDate = new Date(nowYear, myMonth + 1, 1);
        var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        return days;
    },

    //获得本周的开始日期 
    getWeekStartDate: function () {
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
        return this.formatDate(weekStartDate);
    },

    //获得本周的结束日期 
    getWeekEndDate: function () {
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
        return this.formatDate(weekEndDate);
    },

    // //获得本月的开始日期 
    // getMonthStartDate: function () {
    //     var monthStartDate = new Date(nowYear, nowMonth, 1);
    //     return this.formatDate(monthStartDate);
    // },

    // //获得本月的结束日期 
    // getMonthEndDate: function () {
    //     var monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth));
    //     return this.formatDate(monthEndDate);
    // },

    //获得本月的开始日期 
    getMonthStartDate: function (year, month) {
        var monthStartDate = new Date(year, month, 1);
        return this.formmatGetDay(monthStartDate);
    },

    //获得本月的结束日期 
    getMonthEndDate: function (year, month) {
        var monthEndDate = new Date(year, month, this.getMonthDays(month));
        return this.formmatGetDay(monthEndDate);
    },
    // 格式化某个月的开始或结束时间
    formmatGetDay: function (today) {
        // var today = new Date();
        // var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
        // today.setTime(targetday_milliseconds); //注意，这行是关键代码
        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        var h = today.getHours();
        h = h < 10 ? "0" + h : h;
        var minute = today.getMinutes();
        minute = minute < 10 ? "0" + minute : minute;
        var second = today.getSeconds();
        second = second < 10 ? "0" + second : second;
        tMonth = this.doHandleMonth(tMonth + 1);
        tDate = this.doHandleMonth(tDate);
        return tYear + "-" + tMonth + "-" + tDate + ' ' + h + ':' + minute + ':' + second;
        // if (isSingleDay) {
        //     if (isSingleDay == 'finalDate') {
        //         return tYear + "-" + tMonth + "-" + tDate + ' ' + '23' + ':' + '59' + ':' + '59';
        //     } else {
        //         return tYear + "-" + tMonth + "-" + tDate + ' ' + '00' + ':' + '00' + ':' + '00';
        //     }
        // } else {
        //     return tYear + "-" + tMonth + "-" + tDate + ' ' + h + ':' + minute + ':' + second;
        // }
    },

    //获得上月开始时间
    getLastMonthStartDate: function () {
        var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
        return this.formatDate(lastMonthStartDate);
    },

    //获得上月结束时间
    getLastMonthEndDate: function () {
        var lastMonthEndDate = new Date(nowYear, lastMonth, this.getMonthDays(lastMonth));
        return this.formatDate(lastMonthEndDate);
    }
}

export default dateUtil