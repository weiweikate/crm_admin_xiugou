<template>
    <div>
        <v-breadcrumb :nav="['运营管理','经验值专区管理','添加活动']"></v-breadcrumb>

        <el-card class="mt20">
            <div class="title">活动信息</div>
            <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                <el-form-item prop="name" label="活动名称">
                    <el-input v-model="form.name" maxlength="30" minlength="1"></el-input>
                </el-form-item>
                <el-form-item prop="rules" label="活动规则">
                    <el-button size="big" :type="form.rules.length >= 5 ? 'info' : 'danger'" @click="addRegular">添加区间</el-button> <span style="color:red" v-if="form.rules.length >= 5">最多添加5个区间</span>
                    <div class="regular-list mt20">
                        <div class="regular-item mt10" v-for="(item,index) in form.rules">
                            购满买 <el-input-number
                                    :controls="false"
                                    v-model.number="item.startPrice"
                                    style="width: 100px;"
                                    :min="1"
                                    :max="999999999"
                                    :precision="2"
                                    @change="rulesInputValidate(index, 'startPrice')"
                                    >
                                </el-input-number> 元，经验值翻
                                <el-input-number
                                    :controls="false"
                                    v-model="item.rate"
                                    style="width:100px;text-align: left;" :min="1"
                                    :max="999999999"
                                    :precision="2"
                                    @change="rulesInputValidate(index, 'rate')"
                                >
                                </el-input-number> 倍
                            <el-button type="danger" plain @click="removeRegular(index)" v-if="index > 0">删除</el-button>
                        </div>
                    </div>
                </el-form-item>

                <!-- 可选是否赠送优惠券S -->
                <div class="el-form-item el-form-item--small">
                    <label
                        class="el-form-item__label"
                        style="width: 100px;">
                        <el-checkbox v-model="checkCoupon">备选项</el-checkbox>
                    </label>
                    <div class="el-form-item__content" style="margin-left: 100px;">
                        <el-input placeholder="请输入优惠券ID" v-on:change="getCoupon" v-model="form.couponId" style="width: 300px;"></el-input>
                        <span style="color:red">无效id</span>
                        <div class="coupon-name"></div>
                        <div class="coupon-regular mt10" v-if="checkCoupon">
                            每 <el-input style="width: 100px;" v-model="form.startPrice" :disabled="true"></el-input> 元，赠送优惠券
                            <el-input-number
                                :controls="false"
                                :min="1" :precision="0"
                                style="width: 100px;text-align: left"
                                @change="couponCountCheck"
                                v-model="form.startCount"
                            ></el-input-number> 张
                            <div class="mt10">
                                单笔订单最多可赠送优惠券数量
                                <el-input-number
                                        :controls="false"
                                        :min="1"
                                        :precision="0"
                                        style="width: 100px;text-align: left"
                                        v-model="form.maxCount"
                                        @change="couponCountCheck"
                                 >
                                 </el-input-number> 张
                            </div>
                        </div>
                    </div>

                </div>
                <!-- 可选是否赠送优惠券E -->

                <el-form-item prop="time" label="活动时间" label-width="120">
                    <el-date-picker
                        v-model="form.time"
                        type="datetimerange"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>

            <div class="title mt20">活动商品</div>
            <el-button type="danger" size="big" @click="addGoodDialog = true">添加商品</el-button>
            <el-button type="danger" size="big" @click="importDialog = true">批量导入</el-button>

            <el-table
                :data="tableData"
                border
                style="width: 100%;margin-top: 20px;">
                <el-table-column
                    prop="date"
                    label="SPU编码"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="商品名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="V0价">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="可售库存">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="商品状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status === 0">已上架</div>
                        <div v-if="scope.row.status === 1">待上架</div>
                        <div v-if="scope.row.status === 2">已下架</div>
                        <div v-if="scope.row.status === 3">待发布</div>
                        <div v-if="scope.row.status === 4">已删除</div>
                        <div v-if="scope.row.status === 5">待审核</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="mt20" style="text-align: center">
                <el-button type="primary" size="big" @click="onSubmit">{{type === 'add' ? '立即创建' : '提交' }}</el-button>
            </div>
        </el-card>


        <!-- 添加商品S -->
        <el-dialog title="选择商品" :visible.sync="addGoodDialog" custom-class="add-goods-dialog" center>

            <el-form :model="searchForm" :inline="true">
                <el-form-item>
                    <el-select v-model="searchForm.type" placeholder="商品类型" style="width: 120px;">
                        <el-option label="普通商品" :value="1"></el-option>
                        <el-option label="内购商品" :value="2"></el-option>
                        <el-option label="虚拟商品" :value="3"></el-option>
                        <el-option label="卡券商品" :value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.firstCategoryId" placeholder="一级分类" style="width: 120px;">
                        <el-option :label="cat.name" :value="cat.id" v-for="cat in categories" :key="cat.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.brandId" placeholder="品牌" style="width: 120px;">
                        <el-option :label="brand.name" :value="brand.id" v-for="brand in brandList" :key="brand.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="商品名称" v-model="searchForm.name" style="width: 120px;"></el-input>
                    <el-input placeholder="商品SPU编码" v-model="searchForm.prodCode" style="width: 120px;"></el-input>
                </el-form-item>
                <el-button type="danger" @click="getList(1)">搜索</el-button>
            </el-form>
            <div class="dialog-body">
                <div class="dialog-good-item" v-for="(item,index) in searchGoods" @click="toggleGoodChecked(index)">
                    <img :src="item.imgUrl || '/static/img/defaultImg.png'" alt="good img">
                    <div class="dialog-good-shade" v-if="item.checked">已选中</div>
                </div>
            </div>
            <div class="dialog-footer" style="text-align: left" slot="footer">
                <el-button type="primary" @click="addGoods" size="big">确 定</el-button>
                <el-button @click="addGoodDialog = false" size="big">取 消</el-button>
                <el-pagination
                    style="float: right;"
                    background
                    @size-change="handleSizeChange"
                    :page-size="page.pageSize"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </div>
        </el-dialog>
        <!-- 添加商品E -->

        <!-- 批量导入S -->
        <el-dialog title="批量导入" :visible.sync="importDialog" center @close="closeImportDialog">
            请输入商品SPU编码，多个商品SPU编码换行输入
            <el-input type="textarea" :rows="20" v-model="importInput"></el-input>
            <div class="dialog-footer" slot="footer">
                <el-button type="primary" @click="addGoods" size="big">确 定</el-button>
                <el-button @click="closeImportDialog" size="big">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 批量导入E -->

    </div>
