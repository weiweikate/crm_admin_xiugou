<template>
    <div class="add-depreciate">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
            <div class="pro-title">新建降价拍</div>
            <el-form :model="form" ref="form" :rules="rules" label-width="110px">
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
                    <span v-if="productDetail.stock">{{productDetail.stock}}</span><span v-else>--</span>
                </el-form-item>
                <el-form-item prop="startPrice" label="起拍价格" style="margin-top: 30px">
                    ￥
                    <el-input v-model="form.startPrice" v-if="form.endTime" @input="calDurationTime(showDuration)"></el-input>
                    <el-input v-model="form.startPrice" v-else></el-input>
                </el-form-item>
                <el-form-item prop="floorPrice" label="最低价格">
                    ￥
                    <el-input v-model="form.floorPrice" v-if="form.endTime" @input="calDurationTime(showDuration)"></el-input>
                    <el-input v-model="form.floorPrice" v-else @input="floorPrice"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" prop="beginTime">
                    <el-date-picker
                        type="datetime"
                        v-model="form.beginTime"
                        v-if="form.endTime"
                        @input="calDurationTime(showDuration)"
                        placeholder="选择开始时间">
                    </el-date-picker>
                    <el-date-picker
                        type="datetime"
                        v-else
                        v-model="form.beginTime"
                        placeholder="选择开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="orderCloseTime" label="设置关闭订单">
                    <el-input class="small" v-model="form.orderCloseTime"></el-input>
                    <span>分钟未付款自动关闭订单</span>
                </el-form-item>
                <div class="spec-item">
                    <el-form-item prop="intervalTime" label="降价幅度">
                        <span>每</span>
                        <el-input class="small" v-model="form.intervalTime" v-if="form.endTime" @input="calDurationTime(showDuration)"></el-input>
                        <el-input class="small" v-model="form.intervalTime" v-else></el-input>
                        <span>分钟下降</span> <span>￥</span>
                    </el-form-item>
                    <el-form-item prop="downPrice" class="item">
                        <el-input class="small" v-model="form.downPrice" v-if="form.endTime" @input="calDurationTime(showDuration)"></el-input>
                        <el-input class="small" v-model="form.downPrice" v-else></el-input>
                    </el-form-item>
                </div>

                <el-form-item label="持续时间">
                    <el-button type="primary" @click="calDurationTime(true)">计算持续时间</el-button>
                    <div v-if="showDuration">{{duration}}</div>
                </el-form-item>
                <el-form-item prop="floorPriceTime" label="底价持续时间">
                    <span>降到底价还允许</span>
                    <el-input class="small" @input="calEndTimeByStartDurationTime"
                              v-model="form.floorPriceTime"></el-input>
                    <span>分钟购买时间</span>
                </el-form-item>
                <el-form-item label="结束时间">
                    <span v-if="form.endTime">{{form.endTime}}</span><span v-else>--</span>
                </el-form-item>
                <el-form-item prop="totalNumber" label="降价拍发放数量">
                    <el-input class="small" v-model="form.totalNumber"></el-input>
                </el-form-item>
                <el-form-item prop="limitNumber" label="每人限购">
                    <el-input class="small" v-model="form.limitNumber"></el-input>
                    <span class="tip">(同一用户ID视为同一人)</span>
                </el-form-item>
                <el-button @click="submitForm" type="primary" :loading="btnLoading">确认保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form>
        </el-card>
        <v-chooseproduct v-if="showMask" @getProductInf="productInf" :productId="productDetail.id"
                         :searchProductId="productDetail.searchProductId" :searchProductName="productDetail.productName"
                         :activityType="2"></v-chooseproduct>
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
                nav: ['运营管理', '营销工具管理', '降价拍', '新建降价拍'],
                rules: {
                    orderCloseTime: [
                        { validator: isInt, trigger: 'blur' }
                    ],
                    intervalTime: [
                        { validator: isInt, trigger: 'blur' }
                    ],
                    floorPriceTime: [
                        { validator: isInt, trigger: 'blur' }
                    ],
                    startPrice: [
                        { validator: isDouble, trigger: 'blur' }
                    ],
                    floorPrice: [
                        { validator: isDouble, trigger: 'blur' }
                    ],
                    downPrice: [
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
                    floorPrice: '', // 最低价格
                    beginTime: '', // 开始时间
                    intervalTime: '', // 降价幅度 分钟数
                    downPrice: '', // 降价幅度 金额
                    floorPriceTime: '', // 降到底价还允许购买的时间
                    endTime: '', // 结束时间
                    startPrice: '', // 起拍价格
                    orderCloseTime: '', // 自动关闭订单时间
                    totalNumber: '', // 发放总数量
                    limitNumber: ''// 限购数量,默认为0
                },
                showMask: false, // 选择商品弹窗
                productDetail: {}, // 选择的商品的商品信息
                showDuration: false, // 显示持续时间
                durationTime: '', // 持续分钟数
                duration: '', // 持续时间
                btnLoading: false// 按钮提交
            };
        },

        activated() {
            this.productDetail = {};
            this.duration = '';
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
            // 最低价
            floorPrice() {
                if (Number(this.form.floorPrice) > Number(this.form.startPrice)) {
                    this.$message.warning('最低价格应不大于起拍价格！');
                    this.form.floorPrice = '';
                    return false;
                } else {
                    return true;
                }
            },
            // 计算可持续时间
            calDurationTime(status) {
                const originPrice = this.form.startPrice;
                const floorPrice = this.form.floorPrice;
                const intervalTime = this.form.intervalTime;
                const downPrice = this.form.downPrice;
                if (!originPrice) {
                    this.$message.warning('请输入起拍价！');
                    return;
                }
                if (!floorPrice) {
                    this.$message.warning('请输入最低价格！');
                    return;
                } else {
                    if (!this.floorPrice()) return;
                }
                if (!intervalTime || !downPrice) {
                    this.$message.warning('请输入降价幅度！');
                    return;
                }
                // 为防止精度丢失，小数转整数再进行计算
                const time = Math.floor((originPrice * 100 - floorPrice * 100) / (downPrice * 100)) * intervalTime;
                this.durationTime = time;// 保存持续分钟数
                const day = Math.floor(time / 60 / 24);// 天数
                const hour = Math.floor((time - day * 60 * 24) / 60);// 小时
                const minutes = time - day * 60 * 24 - hour * 60;// 分钟
                this.showDuration = status;
                this.duration = day + '天' + ' ' + this.addZero(hour) + ':' + this.addZero(minutes) + ':00';
                this.calEndTime(this.form.beginTime, this.durationTime, this.form.floorPriceTime);
            },

            // 不足10补零
            addZero(num) {
                return num = num < 10 ? '0' + num : num;
            },
            // 计算开始时间、底价持续时间结束时间
            calEndTimeByStartDurationTime() {
                const status = this.showDuration;
                this.calDurationTime(status);
                this.calEndTime(this.form.beginTime, this.durationTime, this.form.floorPriceTime);
            },
            // 计算结束时间
            calEndTime(start, allTime, floorPriceTime) {
                if (this.form.startPrice && this.form.floorPrice && this.form.intervalTime && this.form.downPrice && this.form.beginTime && this.form.floorPriceTime) {
                    this.form.endTime = moment(new Date(start).getTime() + (Number(allTime) + Number(floorPriceTime)) * 60 * 1000).format('YYYY-MM-DD HH:mm:ss');
                }
            },
            // 提交表单
            submitForm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        console.log(111);
                        // 判空
                        if (!this.productDetail.id) {
                            this.$message.warning('请选择商品！');
                            return;
                        }
                        if (!this.form.beginTime) {
                            this.$message.warning('请选择开始时间！');
                            return;
                        }
                        // 表单提交
                        const data = this.form;
                        if (!data.limitNumber) data.limitNumber = -1;
                        data.beginTime = moment(this.form.beginTime).format('YYYY-MM-DD HH:mm:ss'); // 活动开始时间
                        // data.productCode = this.productDetail.productCode; // 产品编号
                        data.productId = this.productDetail.productId; // 产品ID
                        // data.productImg = this.productDetail.specImg; // 产品主图url
                        // data.productName = this.productDetail.productName; // 产品名称
                        // data.productPrice = this.productDetail.originalPrice; // 产品原价
                        data.productPriceId = this.productDetail.id; // 产品规格价格编号
                        // data.productSpec = this.productDetail.spec; // 产品规格
                        this.btnLoading = true;
                        request.operatorAddDepreciate(data).then(res => {
                            this.$message.success(res.msg);
                            this.$router.push('/depreciate');
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
                this.$router.push('/depreciate');
            }
        }
    };
</script>
<style lang='less' scoped>
    .add-depreciate {
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
        .spec-item{
            position: relative;
            .item{
                position: absolute;
                top: 0;
                left: 240px
            }
        }
    }
</style>
