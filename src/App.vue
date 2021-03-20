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
