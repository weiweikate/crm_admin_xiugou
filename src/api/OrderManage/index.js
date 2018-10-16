// 获取礼包全部订单列表
export const queryAllGiftBagOrderPageList = '/admin/gbGiftBagOrder/queryAllGiftBagOrderPageList';
// 获取礼包待支付订单列表
export const queryUnPayGiftBagOrderPageList = '/admin/gbGiftBagOrder/queryUnPayGiftBagOrderPageList';
// 获取礼包待发货订单列表
export const queryUnSendOutGiftBagOrderPageList = '/admin/gbGiftBagOrder/queryUnSendOutGiftBagOrderPageList';
// 获取礼包待确认订单列表
export const queryUnVerifyGiftBagOrderPageList = '/admin/gbGiftBagOrder/queryUnVerifyGiftBagOrderPageList';
// 获取礼包已完成订单列表
export const queryCompletedGiftBagOrderPageList = '/admin/gbGiftBagOrder/queryCompletedGiftBagOrderPageList';
// 获取礼包已关闭订单列表
export const queryClosedGiftBagOrderPageList = '/admin/gbGiftBagOrder/queryClosedGiftBagOrderPageList';
// 获取礼包订单详情列表
export const getGiftBagOrderDetail = '/admin/gbGiftBagOrder/getGiftBagOrderDetail';
// 云仓发货
// export const orderSendOut = '/admin/order/orderSendOut';
// 星星标记和备注
// export const orderSign = '/admin/order/orderSign';

// 待提货
// 待自提订单
export const queryPickUpByCustomerOrderPageList = '/admin/order/queryPickUpByCustomerOrderPageList';
// 获取待提货订单详情
export const getPickUpByCustomerOrderDetail = '/admin/order/getPickUpByCustomerOrderDetail';
// 获取提货仓列表
export const queryStoreHouseList = '/admin/order/queryStoreHouseList';
// 更换提货仓
export const changeStoreHouse = '/admin/order/changeStoreHouse';
// 提货按钮(批量)
export const pickUpGoods = '/admin/order/pickUpGoods';
// 提货按钮(单个)
export const pickUpOrderProduct = '/admin/order/pickUpOrderProduct';
// 订单详情
export const getOrderDetail = '/admin/order/getOrderDetail';

// 待发货
// 获取待发货列表
export const queryUnSendOutOrderPageList = '/admin/order/queryUnSendOutOrderPageList';

// 已完成
// 获取已完成列表
export const queryCompletedOrderPageList = '/admin/order/queryCompletedOrderPageList';

// 待支付
// 获取待支付列表
export const queryUnPaidOrderPageList = '/admin/order/queryUnPaidOrderPageList';

// 所有订单
// 获取所有点订单列表
export const queryAllOrderPageList = '/admin/order/queryAllOrderPageList';

// 已关闭
export const queryClosedOrderPageList = '/admin/order/queryClosedOrderPageList';

// 待确认
export const queryWaitReceivingOrderPageList = '/admin/order/queryWaitReceivingOrderPageList';

// 待处理订单
export const queryPendingOrderPageList = '/admin/order/queryPendingOrderPageList';

// 售后操作
// 同意换货
// export const agreeExchange = '/admin/returnProduct/agreeExchange';
// 拒绝退款
export const refusalRefund = '/admin/returnProduct/refusalRefund';
// 换货变退货
export const exchangeChangeReturn = '/admin/returnProduct/exchangeChangeReturn';
// 确认退款
export const confirmRefund = '/admin/returnProduct/confirmRefund';
// 退货订单详情
export const findReturnProductInfo = '/admin/returnProduct/findReturnProductInfo';
// 退货订单详情
export const sendEcReturnProduct = '/admin/returnProduct/sendEcReturnProduct';
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------
export const findLogisticsDetail = ['/logistics/findLogisticsDetail', { methods: 'get' }]; // 物流测试

// 订单管理
// 订单列表
export const queryOrderPageList = '/order/queryPage';
// 订单详情
export const orderDetail = '/order/lookDetail';
// 订单发货
export const orderSendOut = '/order/sendOut';
export const orderSign = '/order/sign';

// 售后
// 同意申请（第一次同意）
export const agreeApply = '/order/returnProduct/agreeApply';
// 已收货并同意换货
export const agreeExchange = '/order/returnProduct/agreeExchange';
// 商家退款
export const businessRefund = '/order/returnProduct/businessRefund';
// 商家退款
export const doBusinessRefund = '/order/returnProduct/doBusinessRefund';
// 换货变退货
export const exchangeChangeRefund = '/order/returnProduct/exchangeChangeRefund';
// 查看详情
export const lookDetail = '/order/returnProduct/lookDetail';
// 确认退款
export const makeSureRefund = '/order/returnProduct/makeSureRefund';
// 退款
export const refundAmounts = '/order/returnProduct/refundAmounts';
// 拒绝售后
export const refuse = '/order/returnProduct/refuse';
// 云仓换货发货
export const sendOut = '/order/returnProduct/sendOut';

