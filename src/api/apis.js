import http from './public'

// Login
export const userLogin = params => http.fetchPost(`/users/login?username=${params.username}&password=${params.password}&type=${params.userType}`, params);

// Register
export const userRegister = params => http.fetchPost(`/users/reg?username=${params.username}&password=${params.password}&type=${params.userType}`, params);

// Change Password 
export const changePassword = params => http.fetchPost(`/users/change_password?oldPassword=${params.oldPassword}&newPassword=${params.newPassword}`);

// Change Personal Info
export const changePersonalInfoUrl = '/users/change_info';

// Get all products in homepage
export const getAllGoods = params => http.fetchGet('/products/all', params);

// Search results of goods
export const searchGoods = params => http.fetchPost(`/products/search?keywords=${params.keywords}`, params);

// Search results of shops
export const searchShops = params => http.fetchPost(`/shop/search?keywords=${params.keywords}`, params);

// Get goods detail
export const getGoodsDetail = params => http.fetchPost(`/products/details?id=${params.id}`, params);

// Add to cart 
export const addToCart = params => http.fetchPost(`/cart/add_to_cart?username=${params.username}&pid=${params.pid}&version=${params.version}&quantity=${params.quantity}`, params);


// Buy immediately 
export const buyImmediately = params => http.fetchPost(`/order/submit?username=${params.username}&pid=${params.pid}&version=${params.version}&quantity=${params.quantity}&aid=${params.aid}`, params);

// Collect product
export const collectProduct = params => http.fetchPost(`/favorite/add?username=${params.username}&pid=${params.pid}`, params);


// Subscribe shop
export const subscribeShop = params => http.fetchPost(`/favorite_shop/add?username=${params.username}&sid=${params.sid}`, params);

// Cancel collecting product
export const cancelCollectingProduct = params => http.fetchPost(`/favorite/remove?username=${params.username}&pid=${params.pid}`, params);

// Cancel subscribing shop
export const cancelSubscribingShop = params => http.fetchPost(`favorite_shop/remove?username=${params.username}&sid=${params.sid}`, params);

// check if shop is subscribed 
export const checkShopSubscribed = params => http.fetchPost(`/favorite_shop/isFavorite?username=${params.username}&sid=${params.sid}`, params);


// check if product is collected 
export const checkProductCollected = params => http.fetchPost(`/favorite/isFavorite?username=${params.username}&pid=${params.pid}`, params);


// Get shop details
export const getShopDetail = params => http.fetchPost(`/shop/shop_info?sid=${params.sid}`, params);

// Get shop product list
export const getShopProducts = params => http.fetchPost(`/shop/get_products?sid=${params.sid}`, params);

// Get address list
export const getAddress = params => http.fetchPost(`/address/list?username=${params.username}`, params);

// add address
export const addAddress = params => http.fetchPost(`/address/add?username=${params.username}&name=${params.name}&phone=${params.phone}&address=${params.address}`, params);

// delete address
export const deleteAddress = params => http.fetchPost(`/address/delete?id=${params.aid}`, params);

// upload Product(special)
export const uploadProductUrl = '/products/upload';

// edit Product(special)
export const editProductUrl = '/products/update';

// buyer comments a product
export const userComment = params => http.fetchPost(`/users/comment?id=${params.id}&userName=${params.username}&rate=${params.content}&productId=${params.productId}`);

export const userCommentUrl = '/users/comment';

// delete item in cart by cid
export const deleteCartItem = params => http.fetchPost(`/cart/delete?cid=${params.cid}`, params);

// reduce quantity of a cart item
export const reduceCartItemQuantity = params => http.fetchPost(`/cart/reduce_num?cid=${params.cid}`, params);

// add quantity of a cart item
export const addCartItemQuantity = params => http.fetchPost(`/cart/add_num?cid=${params.cid}`, params);

// get user's all cart items
export const getCartList = params => http.fetchPost(`/cart/list?username=${params.username}`, params);

// get shopid by owner's username
export const getShopId = params => http.fetchPost(`/shop/get_sid?username=${params.username}`, params);