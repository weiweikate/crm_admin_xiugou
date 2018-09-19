
// 分页品牌列表
export const queryBrandPageList = '/admin/brand/queryBrandPageList';
// 根据二级类目id字符串查询品牌
export const queryCategoryBrandByCId = '/admin/categoryBrand/queryCategoryBrandByCId';
// ******************************************************************************************************************************************************************************
export const queryUserPageList = '/user/queryUserPageList';// 会员列表
export const findDealerById = ['/user/findUserDetailById', { methods: 'get' }]; // 会员详情
export const updateDealerById = '/user/updateUserById'; // 修改经销商信息 1：基础 2：授权
export const findDealerTreeById = ['/user/findUserTreeInfo', { methods: 'get' }]; // 会员树状图
export const queryProductSupplierList = '/product/productSupplier/queryProductSupplierList'; // 分页查询供应商列表
export const addProductSupplier = '/product/productSupplier/addProductSupplier'; // 添加供应商
export const updateSupplier = '/product/productSupplier/modifyProductSupplier'; // 编辑供应商
export const stopProductSupplier = '/product/productSupplier/stopProductSupplier'; // 停启用供应商
export const findSupplierById = ['/product/productSupplier/findProductSupplier', { methods: 'get' }]; // 查看供应商详情
export const addInvite = ['/user/invite/addInvite', { methods: 'post' }]; // 增加邀请配置
export const queryList = ['/user/invite/queryList', { methods: 'post' }]; // 获取邀请列表

// 会员层级
// 查询层级list
export const getLevelList = ['/user/Level/getLevelList', { methods: 'get' }];
// 查询层级信息
export const getList = '/user/Level/getList';
// 删除层级
export const deleteUserLevelById = ['/user/Level/deleteUserLevelById', { methods: 'get' }];
// 修改层级
export const updateUserLevel = '/user/Level/updateUserLevel';
// 根据id查询经销商升降
export const findUserLevelUpgradeDemotionById = ['/user/Level/findUserLevelUpgradeDemotionById', { methods: 'get' }];
// 每周登录要求
export const updateUserLevelDemotionWeekNologinScoreById = '/user/Level/updateUserLevelDemotionWeekNologinScoreById';
// 每周交易额要求
export const updateUserLevelDeWeekSalesById = '/user/Level/updateUserLevelDeWeekSalesById';
// 设置升级经验值
export const updateUserLevelUpExpById = '/user/Level/updateUserLevelUpExpById';
// 设置晋升必要条件
export const updateUserLevelUpConditionById = '/user/Level/updateUserLevelUpConditionById';
// 设置直接交易额条件
export const updateUserLevelUpDirectSalesById = '/user/Level/updateUserLevelUpDirectSalesById';
// 设置直接邀请条件
export const updateUserLevelUpgradeDirectById = '/user/Level/updateUserLevelUpgradeDirectById';
// 设置连续交易频次条件
export const updateUserLevelUpWeekSalesFreqById = '/user/Level/updateUserLevelUpWeekSalesFreqById';
// 设置连续交易额条件
export const updateUserLevelUpWeekSalesById = '/user/Level/updateUserLevelUpWeekSalesById';
// 设置间接交易额条件
export const updateUserLevelUpIndirectSalesById = '/user/Level/updateUserLevelUpIndirectSalesById';
// 设置间接邀请条件
export const updateUserLevelUpIndirectById = '/user/Level/updateUserLevelUpIndirectById';
// 设置一次性交易条件
export const updateUserLevelUpBuyById = '/user/Level/updateUserLevelUpBuyById';
// 设置个人交易额条件
export const updateUserLevelUpPerSalesById = '/user/Level/updateUserLevelUpPerSalesById';
// 代币充值
export const updateUserLevelUpTokenCoinBuyById = '/user/Level/updateUserLevelUpTokenCoinBuyById';
