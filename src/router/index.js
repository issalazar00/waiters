import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import global from './../_services/global.js';
import HomeView from '../views/HomeView.vue'
const Orders = () => import ('./../components/order/Orders.vue')
const CreateEditOrder = () => import ('./../components/order/CreateEditOrder.vue')
const DetailsOrder = () => import ('./../components/order/DetailsOrder.vue')


const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'main',
      component: CreateEditOrder,
      props:{
        order_id:0
      }
    },

    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: HomeView,
       
    },
    {
      path:'/orders',
      name: 'orders',
      component: Orders
    },
    {
      path:'/create-edit-order/:order_id',
      name:'create-edit-order',
      props:true,
      component: CreateEditOrder          
    },
    {
      path:'/details-order/:order_id',
      name:'details-order',
      props:true,
      component: DetailsOrder          
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  // redirect to login if not authenticated in and trying to access a restricted route
  const publicRoutes = ["Login"];

  const authRequired = !publicRoutes.includes(to.name);
  let isAuthenticated = false;
  try {
    isAuthenticated =
      localStorage.getItem("token") &&
        localStorage.getItem("user") &&
        JSON.parse(localStorage.getItem("user"))
        ? true
        : false;
  } catch (e) {
    isAuthenticated
  }
  if (authRequired && !isAuthenticated) {
    return next({ name: "Login", query: { redirect: to.fullPath } });
  }

  if (isAuthenticated) {

    let alias = to.matched[0].alias;
    if (alias != "") {
      if (!global.validatePermission(undefined, alias)) {
        return next({ name: "NoFound" });
      }
    }
  }
  next();

});

export default router
