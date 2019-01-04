<template>
    <div>
        <v-breadcrumb :nav="['运营管理','经验值专区管理','添加编辑活动']"></v-breadcrumb>

        <el-card class="mt20" v-loading="loading">
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
                <div class="el-form-item el-form-item--small" v-loading="couponLoading">
                    <!--活动进行中-->
                    <el-form-item label="活动优惠券" prop="couponId" v-if="form.status === activityStatus.ing">
                        <el-input placeholder="请输入优惠券ID" v-on:change="getCouponById" v-model="form.couponId" style="width: 300px;"></el-input>
                        <span class="coupon-err" v-if="couponInfo">
                            <span v-if="couponInfo.status === 0">已失效</span>
                            <span v-if="couponInfo.totalNumber === 0">可发放数量不足</span>
                        </span>
                        <span class="coupon-err" v-else>优惠券不存在</span>
                        <div class="coupon-name" v-if="couponInfo">{{couponInfo.name}}</div>
                        <div class="coupon-regular mt10" v-if="couponInfo">
                            每{{form.rules[0].startPrice}}元，赠送优惠券 {{form.startCount}} 张
                            <div class="mt10">
                                单笔订单最多可赠送优惠券数量： {{form.maxCount}}张
                            </div>
                        </div>
                    </el-form-item>
                    <!--活动未开始-->
                    <div v-else>
                        <label
                            class="el-form-item__label"
                            style="width: 100px;">
                            <el-checkbox v-model="checkCoupon">活动优惠券</el-checkbox>
                        </label>
                        <div class="el-form-item__content" style="margin-left: 100px;">
                            <el-input placeholder="请输入优惠券ID" v-on:change="getCouponById" v-model="form.couponId" style="width: 300px;"></el-input>
                            <span class="coupon-err" v-if="couponInfo">
                            <span v-if="couponInfo.status === 0">已失效</span>
                            <span v-if="couponInfo.totalNumber === 0">可发放数量不足</span>
                        </span>
                            <span class="coupon-err" v-else>优惠券不存在</span>
                            <div class="coupon-name" v-if="couponInfo">{{couponInfo.name}}</div>
                            <div class="coupon-regular mt10" v-if="checkCoupon">
                                每  <el-input style="width: 100px;" v-model="form.rules[0].startPrice" :disabled="true"></el-input> 元，赠送优惠券
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
                </div>
                <!-- 可选是否赠送优惠券E -->

                <el-form-item prop="time" label="活动时间" label-width="120">
                    <el-date-picker
                        v-model="form.time"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00', '23:59:59']"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>

            <div class="title mt20">活动商品</div>
            <el-button type="danger" size="big" @click="showAddGoodDialog">添加商品</el-button>
            <el-button type="danger" size="big" @click="importDialog = true">批量导入</el-button>

            <el-table
                :data="tableData"
                v-loading="tableLoading"
                border
                style="width: 100%;margin-top: 20px;">
                <el-table-column
                    prop="spuCode"
                    label="SPU编码"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="商品名称"
                    align="center"
                    width="250">
                </el-table-column>
                <el-table-column
                    prop="minPrice"
                    align="center"
                    width="100"
                    label="V0价">
                    <template slot-scope="scope">
                        <span v-if="scope.row.minPrice === scope.row.maxPrice">￥{{scope.row.minPrice || '0.00'}}</span>
                        <span v-else>￥{{scope.row.minPrice || '0.00'}} ~ ￥{{scope.row.maxPrice || '0.00'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="saleStock"
                    align="center"
                    width="100"
                    label="可售库存">
                </el-table-column>
                <el-table-column
                    v-if="form.status === activityStatus.ing"
                    prop="saleNum"
                    align="center"
                    width="100"
                    label="销量">
                </el-table-column>
                <el-table-column
                    prop="productStatus"
                    align="center"
                    width="120"
                    label="商品状态">
                    <template slot-scope="scope">
                        {{goodStatus[scope.row.productStatus]}}
                        <div class="red">{{scope.row.errMsg}}</div>
                    </template>
                </el-table-column>
                <!-- 编辑状态切活动为进行中时显示 -->
                <el-table-column
                    v-if="type === 'edit' && form.status === activityStatus.ing"
                    prop="status"
                    align="center"
                    label="状态"
                    width="120"
                >
                    <template slot-scope="scope">
                        {{goodActiveStatus[scope.row.status] || '已开启'}}
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                        <!-- todo 如果是添加的商品或是编辑未开始活动(form.status = 1)的情况下展示 -->
                        <el-button type="danger" @click="removeSelectGoods(scope.$index, scope.row.spuCode)" v-if="showDelBtn(scope.row.spuCode)">删除</el-button>
                        <!-- todo 如果是活动已开始(form.status = 2) 显示停用按钮  如果已停用(0:停用，1:正常)则不允许再操作 -->
                        <el-button type="warning" :disabled="scope.row.status === 0" @click="closeProduct(scope.row.spuCode)" v-if="showCloseBtn(scope.row.spuCode)">关闭</el-button>
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
                <el-form-item label="商品类型">
                    <el-select v-model="searchForm.type" placeholder="商品类型" style="width: 120px;">
                        <el-option label="全部" value="">全部</el-option>
                        <el-option :label="brand.value" :value="brand.key" v-for="brand in brands" :key="brand.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="一级分类">
                    <el-select v-model="searchForm.firstCategoryId" placeholder="一级分类" style="width: 120px;">
                        <el-option label="全部" value="">全部</el-option>
                        <el-option :label="cat.name" :value="cat.id" v-for="cat in categories" :key="cat.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌">
                    <el-select v-model="searchForm.brandId" placeholder="品牌" style="width: 120px;">
                        <el-option label="全部" value="">全部</el-option>
                        <el-option :label="brand.name" :value="brand.id" v-for="brand in brandList" :key="brand.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="商品名称" v-model="searchForm.name" style="width: 120px;"></el-input>
                    <el-input placeholder="商品SPU编码" v-model="searchForm.prodCode" style="width: 120px;"></el-input>
                </el-form-item>
                <el-button type="danger" @click="getList(1)">搜索</el-button>
            </el-form>
            <div class="dialog-body" v-loading="searchLoading">
                <div class="dialog-good-item" v-for="(item,index) in searchGoods" @click="toggleGoodChecked(index)">
                    <img :src="item.imgUrl || '/static/img/defaultImg.png'" alt="good img">
                    <div class="dialog-good-name">{{item.name}}</div>
                    <div class="dialog-good-shade" v-if="item.checked">已选中</div>
                </div>
                <div v-if="searchGoods.length === 0">空空如也~</div>
            </div>
            <div class="dialog-footer" style="text-align: left" slot="footer">
                <el-button type="primary" @click="verifyGoods('add')" size="big">确 定</el-button>
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
                <el-button type="primary" @click="verifyGoods('import')" size="big">确 定</el-button>
                <el-button @click="closeImportDialog" size="big">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 批量导入E -->

        <!-- 添加导入商品异常弹窗 S -->
        <el-dialog title="商品添加失败" :visible.sync="errorDialog" center @close="closeErrorSpuGoodsDialog">
            红字的为SPU导入失败异常原因, 关闭窗口后剔除错误商品
            <div class="err-list">
                <div class="err-item" v-for="item in checkActivityProductRes">
                    <span class="err-item-code">{{item.spuCode}}</span><span class="inline red">{{item.errMsg}}</span>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="errorDialog = false">确定</el-button>
            </span>
        </el-dialog>
        <!-- 添加导入商品异常弹窗 E -->
    </div>
</template>
<script>
    import vBreadcrumb from '../../../common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http';
    import moment from 'moment';

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
                goodStatus: {
                    0: '已删除',
                    1: '待发布',
                    2: '待审核',
                    3: '已通过',
                    4: '已上架',
                    5: '已驳回',
                    6: '已下架'
                },
                goodActiveStatus: {
                    1: '已开启',
                    0: '已关闭'
                },
                // 0：删除1：未开始  2：进行中3：已结束
                activityStatus: {
                    'delete': 0,
                    'waiting': 1,
                    'ing': 2,
                    'end': 3
                },
                brands: [
                    { key: 1, value: '普通商品' },
                    { key: 2, value: '内购商品' },
                    { key: 3, value: '虚拟商品' },
                    { key: 4, value: '卡券商品' }
                ],
                rules: {
                    name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }, { min: 1, max: 30, message: '活动名称长度在1-30之间' }],
                    time: [{ required: true, message: '请选择活动时间', trigger: 'blur' }],
                    couponId: [{ required: true, message: '请输入优惠券', trigger: 'blur' }]
                },
                searchLoading: false,
                couponLoading: false,
                loading: false,
                type: 'add',
                importInput: '', // 批量导入内容
                addGoodDialog: false, // 添加商品弹窗
                importDialog: false, // 导入弹窗
                errorDialog: false, // 商品添加失败弹窗
                checkCoupon: false, // 是否选用优惠券
                categories: [], // 一级类目
                brandList: [], // 品牌列表
                couponInfo: {}, // 输入优惠券ID并且失焦时去获取这个id的数据
                tableData: [],
                originTableSpuCodes: [],
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
                    spuCodes: [],
                    startCount: 0,
                    startPrice: 0
                },
                searchGoods: [],
                checkActivityProductRes: [], // 添加商品的校验结果
                addGoodsList: [],
                selectGoods: []
            };
        },
        methods: {
            showCloseBtn(spuCode) {
                return this.type === 'edit' && this.form.status === this.activityStatus.ing && this.originTableSpuCodes.includes(spuCode);
            },
            showDelBtn(spuCode) {
                return this.selectGoods.includes(spuCode) || this.form.status === this.activityStatus.waiting;
            },
            // 关闭活动商品
            closeProduct(spuCode) {
                this.$confirm('确定关闭该商品?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const data = {
                        activityCode: this.form.activityCode,
                        spuCode: spuCode
                    };
                    request.closeProduct(data).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.msg
                        });
                        this.getExpActiveGoods();
                    }).catch(res => {});
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
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
                // 实际上el组件已做处理
                if (val <= 0) {
                    this.$message.warning(`区间${type}必须大于0`);
                    return false;
                }
                // 第一个区间特殊处理
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
            getCouponById() {
                this.couponLoading = true;
                request.getCouponById({ id: this.form.couponId }).then(res => {
                    this.couponLoading = false;
                    this.couponInfo = res.data || '';
                }).catch(res => {
                    this.couponLoading = false;
                    this.$message.warning(res.msg);
                });
            },
            // 优惠券赠送数验证
            couponCountCheck() {
                if (!this.checkCoupon) return true;
                if (!this.couponInfo) {
                    this.$message.warning('填写的优惠券不存在');
                    return false;
                }
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
            // 展示添加商品弹窗 如果查询结果为空 就调一次查询
            showAddGoodDialog() {
                this.addGoodDialog = true;
                if (!this.searchGoods.length) {
                    this.getList(1);
                }
            },
            // 关闭错误商品弹窗后剔除问题商品 同时展示没问题商品
            closeErrorSpuGoodsDialog() {
                const list = this.getErrorSpuGoodsList(this.checkActivityProductRes);
                this.selectGoods = this.mergeArr(this.selectGoods, this.getImportList());
                if (list.length) {
                    this.selectGoods = this.selectGoods.filter((item) => {
                        return !list.includes(item + '');
                    });
                }
                this.showAddGoods(this.checkActivityProductRes);
            },
            // 获取不通过校验的商品列表
            getErrorSpuGoodsList(data) {
                const goods = data;
                const list = [];
                goods.forEach(item => {
                    if (item.errMsg) {
                        list.push(item.spuCode);
                    }
                });
                return list;
            },
            // 合并数组(去重)
            mergeArr(arr1, arr2) {
                return Array.from(new Set(arr1.concat(arr2)));
            },
            getImportList() {
                let imporList = [];
                if (this.importInput) {
                    imporList = this.importInput.replace(/\r|\n|\s|\./g, ',').split(',').filter(function(item) {
                        return item !== '';
                    });
                }
                return imporList;
            },
            // 选择以及批量导出的商品需要先做校验 参数用来区分是批量还是搜索的
            verifyGoods(type) {
                const importList = this.getImportList();
                const data = {
                    activityCode: this.type === 'add' ? '' : this.form.activityCode, //  如果是添加则传空 编辑的话要带上
                    spuCodes: type === 'add' ? this.selectGoods : importList
                };
                if (!data.spuCodes.length) return this.$message.warning('请至少提供一个商品');
                request.checkActivityProduct(data).then(res => {
                    this.checkActivityProductRes = res.data || [];
                    const errSpuCodes = this.getErrorSpuGoodsList(res.data);
                    // 如果校验不通过 根据返回结果的errMsg去除不符合结果的商品
                    if (errSpuCodes.length) {
                        this.errorDialog = true;
                    } else {
                        // 校验通过后展示添加的商品
                        this.showAddGoods(res.data);
                    }
                    const dialog = type === 'add' ? 'addGoodDialog' : 'importDialog';
                    this[dialog] = false;
                }).catch(res => {});
            },
            // 展示添加商品
            showAddGoods(data) {
                const arr = [];
                const existProds = [];
                this.tableData.forEach(item => {
                    existProds.push(item.spuCode);
                });
                data.forEach(item => {
                    if (!item.errMsg && !existProds.includes(item.spuCode)) {
                        arr.push(item);
                    }
                });
                // 新增的放前面
                this.tableData = arr.concat(this.tableData);
            },
            // 删除添加的产品
            removeSelectGoods(index, spuCode) {
                this.tableData.splice(index, 1);
                this.selectGoods = this.selectGoods.filter(item => {
                    return item !== spuCode;
                });
                this.searchGoods = [];
            },
            // 添加商品查询接口
            getList(page) {
                const data = {
                    ...this.searchForm,
                    page: page,
                    pageSize: this.page.pageSize
                };
                // 活动进行中传活动code可以筛除已有的商品
                if (this.form.status === this.activityStatus.ing) {
                    data.activityCode = this.form.activityCode || '';
                }
                this.searchLoading = true;
                request.queryActivityProductList(data).then(res => {
                    this.searchLoading = false;
                    const resData = res.data || {};
                    if (resData.data && resData.data.length !== 0) {
                        resData.data.forEach(item => {
                            if (this.selectGoods.includes(item.prodCode) || this.originTableSpuCodes.includes(item.prodCode)) {
                                item.checked = true;
                            }
                        });
                    }
                    this.searchGoods = resData.data;
                    this.initSelectGoods();
                    this.page.totalPage = res.data.totalNum;
                    this.page.currentPage = res.data.currentPage;
                }).catch(res => {
                    this.searchLoading = false;
                    this.$message.warning(res.msg);
                });
            },
            // 搜索选择的商品列表
            initSelectGoods() {
                const arr = [];
                this.searchGoods.forEach(item => {
                    if (item.checked && !this.selectGoods.includes(item.prodCode)) {
                        arr.push(item.prodCode);
                    }
                });
                this.selectGoods = this.selectGoods.concat(arr);
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
            },
            // 选中搜索商品
            toggleGoodChecked(index) {
                const item = this.searchGoods[index];
                this.$set(item, 'checked', !item.checked);
                if (!item.checked) {
                    this.selectGoods.splice(this.selectGoods.indexOf(item.prodCode), 1);
                    this.removeGoodByCode(item.prodCode);
                } else {
                    this.initSelectGoods();
                }
            },
            // 取消选中后删除表中对应的商品
            removeGoodByCode(spuCode) {
                let targetIndex = null;
                this.tableData.forEach((item, index) => {
                    if (item.spuCode === spuCode) {
                        targetIndex = index;
                    }
                });
                if (targetIndex !== null && targetIndex >= 0) {
                    this.tableData.splice(targetIndex, 1);
                }
            },
            // 初始化接口参数
            initParams() {
                const data = {
                    ...this.form
                };
                data.spuCodes = this.selectGoods;
                // todo 如果活动未开始 spuCodes为活动商品表中的所有 否则的话就是添加的部分
                if (this.form.status === this.activityStatus.waiting) {
                    const arr = [];
                    this.tableData.forEach(item => {
                        arr.push(item.spuCode);
                    });
                    data.spuCodes = arr;
                }
                data.startPrice = this.form.rules[0].startPrice;
                const t = this.form.time;
                if (t && t.length) {
                    data.startTime = t[0];
                    data.endTime = t[1];
                }
                return data;
            },
            // 校验提交参数
            validateParams() {
                let valid = true;
                const rules = this.form.rules;
                for (let i = 0, len = rules.length; i < len; i++) {
                    valid = this.rulesInputValidate(i, 'startPrice') && this.rulesInputValidate(i, 'rate');
                    if (!valid) return valid;
                }
                // 必须添加活动商品
                if (!this.tableData.length) {
                    this.$message.warning('请添加活动商品');
                    return false;
                }
                valid = this.couponCountCheck();
                return valid;
            },
            // 提交添加活动
            onSubmit() {
                this.$refs['form'].validate(valid => {
                    if (valid && this.validateParams()) {
                        const params = this.initParams();
                        this.loading = true;
                        request.addOrModifyExperience(params).then(res => {
                            this.loading = false;
                            this.$message.success(res.msg);
                            this.$router.push({ path: '/expManage' });
                        }).catch(res => {
                            this.loading = false;
                        });
                    } else {
                        return false;
                    }
                });
            },
            // 如果是编辑 获取经验值活动信息
            getExpActiveDetail(activityCode) {
                this.loading = true;
                request.queryExpByCode({ code: activityCode }).then(res => {
                    this.loading = false;
                    const data = Object.assign({}, res.data);
                    const startTime = moment(data.startTime).format('YYYY-MM-DD HH:mm:ss');
                    const endTime = moment(data.endTime).format('YYYY-MM-DD HH:mm:ss');
                    data.startTime = startTime;
                    data.endTime = endTime;
                    data.time = [startTime, endTime];
                    this.form = data;
                    this.tableLoading = true;
                    this.activityCode = res.data.activityCode;
                    // 获取优惠券信息
                    data.couponId && this.getCouponById(data.couponId);
                    // 获取活动商品列表
                    this.getExpActiveGoods();
                }).catch(res => {
                    this.loading = false;
                    this.$message.warning(res.msg);
                });
            },
            // 获取编辑状态下的活动商品列表
            getExpActiveGoods() {
                const data = {
                    activityCode: this.form.activityCode,
                    page: 1,
                    pageSize: 2000
                };
                request.queryActivityProdPageList(data).then(res => {
                    this.tableLoading = false;
                    const data = res.data.data || [];
                    this.tableData = data;
                    const codes = [];
                    data.forEach(item => {
                        codes.push(item.spuCode);
                    });
                    this.originTableSpuCodes = codes;
                }).catch(res => {
                    this.tableLoading = false;
                    this.$message.warning(res.msg);
                });
            }
        },
        mounted() {
            const type = this.$route.query.type;
            const activityCode = this.$route.query.id;
            this.type = type || 'add';

            // 获取编辑信息
            if (type === 'edit') {
                if (!activityCode || activityCode === 'undefined' || activityCode === 'null') return this.$message.warning('错误的活动id');
                this.getExpActiveDetail(activityCode);
            }
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
