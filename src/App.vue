<template>
  <div id="app">
      <!--<home v-if="showNav"></home>-->
      <!--<left-nav  v-if="showleftNav"></left-nav>-->
    <router-view></router-view>
  </div>
</template>

<script>
import  home   from './views/Home'
import LeftNav from "./components/nav/leftNav";
  export default {
    name: 'app',
    components: {
        LeftNav,
        home
      },
      data(){
       return{
           showNav:true,
           showleftNav:false
       }
      },
      watch:{
          // $route( to , from ){
          //     console.log( to,'++++++++++++++++++++++++++++++++++++++++++++++++++++++++++' )
          //     this.showNav=to.name!=='Login'
          //     this.showleftNav=to.name!=='DeptManager'
          // }

      }

  }
</script>
<style >
/* 默认1920 */
/* html{
   font-size:19.20px;  
} */
/* 14寸电脑 */
  @media only screen and  (max-width: 1366px) {
   html{
      font-size:13.66px;
   }
    /* .filter-container{
      display: grid;
    grid-template-columns: 37% 55%;
    align-items: center;
    margin: 16px;
  } */
}
</style>
