import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children: [
                {
                    name: 'dashboard',
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页', url: '/dashboard' }
                },
                {
                    name: 'message',
                    path: '/message',
                    component: resolve => require(['../components/page/Dashboard/message.vue'], resolve),
                    meta: { title: '全部消息', url: '/message' }
                },
                // 授权管理
                {
                    name: 'channelItemManage',
                    path: '/channelItemManage',
                    component: resolve => require(['../components/page/Authorization/ChannelItemManage.vue'], resolve),
                    meta: { title: '渠道类目管理', url: '/channelItemManage' }
                },
                {
                    name: 'secondChannel',
                    path: '/secondChannel',
                    component: resolve => require(['../components/page/Authorization/SecondChannel.vue'], resolve),
                    meta: { title: '二级渠道', url: '/admin/permitChannel/addPermitChannel_2' }
                },
                {
                    name: 'certificateUse',
                    path: '/certificateUse',
                    component: resolve => require(['../components/page/Authorization/CertificateUse.vue'], resolve),
                    meta: { title: '授权证书模板', url: '/certificateUse' }
                },
                {
                    name: 'contractReview',
                    path: '/contractReview',
                    component: resolve => require(['../components/page/Authorization/ContractReview.vue'], resolve),
                    meta: { title: '续约审核', url: '/contractReview' }
                },
                // 品牌产品管理
                {
                    name: 'brandProductClassify',
                    path: '/brandProductClassify',
                    component: resolve => require(['../components/page/BrandProduct/BrandProductClassify.vue'], resolve),
                    meta: { title: '产品品牌分类管理', url: '/admin/productCategory/queryProductCategoryPageList_1' }
                },
                {
                    name: 'secondClassify',
                    path: '/secondClassify',
                    component: resolve => require(['../components/page/BrandProduct/SecondClassify.vue'], resolve),
                    meta: { title: '二级类目', url: '/admin/productCategory/queryProductCategoryPageList_2' }
                },
                {
                    name: 'thirdClassify',
                    path: '/thirdClassify',
                    component: resolve => require(['../components/page/BrandProduct/ThirdClassify.vue'], resolve),
                    meta: { title: '三级类目', url: '/admin/productCategory/queryProductCategoryPageList_2' }
                },
                {
                    name: 'hotClassifyManage',
                    path: '/hotClassifyManage',
                    component: resolve => require(['../components/page/BrandProduct/HotClassifyManage/HotClassifyManage.vue'], resolve),
                    meta: { title: '热门分类管理', url: '/admin/productCategory/queryProductCategoryPageList_2' }
                },
                {
                    name: 'productDetailParam',
                    path: '/productDetailParam',
                    component: resolve => require(['../components/page/BrandProduct/ProductDetailParam.vue'], resolve),
                    meta: { title: '产品详细参数', url: '/admin/productCategory/queryProductCategoryPageList_2' }
                },
                {
                    name: 'brandManage',
                    path: '/brandManage',
                    component: resolve => require(['../components/page/BrandProduct/BrandManage.vue'], resolve),
                    meta: { title: '品牌管理', url: '/admin/brand/queryBrandPageList' }
                },
                {
                    name: 'addBrand',
                    path: '/addBrand',
                    component: resolve => require(['../components/page/BrandProduct/BrandManage/AddBrand.vue'], resolve),
                    meta: { title: '添加品牌', url: '/admin/brand/addBrand' }
                },
                {
                    name: 'editBrand',
                    path: '/editBrand',
                    component: resolve => require(['../components/page/BrandProduct/BrandManage/EditBrand.vue'], resolve),
                    meta: { title: '编辑品牌', url: '/admin/brand/updateBrand' }
                },
                {
                    name: 'shippingTemplate',
                    path: '/shippingTemplate',
                    component: resolve => require(['../components/page/BrandProduct/ShippingTemplate.vue'], resolve),
                    meta: { title: '运费模板', url: '/admin/freightTemplate/queryFreightTemplateList' }
                },
                {
                    name: 'addTemplate',
                    path: '/addTemplate',
                    component: resolve => require(['../components/page/BrandProduct/ShippingTemplate/AddTemplate.vue'], resolve),
                    meta: { title: '添加模板', url: '/admin/freightTemplate/addFreightTemplate' }
                },
                {
                    name: 'editTemplate',
                    path: '/editTemplate',
                    component: resolve => require(['../components/page/BrandProduct/ShippingTemplate/EditTemplate.vue'], resolve),
                    meta: { title: '编辑模板', url: '/admin/freightTemplate/updateFreightTemplateById' }
                },
                {
                    name: 'giftManage',
                    path: '/giftManage',
                    component: resolve => require(['../components/page/BrandProduct/GiftManage/GiftManage.vue'], resolve),
                    meta: { title: '礼包管理', url: '/admin/giftBag/queryGiftBagPageList' }
                },
                {
                    name: 'addGift',
                    path: '/addGift',
                    component: resolve => require(['../components/page/BrandProduct/GiftManage/AddGift.vue'], resolve),
                    meta: { title: '发布礼包', url: '/admin/giftBag/addGiftBag' }
                },
                {
                    name: 'editGift',
                    path: '/editGift',
                    component: resolve => require(['../components/page/BrandProduct/GiftManage/EditGift.vue'], resolve),
                    meta: { title: '编辑礼包', url: '/admin/giftBag/updateGiftBag' }
                },
                {
                    name: 'priceOfInventory',
                    path: '/priceOfInventory',
                    component: resolve => require(['../components/page/BrandProduct/GiftManage/PriceOfInventory.vue'], resolve),
                    meta: { title: '价格库存管理', url: '/admin/giftBag/queryReferencePrice' }
                },
                {
                    name: 'giftProductMange',
                    path: '/giftProductMange',
                    component: resolve => require(['../components/page/BrandProduct/GiftManage/GiftProductMange.vue'], resolve),
                    meta: { title: '礼包产品管理', url: '/admin/giftBag/findProductInfo' }
                },
                {
                    name: 'addStock',
                    path: '/addStock',
                    component: resolve => require(['../components/page/BrandProduct/GiftManage/addStock.vue'], resolve),
                    meta: { title: '添加库存', url: '/admin/giftBag/addStock' }
                },
                {
                    name: 'giftInfo',
                    path: '/giftInfo',
                    component: resolve => require(['../components/page/BrandProduct/GiftManage/GiftInfo.vue'], resolve),
                    meta: { title: '礼包详情', url: '/admin/giftBag/getGiftBagDetail' }
                },
                {
                    name: 'discountAdd',
                    path: '/discountAdd',
                    component: resolve => require(['../components/page/BrandProduct/GiftManage/DiscountAdd.vue'], resolve),
                    meta: { title: '优惠券管理', url: '/admin/giftBag/couponControl' }
                },
                // 拼店店铺管理
                {
                    name: 'shopLevelSet',
                    path: '/shopLevelSet',
                    component: resolve => require(['../components/page/SpellShopManage/ShopLevel/ShopLevelSet.vue'], resolve),
                    meta: { title: '店铺等级设置', url: '/admin/storeStar/getAllStoreStar' }
                },
                {
                    name: 'reportSpellShop',
                    path: '/reportSpellShop',
                    component: resolve => require(['../components/page/SpellShopManage/reportSpellShop/ReportSpellShop.vue'], resolve),
                    meta: { title: '拼店店铺举报', url: '/admin/storeReport/queryStoreReportPageList' }
                },
                {
                    name: 'promotionShop',
                    path: '/promotionShop',
                    component: resolve => require(['../components/page/SpellShopManage/ShopLevel/PromotionShop.vue'], resolve),
                    meta: { title: '店铺晋升设置', url: '/promotionShop' }
                },
                {
                    name: 'demotionShop',
                    path: '/demotionShop',
                    component: resolve => require(['../components/page/SpellShopManage/ShopLevel/DemotionShop.vue'], resolve),
                    meta: { title: '店铺降级设置', url: '/demotionShop' }
                },
                {
                    name: 'shopList',
                    path: '/shopList',
                    component: resolve => require(['../components/page/SpellShopManage/ShopManage/ShopList.vue'], resolve),
                    meta: { title: '店铺列表', url: '/admin/store/getStorePageList' }
                },
                {
                    name: 'shopInfo',
                    path: '/shopInfo',
                    component: resolve => require(['../components/page/SpellShopManage/ShopManage/ShopInfo.vue'], resolve),
                    meta: { title: '店铺详情', url: '/admin/store/getStoreDetail' }
                },
                {
                    name: 'spellShopAccount',
                    path: '/spellShopAccount',
                    component: resolve => require(['../components/page/SpellShopManage/ShopManage/SpellShopAccount.vue'], resolve),
                    meta: { title: '拼店账户' }
                },
                {
                    name: 'shopMemberManage',
                    path: '/shopMemberManage',
                    component: resolve => require(['../components/page/SpellShopManage/ShopManage/MemberManage.vue'], resolve),
                    meta: { title: '成员管理', url: '/admin/storeUser/getStoreMembers' }
                },
                {
                    name: 'shareBonusInfo',
                    path: '/shareBonusInfo',
                    component: resolve => require(['../components/page/SpellShopManage/ShopManage/ShareBonusInfo.vue'], resolve),
                    meta: { title: '分红详情', url: '/admin/storeBonus/getStoreBonusPageList' }
                },
                {
                    name: 'shareBonusCom',
                    path: '/shareBonusCom',
                    component: resolve => require(['../components/page/SpellShopManage/ShopManage/ShareBonusCom.vue'], resolve),
                    meta: { title: '分红详情' }
                },
                {
                    name: 'shopAnnouncement',
                    path: '/shopAnnouncement',
                    component: resolve => require(['../components/page/SpellShopManage/ShopManage/ShopAnnouncement.vue'], resolve),
                    meta: { title: '店铺公告', url: '/admin/storeNotice/queryStoreNoticeList' }
                },
                {
                    name: 'tradeInfo',
                    path: '/tradeInfo',
                    component: resolve => require(['../components/page/SpellShopManage/ShopManage/TradeInfo.vue'], resolve),
                    meta: { title: '账户交易明细' }
                },
                {
                    name: 'recruitShopManage',
                    path: '/recruitShopManage',
                    component: resolve => require(['../components/page/SpellShopManage/RecruitShopManage/RecruitShopManage.vue'], resolve),
                    meta: { title: '招募店铺管理', url: '/admin/store/getRecruitmentStorePageList' }
                },
                {
                    name: 'recruitShopInfo',
                    path: '/recruitShopInfo',
                    component: resolve => require(['../components/page/SpellShopManage/RecruitShopManage/RecruitShopInfo.vue'], resolve),
                    meta: { title: '招募店铺详情', url: '/admin/store/getRecruitmentStoreDetail' }
                },
                // 会员管理
                {
                    name: 'levelManage',
                    path: '/levelManage',
                    component: resolve => require(['../components/page/MemberManage/LevelManage.vue'], resolve),
                    meta: { title: '会员层级管理', url: '/admin/dealerLevel/getList' }
                },
                {
                    name: 'LevelInfo',
                    path: '/LevelInfo',
                    component: resolve => require(['../components/page/MemberManage/LevelManage/LevelInfo.vue'], resolve),
                    meta: { title: '层级信息', url: '/admin/dealerLevel/getList' }
                },
                {
                    name: 'joinManage',
                    path: '/joinManage',
                    component: resolve => require(['../components/page/MemberManage/JoinManage.vue'], resolve),
                    meta: { title: '会员加盟管理', url: '/admin/invite/queryInvitePageList' }
                },
                {
                    name: 'memberManage',
                    path: '/memberManage',
                    component: resolve => require(['../components/page/MemberManage/MemberManage.vue'], resolve),
                    meta: { title: '会员管理', url: '/admin/dealer/queryDealerPageList' }
                },
                {
                    name: 'lowerMemberManage',
                    path: '/lowerMemberManage',
                    component: resolve => require(['../components/page/MemberManage/MemberManage/LowerMemberManage.vue'], resolve),
                    meta: { title: '下级代理', url: '/admin/dealer/queryDealerPageList' }
                },
                {
                    name: 'MemberAccount',
                    path: '/MemberAccount',
                    component: resolve => require(['../components/page/MemberManage/MemberManage/MemberAccount.vue'], resolve),
                    meta: { title: '会员账户', url: '/admin/dealer/queryDealerAccount' }
                },
                {
                    name: 'MemberCard',
                    path: '/MemberCard',
                    component: resolve => require(['../components/page/MemberManage/MemberManage/MemberCard.vue'], resolve),
                    meta: { title: '会员银行卡', url: '/admin/bindBankInfo/findBindBankInfoBydealerId' }
                },
                {
                    name: 'memberDetail',
                    path: '/memberDetail',
                    component: resolve => require(['../components/page/MemberManage/MemberManage/MemberDetail.vue'], resolve),
                    meta: { title: '会员详情', url: '/admin/dealer/findDealerById' }
                },
                {
                    name: 'memberTree',
                    path: '/memberTree',
                    component: resolve => require(['../components/page/MemberManage/MemberManage/MemberTree.vue'], resolve),
                    meta: { title: '会员树状图', url: '/admin/dealer/findDealerTreeById' }
                },
                {
                    name: 'showMsg',
                    path: '/showMsg',
                    component: resolve => require(['../components/page/MemberManage/MemberManage/showMsg.vue'], resolve),
                    meta: { title: '店铺信息', url: '/admin/dealer/showMsg' }
                },
                {
                    name: 'sendInvite',
                    path: '/sendInvite',
                    component: resolve => require(['../components/page/MemberManage/JoinManage/SendInvite.vue'], resolve),
                    meta: { title: '邀请发起', url: '/admin/invite/addInvite' }
                },
                {
                    name: 'inviteDetail',
                    path: '/inviteDetail',
                    component: resolve => require(['../components/page/MemberManage/JoinManage/InviteDetail.vue'], resolve),
                    meta: { title: '邀请详情', url: '/admin/invite/findInviteInfo' }
                },
                {
                    name: 'inviteLink',
                    path: '/inviteLink',
                    component: resolve => require(['../components/page/MemberManage/JoinManage/InviteLink.vue'], resolve),
                    meta: { title: '邀请链接', url: '/inviteLink' }
                },
                {
                    name: 'operateLog',
                    path: '/operateLog',
                    component: resolve => require(['../components/page/MemberManage/OperateLog/OperateLog.vue'], resolve),
                    meta: { title: '查看会员操作日志', url: '/operateLog' }
                },
                {
                    name: 'cashAccountBalance',
                    path: '/cashAccountBalance',
                    component: resolve => require(['../components/page/MemberManage/UserAccount/CashAccountBalance.vue'], resolve),
                    meta: { title: '现金账户收支明细', url: '/admin/detailBalance/queryDetailBalanceList' }
                },
                {
                    name: 'tokenAccountBalance',
                    path: '/tokenAccountBalance',
                    component: resolve => require(['../components/page/MemberManage/UserAccount/TokenAccountBalance.vue'], resolve),
                    meta: { title: '代币账户收支明细', url: '/admin/detailTokencoin/queryDetailTokencoinList' }
                },
                {
                    name: 'shareAccountBalance',
                    path: '/shareAccountBalance',
                    component: resolve => require(['../components/page/MemberManage/UserAccount/ShareAccountBalance.vue'], resolve),
                    meta: { title: '分红账户收支明细', url: '/admin/detailBonuspoint/queryDetailBonuspointList' }
                },
                {
                    name: 'integralAccountBalance',
                    path: '/integralAccountBalance',
                    component: resolve => require(['../components/page/MemberManage/UserAccount/IntegralAccountBalance.vue'], resolve),
                    meta: { title: '积分账户收支明细', url: '/admin/detailUserscore/queryDetailUserscorePageList' }
                },
                {
                    name: 'withDrawAccount',
                    path: '/withDrawAccount',
                    component: resolve => require(['../components/page/MemberManage/UserAccount/WithDrawAccount.vue'], resolve),
                    meta: { title: '待提现账户', url: '/withDrawAccount' }
                },
                {
                    name: 'accountRecharge',
                    path: '/accountRecharge',
                    component: resolve => require(['../components/page/MemberManage/AccountRecharge.vue'], resolve),
                    meta: { title: '账户充值', url: '/admin/rechargeRecord/queryRechargeRecordPageList' }
                },
                {
                    name: 'realNameInfo',
                    path: '/realNameInfo',
                    component: resolve => require(['../components/page/MemberManage/RealNameInfo.vue'], resolve),
                    meta: { title: '实名信息', url: '/admin/dealerRealName/findDealerRealNameInfo' }
                },
                {
                    name: 'realNameAuthentication',
                    path: '/realNameAuthentication',
                    component: resolve => require(['../components/page/MemberManage/realNameAuthentication.vue'], resolve),
                    meta: { title: '实名认证审核', url: '/admin/dealerRealName/queryDealerRealNamePageList' }
                },
                {
                    name: 'activityParams',
                    path: '/activityParams',
                    component: resolve => require(['../components/page/MemberManage/activityParams.vue'], resolve),
                    meta: { title: '活跃度参数设置' }
                },
                {
                    name: 'supplierManage',
                    path: '/supplierManage',
                    component: resolve => require(['../components/page/MemberManage/SupplierManage.vue'], resolve),
                    meta: { title: '供应商管理', url: '/admin/supplier/querySupplierPageList' }
                },
                {
                    name: 'supplierDetail',
                    path: '/supplierDetail',
                    component: resolve => require(['../components/page/MemberManage/SupplierManage/SupplierDetail.vue'], resolve),
                    meta: { title: '供应商详情', url: '/admin/supplier/findSupplierById' }
                },
                {
                    name: 'addSupplier',
                    path: '/addSupplier',
                    component: resolve => require(['../components/page/MemberManage/SupplierManage/AddSupplier.vue'], resolve),
                    meta: { title: '添加供应商', url: '/admin/supplier/addSupplier' }
                },
                {
                    name: 'editSupplier',
                    path: '/editSupplier',
                    component: resolve => require(['../components/page/MemberManage/SupplierManage/EditSupplier.vue'], resolve),
                    meta: { title: '编辑供应商', url: '/admin/supplier/updateSupplier' }
                },
                {
                    name: 'promotionManage',
                    path: '/promotionManage',
                    component: resolve => require(['../components/page/MemberManage/PromotionManage.vue/PromotionManage.vue'], resolve),
                    meta: { title: '晋升设置', url: '/promotionManage' }
                },
                {
                    name: 'degradeManage',
                    path: '/degradeManage',
                    component: resolve => require(['../components/page/MemberManage/DegradeManage.vue/DegradeManage.vue'], resolve),
                    meta: { title: '降级设置', url: '/degradeManage' }
                },
                {
                    name: 'productList',
                    path: '/productList',
                    component: resolve => require(['../components/page/BrandProduct/ProductManage/ProductList.vue'], resolve),
                    meta: { title: '产品管理', url: '/admin/product/queryProductPageList' }
                },
                {
                    name: 'releaseProduct',
                    path: '/releaseProduct',
                    component: resolve => require(['../components/page/BrandProduct/ProductManage/ReleaseProduct.vue'], resolve),
                    meta: { title: '发布产品', url: '/admin/product/addProduct' }
                },
                {
                    name: 'editProduct',
                    path: '/editProduct',
                    component: resolve => require(['../components/page/BrandProduct/ProductManage/EditProduct.vue'], resolve),
                    meta: { title: '编辑产品', url: '/admin/product/findProductAllDataById' }
                },
                {
                    name: 'productSpecifications',
                    path: '/productSpecifications',
                    component: resolve => require(['../components/page/BrandProduct/ProductManage/ProductSpecifications.vue'], resolve),
                    meta: { title: '产品规格', url: '/admin/saleSpec/querySaleSpecList' }
                },
                {
                    name: 'productInfo',
                    path: '/productInfo',
                    component: resolve => require(['../components/page/BrandProduct/ProductManage/ProductInfo.vue'], resolve),
                    meta: { title: '产品详情', url: '/admin/product/findProductById' }
                },
                {
                    name: 'priceManage',
                    path: '/priceManage',
                    component: resolve => require(['../components/page/BrandProduct/ProductManage/PriceManage.vue'], resolve),
                    meta: { title: '产品价格管理', url: '/admin/price/queryProductPriceSaleSpecList' }
                },
                {
                    name: 'productInventory',
                    path: '/productInventory',
                    component: resolve => require(['../components/page/BrandProduct/ProductManage/ProductInventory.vue'], resolve),
                    meta: { title: '产品库存管理', url: '/admin/price/queryProductStockList' }
                },

                // 服务管理
                {
                    name: 'noticeInformManage',
                    path: '/noticeInformManage',
                    component: resolve => require(['../components/page/OperateManage/NoticeInformManage/NoticeInformManage.vue'], resolve),
                    meta: { title: '公告通知管理', url: '/admin/notice/queryNoticeList' }
                },
                {
                    name: 'addNoticeInform',
                    path: '/addNoticeInform',
                    component: resolve => require(['../components/page/OperateManage/NoticeInformManage/AddNoticeInform.vue'], resolve),
                    meta: { title: '发布通知/公告', url: '/admin/notice/addNotice' }
                },
                {
                    name: 'noticeInformDetail',
                    path: '/noticeInformDetail',
                    component: resolve => require(['../components/page/OperateManage/NoticeInformManage/NoticeInformDetail.vue'], resolve),
                    meta: { title: '通知/公告详情', url: '/admin/notice/findNoticeDetailById' }
                },
                {
                    name: 'editNotice',
                    path: '/editNotice',
                    component: resolve => require(['../components/page/OperateManage/NoticeInformManage/EditNotice.vue'], resolve),
                    meta: { title: '编辑公告', url: '/admin/notice/findNoticeDetailById' }
                },
                {
                    name: 'feedBack',
                    path: '/feedBack',
                    component: resolve => require(['../components/page/ServiceManage/FeedBack.vue'], resolve),
                    meta: { title: '问题反馈', url: '/admin/feedback/queryFeedbackList' }
                },
                {
                    name: 'feedDetail',
                    path: '/feedDetail',
                    component: resolve => require(['../components/page/ServiceManage/FeedBack/FeedbackDetail.vue'], resolve),
                    meta: { title: '问题详情', url: '/admin/feedback/findFeedbackByid' }
                },
                // 溯源管理
                {
                    name: 'rootsCodeMange',
                    path: '/rootsCodeMange',
                    component: resolve => require(['../components/page/RootsMange/RootsCodeMange.vue'], resolve),
                    meta: { title: '溯源防伪码管理', url: '/securityCode/securityCodeRecord/getRecordPage' }
                },
                {
                    name: 'rootsCodeQuery',
                    path: '/rootsCodeQuery',
                    component: resolve => require(['../components/page/RootsMange/RootsCodeQuery.vue'], resolve),
                    meta: { title: '防伪码查询' }
                },
                {
                    name: 'rootsCodeTpl',
                    path: '/rootsCodeTpl',
                    component: resolve => require(['../components/page/RootsMange/RootsCodeTpl.vue'], resolve),
                    meta: { title: '防伪码模板', url: '/admin/securityCodeTemplate/getAll' }
                },
                {
                    name: 'rootsCodeParams',
                    path: '/rootsCodeParams',
                    component: resolve => require(['../components/page/RootsMange/RootsCodeParams.vue'], resolve),
                    meta: { title: '防伪码参数设置', url: '/admin/categoryBrand/getAllCategoryBrand' }
                },
                // 权限管理
                {
                    name: 'manageList',
                    path: '/manageList',
                    component: resolve => require(['../components/page/Permission/ManageList.vue'], resolve),
                    meta: { title: '账号管理', url: '/manageList' }
                },
                {
                    name: 'addManger',
                    path: '/addManger',
                    component: resolve => require(['../components/page/Permission/AddManger.vue'], resolve),
                    meta: { title: '添加管理员', url: '/admin/adminUser/addAdminUser' }
                },
                {
                    name: 'editManger',
                    path: '/editManger',
                    component: resolve => require(['../components/page/Permission/EditManger.vue'], resolve),
                    meta: { title: '编辑管理员', url: '/admin/adminUser/updateAdminUser' }
                },
                {
                    name: 'showMangeLog',
                    path: '/showMangeLog',
                    component: resolve => require(['../components/page/Permission/ShowMangeLog.vue'], resolve),
                    meta: { title: '操作日志', url: '/admin/logAdminuser/getPage' }
                },
                {
                    name: 'jobsPermissionMange',
                    path: '/jobsPermissionMange',
                    component: resolve => require(['../components/page/Permission/JobsPermissionMange.vue'], resolve),
                    meta: { title: '岗位权限管理', url: '/jobsPermissionMange' }
                },
                {
                    name: 'addJobsPermission',
                    path: '/addJobsPermission',
                    component: resolve => require(['../components/page/Permission/AddJobsPermission.vue'], resolve),
                    meta: { title: '添加岗位权限', url: '/admin/role/addRole' }
                },
                {
                    name: 'editJobsPermission',
                    path: '/editJobsPermission',
                    component: resolve => require(['../components/page/Permission/EditJobsPermission.vue'], resolve),
                    meta: { title: '编辑岗位权限', url: '/admin/role/updateRole' }
                },
                {
                    name: 'setPermission',
                    path: '/setPermission',
                    component: resolve => require(['../components/page/Permission/SetPermission.vue'], resolve),
                    meta: { title: '权限设置', url: '/setPermission' }
                },
                {
                    name: 'editMangerMsg',
                    path: '/editMangerMsg',
                    component: resolve => require(['../components/page/Permission/EditMangerMsg.vue'], resolve),
                    meta: { title: '管理员基础信息修改', url: '/editMangerMsg' }
                },
                {
                    name: 'organizeMange',
                    path: '/organizeMange',
                    component: resolve => require(['../components/page/Permission/OrganizeMange/OrganizeMange.vue'], resolve),
                    meta: { title: '组织结构管理', url: '/admin/role/queryDepartmentList' }
                },
                {
                    name: 'versionIteration',
                    path: '/versionIteration',
                    component: resolve => require(['../components/page/Permission/VersionIteration.vue'], resolve),
                    meta: { title: '版本迭代管理', url: '/versionIteration' }
                },
                {
                    name: 'dataDictionary',
                    path: '/dataDictionary',
                    component: resolve => require(['../components/page/Permission/DataDictionary.vue'], resolve),
                    meta: { title: '数据字典', url: '/dataDictionary' }
                },
                // 运营管理
                {
                    name: 'showHome',
                    path: '/showHome',
                    component: resolve => require(['../components/page/OperateManage/showField/showHome.vue'], resolve),
                    meta: { title: '发现管理', url: '/showHome' }
                },
                {
                    name: 'foundCategory',
                    path: '/foundCategory',
                    component: resolve => require(['../components/page/OperateManage/showField/found/foundCategory.vue'], resolve),
                    meta: { title: '分类列表', url: '/foundCategory' }
                },
                {
                    name: 'addFoundCategory',
                    path: '/addFoundCategory',
                    component: resolve => require(['../components/page/OperateManage/showField/found/addFoundCategory.vue'], resolve),
                    meta: { title: '分类管理', url: '/addFoundCategory' }
                },
                {
                    name: 'foundList',
                    path: '/foundList',
                    component: resolve => require(['../components/page/OperateManage/showField/found/foundList.vue'], resolve),
                    meta: { title: '发现列表', url: '/foundList' }
                },
                {
                    name: 'addFound',
                    path: '/addFound',
                    component: resolve => require(['../components/page/OperateManage/showField/found/addFound.vue'], resolve),
                    meta: { title: '发现管理', url: '/addFound' }
                },
                {
                    name: 'articalInfo',
                    path: '/articalInfo',
                    component: resolve => require(['../components/page/OperateManage/showField/found/articalInfo.vue'], resolve),
                    meta: { title: '查看', url: '/articalInfo' }
                },
                {
                    name: 'helpCenter',
                    path: '/helpCenter',
                    component: resolve => require(['../components/page/OperateManage/HelpCenter/HelpCenter.vue'], resolve),
                    meta: { title: '帮助中心管理', url: '/admin/helpType/queryHelpTypePageList' }
                },
                {
                    name: 'sensitiveLibrary',
                    path: '/sensitiveLibrary',
                    component: resolve => require(['../components/page/OperateManage/SensitiveLibrary.vue'], resolve),
                    meta: { title: '敏感词库', url: '/admin/badWord/queryBadWord' }
                },
                {
                    name: 'questionList',
                    path: '/questionList',
                    component: resolve => require(['../components/page/OperateManage/HelpCenter/QuestionList.vue'], resolve),
                    meta: { title: '问题列表', url: '/admin/helpQuestion/queryHelpQuestionPageList' }
                },
                {
                    name: 'addQuestion',
                    path: '/addQuestion',
                    component: resolve => require(['../components/page/OperateManage/HelpCenter/AddQuestion.vue'], resolve),
                    meta: { title: '添加问题', url: '/admin/helpQuestion/addHelpQuestion' }
                },
                {
                    name: 'editQuestion',
                    path: '/editQuestion',
                    component: resolve => require(['../components/page/OperateManage/HelpCenter/EditQuestion.vue'], resolve),
                    meta: { title: '编辑问题', url: '/admin/helpQuestion/updateHelpQuestion' }
                },
                {
                    name: 'questionInfo',
                    path: '/questionInfo',
                    component: resolve => require(['../components/page/OperateManage/HelpCenter/QuestionInfo.vue'], resolve),
                    meta: { title: '问题详情', url: '/admin/helpQuestion/deleteHelpQuestion' }
                },
                {
                    name: 'labelManage',
                    path: '/labelManage',
                    component: resolve => require(['../components/page/OperateManage/LabelManage/LabelManage.vue'], resolve),
                    meta: { title: '标签管理', url: '/labelManage' }
                },
                {
                    name: 'productLabel',
                    path: '/productLabel',
                    component: resolve => require(['../components/page/OperateManage/LabelManage/ProductLabel/ProductLabel.vue'], resolve),
                    meta: { title: '产品品类', url: '/productLabel' }
                },
                {
                    name: 'productLabelClassify',
                    path: '/productLabelClassify',
                    component: resolve => require(['../components/page/OperateManage/LabelManage/ProductLabelClassify/ProductLabelClassify.vue'], resolve),
                    meta: { title: '产品标签类型设置', url: '/productLabelClassify' }
                },
                {
                    name: 'productSecondClassify',
                    path: '/productSecondClassify',
                    component: resolve => require(['../components/page/OperateManage/LabelManage/ProductSecondClassify/ProductSecondClassify.vue'], resolve),
                    meta: { title: '产品二级类目', url: '/productSecondClassify' }
                },
                {
                    name: 'productLabelManage',
                    path: '/productLabelManage',
                    component: resolve => require(['../components/page/OperateManage/LabelManage/ProductSecondClassify/ProductLabelManage.vue'], resolve),
                    meta: { title: '产品标签管理', url: '/productLabelManage' }
                },
                {
                    name: 'signInManage',
                    path: '/signInManage',
                    component: resolve => require(['../components/page/OperateManage/SignInManage/SignInManage.vue'], resolve),
                    meta: { title: '签到管理', url: '/signInManage' }
                },
                {
                    name: 'signInParamsSet',
                    path: '/signInParamsSet',
                    component: resolve => require(['../components/page/OperateManage/SignInManage/SignInParamsSet/SignInParamsSet.vue'], resolve),
                    meta: { title: '签到参数设置', url: '/signInParamsSet' }
                },
                {
                    name: 'promotionOrderManage',
                    path: '/promotionOrderManage',
                    component: resolve => require(['../components/page/OperateManage/PromotionOrderManage/PromotionOrderManage.vue'], resolve),
                    meta: { title: '推广订单管理', url: '/promotionOrderManage' }
                },
                {
                    name: 'promotionOrderList',
                    path: '/promotionOrderList',
                    component: resolve => require(['../components/page/OperateManage/PromotionOrderManage/PromotionOrderManage/PromotionOrderList.vue'], resolve),
                    meta: { title: '推广订单查看', url: '/PromotionOrderList' }
                },
                {
                    name: 'promotionOrderInfo',
                    path: '/promotionOrderInfo',
                    component: resolve => require(['../components/page/OperateManage/PromotionOrderManage/PromotionOrderManage/PromotionOrderInfo.vue'], resolve),
                    meta: { title: '推广订单详情', url: '/promotionOrderInfo' }
                },
                {
                    name: 'packageManage',
                    path: '/packageManage',
                    component: resolve => require(['../components/page/OperateManage/PromotionOrderManage/PackageManage/PackageManage.vue'], resolve),
                    meta: { title: '套餐管理', url: '/packageManage' }
                },
                {
                    name: 'addPromotionPackage',
                    path: '/addPromotionPackage',
                    component: resolve => require(['../components/page/OperateManage/PromotionOrderManage/PackageManage/AddPromotionPackage.vue'], resolve),
                    meta: { title: '新建套餐', url: '/addPromotionPackage' }
                },
                {
                    name: 'packageDetail',
                    path: '/packageDetail',
                    component: resolve => require(['../components/page/OperateManage/PromotionOrderManage/PackageManage/PackageDetail.vue'], resolve),
                    meta: { title: '套餐详情', url: '/packageDetail' }
                },
                {
                    name: 'redPackageSet',
                    path: '/redPackageSet',
                    component: resolve => require(['../components/page/OperateManage/PromotionOrderManage/RedPackageSet/RedPackageSet.vue'], resolve),
                    meta: { title: '红包翻倍周期设置', url: '/redPackageSet' }
                },
                {
                    name: 'baseParamsSet',
                    path: '/baseParamsSet',
                    component: resolve => require(['../components/page/BasePramConfig/BaseParamsSet.vue'], resolve),
                    meta: { title: '交易基础参数设置', url: '/admin/sysConfig/updateSysConfigByTransaction' }
                },
                {
                    name: 'withdrawalCharge',
                    path: '/withdrawalCharge',
                    component: resolve => require(['../components/page/BasePramConfig/WithdrawalCharge.vue'], resolve),
                    meta: { title: '提现手续费设置', url: '/admin/withdrawConfig/queryWithdrawConfig' }
                },
                {
                    name: 'currencyRatio',
                    path: '/currencyRatio',
                    component: resolve => require(['../components/page/BasePramConfig/CurrencyRatio.vue'], resolve),
                    meta: { title: '货币比例设置', url: '/admin/sysConfig/updateSysConfigByCurrency' }
                },
                {
                    name: 'userAssociatedParam',
                    path: '/userAssociatedParam',
                    component: resolve => require(['../components/page/BasePramConfig/UserAssociatedParam.vue'], resolve),
                    meta: { title: '用户关联参数设置', url: '/admin/sysConfig/UserAssociatedParam' }
                },
                {
                    name: 'stockMsg',
                    path: '/stockMsg',
                    component: resolve => require(['../components/page/BasePramConfig/StockMsg.vue'], resolve),
                    meta: { title: '库存消息提醒设置', url: '/admin/sysConfig/StockMsg' }
                },
                {
                    name: 'groupBaseParamsSet',
                    path: '/groupBaseParamsSet',
                    component: resolve => require(['../components/page/BasePramConfig/GroupBaseParamsSet.vue'], resolve),
                    meta: { title: '拼店基础参数设置', url: '/admin/sysConfig/updateSysConfigByTransaction' }
                },
                {
                    name: 'advertisingManage',
                    path: '/advertisingManage',
                    component: resolve => require(['../components/page/OperateManage/AdvertisingManage.vue'], resolve),
                    meta: { title: '广告位管理', url: '/advertisingManage' }
                },
                {
                    name: 'featuredManage',
                    path: '/featuredManage',
                    component: resolve => require(['../components/page/OperateManage/FeaturedManage.vue'], resolve),
                    meta: { title: '推荐位管理', url: '/featuredManage' }
                },
                {
                    name: 'featured',
                    path: '/featured',
                    component: resolve => require(['../components/page/OperateManage/Featured.vue'], resolve),
                    meta: { title: '推荐位管理', url: '/featured' }
                },
                {
                    name: 'appBannerAdv',
                    path: '/appBannerAdv',
                    component: resolve => require(['../components/page/OperateManage/AdvertisingManage/AppBannerAdv.vue'], resolve),
                    meta: { title: 'app首页Banner广告位', url: '/appBannerAdv' }
                },
                {
                    name: 'recommendList',
                    path: '/recommendList',
                    component: resolve => require(['../components/page/OperateManage/AdvertisingManage/RecommendList.vue'], resolve),
                    meta: { title: '推荐位管理', url: '/featuredManage' }
                },
                {
                    name: 'recommendMange',
                    path: '/recommendMange',
                    component: resolve => require(['../components/page/OperateManage/AdvertisingManage/RecommendMange.vue'], resolve),
                    meta: { title: '推荐产品管理', url: '/recommendMange' }
                },
                {
                    name: 'keyWords',
                    path: '/keyWords',
                    component: resolve => require(['../components/page/OperateManage/AdvertisingManage/KeyWords.vue'], resolve),
                    meta: { title: '搜索热门搜索关键词', url: '/admin/hotWord/getHotWordsByPage' }
                },
                {
                    name: 'allKeyWords',
                    path: '/allKeyWords',
                    component: resolve => require(['../components/page/OperateManage/AllKeyWords.vue'], resolve),
                    meta: { title: '搜索关键词', url: '/admin/hotWord/getAllWordsByPage' }
                },
                {
                    name: 'deliveryAddress',
                    path: '/deliveryAddress',
                    component: resolve => require(['../components/page/OperateManage/DeliveryAddress.vue'], resolve),
                    meta: { title: '提货地址设置', url: '/admin/storeHouse/queryStoreHouseList' }
                },
                {
                    name: 'backAddress',
                    path: '/backAddress',
                    component: resolve => require(['../components/page/BasePramConfig/BackAddress.vue'], resolve),
                    meta: { title: '寄回地址管理', url: '/admin/returnAddress/queryReturnAddressList' }
                },
                {
                    name: 'discountCoupon',
                    path: '/discountCoupon',
                    component: resolve => require(['../components/page/OperateManage/DiscountCoupon/DiscountCoupon.vue'], resolve),
                    meta: { title: '优惠券设置', url: '/admin/discountCoupon/getDiscountCouponPage' }
                },
                {
                    name: 'couponDetail',
                    path: '/couponDetail',
                    component: resolve => require(['../components/page/OperateManage/DiscountCoupon/CouponDetail.vue'], resolve),
                    meta: { title: '优惠券详情', url: '/admin/discountCoupon/getDiscountCouponPageById' }
                },
                {
                    name: 'addCoupon',
                    path: '/addCoupon',
                    component: resolve => require(['../components/page/OperateManage/DiscountCoupon/AddCoupon.vue'], resolve),
                    meta: { title: '添加优惠券', url: '/admin/discountCoupon/addDiscountCoupon' }
                },
                {
                    name: 'editCoupon',
                    path: '/editCoupon',
                    component: resolve => require(['../components/page/OperateManage/DiscountCoupon/EditCoupon.vue'], resolve),
                    meta: { title: '编辑优惠券', url: '/admin/discountCoupon/updateDiscountCouponById' }
                },
                {
                    name: 'couponData',
                    path: '/couponData',
                    component: resolve => require(['../components/page/OperateManage/DiscountCoupon/couponData.vue'], resolve),
                    meta: { title: '券数据', url: '/admin/discountCouponDealer/discountCouponDealerPageList' }
                },
                {
                    name: 'couponTemplate',
                    path: '/couponTemplate',
                    component: resolve => require(['../components/page/OperateManage/DiscountCoupon/CouponTemplate.vue'], resolve),
                    meta: { title: '优惠券模版', url: '/couponTemplate' }
                },
                {
                    name: 'topicManage',
                    path: '/topicManage',
                    component: resolve => require(['../components/page/OperateManage/ProjectMange/TopicManage.vue'], resolve),
                    meta: { title: '专题管理', url: '/admin/topic/list' }
                },
                {
                    name: 'topicPreview',
                    path: '/topicPreview',
                    component: resolve => require(['../components/page/OperateManage/ProjectMange/TopicPreview.vue'], resolve),
                    meta: { title: '专题预览', url: '/topicPreview' }
                },
                {
                    name: 'topicTemplate',
                    path: '/topicTemplate',
                    component: resolve => require(['../components/page/OperateManage/ProjectMange/TopicTemplate.vue'], resolve),
                    meta: { title: '专题模板', url: '/admin/topic/list' }
                },
                {
                    name: 'addProject',
                    path: '/addProject',
                    component: resolve => require(['../components/page/OperateManage/ProjectMange/addProject.vue'], resolve),
                    meta: { title: '专题设置', url: '/admin/topic/save' }
                },
                {
                    name: 'marketToolsManage',
                    path: '/marketToolsManage',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/MarketToolsManage.vue'], resolve),
                    meta: { title: '营销工具管理', url: '/marketToolsManage' }
                },
                {
                    name: 'depreciate',
                    path: '/depreciate',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/Depreciate/Depreciate.vue'], resolve),
                    meta: { title: '降价拍', url: '/depreciate' }
                },
                {
                    name: 'addDepreciate',
                    path: '/addDepreciate',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/Depreciate/AddDepreciate.vue'], resolve),
                    meta: { title: '新建降价拍', url: '/admin/operActivityDepreciate/operatorAddDepreciate' }
                },
                {
                    name: 'depreciateInfo',
                    path: '/depreciateInfo',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/Depreciate/DepreciateInfo.vue'], resolve),
                    meta: { title: '降价拍详情', url: '/admin/operActivityDepreciate/operatorfindById' }
                },
                {
                    name: 'secKill',
                    path: '/secKill',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/SecKill/SecKill.vue'], resolve),
                    meta: { title: '秒杀', url: '/secKill' }
                },
                {
                    name: 'addSecKill',
                    path: '/addSecKill',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/SecKill/AddSecKill.vue'], resolve),
                    meta: { title: '新建秒杀', url: '/admin/operActivitySeckill/addOperatorSeckill' }
                },
                {
                    name: 'secKillInfo',
                    path: '/secKillInfo',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/SecKill/SecKillInfo.vue'], resolve),
                    meta: { title: '秒杀详情', url: '/admin/operActivitySeckill/findActivitySeckillByActivityCode' }
                },
                {
                    name: 'packageList',
                    path: '/packageList',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/Package/PackageList.vue'], resolve),
                    meta: { title: '优惠套餐', url: '/packageList' }
                },
                {
                    name: 'addPackage',
                    path: '/addPackage',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/Package/AddPackage.vue'], resolve),
                    meta: { title: '新建套餐', url: '/admin/operActivityPackage/addOperActivityPackage' }
                },
                {
                    name: 'editPackage',
                    path: '/editPackage',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/Package/EditPackage.vue'], resolve),
                    meta: { title: '编辑套餐', url: '/admin/operActivityPackage/updateOperActivityPackage' }
                },
                {
                    name: 'packageInfo',
                    path: '/packageInfo',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/Package/PackageInfo.vue'], resolve),
                    meta: { title: '套餐详情', url: '/admin/operActivityPackage/findOperActivityPackageDetailsById' }
                },
                {
                    name: 'priceInventory',
                    path: '/priceInventory',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/Package/PriceInventory.vue'], resolve),
                    meta: { title: '价格库存', url: '/admin/operActivityPackage/updateOperActivityPackagePriceAndStock' }
                },
                {
                    name: 'packageInventory',
                    path: '/packageInventory',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/Package/PackageInventory.vue'], resolve),
                    meta: { title: '库存管理', url: '/admin/operActivityPackageSpecValue/updatePackageSpecValueStock' }
                },
                {
                    name: 'packageProductManege',
                    path: '/packageProductManege',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/Package/PackageProductManage.vue'], resolve),
                    meta: { title: '产品管理', url: '/admin/operActivityPackageProduct/addPackageProduct' }
                },
                {
                    name: 'prizePoll',
                    path: '/prizePoll',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/PrizePoll/PrizePoll.vue'], resolve),
                    meta: { title: '奖品池管理', url: '/prizePoll' }
                },
                {
                    name: 'blockStockActivity',
                    path: '/blockStockActivity',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/PrizePoll/BlockStockActivity.vue'], resolve),
                    meta: { title: '冻结库存活动', url: '/blockStockActivity' }
                },
                {
                    name: 'scratchCardsList',
                    path: '/scratchCardsList',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/ScratchCards/ScratchCardsList'], resolve),
                    meta: { title: '刮刮卡', url: '/scratchCardsList' }
                },
                {
                    name: 'cardMange',
                    path: '/cardMange',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/ScratchCards/cardMange'], resolve),
                    meta: { title: '刮刮卡管理', url: '/cardMange' }
                },
                {
                    name: 'cardInfo',
                    path: '/cardInfo',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/ScratchCards/cardInfo'], resolve),
                    meta: { title: '刮刮卡详情', url: '/cardInfo' }
                },
                {
                    name: 'activityUse',
                    path: '/activityUse',
                    component: resolve => require(['../components/page/OperateManage/MarketTools/ScratchCards/activityUse'], resolve),
                    meta: { title: '当前活动使用', url: '/activityUse' }
                },
                // {
                //     name: 'labelManage',
                //     path: '/labelManage',
                //     component: resolve => require(['../components/page/OperateManage/LabelManage/SignInManage.vue'], resolve),
                //     meta: { title: '标签管理', url: '/labelManage' }
                // },
                // {
                //     name: 'productLabel',
                //     path: '/productLabel',
                //     component: resolve => require(['../components/page/OperateManage/LabelManage/SignInParamsSet/SignInParamsSet.vue'], resolve),
                //     meta: { title: '产品标签', url: '/productLabel' }
                // },
                // 订单管理
                {
                    name: 'orderList',
                    path: '/orderList',
                    component: resolve => require(['../components/page/OrderManage/OrderManage/OrderList.vue'], resolve),
                    meta: { title: '订单管理', url: '/orderManage' }
                },
                {
                    name: 'orderInfo',
                    path: '/orderInfo',
                    component: resolve => require(['../components/page/OrderManage/OrderManage/OrderInfo.vue'], resolve),
                    meta: { title: '订单详情', url: '/admin/order/getOrderDetail' }
                },
                {
                    name: 'afterSaleOpr',
                    path: '/afterSaleOpr',
                    component: resolve => require(['../components/page/OrderManage/OrderManage/AfterSaleOpr.vue'], resolve),
                    meta: { title: '申请操作', url: '/afterSaleOpr' }
                },
                {
                    name: 'logistics',
                    path: '/logistics',
                    component: resolve => require(['../components/page/OrderManage/OrderManage/Logistics.vue'], resolve),
                    meta: { title: '物流详情', url: '/logistics' }
                },
                {
                    name: 'giftOrderList',
                    path: '/giftOrderList',
                    component: resolve => require(['../components/page/OrderManage/GiftOrderManage/GiftOrderList.vue'], resolve),
                    meta: { title: '礼包订单', url: '/admin/gbGiftBagOrder/queryAllGiftBagOrderPageList' }
                },
                {
                    name: 'giftOrderInfo',
                    path: '/giftOrderInfo',
                    component: resolve => require(['../components/page/OrderManage/GiftOrderManage/GiftOrderInfo.vue'], resolve),
                    meta: { title: '礼包订单详情', url: '/admin/gbGiftBagOrder/getGiftBagOrderDetail' }
                },
                // 结算管理
                {
                    name: 'withdrawalAudit',
                    path: '/withdrawalAudit',
                    component: resolve => require(['../components/page/SettlementMange/WithdrawalAudit.vue'], resolve),
                    meta: { title: '提现审核', url: '/admin/withdrawMoney/queryWithdrawMoneyList' }
                },
                {
                    name: 'refundMange',
                    path: '/refundMange',
                    component: resolve => require(['../components/page/SettlementMange/RefundMange.vue'], resolve),
                    meta: { title: '退款记录', url: '/admin/returnProduct/queryReturnMoneyList' }
                },
                {
                    name: 'returnGoodsMange',
                    path: '/returnGoodsMange',
                    component: resolve => require(['../components/page/SettlementMange/ReturnGoodsMange.vue'], resolve),
                    meta: { title: '退货记录', url: '/admin/returnProduct/queryReturnProductList' }
                },
                {
                    name: 'exchangeMange',
                    path: '/exchangeMange',
                    component: resolve => require(['../components/page/SettlementMange/ExchangeMange.vue'], resolve),
                    meta: { title: '换货记录', url: '/admin/returnProduct/queryExchangeProductList' }
                },
                {
                    name: 'supplierSettMange',
                    path: '/supplierSettMange',
                    component: resolve => require(['../components/page/SettlementMange/supplierSettMange.vue'], resolve),
                    meta: { title: '供应商结算管理', url: '/supplierSettMange' }
                },
                {
                    name: 'depositPayment',
                    path: '/depositPayment',
                    component: resolve => require(['../components/page/SettlementMange/DepositPayment.vue'], resolve),
                    meta: { title: '保证金缴纳记录', url: '/depositPayment' }
                },
                {
                    name: 'cloudWarHouseMange',
                    path: '/cloudWarHouseMange',
                    component: resolve => require(['../components/page/SettlementMange/CloudWarHouseMange.vue'], resolve),
                    meta: { title: '云仓结算管理' }
                },
                {
                    name: 'invoiceInfo',
                    path: '/invoiceInfo',
                    component: resolve => require(['../components/page/SettlementMange/InvoiceInfo.vue'], resolve),
                    meta: { title: '发货单' }
                },
                {
                    name: 'flatAccountInfo',
                    path: '/flatAccountInfo',
                    component: resolve => require(['../components/page/SettlementMange/FlatAccountInfo.vue'], resolve),
                    meta: { title: '平台账户收入明细', url: '/admin/settlementRecord/querySettlementRecordListByCalcType' }
                },
                {
                    name: 'flatAct01',
                    path: '/flatAct01',
                    component: resolve => require(['../components/page/SettlementMange/flatAccountList/flatAct01.vue'], resolve),
                    meta: { title: '资金收入明细', url: '/admin/settlementRecord/querySettlementRecordListByCalcType' }
                },
                {
                    name: 'flatAct02',
                    path: '/flatAct02',
                    component: resolve => require(['../components/page/SettlementMange/flatAccountList/flatAct02.vue'], resolve),
                    meta: { title: '资金收入明细', url: '/admin/settlementRecord/querySettlementRecordListByCalcType' }
                },
                {
                    name: 'soFar',
                    path: '/soFar',
                    component: resolve => require(['../components/page/SettlementMange/SoFar.vue'], resolve),
                    meta: { title: '收益金比例设置', url: '/admin/config/updateConfigBalanceInProfitRatio' }
                },
                {
                    name: 'profitDistrMange',
                    path: '/profitDistrMange',
                    component: resolve => require(['../components/page/SettlementMange/ProfitDistrMange.vue'], resolve),
                    meta: { title: '利润分配设置', url: '/admin/settlementConfig/querySettlementConfigList' }
                },
                {
                    name: 'profitTpl',
                    path: '/profitTpl',
                    component: resolve => require(['../components/page/SettlementMange/ProfitTpl.vue'], resolve),
                    meta: { title: '利润分配模板', url: '/admin/settlementConfig/operateSettlementConfig' }
                },
                {
                    name: 'showValueList',
                    path: '/showValueList',
                    component: resolve => require(['../components/page/ShowValue/ShowValueList.vue'], resolve),
                    meta: { title: '秀值分配设置', url: '/showValueList' }
                },
                {
                    name: 'showValueSet',
                    path: '/showValueSet',
                    component: resolve => require(['../components/page/ShowValue/ShowValueSet.vue'], resolve),
                    meta: { title: '新建利润分配模板', url: '/showValueSet' }
                },
                {
                    name: 'showValueParamSet',
                    path: '/showValueParamSet',
                    component: resolve => require(['../components/page/ShowValue/ShowValueParamSet.vue'], resolve),
                    meta: { title: '秀值参数设置', url: '/showValueParamSet' }
                },
                {
                    name: 'showValReCharge',
                    path: '/showValReCharge',
                    component: resolve => require(['../components/page/ShowValue/ShowValReCharge.vue'], resolve),
                    meta: { title: '秀值账户充值', url: '/showValReCharge' }
                },
                {
                    name: 'taskHome',
                    path: '/taskHome',
                    component: resolve => require(['../components/page/ShowValue/TaskHome.vue'], resolve),
                    meta: { title: '现金分享任务管理', url: '/taskHome' }
                },
                {
                    name: 'showTaskList',
                    path: '/showTaskList',
                    component: resolve => require(['../components/page/ShowValue/ShowTaskList.vue'], resolve),
                    meta: { title: '用户任务看板', url: '/showTaskList' }
                },
                {
                    name: 'showCashTaskList',
                    path: '/showCashTaskList',
                    component: resolve => require(['../components/page/ShowValue/ShowCashTaskList.vue'], resolve),
                    meta: { title: '秀值任务查看', url: '/showCashTaskList' }
                },
                {
                    name: 'showValueAccount',
                    path: '/showValueAccount',
                    component: resolve => require(['../components/page/MemberManage/UserAccount/ShowValueAccount.vue'], resolve),
                    meta: { title: '秀值账户收支明细', url: '/showValueAccount' }
                },
                {
                    name: 'demo',
                    path: '/demo',
                    component: resolve => require(['../components/page/demo.vue'], resolve),
                    meta: { title: 'demo', url: '/admin/settlementConfig/operateSettlementConfig' }
                },
                {
                    name: 'repertoryList',
                    path: '/repertoryList',
                    component: resolve => require(['../components/page/RepertoryManage/RepertoryManage/RepertoryList.vue'], resolve),
                    meta: { title: '仓库管理', url: '/repertoryList' }
                },
                {
                    name: 'repertorySet',
                    path: '/repertorySet',
                    component: resolve => require(['../components/page/RepertoryManage/RepertoryManage/RepertorySet.vue'], resolve),
                    meta: { title: '仓库设置', url: '/repertorySet' }
                },
                {
                    name: 'repertoryInfo',
                    path: '/repertoryInfo',
                    component: resolve => require(['../components/page/RepertoryManage/RepertoryManage/RepertoryInfo.vue'], resolve),
                    meta: { title: '仓库详情', url: '/repertoryInfo' }
                },
                {
                    name: 'areaSet',
                    path: '/areaSet',
                    component: resolve => require(['../components/page/RepertoryManage/RepertoryAreaSet/AreaSet.vue'], resolve),
                    meta: { title: '区域设置', url: '/areaSet' }
                },
                {
                    name: 'repertoryReportList',
                    path: '/repertoryReportList',
                    component: resolve => require(['../components/page/RepertoryManage/RepertoryReport/RepertoryReportList.vue'], resolve),
                    meta: { title: '入库单', url: '/repertoryReportList' }
                },
                {
                    name: 'repertoryReportSet',
                    path: '/repertoryReportSet',
                    component: resolve => require(['../components/page/RepertoryManage/RepertoryReport/RepertoryReportSet.vue'], resolve),
                    meta: { title: '入库单设置', url: '/repertoryReportSet' }
                },
                {
                    name: 'repertoryReportInfo',
                    path: '/repertoryReportInfo',
                    component: resolve => require(['../components/page/RepertoryManage/RepertoryReport/RepertoryReportInfo.vue'], resolve),
                    meta: { title: '入库单详情', url: '/repertoryReportInfo' }
                },
                {
                    name: 'repertoryInventory',
                    path: '/repertoryInventory',
                    component: resolve => require(['../components/page/RepertoryManage/RepertoryData/RepertoryInventory.vue'], resolve),
                    meta: { title: '仓库存货数', url: '/repertoryInventory' }
                },
                {
                    name: 'repertoryInventoryInfo',
                    path: '/repertoryInventoryInfo',
                    component: resolve => require(['../components/page/RepertoryManage/RepertoryData/RepertoryInventoryInfo.vue'], resolve),
                    meta: { title: '仓库存货数详情', url: '/repertoryInventoryInfo' }
                },
                {
                    name: 'repertoryBad',
                    path: '/repertoryBad',
                    component: resolve => require(['../components/page/RepertoryManage/RepertoryData/RepertoryBad.vue'], resolve),
                    meta: { title: '仓库报损数', url: '/repertoryBad' }
                },
                {
                    name: 'repertoryBadInfo',
                    path: '/repertoryBadInfo',
                    component: resolve => require(['../components/page/RepertoryManage/RepertoryData/RepertoryBadInfo.vue'], resolve),
                    meta: { title: '仓库报损数详情', url: '/repertoryBadInfo' }
                }
            ]
        },
        {
            name: 'login',
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        },
        {
            name: '404',
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        }
    ]
});
