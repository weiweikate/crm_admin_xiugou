export const indexData = '/admin/index/indexData';
// 物流信息
export const findExpress = '/admin/express/find';
// 验证码登陆
// export const loginByCode = '/admin/adminLogin/codeLogin';

// 首页
// 修改密码短信验证
export const sendUpdatePwdCode = '/sms/sendUpdateMessage';
// 发送登陆短信
export const sendLoginCode = '/sms/sendLoginMessage';
// 修改密码
//
// 授权管理
// 获取渠道列表
export const permitChannelGetList = '/admin/permitChannel/getList';
// 渠道类目添加
export const addPermitChannel = '/admin/permitChannel/addPermitChannel';
// 编辑渠道类目
export const updatePermitChannel = '/admin/permitChannel/updatePermitChannel';
// 续约审核
export const queryPermitRecordList = '/admin/permitRecord/queryPermitRecordList';

// 溯源管理
// 获取所有防伪码模板列表
export const rootsGetCodeTplList = '/admin/securityCodeTemplate/getSecurityCodeTemplateAll';
// 新增防伪码模板
export const rootsAddCodeTplList = '/admin/securityCodeTemplate/addSecurityCodeTemplate';
// 查询防伪码模板
export const rootsQueryCodeTplList = '/admin/securityCodeTemplate/findSecurityCodeTemplateById';
// 修改防伪码模板
export const rootsEditCodeTplList = '/admin/securityCodeTemplate/updateSecurityCodeTemplateById';
// 删除防伪码模板
export const rootsDelCodeTplList = '/admin/securityCodeTemplate/deleteSecurityCodeTemplateById';
// 根据id失效防伪码模板
export const loseById = '/admin/securityCodeTemplate/loseSecurityCodeTemplateById';
// 防伪码参数列表
export const getAllCategoryBrand = '/admin/categoryBrand/getAllCategoryBrand';
// 管理员防伪码参数短信
export const sendSecurityCodeCode = '/admin/phoneCode/sendMessage';
// 新增参数
export const addCategoryBrandCode = '/admin/categoryBrand/addCategoryBrandCode';
// 生成防伪码全码
export const productAllCode = '/securityCode/securityCode/productAllCode';
// 失效编码
export const loseCategoryBrandCode = '/admin/categoryBrand/loseCategoryBrandCode';
//
// 获取防伪码管理列表
export const getRecordPage = '/securityCode/securityCodeRecord/getRecordPage';
// 导出防伪码
export const exportSecurityCode = '/securityCode/securityCodeRecord/exportSecurityCode';
// 修改防伪码状态
export const updateCodeStatus = '/securityCode/securityCodeRecord/updateStatus';
// 获取防伪码模板列表
export const getAllgetAllActivety = '/admin/securityCodeTemplate/getSecurityCodeTemplateAll';
// 生成防伪码
export const productionSecurityCode = '/securityCode/securityCodeRecord/productionSecurityCode';
//
// 查看管理员操作日志
export const getMangerLog = '/admin/logAdminuser/getPage';
// 重置登陆密码
export const resetPassword = '/admin/adminUser/resetPassword';
// 开启/关闭管理员账号
export const updateAdminUserStatus = '/admin/adminUser/updateAdminUserStatus';
// 删除管理员账号
export const deleteAdminUser = '/admin/adminUser/deleteUpdateAdminUser';
// 查询权限三级模块列表
export const queryPrivilegeList = '/admin/privilege/queryPrivilegeList';
// 添加权限
export const addPrivilege = '/admin/privilege/addPrivilege';
// 获取一级模块列表
export const queryTopMenuList = '/admin/privilege/queryTopMenuList';
// 新增功能模块
export const addFunctionModule = '/admin/privilege/addFunctionModule';

