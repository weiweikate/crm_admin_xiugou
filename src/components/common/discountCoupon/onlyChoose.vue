<template>
    <div class="choose-box">
        <div style="margin-top: 10px">
            <div class="check-area">
                <div class="title">一级类目</div>
                <div class="data-area">
                    <el-radio-group v-model="firstCategoryName">
                        <div v-for="(item,index) in first" :key="index">
                            <el-radio @change="getSecond(item,true)"
                                      :label="item.name" :value="item.id">
                            </el-radio>
                        </div>
                    </el-radio-group>
                </div>
            </div>
            <div class="check-area">
                <div class="title">二级类目</div>
                <div v-if="second.length>0" class="data-area">
                    <el-radio-group v-model="secondCategoryName">
                        <div v-for="(item,index) in second" :key="index">
                            <el-radio @change="getThird(item,true)"
                                      :label="item.name" :value="item.id">
                            </el-radio>
                        </div>
                    </el-radio-group>
                </div>
                <div v-else class="nodata">
                    暂无数据~
                </div>
            </div>
            <div class="check-area">
                <div class="title">三级类目</div>
                <div v-if="third.length>0" class="data-area">
                    <el-radio-group v-model="thirdCategoryName">
                        <div v-for="(item,index) in third" :key="index">
                            <el-radio @change="getProductList(item,true)"
                                      :label="item.name" :value="item.id">
                            </el-radio>
                        </div>
                    </el-radio-group>
                </div>
                <div v-else class="nodata">
                    暂无数据~
                </div>
            </div>
            <div class="check-area">
                <div class="title">产品
                    <el-input
                        placeholder="请输入产品名称或者ID进行查找"
                        suffix-icon="el-icon-search">
                    </el-input>
                </div>
                <div v-if="productList.length>0" class="data-area">
                    <el-radio-group v-model="productName">
                        <div v-for="(item,index) in productList" :key="index" class="product-list">
                            <el-radio @change="chooseProduct(item,index)"
                                      :value="item.id" :label="item.labelName">{{item.labelName}}
                            </el-radio>
                            <!--<span class="product-item" @change="chooseProduct(item,index)">产品ID:{{item.id}} <span class="product-name">{{item.name}}</span></span>-->
                        </div>
                    </el-radio-group>
                </div>
                <div v-else class="nodata">
                    暂无数据~
                </div>
            </div>
            <div class="clearfix"></div>
            <div style="margin-top: 10px">
                <div v-if="firstClassifyTag.name">
                    一级类目：
                    <el-tag
                        closable @close="deleteTags(1)">
                        {{firstClassifyTag.name}}
                    </el-tag>
                </div>
                <div v-if="secondClassifyTag.name">
                    二级类目：
                    <el-tag
                        closable @close="deleteTags(2)">
                        {{secondClassifyTag.name}}
                    </el-tag>
                </div>
                <div v-if="thirdClassifyTag.name">
                    三级类目：
                    <el-tag
                        closable @close="deleteTags(3)">
                        {{thirdClassifyTag.name}}
                    </el-tag>
                </div>
                <div v-if="productTag.id">
                    产品ID：
                    <el-tag
                        closable @close="deleteTags(4)">
                        {{productTag.id}}
                    </el-tag>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
    import icon from '@/components/common/ico';
    import request from '@/http/http.js';

    export default {
        components: {
            icon
        },
        props: ['getProducts', 'isOnly'],
        data() {
            return {
                first: [], // 一级类目
                second: [], // 二级类目
                third: [], // 二级类目
                productList: [], // 产品列表
                firstCategoryId: '', // 一级类目id
                secondCategoryId: '', // 二级类目id
                thirdCategoryId: '', // 三级类目id
                productId: '', // 产品id
                firstCategoryName: '', // 一级类目名称
                secondCategoryName: '', // 二级类目名称
                thirdCategoryName: '', // 三级类目名称
                productName: '', // 产品名称
                loading: false, // 数据加载层
                firstClassifyTag: {}, // 一级类目标签
                secondClassifyTag: {}, // 二级类目标签
                thirdClassifyTag: {}, // 三级类目标签
                productTag: {}, // 产品标签
                param: ''// 产品参数

            };
        },
        watch: {
            getProducts(params) {
                this.resetValue();
                if (params.firstCategoryIds) {
                    this.firstCategoryId = params.firstCategoryIds;
                    this.firstCategoryName = params.firstCategoryNames;
                    this.firstClassifyTag = {
                        id: this.firstCategoryId,
                        name: this.firstCategoryName
                    };
                } else {
                    this.firstCategoryId = '';
                    this.firstCategoryNames = '';
                }
                if (params.secondCategoryIds) {
                    this.secondCategoryId = params.secondCategoryIds;
                    this.secondCategoryName = params.secondCategoryNames;
                    this.secondClassifyTag = {
                        id: this.secondCategoryId,
                        name: this.secondCategoryName
                    };
                } else {
                    this.secondCategoryId = '';
                    this.secondCategoryName = '';
                }
                if (params.thirdCategoryIds) {
                    this.thirdCategoryId = params.thirdCategoryIds;
                    this.thirdCategoryName = params.thirdCategoryNames;
                    this.thirdClassifyTag = {
                        id: this.thirdCategoryId,
                        name: this.thirdCategoryName
                    };
                } else {
                    this.thirdCategoryId = '';
                    this.thirdCategoryName = '';
                }
                if (params.products) {
                    this.productId = params.products;
                    this.productName = params.productNames;
                    this.productTag = {
                        id: this.productId
                    };
                } else {
                    this.productId = '';
                }
                this.getFirst();
                if (this.isOnly) {
                    this.getSecond(this.firstClassifyTag, false);
                    this.getProductList(this.secondClassifyTag, false);
                }
            }
        },
        created() {
            this.getFirst();
            this.resetValue();
        },
        methods: {
            resetValue() {
                this.firstClassifyTag = {};
                this.secondClassifyTag = {};
                this.thirdClassifyTag = {};
                this.productTag = {};
            },
            getFirst() {
                const that = this;
                that.loading = true;
                const data = {
                    page: 1,
                    pageSize: 10000,
                    level: 1,
                    fatherId: 0,
                    status: 1
                };
                // 获取一级类目并回显选中状态
                request.queryProductCategoryList(data).then(res => {
                    that.first = res.data.data;
                    that.loading = false;
                }).catch(error => {
                    console.log(error);
                    that.loading = false;
                });
            },
            // 获取二级类目
            // item选中项 index选中索引值
            getSecond(item, status) {
                const that = this;
                if (status) {
                    that.firstCategoryName = item.name;
                    that.firstClassifyTag = item;
                    that.second = [];
                    that.third = [];
                    that.productList = [];
                    that.secondClassifyTag = [];
                    that.thirdClassifyTag = [];
                    that.productTag = [];
                }
                that.firstCategoryId = item.id;
                const data = {
                    fatherId: item.id,
                    page: 1,
                    pageSize: 10000,
                    level: 2,
                    status: 1
                };
                that.loading = false;
                // 获取二级类目并回显选中状态
                request.queryProductCategoryList(data).then(res => {
                    that.second = res.data.data;
                }).catch(err => {
                    console.log(err);
                    that.loading = false;
                });
                this.transValue();// 向父组件传值
            },
            // 获取三级类目
            // item选中项 index选中索引值
            getThird(item, status) {
                const that = this;
                if (status) {
                    that.secondCategoryName = item.name;
                    that.secondClassifyTag = item;
                    that.third = [];
                    that.productList = [];
                    that.thirdClassifyTag = [];
                    that.productTag = [];
                }
                that.secondCategoryId = item.id;
                const data = {
                    fatherId: item.id,
                    page: 1,
                    pageSize: 10000,
                    level: 3,
                    status: 1
                };
                that.loading = false;
                // 获取二级类目并回显选中状态
                request.queryProductCategoryList(data).then(res => {
                    that.third = res.data.data;
                }).catch(err => {
                    console.log(err);
                    that.loading = false;
                });
                this.transValue();// 向父组件传值
            },
            // 获取产品列表
            // item选中项 index选中索引值
            getProductList(item, status) {
                const that = this;
                if (status) {
                    that.productList = [];
                    that.productTag = [];
                    that.products = [];
                    that.thirdClassifyTag = item;
                }
                that.thirdCategoryId = item.id;
                const data = {
                    firstCategoryId: that.firstCategoryId,
                    secCategoryId: that.secondCategoryId,
                    thirdCategoryId: that.thirdCategoryId,
                    param: this.param
                };
                that.loading = false;
                // 获取产品列表并回显选中状态
                request.queryProductList(data).then(res => {
                    if (!res.data) return;
                    for (const i in res.data.data) {
                        res.data.data[i].labelName = `产品ID:` + item.id + '&nbsp;&nbsp;' + item.name;
                        this.$set(res.data.data, i, res.data.data[i]);
                    }
                    that.productList = res.data.data;
                    console.log(that.productList);
                    that.loading = false;
                }).catch(err => {
                    console.log(err);
                    that.loading = false;
                });
                this.transValue();// 向父组件传值
            },
            // 选择产品
            chooseProduct(item) {
                this.productTag = item;
                this.productName = item.name;
                this.productId = item.id;
                this.transValue();// 向父组件传值
            },
            // 删除标签
            deleteTags(num) {
                if (num === 1) {
                    this.firstCategoryName = '';
                    this.firstClassifyTag = {};
                    this.second = [];
                    this.third = [];
                    this.productList = [];
                    this.deleteTags(2);
                    this.deleteTags(3);
                    this.deleteTags(4);
                } else if (num === 2) {
                    this.secondCategoryName = '';
                    this.secondClassifyTag = {};
                    this.secondClassifyTag = {};
                    this.productList = [];
                    this.deleteTags(3);
                    this.deleteTags(4);
                } else if (num === 3) {
                    this.thirdCategoryName = '';
                    this.thirdClassifyTag = {};
                    this.thirdClassifyTag = {};
                    this.productList = [];
                    this.deleteTags(4);
                } else {
                    this.productName = '';
                    this.productTag = {};
                }
            },
            // 向父组件传值
            transValue() {
                const productList = {
                    firstCategoryIds: this.firstCategoryId,
                    secondCategoryIds: this.secondCategoryId,
                    thirdCategoryIds: this.thirdCategoryId,
                    products: this.productId
                };
                this.$emit('getProductIds', JSON.stringify(productList));
            }
        }
    };
