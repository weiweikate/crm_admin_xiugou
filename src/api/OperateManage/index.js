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
// 问题类目列表
export const queryHelpTypePageList = '/admin/help/helpType/queryHelpTypePageList';
// 添加问题类型
export const addHelpType = '/admin/help/helpType/addHelpType';
// 删除问题类型
export const deleteHelpType = ['/admin/help/helpType/deleteHelpType', { methods: 'get' }];
// 问题列表
export const queryHelpQuestionPageList = '/admin/help/helpQuestion/queryHelpQuestionPageList';
// 添加问题
export const addHelpQuestion = '/admin/help/helpQuestion/addHelpQuestion';
// 根据id查询问题详情
export const findHelpQuestionById = ['/admin/help/helpQuestion/findHelpQuestionById', { methods: 'get' }];
// 编辑问题详情
export const updateHelpQuestion = '/admin/help/helpQuestion/updateHelpQuestion';
// 删除问题
export const deleteHelpQuestion = ['/admin/help/helpQuestion/deleteHelpQuestion', { methods: 'get' }];
/** ************降价拍*****************/
// 降价拍商品列表
export const operatorDepreciatelist = '/admin/operActivityDepreciate/operatorDepreciatelist';
// 新建降价拍
export const operatorAddDepreciate = '/admin/operActivityDepreciate/operatorAddDepreciate';
// 结束/删除/减少库存
export const operatorUpdateDepreciatelist = '/admin/operActivityDepreciate/operatorUpdateDepreciatelist';
// 查询降价拍商品详情
export const operatorfindById = '/admin/operActivityDepreciate/operatorfindById';

/** ************秒杀*****************/
// 新建秒杀
export const addOperatorSeckill = '/admin/operActivitySeckill/saveSeckillProduct';
// 秒杀活动查询
export const queryOperatorSeckillList = '/admin/operActivitySeckill/queryOperatorSeckillList';
// 结束/删除秒杀
export const updateActiviySeckillStatus = '/admin/operActivitySeckill/updateActiviySeckillStatus';
// 查看活动详情
export const findActivitySeckillByActivityCode = '/admin/operActivitySeckill/findActivitySeckillByActivityCode';

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
// 热词分页列表
export const getHotWordsByPage = '/admin/hotWord/getHotWordsByPage';
// 根据id查询热词
export const getHotWordsById = '/admin/hotWord/getHotWordsById';
// 新增热词
export const addHotWord = '/admin/hotWord/addHotWord';
// 删除热词
export const deleteHotWordsById = '/admin/hotWord/deleteHotWordsById';
// 修改热词状态
export const updateHotWordsStatusById = '/admin/hotWord/updateHotWordsStatusById';
// 修改热词信息
export const updateHotWordsById = '/admin/hotWord/updateHotWordsById';
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
// 查询专题列表
export const topicList = '/admin/topic/list';
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
// 通过id查询优惠券信息
export const findCouponById = ['/coupon/findById', { methods: 'get' }];
// 查询运费模板
export const queryTemplateList = ['/coupon/template/queryTemplateList', { methods: 'get' }];
