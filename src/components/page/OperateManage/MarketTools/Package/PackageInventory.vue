<template>
    <div class="price-inventory">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 45px' }">
            <div class="pro-title">发放库存设置</div>
            <v-remark :contents='contents'></v-remark>
            <el-table :data="inventoryData" border class="inventory-table" :span-method="mergeRow">
                <el-table-column prop="index" label="产品序号" align="center" width="80"></el-table-column>
                <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
                <el-table-column prop="spec" label="产品规格" align="center"></el-table-column>
                <el-table-column prop="totalStock" label="现有库存" align="center"></el-table-column>
                <el-table-column prop="leftStock" label="发放数量" align="center"></el-table-column>
                <el-table-column prop="surplusStock" label="套餐现有库存" align="center"></el-table-column>
                <el-table-column label="新增库存" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.number" @change="provideNum(scope.row)"></el-input>
                    </template>
                </el-table-column>
            </el-table>

            <div class="btn-group">
                <el-button @click="submitForm" type="primary">确认</el-button>
                <el-button @click="backToList">取消</el-button>
            </div>

        </el-card>

    </div>
</template>

<script>
    import vBreadcrumb from "@/components/common/Breadcrumb.vue";
    import vRemark from '@/components/common/marketTools/remark.vue'
    import * as api from "@/api/OperateManage/MarketToolsManage/index.js";
    import * as pApi from "@/privilegeList/OperateManage/MarketToolsManage/index.js";
    import utils from "@/utils/index.js";

    export default {
        components: {
            vBreadcrumb,vRemark
        },

        data() {
            return {
                nav: ["运营管理", "营销工具管理", "优惠套餐", "添加库存"],
                contents:['当出现相同产品时，填写规格的发放数量之和请勿大于该规格现有库存'],
                btnLoading: false,//防重复提交
                packageCode: '',//套餐code
                id: '',//套餐id
                //库存设置表格
                inventoryData: [],
                spanData: [],  //合并单元格
            };
        },

        activated() {
            this.packageCode = this.$route.query.packageCode || sessionStorage.getItem('packageCode');
            this.id = this.$route.query.id || sessionStorage.getItem('id');
            this.getPackageProInfo();
            this.spanData=[];
        },

        methods: {
            //   获取套餐产品信息
            getPackageProInfo() {
                this.$axios.post(api.queryPackageSpecValueStockList, {packageCode: this.packageCode}).then(res => {
                    this.inventoryData = [];
                    let t = 0;
                    let that=this;
                    res.data.data.forEach((v, k) => {
                        let tempSpec = v.specValues.split(',');
                        let tempProductPriceId = v.productPriceId.split(',');
                        let tempStock = v.totalStock.split(',');
                        let tempPackageSpecValueId = v.packageSpecValueId.split(',');
                        let tempLeftStock = v.leftStock.split(',');//发放数量
                        let tempSurplusStock = v.surplusStock.split(',');//套餐现有库存
                        let tempTotalStock = v.totalStock.split(',');//现有库存
                        that.spanData.push({startIndex: t, num: tempSpec.length});
                        t += tempSpec.length;
                        for (let i in tempSpec) {
                            let tempPro = {
                                packageCodeProductId: v.id,
                                productPriceId: tempProductPriceId[i],
                                specValues: tempSpec[i],
                                stock: tempStock[i],
                                packageSpecValueId: tempPackageSpecValueId[i],
                                totalStock: tempTotalStock[i],
                                leftStock: tempLeftStock[i],
                                surplusStock: tempSurplusStock[i],
                                productName: v.productName,
                                spec: tempSpec[i],
                                productCode: v.productCode,
                                index: k + 1,
                            };
                            this.inventoryData.push(tempPro);
                        }
                    });
                })
            },
            // 发放数量
            provideNum(row) {
                if (!/^\d+$/.test(row.number)) {
                    this.$message.warning('请输入合法数据！');
                    row.number = '';
                    return
                } else {
                    if (row.number > Number(row.totalStock)) {
                        this.$message.warning('新增库存数不能大于现有库存！');
                        row.number = '';
                        return
                    }
                }

            },
            // 提交表单
            submitForm() {
                let stockArr = [];
                this.inventoryData.forEach((v, k) => {
                    let temp = {
                        id: v.packageSpecValueId,
                        productPriceId:v.productPriceId,
                        stock: v.number?v.number:0
                    };
                    stockArr.push(temp)
                });

                let data = {};
                data.id = this.id;
                data.stockStr=JSON.stringify(stockArr);
                data.url=pApi.updatePackageSpecValueStock;
                // console.log(data)
                // return
                this.btnLoading=true;
                this.$axios.post(api.updatePackageSpecValueStock, data).then(res => {
                    this.$message.success(res.data.msg);
                    this.$router.push('/packageList');
                    this.btnLoading=false
                }).catch(error => {
                    this.btnLoading=false
                })
            },
            // 合并行(第几行开始合并，合并几行)
            mergeRow({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 0 || columnIndex === 1) {
                    for (let i = 0; i < this.spanData.length; i++) {
                        if (rowIndex === this.spanData[i].startIndex) {
                            return {
                                rowspan: this.spanData[i].num,
                                colspan: 1
                            };
                        }
                    }
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            },
            //返回列表
            backToList(){
                this.$router.push('/packageList')
            }
        }
    };
</script>
<style lang='less' scoped>
    .price-inventory {
        .pro-title {
            width: 100%;
            height: 60px;
            background-color: #f7f7f7;
            line-height: 60px;
            padding: 0 25px;
            box-sizing: border-box;
            margin-bottom: 20px;
        }
        /deep/ .el-table {
            margin-bottom: 20px;
        }
        .inventory-table {
            width: 50%;
        }
        .set-price {
            width: 100%;
            height: 118px;
            border: 1px solid #ddd;
            margin-top: 40px;
            color: #222;
            display: flex;
            font-size: 16px;
            .set-price-tit {
                flex: 1;
                line-height: 118px;
                text-align: center;
                border-right: 1px solid #ddd;
            }
            .price-item {
                flex: 1;
                border-right: 1px solid #ddd;
                .top {
                    border-bottom: 1px solid #ddd;
                    text-align: center;
                    height: 58px;
                    line-height: 58px;
                }
                .bot {
                    text-align: center;
                    height: 58px;
                    line-height: 58px;
                    padding: 0 20px;
                    box-sizing: border-box;
                }
            }
        }
        .btn-group {
            margin-top: 20px;
        }
        .package-price {
            float: left;
            width: 100px;
            height: 88px;
            line-height: 88px;
            border: 1px solid #eee;
            border-right: none;
            text-align: center;
            font-size: 14px;
            color: #909399;
            font-weight: 700;
        }
        .price-area {
            width: 60%;
            float: left;
        }
        .clearfix {
            clear: both;
        }

    }

</style>
