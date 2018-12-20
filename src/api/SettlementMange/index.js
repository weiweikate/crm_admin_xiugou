// 获取提现申请审核列表
export const queryWithdrawMoneyList = '/admin/withdrawMoney/queryWithdrawMoneyList';
// 同意提现
export const agreeToWithdrawMoney = '/admin/withdrawMoney/agreeToWithdrawMoney';
// 驳回提现申请
export const rejectWithdrawMoney = '/admin/withdrawMoney/rejectWithdrawMoney';
// 查看打款记录
export const queryWithdrawMoneyById = '/admin/withdrawMoney/queryWithdrawMoneyById';
// 查看驳回理由
export const queryRefusalReason = '/admin/withdrawMoney/queryRefusalReason';

// 分页店主、店员、直接上级、间接上级、自己收入明细列表
export const querySettlementRecordListByCalcType = '/admin/settlementRecord/querySettlementRecordListByCalcType';
// 分页查询助业金、其他1、其他2、其他3列表
export const querySettlementTotalList = '/admin/settlementTotal/querySettlementTotalList';
// 无主账户资金收入明细
export const querySettlementRecordList = '/admin/settlementRecord/querySettlementRecordList';

// 收益金比例设置
export const updateConfigBalanceInProfitRatio = '/admin/config/updateConfigBalanceInProfitRatio';

// 查询系统配置
export const findConfig = '/admin/config/findConfig';
// 获取供应商列表
export const querySupplierList = '/admin/supplier/querySupplierList';
// 获取管理员列表
export const adminList = '/admin/adminUser/queryAdminUserList';

// 修改提现设置信息
export const updateWithdrawConfig = '/admin/withdrawConfig/updateWithdrawConfig';
// 提现设置信息查询
export const queryWithdrawConfig = '/admin/withdrawConfig/queryWithdrawConfig';

// 退款记录列表
export const queryReturnMoneyList = '/admin/returnProduct/queryReturnMoneyList';
// 换货记录列表
export const queryExchangeProductList = '/admin/returnProduct/queryExchangeProductList';
// 退货记录列表
export const queryReturnProductList = '/admin/returnProduct/queryReturnProductList';
// 售后详情
export const findReturnProductInfo = '/admin/returnProduct/findReturnProductInfo';

// 利润分配模板列表
export const querySettlementConfigList = '/admin/settlementConfig/querySettlementConfigList';
// 添加利润分配模版
export const addSettlementConfig = '/admin/settlementConfig/addSettlementConfig';
// 根据id获取模版详情
export const findSettlementConfigById = '/admin/settlementConfig/findSettlementConfigById';
// 修改利润模板接口
export const updateSettlementConfig = '/admin/settlementConfig/updateSettlementConfig';
// 修改利润模版状态
export const updateSettlementConfigStatus = '/admin/settlementConfig/updateSettlementConfigStatus';

//* *******************************************************************************************************************************************************
export const queryFlatAccountByType = ['/settle/orderFlow/queryByType', { methods: 'post' }]; // 平台账户收益明细
export const addProfitTpl = ['/settle/template/add', { methods: 'post' }]; // 添加结算模版
export const querySettleTplList = ['/settle/template/queryList', { methods: 'post' }]; // 查询结算模版列表
export const querySettleProFitById = ['/settle/template/queryDetail', { methods: 'get' }]; // 查询结算模版详情
export const disableSettleProFitById = ['/settle/template/disable', { methods: 'get' }]; // 停用模板
// 保证金缴纳记录
export const storePayRecordList = ['/store/deposit/query', { methods: 'get' }];
// 供应商结算列表
export const querySupplierByProductId = ['/order/orderProduct/queryByProductId', { methods: 'post' }];
//导出对账单
export const exportStorePayRecordList = '/admin/order/orderProduct/export';
//提现申请审核列表
export const queryUserWithdrawList = '/user/withdraw/queryUserWithdrawList';
// 同意/拒绝提现申请
export const updateApply = ['/user/withdraw/updateApply', { methods: 'get' }];
// 查看账户明细
export const findUserWithdrawById = ['/user/withdraw/findUserWithdrawById', { methods: 'get' }];
