import Vue from 'vue';
import Router from 'vue-router';
/* Layout */
import Layout from '../components/common/Home.vue';

Vue.use(Router);

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/

export const asyncRouterMap = [
    {
        path: '/vip',
        component: Layout,
        name: 'vip',
        meta: { title: '会员管理', icon: 'icon-huiyuanzhanghaoguanli' },
        children: [
            {
                name: 'levelManage',
                path: '/levelManage',
                component: resolve => require(['../components/page/MemberManage/LevelManage.vue'], resolve),
                meta: { title: '会员层级管理' }
            },
            {
                name: 'joinManage',
                path: '/joinManage',
                component: resolve => require(['../components/page/MemberManage/JoinManage.vue'], resolve),
                meta: { title: '会员邀请管理' }
            },
            {
                name: 'memberManage',
                path: '/memberManage',
                component: resolve => require(['../components/page/MemberManage/MemberManage.vue'], resolve),
                meta: { title: '会员管理' }
            },
            {
                name: 'realNameAuthentication',
                path: '/realNameAuthentication',
                component: resolve => require(['../components/page/MemberManage/realNameAuthentication.vue'], resolve),
                meta: { title: '实名认证审核' }
            },
            {
                name: 'supplierManage',
                path: '/supplierManage',
                component: resolve => require(['../components/page/MemberManage/SupplierManage.vue'], resolve),
                meta: { title: '供应商管理' }
            }
        ]
    },
    {
        path: '/brand',
        component: Layout,
        name: 'brand',
        meta: { title: '品牌产品管理', icon: 'icon-fenlei' },
        children: [
            {
                name: 'brandProductClassify',
                path: '/brandProductClassify',
                component: resolve => require(['../components/page/BrandProduct/BrandProductClassify/BrandProductClassify.vue'], resolve),
                meta: { title: '产品品牌分类管理' }
            },
            {
                name: 'brandManage',
                path: '/brandManage',
                component: resolve => require(['../components/page/BrandProduct/BrandManage/BrandManage.vue'], resolve),
                meta: { title: '品牌管理' }
            },
            {
                name: 'productList',
                path: '/productList',
                component: resolve => require(['../components/page/BrandProduct/ProductManage/ProductList.vue'], resolve),
                meta: { title: '产品管理' }
            },
            {
                name: 'shippingTemplate',
                path: '/shippingTemplate',
                component: resolve => require(['../components/page/BrandProduct/ShippingTemplate/ShippingTemplate.vue'], resolve),
                meta: { title: '运费模板' }
            }
        ]
    },
    {
        path: '/pindian',
        component: Layout,
        name: 'pindian',
        meta: { title: '拼店管理', icon: 'icon-dianpu' },
        children: [
            {
                name: 'shopLevelSet',
                path: '/shopLevelSet',
                component: resolve => require(['../components/page/SpellShopManage/ShopLevel/ShopLevelSet.vue'], resolve),
                meta: { title: '店铺等级设置' }
            },
            {
                name: 'shopList',
                path: '/shopList',
                component: resolve => require(['../components/page/SpellShopManage/ShopManage/ShopList.vue'], resolve),
                meta: { title: '店铺管理' }
            },
            {
                name: 'recruitShopManage',
                path: '/recruitShopManage',
                component: resolve => require(['../components/page/SpellShopManage/RecruitShopManage/RecruitShopManage.vue'], resolve),
                meta: { title: '招募店铺管理' }
            },
            {
                name: 'reportSpellShop',
                path: '/reportSpellShop',
                component: resolve => require(['../components/page/SpellShopManage/reportSpellShop/ReportSpellShop.vue'], resolve),
                meta: { title: '拼店店铺举报' }
            }
        ]
    },
    {
        path: '/order',
        component: Layout,
        name: 'order',
        meta: { title: '订单管理', icon: 'icon-dingdan' },
        children: [
            {
                name: 'orderList',
                path: '/orderList',
                component: resolve => require(['../components/page/OrderManage/OrderManage/OrderList.vue'], resolve),
                meta: { title: '订单管理' }
            },
            {
                name: 'giftOrderList',
                path: '/giftOrderList',
                component: resolve => require(['../components/page/OrderManage/GiftOrderManage/GiftOrderList.vue'], resolve),
                meta: { title: '礼包订单' }
            }
        ]
    },
    {
        path: '/service',
        component: Layout,
        name: 'service',
        meta: { title: '服务管理', icon: 'icon-huiyuanzhanghaoguanli' },
        children: [
            {
                name: 'feedBack',
                path: '/feedBack',
                component: resolve => require(['../components/page/ServiceManage/FeedBack.vue'], resolve),
                meta: { title: '问题反馈' }
            },
            {
                hidden: true,
                name: 'feedDetail',
                path: '/feedDetail',
                component: resolve => require(['../components/page/ServiceManage/FeedBack/FeedbackDetail.vue'], resolve),
                meta: { title: '问题详情' }
            }
        ]
    },
    {
        path: '/yunying',
        component: Layout,
        name: 'yunying',
        meta: { title: '运营管理', icon: 'icon-yunying' },
        children: [
            {
                name: 'showHome',
                path: '/showHome',
                component: resolve => require(['../components/page/OperateManage/showField/showHome.vue'], resolve),
                meta: { title: '秀场管理' }
            },
            {
                name: 'discountCoupon',
                path: '/discountCoupon',
                component: resolve => require(['../components/page/OperateManage/DiscountCoupon/DiscountCoupon.vue'], resolve),
                meta: { title: '优惠券设置' }
            },
            {
                name: 'noticeInformManage',
                path: '/noticeInformManage',
                component: resolve => require(['../components/page/OperateManage/NoticeInformManage/NoticeInformManage.vue'], resolve),
                meta: { title: '公告/通知管理' }
            },
            {
                name: 'topicManage',
                path: '/topicManage',
                component: resolve => require(['../components/page/OperateManage/ProjectMange/TopicManage.vue'], resolve),
                meta: { title: '专题管理' }
            },
            {
                name: 'sensitiveLibrary',
                path: '/sensitiveLibrary',
                component: resolve => require(['../components/page/OperateManage/SensitiveLibrary.vue'], resolve),
                meta: { title: '敏感词库' }
            },
            {
                name: 'advertisingManage',
                path: '/advertisingManage',
                component: resolve => require(['../components/page/OperateManage/AdvertisingManage/AdvertisingManage.vue'], resolve),
                meta: { title: '广告位管理' }
            },
            {
                name: 'keyWords',
                path: '/keyWords',
                component: resolve => require(['../components/page/OperateManage/AdvertisingManage/KeyWords.vue'], resolve),
                meta: { title: '热门搜索关键词' }
            },
            {
                name: 'allKeyWords',
                path: '/allKeyWords',
                component: resolve => require(['../components/page/OperateManage/AllKeyWords.vue'], resolve),
                meta: { title: '搜索关键词看板' }
            },
            {
                name: 'helpCenter',
                path: '/helpCenter',
                component: resolve => require(['../components/page/OperateManage/HelpCenter/HelpCenter.vue'], resolve),
                meta: { title: '帮助中心管理' }
            },
            {
                name: 'labelManage',
                path: '/labelManage',
                component: resolve => require(['../components/page/OperateManage/LabelManage/LabelManage.vue'], resolve),
                meta: { title: '标签管理' }
            },
            {
                name: 'signInManage',
                path: '/signInManage',
                component: resolve => require(['../components/page/OperateManage/SignInManage/SignInManage.vue'], resolve),
                meta: { title: '签到管理' }
            },
            {
                name: 'promotionOrderManage',
                path: '/promotionOrderManage',
                component: resolve => require(['../components/page/OperateManage/PromotionOrderManage/PromotionOrderManage.vue'], resolve),
                meta: { title: '推广订单管理' }
            },
            {
                name: 'marketToolsManage',
                path: '/marketToolsManage',
                component: resolve => require(['../components/page/OperateManage/MarketTools/MarketToolsManage.vue'], resolve),
                meta: { title: '营销工具管理' }
            }
        ]
    },
    {
        path: '/setting',
        component: Layout,
        name: 'setting',
        meta: { title: '基础参数设置', icon: 'icon-huiyuanzhanghaoguanli' },
        children: [
            {
                name: 'baseParamsSet',
                path: '/baseParamsSet',
                component: resolve => require(['../components/page/BasePramConfig/BaseParamsSet.vue'], resolve),
                meta: { title: '交易基础参数设置' }
            },
            {
                name: 'groupBaseParamsSet',
                path: '/groupBaseParamsSet',
                component: resolve => require(['../components/page/BasePramConfig/GroupBaseParamsSet.vue'], resolve),
                meta: { title: '拼店基础参数设置' }
            },
            {
                name: 'backAddress',
                path: '/backAddress',
                component: resolve => require(['../components/page/BasePramConfig/BackAddress.vue'], resolve),
                meta: { title: '寄回地址管理' }
            },
            {
                name: 'currencyRatio',
                path: '/currencyRatio',
                component: resolve => require(['../components/page/BasePramConfig/CurrencyRatio.vue'], resolve),
                meta: { title: '货币比例设置' }
            },
            {
                name: 'stockMsg',
                path: '/stockMsg',
                component: resolve => require(['../components/page/BasePramConfig/StockMsg.vue'], resolve),
                meta: { title: '库存消息提醒设置' }
            },
            {
                name: 'withdrawalCharge',
                path: '/withdrawalCharge',
                component: resolve => require(['../components/page/BasePramConfig/WithdrawalCharge.vue'], resolve),
                meta: { title: '提现设置' }
            },
            {
                name: 'userAssociatedParam',
                path: '/userAssociatedParam',
                component: resolve => require(['../components/page/BasePramConfig/UserAssociatedParam.vue'], resolve),
                meta: { title: '用户关联参数设置' }
            }
        ]
    },
    {
        path: '/quanxian',
        component: Layout,
        name: 'quanxian',
        meta: { title: '权限管理', icon: 'icon-shezhi' },
        children: [
            {
                name: 'manageList',
                path: '/manageList',
                component: resolve => require(['../components/page/Permission/ManageList.vue'], resolve),
                meta: { title: '管理员账号管理' }
            },
            {
                name: 'versionIteration',
                path: '/versionIteration',
                component: resolve => require(['../components/page/Permission/VersionIteration.vue'], resolve),
                meta: { title: '版本迭代管理' }
            },
        ]
    },
    {
        path: '/store',
        component: Layout,
        name: 'store',
        meta: { title: '云仓仓库管理', icon: 'icon-shezhi' },
        children: [
            {
                name: 'repertoryList',
                path: '/repertoryList',
                component: resolve => require(['../components/page/RepertoryManage/RepertoryManage/RepertoryList.vue'], resolve),
                meta: { title: '仓库管理' }
            },
            {
                name: 'areaSet',
                path: '/areaSet',
                component: resolve => require(['../components/page/RepertoryManage/RepertoryAreaSet/AreaSet.vue'], resolve),
                meta: { title: '区域设置' }
            },
            {
                name: 'repertoryReportList',
                path: '/repertoryReportList',
                component: resolve => require(['../components/page/RepertoryManage/RepertoryReport/RepertoryReportList.vue'], resolve),
                meta: { title: '仓库单' }
            },
        ]
    },
    {
        path: '/showValue',
        component: Layout,
        name: 'showValue',
        meta: { title: '秀值模块', icon: 'icon-shezhi', roles: ['admin'] },
        children: [
            {
                name: 'taskHome',
                path: '/taskHome',
                component: resolve => require(['../components/page/ShowValue/TaskHome.vue'], resolve),
                meta: { title: '现金分享任务管理' }
            },
            {
                name: 'showValueList',
                path: '/showValueList',
                component: resolve => require(['../components/page/ShowValue/ShowValueList.vue'], resolve),
                meta: { title: '秀值分配设置' }
            },
            {
                name: 'showValueParamSet',
                path: '/showValueParamSet',
                component: resolve => require(['../components/page/ShowValue/ShowValueParamSet.vue'], resolve),
                meta: { title: '秀值参数设置' }
            },
            {
                name: 'showValReCharge',
                path: '/showValReCharge',
                component: resolve => require(['../components/page/ShowValue/ShowValReCharge.vue'], resolve),
                meta: { title: '秀值账户充值' }
            }
        ]
    },
    {
        path: '/settlement',
        component: Layout,
        name: 'settlement',
        meta: { title: '结算管理', icon: 'icon-shezhi', roles: ['admin'] },
        children: [
            {
                name: 'withdrawalAudit',
                path: '/withdrawalAudit',
                component: resolve => require(['../components/page/SettlementMange/WithdrawalAudit.vue'], resolve),
                meta: { title: '提现申请审核' }
            },
            {
                name: 'refundMange',
                path: '/refundMange',
                component: resolve => require(['../components/page/SettlementMange/RefundMange.vue'], resolve),
                meta: { title: '退款记录' }
            },
            {
                name: 'returnGoodsMange',
                path: '/returnGoodsMange',
                component: resolve => require(['../components/page/SettlementMange/ReturnGoodsMange.vue'], resolve),
                meta: { title: '退货记录' }
            },
            {
                name: 'exchangeMange',
                path: '/exchangeMange',
                component: resolve => require(['../components/page/SettlementMange/ExchangeMange.vue'], resolve),
                meta: { title: '换货记录' }
            },
            {
                name: 'supplierSettMange',
                path: '/supplierSettMange',
                component: resolve => require(['../components/page/SettlementMange/supplierSettMange.vue'], resolve),
                meta: { title: '供应商结算管理' }
            },
            {
                name: 'flatAccountInfo',
                path: '/flatAccountInfo',
                component: resolve => require(['../components/page/SettlementMange/FlatAccountInfo.vue'], resolve),
                meta: { title: '平台账户收入明细' }
            },
            {
                name: 'depositPayment',
                path: '/depositPayment',
                component: resolve => require(['../components/page/SettlementMange/DepositPayment.vue'], resolve),
                meta: { title: '保证金缴纳记录' }
            },
            {
                name: 'soFar',
                path: '/soFar',
                component: resolve => require(['../components/page/SettlementMange/SoFar.vue'], resolve),
                meta: { title: '收益金比例设置' }
            },
            {
                name: 'profitDistrMange',
                path: '/profitDistrMange',
                component: resolve => require(['../components/page/SettlementMange/ProfitDistrMange.vue'], resolve),
                meta: { title: '利润分配设置' }
            }
        ]
    },
    {
        hidden: true,
        path: '/others',
        component: Layout,
        name: 'others',
        meta: { title: '其他' },
        children: [
            {
                name: 'message',
                path: '/message',
                component: resolve => require(['../components/page/Dashboard/message.vue'], resolve),
                meta: { title: '全部消息' }
            },
            // 授权管理
            {
                name: 'channelItemManage',
                path: '/channelItemManage',
                component: resolve => require(['../components/page/Authorization/ChannelItemManage.vue'], resolve),
                meta: { title: '渠道类目管理' }
            },
            {
                name: 'secondChannel',
                path: '/secondChannel',
                component: resolve => require(['../components/page/Authorization/SecondChannel.vue'], resolve),
                meta: { title: '二级渠道' }
            },
            {
                name: 'certificateUse',
                path: '/certificateUse',
                component: resolve => require(['../components/page/Authorization/CertificateUse.vue'], resolve),
                meta: { title: '授权证书模板' }
            },
            {
                name: 'contractReview',
                path: '/contractReview',
                component: resolve => require(['../components/page/Authorization/ContractReview.vue'], resolve),
                meta: { title: '续约审核' }
            },
            // 品牌产品管理

            {
                name: 'secondClassify',
                path: '/secondClassify',
                component: resolve => require(['../components/page/BrandProduct/BrandProductClassify/SecondClassify.vue'], resolve),
                meta: { title: '二级类目' }
            },
            {
                name: 'thirdClassify',
                path: '/thirdClassify',
                component: resolve => require(['../components/page/BrandProduct/BrandProductClassify/ThirdClassify.vue'], resolve),
                meta: { title: '三级类目' }
            },
            {
                name: 'hotClassifyManage',
                path: '/hotClassifyManage',
                component: resolve => require(['../components/page/BrandProduct/HotClassifyManage/HotClassifyManage.vue'], resolve),
                meta: { title: '热门分类管理' }
            },
            {
                name: 'productDetailParam',
                path: '/productDetailParam',
                component: resolve => require(['../components/page/BrandProduct/BrandProductClassify/ProductDetailParam.vue'], resolve),
                meta: { title: '产品详细参数' }
            },

            {
                name: 'addBrand',
                path: '/addBrand',
                component: resolve => require(['../components/page/BrandProduct/BrandManage/AddBrand.vue'], resolve),
                meta: { title: '添加品牌' }
            },
            {
                name: 'editBrand',
                path: '/editBrand',
                component: resolve => require(['../components/page/BrandProduct/BrandManage/EditBrand.vue'], resolve),
                meta: { title: '编辑品牌' }
            },

            {
                name: 'addTemplate',
                path: '/addTemplate',
                component: resolve => require(['../components/page/BrandProduct/ShippingTemplate/AddTemplate.vue'], resolve),
                meta: { title: '添加模板' }
            },
            {
                name: 'editTemplate',
                path: '/editTemplate',
                component: resolve => require(['../components/page/BrandProduct/ShippingTemplate/EditTemplate.vue'], resolve),
                meta: { title: '编辑模板' }
            },
            {
                name: 'giftManage',
                path: '/giftManage',
                component: resolve => require(['../components/page/BrandProduct/GiftManage/GiftManage.vue'], resolve),
                meta: { title: '礼包管理' }
            },
            {
                name: 'addGift',
                path: '/addGift',
                component: resolve => require(['../components/page/BrandProduct/GiftManage/AddGift.vue'], resolve),
                meta: { title: '发布礼包' }
            },
            {
                name: 'editGift',
                path: '/editGift',
                component: resolve => require(['../components/page/BrandProduct/GiftManage/EditGift.vue'], resolve),
                meta: { title: '编辑礼包' }
            },
            {
                name: 'priceOfInventory',
                path: '/priceOfInventory',
                component: resolve => require(['../components/page/BrandProduct/GiftManage/PriceOfInventory.vue'], resolve),
                meta: { title: '价格库存管理' }
            },
            {
                name: 'giftProductMange',
                path: '/giftProductMange',
                component: resolve => require(['../components/page/BrandProduct/GiftManage/GiftProductMange.vue'], resolve),
                meta: { title: '礼包产品管理' }
            },
            {
                name: 'addStock',
                path: '/addStock',
                component: resolve => require(['../components/page/BrandProduct/GiftManage/addStock.vue'], resolve),
                meta: { title: '添加库存' }
            },
            {
                name: 'giftInfo',
                path: '/giftInfo',
                component: resolve => require(['../components/page/BrandProduct/GiftManage/GiftInfo.vue'], resolve),
                meta: { title: '礼包详情' }
            },
            {
                name: 'discountAdd',
                path: '/discountAdd',
                component: resolve => require(['../components/page/BrandProduct/GiftManage/DiscountAdd.vue'], resolve),
                meta: { title: '优惠券管理' }
            },
            // 拼店店铺管理
            {
                name: 'promotionShop',
                path: '/promotionShop',
                component: resolve => require(['../components/page/SpellShopManage/ShopLevel/PromotionShop.vue'], resolve),
                meta: { title: '店铺晋升设置' }
            },
            {
                name: 'demotionShop',
                path: '/demotionShop',
                component: resolve => require(['../components/page/SpellShopManage/ShopLevel/DemotionShop.vue'], resolve),
                meta: { title: '店铺降级设置' }
            },

            {
                name: 'shopInfo',
                path: '/shopInfo',
                component: resolve => require(['../components/page/SpellShopManage/ShopManage/ShopInfo.vue'], resolve),
                meta: { title: '店铺详情' }
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
                meta: { title: '成员管理' }
            },
            {
                name: 'shareBonusInfo',
                path: '/shareBonusInfo',
                component: resolve => require(['../components/page/SpellShopManage/ShopManage/ShareBonusInfo.vue'], resolve),
                meta: { title: '分红详情' }
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
                meta: { title: '店铺公告' }
            },
            {
                name: 'tradeInfo',
                path: '/tradeInfo',
                component: resolve => require(['../components/page/SpellShopManage/ShopManage/TradeInfo.vue'], resolve),
                meta: { title: '账户交易明细' }
            },

            {
                name: 'recruitShopInfo',
                path: '/recruitShopInfo',
                component: resolve => require(['../components/page/SpellShopManage/RecruitShopManage/RecruitShopInfo.vue'], resolve),
                meta: { title: '招募店铺详情' }
            },
            // 会员管理

            {
                name: 'LevelInfo',
                path: '/LevelInfo',
                component: resolve => require(['../components/page/MemberManage/LevelManage/LevelInfo.vue'], resolve),
                meta: { title: '层级信息' }
            },


            {
                name: 'lowerMemberManage',
                path: '/lowerMemberManage',
                component: resolve => require(['../components/page/MemberManage/MemberManage/LowerMemberManage.vue'], resolve),
                meta: { title: '下级代理' }
            },
            {
                name: 'MemberAccount',
                path: '/MemberAccount',
                component: resolve => require(['../components/page/MemberManage/MemberManage/MemberAccount.vue'], resolve),
                meta: { title: '会员账户' }
            },
            {
                name: 'MemberCard',
                path: '/MemberCard',
                component: resolve => require(['../components/page/MemberManage/MemberManage/MemberCard.vue'], resolve),
                meta: { title: '会员银行卡' }
            },
            {
                name: 'memberDetail',
                path: '/memberDetail',
                component: resolve => require(['../components/page/MemberManage/MemberManage/MemberDetail.vue'], resolve),
                meta: { title: '会员详情' }
            },
            {
                name: 'memberTree',
                path: '/memberTree',
                component: resolve => require(['../components/page/MemberManage/MemberManage/MemberTree.vue'], resolve),
                meta: { title: '会员树状图' }
            },
            {
                name: 'showMsg',
                path: '/showMsg',
                component: resolve => require(['../components/page/MemberManage/MemberManage/showMsg.vue'], resolve),
                meta: { title: '店铺信息' }
            },
            {
                name: 'sendInvite',
                path: '/sendInvite',
                component: resolve => require(['../components/page/MemberManage/JoinManage/SendInvite.vue'], resolve),
                meta: { title: '邀请发起' }
            },
            {
                name: 'inviteDetail',
                path: '/inviteDetail',
                component: resolve => require(['../components/page/MemberManage/JoinManage/InviteDetail.vue'], resolve),
                meta: { title: '邀请详情' }
            },
            {
                name: 'inviteLink',
                path: '/inviteLink',
                component: resolve => require(['../components/page/MemberManage/JoinManage/InviteLink.vue'], resolve),
                meta: { title: '邀请链接' }
            },
            {
                name: 'operateLog',
                path: '/operateLog',
                component: resolve => require(['../components/page/MemberManage/OperateLog/OperateLog.vue'], resolve),
                meta: { title: '查看会员操作日志' }
            },
            {
                name: 'cashAccountBalance',
                path: '/cashAccountBalance',
                component: resolve => require(['../components/page/MemberManage/UserAccount/CashAccountBalance.vue'], resolve),
                meta: { title: '现金账户收支明细' }
            },
            {
                name: 'tokenAccountBalance',
                path: '/tokenAccountBalance',
                component: resolve => require(['../components/page/MemberManage/UserAccount/TokenAccountBalance.vue'], resolve),
                meta: { title: '代币账户收支明细' }
            },
            {
                name: 'shareAccountBalance',
                path: '/shareAccountBalance',
                component: resolve => require(['../components/page/MemberManage/UserAccount/ShareAccountBalance.vue'], resolve),
                meta: { title: '分红账户收支明细' }
            },
            {
                name: 'integralAccountBalance',
                path: '/integralAccountBalance',
                component: resolve => require(['../components/page/MemberManage/UserAccount/IntegralAccountBalance.vue'], resolve),
                meta: { title: '积分账户收支明细' }
            },
            {
                name: 'withDrawAccount',
                path: '/withDrawAccount',
                component: resolve => require(['../components/page/MemberManage/UserAccount/WithDrawAccount.vue'], resolve),
                meta: { title: '待提现账户' }
            },
            {
                name: 'accountRecharge',
                path: '/accountRecharge',
                component: resolve => require(['../components/page/MemberManage/AccountRecharge.vue'], resolve),
                meta: { title: '账户充值' }
            },
            {
                name: 'realNameInfo',
                path: '/realNameInfo',
                component: resolve => require(['../components/page/MemberManage/RealNameInfo.vue'], resolve),
                meta: { title: '实名信息' }
            },

            {
                name: 'activityParams',
                path: '/activityParams',
                component: resolve => require(['../components/page/MemberManage/activityParams.vue'], resolve),
                meta: { title: '活跃度参数设置' }
            },

            {
                name: 'supplierDetail',
                path: '/supplierDetail',
                component: resolve => require(['../components/page/MemberManage/SupplierManage/SupplierDetail.vue'], resolve),
                meta: { title: '供应商详情' }
            },
            {
                name: 'addSupplier',
                path: '/addSupplier',
                component: resolve => require(['../components/page/MemberManage/SupplierManage/AddSupplier.vue'], resolve),
                meta: { title: '添加供应商' }
            },
            {
                name: 'editSupplier',
                path: '/editSupplier',
                component: resolve => require(['../components/page/MemberManage/SupplierManage/EditSupplier.vue'], resolve),
                meta: { title: '编辑供应商' }
            },
            {
                name: 'promotionManage',
                path: '/promotionManage',
                component: resolve => require(['../components/page/MemberManage/PromotionManage.vue/PromotionManage.vue'], resolve),
                meta: { title: '晋升设置' }
            },
            {
                name: 'degradeManage',
                path: '/degradeManage',
                component: resolve => require(['../components/page/MemberManage/DegradeManage.vue/DegradeManage.vue'], resolve),
                meta: { title: '降级设置' }
            },

            {
                name: 'releaseProduct',
                path: '/releaseProduct',
                component: resolve => require(['../components/page/BrandProduct/ProductManage/ReleaseProduct.vue'], resolve),
                meta: { title: '发布产品' }
            },
            {
                name: 'editProduct',
                path: '/editProduct',
                component: resolve => require(['../components/page/BrandProduct/ProductManage/EditProduct.vue'], resolve),
                meta: { title: '编辑产品' }
            },
            {
                name: 'productSpecifications',
                path: '/productSpecifications',
                component: resolve => require(['../components/page/BrandProduct/ProductManage/ProductSpecifications.vue'], resolve),
                meta: { title: '产品规格' }
            },
            {
                name: 'productInfo',
                path: '/productInfo',
                component: resolve => require(['../components/page/BrandProduct/ProductManage/ProductInfo.vue'], resolve),
                meta: { title: '产品详情' }
            },
            {
                name: 'priceManage',
                path: '/priceManage',
                component: resolve => require(['../components/page/BrandProduct/ProductManage/PriceManage.vue'], resolve),
                meta: { title: '产品价格管理' }
            },
            {
                name: 'productInventory',
                path: '/productInventory',
                component: resolve => require(['../components/page/BrandProduct/ProductManage/ProductInventory.vue'], resolve),
                meta: { title: '产品库存管理' }
            },
            {
                name: 'editInventory',
                path: '/editInventory',
                component: resolve => require(['../components/page/BrandProduct/ProductManage/EditInventory.vue'], resolve),
                meta: { title: '库存编辑' }
            },
            {
                name: 'inventoryInfo',
                path: '/inventoryInfo',
                component: resolve => require(['../components/page/BrandProduct/ProductManage/InventoryInfo.vue'], resolve),
                meta: { title: '库存详情' }
            },

            // 服务管理

            {
                name: 'addNoticeInform',
                path: '/addNoticeInform',
                component: resolve => require(['../components/page/OperateManage/NoticeInformManage/AddNoticeInform.vue'], resolve),
                meta: { title: '发布通知/公告' }
            },
            {
                name: 'noticeInformDetail',
                path: '/noticeInformDetail',
                component: resolve => require(['../components/page/OperateManage/NoticeInformManage/NoticeInformDetail.vue'], resolve),
                meta: { title: '通知/公告详情' }
            },
            {
                name: 'editNotice',
                path: '/editNotice',
                component: resolve => require(['../components/page/OperateManage/NoticeInformManage/EditNotice.vue'], resolve),
                meta: { title: '编辑公告' }
            },
            // 溯源管理
            {
                name: 'rootsCodeMange',
                path: '/rootsCodeMange',
                component: resolve => require(['../components/page/RootsMange/RootsCodeMange.vue'], resolve),
                meta: { title: '溯源防伪码管理' }
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
                meta: { title: '防伪码模板' }
            },
            {
                name: 'rootsCodeParams',
                path: '/rootsCodeParams',
                component: resolve => require(['../components/page/RootsMange/RootsCodeParams.vue'], resolve),
                meta: { title: '防伪码参数设置' }
            },
            // 权限管理

            {
                name: 'addManger',
                path: '/addManger',
                component: resolve => require(['../components/page/Permission/AddManger.vue'], resolve),
                meta: { title: '添加管理员' }
            },
            {
                name: 'editManger',
                path: '/editManger',
                component: resolve => require(['../components/page/Permission/EditManger.vue'], resolve),
                meta: { title: '编辑管理员' }
            },
            {
                name: 'showMangeLog',
                path: '/showMangeLog',
                component: resolve => require(['../components/page/Permission/ShowMangeLog.vue'], resolve),
                meta: { title: '操作日志' }
            },
            {
                name: 'jobsPermissionMange',
                path: '/jobsPermissionMange',
                component: resolve => require(['../components/page/Permission/JobsPermissionMange.vue'], resolve),
                meta: { title: '岗位权限管理' }
            },
            {
                name: 'addJobsPermission',
                path: '/addJobsPermission',
                component: resolve => require(['../components/page/Permission/AddJobsPermission.vue'], resolve),
                meta: { title: '添加岗位权限' }
            },
            {
                name: 'editJobsPermission',
                path: '/editJobsPermission',
                component: resolve => require(['../components/page/Permission/EditJobsPermission.vue'], resolve),
                meta: { title: '编辑岗位权限' }
            },
            {
                name: 'setPermission',
                path: '/setPermission',
                component: resolve => require(['../components/page/Permission/SetPermission.vue'], resolve),
                meta: { title: '权限设置' }
            },
            {
                name: 'editMangerMsg',
                path: '/editMangerMsg',
                component: resolve => require(['../components/page/Permission/EditMangerMsg.vue'], resolve),
                meta: { title: '管理员基础信息修改' }
            },
            {
                name: 'organizeMange',
                path: '/organizeMange',
                component: resolve => require(['../components/page/Permission/OrganizeMange/OrganizeMange.vue'], resolve),
                meta: { title: '组织结构管理' }
            },

            {
                name: 'dataDictionary',
                path: '/dataDictionary',
                component: resolve => require(['../components/page/Permission/DataDictionary.vue'], resolve),
                meta: { title: '数据字典' }
            },
            // 运营管理

            {
                name: 'foundCategory',
                path: '/foundCategory',
                component: resolve => require(['../components/page/OperateManage/showField/found/foundCategory.vue'], resolve),
                meta: { title: '分类列表' }
            },
            {
                name: 'addFoundCategory',
                path: '/addFoundCategory',
                component: resolve => require(['../components/page/OperateManage/showField/found/addFoundCategory.vue'], resolve),
                meta: { title: '分类管理' }
            },
            {
                name: 'foundList',
                path: '/foundList',
                component: resolve => require(['../components/page/OperateManage/showField/found/foundList.vue'], resolve),
                meta: { title: '发现列表' }
            },
            {
                name: 'addFound',
                path: '/addFound',
                component: resolve => require(['../components/page/OperateManage/showField/found/addFound.vue'], resolve),
                meta: { title: '秀场管理' }
            },
            {
                name: 'articalInfo',
                path: '/articalInfo',
                component: resolve => require(['../components/page/OperateManage/showField/found/articalInfo.vue'], resolve),
                meta: { title: '查看' }
            },


            {
                name: 'questionList',
                path: '/questionList',
                component: resolve => require(['../components/page/OperateManage/HelpCenter/QuestionList.vue'], resolve),
                meta: { title: '问题列表' }
            },
            {
                name: 'addQuestion',
                path: '/addQuestion',
                component: resolve => require(['../components/page/OperateManage/HelpCenter/AddQuestion.vue'], resolve),
                meta: { title: '添加问题' }
            },
            {
                name: 'editQuestion',
                path: '/editQuestion',
                component: resolve => require(['../components/page/OperateManage/HelpCenter/EditQuestion.vue'], resolve),
                meta: { title: '编辑问题' }
            },
            {
                name: 'questionInfo',
                path: '/questionInfo',
                component: resolve => require(['../components/page/OperateManage/HelpCenter/QuestionInfo.vue'], resolve),
                meta: { title: '问题详情' }
            },

            {
                name: 'productLabel',
                path: '/productLabel',
                component: resolve => require(['../components/page/OperateManage/LabelManage/ProductLabel/ProductLabel.vue'], resolve),
                meta: { title: '产品品类' }
            },
            {
                name: 'productLabelClassify',
                path: '/productLabelClassify',
                component: resolve => require(['../components/page/OperateManage/LabelManage/ProductLabelClassify/ProductLabelClassify.vue'], resolve),
                meta: { title: '产品标签类型设置' }
            },
            {
                name: 'productSecondClassify',
                path: '/productSecondClassify',
                component: resolve => require(['../components/page/OperateManage/LabelManage/ProductSecondClassify/ProductSecondClassify.vue'], resolve),
                meta: { title: '产品二级类目' }
            },
            {
                name: 'productLabelManage',
                path: '/productLabelManage',
                component: resolve => require(['../components/page/OperateManage/LabelManage/ProductSecondClassify/ProductLabelManage.vue'], resolve),
                meta: { title: '产品标签管理' }
            },

            {
                name: 'signInParamsSet',
                path: '/signInParamsSet',
                component: resolve => require(['../components/page/OperateManage/SignInManage/SignInParamsSet/SignInParamsSet.vue'], resolve),
                meta: { title: '签到参数设置' }
            },

            {
                name: 'promotionOrderList',
                path: '/promotionOrderList',
                component: resolve => require(['../components/page/OperateManage/PromotionOrderManage/PromotionOrderManage/PromotionOrderList.vue'], resolve),
                meta: { title: '推广订单查看' }
            },
            {
                name: 'promotionOrderInfo',
                path: '/promotionOrderInfo',
                component: resolve => require(['../components/page/OperateManage/PromotionOrderManage/PromotionOrderManage/PromotionOrderInfo.vue'], resolve),
                meta: { title: '推广订单详情' }
            },
            {
                name: 'packageManage',
                path: '/packageManage',
                component: resolve => require(['../components/page/OperateManage/PromotionOrderManage/PackageManage/PackageManage.vue'], resolve),
                meta: { title: '套餐管理' }
            },
            {
                name: 'addPromotionPackage',
                path: '/addPromotionPackage',
                component: resolve => require(['../components/page/OperateManage/PromotionOrderManage/PackageManage/AddPromotionPackage.vue'], resolve),
                meta: { title: '新建套餐' }
            },
            {
                name: 'packageDetail',
                path: '/packageDetail',
                component: resolve => require(['../components/page/OperateManage/PromotionOrderManage/PackageManage/PackageDetail.vue'], resolve),
                meta: { title: '套餐详情' }
            },
            {
                name: 'redPackageSet',
                path: '/redPackageSet',
                component: resolve => require(['../components/page/OperateManage/PromotionOrderManage/RedPackageSet/RedPackageSet.vue'], resolve),
                meta: { title: '红包翻倍周期设置' }
            },


            {
                name: 'featuredManage',
                path: '/featuredManage',
                component: resolve => require(['../components/page/OperateManage/FeaturedManage.vue'], resolve),
                meta: { title: '推荐位管理' }
            },
            {
                name: 'featured',
                path: '/featured',
                component: resolve => require(['../components/page/OperateManage/Featured.vue'], resolve),
                meta: { title: '推荐位管理' }
            },
            {
                name: 'appBannerAdv',
                path: '/appBannerAdv',
                component: resolve => require(['../components/page/OperateManage/AdvertisingManage/AppBannerAdv.vue'], resolve),
                meta: { title: 'app首页Banner广告位' }
            },
            {
                name: 'recommendList',
                path: '/recommendList',
                component: resolve => require(['../components/page/OperateManage/AdvertisingManage/RecommendList.vue'], resolve),
                meta: { title: '推荐位管理' }
            },
            {
                name: 'recommendMange',
                path: '/recommendMange',
                component: resolve => require(['../components/page/OperateManage/AdvertisingManage/RecommendMange.vue'], resolve),
                meta: { title: '推荐产品管理' }
            },


            {
                name: 'deliveryAddress',
                path: '/deliveryAddress',
                component: resolve => require(['../components/page/OperateManage/DeliveryAddress.vue'], resolve),
                meta: { title: '提货地址设置' }
            },


            {
                name: 'couponDetail',
                path: '/couponDetail',
                component: resolve => require(['../components/page/OperateManage/DiscountCoupon/CouponDetail.vue'], resolve),
                meta: { title: '优惠券详情' }
            },
            {
                name: 'addCoupon',
                path: '/addCoupon',
                component: resolve => require(['../components/page/OperateManage/DiscountCoupon/AddCoupon.vue'], resolve),
                meta: { title: '添加优惠券' }
            },
            {
                name: 'editCoupon',
                path: '/editCoupon',
                component: resolve => require(['../components/page/OperateManage/DiscountCoupon/EditCoupon.vue'], resolve),
                meta: { title: '编辑优惠券' }
            },
            {
                name: 'couponData',
                path: '/couponData',
                component: resolve => require(['../components/page/OperateManage/DiscountCoupon/CouponData.vue'], resolve),
                meta: { title: '券数据' }
            },
            {
                name: 'couponTemplate',
                path: '/couponTemplate',
                component: resolve => require(['../components/page/OperateManage/DiscountCoupon/CouponTemplate.vue'], resolve),
                meta: { title: '优惠券模版' }
            },

            {
                name: 'topicPreview',
                path: '/topicPreview',
                component: resolve => require(['../components/page/OperateManage/ProjectMange/TopicPreview.vue'], resolve),
                meta: { title: '专题预览' }
            },
            {
                name: 'topicTemplate',
                path: '/topicTemplate',
                component: resolve => require(['../components/page/OperateManage/ProjectMange/TopicTemplate.vue'], resolve),
                meta: { title: '专题模板' }
            },
            {
                name: 'addProject',
                path: '/addProject',
                component: resolve => require(['../components/page/OperateManage/ProjectMange/addProject.vue'], resolve),
                meta: { title: '专题设置' }
            },

            {
                name: 'depreciate',
                path: '/depreciate',
                component: resolve => require(['../components/page/OperateManage/MarketTools/Depreciate/Depreciate.vue'], resolve),
                meta: { title: '降价拍' }
            },
            {
                name: 'addDepreciate',
                path: '/addDepreciate',
                component: resolve => require(['../components/page/OperateManage/MarketTools/Depreciate/AddDepreciate.vue'], resolve),
                meta: { title: '新建降价拍' }
            },
            {
                name: 'depreciateInfo',
                path: '/depreciateInfo',
                component: resolve => require(['../components/page/OperateManage/MarketTools/Depreciate/DepreciateInfo.vue'], resolve),
                meta: { title: '降价拍详情' }
            },
            {
                name: 'secKill',
                path: '/secKill',
                component: resolve => require(['../components/page/OperateManage/MarketTools/SecKill/SecKill.vue'], resolve),
                meta: { title: '秒杀' }
            },
            {
                name: 'addSecKill',
                path: '/addSecKill',
                component: resolve => require(['../components/page/OperateManage/MarketTools/SecKill/AddSecKill.vue'], resolve),
                meta: { title: '新建秒杀' }
            },
            {
                name: 'secKillInfo',
                path: '/secKillInfo',
                component: resolve => require(['../components/page/OperateManage/MarketTools/SecKill/SecKillInfo.vue'], resolve),
                meta: { title: '秒杀详情' }
            },
            {
                name: 'packageList',
                path: '/packageList',
                component: resolve => require(['../components/page/OperateManage/MarketTools/Package/PackageList.vue'], resolve),
                meta: { title: '优惠套餐' }
            },
            {
                name: 'addPackage',
                path: '/addPackage',
                component: resolve => require(['../components/page/OperateManage/MarketTools/Package/AddPackage.vue'], resolve),
                meta: { title: '新建套餐' }
            },
            {
                name: 'editPackage',
                path: '/editPackage',
                component: resolve => require(['../components/page/OperateManage/MarketTools/Package/EditPackage.vue'], resolve),
                meta: { title: '编辑套餐' }
            },
            {
                name: 'packageInfo',
                path: '/packageInfo',
                component: resolve => require(['../components/page/OperateManage/MarketTools/Package/PackageInfo.vue'], resolve),
                meta: { title: '套餐详情' }
            },
            {
                name: 'priceInventory',
                path: '/priceInventory',
                component: resolve => require(['../components/page/OperateManage/MarketTools/Package/PriceInventory.vue'], resolve),
                meta: { title: '价格库存' }
            },
            {
                name: 'packageInventory',
                path: '/packageInventory',
                component: resolve => require(['../components/page/OperateManage/MarketTools/Package/PackageInventory.vue'], resolve),
                meta: { title: '库存管理' }
            },
            {
                name: 'packageProductManege',
                path: '/packageProductManege',
                component: resolve => require(['../components/page/OperateManage/MarketTools/Package/PackageProductManage.vue'], resolve),
                meta: { title: '产品管理' }
            },
            {
                name: 'prizePoll',
                path: '/prizePoll',
                component: resolve => require(['../components/page/OperateManage/MarketTools/PrizePoll/PrizePoll.vue'], resolve),
                meta: { title: '奖品池管理' }
            },
            {
                name: 'blockStockActivity',
                path: '/blockStockActivity',
                component: resolve => require(['../components/page/OperateManage/MarketTools/PrizePoll/BlockStockActivity.vue'], resolve),
                meta: { title: '冻结库存活动' }
            },
            {
                name: 'scratchCardsList',
                path: '/scratchCardsList',
                component: resolve => require(['../components/page/OperateManage/MarketTools/ScratchCards/ScratchCardsList'], resolve),
                meta: { title: '刮刮卡' }
            },
            {
                name: 'cardMange',
                path: '/cardMange',
                component: resolve => require(['../components/page/OperateManage/MarketTools/ScratchCards/cardMange'], resolve),
                meta: { title: '刮刮卡管理' }
            },
            {
                name: 'cardInfo',
                path: '/cardInfo',
                component: resolve => require(['../components/page/OperateManage/MarketTools/ScratchCards/cardInfo'], resolve),
                meta: { title: '刮刮卡详情' }
            },
            {
                name: 'activityUse',
                path: '/activityUse',
                component: resolve => require(['../components/page/OperateManage/MarketTools/ScratchCards/activityUse'], resolve),
                meta: { title: '当前活动使用' }
            },
            // {
            //     name: 'labelManage',
            //     path: '/labelManage',
            //     component: resolve => require(['../components/page/OperateManage/LabelManage/SignInManage.vue'], resolve),
            //     meta: { title: '标签管理' }
            // },
            // {
            //     name: 'productLabel',
            //     path: '/productLabel',
            //     component: resolve => require(['../components/page/OperateManage/LabelManage/SignInParamsSet/SignInParamsSet.vue'], resolve),
            //     meta: { title: '产品标签' }
            // },
            // 订单管理

            {
                name: 'orderInfo',
                path: '/orderInfo',
                component: resolve => require(['../components/page/OrderManage/OrderManage/OrderInfo.vue'], resolve),
                meta: { title: '订单详情' }
            },
            {
                name: 'afterSaleOpr',
                path: '/afterSaleOpr',
                component: resolve => require(['../components/page/OrderManage/OrderManage/AfterSaleOpr.vue'], resolve),
                meta: { title: '申请操作' }
            },
            {
                name: 'logistics',
                path: '/logistics',
                component: resolve => require(['../components/page/OrderManage/OrderManage/Logistics.vue'], resolve),
                meta: { title: '物流详情' }
            },

            {
                name: 'giftOrderInfo',
                path: '/giftOrderInfo',
                component: resolve => require(['../components/page/OrderManage/GiftOrderManage/GiftOrderInfo.vue'], resolve),
                meta: { title: '礼包订单详情' }
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
                name: 'flatAct01',
                path: '/flatAct01',
                component: resolve => require(['../components/page/SettlementMange/flatAccountList/flatAct01.vue'], resolve),
                meta: { title: '资金收入明细' }
            },
            {
                name: 'flatAct02',
                path: '/flatAct02',
                component: resolve => require(['../components/page/SettlementMange/flatAccountList/flatAct02.vue'], resolve),
                meta: { title: '资金收入明细' }
            },
            {
                name: 'profitTpl',
                path: '/profitTpl',
                component: resolve => require(['../components/page/SettlementMange/ProfitTpl.vue'], resolve),
                meta: { title: '利润分配模板' }
            },
            {
                name: 'showValueSet',
                path: '/showValueSet',
                component: resolve => require(['../components/page/ShowValue/ShowValueSet.vue'], resolve),
                meta: { title: '新建利润分配模板' }
            },
            {
                name: 'showTaskList',
                path: '/showTaskList',
                component: resolve => require(['../components/page/ShowValue/ShowTaskList.vue'], resolve),
                meta: { title: '用户任务看板' }
            },
            {
                name: 'showCashTaskList',
                path: '/showCashTaskList',
                component: resolve => require(['../components/page/ShowValue/ShowCashTaskList.vue'], resolve),
                meta: { title: '秀值任务查看' }
            },
            {
                name: 'showValueAccount',
                path: '/showValueAccount',
                component: resolve => require(['../components/page/MemberManage/UserAccount/ShowValueAccount.vue'], resolve),
                meta: { title: '秀值账户收支明细' }
            },
            {
                name: 'demo',
                path: '/demo',
                component: resolve => require(['../components/page/demo.vue'], resolve),
                meta: { title: 'demo' }
            },

            {
                name: 'repertorySet',
                path: '/repertorySet',
                component: resolve => require(['../components/page/RepertoryManage/RepertoryManage/RepertorySet.vue'], resolve),
                meta: { title: '仓库设置' }
            },
            {
                name: 'repertoryInfo',
                path: '/repertoryInfo',
                component: resolve => require(['../components/page/RepertoryManage/RepertoryManage/RepertoryInfo.vue'], resolve),
                meta: { title: '仓库详情' }
            },


            {
                name: 'repertoryReportSet',
                path: '/repertoryReportSet',
                component: resolve => require(['../components/page/RepertoryManage/RepertoryReport/RepertoryReportSet.vue'], resolve),
                meta: { title: '入库单设置' }
            },
            {
                name: 'repertoryReportInfo',
                path: '/repertoryReportInfo',
                component: resolve => require(['../components/page/RepertoryManage/RepertoryReport/RepertoryReportInfo.vue'], resolve),
                meta: { title: '入库单详情' }
            },
            {
                name: 'repertoryInventory',
                path: '/repertoryInventory',
                component: resolve => require(['../components/page/RepertoryManage/RepertoryData/RepertoryInventory.vue'], resolve),
                meta: { title: '仓库存货数' }
            },
            {
                name: 'repertoryInventoryInfo',
                path: '/repertoryInventoryInfo',
                component: resolve => require(['../components/page/RepertoryManage/RepertoryData/RepertoryInventoryInfo.vue'], resolve),
                meta: { title: '仓库存货数详情' }
            },
            {
                name: 'repertoryBad',
                path: '/repertoryBad',
                component: resolve => require(['../components/page/RepertoryManage/RepertoryData/RepertoryBad.vue'], resolve),
                meta: { title: '仓库报损数' }
            },
            {
                name: 'repertoryBadInfo',
                path: '/repertoryBadInfo',
                component: resolve => require(['../components/page/RepertoryManage/RepertoryData/RepertoryBadInfo.vue'], resolve),
                meta: { title: '仓库报损数详情' }
            }
        ]
    },

    { path: '*', redirect: '/404', hidden: true }
];

export const constantRouterMap = [
    {
        name: '404',
        path: '/404',
        hidden: true,
        component: resolve => require(['../components/page/404.vue'], resolve)
    },
    {
        name: 'login',
        path: '/login',
        hidden: true,
        component: resolve => require(['../components/page/Login.vue'], resolve)
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        name: 'dashboard',
        meta: { title: '系统首页', icon: 'icon-shouye' },
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                meta: { title: '系统首页', icon: 'icon-shouye' }
            }
        ]
    }
];

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
});

