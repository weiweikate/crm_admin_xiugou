// 广告位接口列表
export const bannerListUrl = '/admin/ad/queryAdList'; // 广告位列表接口
export const delItemUrl = '/admin/ad/deleteAd'; // 删除接口
export const addItemUrl = '/admin/ad/addAd'; // 添加接口
export const editdUrl = '/admin/ad/updateAd'; // 修改
export const queryUrl = '/admin/ad/findAdById'; // 查询
// 优惠劵详情
export const getDiscountCouponPageById = '/admin/discountCoupon/getDiscountCouponPageById';
// 失效
export const loseDiscountCoupon = '/admin/discountCoupon/loseDiscountCoupon';
// 新增优惠劵
export const addDiscountCoupon = '/admin/discountCoupon/addDiscountCoupon';
// 新增库存
export const addRepertory = '/admin/discountCoupon/addRepertory';
// 根据ID修改优惠劵
export const updateDiscountCouponById = '/admin/discountCoupon/updateDiscountCouponById';
// 卷数据
export const discountCouponDealerPageList = '/admin/discountCouponDealer/discountCouponDealerPageList';
// 批量失效卷数据
export const loseBatchDiscountCouponDealer = '/admin/discountCouponDealer/loseBatchDiscountCouponDealer';

// 查询经销商层级列表
export const getDealerLevelList = '/admin/dealerLevel/getList';
// 获取一级类目
export const getFirstList = '/admin/productCategory/queryProductCategoryName';
// 获取二级类目
export const getSecondList = '/admin/productCategory/queryProductCategoryFatherid';

// 模板列表
export const getAllDiscountCouponTemplate = '/admin/discountCouponTemplate/getAllDiscountCouponTemplate';

/** ************优惠套餐*****************/
// 套餐列表
export const queryOperActivityPackagePageList = '/admin/operActivityPackage/queryOperActivityPackagePageList';
// 批量删除（逻辑删除）与下架
export const batchDeleteOperActivityPackage = '/admin/operActivityPackage/batchDeleteOperActivityPackage';
// 修改套餐状态
export const updateOperActivityPackageStatusById = '/admin/operActivityPackage/updateOperActivityPackageStatusById';
// 优惠套餐产品查询
export const queryPackageProductList = '/admin/operActivityPackageProduct/queryPackageProductList';
// 添加产品和规格
export const addPackageProduct = '/admin/operActivityPackageProduct/addPackageProduct';
// 修改产品库存
export const updatePackageSpecValueStock = '/admin/operActivityPackageSpecValue/updatePackageSpecValueStock';
// 查看库存管理
export const queryPackageSpecValueStockList = '/admin/operActivityPackageSpecValue/queryPackageSpecValueStockList';
// 修改优惠套餐价格和库存
export const updateOperActivityPackagePriceAndStock = '/admin/operActivityPackage/updateOperActivityPackagePriceAndStock';
// 查询优惠套餐价格库存管理
export const queryPackageSpecValueLPriceAndStockList = '/admin/operActivityPackageSpecValue/queryPackageSpecValueLPriceAndStockList';
// 查看套餐详情
export const findOperActivityPackageDetailsById = '/admin/operActivityPackage/findOperActivityPackageDetailsById';
// 添加套餐
export const addOperActivityPackage = '/admin/operActivityPackage/addOperActivityPackage';
// 编辑套餐数据
export const updateOperActivityPackage = '/admin/operActivityPackage/updateOperActivityPackage';
// 编辑套餐数据回显
export const findOperActivityPackageById = '/admin/operActivityPackage/findOperActivityPackageById';

/** ************奖品池*****************/
// 奖品池列表
export const queryPrizePoolList = '/admin/operPrizePool/queryPrizePoolList';
// 优惠券查询
export const queryDiscountCouponList = '/admin/discountCoupon/queryDiscountCouponList';

/** ************公用*****************/
// 新建商品查询
export const queryProductByNameOrCode = 'admin/operator/queryProductByNameOrCode';
// 新建商品规格查询
export const queryProductSpecById = '/admin/operator/queryProductSpecById';
// 发布人列表
export const operatorqueyByStatus = '/admin/adminUser/operatorqueyByStatus';
// 获取一二级类目列表
export const getCategoryList = '/admin/productCategory/queryProductCategoryPageList';
// 根据类目查询品牌列表
export const queryCategoryBrandCid = 'admin/categoryBrand/queryCategoryBrandCid';
// 上传图片
export const addImg = '/admin/ossClient/aliyunOSSUploadImage';
// 获取供应商列表
export const querySupplierBrandPageList = '/admin/supplierBrand/querySupplierBrandPageList';
// 获取模板列表
export const getFreightTemplateList = '/admin/freightTemplate/getFreightTemplateList';
// 获取所有标签
export const queryTagLibraryList = '/admin/tagLibrary/queryTagLibraryList';
// 添加新标签
export const addTagLibrary = '/admin/tagLibrary/addTagLibrary';
// 根据二级分类查询产品参数
export const infoParmByCategoryIdList = '/admin/infoParm/infoParmByCategoryIdList';
// 优惠劵列表
export const getDiscountCouponPage = '/admin/discountCoupon/getDiscountCouponPage';

