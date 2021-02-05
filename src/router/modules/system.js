export default [
  {
    path: '/system',
    name: 'System',
    component:  () => import('@/views/systemManagement/systemView'),

    children: [
      {
        path: '/system/user',
        name: 'user',
        component:  () => import('@/views/systemManagement/user')
      },
      {
        path: '/system/org',
        name: 'org',
        component:  () => import('@/views/systemManagement/org')
      },
      {
        path: '/system/menu',
        name: 'menus',
        component:  () => import('@/views/systemManagement/menu')
      },
      {
        path: '/system/role',
        name: 'role',
        component:  () => import('@/views/systemManagement/role')
      },
      {
        path: '/system/focus',
        name: 'Focus',
        component:  () => import('@/views/systemManagement/focus')
      },

    ]
  },
  // {
  //   path: '/target/camera',
  //   name: 'camera',
  //   component:  () => import('@/views/targetManagement/camera')
  // },
]
