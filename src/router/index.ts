import { createWebHistory, createRouter } from 'vue-router'
import Homepage from '../views/Buyer/Homepage.vue';
import Reviewpage from '~/views/Buyer/Reviewpage.vue';
import path from 'path';
import { compile } from 'vue';
import { componentSizeMap } from 'element-plus';

const routes = [
  {
    path: '/',
    name: 'home',
    // redirect: '/home',
    component: Homepage,
  },
  {
    path: '/login',
    name: 'login',
    meta: { hideFooter: true },
    component: () => import("../views/Login.vue")
  },
  {
    path: '/register',
    name: 'register',
    meta: { hideFooter: true },
    component: () => import("../views/Register.vue")
  },
  {
    path: '/goodsDetail/:goodsId', 
    name: 'goodsDetail',
    component: () => import("../views/Details/GoodsDetail.vue")
  },
  {
    path: '/shopDetail/:shopId',
    name: 'shopDetail',
    component: ()=>import("../views/Details/ShopDetail.vue")
  },
  {
    path: '/Search/:keyword',
    name: 'Search',
    component: () => import("../views/Buyer/SearchResult.vue")
  },
  {
    path:'/cart',
    name:'cart',
    component:()=> import("../views/Buyer/Cart.vue")
  },
  {
    path:'/address',
    name:'address',
    component:()=>import("../views/Buyer/Address.vue")
  },
  {
    path: '/Comment/:goodsId',
    name: 'Comment',
    component: () => import("../views/Buyer/Commentpage.vue")
  },
  {
    path: '/Seller/AddGoods',
    name: 'AddGoods',
    component: () => import("../views/Seller/AddGoods.vue")
  },
  {
    path: '/Seller/EditGoods/:goodsId',
    name: 'EditGoods',
    component: () => import("../views/Seller/EditGoods.vue")
  }, 
  {
    path: '/Seller/Goodslist',
    name: 'Goodslist',
    component: () => import("../views/Seller/GoodsList.vue")
  },

];

const router = createRouter({
  // history: createMemoryHistory(),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


export default router;