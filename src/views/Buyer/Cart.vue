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
			<el-table-column prop="quantity" label="数量" width="180">
				<template #default="{ row }">
					<el-input-number v-model="row.quantity" :min="1" :readonly="true"
						@change="handleQuantityChange(row)"></el-input-number>
				</template>
			</el-table-column>
			<el-table-column prop="total" label="总价" width="180"></el-table-column>
			<el-table-column label="操作" width="180">
				<template #default="{ row }">
					<el-button @click="removeFromCart(row.productId)">删除</el-button>
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
			<!-- <div>{{ esAddress }}</div>
			<el-button @click="dialogVisible = true">选择地址</el-button>
			<el-button type="primary" @click="checkout">结算</el-button>
			<el-dialog v-model="dialogVisible" style="width:100%">
				<el-table :data="addressList">
					<el-table-column prop="name" label="姓名" width="180"></el-table-column>
					<el-table-column prop="phone" label="电话" width="180"></el-table-column>
					<el-table-column prop="address" label="地址" width="180"></el-table-column>
				</el-table>
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</el-dialog> -->
		</div>
	</div>
</template>

<script>
import {getAddress,getCartList,getInventory,afterbuy,remove_cart} from '../../api/apis.js'
import Postcard from '../../assets/postcard.jpg'
import Postcard2 from '../../assets/postcard2.jpg'
import { readonly } from 'vue';
import { ElMessage } from 'element-plus';
import { getCartList, addCartItemQuantity, reduceCartItemQuantity, deleteCartItem, getAddress } from '../../api/apis.js'
export default {

	data() {
		return {
			ElMessage,
			Postcard,
			Postcard2,
			cartList: [],
			oldCartList: [],
			selectedAid: -1,
			userAddress: [],
			dialogVisible: false,
			isSelectAddress:false,
			isSelectGood:false,
			selectedGoods:[],
			inventories:[],
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
		getCartList, addCartItemQuantity, reduceCartItemQuantity, deleteCartItem, getAddress,
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					done();
				})
				.catch(_ => { });
		},
		getCartInfoRequest() {
			// axios.get(this.getGoodsUrl, {
			// 	headers: { 'Content-Type': 'application/json'}
			// }).then(res => {
			// 	this.goods = res.data;
			// })
			// this.cartList = [
			// 	{
			// 		cid: 0,
			// 		productId: 1,
			// 		productName: 'Test Goods',
			// 		productImageBig: this.Postcard,
			// 		salePrice: 20.19,
			// 		selectedVersion: 'ss',
			// 		quantity: 10,
			// 		total: 201.9,
			// 	},
			// 	{
			// 		cid: 1,
			// 		productId: 2,
			// 		productName: 'Test Goods 2',
			// 		selectedVersion: 'ss',
			// 		productImageBig: this.Postcard2,
			// 		salePrice: 11.19,
			// 		quantity: 20,
			// 		total: 223.8,
			// 	},
			// 	{
			// 		cid: 2,
			// 		productId: 3,
			// 		productName: 'Test Goods 3',
			// 		selectedVersion: 'ss',
			// 		productImageBig: this.Postcard,
			// 		salePrice: 10.4,
			// 		quantity: 15,
			// 		total: 156,
			// 	},
			// 	{
			// 		cid: 3,
			// 		productId: 4,
			// 		productName: 'Test Goods 4',
			// 		selectedVersion: 'ss',
			// 		productImageBig: this.Postcard,
			// 		salePrice: 10.3,
			// 		quantity: 16,
			// 		total: 164.8,
			// 	},
			// 	{
			// 		cid: 4,
			// 		productId: 5,
			// 		productName: 'Test Goods 4',
			// 		selectedVersion: 'ss',
			// 		productImageBig: this.Postcard,
			// 		salePrice: 10.1,
			// 		quantity: 20,
			// 		total: 202,
			// 	},
			// ];
			getCartList({ username: localStorage.getItem('loginUserName') }).then(res => {
				if (res.stateCode == '200') {
					this.cartList = res.data;
					this.oldCartList = this.cartList;
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
			this.oldCartList.forEach(oldItem => {
				if (oldItem.cid == item.cid) {
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
			this.oldCartList = this.cartList;
			item.total = item.salePrice * item.quantity;
			this.getCartInfoRequest();
		},
		removeFromCart(id) {
			// remove Request
			deleteCartItem({ cid: id }).then(res => {
				if (res.stateCode == '200') {
					ElMessage.success('删除成功');
				} else {
					if (res.stateMsg) {
						ElMessage.error(res.stateMsg);
					} else {
						ElMessage.error('未知错误, Status: ' + res.stateCode);
					}
				}
			});
			this.getCartInfoRequest();
			// this.cartList = this.cartList.filter(item => item.productId !== id);  
		},
		getUserAddressRequest() {
			getAddress({username: localStorage.getItem('loginUserName')}).then(res => {
				if (res.stateCode == '200') {
					if (res.data.size() == 0) {
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
		},
		checkout() {
			alert('正在结算...');
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
.cart-container{
	width:100%;
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