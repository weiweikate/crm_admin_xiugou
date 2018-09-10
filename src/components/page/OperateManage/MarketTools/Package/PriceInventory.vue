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
                <el-table-column prop="stock" label="现有库存" align="center"></el-table-column>
                <el-table-column label="发放数量" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.number" @blur="provideNum(scope.row)"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pro-title">售价设置</div>
            <el-table :data="tableData" border :span-method="objectSpanMethod">
                <el-table-column prop="productName" label="产品名称" align="center">
                    <template slot-scope="scope">
                        {{scope.row.productName}}<br>{{`产品ID:${scope.row.productCode}`}}
                    </template>
                </el-table-column>
                <el-table-column prop="originalPrice" label="原价" align="center"></el-table-column>
                <el-table-column prop="v1" label="V1价" align="center"></el-table-column>
                <el-table-column prop="v2" label="V2价" align="center"></el-table-column>
                <el-table-column prop="v3" label="V3价" align="center"></el-table-column>
                <el-table-column prop="v4" label="V4价" align="center"></el-table-column>
                <el-table-column prop="groupPrice" label="拼店价" align="center"></el-table-column>
                <el-table-column prop="minPayment" label="最低支付价" align="center"></el-table-column>
                <el-table-column prop="settlementPrice" label="结算价" align="center"></el-table-column>

            </el-table>
            <!-- 设置套餐价价格 -->
            <div class="package-price">套餐价</div>
            <el-table :data="priceData" border class="price-area">
                <el-table-column label="原价" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.originalPrice"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="V1价" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.v1"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="V2价" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.v2"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="V3价" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.v3"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="V4价" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.v4"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="拼店价" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.groupPrice"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="最低支付价" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.minPayment"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="结算价" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.settlementPrice"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <div class="clearfix"></div>
            <div class="btn-group">
                <el-button @click="submitForm" type="primary" :loading="btnLoading">确认</el-button>
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
                nav: ["运营管理", "营销工具管理", "优惠套餐", "价格设置"],
                contents:['当出现相同产品时，填写规格的发放数量之和请勿大于该规格现有库存'],
                btnLoading: false,//防重复提交
                packageCode: '',//套餐code
                id: '',//套餐id
                // 售价设置表格
                tableData: [{}],
                //库存设置表格
                inventoryData: [],
                //价格设置表格
                priceData: [{}],
                spanRow: '',   // 合并行数
                spanData: [],  //合并单元格
            };
        },

        activated() {
            this.packageCode = this.$route.query.packageCode || sessionStorage.getItem('packageCode');
            this.id = this.$route.query.id || sessionStorage.getItem('id');
            this.getPackageProInfo();
            this.tableData = [{}];
            this.priceData = [{}];
        },

        methods: {
            //   获取套餐产品信息
            getPackageProInfo() {
                this.$axios.post(api.queryPackageSpecValueLPriceAndStockList, {packageCode: this.packageCode}).then(res => {
                    this.inventoryData = [];
                    this.spanData = [];
                    this.tableData = [];
                    this.priceData=[];
                    let t = 0;
                    let minPrice=res.data.data.minPrice;//最低价
                    let maxPrice=res.data.data.maxPrice;//最高价
                    if(res.data.data.price){
                        this.priceData.push(res.data.data.price);
                    }else{
                        this.priceData.push({});
                    }
                    let that=this;
                    res.data.data.stockData.forEach((v, k) => {
                        let tempSpec = v.specValues.split(',');
                        let tempProductPriceId = v.productPriceId.split(',');
                        let tempStock = v.totalStock.split(',');
                        let tempPackageSpecValueId = v.packageSpecValueId.split(',');
                        let tempLeftStock = v.leftStock.split(',');
                        that.spanData.push({startIndex: t, num: tempSpec.length});
                        t += tempSpec.length;
                        for (let i in tempSpec) {
                            let tempPro = {
                                packageCodeProductId: v.id,
                                productPriceId: tempProductPriceId[i],
                                specValues: tempSpec[i],
                                stock: tempStock[i],
                                packageSpecValueId: tempPackageSpecValueId[i],
                                number:tempLeftStock[i],
                                oldValue:tempLeftStock[i],
                                productName: v.productName,
                                spec: tempSpec[i],
                                productCode: v.productCode,
                                index: k + 1,
                            };
                            this.inventoryData.push(tempPro);
                        }
                        let tempTableData={
                            productName: v.productName,
                            productCode: v.productCode,
                            originalPrice:minPrice.originalPrice+'-'+maxPrice.originalPrice+'元',
                            v1:minPrice.v1+'-'+maxPrice.v1+'元',
                            v2:minPrice.v2+'-'+maxPrice.v2+'元',
                            v3:minPrice.v3+'-'+maxPrice.v3+'元',
                            v4:minPrice.v4+'-'+maxPrice.v4+'元',
                            groupPrice:minPrice.groupPrice+'-'+maxPrice.groupPrice+'元',
                            minPayment:minPrice.minPayment+'-'+maxPrice.minPayment+'元',
                            settlementPrice:minPrice.settlementPrice+'-'+maxPrice.settlementPrice+'元',
                        };
                        this.tableData.push(tempTableData);
                    });
                })
            },
            // 发放数量
            provideNum(row) {
                if (!/^\d+$/.test(row.number)) {
                    this.$message.warning('请输入0-'+Number(row.stock)+Number(row.oldValue)+'之间的数值!');
                    row.number = '';
                    return
                } else {
                    if (row.number>row.oldValue&&Math.abs(row.number-row.oldValue) > Number(row.stock)) {
                        this.$message.warning('请输入0-'+Number(Number(row.stock)+Number(row.oldValue))+'之间的数值!');
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
                        stock: v.number
                    };
                    stockArr.push(temp)
                });

                let flag = true;
                let priceData=this.priceData[0];
                if(Number(priceData.originalPrice)>=Number(priceData.v1)&&Number(priceData.v1)>=Number(priceData.v2)&&Number(priceData.v2)>=Number(priceData.v3)&&Number(priceData.v3)>=Number(priceData.v4)&&Number(priceData.v4)>=Number(priceData.groupPrice)){
                    flag=true
                }else{
                    this.$message.warning('请输入正确的值');
                    flag = false;
                    return;
                }

                let data = {};
                data.id = this.id;
                data.packageCode = this.packageCode;
                data.originalPrice = priceData.originalPrice;
                data.v1 = priceData.v1;
                data.v2 = priceData.v2;
                data.v3 = priceData.v3;
                data.v4 = priceData.v4;
                data.groupPrice = priceData.groupPrice;
                data.minPayment = priceData.minPayment;
                data.settlementPrice = priceData.settlementPrice;
                data.stockStr=JSON.stringify(stockArr);
                data.url=pApi.updateOperActivityPackagePriceAndStock;
                // console.log(data)
                // return
                this.btnLoading=true;
                this.$axios.post(api.updateOperActivityPackagePriceAndStock, data).then(res => {
                    this.$message.success(res.data.msg);
                    this.$router.push('/packageList');
                    this.btnLoading=false
                }).catch(error => {
                    this.btnLoading=false
                })
            },
            //  合并单元格
            objectSpanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex != 0) {
                    if (rowIndex === 0) {
                        return {
                            rowspan: this.inventoryData.length,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
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
