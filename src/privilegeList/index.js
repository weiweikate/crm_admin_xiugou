// 系统首页
        export const dashboard = '/dashboard';
//广告位管理
        export const advertisingManage = '/advertisingManage';
// 授权管理
    // 添加渠道类目
        // 查看渠道类目管理列表
        export const channelItemManage = '/channelItemManage';
        // 添加一级渠道类目
        export const addPermitChannel_1 = '/admin/permitChannel/addPermitChannel_1';
        // 编辑一级渠道类目
        export const updatePermitChannel_1 = '/admin/permitChannel/updatePermitChannel_1';
        // 删除一级级渠道类目
        export const updatePermitChannel_4 = '/admin/permitChannel/updatePermitChannel_4'
        // 添加二级渠道类目
        export const addPermitChannel_2 = '/admin/permitChannel/addPermitChannel_2';
        // 编辑二级渠道类目
        export const updatePermitChannel_2 = '/admin/permitChannel/updatePermitChannel_2';
        // 删除二级渠道类目
        export const updatePermitChannel_3 = '/admin/permitChannel/updatePermitChannel_3'
// 溯源管理
    // 防伪码管理
        // 查看防伪码管理列表
        export const getRecordPage = '/securityCode/securityCodeRecord/getRecordPage';
        // 生成防伪码
        export const productionSecurityCode = '/securityCode/securityCodeRecord/productionSecurityCode'
        // 导出防伪码
        export const exportSecurityCode = '/securityCode/securityCodeRecord/exportSecurityCode';
        // 修改防伪码状态
        export const updateCodeStatus = '/securityCode/securityCodeRecord/updateStatus';
    // 防伪码查询
        // 防伪码查询列表
    // 防伪码模板
        // 查看防伪码模板列表
        export const securityCodeTemplate = '/admin/securityCodeTemplate/getAll'
        // 添加模板
        export const addCodeTemplate = '/admin/securityCodeTemplate/add';
        // 编辑模板
        export const updateCodeTemplate = '/admin/securityCodeTemplate/updateById';
        // 删除摸板
        export const deleteCodeTemplate = '/admin/securityCodeTemplate/deleteById';
        // 失效模板
        export const loseCodeTemplate = '/admin/securityCodeTemplate/loseById';
    // 防伪码参数设置
        // 防伪码参数列表
        export const getAllCategoryBrand = '/admin/categoryBrand/getAllCategoryBrand';
        // 新增参数
        export const addCategoryBrandCode = '/admin/categoryBrand/addCategoryBrandCode';
        // 生成防伪码全码
        export const productAllCode = '/securityCode/securityCode/productAllCode';
        // 失效编码
        export const loseCategoryBrandCode = '/admin/categoryBrand/loseCategoryBrandCode';
// 权限管理
    // 组织结构管理
        // 获取部门列表
        export const queryDepartmentList = '/admin/role/queryDepartmentList';
        // 添加部门
        export const addDepartment = '/admin/department/addDepartment';
        // 编辑部门
        export const updateDepartment = '/admin/department/updateDepartment';
    // 管理员账号管理
        // 管理员账号管理列表
        export const manageList = '/manageList';
        // 新建管理员
        export const addAdminUser = '/admin/adminUser/addAdminUser'
        // 编辑管理员
        export const updateAdminUser = '/admin/adminUser/updateAdminUser'
        // 密码重置
        export const resetPassword = '/admin/adminUser/resetPassword'
        // 查看日志
        export const showAdminLog = '/admin/logAdminuser/getPage'
        // 账号开启、关闭
        export const updateAdminUserStatus = '/admin/adminUser/updateAdminUserStatus'
        // 账号删除
        export const deleteAdminUser = '/admin/adminUser/deleteAdminUser'
    // 岗位权限管理
        // 岗位权限管理列表
        export const jobsPermissionMange = '/jobsPermissionMange';
        // 添加岗位
        export const addRole = '/admin/role/addRole';
        // 编辑岗位
        export const updateRole = '/admin/role/updateRole';
        // 删除岗位
        export const deleteRole = '/admin/role/deleteRole';
    // 权限设置
        // 权限管理列表
        export const setPermission = '/setPermission';
        // 新增功能模块
        export const addFunctionModule = '/admin/privilege/addFunctionModule';
        // 添加权限
        export const addPrivilege = '/admin/privilege/addPrivilege';
    // 修改信息
        // 管理员基础信息修改
        export const editMangerMsg = '/editMangerMsg';
        export const updateAdminUserFace = '/admin/adminUser/updateAdminUserFace'
        export const updateAdminUserPassword = '/admin/adminUser/updateAdminUserPassword';
    // 版本迭代管理
        export const versionIteration = '/versionIteration';
