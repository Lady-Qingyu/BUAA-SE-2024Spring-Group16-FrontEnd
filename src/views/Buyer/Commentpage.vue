<template>
  <div class="comment-page">

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>

    <div id="container" class="product-comment">
      <el-rate v-model="rate" :allow-half="true" show-score />
      <div style="display: flex; gap: 20px; align-items: flex-start;">
        <el-input type="textarea" v-model="content" placeholder="请输入您的评价" rows="4" />
      </div>
      <div class="submit-section" style="margin-bottom: 40px;">
        <el-button type="primary" @click="submitComment">提交评价</el-button>
      </div>
    </div>
    <div id="container" class="comment-section">



    </div>
  </div>
</template>

<script>
import Postcard from '../../assets/postcard.jpg'
import Postcard2 from '../../assets/postcard2.jpg'
import { ElMessage } from 'element-plus';
import { userComment, userCommentUrl } from '../../api/apis.js'
import axios from 'axios';

export default {
  data() {
    return {
      userCommentUrl,
      ElMessage,
      rate: 0,
      content: '',
      dialogImageUrl: '',
      dialogVisible: false,
      // comments: [], // 存储所有的评价
      // selectedGoods: {
      //   productId: 1,
      //   productName: 'Test Goods',
      //   productImageBig: 'https://sc01.alicdn.com/kf/HTB1Cic9HFXXXXbZXpXXq6xXFXXX3/200006212/HTB1Cic9HFXXXXbZXpXXq6xXFXXX3.jpg',
      //   salePrice: 100.01
      // }
      // comment: {},
    };
  },
  methods: {
    userComment,
    submitComment() {
      if (this.rate == null || this.rate == 0) {
        ElMessage.warning('请给商品打分');
      } else if (this.content == null || this.content == '') {
        ElMessage.warning('请输入评价');
      } else {
        const params = {
          username: localStorage.getItem('loginUserName'),
          rate: this.rate,
          content: this.content,
          images: [''],
          productId: this.$route.params.goodsId,
        }

        axios.post(this.userCommentUrl, params).then(res => {
          if (res.stateCode == '200') {
            ElMessage.success('评论成功');
            this.$router.replace('/');
          } else {
            if (res.stateMsg) {
              ElMessage.error(res.stateMsg);
            } else {
              ElMessage.error('未知错误, Status: ' + res.stateCode);
            }
          }
        });
        // userComment(params).then(res => {
        // if (res.stateCode == '200') {
        //   ElMessage.success('评论成功');
        //   this.$router.replace('/');
        // } else {
        //   if (res.stateMsg) {
        //     ElMessage.error(res.stateMsg);
        //   } else {
        //     ElMessage.error('未知错误, Status: ' + res.stateCode);
        //   }
        // }
        // })
      }
    },
  }
};
</script>

<style scoped>
#container {
  box-shadow: 0 15px 30px 1px rgba(128, 128, 128, 0.31);
  background: rgba(255, 255, 255, 0.90);
  text-align: center;
  border-radius: 5px;
  overflow: hidden;
  margin: 5em auto;
  height: 100%;
  width: 1220px;

}


/* 	Product details  */
.product-details {
  position: relative;
  text-align: left;
  overflow: hidden;
  padding: 30px;
  height: 100%;
  float: left;
  width: 40%;

}

#container p {
  display: inline-block;
  position: relative;
  font-size: 20px;
  color: #344055;
  margin-left: 5%;
  /* text-align: center; */
}

#container h3 {
  display: inline-block;
  position: relative;
  font-size: 20px;
  color: #748095;
  /* margin-left: 5%; */
  /* text-align: center; */
}


/* subtitle */
#container h2 {
  display: inline-block;
  position: relative;
  font-size: 24px;
  color: #344055;
  /* margin-left: 5%; */
}

/* 	Product Name */
#container h1 {
  font-family: 'Old Standard TT', serif;
  display: inline-block;
  position: relative;
  font-size: 34px;
  color: #344055;
  /* margin: 5%; */

}

#container h1:before {
  position: absolute;
  content: '';
  right: 0%;
  top: 0%;
  transform: translate(25px, -15px);
  font-family: 'Farsan', cursive;
  display: inline-block;
  background: #FFA69E;
  border-radius: 5px;
  font-size: 14px;
  padding: 5px;
  color: #FFF;
  margin: 0;
  animation: chan-sh 6s ease infinite;

}

@keyframes chan-sh {
  from {
    content: 'free shipping';
  }

  to {
    content: 'New';
  }

}

/*Product rate  */
.hint-star {
  display: inline-block;
  margin-left: 0.5em;
  color: gold;
  width: 50%;
}


/* The most important information about the product */
#container .product-details>p {
  font-family: 'Farsan', cursive;
  text-align: center;
  font-size: 20px;
  color: #7d7d7d;

}

/* control */

.control {
  position: absolute;
  bottom: 20%;
  left: 22.8%;

}

/* the Button */
.btn {
  transform: translateY(0px);
  transition: 0.3s linear;
  background: #49C608;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  outline: none;
  border: none;
  color: #eee;
  padding: 0;
  margin: 0;

}

.btn:hover {
  transform: translateY(-4px);
}

.btn span {
  font-family: 'Farsan', cursive;
  transition: transform 0.3s;
  display: inline-block;
  padding: 10px 20px;
  font-size: 1.2em;
  margin: 0;

}

/* shopping cart icon */
.btn .price {
  background: #333;
  border: 0;
  margin: 0;
}

.btn .price {
  transform: translateX(-10%);
  padding-right: 15px;
}

/* buy */
.btn .buy {
  z-index: 3;
  font-weight: bolder;
}

.btn:hover .price {
  transform: translateX(-110%);
}

.btn:hover .shopping-cart {
  transform: translateX(0%);
}



/* product image  */
.product-image {
  transition: all 0.3s ease-out;
  display: inline-block;
  position: relative;
  overflow: hidden;
  height: 100%;
  float: right;
  /* width: 50%; */
  display: inline-block;
}

#container img {
  width: 100%;
  height: 100%;
  /* aspect-ratio: 9 / 16; */
}

.info {
  background: rgba(27, 26, 26, 0.9);
  font-family: 'Farsan', cursive;
  transition: all 0.3s ease-out;
  transform: translateX(-100%);
  position: absolute;
  line-height: 1.9;
  text-align: left;
  font-size: 120%;
  cursor: no-drop;
  color: #FFF;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}

.info h2 {
  text-align: center
}

.product-image:hover .info {
  transform: translateX(0);
}

.info ul li {
  transition: 0.3s ease;
}

.info ul li:hover {
  transform: translateX(50px) scale(1.3);
}

.product-image:hover img {
  transition: all 0.3s ease-out;
}

.product-image:hover img {
  transform: scale(1.2, 1.2);
}

.product-version {
  margin-left: 5%;
}

/* .product-comment h2 {
  
  } */
</style>