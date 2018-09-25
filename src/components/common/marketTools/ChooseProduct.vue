<template>
    <div class="choose-product-mask">
        <div class="choose-product">
            <el-card :body-style="{ padding: '50px' }">
                <span class="title">商品名称/ID</span>
                <el-autocomplete style='width:230px' v-model="keyWords" :fetch-suggestions="querySearchAsync"
                                 placeholder="请输入产品名称模糊搜索" @select="handleSelect"></el-autocomplete>
                <el-button type="primary" @click="getSpecList">搜索</el-button>
                <div v-if="!showResult" class="nodata">
                    <table style="text-align: center">
                        <tr>
                            <td>请输入产品名称模糊搜索~</td>
                        </tr>
                    </table>
                </div>
                <div v-else>
                    <div v-if="noResult" class="nodata">
                        <table>
                            <tr>
                                <td class="product-inf">{{name}} {{prodCode}}</td>
                                <td class="color-red no-stock">{{resultTip}}</td>
                            </tr>
                        </table>
                        <!--<div class="product-inf">{{name}} {{prodCode}}</div>-->
                        <!--<div class="color-red no-stock"></div>-->
                    </div>
                    <el-table :data="tableData" border style="margin-top:10px" v-else>
                        <el-table-column prop="spec" label="规格" align="center"></el-table-column>
                        <el-table-column label="选择" align="center" width="150px">
                            <template slot-scope="scope">
                                <el-radio @change="selectPro(scope.row)" v-model="chooseId"
                                          :disabled="scope.row.stock==0" :label="scope.row.id"
                                          :value='scope.id'>选择<span v-if="scope.row.stock==0"
                                                                    class="color-red">(无库存)</span>
                                </el-radio>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div style="margin:20px 0 30px;float: right">
                    <el-button type="primary" @click="closeMask(true)">确认</el-button>
                    <el-button @click="closeMask(false)">取消</el-button>
                </div>
            </el-card>
        </div>
    </div>

</template>

<script>
    import utils from '@/utils/index.js';
    import request from '@/http/http.js';

    export default {
        components: {},
        props: ['productId', 'activityType', 'searchProductId', 'searchProductName'],
        data() {
            return {
                keyWords: '', // 关键字搜索
                keyWordsID: '', // 关键字id
                stock: '', // 关键字库存
                flagStatus: '', // 关键字是否有活动互斥，0无 大于0有
                status: '', // 关键字状态
                productNum: '', // 产品数量
                tableData: [], // 规格表格
                // 选择商品列表
                checkList: [],
                // 已选择商品
                selectedPro: [],
                chooseId: '', // 选中规格id
                productDetail: '', // 选中商品信息
                showResult: false, // 是否显示搜索结果
                noResult: false, // 无数据
                resultTip: '', // 无数据提示信息
                name: '', // 产品名称
                prodCode: ''// 产品编码
            };
        },
        created() {
            this.tableData = [];
            this.keyWords = '';
            this.chooseId = this.productId;
            if (this.searchProductId) {
                this.keyWordsID = this.searchProductId;
                this.keyWords = this.searchProductName;
                this.getSpecList();
            }
        },
        methods: {
            //  提交表单
            closeMask(status) {
                if (status) {
                    if (!this.chooseId) {
                        this.$message.warning('请选择商品!');
                        return;
                    }
                    this.$emit('getProductInf', this.productDetail);
                } else {
                    this.$emit('getProductInf', false);
                }
            },
            getSpecList() {
                if (this.keyWordsID == '') {
                    this.$message.success('暂无数据');
                    return;
                }
                this.showResult = true;
                if (this.productNum == 0 || this.flagStatus == 0 || this.status == 5) { // 无库存,已参加同类活动,下架
                    this.noResult = true;
                    if (this.flagStatus == 0) {
                        this.resultTip = '已参与同类活动';
                    } else if (this.status == 5) {
                        this.resultTip = '已下架';
                    } else if (this.productNum == 0) {
                        this.resultTip = '该商品无库存';
                    }
                } else {
                    this.noResult = false;
                    request.queryProductSpecById({ productId: this.keyWordsID }).then(res => {
                        this.tableData = [];
                        this.tableData = res.data.data;
                        this.showResult = true;
                    });
                }
            },
            // 模糊查询
            querySearchAsync(queryString, cb) {
                if (queryString == '') {
                    return;
                }
                this.keyWordsID = '';
                // activityType:1秒杀 2降价拍 3优惠套餐
                const data = {
                    condition: queryString,
                    activityType: this.activityType
                };
                request.queryProductByNameOrCode(data).then(res => {
                    const tmpArr = [];
                    res.data.data.forEach((v, k) => {
                        const o = {};
                        o.value = `${v.name} 产品ID：${v.prodCode}`;
                        o.id = v.id;
                        o.productNum = v.productNum;
                        o.flagStatus = v.flagStatus;
                        o.name = v.name;
                        o.status = v.status;
                        o.prodCode = v.prodCode;
                        tmpArr.push(o);
                    });
                    cb(tmpArr);
                });
            },
            // 模糊查询id
            handleSelect(item) {
                this.keyWordsID = item.id;
                this.productNum = item.productNum;
                this.flagStatus = item.flagStatus;
                this.status = item.status;
                this.name = item.name;
                this.prodCode = item.prodCode;
            },
            // 选择商品操作
            selectPro(row) {
                this.chooseId = row.id;
                if (!row.specImg) {
                    row.specImg = row.imgUrl;
                }
                this.productDetail = row;
                this.productDetail.searchProductId = this.keyWordsID;
            }
        }
    };
</script>
<style lang='less' scoped>
    .choose-product-mask {
        position: fixed;
        z-index: 2;
        background: rgba(0, 0, 0, .3);
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        .choose-product {
            width: 800px;
            max-height: 550px;
            overflow-y: auto;
            background: #fff;
            margin: 300px auto;
            border-radius: 4px;
            /deep/ .el-input__inner {
                border-radius: 0;
            }
            .my-inp {
                width: 215px;
            }
            .set-pro-num {
                width: 100%;
                height: 100px;
                line-height: 100px;
                padding: 0 60px;
                box-sizing: border-box;
                border: 1px solid #ebeef5;
                border-top: none;
            }
            .selected-product {
                border-collapse: collapse;
                text-align: center;
                margin-top: 50px;
                width: 60%;
                border: 1px solid #ebeef5;
                border-radius: 5px;
                font-size: 14px;
                th, td {
                    border: 1px solid #ebeef5;
                    height: 55px;
                }
            }
            .title {
                font-size: 14px;
                color: #666666;
                margin-right: 10px;
            }
            .nodata {
                margin-top: 30px;
                table{
                    border-collapse: collapse;
                    width: 100%;
                }
                th, td {
                    border: 1px solid #ebeef5;
                    height: 112px;
                }
                .product-inf{
                    padding: 0 10px;
                }
                .no-stock{
                    width: 220px;
                    text-align: center;
                }
            }
        }
        .color-red {
            color: #e60012;
        }
    }

</style>
