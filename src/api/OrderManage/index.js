export const findLogisticsDetail = ['/order/logistics/findLogisticsDetail', { methods: 'get' }]; // 物流测试

// 订单管理
// 订单列表
export const queryOrderPageList = '/orderManagement/orders/query';
// 查询发货单列表
export const queryDeliveryOrderPageList = '/orderManagement/delivery/query';
// 查询发货单详情
export const deliveryOrderDetail = ['/orderManagement/delivery/deliveryNo', { methods: 'get' }];
// 查询支付单列表
export const queryPaymentsOrderPageList = '/orderManagement/payments/query';
// 订单详情
export const orderDetail = ['/orderManagement/orders/warehouseOrderNo', { methods: 'get' }];
// 取消订单
export const cancelOrder = '/orderManagement/orders/cancel';
// 订单发货
export const orderSendOut = '/orderManagement/orders/pushToWarehouse';
// 虚拟发货
export const sendGoods = '/order/sendOut';
export const orderSign = '/order/sign';
// 支付单列表
export const queryPayments = '/orderManagement/payments/query';
// 查询发货单列表
export const queryDelivery = '/orderManagement/delivery/query';
// 订单详情
export const deliveryNo = ['/orderManagement/delivery/{deliveryNo}', { methods: 'get' }];

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
export const sendOut = '/order/returnProduct/pushCloudSend';
// 虚拟发货
export const sendFictitiousOut = '/order/returnProduct/sendFictitiousOut';