</script>
<style lang="less" scoped>
    .choose-box {
        display: inline-block;
        .opr-area {
            float: left;
            width: 150px;
            text-align: center;
            margin-left: -10px;
        }
        .expand-btn {
            cursor: pointer;
        }
        /deep/ .el-input {
            width: 230px;
        }
        /deep/ .el-input__inner {
            width: 230px;
        }
        .opr-area .el-button {
            margin-top: 30px
        }

        .opr-area .el-button:nth-child(2) {
            margin-left: 0
        }
        /deep/.el-radio__label{
            font-size: 12px;
            color: #999;
            padding-left: 5px;
        }
        /deep/.product-list .el-radio__label {
            font-size: 0;
        }
        /deep/.el-radio{
            height: 25px;
            line-height: 25px;
        }
        .product-item{
            font-size: 12px;
        }
        .product-name{
            margin-left: 10px;
        }
        .check-area {
            float: left;
            width: 180px;
            font-size: 12px;
            color: #999;
            border: 1px solid #dfdfdf;
            margin-right: 10px;
            border-radius: 5px;
        }
        .check-area:nth-child(4) {
            width: 380px;
        }

        .title {
            background: #eee;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-bottom: 1px solid #dfdfdf;
        }

        .data-area {
            line-height: 25px;
            height: 200px;
            overflow-y: auto;
            overflow-x: hidden;
            padding-left: 10px;
        }

        .nodata {
            height: 200px;
            text-align: center;
        }
        /deep/ .el-tag {
            margin-right: 5px;
        }
        .clearfix {
            clear: both;
        }

    }

</style>


