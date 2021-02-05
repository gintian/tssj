export default [
  {
    path: '/target',
    name: 'Target',
    component:  () => import('@/views/targetManagement/targetView'),

    children: [
      {
        path: '/target/radar',
        name: 'Radar',
        component:  () => import('@/views/targetManagement/radar')
      },
      {
        path: '/target/ais',
        name: 'Ais',
        component:  () => import('@/views/targetManagement/ais')
      },
      {
        path: '/target/station',
        name: 'station',
        component:  () => import('@/views/targetManagement/station')
      },
      {
        path: '/target/camera',
        name: 'camera',
        component:  () => import('@/views/targetManagement/camera')
      },
      {
        path: '/target/anchorage',
        name: 'anchorage',
        component:  () => import('@/views/targetManagement/anchorage')
      },
      {
        path: '/target/port',
        name: 'port',
        component:  () => import('@/views/targetManagement/port')
      },
      {
        path: '/target/pier',
        name: 'anchorage',
        component:  () => import('@/views/targetManagement/pier')
      },
      {
        path: '/target/tower',
        name: 'tower',
        component:  () => import('@/views/targetManagement/tower')
      },
      {
        path: '/target/seaLine',
        name: 'seaLine',
        component:  () => import('@/views/targetManagement/seaLine')
      },
      {
        path: '/target/asycShip',
        name: 'asycShip',
        component:  () => import('@/views/targetManagement/asycShip')
      },
      {
        path: '/target/apron',
        name: 'Apron',
        component:  () => import('@/views/targetManagement/apron')
      },
      {
        path: '/target/road',
        name: 'Road',
        component:  () => import('@/views/targetManagement/road')
      },
    ]
  },
  // {
  //   path: '/target/camera',
  //   name: 'camera',
  //   component:  () => import('@/views/targetManagement/camera')
  // },
]
