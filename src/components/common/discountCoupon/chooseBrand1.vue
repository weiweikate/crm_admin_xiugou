<template>
    <div class="choose-brand-box">
        <div class="choose-brand" v-if="type=='DK'">
            <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
                <div class="pro-title">选择品类</div>
                <div class="area">
                    <div class="header">
                        <div class="left">一级类目</div>
                        <div class="center">二级类目</div>
                        <div class="right">
                            产品
                            <el-input v-model="name" placeholder="请输入产品名称或者ID进行查找"
                                      suffix-icon="el-icon-search"></el-input>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <div class="body">
                        <div class="left">
                            <div v-for="(item,index) in first">
                                <el-checkbox @change="getSecond(item,index)" v-model="firstChecked[index]"
                                             :value="item.id">
                                </el-checkbox>
                                <span class="expand-btn" @click="getSecond(item,index)">{{item.name}}</span>
                            </div>
                        </div>
                        <div class="center">
                            <div v-for="(item,index) in second">
                                <el-checkbox @change="getProductList(item,index)"
                                             v-model="secondChecked[index]" :value="item.id"
                                             :disabled="secondDisabled[index]">
                                </el-checkbox>
                                <span class="expand-btn" @click="getProductList(item,index)">{{item.name}}</span>
                            </div>
                        </div>
                        <div class="right">
                            <div v-for="(item,index) in productList">
                                <el-checkbox :label="item.name" @change="chooseProduct(item,index)"
                                             v-model="productChecked[index]" :disabled="productDisabled[index]"
                                             :value="item.id">
                                    产品ID:{{item.id}} <span class="product-name">{{item.name}}</span></el-checkbox>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <el-button type="primary" @click="closeMask(true)">确定</el-button>
                <el-button @click="closeMask(false)">取消</el-button>
            </el-card>
        </div>
        <div class="choose-brand" v-else>
            <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
                <div class="pro-title">选择品类</div>
                <div class="area">
                    <div class="header">
                        <div class="left">一级类目</div>
                        <div class="center">二级类目</div>
                        <div class="right">
                            产品
                            <el-input v-model="name" placeholder="请输入产品名称或者ID进行查找"
                                      suffix-icon="el-icon-search"></el-input>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <div class="body">
                        <div class="left">
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
                                         @change="handleCheckAllChange">
                                全品类
                            </el-checkbox>
                            <div v-for="(item,index) in first" :key="index">
                                <el-checkbox @change="getSecond(item,index)" v-model="firstChecked[index]"
                                             :value="item.id">
                                </el-checkbox>
                                <span class="expand-btn" @click="getSecond(item,index)">{{item.name}}</span>
                            </div>
                        </div>
                        <div class="center">
                            <div v-for="(item,index) in second" :key="index">
                                <el-checkbox @change="getProductList(item,index)"
                                             v-model="secondChecked[index]" :value="item.id">
                                </el-checkbox>
                                <span class="expand-btn" @click="getProductList(item,index)">{{item.name}}</span>
                            </div>
                        </div>
                        <div class="right">
                            <div v-for="(item,index) in productList" :key="index">
                                <el-checkbox :label="item.name" @change="chooseProduct(item,index)"
                                             v-model="productChecked[index]" :value="item.id" >
                                    产品ID:{{item.id}} <span class="product-name">{{item.name}}</span></el-checkbox>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <el-button type="primary" @click="closeMask(true)">确定</el-button>
                <el-button @click="closeMask(false)">取消</el-button>
            </el-card>
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
        props: ['productIds', 'type'],

        data() {
            return {
                nav: ["运营管理", "优惠券设置", "优惠券管理", "选择品类"],
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
                allCheckedList: [],//总选中的产品，传参用
                firstIndex:'',//展开二级类目所对应的一级类目索引值
                secondIndex:'',//展开产品列表所对应的二级类目索引值
            };
        },
        created() {
            // this.firstCategoryId = this.productIds.firstCategoryIds;
            // this.secCategoryId = this.productIds.secCategoryIds;
            // this.products = this.productIds.productIds;
            this.getFirst();
        },

        methods: {
            //获取一级类目
            getFirst() {
                let that = this;
                that.$axios
                    .post(api.getFirstList, {})
                    .then(res => {
                        if (res.data.code == 200) {
                            that.first = res.data.data;
                            res.data.data.forEach(function (v) {
                                that.firstChecked.push(false)
                            })
                            // if (that.firstCategoryId) {
                            //     for (let i in that.firstCategoryId) {
                            //         res.data.data.forEach(function (v) {
                            //             if (v.id = that.firstCategoryId[i]) {
                            //                 that.firstChecked.push(true)
                            //             } else {
                            //                 that.firstChecked.push(false)
                            //             }
                            //         })
                            //     }
                            // } else {
                            //     res.data.data.forEach(function (v) {
                            //         that.firstChecked.push(false)
                            //     })
                            // }
                        } else {
                            that.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            //品类全选
            handleCheckAllChange() {
                for (let i in this.firstChecked) {
                    this.firstChecked[i] = this.checkAll;
                }
                this.isFirstAllCheck()
            },
            //判断品类是否全选
            isFirstAllCheck(){
                let count=0;
                for (let i in this.firstChecked) {
                    if(this.firstChecked[i]){
                        count++;
                    }
                }
                this.isIndeterminate=count>0&&this.firstChecked.length>count;
            },
            //判断一级类目是否选中
            isFirstSecondCheck(num){
                let temp=num==1?this.secondChecked:this.productChecked;
                let perTemp=num==1?this.firstChecked:this.secondChecked;
                let tempIndex=num==1?this.firstIndex:this.secondIndex;
                let count=0;
                for (let i in temp) {
                    if(temp[i]){
                        count++;
                    }
                }
                perTemp[tempIndex]=temp.length==count;
            },
            //获取二级类目
            // item选中项 index选中索引值
            getSecond(item, index) {
                let that = this;
                that.second = [];
                that.secondChecked = [];
                that.firstIndex=index;
                that.firstCategoryId = item.id;
                if (that.firstChecked[index]) {
                    that.firstCategoryName = item.name;
                    that.changePreValues(item,'add',1)
                } else {
                    that.changePreValues(item,'delete',1);
                    // that.resetData(1, item.id);//未选中时，数据重置
                    for (let i in that.productChecked) {
                        that.productChecked[i] = false;
                    }
                }
                let data = {
                    fatherid: item.id,
                };
                that.isFirstAllCheck();
                that.$axios
                    .post(api.getSecondList, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            that.second = res.data.data;
                            res.data.data.forEach(function (v) {
                                if(that.firstChecked[index]){
                                    that.secondChecked.push(true);
                                }else{
                                    that.secondChecked.push(false);
                                }
                            })
                        } else {
                            that.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            //获取产品列表
            // item选中项 index选中索引值
            getProductList(item, index) {
                let that = this;
                that.productList = [];
                that.productChecked = [];
                that.products = [];
                that.secondIndex=index;
                that.secCategoryId = item.id;
                if (that.secondChecked[index]) {
                    that.secCategoryName = item.name;
                    that.changePreValues(item,'add',2)
                } else {
                    that.changePreValues(item,'delete',2);
                    // that.resetData(2, item.id)//未选中时，数据重置
                }
                that.isFirstSecondCheck(1);
                let data = {
                    page: 1,
                    pageSize: 10000,
                    firstCategoryId: that.firstCategoryId,
                    secCategoryId: that.secCategoryId,
                    url: pApi.queryProductPageList
                };
                that.$axios
                    .post(api.queryProductPageList, data)
                    .then(res => {
                        that.productList = res.data.data.data;
                        res.data.data.data.forEach(function (v) {
                            if (that.secondChecked[index]) {
                                that.productChecked.push(true);
                            }else{
                                that.productChecked.push(false);
                            }
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            //选择产品
            chooseProduct(item, index) {
                if (this.productChecked[index]) {
                    if (this.products.indexOf(item.id) == -1) {
                        this.products.push(item.id);
                    }
                } else {
                    if (this.products.indexOf(item.id) != -1) {
                        for (let i in this.products) {
                            if (this.products[i] == item.id) {
                                this.products.splice(i, 1)
                            }
                        }
                    }
                }
                this.isFirstSecondCheck(2);
            },
            //判断是否选中产品,有则赋值，无清除一二级类目id,name
            hasProduct() {
                let count = 0;//选中长度
                let tempParam = {};
                for (let i in this.productChecked) {
                    if (this.productChecked[i]) {
                        count++;
                    }
                }
                if (count != 0) {//有选中
                    tempParam.firstCategoryId = this.firstCategoryId;
                    tempParam.secCategoryId = this.secCategoryId;
                    tempParam.firstCategoryName = this.firstCategoryName;
                    tempParam.secCategoryName = this.secCategoryName;
                    tempParam.products = this.products.join(',');
                    for (let i in this.allCheckedList) {
                        if (this.allCheckedList[i].secCategoryId == this.secCategoryId) {
                            this.allCheckedList.splice(i, 1)
                        }
                    }
                    this.allCheckedList.push(tempParam);
                } else {//无选中
                    this.firstCategoryId = '';
                    this.secCategoryId = '';
                    this.firstCategoryName = '';
                    this.secCategoryName = '';
                }
            },
            //一二级类目取消选中，清除相应的值
            //level 1一级2二级
            resetData(level, id) {
                for (let i in this.allCheckedList) {
                    if (level == 1) {
                        if (this.allCheckedList[i].firstCategoryId == id) {
                            this.allCheckedList.splice(i, 1)
                        }
                    } else {
                        if (this.allCheckedList[i].secCategoryId == id) {
                            this.allCheckedList.splice(i, 2)
                        }
                    }
                }
            },
            //弹窗
            closeMask(status) {
                // if (status) {
                //     this.$emit("productIds", JSON.stringify(this.allCheckedList));
                // } else {
                //     this.$emit("productIds", false);
                // }
            },
            //二级类目产品列表选中改变一二级类目值
            changePreValues(item,style,num){
                let tempIds=num==1?this.firstCategoryIds:this.secCategoryIds;
                let tempNames=num==1?this.firstCategoryNames:this.secCategoryNames;
                if(style=='add'){
                    if(tempIds.indexOf(item.id)==-1){
                        tempIds.push(item.id);
                        tempNames.push(item.name);
                    }
                }else{
                    for(let i in tempIds){
                        if(item.id==tempIds[i]){
                            tempIds.splice(i,1);
                            tempNames.splice(i,1);
                        }
                    }
                }
            },
            //一级类目二级类目选中取消改变二级类目产品列表值


        }
    };
</script>
<style lang='less'>
    .choose-brand-box {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        background: rgba(0, 0, 0, .3);
        .choose-brand {
            margin: 300px auto;
            width: 60%;
            color: #666;
            .el-input, .el-input__inner {
                width: 300px;
            }
            .area {
                border-radius: 5px;
                border: 1px solid #eee;
                width: 100%;
                margin-bottom: 20px;
                height: 500px;
                max-height: 500px;
                overflow-x: hidden;
                overflow-y: auto;
            }
            .pro-title, .header {
                width: 100%;
                height: 60px;
                background-color: #f7f7f7;
                line-height: 60px;
                padding: 0 25px;
                box-sizing: border-box;
                margin-bottom: 20px;
            }
            .left {
                float: left;
                width: 25%;
            }
            .center {
                float: left;
                width: 25%;
            }
            .right {
                float: right;
                width: 50%;
            }
            .clearfix {
                clear: both;
            }
            .header {
                border-bottom: 1px solid #eee;
            }
            .body {
                padding: 0 30px;
                margin-top: -20px;
                div {
                    line-height: 30px;
                }
                .expand-btn {
                    font-size: 14px;
                    cursor: pointer;
                    margin-left: 5px;
                }
            }
            .product-name {
                margin-left: 5px;
            }

        }
    }

</style>