// 分页列表
export const queryReturnAddressList = '/admin/returnAddress/queryReturnAddressList';
// 添加寄回地址
export const addReturnAddress = '/admin/returnAddress/addReturnAddress';
// 修改寄回地址
export const updateReturnAddress = '/admin/returnAddress/updateReturnAddress';
// 假删除寄回地址
export const deleteReturnAddress = '/admin/returnAddress/deleteReturnAddress';
// 基本信息设置
export const updateSysConfigByTransaction = '/admin/config/updateConfigByTransaction';
// 获取基本信息
export const findSysConfig = '/admin/config/findConfig';
// 货币比例设置
export const updateSysConfigByCurrency = '/admin/config/updateConfigByCurrency';
// 分页列表
export const queryStoreHouseList = '/admin/storeHouse/queryStoreHouseList';
// 添加提货地址
export const addStoreHouse = '/admin/storeHouse/addStoreHouse';
// 修改提货地址
export const updateStoreHouse = '/admin/storeHouse/updateStoreHouse';
// 假删除自提仓库地址
export const updateStoreHouseDeleteById = '/admin/storeHouse/updateStoreHouseDeleteById';
// 产品推荐位列表
export const queryFeaturedList = '/admin/featured/queryFeaturedList';
// 产品推荐位查询详情
export const findFeaturedById = '/admin/featured/findFeaturedById';
// 修改产品推荐位
export const updateFeatured = '/admin/featured/updateFeatured';
// 删除产品推荐位
export const deleteFeatured = '/admin/featured/deleteFeatured';
// 添加产品推荐位
export const addFeatured = '/admin/featured/addFeatured';
// 根据产品Id查询产品名称
export const findProductNameByProdCode = '/admin/product/findProductNameByProdCode';
// 根据产品Id查询专题名称
export const getById = '/admin/topic/getNameById';
// 设置
export const updateConfigByGroupstore = '/admin/config/updateConfigByGroupstore';
// 信息
export const findConfig = '/admin/config/findConfig';
// 拼店店铺举报列表
export const queryStoreReportPageList = ['/admin/store/storeTipOff/query', { methods: 'get' }];

// 新建/编辑模版
export const topicSave = '/admin/topic/save';
// 根据id获取专题详情
export const getTopic = '/admin/topic/get';
// 删除模版
export const deleteTopic = '/admin/topic/delete';
// 获取模板列表
export const tplList = '/admin/topic/template/list';
//* ******************************************************************************************************************************
export const addBadWord = '/config/sysBadWord/addBadWord'; // 添加敏感词
export const deleteBadWord = ['/config/sysBadWord/deleteBadWord', { methods: 'get' }]; // 删除敏感词
export const queryBadWord = '/config/sysBadWord/queryBadWord'; // 查询敏感词列表
export const getAllWordsByPage = '/hotWord/getAllWordsByPage'; // 关键词分页列表

// 优惠券
// 分页查询优惠券
export const queryCouponList = '/coupon/queryCouponList';
// 添加修改优惠券
export const addOrModifyCoupon = '/coupon/addOrModifyCoupon';
// 添加库存
export const addCouponStock = '/coupon/addStock';
// 查询券数据列表
export const queryUserCouponList = '/user/coupon/queryUserCouponList';
// 券数据批量删除
export const bathVaildCoupon = '/user/coupon/bathVaildCoupon';
// 导出
export const downloadCouponList = ['/user/coupon/downloadCouponList', { methods: 'get' }];
// 失效优惠券
export const deleteCouponById = ['/coupon/deleteById', { methods: 'get' }];
// 通过id查询优惠券信息
export const findCouponById = ['/coupon/findById', { methods: 'get' }];
// 查询运费模板
export const queryTemplateList = ['/coupon/template/queryTemplateList', { methods: 'get' }];
// 查询产品列表
export const queryProductList = '/product/product/queryProductList';

