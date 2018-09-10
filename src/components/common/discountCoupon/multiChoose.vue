<template>
    <div class="choose-box">
        <div style="margin-top: 10px">
            <div class="check-area">
                <div class="title">一级类目</div>
                <div class="data-area">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
                                 @change="handleCheckAllChange">
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
                        <el-checkbox @change="getProductList(item,index)" v-model="secondChecked[index]"
                                     :value="item.id">
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
                    <el-input
                        placeholder="请输入产品名称或者ID进行查找"
                        suffix-icon="el-icon-search">
                    </el-input>
                </div>
                <div v-if="productList.length>0" class="data-area">
                    <div v-for="(item,index) in productList" :key="index">
                        <el-checkbox @change="chooseProduct(item,index)"
                                     v-model="productChecked[index]" :label="item.name" :value="item.id">
                            产品ID:{{item.id}} <span class="product-name">{{item.name}}</span>
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
                    <el-tag
                        v-for="(tag,k) in firstClassifyTags"
                        :key="k"
                        closable @close="deleteTags(1,tag,'true')">
                        {{tag.name}}
                    </el-tag>
                </div>
                <div v-if="secondClassifyTags.length">
                    二级类目：
                    <el-tag
                        v-for="(tag,k) in secondClassifyTags"
                        :key="k"
                        closable @close="deleteTags(2,tag,'true')">
                        {{tag.name}}
                    </el-tag>
                </div>
                <div v-if="productTags.length">
                    产品ID：
                    <el-tag
                        v-for="(tag,k) in productTags"
                        :key="k"
                        closable @close="deleteTags(3,tag,'true')">
                        {{tag.id}}
                    </el-tag>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
    import icon from "@/components/common/ico";
    import * as api from "@/api/OperateManage/DiscountCoupon/index.js";
    import * as pApi from "@/privilegeList/OperateManage/DiscountCoupon/index.js";

    export default {
        components: {
            icon
        },
        props: ['getProducts'],
        data() {
            return {
                first: [],//一级类目
                second: [],//二级类目
                productList: [],//产品列表
                checkAll: false,//全选
                name: '',//根据名称查询产品
                isIndeterminate: false,
                firstChecked: [],//一级类目选中状态
                secondChecked: [],//二级类目选中状态
                productChecked: [],//产品选中状态
                firstCategoryId: '',//一级类目id
                secCategoryId: '',//二级类目id
                firstCategoryIds: [],//一级类目id
                secCategoryIds: [],//二级类目id
                firstCategoryName: '',//一级类目名称
                secCategoryName: '', //二级类目名称
                firstCategoryNames: [],//一级类目名称
                secCategoryNames: [], //二级类目名称
                products: [],//产品ids
                firstIndex: '',//展开二级类目所对应的一级类目索引值
                secondIndex: '',//展开产品列表所对应的二级类目索引值
                loading: false,//数据加载层
                firstClassifyTags: [],//一级类目标签
                secondClassifyTags: [],//二级类目标签
                productTags: [],//产品标签
                firstTagIds: [],//一级类目标签ids
                secondTagIds: [],//二级类目标签ids
                productTagIds: [],//产品标签ids
                checkedList: []//选中数据，主要用于一级类目与产品列表的关联回显
            };
        },
        watch: {
            getProducts(params) {
                this.resetValue();
                if(params.firstCategoryIds){
                    if(params.firstCategoryIds.indexOf(',')==-1){
                        this.firstTagIds=this.firstCategoryIds=[Number(params.firstCategoryIds)];
                        this.firstCategoryNames=[params.firstCategoryNames];
                    }else {
                        this.firstTagIds=this.firstCategoryIds=this.toNumber(params.firstCategoryIds.split(','));
                        this.firstCategoryNames=params.firstCategoryNames.split(',');
                    }
                    for (let i in this.firstTagIds) {
                        this.firstClassifyTags.push({id: this.firstTagIds[i], name: this.firstCategoryNames[i]})
                    }
                }else{
                    this.firstCategoryNames=this.firstTagIds=this.firstCategoryIds=[];
                }
                if(params.secCategoryIds){
                    if(params.secCategoryIds.indexOf(',')==-1){
                        this.secondTagIds=this.secCategoryIds=[Number(params.secCategoryIds)];
                        this.secCategoryNames=[params.secCategoryNames];
                    }else {
                        this.secondTagIds=this.secCategoryIds=this.toNumber(params.secCategoryIds.split(','));
                        this.secCategoryNames=params.secCategoryNames.split(',');
                    }
                    for (let i in this.secondTagIds) {
                        this.secondClassifyTags.push({id: this.secondTagIds[i], name: this.secCategoryNames[i]})
                    }
                }else{
                    this.secCategoryNames=this.secondTagIds=this.secCategoryIds=[];
                }
                if(params.products){
                    if(params.products.indexOf(',')==-1){
                        this.productTagIds=this.products=[Number(params.products)];
                    }else {
                        this.productTagIds=this.products=this.toNumber((params.products.split(',')));
                    }
                    for (let i in this.productTagIds) {
                        this.productTags.push({id: this.productTagIds[i]})
                    }
                }else{
                    this.productTags=this.productTagIds=this.products=[];
                }
                this.getFirst();
            }
        },
        created() {
            this.resetValue();
            this.getFirst();
        },
        methods: {
            resetValue(){
                this.firstCategoryIds=[];
                this.secCategoryNames=[];
                this.products=[];
                this.firstClassifyTags=[];
                this.secondClassifyTags=[];
                this.productTags=[];
                this.firstTagIds=[];
                this.secondTagIds=[];
                this.productTagIds=[];
                this.checkedList=[];
                this.checkAll=false;
            },
            getFirst() {
                let that = this;
                that.loading = true;
                //获取一级类目并回显选中状态
                that.$axios
                    .post(api.getFirstList, {})
                    .then(res => {
                        if (res.data.code == 200) {
                            that.first = res.data.data;
                            res.data.data.forEach(function (v, k) {
                                if (that.firstTagIds.indexOf(v.id) != -1) {
                                    that.firstChecked[k] = true
                                } else {
                                    that.firstChecked[k] = false
                                }
                            });
                            that.loading = false;
                            that.isFirstAllCheck();
                        } else {
                            that.$message.warning(res.data.msg);
                            that.loading = false
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        that.loading = false
                    })
            },
            //品类全选
            handleCheckAllChange() {
                for (let i in this.firstChecked) {
                    this.firstChecked[i] = this.checkAll;
                }
                this.isFirstAllCheck();
                let that = this;
                if (this.checkAll) {
                    that.first.forEach(function (v, k) {
                        that.addTags(1, v);
                        that.firstCategoryIds.push(v.id)
                    })
                } else {
                    that.first.forEach(function (v, k) {
                        that.deleteTags(1, v, 'false');
                    });
                    that.firstCategoryIds=[];
                }
                this.transValue();//向父组件传值
            },
            //判断品类是否全选
            isFirstAllCheck() {
                let count = 0;
                for (let i in this.firstChecked) {
                    if (this.firstChecked[i]) {
                        count++;
                    }
                }
                this.isIndeterminate = count > 0 && this.firstChecked.length > count;
                if (count == 0) {
                    this.checkAll = false
                }
                if(count==this.firstChecked.length){
                    this.checkAll=true
                }else{
                    this.checkAll=false
                }
                this.transValue();//向父组件传值
            },
            //判断上一级、上上级(一级二级类目)是否选中
            isFirstSecondCheck(num) {
                let that = this;
                let temp = num == 1 ? this.secondChecked : this.productChecked;//操作对象
                let preTemp = num == 1 ? this.firstChecked : this.secondChecked;//操作对象的上一级
                let tempIndex = num == 1 ? this.firstIndex : this.secondIndex;//操作对象上一级的索引值
                let preClassify = num == 1 ? this.first : this.second;//操作对象上一级数据
                let classify = num == 1 ? this.second : this.productList;//操作对象数据
                let count = 0;
                for (let i in temp) {
                    if (temp[i]) {
                        count++;
                    }
                }
                preTemp[tempIndex] = temp.length == count;
                if (!preTemp[tempIndex]) {//上一级标签非全选时，移除上一级标签值，增加下一级标签值
                    this.deleteTags(num, preClassify[tempIndex], 'false');
                    classify.forEach(function (v, k) {
                        if (temp[k]) {
                            that.addTags(parseInt(num + 1), v)
                        }
                    })
                } else {//上一级全选时，清除下一级标签值
                    classify.forEach(function (v, k) {
                        that.deleteTags(parseInt(num + 1), v, 'false')
                    });
                    this.addTags(num, preClassify[tempIndex])
                }
                if (num == 1) {
                    this.isFirstAllCheck()
                }
                if (num == 2) {//产品=>二级类目全部选中=>选中一级类目，清除二级类目
                    this.isFirstSecondCheck(1);
                }
                this.transValue()
            },
            //获取二级类目
            // item选中项 index选中索引值
            getSecond(item, index) {
                let that = this;
                that.firstCategoryName = item.name;
                if (that.firstChecked[index]) {//改变对应一级类目的选中值
                    that.addTags(1, item);//增加一级类目标签值
                    that.changePreValues(item, 'add', 1);
                    that.second.forEach(function (v, k) {
                        that.deleteTags(2, v, 'false');//删除二级类目标签值
                    });
                    that.deleteProductTags(item);//删除对应产品标签值
                } else {
                    that.deleteTags(1, item, 'false');//移除一级类目标签值
                    that.changePreValues(item, 'delete', 1);
                }

                //封装一级类目与产品列表，作用于跨级回显
                let firstIds = [];
                that.checkedList.forEach(function (v, k) {
                    firstIds.push(v.id)
                });
                if (firstIds.indexOf(item.id) == -1) {
                    that.checkedList.push({id: item.id, productIds: []});
                }

                that.isFirstAllCheck();//全品类的选中状态
                //切换一级类目，二级类目产品列表重新赋值
                that.productList = [];
                that.secCategoryId = '';
                if (that.firstCategoryId == item.id) {
                    that.changeNextValues(1, index);//改变二级类目的选中状态
                    return
                }
                that.second = [];
                that.secondChecked = [];
                that.firstIndex = index;
                that.firstCategoryId = item.id;
                let data = {
                    fatherid: item.id,
                };
                that.loading = false;
                //获取二级类目并回显选中状态
                that.$axios
                    .post(api.getSecondList, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            that.second = res.data.data;
                            res.data.data.forEach(function (v, k) {
                                if (that.secondTagIds.indexOf(v.id) != -1 || that.firstChecked[index]) {
                                    that.secondChecked[k] = true
                                } else {
                                    that.secondChecked[k] = false
                                }
                                that.loading = false
                            })
                        } else {
                            that.$message.warning(res.data.msg);
                            that.loading = false
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        that.loading = false
                    });
            },
            //获取产品列表
            // item选中项 index选中索引值
            getProductList(item, index) {
                let that = this;
                if (that.secondChecked[index]) {//改变对应二级类目的选中值
                    that.secCategoryName = item.name;
                    that.addTags(2, item);//增加二级类目标签值
                    that.changePreValues(item, 'add', 2);
                    that.productList.forEach(function (v, k) {
                        that.deleteTags(3, v, 'false');//删除二级类目标签值
                    })
                } else {
                    that.deleteTags(2, item, 'false');//移除二级类目标签值
                    that.changePreValues(item, 'delete', 2);
                }
                that.isFirstSecondCheck(1);//一级类目的选中状态
                if (that.secCategoryId == item.id) {
                    that.changeNextValues(2, index);//改变产品的选中状态
                    return
                }
                that.productList = [];
                that.productChecked = [];
                that.products = [];
                that.secondIndex = index;
                that.secCategoryId = item.id;
                let data = {
                    page: 1,
                    pageSize: 10000,
                    firstCategoryId: that.firstCategoryId,
                    secCategoryId: that.secCategoryId,
                    url: pApi.queryProductPageList
                };
                that.loading = false;
                //获取产品列表并回显选中状态
                that.$axios
                    .post(api.queryProductPageList, data)
                    .then(res => {
                        that.productList = res.data.data.data;
                        res.data.data.data.forEach(function (v, k) {
                            if (that.productTagIds.indexOf(v.id) != -1 || that.secondChecked[index]) {
                                that.productChecked[k] = true
                            } else {
                                that.productChecked[k] = false
                            }
                        });
                        that.loading = false
                    })
                    .catch(err => {
                        console.log(err);
                        that.loading = false
                    });

            },
            //选择产品
            chooseProduct(item, index) {
                if (this.productChecked[index]) {
                    this.addTags(3, item);//增加产品Ids标签值
                    if (this.products.indexOf(item.id) == -1) {
                        this.products.push(item.id);
                    }
                } else {
                    this.deleteTags(3, item, 'false');//移除产品Ids标签值
                    if (this.products.indexOf(item.id) != -1) {
                        for (let i in this.products) {
                            if (this.products[i] == item.id) {
                                this.products.splice(i, 1);
                            }
                        }
                    }
                }
                let that = this;
                that.checkedList.forEach(function (v, k) {//封装一级类目与产品列表，作用于跨级回显
                    if (v.id == that.firstCategoryId) {
                        if (that.productChecked[index]) {
                            v.productIds.push(item.id)
                        } else {
                            for (let i in v.productIds) {
                                if (item.id == v.productIds[i]) {
                                    v.productIds.splice(i, 1)
                                }
                            }
                        }
                    }
                });
                this.isFirstSecondCheck(2);//二级类目的选中状态
                this.transValue()//向父组件传值
            },
            //一级类目选中后删除对应产品列表标签值
            deleteProductTags(item) {
                let that = this;
                that.checkedList.forEach(function (v, k) {
                    if (v.id == item.id) {
                        for (let i in that.productTagIds) {
                            let tempId = that.productTagIds[i];
                            if (v.productIds.indexOf(tempId) != -1) {
                                that.productTagIds.splice(i, 1);
                                that.productTags.splice(i, 1);
                                if (that.productTagIds.length) {
                                    that.deleteProductTags(item)
                                }
                            }
                        }
                    }
                })
            },

            //二级类目产品列表选中改变一二级类目值
            changePreValues(item, style, num) {
                let tempIds = num == 1 ? this.firstCategoryIds : this.secCategoryIds;
                let tempNames = num == 1 ? this.firstCategoryNames : this.secCategoryNames;
                if (style == 'add') {
                    if (tempIds.indexOf(item.id) == -1) {
                        tempIds.push(item.id);
                        tempNames.push(item.name);
                    }
                } else {
                    for (let i in tempIds) {
                        if (item.id == tempIds[i]) {
                            tempIds.splice(i, 1);
                            tempNames.splice(i, 1);
                        }
                    }
                }
                this.transValue()//向父组件传值
            },
            //一级类目二级类目选中取消改变二级类目产品列表值
            changeNextValues(num, index) {
                let tempChecked = num == 1 ? this.firstChecked : this.secondChecked;
                let tempNextChecked = num == 1 ? this.secondChecked : this.productChecked;
                let tempThirdChecked = this.productChecked;
                for (let i in tempNextChecked) {
                    tempNextChecked[i] = tempChecked[index]
                }
                if (num == 1) {//清除第三级的选中状态
                    for (let j in tempThirdChecked) {
                        tempThirdChecked[j] = false
                    }
                }
                this.transValue()//向父组件传值
            },
            //增加标签值
            addTags(num, item) {
                let tag = num == 1 ? this.firstClassifyTags : num == 2 ? this.secondClassifyTags : this.productTags;
                let tagIds = num == 1 ? this.firstTagIds : num == 2 ? this.secondTagIds : this.productTagIds;
                let preClassifyId = num == 2 ? this.firstCategoryId : this.secCategoryId;//对应上一级类目id
                let preTagIds = num == 2 ? this.secondTagIds : this.productTagIds;//对应上一级标签ids;
                if (tagIds.indexOf(item.id) == -1) {
                    if (num != 1) {
                        if (preTagIds.indexOf(preClassifyId) == -1) {
                            tag.push(item);
                            tagIds.push(item.id)
                        }
                    } else {
                        tag.push(item);
                        tagIds.push(item.id)
                    }
                }
            },
            //移除标签
            deleteTags(num, item, isTag) {
                let classifyIds = [];//选择框数据ids
                let tagIds = num == 1 ? this.firstTagIds : num == 2 ? this.secondTagIds : this.productTagIds;
                let tag = num == 1 ? this.firstClassifyTags : num == 2 ? this.secondClassifyTags : this.productTags;
                let classify = num == 1 ? this.first : num == 2 ? this.second : this.productList;
                let classifyChecked = num == 1 ? this.firstChecked : num == 2 ? this.secondChecked : this.productChecked;
                let ids = num == 1 ? this.firstCategoryIds : num == 2 ? this.secondTagIds : this.productIds;

                for (let i in tagIds) {
                    if (item.id == tagIds[i]) {
                        tag.splice(i, 1);
                        tagIds.splice(i, 1)
                    }
                }
                if (isTag == 'true') {//删除标签移除选择框
                    classify.forEach(function (v, k) {
                        classifyIds.push(v.id)
                    });
                    for (let i in classifyIds) {
                        if (item.id == classifyIds[i]) {
                            classifyChecked[i] = false;
                            this.$set(classifyChecked, i, classifyChecked[i]);
                            if (num != 3) {
                                this.changeNextValues(num, i);
                                if (num == 1) {
                                    this.isFirstAllCheck();
                                }
                            }
                        }
                    }
                    for(let i in ids){
                        if(ids[i]==item.id){
                            ids.splice(i,1)
                        }
                    }
                    this.transValue()//向父组件传值
                }
            },
            //向父组件传值
            transValue() {
                let productList = {
                    firstCategoryIds: this.firstCategoryIds,
                    secCategoryIds: this.secCategoryIds,
                    products: this.products,
                    checkAll:this.checkAll
                };

                this.$emit('getProductIds', JSON.stringify(productList))
            },
            //字符串转数组
            toNumber(arr){
                let newArr=[];
                for(let i in arr){
                    newArr.push(Number(arr[i]));
                }
                return newArr
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
        /deep/ .el-checkbox__label {
            font-size: 12px;
            color: #999;
            padding-left: 5px;
        }
        .check-area {
            float: left;
            width: 200px;
            font-size: 12px;
            color: #999;
            border: 1px solid #dfdfdf;
            margin-right: 10px;
            border-radius: 5px;
        }
        .check-area:nth-child(3) {
            width: 440px;
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
        .product-name{
            margin-left: 10px;
        }
    }

</style>