// 品牌产品管理
// 获取一二级类目列表
export const getCategoryList = '/admin/productCategory/queryProductCategoryPageList';
// 添加一二级类目
export const addCategory = '/admin/productCategory/addProductCategory';
// 编辑一二级类目
export const editCategory = '/admin/productCategory/updateProductCategory';
// 删除一二级类目
export const deleteCategory = 'admin/productCategory/updateProductCategoryDeleteById';
// 获取品牌列表
export const getBrandList = '/admin/brand/queryBrandPageList';
export const getFirstList = '/admin/productCategory/queryProductCategoryName';
export const getSecondList = '/admin/productCategory/queryProductCategoryFatherid';
// export const queryCategoryBrandCid='admin/categoryBrand/queryCategoryBrandCid';
// 添加品牌
export const addBrand = '/admin/brand/addBrand';
// 修改品牌
export const updateBrand = '/admin/brand/updateBrand';
// 删除品牌
export const deleteBrand = '/admin/brand/updateBrandDeleteById';
// 根据ID查找详情
export const findBrandById = '/admin/brand/findBrandById';
// 根据类目查询品牌列表
export const queryCategoryBrandCid = '/admin/categoryBrand/queryCategoryBrandCid';

// 上传图片、文件、音乐
// 上传文件
export const addFile = '/admin/ossClient/aliyunOSSUpload';
// 上传音乐
export const addMusic = '/admin/ossClient/aliyunOSSUploadMusic';
// 获取省、市、区
export const getProvinced = '/admin/area/getProvinceList';
export const getCity = '/admin/area/getCityList';
export const getArea = '/admin/area/getAreaList';

// 经销商层级管理
// 查询经销商层级列表
export const getDealerLevelList = '/admin/dealerLevel/getList';
// 添加经销商层级
export const addDealerLevel = '/admin/dealerLevel/addDealerLevel';
// 修改经销商层级
export const updateDealerLevel = '/admin/dealerLevel/updateDealerLevel';
// 根据id删除
export const deleteDealerLevelById = '/admin/dealerLevel/deleteDealerLevelById';
// 发起——邀请层级接口
export const getLevelListWithDealerCount = '/admin/dealerLevel/getLevelListWithDealerCount';
// 发起——授权渠道
export const getStatusONList = '/admin/permitChannel/getStatusONList';
// 发起——授权品牌
export const getList = '/admin/brand/getList';
// 发起——根据品牌获取品类
export const getProductCategoryList = '/admin/productCategory/queryProductCategoryByBrandId';
// 晋级设置
export const promotionManage = '/promotionManage';
// 降级设置
export const degradeManage = '/degradeManage';
// 经销商加盟管理
// 发起经销商接口
export const addInvite = '/admin/invite/addInvite';
// 经销商列表接口
export const getInvitePageList = '/admin/invite/queryInvitePageList';
// 查看用户邀请详情
export const findInviteInfo = '/admin/invite/findInviteInfo';
// 生成邀请二维码
export const createWxQrcode = '/admin/invite/createWxQrcode';

// 经销商会员管理

// 关闭用户
export const stopDealerById = '/admin/dealer/stopDealerById';
// 开启用户
export const openDealerById = '/admin/dealer/openDealerById';
// 导出
export const exportDealerListExcel = '/admin/dealer/exportDealerListExcel';
// 添加标签
export const addTagDealer = '/admin/tagDealer/addTagDealer';
// 删除标签
export const deleteTagDealer = '/admin/tagDealer/deleteTagDealer';

