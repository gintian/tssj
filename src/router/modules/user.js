export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/loginView')
  },
  {
    path: '/loadings',
    name: 'Loadings',
    component: () => import('@/views/loading/loading')
  },
  {
    path: '/loading',
    name: 'Loading',
    component: () => import('@/views/loading/loading2')
  }
]