// 品牌产品管理
    // 产品分类管理
        // 查看一级类目列表
        export const queryProductCategoryPageList_1 = '/admin/productCategory/queryProductCategoryPageList_1';
        // 查看二级类目列表
        export const queryProductCategoryPageList_2 = '/admin/productCategory/queryProductCategoryPageList_2';
        // 添加一级类目
        export const addProductCategory_1 = '/admin/productCategory/addProductCategory';
        // 编辑一级类目
        export const updateProductCategory_1 = '/admin/productCategory/updateProductCategory';
        // 删除一级类目
        export const deleteProductCategory_1 = '/admin/productCategory/deleteProductCategory';
        // 添加二级类目
        export const addProductCategory_2 = '/admin/productCategory/addProductCategory_2';
        // 编辑二级类目
        export const updateProductCategory_2 = '/admin/productCategory/updateProductCategory_2';
        // 删除二级类目
        export const deleteProductCategory_2 = '/admin/productCategory/deleteProductCategory_2';
    // 品牌管理
        // 查看品牌列表
        export const queryBrandPageList = '/admin/brand/queryBrandPageList';
        // 添加品牌
        export const addBrand = '/admin/brand/addBrand';
        // 编辑品牌
        export const updateBrand='/admin/brand/updateBrand';
        // 删除品牌
        export const deleteBrand='/admin/brand/deleteBrand';
//经销商层级管理
        // 查询经销商层级列表
        export const getDealerLevelList='/admin/dealerLevel/getList';
        // 添加经销商层级
        export const addDealerLevel='/admin/dealerLevel/addDealerLevel';
        // 修改经销商层级
        export const updateDealerLevel='/admin/dealerLevel/updateDealerLevel';
        // 根据id删除
        export const deleteDealerLevelById='/admin/dealerLevel/deleteDealerLevelById';
        // 晋级设置
        export const promotionManage = '/promotionManage';
        // 降级设置
        export const degradeManage = '/degradeManage';
//经销商加盟管理
        //经销商列表接口
        export const getInvitePageList='/admin/invite/queryInvitePageList';
        //发起经销商接口
        export const addInvite='/admin/invite/addInvite';
        //查看用户邀请详情
        export const findInviteInfo='/admin/invite/findInviteInfo';


// 经销商会员管理
    //会员列表
    export const getDealerPageList='/admin/dealer/queryDealerPageList';
    //会员详情
    export const findDealerById='/admin/dealer/findDealerById';
    //修改授权信息
    export const updateDealerPermitById='/admin/dealer/updateDealerPermitById';
    //根据id修改经销商信息
    export const updateDealerById='/admin/dealer/updateDealerById';
    //关闭用户
    export const stopDealerById='/admin/dealer/stopDealerById';
    //开启用户
    export const openDealerById='/admin/dealer/openDealerById';
    //导出
    export const exportDealerListExcel='/admin/dealer/exportDealerListExcel';
    //用户的树状结构
    export const findDealerTreeById='/admin/dealer/findDealerTreeById';
    // 用户操作日志
    export const operateLog = '/operateLog';

//经销商账户信息
    //现金
    export const queryDetailBalanceList='/admin/detailBalance/queryDetailBalanceList';
    //代币
    export const queryDetailTokencoinList='/admin/detailTokencoin/queryDetailTokencoinList';
    //分红点
    export const queryDetailBonuspointList='/admin/detailBonuspoint/queryDetailBonuspointList';
    //积分
    export const queryDetailUserscorePageList='/admin/detailUserscore/queryDetailUserscorePageList';
    // TA的账户
    export const queryDealerAccount='/admin/dealer/queryDealerAccount';

//账户充值
    //列表
    export const queryRechargeRecordPageList='/admin/rechargeRecord/queryRechargeRecordPageList';
    //通过手机号查询
    export const findDealerByPhone='/admin/rechargeRecord/findDealerByPhone';
    //账户充值
    export const addRechargeRecord='/admin/rechargeRecord/addRechargeRecord';
    //通过驳回
    export const updateRechargeRecord='/admin/rechargeRecord/updateRechargeRecord';

// 实名认证审核
    //实名审核列表
    export const queryDealerRealnamePageList='/admin/dealerRealName/queryDealerRealNamePageList';
    //查询详情
    export const findDealerRealnameInfo='/admin/dealerRealname/findDealerRealnameInfo';
    export const findDealerRealnameInfo_1='/admin/dealerRealname/findDealerRealnameInfo_1';
    // 驳回审核
    export const dismissAudit = '/admin/dealerRealName/dismissAudit';

// 公告通知
    // 公告列表
    export const getNoticeList='/admin/notice/queryNoticeList';
    //发布通知/公告
    export const addNotice='/admin/notice/addNotice';
    // 公告详情
    export const getNoticeDetailById='/admin/notice/findNoticeDetailById';
    // 再次推送
    export const updateNoticeStatus_1='/admin/notice/updateNoticeStatus_1';
    // 取消推送
    export const updateNoticeStatus_2='/admin/notice/updateNoticeStatus_2';
    // 删除
    export const updateNoticeStatus_3='/admin/notice/updateNoticeStatus_3';

// 问题反馈
    // 反馈列表
    export const feedbackList='/admin/feedback/queryFeedbackList';
    // 问题详情
    export const feedbackDetail='/admin/feedback/findFeedbackByid';
    //修改问题类型
    export const updateFeedback='/admin/feedback/updateFeedback';
    //回复
    export const updateFeedback_2='/admin/feedback/updateFeedback_2';




