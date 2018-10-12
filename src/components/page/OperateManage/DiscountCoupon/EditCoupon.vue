<template>
    <div class="add-coupon">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
            <div class="pro-title">编辑优惠券</div>
            <el-form :model="form" ref="form" :rules="rules" label-width="100px">
                <el-form-item prop="name" label="券名称">
                    <el-input v-model="form.name" placeholder="请输入优惠券名称"></el-input>
                </el-form-item>
                <el-form-item label="券类型">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option v-for="(v,k) in typeArr" :key="k" :label="v.name"
                                   :value="v.type"></el-option>
                    </el-select>
                </el-form-item>
                <div class="line"></div>
                <el-form-item label="券值" v-if="form.type!=3">
                    <el-input v-model="form.value" placeholder="请输入券值"></el-input>
                    元
                </el-form-item>
                <el-form-item label="折扣" v-else>
                    <el-select v-model="form.value" placeholder="请选择">
                        <el-option v-for="(v,k) in discountArr" :key="k" :label="v.name"
                                   :value="v.type"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="券模板">
                    <el-select v-model="form.couponTemplateId" placeholder="请选择券模板">
                        <el-option v-for="(v,k) in tempArr" :key="k" :label="v.name"
                                   :value="v.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="使用限制" style="margin-top: 30px" v-if="form.type!=4&&form.type!=2">
                    满
                    <el-input v-model="useConditions" placeholder="请输入金额"></el-input>
                    元可用
                </el-form-item>
                <el-form-item label="可用周期">
                    <div style="display: inline-block;margin: 0 50px 10px 0">领到券当日开始
                        <el-input class="sml-inp" v-model="day" :disabled="isDay"></el-input>
                        天内有效
                    </div>
                    <el-checkbox v-model="isDay">设置为礼包周期优惠券</el-checkbox>
                    <div v-if="isDay">领到券当天后
                        <el-input class="sml-inp" v-model="waitDays"></el-input>天，开始生效，
                        <el-input class="sml-inp" v-model="effectiveDays"></el-input>天后失效。
                    </div>
                </el-form-item>
                <el-form-item label="到期提醒">
                    <el-checkbox v-model="remindFlag">到期前<el-input :disabled="!remindFlag" v-model="remindDays" class="sml-inp"></el-input>天提醒一次</el-checkbox>
                </el-form-item>
                <el-form-item label="可用品类">
                    <!--<div @click="chooseBrand"><span class="choose-brand">请选择品类</span></div>-->
                    <!--<template v-for="item in package">-->
                    <!--<div>{{item.firstCategoryName}}-{{item.secondCategoryName}}</div>-->
                    <!--<div>产品ID:{{item.products}}</div>-->
                    <!--</template>-->
                    <v-onlychoose @getProductIds="getProductIds" :getProducts="getProducts" :isOnly="isOnly" v-show="form.type==4"></v-onlychoose>
                    <v-multichoose @getProductIds="getProductIds" :getProducts="getProducts" :isOnly="isOnly" v-show="form.type!=4"></v-multichoose>

                </el-form-item>
                <el-form-item label="可使用用户层级" class="role-choose">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                        全部用户
                    </el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="checkedUsers" @change="handleCheckedUsersChange">
                        <el-checkbox v-for="(item,index) in users" :label="item" :key="index">{{item.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="发放数量">
                    <el-input class="mid-inp" v-model="form.totalNumber" :disabled="totalNumber"></el-input>
                    张
                    <span><el-checkbox style="margin-left: 10px" v-model="totalNumber">不限制</el-checkbox></span>
                </el-form-item>
                <el-form-item label="每人限额">
                    <el-input class="mid-inp" v-model="form.getLimit" :disabled="getLimit"></el-input>
                    张
                    <span><el-checkbox style="margin-left: 10px" v-model="getLimit">不限制</el-checkbox></span>
                </el-form-item>

                <el-form-item label="优惠券说明">
                    <el-input type="textarea" v-model="form.remarks" placeholder="请输入说明"></el-input>
                </el-form-item>

                <el-button type="primary" :loading="btnLoading" @click="submitForm('form')">提交</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form>
        </el-card>
        <!--<v-choosebrand v-if="isChooseBrand" :productIds="productIds" :type="type" @chooseProduct="getProductIds"></v-choosebrand>-->
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import vMultichoose from '@/components/common/discountCoupon/multiChoose.vue';
    import vOnlychoose from '@/components/common/discountCoupon/onlyChoose.vue';
    import icon from '@/components/common/ico';
    import * as pApi from '@/privilegeList/OperateManage/DiscountCoupon/index.js';
    import utils from '@/utils/index.js';
    import request from '@/http/http.js';

    export default {
        components: {
            vBreadcrumb,
            vOnlychoose,
            icon,
            vMultichoose
        },

        data() {
            var checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('模版名称不能为空'));
                } else {
                    const reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,16}$/;
                    if (!reg.test(value)) {
                        callback(new Error('请输入2-16位由汉字字母数字组成的名称'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                rules: {
                    name: [
                        { validator: checkName, trigger: 'blur' }
                    ]
                },
                nav: ['运营管理', '优惠券设置', '编辑优惠券'],
                // 用户层级
                checkAll: false,
                checkedUsers: [],
                users: [],
                isIndeterminate: false,
                // 表单
                form: {
                    name: '',
                    type: 2,
                    value: '',
                    couponTemplateId: '',
                    totalNumber: '',
                    getLimit: '',
                    remarks: ''
                },
                typeArr: [{// 优惠券类型
                    name: '满减券(商品满额可用)',
                    type: 1
                }, {
                    name: '抵价券(商品直接抵价)',
                    type: 2
                }, {
                    name: '折扣券(打折百分比券)',
                    type: 3
                }, {
                    name: '抵扣券',
                    type: 4
                }],
                discountArr: [{// 折扣值
                    name: '1折',
                    type: 10
                }, {
                    name: '2折',
                    type: 20
                }, {
                    name: '3折',
                    type: 30
                }, {
                    name: '4折',
                    type: 40
                }, {
                    name: '5折',
                    type: 50
                }, {
                    name: '6折',
                    type: 60
                }, {
                    name: '7折',
                    type: 70
                }, {
                    name: '8折',
                    type: 80
                }, {
                    name: '9折',
                    type: 90
                }],
                tempArr: [], // 优惠券模版
                isChooseBrand: false, // 选择品类弹窗
                remindFlag: false, // 是否到期提醒
                remindDays: '', // 到期前几天提示
                waitDays: '', // 多少天开始生效
                effectiveDays: '', // 多少天失效
                data: {
                    totalNumber: '', // 发放数量
                    getLimit: ''// 每人限额
                },
                totalNumber: false, // 发放数量是否限制
                getLimit: false, // 每人限额是否限制
                productList: [], // 产品列表
                day: '', // 可用周期天
                monthOrWeek: '', // 可用周期月、周
                type: '3', // 可用周期月、周选择
                isDay: false, // 是否设置未礼包周期优惠券
                tipInf: '月', // 可用周期提示词
                useConditions: '', // 使用限制
                btnLoading: false,
                getProducts: {},
                // 0:没有指定分类 1：全品类 2：多品类 3：单分类 4：多商品 5：但商品
                categoryType: 0,
                isOnly: false
            };
        },
        activated() {
            // 数据清除
            this.checkedUsers = [];
            this.isOnly = false;
            utils.cleanFormData(this.form);

            this.queryTemplateList();// 加载优惠券模版
            this.id = this.$route.query.couponId || sessionStorage.getItem('couponId');// 获取id
            this.getDetail();// 加载详情
        },

        methods: {
            // 获取优惠券详情
            getDetail() {
                const data = {
                    id: this.id
                };
                request.findCouponById(data).then(res => {
                    const detail = res.data;
                    this.form.name = detail.name;
                    this.form.type = detail.type;
                    if (this.form.type == 4) {
                        this.isOnly = true;
                    }
                    this.form.value = detail.value;
                    this.form.couponTemplateId = detail.couponTemplateId;
                    this.form.remarks = detail.remarks;
                    this.categoryType = res.data.categoryType;
                    this.useConditions = detail.useConditions;
                    this.getProducts = {
                        firstCategoryIds: detail.firstCategoryIds,
                        secondCategoryIds: detail.secondCategoryIds,
                        thirdCategoryIds: detail.thirdCategoryIds,
                        products: detail.productIds,
                        firstCategoryNames: detail.firstCategoryNames,
                        secondCategoryNames: detail.secondCategoryNames,
                        thirdCategoryNames: detail.thirdCategoryNames,
                        productNames: detail.productNames
                    };
                    if (detail.cycleFlag == 1) { // 1是周期礼包，0不是
                        this.isDay = true;
                        this.waitDays = detail.waitDays;
                        this.effectiveDays = detail.effectiveDays;
                    } else {
                        this.isDay = false;
                        this.day = detail.effectiveDays;
                    }
                    this.remindFlag = detail.remindFlag == 1;// 1提醒2不提醒
                    this.remindDays = detail.remindDays;// 几天前提醒
                    const userLevelIds = [];
                    for (const i in detail.userLevel) {
                        userLevelIds.push(detail.userLevel[i].userLevelId);
                    }
                    this.form.userLevelId = userLevelIds.join(',');
                    this.showLevel(userLevelIds.join(','));
                    if (detail.getLimit == -1) {
                        this.getLimit = true;
                    } else {
                        this.form.getLimit = detail.getLimit;
                    }
                    if (detail.totalNumber == -1) {
                        this.totalNumber = true;
                    } else {
                        this.form.totalNumber = detail.totalNumber;
                    }
                    const temp = {
                        firstCategoryIds: detail.firstCategoryIds,
                        secondCategoryIds: detail.secondCategoryIds,
                        thirdCategoryIds: detail.thirdCategoryIds,
                        productIds: detail.productIds
                    };
                    this.productIds = temp;
                }).catch(error => {
                    console.log(error);
                });
            },
            // 加载层级
            showLevel(userLevelId) {
                this.users = [];
                this.checkedUsers = [];
                request.getUserLevelList({}).then(res => {
                    let count = 0;
                    const arr = userLevelId.split(',');
                    for (const i in res.data) {
                        const name = res.data[i].name;
                        if (this.users.indexOf(name) == -1) {
                            this.users.push(res.data[i]);
                        }
                        for (const j in arr) {
                            if (arr[j] == res.data[i].id) {
                                count++;
                                this.checkedUsers.push(res.data[i]);
                            }
                        }
                    }
                    if (count == res.data.length) {
                        this.checkAll = true;
                        this.isIndeterminate = false;
                    } else {
                        this.isIndeterminate = true;
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            // 优惠券模版
            queryTemplateList() {
                request.queryTemplateList({}).then(res => {
                    this.tempArr = res.data;
                }).catch(error => {
                    console.log(error);
                });
            },
            // 推送人群选择
            handleCheckAllChange(val) {
                const that = this;
                that.checkedUsers = val ? that.users : [];
                that.isIndeterminate = false;
                if (val) {
                    let result = '';
                    for (let i = 0; i < that.users.length; i++) {
                        result += that.users[i].id + ',';
                    }
                    that.form.userLevelId = result.slice(0, -1);
                } else {
                    that.form.userLevelId = '';
                }
            },
            handleCheckedUsersChange(value) {
                const that = this;
                const checkedCount = value.length;
                let result = '';
                for (const i in that.users) {
                    for (const j in value) {
                        if (that.users[i].id == value[j].id) {
                            result += that.users[i].id + ',';
                        }
                    }
                }
                that.form.userLevelId = result.slice(0, -1);
                that.checkAll = checkedCount === that.users.length;
                that.isIndeterminate = checkedCount > 0 && checkedCount < that.users.length;
            },
            // 选择品类
            getProductIds(params) {
                if (params) {
                    this.productList = JSON.parse(params);
                }
            },
            // 提交表单
            submitForm(formName) {
                const that = this;
                const data = this.form;
                that.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return;
                    } else {
                        if (!data.name) {
                            this.$message.warning('请输入优惠券名称!');
                            return;
                        }
                        if (!data.type) {
                            this.$message.warning('请选择优惠券类型!');
                            return;
                        }
                        if (!data.value) {
                            if (data.type != 3) {
                                this.$message.warning('请输入券值!');
                            } else {
                                this.$message.warning('请选中折扣值!');
                            }
                            return;
                        }
                        if (!data.couponTemplateId) {
                            this.$message.warning('请选择券模板!');
                            return;
                        }
                        if (this.useConditions) {
                            data.useConditions = this.useConditions;
                        } else {
                            data.useConditions = 0;
                        }
                        data.id = this.id;
                        const reg = /^(0|[1-9]\d){1,5}$/;// 1-5位数字
                        if (!this.isDay) {
                            data.effectiveDays = this.day;
                            if (!data.effectiveDays) {
                                this.$message.warning('请输入可用周期数据!');
                                return;
                            }
                            data.waitDays = 0;
                            data.cycleFlag = 0;
                            if (!reg.test(this.day)) {
                                this.$message.warning('请输入1-5位数字的周期时间');
                                return;
                            }
                        } else {
                            data.waitDays = this.waitDays;
                            data.effectiveDays = this.effectiveDays;
                            data.cycleFlag = 1;
                            if (!data.effectiveDays || !data.waitDays) {
                                this.$message.warning('请输入可用周期数据!');
                                return;
                            }
                            if (!reg.test(this.waitDays) || !reg.test(this.effectiveDays)) {
                                this.$message.warning('请输入1-5位数字的周期时间');
                                return;
                            }
                        }
                        if (that.remindFlag) {
                            data.remindFlag = 1;
                            data.remindDays = this.remindDays;
                            if (!data.remindDays) {
                                this.$message.warning('请输入到期前提醒天数!');
                                return;
                            }
                        } else {
                            data.remindFlag = 0;
                        }
                        if (this.form.type == 4) {
                            if (that.productList.firstCategoryIds.length === 0 && that.productList.secondCategoryIds.length === 0 && that.productList.thirdCategoryIds.length === 0 && that.productList.products.length === 0) {
                                this.$message.warning('请选择可用品类!');
                                return;
                            }
                            if (that.productList.firstCategoryIds instanceof Array) {
                                data.firstCategoryIds = that.productList.firstCategoryIds.join(',');
                                data.secondCategoryIds = that.productList.secondCategoryIds.join(',');
                                data.thirdCategoryIds = that.productList.thirdCategoryIds.join(',');
                                data.productIds = that.productList.products.join(',');
                            } else {
                                data.firstCategoryIds = that.productList.firstCategoryIds;
                                data.secondCategoryIds = that.productList.secondCategoryIds;
                                data.thirdCategoryIds = that.productList.thirdCategoryIds;
                                data.productIds = that.productList.products;
                            }
                            data.categoryType = 5;
                        } else {
                            let firstCategoryIds = []; let secondCategoryIds = []; let thirdCategoryIds = []; let productIds = [];
                            firstCategoryIds = that.productList.firstCategoryIds;
                            secondCategoryIds = that.productList.secondCategoryIds;
                            thirdCategoryIds = that.productList.thirdCategoryIds;
                            productIds = that.productList.products;
                            // if (that.productList.length == 0) {
                            //     this.$message.warning('请选择可用品类!');
                            //     return;
                            // } else {
                            if (firstCategoryIds.length == 0 && secondCategoryIds.length == 0 && thirdCategoryIds.length === 0 && productIds.length == 0) {
                                this.$message.warning('请选择可用品类!');
                                return;
                            }
                            // }
                            if (that.productList.checkAll) {
                                data.categoryType = 1;// 全品类
                            } else {
                                if (firstCategoryIds.length === 0 && secondCategoryIds.length === 0 && thirdCategoryIds.length === 0 && productIds.length === 1) {
                                    data.categoryType = 5;// 单商品
                                } else if (firstCategoryIds.length === 0 && secondCategoryIds.length === 0 && thirdCategoryIds.length === 0 && productIds.length > 1) {
                                    data.categoryType = 4;// 多商品
                                } else if (((firstCategoryIds.length === 1 && secondCategoryIds.length === 0 && thirdCategoryIds.length === 0) || (firstCategoryIds.length === 0 && secondCategoryIds.length === 1 && thirdCategoryIds.length === 0) || (firstCategoryIds.length === 0 && secondCategoryIds.length === 0 && thirdCategoryIds.length === 1)) && productIds.length === 0) {
                                    data.categoryType = 3;// 单品类
                                } else {
                                    data.categoryType = 2;// 多品类
                                }
                            }

                            data.firstCategoryIds = firstCategoryIds.length ? firstCategoryIds.join(',') : '';
                            data.secondCategoryIds = secondCategoryIds.length ? secondCategoryIds.join(',') : '';
                            data.thirdCategoryIds = thirdCategoryIds.length ? thirdCategoryIds.join(',') : '';
                            data.productIds = productIds.length ? productIds.join(',') : '';
                        }
                        if (!this.checkedUsers) {
                            this.$message.warning('请选择可使用用户层级!');
                            return;
                        }
                        if (that.totalNumber) {
                            data.totalNumber = -1;
                        } else {
                            if (!data.totalNumber) {
                                this.$message.warning('请输入发放数量!');
                                return;
                            }
                        }
                        if (that.getLimit) {
                            data.getLimit = -1;
                        } else {
                            if (!data.totalNumber) {
                                this.$message.warning('请输入每人限额!');
                                return;
                            }
                        }
                        if (this.useConditions) {
                            data.useConditions = this.useConditions;
                        } else {
                            data.useConditions = 0;
                        }
                        that.btnLoading = true;
                        request.addOrModifyCoupon(data).then(res => {
                            that.$message.success(res.msg);
                            that.$router.push('/discountCoupon');
                            that.btnLoading = false;
                        }).catch(error => {
                            console.log(error);
                            that.btnLoading = false;
                        });
                    }
                });
            },
            // 取消
            cancel() {
                this.$router.push('/discountCoupon');
            }
        }
    };
</script>
<style lang='less'>
    .add-coupon {
        color: #666;
        .line {
            width: 100%;
            height: 1px;
            background: #eee;
            margin-bottom: 20px;
        }
        .el-input, .el-input__inner {
            width: 300px;
        }
        .sml-inp.el-input, .sml-inp .el-input__inner, .sml-inp .el-input {
            width: 80px;
        }
        .mid-inp.el-input, .mid-inp .el-input__inner {
            width: 180px;
        }
        .choose-brand {
            cursor: pointer;
            color: #409EFF;
        }
        .address-item {
            .el-form-item__label {
                line-height: 20px
            }
        }
        .quill-editor {
            display: inline-block;
            vertical-align: top;
        }
        .role-choose {
            .el-form-item__label {
                width: 120px !important;
            }
        }
        .el-checkbox-group {
            margin-left: 20px;
        }
        .tips {
            margin-left: 20px;
            font-size: 12px;
            color: #ff6868;
        }
        .pro-title {
            width: 100%;
            height: 60px;
            background-color: #f7f7f7;
            line-height: 60px;
            padding: 0 25px;
            box-sizing: border-box;
            margin-bottom: 20px;
        }

        .pro-weight {
            width: 80px;
            margin-right: 10px;
        }
        .product-param {
            width: 95%;
            height: 58px;
            border: 1px solid #e8edf0;
            line-height: 58px;
            padding: 0 15px;
            .inp-param {
                width: 90px;
                margin: 0 50px 0 10px;
            }
        }
        .selected-tag {
            width: 100%;
            padding: 6px 22px;
            box-sizing: border-box;
            border: 1px solid #e8edf0;
            border-radius: 5px;
            margin-top: 20px;
            .tag {
                margin-right: 5px;
            }
            .tag-tip {
                font-size: 14px;
                color: #9a9a9a;
            }
        }
        .add-tag {
            width: 100%;
            margin-top: 20px;
        }
        .tag-list {
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
            border: 1px solid #e8edf0;
            border-radius: 5px;
            margin: 10px 0 20px 0;
            .tag-tip {
                font-size: 14px;
                color: #9a9a9a;
            }
            .selected-btn {
                background-color: #409EFF;
                border-color: #409EFF;
                color: #fff;
            }
        }
        .gift-info-wrap {
            width: 100%;
            border: 1px solid #eee;
            padding: 10px;
            box-sizing: border-box;
            .gift-info-item {
                width: 100%;
                .gift-info-title {
                    position: relative;
                    width: 100%;
                    height: 60px;
                    line-height: 40px;
                    padding: 10px 30px;
                    box-sizing: border-box;
                    background-color: #f7f7f7;
                    .delete-btn {
                        position: absolute;
                        top: 16px;
                        right: 30px;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        border: 2px solid #a5a5a5;
                        cursor: pointer;
                        text-align: center;
                        line-height: 24px;
                        color: #a5a5a5;
                        font-size: 18px;
                        font-weight: 700;
                    }
                }
                .gift-info-content {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    padding-left: 60px;
                    margin: 20px 0;
                    box-sizing: border-box;
                    .el-input--small .el-input__inner {
                        line-height: 30px;
                    }
                    .el-input-group__append, .el-input-group__prepend {
                        padding: 0 5px;
                    }
                }
            }
            .gift-info-footer {
                display: inline-block;
                color: #22aeff;
                font-size: 14px;
                margin-left: 30px;
                cursor: pointer;
            }
        }
        .el-textarea {

        }
        .el-textarea__inner {
            width: 500px;
            height: 100px;
            resize: none;
        }
    }
</style>