</template>
<script>
    import vBreadcrumb from '../../../common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http';

    export default {
        name: 'ExpAdd',
        mixins: [myMixinTable],
        watch: {
            'form.couponId': {
                handler() {
                    this.checkCoupon = !!this.form.couponId;
                }
            }
        },
        data() {
            return {
                rules: {
                    name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }, { min: 1, max: 30, message: '活动名称长度在1-30之间' }],
                    time: [{ required: true, message: '请选择活动时间', trigger: 'blur' }]
                },
                type: 'add',
                importInput: '', // 批量导入内容
                addGoodDialog: false, // 添加商品弹窗
                importDialog: false, // 导入弹窗
                checkCoupon: false, // 是否选用优惠券
                categories: [], // 一级类目
                brandList: [], // 品牌列表
                couponData: {}, // 输入优惠券ID并且失焦时去获取这个id的数据
                searchForm: {
                    type: '',
                    firstCategoryId: '',
                    brandId: '',
                    name: '',
                    prodCode: ''
                },
                // 添加或编辑时的数据集合
                form: {
                    name: '',
                    rules: [
                        {
                            startPrice: '',
                            rate: 1
                        }
                    ],
                    couponId: '',
                    time: [],
                    activityCode: '',
                    startTime: '',
                    endTime: '',
                    maxCount: 0,
                    prods: [
                        {
                            imgUrl: '',
                            name: '',
                            spuCode: '',
                            status: 0
                        }
                    ],
                    startCount: 0,
                    startPrice: 0
                },
                searchGoods: []
            };
        },
        computed: {
            importList() {
                let list = [];
                if (this.importInput) {
                    list = this.importInput.replace(/\r|\n|\s|\./g, ',').split(',').filter(function(item) {
                        return item !== '';
                    });
                } else if (this.searchGoods.length > 0) {
                    this.searchGoods.forEach(item => {
                        if (item.checked) list.push(item);
                    });
                }
                return list;
            },
            selectGoods() {
                const arr = [];
                this.searchGoods.forEach(item => {
                    if (item.checked) {
                        arr.push(item.prodCode);
                    }
                });
                return arr;
            }
        },
        methods: {
            // 添加区间
            addRegular() {
                if (this.form.rules.length >= 5) return this.$message.warning('区间数量已达上限');
                this.form.rules.push({
                    startPrice: '',
                    rate: 1
                });
            },
            // 删除区间
            removeRegular(index) {
                this.form.rules.splice(index, 1);
            },
            // 比较后者是否大于前者
            compare(pre, current) {
                return current > pre;
            },
            // 区间输入验证
            rulesInputValidate(index, field) {
                const rules = this.form.rules;
                const type = field === 'startPrice' ? '金额' : '倍数';
                const val = rules[index][field];
                if (val === '' || val === undefined || val === null) {
                    this.$message.warning(`第 ${index + 1} 行区间的 ${type} 不能为空`);
                    return false;
                }
                if (val <= 0) {
                    this.$message.warning(`区间${type}必须大于0`);
                    return false;
                }
                if (index === 0) {
                    if (rules[index + 1] && !this.compare(val, rules[index + 1][field])) {
                        this.$message.warning(`第 ${index + 2} 行区间 ${type} 必须大于第 ${index + 1} 行区间 ${type} ,请确认各个区间的 ${type} 是否正确`);
                        return false;
                    }
                }
                if (index > 0 && !this.compare(rules[index - 1][field], val)) {
                    this.$message.warning(`第 ${index + 1} 行区间 ${type} 必须大于第 ${index} 行区间 ${type} ,请确认各个区间的 ${type} 是否正确`);
                    return false;
                }
                return true;
            },
            // 验证优惠券
            getCoupon() {
                console.log(this.couponData);
            },
            // 优惠券赠送数验证
            couponCountCheck() {
                if (!this.form.startCount) {
                    this.form.maxCount = '';
                    this.$message.warning('请先填写满足条件赠送优惠券数');
                    return false;
                }
                if (!this.form.maxCount) {
                    this.$message.warning('请填写单笔订单最多可赠送优惠券数');
                    return false;
                }
                if (this.form.maxCount < this.form.startCount) {
                    this.$message.warning('最多赠送数必须大满足条件的赠送优惠券数');
                    return false;
                }
                return true;
            },
            // 添加商品
            addGoods() {
                console.log(this.importList);
            },
            getList(page) {
                const data = {
                    ...this.searchForm,
                    page: page,
                    pageSize: this.page.pageSize
                };
                request.queryActivityProductList(data).then(res => {
                    this.searchGoods = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                    this.page.currentPage = res.data.currentPage;
                }).catch(res => {
                    this.$message.warning(res.msg);
                });
            },
            // 获取一级类目
            getProdCatList() {
                const data = {
                    fatherId: 0,
                    level: 1,
                    page: 1,
                    pageSize: 100
                };
                request.queryProductCategoryList(data).then(res => {
                    this.categories = res.data.data;
                }).catch(error => {
                    this.$message.warning(`获取一级类目失败:${error.msg}`);
                });
            },
            // 获取品牌列表
            getProductBrandList() {
                const data = {
                    fatherId: 0,
                    level: 1,
                    page: 1,
                    pageSize: 100
                };
                request.getProductBrandList(data).then(res => {
                    this.brandList = res.data.data;
                }).catch(error => {
                    this.$message.warning(`获取品牌失败:${error.msg}`);
                });
            },
            closeImportDialog() {
                this.importDialog = false;
                this.importInput = '';
                this.importList = [];
            },
            toggleGoodChecked(index) {
                this.$set(this.searchGoods[index], 'checked', !this.searchGoods[index].checked);
                console.log(this.selectGoods);
            },
            // 初始化接口参数
            initParams() {
                const data = {
                    ...this.form
                };
                const t = this.form.time;
                if (t && t.length) {
                    data.startTime = t[0];
                    data.endTime = t[1];
                }
                return data;
            },
            // 校验输入内容
            validateInputs() {
                let valid = true;
                const rules = this.form.rules;
                for (let i = 0, len = rules.length; i < len; i++) {
                    valid = this.rulesInputValidate(i, 'startPrice') && this.rulesInputValidate(i, 'rate');
                    if (!valid) return valid;
                }
                valid = this.couponCountCheck();
                return valid;
            },
            // 提交添加活动
            onSubmit() {
                this.$refs['form'].validate(valid => {
                    if (valid && this.validateInputs()) {
                        const params = this.initParams();
                        console.log(params);
                    } else {
                        return false;
                    }
                });
            }
        },
        mounted() {
            const type = this.$route.query.type;
            this.type = type || 'add';
            this.getProdCatList();
            this.getProductBrandList();
        },
        components: {
            vBreadcrumb
        }
    };
</script>
<style lang='less' scoped>
    @import "styles/exp";

</style>
