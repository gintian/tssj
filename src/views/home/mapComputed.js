import { wgs84ToBD } from '../../utils/coordinateConvert'

export default {
  shipData: function() {
   
    return this.areaShipData.filter((e) => {
      // console.log('areaShipData',areaShipData)
      // console.log('e.time',e.time)new Date(e.time).getTime()/100
      let time = new Date().getTime() / 1000 - new Date(e.time).getTime()/1000
      // console.log('time',time)
      // if (!this.isNormalShip && e.normal === 0) {//normal
      //   return false
      // }
      if (!this.isAbnormalShip && e.normal === 1) {  //异常目标
        return false 
      }
      // if (!this.bulkShip) {
      //   return false
      // }
      // if (!this.containerShip) {
      //   return false
      // }
      // if (!this.tanker) {
      //   return false
      // }
      // if (!this.tug) {
      //   return false
      // }
      // if (!this.fishingBoat) {
      //   return false
      // }
      // if (!this.passengerShip) {
      //   return false
      // }
      
     

      // 5min以内
      // if (!this.shipMin5) {
      //   return false
      // }
      // if (!this.shipMin5 && this.shipMin10) {
      //   return false
      // }
      // if (!this.shipMin10 && this.shipMin15) {
      //   return false
      // }
      // if (!this.shipMin15 && this.shipMin20) {
      //   return false
      // }
      
      // if (!this.shipMin20 && this.shipMin24) {
      //   return false
      // }
      // // 30分钟以上
      // if (!this.shipMin30 && time > 1800) {
      //   return false
      // }
      if (!this.shipAis && e.targettype === 1) {  //AIS目标
        return false
      }
      if (!this.shipFusion && e.targettype === 2) { //融合目标
        return false
      }
      if (!this.shipRadar && e.targettype === 3) { //雷达目标
        return false
      }
      // if (this.leftDrawerShipType.name !== e.shipType&&this.leftDrawerShipType.name!=='') {

      //   return false
      // }
      return true
    })
  },
  // planeInfo() {
  //   return this.dialogInfo.planeInfo
  // }
}
