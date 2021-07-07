import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Index from '@/components/Index'
import Users from '@/components/Users'
import Roles from '@/components/Roles'
import Rights from '@/components/Rights'
import Goods from '@/components/Goods'
import Params from '@/components/Params'
import Categories from '@/components/Categories'
import Orders from '@/components/Orders'
import Reports from '@/components/Reports'
import Welcome from '@/components/Welcome'
import GoodsAdd from '@/components/GoodsAdd'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/index',
    component: Index,
    children: [
      {
        path: '/',
        redirect: '/index/welcome'
      },
      {
        path: '/index/welcome',
        component: Welcome
      },
      {
        path: '/index/users',
        component: Users
      },
      {
        path: '/index/roles',
        component: Roles
      },
      {
        path: '/index/rights',
        component: Rights
      },
      {
        path: '/index/goods',
        component: Goods
      },
      {
        path: '/index/goodsAdd',
        component: GoodsAdd
      },
      {
        path: '/index/params',
        component: Params
      },
      {
        path: '/index/categories',
        component: Categories
      },
      {
        path: '/index/orders',
        component: Orders
      },
      {
        path: '/index/reports',
        component: Reports
      }
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

// const VueRouterPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push (to) {
//   return VueRouterPush.call(this, to).catch(err => err)
// }

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
