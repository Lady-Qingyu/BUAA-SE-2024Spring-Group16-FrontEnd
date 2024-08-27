<template>
	<div id="container">
		<el-row>
			<el-col :span="12">
				<el-row justify="center">
					<h1>{{ goods.name }}</h1>
				</el-row>
				<el-row justify="center">
					<h3 @click="clickToShop">From Shop: {{ goods.shopName }}</h3>
				</el-row>
				<el-row justify="center">
					<el-col :span="6">
						<button class="btn" style="background-color:cornflowerblue;">
							<span class="buy" v-if="!shopSubscribed" @click="subscribeShopRequest">订阅店铺</span>
							<span class="buy" v-else @click="cancelSubscribingShopRequest">取消订阅店铺</span>
						</button>
					</el-col>
					<el-col :span="6">
						<button class="btn" style="background-color:cornflowerblue;">
							<span class="buy" v-if="!productCollected" @click="collectProductRequest">收藏商品</span>
							<span class="buy" v-else @click="cancelCollectingProductRequest">取消收藏商品</span>
						</button>
					</el-col>
				</el-row>
				<el-row justify="center" class="mt-7">
					<h2>库存量 {{ goods.storage }}</h2>
				</el-row>
				<el-row>
					<el-col>
						<h2>-- 版本选择 --</h2>
					</el-col>
					<el-col>
						<el-select v-model="buyInfo.version" style=" width: 50%;">
							<el-option v-for="(version, i) in goods.version" :key="i" :label="version" :value="version">
							</el-option>
						</el-select>
					</el-col>

				</el-row>
				<el-col>
					<h2>-- 收货地址 --</h2>
				</el-col>
				<el-col>
					<el-select v-model="selectedAid" style=" width: 70%;">
						<el-option v-for="(address, i) in userAddress" :key="i" :label="address.name + ' ' + address.phone + ' ' + address.address"
							:value="address.aid">
						</el-option>
					</el-select>
				</el-col>
				<el-row>

				</el-row>

				<el-row class="mt-30 mr-7 mb-30">
					<!-- <div class=""> -->
					<el-col :span="12">
						<button class="btn" @click="buyImmediatelyRequest">
							<span class="price">{{ goods.price }} RMB</span>
							<span class="buy" @click="checkout">立即购买</span>
						</button>
					</el-col>
					<el-col :span="12">
						<button class="btn" @click="addToCartRequest">
							<span class="price">{{ goods.price }} RMB</span>
							<span class="buy">加入购物车</span>
						</button>
					</el-col>
					<!-- </div> -->
				</el-row>

			</el-col>
			<el-col :span="12">
				<div class="product-image">
					<img :src="goods.imageSrc" />
				</div>
			</el-col>
		</el-row>
	</div>

	<div id="container">
		<el-row justify="center">
			<h2>商品详情</h2>
		</el-row>
		<el-row>
			<p>{{ goods.details }}</p>
		</el-row>
	</div>

	<div id="container" class="product-comment">
		<el-row justify="center">
			<h2>商品评价</h2>
			<el-divider></el-divider>
		</el-row>
		<!-- <el-row> -->
		<template v-for="(comment, i) in goods.comments" :key="i">
			<el-row>
				<el-col :span="8" style="text-align: left;" class="ml-10">
					<h2> {{ comment.userName }}</h2>
				</el-col>
				<el-col :span="5" style="text-align: left;" class="mt-5">
					<el-rate v-model="comment.rate" allow-half disabled />
				</el-col>
			</el-row>
			<el-row>
				<el-col style="text-align: left;">
					<p>{{ comment.content }}</p>
				</el-col>
			</el-row>
			<el-divider></el-divider>
		</template>
		<!-- </el-row> -->
	</div>
</template>

<script>
import { getGoodsDetail, addToCart, subscribeShop, cancelSubscribingShop, collectProduct, cancelCollectingProduct, checkProductCollected, checkShopSubscribed, getAddress, buyImmediately } from '../../api/apis';
import { ElMessage } from 'element-plus'

