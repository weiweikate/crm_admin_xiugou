//* ******************************************************************************************************************************
export const addBadWord = '/config/sysBadWord/addBadWord'; // 添加敏感词
export const deleteBadWord = ['/config/sysBadWord/deleteBadWord', { methods: 'get' }]; // 删除敏感词
export const queryBadWord = '/config/sysBadWord/queryBadWord'; // 查询敏感词列表
export const getAllWordsByPage = '/hotWord/getAllWordsByPage'; // 关键词分页列表
/** ************发现管理*****************/
export const addDiscoverCategory = '/discoverCategory/addDiscoverCategory'; // 添加分类
export const addDiscoverArticle = '/discoverArticle/addDiscoverArticle'; // 添加文章
export const updateDiscoverCategory = '/discoverCategory/updateDiscoverCategory'; // 编辑分类
export const updateDiscoverArticle = '/discoverArticle/updateDiscoverArticle'; // 编辑文章
export const queryDiscoverCategoryPageList = '/discoverCategory/queryDiscoverCategoryPageList'; // 分类列表
export const queryDiscoverArticlePageList = '/discoverArticle/queryDiscoverArticlePageList'; // 文章列表
export const findDiscoverCategoryById = ['/discoverCategory/findDiscoverCategoryById', { methods: 'get' }]; // 根据id查询分类详情
export const findDiscoverArticleById = ['/discoverArticle/findDiscoverArticleById', { methods: 'get' }]; // 根据id查询文章详情
export const deleteDiscoverCategoryById = ['/discoverCategory/deleteDiscoverCategoryById', { methods: 'get' }]; // 删除分类
export const deleteDiscoverArticleById = ['/discoverArticle/deleteDiscoverArticleById', { methods: 'get' }]; // 删除文章
export const queryArticalPublishCategoryList = ['/discoverArticle/queryCategoryList', { methods: 'get' }]; // 查询分类列表
export const queryArticalPublishCUserList = ['/discoverArticle/queryUserList', { methods: 'get' }]; // 查询发布者列表

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
// 失效优惠券
export const deleteCouponById = ['/coupon/deleteById', { methods: 'get' }];
// 通过id查询优惠券信息
export const findCouponById = ['/coupon/findById', { methods: 'get' }];
// 查询运费模板
export const queryTemplateList = ['/coupon/template/queryTemplateList', { methods: 'get' }];

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
export const queryByProductCode = ['/product/sku/queryByProductCode', { methods: 'get' }];
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
export const bathUpdateActiviySeckillStatus = '/operator/seckill/bathUpdateStatusByCodes';
// 结束/删除秒杀
export const updateActiviySeckillStatus = '/operator/seckill/updateStatusByCode';
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
// 查询标签类型列表
export const querySysTagTypePageList = '/config/sysTagType/querySysTagTypePageList';
// 修改标签状态
export const updateSysTagTypeStatusById = ['/config/sysTagType/deleteById', { methods: 'get' }];

/** ************通知公告*****************/
// 取消公告
export const cancelNoticeById = ['/notice/cancelNoticeById', { methods: 'get' }];
// 删除公告
export const deleteNoticeById = ['/notice/deleteNoticeById', { methods: 'get' }];
// 查询公告byId
export const queryNoticeById = ['/notice/queryNoticeById', { methods: 'get' }];
// 查询公告列表
export const queryNoticeList = '/notice/queryNoticeList';
// 插入修改公告
export const saveNotice = '/notice/saveNotice';

/** ************推广订单*****************/
// 套餐管理
// 添加
export const addPromotionPackage = '/promotion/promotionPackage/addPromotionPackage';
// 列表
export const queryPromotionPackagePageList = '/promotion/promotionPackage/queryPromotionPackagePageList';
// 添加库存/修改红包状态
export const updatePromotionPackageStockAndStatus = '/promotion/promotionPackage/updatePromotionPackageStockAndStatus';
// 查询
export const findPromotionPackageDetailsById = ['/promotion/promotionPackage/findPromotionPackageDetailsById', { methods: 'get' }];

//推广订单
// 列表
export const queryPromotionPromoterPageList = '/promotion/promotionPromoter/queryPromotionPromoterPageList';
// 分页查询用户购买信息列表
export const queryPromotionReceiveRecordPageList = '/promotion/promotionReceiveRecord/queryPromotionReceiveRecordPageList';
// 取消
export const updatePromotionStatusById = '/promotion/promotionPromoter/updateStatusById';
// 查询
export const findPromotionPromoterDetailById = ['/promotion/promotionPromoter/findPromotionPromoterDetailById', { methods: 'get' }];

/** ************刮刮乐*****************/
// 新增刮刮卡
export const addScratchCard = '/scratch/scratchCard/addScratchCard';
// 查询
export const findScratchCardById = ['/scratch/scratchCard/findById', { methods: 'get' }];
// 列表
export const queryScratchCardList = '/scratch/scratchCard/queryList';
// 列表
export const queryByCodeList = '/scratch/scratchCard/queryByCodeList';
// 修改状态
export const updateScratchCardById = ['/scratch/scratchCard/updateById', { methods: 'get' }];
// 修改
export const updateScratchCard = '/scratch/scratchCard/updateScratchCard';

/** ************  经验值活动  *****************/
// 获取经验活动列表
export const queryExpPageList = ['/operator/activityexperience/queryPageList', { methods: 'post' }];
// 获取经验活动详情
export const queryExpByCode = ['/operator/activityexperience/queryByCode', { methods: 'get' }];
// 获取经验活动中的产品列表
export const queryActivityProdPageList = ['/operator/activityexperience/queryActivityProdPageList', { methods: 'post' }];
// 更新活动说明
export const updateExpRemark = ['/operator/activityexperience/updateExperienceRemark', { methods: 'get' }];
// 查询活动说明
export const queryExpRemark = ['/operator/activityexperience/queryDefaultRemark', { methods: 'get' }];
// 删除经验活动
export const delExpActive = ['/operator/activityexperience/delExperience', { methods: 'get' }];
// 删除经验活动中的产品
export const addOrModifyExperience = ['/operator/activityexperience/addOrModifyExperience', { methods: 'post' }];
// 活动可用产品列表
export const queryActivityProductList = ['/product/product/queryActivityProductList', { methods: 'post' }];
// 获取优惠券信息
export const getCouponById = ['/coupon/findById', { methods: 'get' }];
// 验证活动商品
export const checkActivityProduct = ['/operator/activityExperienceProd/checkActivityProduct', { methods: 'get' }];
// 关闭活动商品
export const closeProduct = ['/operator/activityExperienceProd/closeProduct', { methods: 'get' }];
