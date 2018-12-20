<template>
    <div class="package-product-mange">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card :body-style="{ padding: '50px' }">
            <el-autocomplete style='width:600px' v-model="keyWords" :fetch-suggestions="querySearchAsync"
                             placeholder="请输入产品名称模糊搜索" @select="handleSelect"></el-autocomplete>
            <el-button type="primary" @click="getSpecList">搜索</el-button>
            <div v-if="!showResult" class="nodata">
                请输入产品名称模糊搜索~
            </div>
            <div v-else>
                <div v-if="noResult" class="nodata">
                    <div class="product-inf">{{name}} {{prodCode}}</div>
                    <div class="color-red no-stock">该商品无库存</div>
                </div>
                <div v-else>
                    <el-table :data="tableData" border style="margin-top:10px">
                        <el-table-column prop="spec" label="规格" align="center"></el-table-column>
                        <el-table-column label="操作" align="center" width="150px">
                            <template slot-scope="scope">
                                <el-checkbox @change="selectPro(scope.row)"
                                             :value='scope.row.id' v-model="scope.row.checked" :disabled="scope.row.stock==0">选择产品<span class="color-red" v-if="scope.row.stock==0">(无库存)</span></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="set-pro-num">
                <span style="font-size:14px">产品数量*1</span>
                <el-button @click="setPackage" type="primary">确认</el-button>
            </div>
            <template v-if="packageLists.length==0">
                <table class="selected-product">
                    <tr style="color:#aaa">
                        <td>请选择产品</td>
                    </tr>
                </table>
            </template>
            <template v-else>
                <table class="selected-product" v-for="(item,index) in packageLists" :key="index">
                    <tr v-for="(v,k) in item.productLists" :key="k">
                        <td v-if="k==0" :rowspan="item.productLists.length" style="width: 50px">{{index+1}}</td>
                        <td>{{(v.productName || '')+(v.spec || '')}}</td>
                        <td>产品ID：{{v.productCode}}</td>
                        <td style="min-width:100px">x1</td>
                        <td style="min-width:80px;cursor: pointer;color:#33b4ff" @click="delSelectedPro(k,index)">删除
                        </td>
                    </tr>
                </table>
            </template>

            <div style="margin-top:20px">
                <el-button type="primary" @click="submitForm" :loading="btnLoading">提交</el-button>
                <el-button @click="backToList">取消</el-button>
            </div>
        </el-card>

    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import * as api from '@/api/OperateManage/MarketToolsManage/index.js';
    import * as pApi from '@/privilegeList/OperateManage/MarketToolsManage/index.js';
    import utils from '@/utils/index.js';
    import icon from '@/components/common/ico';

    export default {
        components: { vBreadcrumb, icon },

        data() {
            return {
                nav: ['运营管理', '营销工具管理', '优惠套餐', '产品管理'],
                packageCode: '', // 套餐code
                id: '', // 套餐Id
                keyWords: '', // 关键字搜索
                keyWordsID: '', // 关键字id
                showResult: false, // 是否显示搜索结果
                tableData: [], // 规格表格
                checkList: [], // 选择商品列表
                selectedPro: [], // 已选择商品
                productSpecList: [], // 缓存选择的商品及其规格
                productIds: [], // 缓存选择的商品ids
                noResult: false, // 搜索无可用数据
                name: '', // 产品名称
                prodCode: '', // 产品编码
                productNum: '', // 产品库存
                packageLists: [], // 选择的商品套餐数组
                tempProductLists: [], // 临时缓存选中的商品数组，供后续显示套餐数组使用
                tempSpecIds: [], // 临时缓存选择的规格ids
                btnLoading: false// 提交按钮防重
            };
        },

        activated() {
            this.packageCode = this.$route.query.packageCode;
            this.id = this.$route.query.id;
            this.tableData = [];
            this.productLists = [];
            this.keyWords = '';
            this.showResult = false;
            this.getPackageProInfo();
        },

        methods: {
            //   获取套餐产品信息
            getPackageProInfo() {
                this.$axios.post(api.queryPackageProductList, { packageCode: this.packageCode }).then(res => {
                    this.packageLists = [];
                    res.data.data.forEach((v, k) => {
                        const temp = { productLists: [], id: v.productId };
                        const tempSpec = v.specValues.split(',');
                        const tempProductPriceId = v.productPriceId.split(',');
                        for (const i in tempSpec) {
                            const tempPro = {
                                packageCodeProductId: v.id,
                                productPriceId: tempProductPriceId[i],
                                specValues: tempSpec[i],
                                productName: v.productName,
                                spec: tempSpec[i],
                                productCode: v.productCode,
                                productId: v.id,
                                id: tempProductPriceId[i]
                            };
                            temp.productLists.push(tempPro);
                        }
                        this.packageLists.push(temp);
                    });
                });
            },
            //  提交表单
            submitForm() {
                if (!this.packageLists.length) {
                    this.$message.warning('请选择产品规格！');
                    return;
                }
                const proStr = [];
                this.packageLists.forEach((v, k) => {
                    const o = {};
                    o.productId = v.id;
                    o.num = 1;
                    o.specStr = [];
                    v.productLists.forEach((v1, k1) => {
                        const temp = {
                            packageCodeProductId: v1.productId,
                            productPriceId: v1.id,
                            specValues: v1.spec
                        };
                        o.specStr.push(temp);
                    });
                    proStr.push(o);
                });
                const data = {};
                data.id = this.id;
                data.packageCode = this.packageCode;
                data.jsonStr = JSON.stringify(proStr);
                data.url = pApi.addPackageProduct;
                this.btnLoading = true;
                this.$axios.post(api.addPackageProduct, data).then(res => {
                    this.$message.success(res.data.msg);
                    this.$router.push('/packageList');
                    this.btnLoading = false;
                }).catch(res => {
                    this.btnLoading = false;
                });
            },
            // 模糊查询
            querySearchAsync(queryString, cb) {
                if (queryString == '') {
                    return;
                }
                this.checkList = [];
                this.$axios.post(api.queryProductByNameOrCode, { condition: queryString, activityType: 3 }).then(res => {
                    const tmpArr = [];
                    res.data.data.forEach((v, k) => {
                        const o = {};
                        o.value = `${v.name} 产品ID：${v.prodCode}`;
                        o.id = v.id;
                        o.name = v.name;
                        o.prodCode = v.prodCode;
                        o.productNum = v.productNum;
                        tmpArr.push(o);
                    });
                    cb(tmpArr);
                });
            },
            // 模糊查询id
            handleSelect(item) {
                if (item.id != this.keyWordsID) { // 搜索新的产品，缓存的数据清空
                    this.tempSpecIds = [];
                    this.tempProductLists = [];
                }
                this.keyWordsID = item.id;
                this.name = item.name;
                this.prodCode = item.prodCode;
                this.productNum = item.productNum;
            },
            // 根据id查询规格列表
            getSpecList() {
                const that = this;
                if (that.keyWordsID == '') {
                    that.$message.success('暂无数据');
                    return;
                }
                if (that.productNum == 0) { // 无库存
                    that.noResult = true;
                } else {
                    that.noResult = false;
                    that.$axios.post(api.queryProductSpecById, { productId: that.keyWordsID }).then(res => {
                        that.showResult = true;
                        that.tableData = [];
                        res.data.data.forEach(function(v, k) {
                            v.checked = false;
                            that.tableData.push(v);
                        });
                    });
                }
            },

            // 选择商品操作
            selectPro(row) {
                const checked = row.checked;
                if (checked == true) { // 添加规格
                    if (this.tempSpecIds.indexOf(row.id) == -1) {
                        this.tempSpecIds.push(row.id);
                        this.tempProductLists.push(row);
                    }
                } else { // 取消
                    for (const i in this.tempSpecIds) {
                        if (this.tempSpecIds[i] == row.id) {
                            this.tempSpecIds.splice(i, 1);
                            this.tempProductLists.splice(i, 1);
                        }
                    }
                }
            },
            // 选中产品后确认添加套餐，并清空缓存的产品列表，表格数据
            setPackage() {
                if (!this.tempSpecIds.length) {
                    this.$message.warning('请选择产品规格!');
                    return;
                }
                this.packageLists.push({ productLists: this.tempProductLists, id: this.keyWordsID });
                this.tempSpecIds = [];
                this.tempProductLists = [];
                this.getSpecList();
            },

            // 删除已选择产品 index对应packageList索引值 cIndex对应packageList[index].productLists索引值
            delSelectedPro(cIndex, index) {
                this.packageLists[index].productLists.splice(cIndex, 1);
                if (!this.packageLists[index].productLists.length) {
                    this.packageLists.splice(index, 1);
                }
            },

            // 返回列表
            backToList() {
                this.$router.push('/packageList');
            }
        }
    };
</script>
<style lang='less' scoped>
    .package-product-mange {
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
            text-align: center;
            position: relative;
            span {
                position: absolute;
                top: -30px;
                left: 10px;
                color: #999;
            }
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
        .nodata {
            margin-top: 30px;
            height: 112px;
            line-height: 112px;
            text-align: center;
            border-radius: 4px;
            border: solid 1px #dddddd;
            div {
                display: inline-block;
            }
            .product-inf {
                width: 70%;
                border-right: 1px solid #ddd;
            }
            .no-stock {
                width: 29%;
            }
        }
        .color-red {
            color: #e60012;
        }
    }
</style>
