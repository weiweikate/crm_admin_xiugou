// 供应商管理
// 查询申请入驻商家列表
export const queryMerchant = ['/merchant/query', { methods: 'get' }];
// 处理商家入驻
export const processed = ['/merchant/processed', { methods: 'get' }];
// 已处理未处理商家统计
export const merchantCount = '/merchant/count';
// 查看
export const findMerchantById = ['/merchant/findById', { methods: 'get' }];
