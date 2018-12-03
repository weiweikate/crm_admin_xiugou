<template>
    <div class="add-secKill">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
            <div class="pro-title">新建秒杀</div>
            <el-form :model="form" ref="form" :rules="rules" label-width="100px">
                <!--<el-form-item label="活动编号">-->
                <!--<span>JJP0001</span>-->
                <!--</el-form-item>-->
                <el-form-item label="选择商品">
                    <el-button type="primary" @click="chooseProduct">+添加商品</el-button>
                </el-form-item>
                <el-form-item label="商品名称">
                    <span v-if="productDetail.productName">{{productDetail.productName}}</span><span v-else>--</span>
                </el-form-item>
                <el-form-item label="商品规格">
                    <span v-if="productDetail.spec">{{productDetail.spec}}</span><span v-else>--</span>
                </el-form-item>
                <el-form-item label="商品原价">
                    <span class="color-red"
                          v-if="productDetail.originalPrice">{{productDetail.originalPrice}}</span><span
                    v-else>--</span>
                </el-form-item>
                <el-form-item label="商品库存">
                    <span v-if="productDetail.sellStock">{{productDetail.sellStock}}</span><span v-else>--</span>
                </el-form-item>
                <el-form-item label="秒杀价" prop="seckillPrice" style="margin-top: 30px">
                    ￥
                    <el-input v-model="form.seckillPrice"></el-input>
                </el-form-item>
                <el-form-item label="活动时间" prop="activityTime">
                    <!--<el-date-picker-->
                        <!--type="datetime"-->
                        <!--v-model="form.beginTime"-->
                        <!--placeholder="选择开始时间">-->
                    <!--</el-date-picker>-->
                    <el-date-picker
                        v-model="form.activityTime"
                        format="yyyy-MM-dd HH:mm"
                        type="datetimerange"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                </el-form-item>
                <!--<el-form-item label="结束时间" prop="endTime">-->
                    <!--<el-date-picker-->
                        <!--type="datetime"-->
                        <!--v-model="form.endTime"-->
                        <!--placeholder="选择结束时间">-->
                    <!--</el-date-picker>-->
                <!--</el-form-item>-->
                <el-form-item label="设置关闭订单" prop="orderCloseTime">
                    <el-input class="small" v-model="form.orderCloseTime"></el-input>
                    <span>分钟未付款自动关闭订单</span>
                </el-form-item>
                <el-form-item label="商品发放数量" prop="totalNumber">
                    <el-input class="small" v-model="form.totalNumber"></el-input>
                </el-form-item>
                <el-form-item label="每人限购" prop="limitNumber">
                    <el-input class="small"  v-model="form.limitNumber"></el-input>
                    <span class="tip">(同一用户ID视为同一人)</span>
                </el-form-item>
                <el-button @click="submitForm" type="primary" :loading="btnLoading">确认保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form>
        </el-card>
        <v-chooseproduct v-if="showMask" @getProductInf="productInf" :prodCode="productDetail.id"
                         :searchProductId="productDetail.searchProductId" :searchProductName="productDetail.productName"
                         :activityType="1"></v-chooseproduct>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import vChooseproduct from '@/components/common/marketTools/ChooseProduct.vue';
    import icon from '@/components/common/ico';
    import utils from '@/utils/index.js';
    import moment from 'moment';
    import request from '@/http/http.js';

    export default {
        components: {
            vBreadcrumb,
            icon,
            vChooseproduct
        },

        data() {
            const isInt = (rule, value, callback) => { // 正整数
                if (!value) {
                    return callback(new Error('参数不能为空!'));
                } else {
                    if (!/^[1-9]*[1-9][0-9]*$/.test(value)) {
                        callback(new Error('请输入正整数'));
                    } else {
                        callback();
                    }
                }
            };
            const nonnegativeInteger = (rule, value, callback) => { // 非负整数
                if (value === '') {
                    return callback(new Error('参数不能为空!'));
                } else {
                    if (!/^\d+$/.test(value)) {
                        callback(new Error('请输入非负整数'));
                    } else {
                        callback();
                    }
                }
            };
            const limitNum = (rule, value, callback) => { // 正整数
                if (value) {
                    if (!/^[1-9]*[1-9][0-9]*$/.test(value)) {
                        callback(new Error('请输入正整数'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            const isDouble = (rule, value, callback) => { // 两位小数
                if (!value) {
                    return callback(new Error('参数不能为空!'));
                } else {
                    if (!/^(0|[1-9]\d*)([.]{1}[0-9]{1,2})?$/.test(value)) {
                        callback(new Error('请输入两位小数'));
                    } else {
                        callback();
                    }
                }
            };
            const isMax = (rule, value, callback) => { // 发放数量
                if (!value) {
                    return callback(new Error('参数不能为空!'));
                } else {
                    if (value > this.productDetail.stock) {
                        callback(new Error('发放数量不能大于商品库存!'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                nav: ['运营管理', '营销工具管理', '秒杀', '新建秒杀'],
                rules: {
                    orderCloseTime: [
                        { validator: isInt, trigger: 'blur' }
                    ],
                    seckillPrice: [
                        { validator: isDouble, trigger: 'blur' }
                    ],
                    totalNumber: [
                        { validator: isMax, trigger: 'blur' }
                    ],
                    limitNumber: [
                        { validator: limitNum, trigger: 'blur' }
                    ]
                },
                form: {
                    activityTime: '', // 活动时间
                    // endTime: '',//结束时间
                    seckillPrice: '', // 秒杀价格
                    orderCloseTime: '', // 自动关闭订单时间
                    totalNumber: '', // 发放总数量
                    limitNumber: ''// 限购数量
                },
                showMask: false, // 选择商品弹窗
                productDetail: {}, // 选择的商品的商品信息
                btnLoading: false, // 按钮提交
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < new Date() - 8.64e7;
                    }
                }
            };
        },

        activated() {
            this.productDetail = {};
            this.form = {};
            this.form.limitNumber = '';
        },

        methods: {
            // 选择商品
            chooseProduct() {
                this.showMask = true;
            },
            // 获取商品信息
            productInf(value) {
                this.showMask = false;
                if (value != false) {
                    this.productDetail = value;
                }
            },

            // 提交表单
            submitForm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        // 判空
                        if (!this.productDetail.id) {
                            this.$message.warning('请选择商品！');
                            return;
                        }
                        if (!this.form.activityTime) {
                            this.$message.warning('请选择活动时间！');
                            return;
                        }
                        // 表单提交
                        const data = this.form;
                        data.beginTime = moment(this.form.activityTime[0]).format('YYYY-MM-DD HH:mm:00'); // 活动开始时间
                        data.endTime = moment(this.form.activityTime[1]).format('YYYY-MM-DD HH:mm:00'); // 活动开始时间
                        data.prodCode = this.productDetail.prodCode; // 产品ID
                        data.skuCode = this.productDetail.skuCode; // 产品规格价格编号
                        if (!data.limitNumber) data.limitNumber = -1;
                        this.btnLoading = true;
                        request.addOperatorSeckill(data).then(res => {
                            this.$message.success(res.msg);
                            this.$router.push('/secKill');
                            this.btnLoading = false;
                        }).catch(err => {
                            this.btnLoading = false;
                        });
                    } else {
                        console.log('error submit!!');
                        this.btnLoading = false;
                        return false;
                    }
                });
            },
            // 取消
            cancel() {
                this.$router.push('/secKill');
            }
        }
    };
</script>
<style lang='less' scoped>
    .add-secKill {
        color: #666;
        .pro-title {
            width: 100%;
            height: 60px;
            background-color: #f7f7f7;
            line-height: 60px;
            padding: 0 25px;
            box-sizing: border-box;
            margin-bottom: 20px;
        }
        /deep/ .el-input {
            width: 220px;
        }
        /deep/ .small.el-input {
            width: 140px;
        }
        .tip {
            color: #dddddd;
        }
        .color-red {
            color: #e60012;
        }
    }
</style>
