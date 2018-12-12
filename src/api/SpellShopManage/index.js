// 店铺等级
// 修改等级
export const updateStoreStarById = '/store/storeStar/updateById';
// 根据ID获取等级
export const getStoreStarById = ['//store/storeStar/getById', { methods: 'get' }];
// 获取所有等级
export const getAllStoreStar = ['/store/storeStar/findAll', { methods: 'get' }];

// 店铺管理
// 已经开启的店铺
// 分红列表
export const getStoreBonusPageList = ['/store/storeBonus/query', { methods: 'get' }];
// 分红详情
export const getDealerBonusList = '/storeBonus/getDealerBonusList'; // 暂时不做
// 成员列表
export const getStoreMembers = '/store/storeUser/query';

// 店铺公告
// 修改数据
export const updateStoreNotice = '/store/storeNotice/updateById';
// 删除数据
export const deleteStoreNotice = '/store/storeNotice/delete';
// 店铺公告列表
export const queryStoreNoticeList = ['/store/storeNotice/findByStoreId', { methods: 'get' }];

// 店铺列表
export const getStoreList = '/store/store/query';
// 店铺详情
export const getStoreDetail = ['/store/store/getById', { methods: 'get' }];
// 晋升降级设置
export const updateStoreStar = '/store/storeStar/update';
// 店铺举报列表
export const getStoreTipOffList = ['/store/storeTipOff/query', { methods: 'get' }];
// 根据id修改店铺层级
export const updateShopLevel = ['/store/store/updateLevel', { methods: 'get' }];
