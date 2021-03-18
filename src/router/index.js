import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import map from '../views/home/Map.vue'

import LeftNav from '@/components/nav/leftNav.vue'

import Radar from  '@/views/object/radar'  //目标管理
import AIS from  '@/views/object/AIS'
import Anchorage from  '@/views/object/Anchorage'
import Wharf from  '@/views/object/wharf'

import EnterpriseList from '@/views/alarmLog/index.vue'  //告警日志
import EnterpriseAdd from '@/views/alarmLog/add.vue'
import EnterpriseValidate from '@/views/alarmLog/validate.vue'

import Suspicious from '@/views/Suspicious/index.vue' //可疑事件
import DeptManager from '@/views/dept/index.vue' //用户管理
import NotFound from '@/components/404.vue'

// 解决页面刷新 mounted函数中再次重定向该路由 引起的路由重复 报错问题 [页面爆红 但不影响使用]
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/views/login/loginView'], resolve)

Vue.use(VueRouter)

let router = new VueRouter({
  routes: [
    {
      path: '/map2',
      name:'Map',
      component: map
    },
    {
      path: '/',
      type: 'login',
      name:'Login',
      component: Login
    },
    {
      path: '*',
      component: NotFound
    },
 
 
    {
      path: '/',
      type: 'home', // 根据type区分不同模块（顶部导航）
      // name: 'home', // 根据name区分不同子模块（左侧导航）
      redirect: '/home',
      component: Home,   
      menuShow: true,
      children: [
        {
          path: '/',  //首页
          // component: LeftNav,
          // name: 'Map',
          leaf: true, // 只有一个节点
          // iconCls: 'iconfont icon-home', // 图标样式class
          menuShow: true,
          children: [
            { path: '/map', component: map, name: 'Map', menuShow: true }
          ]
        }
      ]
    },

    //  {
    //         path: '/',
    //         type: 'home', // 根据type区分不同模块（顶部导航）
    //   //       name: 'home', // 根据name区分不同子模块（左侧导航）
    //         redirect: '/home',
    //         component: Home, 
    //         // leaf: true,
    //          menuShow: true,  
    //          children: [
    //                   { path: '/map', component: map, name: 'Map', menuShow: true }
    //                 ]
    //  },
      

    {
      path: '/alarmLog',
      type: 'enterprise',
      name: 'enterprise',
      component: Home,
      redirect: '/alarmLog/list',
      menuShow: true,
      children: [
        {
          path: '/enterpriseList',
          component: LeftNav,
          name: 'enterpriseList',
          leaf: true, // 只有一个节点
          iconCls: 'iconfont icon-yewu', // 图标样式class
          menuShow: true,
          children: [
            { path: '/alarmLog/list', component: EnterpriseList, name: '业务告警日志', menuShow: true },
          ]
        },
        {
          path: '/enterpriseAdd',
          component: LeftNav,
          name: 'enterpriseAdd',
          leaf: true, // 只有一个节点
          iconCls: 'iconfont  icon-caozuoxitong',
          menuShow: true,
          children: [
            { path: '/alarmLog/add', component: EnterpriseAdd, name: '系统操作日志', menuShow: true }
          ]
        }
        
        // {
        //   path: '/enterpriseValidate',
        //   component: LeftNav,
        //   name: 'enterpriseValidate',
        //   leaf: true, // 只有一个节点
        //   iconCls: 'iconfont  icon-gaojing',
        //   menuShow: true,
        //   children: [
        //     { path: '/alarmLog/validate', component: EnterpriseValidate, name: '系统告警日志', menuShow: true }
        //   ]
        // }
      ]
    },

    {
      path: '/objectManager',
      type: 'enterprise',
      name: 'object',
      component: Home,
      redirect: '/object/list',
      menuShow: true,
      children: [
                  {
                    path: '/Radar',
                    component: LeftNav,
                    name: 'Radar',
                    leaf: true, // 只有一个节点
                    iconCls: 'iconfont icon-leidatu',
                    menuShow: true,
                    children: [
                      { path: '/object/radar', component: Radar, name: '雷达', menuShow: true },
                    ]
                  },
                  {
                  path: '/AIS',
                  component: LeftNav,
                  // name: 'AIS',
                  leaf: true, // 只有一个节点
                  iconCls: 'iconfont icon-base-signal-full', // 图标样式class
                  menuShow: true,
                  children: [
                    { path: '/object/list', component: AIS, name: 'AIS', menuShow: true },
                  ]
                 },
                
                {
                  path: '/Anchorage',
                  component: LeftNav,
                  leaf: true, // 只有一个节点
                  iconCls: 'iconfont icon-anchor-full',
                  menuShow: true,
                  children: [
                    { path: '/object/Anchorage', component: Anchorage, name: '锚地', menuShow: true }
                  ]
                },
                
                {
                  path: '/Wharf',
                  component: LeftNav,
                  leaf: true, // 只有一个节点
                  iconCls: 'iconfont icon-matou',
                  menuShow: true,
                  children: [
                    { path: '/object/wharf', component: Wharf, name: '码头', menuShow: true },
                  ]
                },
               
          ]
    },

    {
      path: '/Suspicious',
      type: 'enterprise',
      name: 'Suspicious',
      component: Home,
      redirect: '/Suspicious/list',
      menuShow: true,
      children: [
        {
          path: '/SuspiciousList',
          component: LeftNav,
          name: 'SuspiciousList',
          leaf: true, // 只有一个节点
          iconCls: 'iconfont icon-home', 
          menuShow: true,
          children: [
            { path: '/Suspicious/list', component: Suspicious, name: '', menuShow: true }
          ]
        }
      ]
    },
    {
      path: '/deptManager', //用户管理
      type: 'enterprise',
      name: 'dept',
      component: Home,
      redirect: '/dept/list',
      menuShow: true,
      children: [
        {
          path: '/deptList',
          component: LeftNav,
          name: 'deptList',
          leaf: true, // 只有一个节点
          iconCls: 'iconfont icon-user', 
          menuShow: true,
          children: [
            { path: '/dept/list', component: DeptManager, name: '', menuShow: true }
          ]
        }
      ]
    }

  ]
});


const whiteList = ['/login'] // 白名单

// router.beforeEach((to, from, next) => {
//   // ...
//   const userInfo =store.getters.user.data!=undefined;
//   const token =store.getters.getJToken!='';
//   console.log( store.getters.user.data!=undefined)
//   console.log(to.name);
//   console.log(store.getters.getJToken);
//   if(userInfo||token){ //如果有就直接到首页咯
//     next();
//     router.addRoutes(asycRoute)
//   } else {

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next('/login');
//     }
    
//     if (to.path === '/login') { //如果是登录页面路径，就直接next()
//       next();
//     } else { //不然就跳转到登录；
//       next('/login');
//     }
//   }
//   next()
// })

export default router


