<template>
  <div>
    <table style="width: 100%;">
        <tr>
          <td>IMO</td>
          <td>{{shipObj.imp}}</td>

          <td>MMSI</td>
          <td>{{shipObj.mmsi}}</td>
        </tr>
        <tr>
          <td>呼号</td>
          <td>{{shipObj.callSign}}</td>

          <td>类型</td>
          <td>{{shipObj.shiptype}}</td>
        </tr>
        <tr>
          <td>航速</td>
          <td>{{shipObj.speed}}</td>

          <td>状态</td>
          <td>{{shipObj.status}}</td>
        </tr>
        <tr>
          <td>航向</td>
          <td>{{shipObj.course}}</td>

          <td>名称</td>
          <td>{{shipObj.name}}</td>
        </tr>
        <tr>
          <td>经度</td>
          <td>{{shipObj.lon}}</td>

          <td>维度</td>
          <td>{{shipObj.lat}}</td>
        </tr>
    </table>
  </div>
</template>
<script>
export default {
  props:{
    shipObj:{
      type:Object,
      default:{}
    }
  },
  data(){
    return {

    }
  }
}
</script>