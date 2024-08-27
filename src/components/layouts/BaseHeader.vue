<template>
  <!-- Header  -->
  <div class="mt-2">
    <el-menu mode="horizontal">
      <el-menu-item index="0" @click="gotoHomePage">
        <img src="../../assets/Taoduoduo.png" style="width: 100px;" />
      </el-menu-item>
      <!-- <div class="flex-grow" /> -->
      <el-menu-item index="1" @click="gotoSearch"
        v-show="!($route.name == 'Goodslist' || $route.name == 'AddGoods' || $route.name == 'EditGoods')">搜索</el-menu-item>
      <el-sub-menu index="2"
        v-show="!($route.name == 'Goodslist' || $route.name == 'AddGoods' || $route.name == 'EditGoods')">
        <template #title>个人信息</template>
        <el-menu-item index="2-1" @click="gotoAddress()">收货地址</el-menu-item>
        <el-menu-item index="2-2">基本信息</el-menu-item>
        <!-- <el-menu-item index="2-3">收藏商品</el-menu-item>
        <el-menu-item index="2-4">关注店铺</el-menu-item> -->
      </el-sub-menu>
      <el-menu-item index="3" @click="gotoCart()"
        v-show="!($route.name == 'Goodslist' || $route.name == 'AddGoods' || $route.name == 'EditGoods')">购物车</el-menu-item>
      <el-menu-item index="4" v-if="!isLogined" @click="gotoLoginPage">注册/登录</el-menu-item>
      <el-menu-item index="4" v-if="isLogined" @click="signOut">退出登录</el-menu-item>
      <el-sub-menu index="5"
        v-show="$route.name == 'Goodslist' || $route.name == 'AddGoods' || $route.name == 'EditGoods'">
        <template #title>我的商店</template>
        <el-menu-item @click="gotoGoodsList" index="5-1">商品列表</el-menu-item>
        <el-menu-item @click="gotoAddGoods" index="5-2">上架商品</el-menu-item>
      </el-sub-menu>
      <el-menu-item h="full" @click="toggleDark()">
        <button class="border-none w-full bg-transparent cursor-pointer" style="height: var(--ep-menu-item-height)">
          <i inline-flex i="dark:ep-moon ep-sunny" />
        </button>
      </el-menu-item>
    </el-menu>
  </div>

  <!-- 搜索栏的Drawer -->
  <el-drawer v-model="isSearch" direction="ttb" size="30%">
    <template #header>
      <h3>搜索商品 / 商店</h3>
    </template>
    <div style="text-align: center;">
      <el-input v-model="keyword" :prefix-icon="Search" size="large" class="mr-20" style="width: 25%;" />
      <el-button type="primary" :icon="Search" @click="searchByKeywords">Search</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { toggleDark } from "~/composables";
import { Search } from "@element-plus/icons-vue"
import { markRaw } from 'vue';
export default {
  data() {
    return {
      isSearch: false,
      keyword: '',
      Search: markRaw(Search),
    }
  },
  computed: {
    isLogined() {
      return localStorage.getItem("loginUserName") ? true : false;
    }
  },
  methods: {
    gotoLoginPage() {
      this.$router.push({ path: '/login' });
    },
    gotoHomePage() {
      if (localStorage.getItem('loginUserType') == 'seller') {
        this.$router.push('/Seller/GoodsList');
      } else {
        this.$router.push({ path: '/' });
      }
    },
    gotoGoodsList() {
      this.$router.push({ path: "/Seller/GoodsList" });
    },
    gotoAddGoods() {
      this.$router.push({ path: "/Seller/AddGoods" });
    },
    gotoSearch() {
      this.isSearch = true;
    },
    gotoAddress() {
      this.$router.push({ path: '/address' })
    },
    gotoCart() {
      this.$router.push({ path: '/cart' })
    },
    searchByKeywords() {
      if (this.keyword !== '') {
        this.$router.push({ path: `/` });
        setTimeout(()=> {
          this.$router.push({ path: `/Search/${this.keyword}` });
        }, 20);
      
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      }
    },
    signOut() {
      localStorage.removeItem('loginUserName');
      localStorage.removeItem('loginUserType');
      // window.location.reload();
      this.$router.replace({path: '/login'})
    },
    toggleDark,
    markRaw,
  }
}
</script>