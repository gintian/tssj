<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24" class="topbar-wrap">
      <!-- <div class="topbar-logo topbar-btn">
        <a href="/"><img src="../assets/logo.png" style="padding-left:8px;"></a>
      </div> -->
      <div class="topbar-logos">
        <h1  style="color: #fff;padding-left: 20px; font-weight: 100;"><span v-show="!$store.state.collapsed">态势数据关联分析平台</span></h1>
      </div>
      <div class="topbar-title">
        <!-- 注意：topNavState：根据当前路由所在根路由的type值判断显示不同顶部导航菜单 -->
        <el-row v-show="$store.state.topNavState==='home'">
          <el-col :span="24">
            <el-menu :default-active="defaultActiveIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" :router="true">
              <el-menu-item index="/">首页</el-menu-item>
              <el-menu-item index="/objectManager">系统管理</el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
        <el-row v-show="$store.state.topNavState==='enterprise'">
          <el-col :span="24">
            <el-menu :default-active="defaultActiveIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" :router="true">
              <el-menu-item index="/">首页</el-menu-item>
              <el-menu-item index="/objectManager">目标管理</el-menu-item>
              <el-menu-item index="/Suspicious">可疑事件</el-menu-item>
              <el-menu-item index="/deptManager">用户管理</el-menu-item>
              <el-menu-item index="/alarmLog">告警日志</el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </div>
      <div class="topbar-account topbar-btn">
          <div> <img  src="../assets/images/user.png"  style="position: relative; top: 5px;left: -4px;"> ZHOUJUENAN</div>
          <div @click="logout()"><img  src="../assets/images/logout.png" style="position: relative; top: 5px;left: -10px;"/>退出 </div>
      </div>
    </el-col>

    <!--中间-->
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </el-row>
</template>
<script>
import '@/assets/iconfont/iconfont.css'
  export default {
    name: 'home',
    data () {
      return {
        defaultActiveIndex: "/",
        loading: false,
        nickname: ''
      }
    },
    created() {// 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      this.fetchNavData();
    },
    methods: {
      handleSelect(index){
        this.defaultActiveIndex = index;
      },
      fetchNavData () { // 初始化菜单激活项
        var cur_path = this.$route.path; //获取当前路由
        var routers = this.$router.options.routes; // 获取路由对象
        var nav_type = "", nav_name = "";
        for (var i = 0; i < routers.length; i++) {
          var children = routers[i].children;
          if(children){
            for (var j = 0; j < children.length; j++) {
              var grand_children = children[j].children;
              if(grand_children){
                for (var k = 0; k < grand_children.length; k++) {
                  if (grand_children[k].path === cur_path) {
                    nav_type = routers[i].type;
                    nav_name = routers[i].name;
                    break;
                  }
                  // 如果该菜单下还有子菜单
                  if(children[j].children) {
                    let grandChildren = children[j].children;
                    for(let z=0; z<grandChildren.length; z++) {
                      if(grandChildren[z].path === cur_path) {
                        nav_type = routers[i].type;
                        nav_name = routers[i].name;
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        this.$store.state.topNavState = nav_type;  // 改变topNavState状态的值
        this.$store.state.leftNavState = nav_name;  // 改变leftNavState状态的值
        if(nav_type == "home"){
          this.defaultActiveIndex = "/";
        } else {
          this.defaultActiveIndex = "/" + nav_name + "Manager";
        }
      },
      jumpTo(url){
        this.defaultActiveIndex = url;
        this.$router.push(url); //用go刷新
      },
      logout(){
        //logout
        // let that = this;
        // this.$confirm('确认退出吗?', '提示', {
        //   confirmButtonClass: 'el-button--warning'
        // }).then(() => {
        //   //确认
        //   localStorage.removeItem('access-user');
        //   that.$router.go('/login'); //用go刷新
        // }).catch(() => {});

        this.service.get('/user/logout').then(res=>{
          this.$router.push({ path: '/' })
        })
      }
    },
    mounted() {
      let user = localStorage.getItem('access-user');
      if (user) {
        user = JSON.parse(user);
        this.nickname = user.nickname || '';
      }
    },
    watch: {
      '$route': 'fetchNavData'  //监听router值改变时，改变导航菜单激活项
    }
  }
</script>
