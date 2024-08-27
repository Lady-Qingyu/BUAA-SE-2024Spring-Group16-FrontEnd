<template>
  <div class="form-container">
    <el-form :model="goods" label-width="100px">
      <el-form-item label="商品名称">
        <el-input v-model="goods.name"></el-input>
      </el-form-item>
      <el-form-item label="商品版本">
        <el-input v-for="i in 3" :key="i" v-model="goods.version[i]" placeholder="请输入版本"></el-input>
      </el-form-item>
      <el-form-item label="商品图片">
        <el-input v-model="goods.imageSrc[0]"></el-input>
        <!-- <el-upload action="your-upload-url" list-type="picture"> -->
        <!-- <el-button slot="trigger" size="small" type="primary">选择图片</el-button> -->
        <!-- </el-upload> -->
      </el-form-item>
      <el-form-item label="单价">
        <el-input v-model="goods.price" placeholder="请输入单价"></el-input>
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input type="textarea" v-model="goods.details"></el-input>
      </el-form-item>
      <el-form-item label="库存量">
        <el-input-number v-model="goods.storage" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item class="form-actions">
        <el-button type="primary" @click="updateGoodsRequest">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
import { editProductUrl, getGoodsDetail, getShopId } from '../../api/apis.js'
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      axios,
      editProductUrl,
      ElMessage,
      pid: -1,
      goods: {
        productId: 1,
        name: '测试商品名称',
        storage: 20,
        version: ['S', 'M', 'L', 'XL', 'XXL', 'custom'],
        price: 100.01,
        imageSrc: ['https://sc01.alicdn.com/kf/HTB1Cic9HFXXXXbZXpXXq6xXFXXX3/200006212/HTB1Cic9HFXXXXbZXpXXq6xXFXXX3.jpg'],
        details: 'This is a test product.',
        shopName: localStorage.getItem('loginUserName'),
        shopId: -1,
      },
    };
  },
  methods: {
    getGoodsDetail, getShopId,
    updateGoodsRequest() {
      // console.log('sid: ' + this.goods.shopId);
      console.log(this.goods);
      axios.post(this.editProductUrl, this.goods, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        const res = response.data;
        if (res.stateCode == '200') {
          ElMessage.success('修改成功');
          this.$router.push('/Seller/GoodsList')
        } else {
          if (res.stateMsg) {
            ElMessage.error(res.stateMsg);
          } else {
            ElMessage.error('未知错误, Status: ' + res.stateCode);
          }
        }
      });
    },
    getGoodsDetailRequest() {
      console.log('pid:' + this.pid);
      getGoodsDetail({ id: this.pid }).then(res => {
        if (res.stateCode == '200') {
          console.log(res.data);
          this.goods = res.data;
          this.goods.productId = this.pid;
        } else {
          if (res.stateMsg) {
            ElMessage.error(res.stateMsg + ' Status: ' + res.stateCode);
          } else {
            ElMessage.error('未知错误, Status: ' + res.stateCode);
          }
        }
      });
    },
    getShopIdRequest() {
      getShopId({username: this.goods.shopName}).then(res => {
        if (res.stateCode == '200') {
          this.goods.shopId = res.data;
          console.log('sid: ' +  this.goods.shopId);
        }
      });
    }
  },
  mounted() {
    this.pid = this.$route.params.goodsId;
    this.getGoodsDetailRequest();
    console.log('username: ' + this.goods.shopName);
    this.getShopIdRequest();
  },
};
</script>

<style scoped>
h4 {
  font-family: 'Roboto', sans-serif;
  color: #484848;
  font-weight: 700;
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-top: 100px;
}

.el-form-item {
  margin-bottom: 20px;
}

.form-actions {
  text-align: center;
}

.el-input,
.el-upload,
.el-input-number {
  width: 100%;
}

.el-button {
  width: 100%;
}
</style>