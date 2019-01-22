<template>
    <div class="coupon-replacement-info" v-loading="loading">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card>
            <div slot="header">
                <span>优惠券信息</span>
            </div>
            <el-form label-width="120px" label-position="left">
                <el-form-item label="券名称">{{info.couponName}}</el-form-item>
            </el-form>
            <el-form label-width="120px" label-position="left">
                <el-form-item label="券类型">{{couponType[info.couponType]}}</el-form-item>
            </el-form>
            <el-form label-width="120px" label-position="left">
                <el-form-item label="券值">￥{{couponInfo.value || 0}}</el-form-item>
            </el-form>
            <el-form label-width="120px" label-position="left">
                <el-form-item label="使用限制">{{couponInfo.useConditions === undefined || couponInfo.useConditions === null? '-': `满${couponInfo.useConditions}可用`}}</el-form-item>
            </el-form>
            <el-form label-width="120px" label-position="left">
                <el-form-item label="可用周期">{{couponInfo.effectiveDays === undefined || couponInfo.effectiveDays === null ? '-' : `${couponInfo.effectiveDays}天`}}</el-form-item>
            </el-form>
            <el-form label-width="120px" label-position="left">
                <el-form-item label="到期提醒">{{couponInfo.waitDays === undefined || couponInfo.waitDays === null ? '-' : `${couponInfo.waitDays}天`}}</el-form-item>
            </el-form>
            <el-form label-width="120px" label-position="left">
                <el-form-item label="可用品类">
                    <p>一级类目：{{couponInfo.firstCategoryNames || '-'}}</p>
                    <p>二级类目：{{couponInfo.secondCategoryNames || '-'}}</p>
                    <p>三级类目：{{couponInfo.thirdCategoryNames || '-'}}</p>
                    <p>商品ID: {{couponInfo.prodCodes || '-'}}</p>
                </el-form-item>
            </el-form>
            <el-form label-width="120px" label-position="left">
                <el-form-item label="可用层级">{{couponInfo.userLevel}}</el-form-item>
            </el-form>
            <el-form label-width="120px" label-position="left">
                <el-form-item v-if="couponInfo.totalNumber == -1" label="发放数量">不限量</el-form-item>
                <el-form-item v-else label="发放数量">{{couponInfo.totalNumber || '-'}}张</el-form-item>
            </el-form>
            <el-form label-width="120px" label-position="left">
                <el-form-item v-if="couponInfo.getLimit == -1" label="每人限领">不限量</el-form-item>
                <el-form-item v-else label="每人限领">{{couponInfo.getLimit || '-'}}张</el-form-item>
            </el-form>
            <el-form label-width="120px" label-position="left">
                <el-form-item label="优惠券说明">{{couponInfo.remarks || '-'}}</el-form-item>
            </el-form>
        </el-card>
        <el-card class="mt10">
            <div slot="header">
                <span>发放记录</span>
            </div>
            <p class="record">
                <span>创建人：{{info.submitName}}</span>
                <span>创建时间：{{info.createTime | formatDateAll}}</span>
                <span>审核状态：
                    <el-tag v-if="status == 2 || status == 4 || status == 5" type="danger">已审核</el-tag>
                    <el-tag v-else-if="status == 1" type="danger">审核中</el-tag>
                    <el-tag v-else-if="status == 3" type="danger">审核驳回</el-tag>
                    <el-tag v-else type="danger">-</el-tag>
                </span>
                <span v-if="info.genre == 1">发放方式：条件发放</span>
                <span v-else-if="info.genre == 2">发放方式：定向发放</span>
                <span v-else>发放方式：-</span>
                <span>发放人数：{{ info.personNum?info.personNum : '/' }}人</span>
                <span>发放张数/人：1张</span>
            </p>
            <p class="record">
                备注：{{info.remark}}
            </p>
            <p class="record">
                <span>审核人：{{info.reviewName || '/'}}</span>
                <span>审核时间：{{info.auditTime | formatDateAll}}</span>
                <span>审核说明：{{info.reply  || '/'}}</span>
            </p>
        </el-card>
        <!--條件發放-->
        <el-card v-if="info.genre == 2" class="mt10">
            <div slot="header">
                <span>发放号码</span>
            </div>
            <div class="phone-list">
                <el-tag type="info" v-for="(v, k) in info.phoneList" :key="k">{{v}}</el-tag>
            </div>
        </el-card>
        <!--定向發放-->
        <el-card v-else class="mt10">
            <div slot="header">
                <span>发放条件</span>
            </div>
            <p class="record">
                <span>发放层级：{{info.levelIds}}</span>
            </p>
            <p class="record">
                <span>注册时间：{{info.startTime | formatDateAll}} - {{info.endTime | formatDateAll}}</span>
            </p>
        </el-card>
        <el-card class="mt10">
            <div slot="header">
                <span>发放人数统计</span>
            </div>
            <p class="record">
                <span class="tip">发放失败人数：<el-tag type="danger">{{info.errorNum || '/'}}人</el-tag></span>
            </p>
            <p class="record">
                <span class="tip">发放成功人数：<el-tag type="danger">{{info.successNum || '/'}}人</el-tag></span>
            </p>
            <el-button class="mt10" type="primary" @click="$router.push('couponReplacement')">返回列表</el-button>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import request from '@/http/http.js';
    export default {
        components: { vBreadcrumb },
        data() {
            return {
                nav: ['运营管理', '营销工具管理', '优惠券发放列表', '优惠券详情'],
                couponType: { 1: '满减券', 2: '抵价券', 3: '折扣券', 4: '抵扣券' },
                loading: false,
                id: '',
                info: {},
                couponInfo: {},
                status: '' // 1提交审核 2，4，5审核通过 3审核失败
            };
        },
        mounted() {
            this.id = this.$route.query.replacementCouponId;
            this.getUserInfo();
        },
        methods: {
            getUserInfo() {
                request.findReissueById({ id: this.id }).then(res => {
                    this.info = res.data || {};
                    this.couponInfo = this.info.couponDetailExt || {};
                    this.status = this.info.status;
                    const userLevel = JSON.parse(this.info.levelIds) || [];
                    if (userLevel.length !== 0) {
                        this.info.levelIds = userLevel.map(v => `v${v}`).join(',');
                    } else {
                        this.info.levelIds = '';
                    }
                    if (this.couponInfo.userLevel && this.couponInfo.userLevel.length !== 0) {
                        const tmp = [];
                        if (this.couponInfo.userLevel && this.couponInfo.userLevel.length !== 0) {
                            this.couponInfo.userLevel.forEach(v => {
                                const name = `v${v.userLevelId}`;
                                tmp.push(name);
                            });
                            this.couponInfo.userLevel = tmp.join(',');
                        } else {
                            this.couponInfo.userLevel = [];
                        }
                    }
                    this.info.phoneList = this.info.phoneList && this.info.phoneList.length !== 0 ? this.info.phoneList : [];
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };
</script>

<style lang="less" scoped>
.coupon-replacement-info{
    .record {
        font-size: 14px;
        &:not(:first-child){
            margin-top: 20px;
        }
        span{
            margin-right: 30px;
        }
        .tip {
            font-weight: 900;
        }
    }
    .phone-list {
        border: 1px solid #ccc;
        padding: 10px;
        max-height: 300px;
        overflow-y: auto;
    }
}
</style>
