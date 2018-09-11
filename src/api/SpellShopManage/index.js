// 店铺等级
// 修改等级
export const updateStoreStarById = '/admin/store/storeStar/updateById';
// 根据ID获取等级
export const getStoreStarById = ['/admin//store/storeStar/getById', { methods: 'get' }];
// 获取所有等级
export const getAllStoreStar = ['/admin/store/storeStar/findAll', { methods: 'get' }];

// 店铺管理
// 已经开启的店铺
// 分红列表
export const getStoreBonusPageList = ['/admin/store/storeBonus/query', { methods: 'get' }];
// 分红详情
export const getDealerBonusList = '/admin/storeBonus/getDealerBonusList'; // 暂时不做
// 成员列表
export const getStoreMembers = ['/admin/store/storeUser/query', { methods: 'get' }];

// 店铺公告
// 修改数据
export const updateStoreNotice = '/admin/store/storeNotice/updateById';
// 删除数据
export const deleteStoreNotice = '/admin/store/storeNotice/delete';
// 店铺公告列表
export const queryStoreNoticeList = ['/admin/store/storeNotice/findByStoreId', { methods: 'get' }];

// 店铺列表
export const getStoreList = '/admin/store/store/query';
// 店铺详情
export const getStoreDetail = ['/admin/store/store/getById', { methods: 'get' }];
// 晋升降级设置
export const updateStoreStar = '/admin/store/storeStar/update';
// 店铺举报列表
export const getStoreTipOffList = ['/admin/store/storeTipOff/query', { methods: 'get' }];
