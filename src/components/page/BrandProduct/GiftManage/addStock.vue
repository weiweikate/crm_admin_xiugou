<template>
    <div class="price-of-inventory">
        <v-breadcrumb :nav="['品牌产品管理','礼包管理','价格库存管理']"></v-breadcrumb>
        <el-card v-loading="bodyLoading" :body-style="{ padding: '30px' }">
            <p>礼包名称：<el-input disabled class="my-inp" v-model="giftName"></el-input></p>
            <div class="manage-title">发放库存设置</div>
            <div class="remark-area">
                <span class="remark">备注：</span>
                <el-popover
                    placement="top-start"
                    width="200"
                    trigger="hover"
                    :content="remarkContent">
                    <i slot="reference" class="el-icon-question"></i>
                </el-popover>
            </div>
            <el-table :data="tableData" border :span-method="objectSpanMethod">
                <el-table-column type="index" :index="indexMethod" label="产品序号" align="center"></el-table-column>
                <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
                <el-table-column prop="specValues" label="规格" align="center"></el-table-column>
                <el-table-column prop="stock" label="现有库存" align="center"></el-table-column>
                <el-table-column prop="totalNumber" label="发放数量" align="center">
                    <template slot-scope="scope">
                        <el-tag>{{scope.row.totalNumber}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="surplusNumber" label="套餐现有库存" align="center"></el-table-column>
                <el-table-column label="新增发放数量" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.addTotalNumber"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <div class="btn-group">
                <el-button :loading="btnLoading" @click="submitForm" type="primary">保存</el-button>
                <el-button @click="goBack">取消</el-button>
            </div>
        </el-card>

    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import vRemark from '@/components/common/marketTools/remark.vue';
    import request from '@/http/http';
    export default {
        components: { vBreadcrumb, vRemark },

        data() {
            return {
                giftId: '', // 礼包id
                giftName: '', // 礼包名称
                remarkContent: '当出现相同产品时，填写规格的发放数量之和请勿大于该规格现有库存', // 备注
                // 表格信息
                tableData: [],
                bodyLoading: false,
                // 合并上部表格单元格信息
                topTableRow: [],
                // 价格区间信息
                priceInterval: [],
                btnLoading: false
            };
        },

        activated() {
            this.giftId = this.$route.query.addStockId || JSON.parse(sessionStorage.getItem('addStockId')).id;
            this.giftName = this.$route.query.name || JSON.parse(sessionStorage.getItem('addStockId')).name;
            this.tableData = [];
            this.getList();
        },

        methods: {
            // 获取规格列表
            getList() {
                this.bodyLoading = true;
                request.findActivityPackageProductAndSpecById({ packageId: this.giftId }).then(res => {
                    this.bodyLoading = false;
                    let tmp = 0;
                    this.topTableRow = [];
                    res.data.forEach((v, k) => {
                        const specIdArr = v.skuCode.split(',');
                        const specValArr = v.specValues.split(',');
                        const idArr = v.packageSpecPriceId.split(',');
                        const stockArr = v.stock.split(',');
                        const totalNumberArr = v.totalNumber.split(',');
                        const surplusNumberArr = v.surplusNumber.split(',');
                        if (specIdArr.length == 0) {
                            this.topTableRow.push({ startIndex: tmp, num: 1 });
                            tmp += 1;
                        } else {
                            this.topTableRow.push({ startIndex: tmp, num: specIdArr.length });
                            tmp += specIdArr.length;
                        }
                        specIdArr.forEach((item, index) => {
                            const obj = {
                                'id': idArr[index],
                                'packageId': v.packageId,
                                'productId': v.productId,
                                'productCode': v.productCode,
                                'productName': v.productName,
                                'productNumber': 1,
                                'skuCode': item,
                                'specValues': specValArr[index],
                                'stock': stockArr[index],
                                'totalNumber': totalNumberArr[index],
                                'surplusNumber': surplusNumberArr[index],
                                'addTotalNumber': ''
                            };
                            this.tableData.push(obj);
                        });
                    });
                }).catch(err => {
                    this.bodyLoading = false;
                    console.log(err);
                });
            },
            // 保存数据
            submitForm() {
                const proArr = [];
                this.tableData.forEach((v, k) => {
                    const obj = {
                        id: v.id,
                        skuCode: v.skuCode,
                        totalNumber: v.addTotalNumber
                    };
                    proArr.push(obj);
                });
                const data = {
                    specPriceList: proArr
                };
                this.btnloading = true;
                request.updateActivityPackageSpecPriceStock(data).then(res => {
                    this.btnloading = false;
                    this.$message.success(res.msg);
                    this.$router.push('giftManage');
                }).catch(err => {
                    this.btnloading = false;
                    console.log(err);
                });
            },
            //  合并单元格
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0 || columnIndex === 1) {
                    for (let i = 0; i < this.topTableRow.length; i++) {
                        if (rowIndex === this.topTableRow[i].startIndex) {
                            return {
                                rowspan: this.topTableRow[i].num,
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
            // 序号
            indexMethod(index) {
                for (let i = 0; i < this.topTableRow.length; i++) {
                    if (index == this.topTableRow[i].startIndex) {
                        return i + 1;
                    }
                }
            },
            // 返回礼包列表
            goBack() {
                this.$router.push('giftManage');
            }
        }
    };
</script>
<style lang='less' scoped>
    .price-of-inventory {
        .remark-area {
            margin-bottom: 5px;
            .remark {
                font-size: 14px;
                color: #666;
            }
            i {
                color: #ff6868;
            }
        }
        .my-inp {
            width: 215px;
        }
        .manage-title {
            width: 100%;
            height: 60px;
            line-height: 60px;
            background-color: #f7f7f7;
            margin: 40px 0 10px 0;
            padding-left: 20px;
            box-sizing: border-box;
        }
        .set-price{
            width: 100%;
            height: 118px;
            border: 1px solid #ddd;
            margin-top: 40px;
            color: #222;
            display: flex;
            font-size: 16px;
            .set-price-tit{
                flex: 1;
                line-height: 118px;
                text-align: center;
                border-right: 1px solid #ddd;
            }
            .price-item{
                flex: 1;
                border-right: 1px solid #ddd;
                .top{
                    border-bottom: 1px solid #ddd;
                    text-align: center;
                    height: 58px;
                    line-height: 58px;
                }
                .bot{
                    text-align: center;
                    height: 58px;
                    line-height: 58px;
                    padding: 0 20px;
                    box-sizing: border-box;
                }
            }
        }
        .btn-group{
            margin-top: 20px;
        }
    }
</style>
