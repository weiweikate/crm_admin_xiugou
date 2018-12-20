// 上传图片
export const addImg='/admin/ossClient/aliyunOSSUploadImage';
// 获取一二级类目列表
export const getCategoryList = '/admin/productCategory/queryProductCategoryPageList';
// 根据类目查询品牌列表
export const queryCategoryBrandCid = 'admin/categoryBrand/queryCategoryBrandCid';
// 获取用户层级列表
export const getDealerLevelList = '/admin/giftBag/queryUserLevel ';
// 获取供应商列表
export const querySupplierBrandPageList = '/admin/supplierBrand/querySupplierBrandPageList';
// 获取所有标签
export const queryTagLibraryList = '/admin/tagLibrary/queryTagLibraryList';
// 添加新标签
export const addTagLibrary = '/admin/tagLibrary/addTagLibrary';
// 获取模板列表
export const getFreightTemplateList = '/admin/freightTemplate/getFreightTemplateList';

// 获取礼包列表
export const queryGiftBagPageList = '/admin/giftBag/queryGiftBagPageList';
// 礼包审核
export const checkGiftBag = '/admin/giftBag/checkGiftBag';
// 礼包上下架
export const giftBagUpOrDown = '/admin/giftBag/giftBagUpOrDown';
// 批量删除
export const batchDeleteGiftBag = '/admin/giftBag/batchDeleteGiftBag';
// 批量下架
export const batchSoldOutGiftBag = '/admin/giftBag/batchSoldOutGiftBag';

// 查询参考价
export const queryReferencePrice = '/admin/giftBag/queryReferencePrice';
// 模糊查询产品
export const findProductInfo = '/admin/giftBag/findProductInfo';
// 根据产品ID查询规格列表
export const queryProductSpecById = '/admin/giftBag/queryProductSpecById';
// 添加礼包产品
export const addGiftBagProduct = '/admin/giftBag/addGiftBagProduct';
// 获取礼包产品信息
export const queryGiftBagProductById = '/admin/giftBag/queryGiftBagProductById'
// 根据id删除产品礼包信息
export const deleteGiftBagProductById = '/admin/giftBag/deleteGiftBagProductById';
// 价格添加
export const priceControl = '/admin/giftBag/priceControl';
// 价格回显
export const queryPriceEcho = '/admin/giftBag/queryPriceEcho';

// 经验值设置
export const setExperience = '/admin/giftBag/setExperience';
// 经验值回显
export const findExpById = '/admin/giftBag/findExpById';

// 礼包详情
export const getGiftBagDetail = '/admin/giftBag/getGiftBagDetail';

// 添加礼包
export const addGiftBag = '/admin/giftBag/addGiftBag';
// 根据id获取礼包详情
export const findGiftBagById = '/admin/giftBag/findGiftBagById';
// 编辑礼包
export const updateGiftBag = '/admin/giftBag/updateGiftBag';

// 根据id获取礼包优惠券列表
export const queryCouponListByGiftBagId = '/admin/giftBag/queryCouponListByGiftBagId';
// 根据id删除礼包优惠券
export const deleteCouponByCouponId = '/admin/giftBag/deleteCouponByCouponId';
// 获取优惠券列表
export const queryCouponList = '/admin/giftBag/queryCouponList';
// 添加优惠券
export const couponControl = '/admin/giftBag/couponControl';

// 根据二级分类查询参数
export const infoParmByCategoryIdList = '/admin/giftBag/queryGiftBagInfoParamByCategoryIdList';
