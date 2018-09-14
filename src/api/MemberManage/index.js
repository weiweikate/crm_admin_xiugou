// 根据id查询经销商升降
export const findDealerLevelUpgradeDemotionById = '/admin/dealerLevel/findDealerLevelUpgradeDemotionById';
// 每周登录要求
export const updateDealerLevelDemotionWeekNologinScoreById = '/admin/dealerLevel/updateDealerLevelDemotionWeekNologinScoreById';
// 每周交易额要求
export const updateDealerLevelDemotionWeekSalesById = '/admin/dealerLevel/updateDealerLevelDemotionWeekSalesById';
// 设置升级经验值
export const updateDealerLevelUpgradeExpById = '/admin/dealerLevel/updateDealerLevelUpgradeExpById';
// 设置晋升必要条件
export const updateDealerLevelUpgradeConditionById = '/admin/dealerLevel/updateDealerLevelUpgradeConditionById';
// 设置直接交易额条件
export const updateDealerLevelUpgradeDirectSalesById = '/admin/dealerLevel/updateDealerLevelUpgradeDirectSalesById';
// 设置直接邀请条件
export const updateDealerLevelUpgradeDirectById = '/admin/dealerLevel/updateDealerLevelUpgradeDirectById';
// 设置连续交易频次条件
export const updateDealerLevelUpgradeWeekSalesFreqById = '/admin/dealerLevel/updateDealerLevelUpgradeWeekSalesFreqById';
// 设置连续交易额条件
export const updateDealerLevelUpgradeWeekSalesById = '/admin/dealerLevel/updateDealerLevelUpgradeWeekSalesById';
// 设置间接交易额条件
export const updateDealerLevelUpgradeIndirectSalesById = '/admin/dealerLevel/updateDealerLevelUpgradeIndirectSalesById';
// 设置间接邀请条件
export const updateDealerLevelUpgradeIndirectById = '/admin/dealerLevel/updateDealerLevelUpgradeIndirectById';
// 设置一次性交易条件
export const updateDealerLevelUpgradeBuyById = '/admin/dealerLevel/updateDealerLevelUpgradeBuyById';
// 设置个人交易额条件
export const updateDealerLevelUpgradePerSalesById = '/admin/dealerLevel/updateDealerLevelUpgradePerSalesById';
// 代币充值
export const updateDealerLevelUpgradeTokenCoinBuyById = '/admin/dealerLevel/updateDealerLevelUpgradeTokenCoinBuyById';
// 根据市code获取区
export const getAreaList = '/admin/area/getAreaList';
// 根据省code获取市
export const getCityList = '/admin/area/getCityList';
// 获取省接口
export const getProvinceList = '/admin/area/getProvinceList';
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