// 经销商账户信息
// 现金
export const queryDetailBalanceList = '/admin/detailBalance/queryDetailBalanceList';
// 代币
export const queryDetailTokencoinList = '/admin/detailTokenCoin/queryDetailTokenCoinList';
// 分红点
export const queryDetailBonuspointList = '/admin/detailBonusPoint/queryDetailBonusPointList';
// 积分
export const queryDetailUserscorePageList = '/admin/detailUserScore/queryDetailUserScorePageList';
// TA的账户
export const queryDealerAccount = '/admin/dealer/findDealerAccountById';
// 用户银行卡
export const findBindBankInfoBydealerId = '/admin/bindBankInfo/findBindBankInfoByDealerId';
// 删除用户银行卡
export const deleteBindBankInfo = 'admin/bindBankInfo/updateBindBankInfoDeleteById';
// 分页查询待提现账户收入明细
export const queySettlementTotalListByIncome = '/admin/settlementTotal/queySettlementTotalListByIncome';
// 分页查询积分账户收支明细
export const queySettlementTotalListByExpenditure = '/admin/settlementTotal/queySettlementTotalListByExpenditure';
// 分页查询收益账户收入明细列表
export const queySettlementTotalListByProfit = '/admin/settlementTotal/queySettlementTotalListByProfit';
// 分页查询收益账户支出明细列表
export const queyDetailTokenCoinListByProfit = '/admin/detailTokenCoin/queyDetailTokenCoinListByProfit';

// 账户充值
// 列表
export const queryRechargeRecordPageList = '/admin/rechargeRecord/queryRechargeRecordPageList';
// 通过手机号查询
export const findDealerByPhone = '/admin/rechargeRecord/findDealerByPhone';
// 账户充值
export const addRechargeRecord = '/admin/rechargeRecord/addRechargeRecord';
// 通过驳回
export const updateRechargeRecord = '/admin/rechargeRecord/updateRechargeRecord';

// 实名认证审核
// 实名审核列表
export const queryDealerRealnamePageList = '/admin/dealerRealName/queryDealerRealNamePageList';
// 查询详情
export const findDealerRealnameInfo = '/admin/dealerRealName/findDealerRealNameInfo';
// 驳回审核
export const dismissAudit = '/admin/dealerRealName/dismissAudit';