// 帮助中心
// 问题类目列表
export const queryHelpTypePageList = '/help/helpType/queryHelpTypePageList';
// 添加问题类型
export const addHelpType = '/help/helpType/addHelpType';
// 删除问题类型
export const deleteHelpType = ['/help/helpType/deleteHelpType', { methods: 'get' }];
// 问题列表
export const queryHelpQuestionPageList = '/help/helpQuestion/queryHelpQuestionPageList';
// 添加问题
export const addHelpQuestion = '/help/helpQuestion/addHelpQuestion';
// 根据id查询问题详情
export const findHelpQuestionById = ['/help/helpQuestion/findHelpQuestionById', { methods: 'get' }];
// 编辑问题详情
export const updateHelpQuestion = '/help/helpQuestion/updateHelpQuestion';
// 删除问题
export const deleteHelpQuestion = ['/help/helpQuestion/deleteHelpQuestion', { methods: 'get' }];

// 专题
// 查询专题列表
export const topicList = '/topic/queryPageList';
// 添加或修改专题
export const addOrModifyTopic = '/topic/addOrModify';
// 删除专题
export const deleteTopicByCode = ['/topic/deleteByCode', { methods: 'get' }];
// 查询专题
export const findTopicById = ['/topic/findById', { methods: 'get' }];
// 查询专题
export const findTopicTemplate = ['/topic/template/queryAll', { methods: 'get' }];
/** ************降价拍*****************/
// 降价拍商品列表
export const operatorDepreciatelist = '/operator/activityDepreciate/queryActivityDepreciateList';
// 新建降价拍
export const operatorAddDepreciate = '/operator/activityDepreciate/addActivityDepreciate';
// 删除
export const deleteActivityDepreciate = ['/operator/activityDepreciate/deleteActivityDepreciate', { methods: 'get' }];
// 结束
export const modifyActivityDepreciate = ['/operator/activityDepreciate/modifyActivityDepreciate', { methods: 'get' }];
// 减少库存
export const reduceStockById = '/operator/activityDepreciate/reduceStockById';
// 查询降价拍商品详情
export const operatorfindById = ['/operator/activityDepreciate/findActivityDepreciate', { methods: 'get' }];
// 根据活动类型和查询关键字查询产品信息
export const queryProductByTypeOrCode = '/product/product/queryProductByNameOrCode';
// 根据产品id查询产品规格
export const queryProductSpecByproductId = ['/product/productSpecPrice/queryProductSpecByproductId', { methods: 'get' }];
/** ************关键词*****************/
// 关键词分页列表
export const getWordsByPage = '/config/searchWord/queryByPage';
/** ************热搜关键词*****************/
// 热词分页列表
export const getHotWordsByPage = '/config/sysHotWord/queryHotWord';
// 新增热词
export const addHotWord = '/config/sysHotWord/addHotWord';
// 修改热词状态
export const updateHotWordsStatusById = '/config/sysHotWord/operHotWord';
// 修改热词信息
export const updateHotWordsById = '/config/sysHotWord/updateHotWordsById';
/** ************广告位*****************/
// 新增广告
export const addAdvertisement = '/config/advertisement/addAdvertisement';
// 查询广告列表
export const queryAdvertisementPageList = '/config/advertisement/queryAdvertisementPageList';
// 编辑广告
export const updateAdvertisement = '/config/advertisement/updateAdvertisement';
// 删除广告
export const deleteAdvertisement = ['/config/advertisement/deleteAdvertisement', { methods: 'get' }];
// 根据ID查询广告信息
export const findAdvertisementById = ['/config/advertisement/findAdvertisementById', { methods: 'get' }];
// 根据类型和code查询名称
export const getInfoByCode = ['/config/advertisement/getInfo', { methods: 'get' }];

/** ************秒杀*****************/
// 新建秒杀
export const addOperatorSeckill = '/operator/seckill/add';
// 秒杀活动查询
export const queryOperatorSeckillList = '/operator/seckill/queryPageList';
// 批量结束/删除秒杀
export const bathUpdateActiviySeckillStatus = '/operator/seckill/bathUpdateStatusByIds';
// 结束/删除秒杀
export const updateActiviySeckillStatus = '/operator/seckill/updateStatusById';
// 查看活动详情
export const findActivitySeckillByActivityCode = ['/operator/seckill/findById', { methods: 'get' }];

/** ************标签管理*****************/
// 添加标签
export const addSysTagLibrary = '/config/sysTagLibrary/addSysTagLibrary';
// 查询标签列表
export const querySysTagLibraryList = '/config/sysTagLibrary/querySysTagLibraryList';
// 清空标签
export const removeByTypeId = '/config/sysTagLibrary/removeByTypeId';
// 批量清空标签
export const removeByTypeIds = '/config/sysTagLibrary/removeByTypeIds';
// 删除标签
export const removeTags = '/config/sysTagLibrary/removeTags';
// 添加标签类型
export const addSysTagType = '/config/sysTagType/addSysTagLibrary';
// 查询标签类型列表
export const querySysTagTypePageList = '/config/sysTagType/querySysTagTypePageList';
// 修改标签状态
export const updateSysTagTypeStatusById = ['/config/sysTagType/deleteById', { methods: 'get' }];

