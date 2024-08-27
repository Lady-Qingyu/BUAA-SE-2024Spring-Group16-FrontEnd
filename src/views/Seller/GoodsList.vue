<template>
  <el-container>
    <div class="main-content">
      <div class="hot-goods">
        <h3>热门商品</h3>
        <div class="goods-box">
          <template v-for="(item, i) in goods" :key="i">
            <GoodsCard v-if="item.isHot" :productID="item.pid" :productName="item.name" :productImageBig="item.imageSrc"
              :salePrice="item.price" />
          </template>
          <!-- <GoodsCard v-for="(item, i) in goods" :key="i" :productID="item.pid" :productName="item.name"
            :productImageBig="item.imageSrc" :salePrice="item.price"></GoodsCard> -->
        </div>
      </div>

      <div class="goods-list">
        <h3>商品列表</h3>
        <div class="goods-box">
          <template v-for="(item, i) in goods" :key="i">
            <GoodsCard v-if="!item.isHot" :productID="item.pid" :productName="item.name" :productImageBig="item.imageSrc"
              :salePrice="item.price" />
          </template>
          <!-- <GoodsCard v-for="(item, i) in goods" :key="i" :msg="item"></GoodsCard> -->
        </div>
      </div>

    </div>
  </el-container>
</template>

<script>
import axios from 'axios';
import { getShopProducts, editProductUrl, getShopId } from '../../api/apis.js'
import Postcard from '../../assets/postcard.jpg';
import Postcard2 from '../../assets/postcard2.jpg';

export default {
  data() {
    return {
      editProductUrl,
      Postcard,
      Postcard2,
      goods: [],
      sid: -1,
    };
  },
  methods: {
    getShopProducts, getShopId,
    getShopProductsRequest() {
      this.getShopIdRequest();
      console.log(this.sid)
      getShopProducts({ sid: this.sid }).then(res => {
        if (res.stateCode) {
          console.log(res.data);
          this.goods = res.data;
        } else {
          if (res.stateMsg) {
            ElMessage.error(res.stateMsg);
          } else {
            ElMessage.error('未知错误, Status: ' + res.stateCode);
          }
        }
      });
    },
    getShopIdRequest() {
      getShopId({username: localStorage.getItem('loginUserName')}).then(res => {
        if (res.stateCode == '200') {
          this.sid = res.data;
          console.log('sid: ' +  this.sid);
        }
      });
    }
  },
  mounted() {  
    this.getShopIdRequest();
    setTimeout(() => {
      this.getShopProductsRequest();
    }, 50);
    // this.getShopProductsRequest();
  },
};
</script>

<style scoped>
.el-container {
  display: flex;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.goods-box {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.goods-box>GoodsCard {
  flex: 1 1 calc(25% - 20px);
  box-sizing: border-box;
  max-width: calc(25% - 20px);
}

.hot-goods,
.goods-list {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
}

h3 {
  margin-bottom: 16px;
}

.el-table {
  margin-top: 20px;
}
</style>