// 公告通知
// 公告列表
export const getNoticeList = '/admin/notice/queryNoticeList';
// 公告详情
export const getNoticeDetailById = '/admin/notice/findNoticeDetailById';
// 发布通知/公告
export const addNotice = '/admin/notice/addNotice';
// 修改公告/通知状态
export const updateNoticeStatus = '/admin/notice/updateNoticeStatus';
export const getDealerPageList = 'aa';
export const addTagLibrary = 'aa';
export const queryTagLibraryList = 'aa';
export const makeSureOrder = '/order/order/makeSureOrder';
//* ***************************************************************************************************************************************************************************
export const uploadImg = '/admin/common/upload/oss'; // 上传图片
export const addImg = '/common/upload/oss'; // 上传图片
export const queryConfig = ['/config/sysconfig/queryConfig', { methods: 'get' }]; // 查询系统配置
export const getAllProductCategory = ['/product/productCategory/queryList', { methods: 'post' }]; // 获取所有三级类目
export const getLoginCode = ['/sms/sendLoginMessage', { methods: 'get' }]; // 获取登录短信验证码
export const getCode = ['/sms/sendUpdateMessage', { methods: 'get' }]; // 获取修改密码短信验证码
export const homeData = ['/user/home', { methods: 'get' }]; // 首页数据列表
export const addOrModifyList = '/config/sysconfig/addOrModifyList'; // 批量新增系统配置
export const findAdminUserbyId = ['/adminUser/findAdminUserById', { methods: 'get' }]; // 获取管理员信息
export const loginByCode = '/adminLogin/codeLogin'; // 管理员手机号登录
export const loginByPwd = '/adminLogin/pswLogin'; // 管理员账号密码登录
export const updateDeleteAdminUser = ['/adminUser/updateDeleteAdminUser', { methods: 'get' }]; // 管理员账号关闭/开启
export const addManger = '/adminUser/addAdminUser'; // 添加管理员
export const updateAdminUser = ['/adminUser/updateAdminUser', { methods: 'post' }]; // 编辑管理员
export const getMangerList = '/adminUser/queryAdminUserPageList'; // 获取管理员列表
export const updateAdminUserPassword = '/adminUser/updateAdminUserPassword'; // 修改管理员密码
export const addOrModify = '/config/sysconfig/addOrModify'; // 新增修改系统配置
export const getRoleList = ['/privilege/queryPrivilegeList', { methods: 'get' }]; // 获取管理员权限列表
export const queryDepartmentList = ['/department/queryDepartmentList', { methods: 'get' }]; // 获取岗位列表
export const queryJobList = ['/role/queryJobList', { methods: 'get' }]; // 查询岗位列表
export const queryVersionRecordPageList = '/config/sysAppVersion/queryList';// 获取版本列表信息
export const addVersionRecord = '/config/sysAppVersion/add';// 新增版本信息
export const updateVersionRecord = '/config/sysAppVersion/update';// 编辑版本信息
export const deleteVersionRecord = ['/config/sysAppVersion/deleteById', { methods: 'get' }];// 删除版本信息
export const getRegion = ['/config/sysArea/queryAreaList', { methods: 'get' }]; // 查询省市区
export const getUserLevelList = ['/user/getLevelList', { methods: 'get' }]; // 查询会员层级
export const queryAdminUserList = '/adminUser/queryAdminUserList'; // 查询会员层级
export const loginUpdateCheckCode = '/adminUser/verifySmsCode'; // 首次登录修改密码验证码校验
export const loginUpdatePassword = '/adminUser/firstLoginUpdate'; // 首次登录修改密码
export const queryMessagePage = '/notice/queryMessagePage'; // 获取消息列表
export const queryNewMessageCount = ['/notice/queryNewMessageCount', { methods: 'get' }]; // 获取未读消息数量
export const readMessages = ['/notice/readMessages', { methods: 'get' }]; // 批量标记已读信息
// 获取数据字典列表
export const queryDictionaryDetailsType = ['/config/dictionary/queryDictionaryTypeList', { methods: 'get' }];
// 问题反馈
// 反馈列表
export const queryFeedbackList = '/userFeedback/queryFeedbackList';
// 问题详情
export const findFeedbackById = ['/userFeedback/findFeedbackDetailById', { methods: 'get' }];
// 修改反馈详情
export const updateFeedback = '/userFeedback/updateDetailById';
// 券数据导出
export const downloadCouponList = '/admin/user/coupon/downloadCouponList';
// 添加岗位
export const addRole = '/role/addRole';
// 根据id查询岗位
export const findRoleById = ['/role/findRoleById', { methods: 'get' }];
// 修改岗位
export const updateRole = '/role/updateRole';
// 删除岗位
export const updateDeleteRole = ['/role/updateDeleteRole', { methods: 'get' }];
// 添加部门
export const addDepartment = '/department/addDepartment';
// 根据id查询部门
export const findDepartmentById = '/department/findDepartmentById';
// 编辑部门
export const updateDepartment = '/department/updateDepartment';

// 物流公司查询
export const sysExpressQuery = ['/config/sysExpress/query', { methods: 'get' }];
// 停用某物流公司
export const disableExpress = ['/config/sysExpress/disable', { methods: 'get' }];
// 启用某物流公司
export const enableExpress = ['/config/sysExpress/enable', { methods: 'get' }];
// 添加物流公司
export const addExpress = ['/config/sysExpress/save', { methods: 'post' }];
// 更新物流公司
export const updateExpress = ['/config/sysExpress/edit', { methods: 'post' }];

// ERP接口
export const updateERPstatus = ['/config/erp/change', { methods: 'get' }];
export const updateERP = '/config/erp/save';
export const addERP = '/config/erp/save';
export const getERPList = ['/config/erp/query', { methods: 'get' }];
export const getERP = ['/config/erp/get', { methods: 'get' }];

// 导出
export const downloadOrderList = '/admin/orderManagement/orders/export';
