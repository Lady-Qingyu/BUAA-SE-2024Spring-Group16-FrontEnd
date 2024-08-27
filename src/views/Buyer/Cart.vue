<template>
	<div class="cart-container">
		<el-table :data="cartList" style="width: 100%">
			<el-table-column prop="productImageBig" label="" width="180">
				<template #default="scope">
					<image :src="scope.row.productImageBig"></image>
				</template>
			</el-table-column>
			<el-table-column prop="productName" label="商品名称" width="180"></el-table-column>
			<el-table-column prop="selectedVersion" label="版本" width="180"></el-table-column>
			<el-table-column prop="salePrice" label="价格" width="180"></el-table-column>
			<el-table-column prop="quantity" label="数量(只能用+-按钮)" width="180">
				<template #default="{ row }">
					<el-input-number v-model="row.quantity" :min="1"
						@change="handleQuantityChange(row)"></el-input-number>
				</template>
			</el-table-column>
			<el-table-column prop="total" label="总价" width="180"></el-table-column>
			<el-table-column label="操作" width="180">
				<template #default="{ row }">
					<el-button @click="removeFromCart(row.cid)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="cart-footer">
			<div>总价：{{ totalPrice }}</div>
			<div>当前地址：</div>
			<el-select v-model="selectedAid" style="width: 70%;">
				<el-option v-for="(address, i) in userAddress" :key="i"
					:label="address.name + ' ' + address.phone + ' ' + address.address" :value="address.aid">
				</el-option>
			</el-select>
			<el-button type="primary" @click="checkout" :disabled="cartList.length == 0">结算</el-button>
		</div>
	</div>
</template>

