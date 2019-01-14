<template>
    <div class="choose-box">
        <div style="margin-top: 10px">
            <div class="check-area">
                <div class="title">一级类目</div>
                <div class="data-area">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                        <span>全品类</span>
                    </el-checkbox>
                    <div v-loading="loading" v-for="(item,index) in first" :key="index">
                        <el-checkbox @change="getSecond(item,index)" v-model="firstChecked[index]" :value="item.id">
                        </el-checkbox>
                        <span class="expand-btn" @click="getSecond(item,index)">{{item.name}}</span>
                    </div>
                </div>
            </div>
            <div class="check-area">
                <div class="title">二级类目</div>
                <div v-if="second.length>0" class="data-area">
                    <div v-loading="loading" v-for="(item,index) in second" :key="index">
                        <el-checkbox @change="getThird(item,index)" v-model="secondChecked[index]" :value="item.id">
                        </el-checkbox>
                        <span class="expand-btn" @click="getThird(item,index)">{{item.name}}</span>
                    </div>
                </div>
                <div v-else class="nodata">
                    暂无数据~
                </div>
            </div>
            <div class="check-area">
                <div class="title">三级类目</div>
                <div v-if="third.length>0" class="data-area">
                    <div v-loading="loading" v-for="(item,index) in third" :key="index">
                        <el-checkbox @change="getProductList(item,index)" v-model="thirdChecked[index]" :value="item.id">
                        </el-checkbox>
                        <span class="expand-btn" @click="getProductList(item,index)">{{item.name}}</span>
                    </div>
                </div>
                <div v-else class="nodata">
                    暂无数据~
                </div>
            </div>
            <div class="check-area">
                <div class="title">产品
                    <el-input placeholder="请输入产品名称或者ID进行查找" suffix-icon="el-icon-search" v-model="param" @change="getProductList">
                    </el-input>
                </div>
                <div v-if="productList.length>0" class="data-area">
                    <div v-for="(item,index) in productList" :key="index">
                        <el-checkbox @change="chooseProduct(item,index)" v-model="productChecked[index]" :label="item.name" :value="item.id">
                            产品ID:{{item.prodCode}} <span class="product-name">{{item.name}}</span>
                        </el-checkbox>
                    </div>
                </div>
                <div v-else class="nodata">
                    暂无数据~
                </div>
            </div>
            <div class="clearfix"></div>
            <div style="margin-top: 10px">
                <div v-if="firstClassifyTags.length">
                    一级类目：
                    <el-tag v-for="(tag,k) in firstClassifyTags" :key="k" closable @close="deleteTags(1,tag,'true')">
                        {{tag.name}}
                    </el-tag>
                </div>
                <div v-if="secondClassifyTags.length">
                    二级类目：
                    <el-tag v-for="(tag,k) in secondClassifyTags" :key="k" closable @close="deleteTags(2,tag,'true')">
                        {{tag.name}}
                    </el-tag>
                </div>
                <div v-if="thirdClassifyTags.length">
                    三级类目：
                    <el-tag v-for="(tag,k) in thirdClassifyTags" :key="k" closable @close="deleteTags(3,tag,'true')">
                        {{tag.name}}
                    </el-tag>
                </div>
                <div v-if="productTags.length">
                    产品ID：
                    <el-tag v-for="(tag,k) in productTags" :key="k" closable @close="deleteTags(4,tag,'true')">
                        {{tag.prodCode}}
                    </el-tag>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
    import icon from '@/components/common/ico';
    import request from '@/http/http.js';
    import utils from '@/utils/index.js';

    export default {
        components: {
            icon
        },
        props: ['getProducts'],
        data() {
            return {
                first: [], // 一级类目
                second: [], // 二级类目
                third: [], // 三级类目
                productList: [], // 产品列表
                checkAll: false, // 全选
                name: '', // 根据名称查询产品
                isIndeterminate: false,
                firstChecked: [], // 一级类目选中状态
                secondChecked: [], // 二级类目选中状态
                thirdChecked: [], // 三级类目选中状态
                productChecked: [], // 产品选中状态
                firstCategoryId: '', // 一级类目id
                secondCategoryId: '', // 二级类目id
                thirdCategoryId: '', // 三级类目id
                firstCategoryIds: [], // 一级类目ids
                secondCategoryIds: [], // 二级类目ids
                thirdCategoryIds: [], // 三级类目ids
                firstCategoryName: '', // 一级类目名称
                secCategoryName: '', // 二级类目名称
                thirdCategoryName: '', // 二级类目名称
                firstCategoryNames: [], // 一级类目名称
                thirdCategoryNames: [], // 二级类目名称
                products: [], // 产品ids
                firstIndex: '', // 展开二级类目所对应的一级类目索引值
                secondIndex: '', // 展开产品列表所对应的二级类目索引值
                thirdIndex: '', // 展开产品列表所对应的二级类目索引值
                loading: false, // 数据加载层
                firstClassifyTags: [], // 一级类目标签
                secondClassifyTags: [], // 二级类目标签
                thirdClassifyTags: [], // 三级类目标签
                productTags: [], // 产品标签
                firstTagIds: [], // 一级类目标签ids
                secondTagIds: [], // 二级类目标签ids
                thirddTagIds: [], // 三级类目标签ids
                productTagIds: [], // 产品标签ids
                checkedList: [], // 选中数据，主要用于一级类目与产品列表的关联回显
                param: '' // 产品查询参数
            };
        },
        watch: {
            getProducts(params) {
                this.resetValue();
                // 一级类目：全品类，非全品类
                if (params.firstCategoryIds) {
                    // -1是全品类
                    if (params.firstCategoryIds !== '-1') {
                        if (params.firstCategoryIds.indexOf(',') === -1) {
                            this.firstTagIds = this.firstCategoryIds = [utils.stringToNumber(params.firstCategoryIds)];
                            this.firstCategoryNames = [params.firstCategoryNames];
                        } else {
                            this.firstTagIds = this.firstCategoryIds = this.toNumber(params.firstCategoryIds.split(','));
                            this.firstCategoryNames = params.firstCategoryNames.split(',');
                        }
                        for (const i in this.firstTagIds) {
                            this.firstClassifyTags.push({ id: this.firstTagIds[i], name: this.firstCategoryNames[i] });
                        }
                    } else {
                        this.firstCategoryIds = -1;
                        this.checkAll = true;
                    }
                } else {
                    this.firstCategoryNames = this.firstTagIds = this.firstCategoryIds = [];
                }
                // 二级类目
                if (params.secondCategoryIds) {
                    if (params.secondCategoryIds.indexOf(',') === -1) {
                        this.secondTagIds = this.secondCategoryIds = [utils.stringToNumber(params.secondCategoryIds)];
                        this.secondCategoryNames = [params.secondCategoryNames];
                    } else {
                        this.secondTagIds = this.secondCategoryIds = this.toNumber(params.secondCategoryIds.split(','));
                        this.secondCategoryNames = params.secondCategoryNames.split(',');
                    }
                    for (const i in this.secondTagIds) {
                        this.secondClassifyTags.push({ id: this.secondTagIds[i], name: this.secondCategoryNames[i] });
                    }
                } else {
                    this.secondCategoryNames = this.secondTagIds = this.secondCategoryIds = [];
                }
                // 三级类目
                if (params.thirdCategoryIds) {
                    if (params.thirdCategoryIds.indexOf(',') === -1) {
                        this.thirdTagIds = this.thirdCategoryIds = [utils.stringToNumber(params.thirdCategoryIds)];
                        this.thirdCategoryNames = [params.thirdCategoryNames];
                    } else {
                        this.thirdTagIds = this.thirdCategoryIds = this.toNumber(params.thirdCategoryIds.split(','));
                        this.thirdCategoryNames = params.thirdCategoryNames.split(',');
                    }
                    for (const i in this.thirdTagIds) {
                        this.thirdClassifyTags.push({ id: this.thirdTagIds[i], name: this.thirdCategoryNames[i] });
                    }
                } else {
                    this.thirdCategoryNames = this.thirdTagIds = this.thirdCategoryIds = [];
                }
                // 产品
                if (params.products) {
                    if (params.products.indexOf(',') === -1) {
                        this.productTagIds = this.products = [params.products];
                    } else {
                        this.productTagIds = this.products = params.products.split(',');
                    }
                    for (const i in this.productTagIds) {
                        this.productTags.push({ prodCode: this.productTagIds[i] });
                    }
                } else {
                    this.productTags = this.productTagIds = this.products = [];
                }
                this.getFirst();// 默认加载一级类目
            }
        },
        created() {
            this.resetValue();
            this.getFirst();
        },
        activated() {
            this.resetValue();
            this.getFirst();
        },
        methods: {
            // 数据重置
            resetValue() {
                this.first = [];
                this.second = [];
                this.third = [];
                this.productList = [];
                this.isIndeterminate = false;
                this.firstCategoryIds = [];
                this.secondCategoryIds = [];
                this.thirdCategoryIds = [];
                this.firstCategoryNames = [];
                this.secondCategoryNames = [];
                this.thirdCategoryNames = [];
                this.products = [];
                this.firstClassifyTags = [];
                this.secondClassifyTags = [];
                this.thirdClassifyTags = [];
                this.productTags = [];
                this.firstTagIds = [];
                this.secondTagIds = [];
                this.thirdTagIds = [];
                this.productTagIds = [];
                this.checkedList = [];
                this.checkAll = false;
                this.param = '';
                this.firstCategoryId = '';
                this.secondCategoryId = '';
                this.thirdCategoryId = '';
                this.firstIndex = ''; // 展开二级类目所对应的一级类目索引值
                this.secondIndex = ''; // 展开产品列表所对应的二级类目索引值
                this.thirdIndex = ''; // 展开产品列表所对应的二级类目索引值
                this.firstChecked = []; // 一级类目选中状态
                this.secondChecked = []; // 二级类目选中状态
                this.thirdChecked = []; // 三级类目选中状态
                this.productChecked = []; // 产品选中状态
            },
            // 获取一级类目
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
                request
                    .queryProductCategoryList(data)
                    .then(res => {
                        that.first = res.data.data;
                        if (that.firstCategoryIds === -1) {
                            that.firstCategoryIds = [];
                            that.firstCategoryNames = [];
                            that.firstTagIds = [];
                            that.firstClassifyTags = [];
                        }
                        res.data.data.forEach(function(v, k) {
                            if (that.firstTagIds.indexOf(v.id) !== -1 || that.checkAll) {
                                that.firstChecked[k] = true;
                            } else {
                                that.firstChecked[k] = false;
                            }
                            // 全品类
                            if (that.checkAll) {
                                that.firstCategoryNames.push(v.name);
                                that.firstTagIds.push(v.id);
                                that.firstCategoryIds.push(v.id);
                                that.firstClassifyTags.push({ id: v.id, name: v.name });
                            }
                        });
                        that.loading = false;
                        that.isFirstAllCheck();// 判断品类是否全选
                    })
                    .catch(error => {
                        console.log(error);
                        that.loading = false;
                    });
            },
            // 品类全选
            handleCheckAllChange() {
                for (const i in this.firstChecked) {
                    this.firstChecked[i] = this.checkAll;
                }
                this.isFirstAllCheck();
                const that = this;
                if (this.checkAll) {
                    this.secondClassifyTags = [];
                    this.thirdClassifyTags = [];
                    this.products = [];
                    that.first.forEach(function(v, k) {
                        that.addTags(1, v);
                    });
                } else {
                    that.first.forEach(function(v, k) {
                        that.deleteTags(1, v, 'false');
                    });
                }
                this.second = [];
                this.third = [];
                this.productList = [];
                this.transValue(); // 向父组件传值
            },
            // 判断品类是否全选
            isFirstAllCheck() {
                let count = 0;
                for (const i in this.firstChecked) {
                    if (this.firstChecked[i]) {
                        count++;
                    }
                }
                this.isIndeterminate = count > 0 && this.firstChecked.length > count;
                if (count === 0) {
                    this.checkAll = false;
                }
                if (count === this.firstChecked.length) {
                    this.checkAll = true;
                } else {
                    this.checkAll = false;
                }
                this.transValue(); // 向父组件传值
            },
            // 判断上一级、上上级(一级二级三级类目)是否选中
            isUpCheck(num) {
                const that = this;
                const temp = num === 1 ? this.secondChecked : num === 2 ? this.thirdChecked : this.productChecked; // 操作对象
                const preTemp = num === 1 ? this.firstChecked : num === 2 ? this.secondChecked : this.thirdChecked; // 操作对象的上一级
                const tempIndex = num === 1 ? this.firstIndex : num === 2 ? this.secondIndex : this.thirdIndex; // 操作对象上一级的索引值
                const preClassify = num === 1 ? this.first : num === 2 ? this.second : this.third; // 操作对象上一级数据
                const classify = num === 1 ? this.second : num === 2 ? this.third : this.productList; // 操作对象数据
                let count = 0;
                for (const i in temp) {
                    if (temp[i]) {
                        count++;
                    }
                }
                preTemp[tempIndex] = temp.length === count;
                if (!preTemp[tempIndex]) {
                    // 上一级标签非全选时，移除上一级标签值，增加下一级标签值
                    this.deleteTags(num, preClassify[tempIndex], 'false');
                    classify.forEach(function(v, k) {
                        if (temp[k]) {
                            that.addTags(parseInt(num + 1), v);
                        }
                    });
                } else {
                    // 上一级全选时，清除下一级标签值
                    classify.forEach(function(v, k) {
                        that.deleteTags(parseInt(num + 1), v, 'false');
                    });
                    this.addTags(num, preClassify[tempIndex]);
                }
                if (num === 1) {
                    this.isFirstAllCheck();
                } else {
                    // 产品=>三级类目全部选中=>二级=>选中一级类目，清除二级类目
                    this.isUpCheck(num - 1);
                }
                this.transValue();
            },
            // 获取二级类目
            // item选中项 index选中索引值
            getSecond(item, index) {
                const that = this;
                that.firstCategoryName = item.name;
                if (that.firstChecked[index]) {
                    // 改变对应一级类目的选中值
                    that.addTags(1, item); // 增加一级类目标签值
                    that.second.forEach(function(v, k) {
                        that.deleteTags(2, v, 'false'); // 删除二级类目标签值
                    });
                } else {
                    that.deleteTags(1, item, 'false'); // 移除一级类目标签值
                }

                // 封装一级类目与三级类目、产品列表，作用于跨级回显
                const firstIds = [];
                that.checkedList.forEach(function(v, k) {
                    firstIds.push(v.id);
                });
                if (firstIds.indexOf(item.id) === -1) {
                    that.checkedList.push({ id: item.id, third: [], productCodes: [] });
                }

                that.isFirstAllCheck(); // 全品类的选中状态
                // 切换一级类目，二级类目，三级类目产品列表重新赋值
                that.third = [];
                that.productList = [];
                that.secondCategoryId = '';
                if (that.firstCategoryId === item.id) {
                    that.changeNextValues(1, index); // 改变二级类目的选中状态
                    return;
                }
                that.second = [];
                that.secondChecked = [];
                that.firstIndex = index;
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
                request
                    .queryProductCategoryList(data)
                    .then(res => {
                        that.second = res.data.data;
                        res.data.data.forEach(function(v, k) {
                            if (that.secondTagIds.indexOf(v.id) !== -1 || that.firstChecked[index]) {
                                that.secondChecked[k] = true;
                            } else {
                                that.secondChecked[k] = false;
                            }
                            that.loading = false;
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        that.loading = false;
                    });
            },
            // 获取三级类目
            // item选中项 index选中索引值
            getThird(item, index) {
                const that = this;
                that.secondCategoryName = item.name;
                if (that.secondChecked[index]) {
                    // 改变对应二级类目的选中值
                    that.addTags(2, item); // 增加二级类目标签值
                    that.third.forEach(function(v, k) {
                        that.deleteTags(3, v, 'false'); // 删除三级类目标签值
                    });
                    that.deleteProductTags(item); // 删除对应产品标签值
                } else {
                    that.deleteTags(2, item, 'false'); // 移除二级类目标签值
                }
                that.isUpCheck(1); // 一级类目的选中状态
                // 封装一级类目与产品列表，作用于跨级回显
                const secondIds = [];
                that.checkedList.forEach(function(v, k) {
                    secondIds.push(v.id);
                });
                if (secondIds.indexOf(item.id) === -1) {
                    that.checkedList.push({ id: item.id, productCodes: [] });
                }

                that.isFirstAllCheck(); // 全品类的选中状态
                // 切换一级类目，二级类目，三级类目，产品列表重新赋值
                that.productList = [];
                that.thirdCategoryId = '';
                if (that.secondCategoryId === item.id) {
                    that.changeNextValues(2, index); // 改变三级类目的选中状态
                    return;
                }
                that.third = [];
                that.thirdChecked = [];
                that.secondIndex = index;
                that.secondCategoryId = item.id;
                const data = {
                    fatherId: item.id,
                    page: 1,
                    pageSize: 10000,
                    level: 3,
                    status: 1
                };
                that.loading = false;
                // 获取三级类目并回显选中状态
                request
                    .queryProductCategoryList(data)
                    .then(res => {
                        that.third = res.data.data;
                        res.data.data.forEach(function(v, k) {
                            if (that.thirdTagIds.indexOf(v.id) !== -1 || that.secondChecked[index]) {
                                that.thirdChecked[k] = true;
                            } else {
                                that.thirdChecked[k] = false;
                            }
                            that.loading = false;
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        that.loading = false;
                    });
            },
            // 获取产品列表
            // item选中项 index选中索引值
            getProductList(item, index) {
                const that = this;
                if (index || index === 0) {
                    if (that.thirdChecked[index]) {
                        // 改变对应三级类目的选中值
                        that.thirdCategoryName = item.name;
                        that.addTags(3, item); // 增加三级类目标签值
                        that.productList.forEach(function(v, k) {
                            that.deleteTags(4, v, 'false'); // 删除产品标签值
                        });
                    } else {
                        that.deleteTags(3, item, 'false'); // 移除三级类目标签值
                    }
                    that.isUpCheck(1); // 一级类目的选中状态
                    that.isUpCheck(2); // 二级类目的选中状态
                    if (that.thirdCategoryId === item.id) {
                        that.changeNextValues(3, index); // 改变产品的选中状态
                        return;
                    }
                    that.productList = [];
                    that.productChecked = [];
                    that.products = [];
                    that.thirdIndex = index;
                    that.thirdCategoryId = item.id;
                }
                const data = {
                    firstCategoryId: that.firstCategoryId,
                    secCategoryId: that.secondCategoryId,
                    thirdCategoryId: that.thirdCategoryId,
                    param: this.param
                };
                that.loading = false;
                // 获取产品列表并回显选中状态
                request
                    .queryProductList(data)
                    .then(res => {
                        that.productList = res.data;
                        res.data.forEach(function(v, k) {
                            // 该产品已单一选中或者其父类全选
                            if (that.productTagIds.indexOf(v.prodCode) !== -1 || that.thirdChecked[index] || that.thirdIndex !== '' && that.thirdChecked[that.thirdIndex]) {
                                that.productChecked[k] = true;
                            } else {
                                that.productChecked[k] = false;
                            }
                        });
                        that.loading = false;
                    })
                    .catch(error => {
                        console.log(error);
                        that.loading = false;
                    });
            },
            // 选择产品
            chooseProduct(item, index) {
                if (this.productChecked[index]) {
                    this.addTags(4, item); // 增加产品Ids标签值
                    if (this.products.indexOf(item.prodCode) === -1) {
                        this.products.push(item.prodCode);
                    }
                } else {
                    this.deleteTags(4, item, 'false'); // 移除产品Ids标签值
                    if (this.products.indexOf(item.prodCode) !== -1) {
                        for (const i in this.products) {
                            if (this.products[i] === item.prodCode) {
                                this.products.splice(i, 1);
                            }
                        }
                    }
                }
                const that = this;
                that.checkedList.forEach(function(v, k) {
                    // 封装一级类目与产品列表，作用于跨级回显
                    if (v.id === that.firstCategoryId) {
                        if (that.productChecked[index]) {
                            v.productCodes.push(item.prodCode);
                        } else {
                            for (const i in v.productCodes) {
                                if (item.prodCode === v.productCodes[i]) {
                                    v.productCodes.splice(i, 1);
                                }
                            }
                        }
                    }
                });
                if (this.thirdCategoryId) {
                    this.isUpCheck(3); // 三级类目的选中状态
                    this.isUpCheck(2); // 二级类目的选中状态
                }
                this.transValue(); // 向父组件传值
            },
            // 一级类目选中后删除对应产品列表标签值
            deleteProductTags(item) {
                const that = this;
                that.checkedList.forEach(function(v, k) {
                    if (item && v.id === item.id) {
                        for (const i in that.productTagIds) {
                            const tempId = that.productTagIds[i];
                            if (v.productCodes.indexOf(tempId) !== -1) {
                                that.productTagIds.splice(i, 1);
                                that.productTags.splice(i, 1);
                                if (that.productTagIds.length) {
                                    that.deleteProductTags(item);
                                }
                            }
                        }
                    }
                });
            },

            // 一级类目二级类目三级类目选中取消改变二级类目三级类目产品列表值
            changeNextValues(num, index) {
                const tempChecked = num === 1 ? this.firstChecked : num === 2 ? this.secondChecked : this.thirdChecked;
                const tempNextChecked = num === 1 ? this.secondChecked : num === 2 ? this.thirdChecked : this.productChecked;
                const tempThirdChecked = this.thirdChecked;
                const tempForthChecked = this.productChecked;
                for (const i in tempNextChecked) {
                    tempNextChecked[i] = tempChecked[index];
                }
                if (num === 1) {
                    // 清除第三级,产品的选中状态
                    for (const j in tempThirdChecked) {
                        tempThirdChecked[j] = false;
                    }
                    for (const j in tempForthChecked) {
                        tempForthChecked[j] = false;
                    }
                }
                if (num === 2) {
                    // 清除产品的选中状态
                    for (const j in tempForthChecked) {
                        tempForthChecked[j] = false;
                    }
                }
                this.transValue(); // 向父组件传值
            },
            // 增加标签值
            addTags(num, item) {
                const tag = num === 1 ? this.firstClassifyTags : num === 2 ? this.secondClassifyTags : num === 3 ? this.thirdClassifyTags : this.productTags;
                const tagIds = num === 1 ? this.firstTagIds : num === 2 ? this.secondTagIds : num === 3 ? this.thirdTagIds : this.productTagIds;
                const preClassifyId = num === 2 ? this.firstCategoryId : num === 3 ? this.secondCategoryId : this.thirdCategoryId; // 对应上一级类目id
                const preTagIds = num === 2 ? this.secondTagIds : num === 3 ? this.thirdTagIds : this.productTagIds; // 对应上一级标签ids;
                const temp = num === 4 ? item.prodCode : item.id;
                if (item && tagIds.indexOf(temp) === -1) {
                    if (num !== 1) {
                        if (preTagIds.indexOf(preClassifyId) === -1) {
                            tag.push(item);
                            tagIds.push(temp);
                        }
                    } else {
                        tag.push(item);
                        tagIds.push(temp);
                    }
                }
            },
            // 移除标签
            deleteTags(num, item, isTag) {
                const classifyIds = []; // 选择框数据ids
                const tagIds = num === 1 ? this.firstTagIds : num === 2 ? this.secondTagIds : num === 3 ? this.thirdTagIds : this.productTagIds;
                const tag = num === 1 ? this.firstClassifyTags : num === 2 ? this.secondClassifyTags : num === 3 ? this.thirdClassifyTags : this.productTags;
                const classify = num === 1 ? this.first : num === 2 ? this.second : num === 3 ? this.third : this.productList;
                const classifyChecked = num === 1 ? this.firstChecked : num === 2 ? this.secondChecked : num === 3 ? this.thirdChecked : this.productChecked;
                const ids = num === 1 ? this.firstCategoryIds : num === 2 ? this.secondCategoryIds : num === 3 ? this.thirdCategoryIds : this.products;
                const temp = num === 4 ? item.prodCode : item.id;
                for (const i in tagIds) {
                    if (item && temp === tagIds[i]) {
                        tag.splice(i, 1);
                        tagIds.splice(i, 1);
                    }
                }
                if (isTag === 'true') {
                    // 删除标签移除选择框
                    classify.forEach(function(v, k) {
                        classifyIds.push(v.id);
                    });
                    for (const i in classifyIds) {
                        if (item && item.id === classifyIds[i]) {
                            classifyChecked[i] = false;
                            this.$set(classifyChecked, i, classifyChecked[i]);
                            if (num !== 4) {
                                this.changeNextValues(num, i);
                                if (num === 1) {
                                    this.isFirstAllCheck();
                                }
                            }
                        }
                    }
                    for (const i in ids) {
                        if (item && temp && ids[i] === temp) {
                            ids.splice(i, 1);
                        }
                    }
                    this.transValue(); // 向父组件传值
                }
            },
            // 向父组件传值
            transValue() {
                const firstCategoryIds = [];
                this.firstClassifyTags.forEach((v, k) => {
                    firstCategoryIds.push(v.id);
                });
                const secondCategoryIds = [];
                this.secondClassifyTags.forEach((v, k) => {
                    secondCategoryIds.push(v.id);
                });
                const thirdCategoryIds = [];
                this.thirdClassifyTags.forEach((v, k) => {
                    thirdCategoryIds.push(v.id);
                });
                const products = [];
                this.productTags.forEach((v, k) => {
                    products.push(v.prodCode);
                });
                const productList = {
                    firstCategoryIds: firstCategoryIds,// 一级
                    secondCategoryIds: secondCategoryIds,// 二级
                    thirdCategoryIds: thirdCategoryIds,// 三级
                    products: products,// 产品
                    checkAll: this.checkAll// 全品类
                };
                this.$emit('getProductIds', JSON.stringify(productList));
            },
            // 字符串转数组
            toNumber(arr) {
                const newArr = [];
                for (const i in arr) {
                    newArr.push(utils.stringToNumber(arr[i]));
                }
                return newArr;
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
            margin-top: 30px;
        }

        .opr-area .el-button:nth-child(2) {
            margin-left: 0;
        }
        /deep/ .el-checkbox__label {
            font-size: 12px;
            color: #999;
            padding-left: 5px;
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
        .product-name {
            margin-left: 10px;
        }
    }
</style>


