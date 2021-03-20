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

      if (!this.shipAis && e.targettype === 1) {  //AIS目标
        return false
      }
      if (!this.shipFusion && e.targettype === 2) { //融合目标
        return false
      }
      if (!this.shipRadar && e.targettype === 3) { //雷达目标
        return false
      }
      return true
    })
  },
 
}
