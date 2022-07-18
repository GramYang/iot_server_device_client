import { createRouter, createWebHashHistory } from 'vue-router'
import Cookies from 'js-cookie'

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'Login',
    component:()=>import('../components/Login.vue')
  },
  {
    path:'/device_list',
    name:'DeviceList',
    component:()=>import('../components/DeviceList.vue')
  },
  {
    path:'/device_detail',
    name:'DeviceDetail',
    component:()=>import('../components/DeviceDetail.vue')
  },
  {
    path:'/switch_detail',
    name:'SwitchDetail',
    component:()=>import('../components/SwitchDetail.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 登录状态检查
router.beforeEach((to,from,next)=>{
  if(to.name==='Login')next()
  else{
    if(Cookies.get('token')){
      next()
    }else{
      next({name:'Login'})
    }
  }
})

export default router
