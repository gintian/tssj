import { wgs84ToBD } from '../../utils/coordinateConvert'

export default {
  shipData: function() {
    return this.areaShipData.filter((e) => {


      let time = new Date().getTime() / 1000 - e.time

      // if (this.focusButton && (!e.isFocus)) {
      //   return false
      // }
      if (!this.isNormalShip && e.abnormal === 0) {
        return false
      }
      if (!this.isAbnormalShip && e.abnormal === 1) {
        return false
      }
      if (!this.shipMin5 && time <= 300) {
        return false
      }
      if (!this.shipMin530 && 300 < time && time <= 1800) {
        return false
      }
      if (!this.shipMin30 && time > 1800) {
        return false
      }
      if (!this.shipAis && e.targettype === 1) {
        return false
      }
      if (!this.shipFusion && e.targettype === 2) {
        return false
      }
      if (!this.shipRadar && e.targettype === 3) {
        return false
      }
      if (this.leftDrawerShipType.name !== e.shipType&&this.leftDrawerShipType.name!=='') {

        return false
      }
      return true
    })
  },
  // planeInfo() {
  //   return this.dialogInfo.planeInfo
  // }
}
