// 订单管理
export const orderManage = '/orderManage';
// 所有订单
export const queryAllOrderPageList = '/admin/order/queryAllOrderPageList';
// 待支付
export const queryUnPaidOrderPageList = '/admin/order/queryUnPaidOrderPageList';
// 待发货
export const queryUnSendOutOrderPageList = '/admin/order/queryUnSendOutOrderPageList';
// 待自提
export const queryPickUpByCustomerOrderPageList = '/admin/order/queryPickUpByCustomerOrderPageList';
// 待确认
export const queryWaitReceivingOrderPageList = '/admin/order/queryWaitReceivingOrderPageList'
// 已完成
export const queryCompletedOrderPageList = '/admin/order/queryCompletedOrderPageList';
// 已关闭
export const queryClosedOrderPageList = '/admin/order/queryClosedOrderPageList';
// 待处理订单
export const queryPendingOrderPageList = '/admin/order/queryPendingOrderPageList';
// 订单详情
export const getOrderDetail = '/admin/order/getOrderDetail';
// 标记
export const orderSign = '/admin/order/orderSign';
// 提货按钮(批量)
export const pickUpGoods = '/admin/order/pickUpGoods';
// 提货按钮(单个)
export const pickUpOrderProduct = '/admin/order/pickUpOrderProduct';
// 推送云仓
export const orderSendOut = '/admin/order/orderSendOut';

//售后操作

//同意换货
export const agreeExchange = '/admin/returnProduct/agreeExchange';
//拒绝退款
export const refusalRefund = '/admin/returnProduct/refusalRefund';
//换货变退货
export const exchangeChangeReturn = '/admin/returnProduct/exchangeChangeReturn';
//确认退款
export const confirmRefund = '/admin/returnProduct/confirmRefund';
//退货订单详情
export const findReturnProductInfo = '/admin/returnProduct/findReturnProductInfo';