<script>
import Postcard from '../../assets/postcard.jpg'
import Postcard2 from '../../assets/postcard2.jpg'
import { buttonTypes, ElMessage } from 'element-plus';
import { getCartList, addCartItemQuantity, reduceCartItemQuantity, deleteCartItem, getAddress, buyImmediately } from '../../api/apis.js'
export default {

	data() {
		return {
			ElMessage,
			Postcard,
			Postcard2,
			cartList: [],	// 不要动
			oldCartList: [],
			selectedAid: -1,
			userAddress: [],
			dialogVisible: false,
			isSelectAddress: false,
			isSelectGood: false,
			selectedGoods: [],
			inventories: [],
		}
	},
	computed: {
		// 使用计算属性来计算price的总和  
		totalPrice() {
			// 使用reduce方法来累加price的值  
			return this.cartList.reduce((total, item) => {
				return total + item.total;
			}, 0); // 初始值设为0  
		},
	},
	methods: {
		getCartList, addCartItemQuantity, reduceCartItemQuantity, deleteCartItem, getAddress, buyImmediately,
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					done();
				})
				.catch(_ => { });
		},
		getCartInfoRequest() {
			getCartList({ username: localStorage.getItem('loginUserName') }).then(res => {
				if (res.stateCode == '200') {
					if (res.data.length > 0) {
						this.cartList = res.data;
						this.oldCartList = JSON.parse(JSON.stringify(this.cartList));
						console.log('Cart: ' + this.cartList[0].quantity);
					}
					// this.oldCartList = structuredClone(this.cartList);
					// console.log(this.oldCartList)
				} else {
					if (res.stateMsg) {
						ElMessage.error(res.stateMsg);
					} else {
						ElMessage.error('未知错误, Status: ' + res.stateCode);

					}
				}
			});
		},
		handleQuantityChange(item) {
			// plus or minus Request
			console.log(this.oldCartList);
			this.oldCartList.forEach(oldItem => {
				if (oldItem.cid == item.cid) {
					console.log('old: ' + oldItem.quantity);
					console.log('new: ' + item.quantity);
					if (oldItem.quantity > item.quantity) {
						reduceCartItemQuantity({ cid: item.cid }).then(res => {
							if (res.stateCode == '200') {
								// this.cartList = res.data;
								ElMessage.success('减少成功');
							} else {
								if (res.stateMsg) {
									ElMessage.error(res.stateMsg);
								} else {
									ElMessage.error('未知错误, Status: ' + res.stateCode);

								}
							}
						});
					} else if (oldItem.quantity < item.quantity) {
						addCartItemQuantity({ cid: item.cid }).then(res => {
							if (res.stateCode == '200') {
								// this.cartList = res.data;
								ElMessage.success('增加成功');
							} else {
								if (res.stateMsg) {
									ElMessage.error(res.stateMsg);
								} else {
									ElMessage.error('未知错误, Status: ' + res.stateCode);
								}
							}
						})
					}
				}
			});
			// this.oldCartList = this.cartList;
			item.total = item.salePrice * item.quantity;
			console.log('new quantity:' + item.quantity);
			setTimeout(() => {
				this.getCartInfoRequest();
			}, 20);
		},
		removeFromCart(id) {
			// remove Request
			deleteCartItem({ cid: id }).then(res => {
				if (res.stateCode == '200') {
					console.log(id);
					ElMessage.success('删除成功');
				} else {
					if (res.stateMsg) {
						ElMessage.error(res.stateMsg);
					} else {
						ElMessage.error('未知错误, Status: ' + res.stateCode);
					}
				}
			});
			setTimeout(() => {
				this.getCartInfoRequest();
			}, 20);
			this.$router.replace('/');
			this.$router.replace('/cart');
			// this.getCartInfoRequest();
			// this.cartList = this.cartList.filter(item => item.productId !== id);  
		},
		getUserAddressRequest() {
			getAddress({ username: localStorage.getItem('loginUserName') }).then(res => {
				if (res.stateCode == '200') {
					console.log(res.data);
					if (res.data.length == 0) {
						ElMessage.info('请先设置收货地址');
						this.$router.push('/address');
					} else {
						this.userAddress = res.data;
						this.selectedAid = this.userAddress[0].aid;
					}
				} else {
					if (res.stateMsg) {
						ElMessage.error(res.stateMsg);
					} else {
						ElMessage.error('未知错误, Status: ' + res.stateCode);
					}
				}
			});
		},
		buyFromCartRequest(item) {
			console.log(this.selectedAid);
			buyImmediately({
				username: localStorage.getItem('loginUserName'),
				pid: item.productId,
				version: item.selectedVersion,
				quantity: item.quantity,
				aid: this.selectedAid,
			}).then(res => {
				if (res.stateCode == '200') {
					console.log(res.data);

					// this.$router.push(`/Comment/${this.goods.productId}`);
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
			this.cartList.map(item => {
				this.buyFromCartRequest(item);
				deleteCartItem({ cid: item.cid }).then(res => {
					if (res.stateCode != '200') {
						if (res.stateMsg) {
							ElMessage.error(res.stateMsg);
						} else {
							ElMessage.error('未知错误, Status: ' + res.stateCode);
						}
					}
				});
			})
			alert('正在结算...');
			ElMessage.success('结算成功');
			this.$router.push('/');
		},
	},
	mounted() {
		this.getCartInfoRequest();
		this.getUserAddressRequest();
	}

}
</script>

<style lang="scss" scoped>
.carousel {
	// background-color: var(--ep-color-warning-light-3);
	margin-left: 20%;
	margin-right: 20%;
}

.text {
	// color: #ffffff;
	opacity: 0.9;
	line-height: 200px;
	margin: 0;
	text-align: center;
}


.img-item {
	display: flex;
	flex-direction: column;
}

.cart-container {
	width: 100%;
	text-align: left;
}

.cart-footer {
	margin-top: 60px;
	text-align: right;
	color: grey;
	font-size: large;
	line-height: 40px;
}

.total-price {
	text-align: center;
	margin-top: 20px;
	color: gray;
	font-size: 30px;
	vertical-align: bottom;
}
</style>