<template>
  <!-- 展示用的商品卡片 -->
  <div class="good-item">
    <div class="good-img">
      <a>
        <el-image :src="productImageBig" :alt="productName" :key="productImageBig"/>
      </a>
      <h6 class="good-title">{{ productName }}</h6>
      <!-- <h3 class="sub-title ellipsis">{{ subTitle }}</h3> -->
      <div class="good-price pr">
        <div class="ds pa good-btn">
          <el-button v-show="$route.name != 'Goodslist'" @click="openProduct" style="margin: 0 20px" type="primary"
            size="small">查看详情</el-button>
          <el-button style="margin: 0 20px" size="small" @click="addToCartRequest" type="info"
            v-show="$route.name != 'Goodslist' && $route.name != 'Comment'">加入购物车</el-button>
          <el-button @click="editProduct" style="margin: 0 20px" type="primary" size="small"
            v-show="$route.name == 'Goodslist'">编辑商品</el-button>
        </div>
        <p><span style="font-size:14px">￥</span>{{ Number(salePrice).toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { addToCart, getGoodsDetail } from '../api/apis';
import { ElMessage } from 'element-plus'

export default {
  props: ['productID', 'productName', 'productImageBig', 'salePrice'],
  data() {
    return {
      ElMessage,
      buyInfo: {
        pid: -1,
        username: '',
        version: '',
        quantity: 1,
      },
    }
  },
  methods: {
    getGoodsDetail,
    addToCart,
    goodsDetails() {
      // console.log();
      // this.$router.push(`/goodsDetail/${productID}`)
      // + product id
    },
    openProduct() {
      console.log(this.productID);
      this.$router.push(`/goodsDetail/${Number(this.productID)}`)
    },
    editProduct() {
      console.log(this.$route);
      this.$router.push(`/Seller/EditGoods/${this.productID}`);
    },
    addToCartRequest() {
      this.getGoodsDetailRequest(this.productID);
      this.buyInfo.pid = this.productID;
      this.buyInfo.quantity = 1;
      this.buyInfo.username = localStorage.getItem('loginUserName');
      if (this.buyInfo.version) {
        addToCart(this.buyInfo).then(res => {
          if (res.stateCode == '200') {
            ElMessage.success('加入购物车成功');
          } else {
            this.buyInfo.version = null;
            if (res.stateMsg) {
              ElMessage.error(res.stateMsg + ' Status: ' + res.stateCode);
            } else {
              ElMessage.error('未知错误, Status: ' + res.stateCode);
            }
          }
        })
      }
    },
    getGoodsDetailRequest() {
      getGoodsDetail({ id: this.productID }).then(res => {
        if (res.stateCode == '200') {
          this.buyInfo.version = res.data.version[1];
        } else {
          this.buyInfo.version = null;
          if (res.stateMsg) {
            ElMessage.error(res.stateMsg + ' Status: ' + res.stateCode);
          } else {
            ElMessage.error('未知错误, Status: ' + res.stateCode);

          }
        }
      });
    },
  },
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../styles/custom/mixin";
// @import "../styles/theme";

.good-item {
  background-color: var(--ep-color-danger-light-9);
  width: 25%;
  transition: all .5s;
  height: 430px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 1px 1px 20px #999;

    .good-price p {
      display: none;
    }

    .ds {
      display: flex;
    }
  }

  .ds {
    @extend %block-center;
    width: 100%;
    display: none;
  }

  .good-img {
    img {
      margin: 50px auto 10px;
      @include wh(206px);
      display: block;
    }
  }

  .good-price {
    margin: 15px 0;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color: #d44d44;
    font-family: Arial;
    font-size: 18px;
    font-weight: 700;
  }

  .good-title {
    line-height: 1.4;
    font-size: 18px;
    margin: 10% auto;
    padding: 0 14px;
    text-align: center;
    overflow: hidden;
  }

  #edit-product {
    float: right;
  }
}
</style>