export default {
	data() {
		return {
			ElMessage,
			goods: {
				productId: 0,
				name: '测试商品名称',
				storage: 20,
				version: [''],
				price: 100.01,
				imageSrc: 'https://sc01.alicdn.com/kf/HTB1Cic9HFXXXXbZXpXXq6xXFXXX3/200006212/HTB1Cic9HFXXXXbZXpXXq6xXFXXX3.jpg',
				details: 'This is a test product.',
				shopName: 'Bemani Sound Team',
				shopId: 1,
				comments: [
					{
						username: 'Ibuki Ayapa',
						rate: 5.0,
						content: 'I love it.'
					},
					{
						username: 'Minato Aqua',
						rate: 3.5,
						content: 'Otsuaqua!'
					},
				]

			},
			userAddress: [
				{
					aid: 3,
					name: '射命丸文',
					phone: '123',
					address: '妖怪之山',
				},
			],
			buyInfo: {
				pid: -1,
				username: '',
				version: '',
				quantity: 1,
			},
			shopSubscribed: false,
			productCollected: false,
			selectedAid: -1,
			username: '',
		};
	},

	mounted() {
		this.buyInfo.username = localStorage.getItem('loginUserName');
		this.getGoodsDetailRequest();
		this.getUserAddressRequest();
		this.checkProductCollectedRequest();
		this.checkShopSubscribedRequest();
		this.buyInfo.version = this.goods.version[1];
		this.selectedAid = this.userAddress[0].aid;
	},

	methods: {
		getGoodsDetail,
		addToCart,
		subscribeShop,
		cancelSubscribingShop,
		collectProduct,
		cancelCollectingProduct,
		checkProductCollected,
		checkShopSubscribed,
		buyImmediately,
		getAddress,
		getGoodsDetailRequest() {
			console.log(this.$route.params.goodsId);
			// this.goods.productId = this.$route.params.goodsId;
			getGoodsDetail({id: this.$route.params.goodsId}).then(res => {
				if (res.stateCode == '200') {
					console.log(res.data);
					this.goods = res.data;
					this.goods.productId = this.$route.params.goodsId;
					this.buyInfo.pid = this.$route.params.goodsId;
				} else {
					if (res.stateMsg) {
						ElMessage.error(res.stateMsg);
					} else {
						ElMessage.error('未知错误, Status: ' + res.stateCode);

					}
				}
			});
		},
		checkout() {  
        alert('正在结算...');  
        // 结算逻辑待补充
      	},
		clickToShop() {
			this.$router.push({ path: `/shopDetail/${this.goods.shopId}` })
		},
		addToCartRequest() {
			addToCart(this.buyInfo).then(res => {
				if (res.stateCode == '200') {
					ElMessage.success('添加至购物车成功')
				} else {
					if (res.stateMsg) {
						ElMessage.error(res.stateMsg);
					} else {
						ElMessage.error('未知错误, Status: ' + res.stateCode);

					}
				}
			});
		},

		buyImmediatelyRequest() {
			console.log(this.selectedAid);
			buyImmediately({
				username: this.buyInfo.username,
				pid: this.buyInfo.pid,
				version: this.buyInfo.version,
				quantity: this.buyInfo.quantity,
				aid: this.selectedAid,
			}).then(res => {
				if (res.stateCode == '200') {
					console.log(res.data);
					this.$router.push(`/Comment/${this.goods.productId}`);
				} else {
					if (res.stateMsg) {
						ElMessage.error(res.stateMsg);
					} else {
						ElMessage.error('未知错误, Status: ' + res.stateCode);
					}
				}
			});
		},
		subscribeShopRequest() {
			subscribeShop({ username: this.buyInfo.username, sid: this.goods.shopId }).then(res => {
				if (res.stateCode == '200') {
					ElMessage.success('关注店铺成功');
					this.shopSubscribed = true;
				} else {
					if (res.stateMsg) {
						ElMessage.error(res.stateMsg);
					} else {
						ElMessage.error('未知错误, Status: ' + res.stateCode);

					}
				}
			});
			this.checkShopSubscribedRequest();
		},
		cancelSubscribingShopRequest() {
			cancelSubscribingShop({ username: this.buyInfo.username, sid: this.goods.shopId }).then(res => {
				if (res.stateCode == '200') {
					ElMessage.success('取消关注店铺成功');
					this.shopSubscribed = false;
				} else {
					if (res.stateMsg) {
						ElMessage.error(res.stateMsg);
					} else {
						ElMessage.error('未知错误, Status: ' + res.stateCode);
					}
				}
			});
			this.checkShopSubscribedRequest();
		},
		collectProductRequest() {
			collectProduct({ username: this.buyInfo.username, pid: this.$route.params.goodsId }).then(res => {
				if (res.stateCode == '200') {
					ElMessage.success('收藏商品成功');
					this.productCollected = true;
				} else {
					if (res.stateMsg) {
						ElMessage.error(res.stateMsg);
					} else {
						ElMessage.error('未知错误, Status: ' + res.stateCode);
					}
				}
			});
			this.checkProductCollectedRequest();
		},
		cancelCollectingProductRequest() {
			cancelCollectingProduct({ username: this.buyInfo.username, pid: this.$route.params.goodsId }).then(res => {
				if (res.stateCode == '200') {
					ElMessage.success('取消收藏商品成功');
					this.productCollected = false;
				} else {
					if (res.stateMsg) {
						ElMessage.error(res.stateMsg);
					} else {
						ElMessage.error('未知错误, Status: ' + res.stateCode);
					}
				}
			});
			this.checkProductCollectedRequest();
		},
		checkProductCollectedRequest() {
			checkProductCollected({ username: this.buyInfo.username, pid: this.$route.params.goodsId }).then(res => {
				if (res.stateCode == '200') {
					console.log('Product:' + res.data);
					this.productCollected = res.data;
					console.log(this.productCollected)
				} else {
					if (res.stateMsg) {
						ElMessage.error(res.stateMsg);
					} else {
						ElMessage.error('未知错误, Status: ' + res.stateCode);
					}
				}
			});
		},
		checkShopSubscribedRequest() {
			checkShopSubscribed({ username: this.buyInfo.username, sid: this.goods.shopId }).then(res => {
				if (res.stateCode == '200') {
					console.log('Shop:' + res.data);
					this.shopSubscribed = res.data;
					console.log(this.shopSubscribed)
				} else {
					if (res.stateMsg) {
						ElMessage.error(res.stateMsg);
					} else {
						ElMessage.error('未知错误, Status: ' + res.stateCode);
					}
				}
			});
		},
		getUserAddressRequest() {
			getAddress({username: this.buyInfo.username}).then(res => {
				if (res.stateCode == '200') {
					if (res.data.length == 0) {
						ElMessage.info('请先设置收货地址');
						this.$router.push('/address');
					} else {
						this.userAddress = res.data;
						console.log(this.userAddress);
					}
				} else {
					if (res.stateMsg) {
						ElMessage.error(res.stateMsg);
					} else {
						ElMessage.error('未知错误, Status: ' + res.stateCode);
					}
				}
			}); 
		}
	},
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

/*Product Rating  */
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