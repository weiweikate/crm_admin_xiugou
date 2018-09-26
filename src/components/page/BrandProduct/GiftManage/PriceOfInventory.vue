<template>
    <div class="price-of-inventory">
        <v-breadcrumb :nav="['品牌产品管理','礼包管理','价格库存管理']"></v-breadcrumb>
        <el-card v-loading="bodyLoading" :body-style="{ padding: '30px' }">
            <p>礼包名称：<el-input disabled class="my-inp" v-model="giftName"></el-input></p>
            <div class="manage-title">发放库存设置</div>
            <el-table :data="tableData" border>
                <el-table-column type="index" label="产品序号" align="center"></el-table-column>
                <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
                <el-table-column prop="specValues" label="规格" align="center"></el-table-column>
                <el-table-column prop="stock" label="现有库存" align="center"></el-table-column>
                <el-table-column prop="index" label="发放数量" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.num"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 设置礼包价格 -->
            <div class="manage-title">售价设置</div>
            <div class="set-price">
                <div class="set-price-tit" style="min-width:100px">礼包价</div>
                <div class="price-item" v-for="(v,k) in tableTit" v-if='k>0' :key="k" >
                    <div class="top">{{v.name}}</div>
                    <div class="bot">
                        <el-input-number style="width:100%" v-model="v.price" :min="0" :controls="false" ></el-input-number>
                    </div>
                </div>
            </div>
            <div class="btn-group">
                <el-button @click="submitForm" type="primary">保存</el-button>
                <el-button @click="goBack">取消</el-button>
            </div>
        </el-card>

    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import * as api from '@/api/BrandProduct/GiftMange/index.js';
import request from '@/http/http';
export default {
    components: { vBreadcrumb },

    data() {
        return {
            giftId: '', // 礼包id
            giftName: '', // 礼包名称
            spanRow: '16', // 合并行数
            // 表头信息
            tableTit: ['原价', 'v0价', 'v1价', 'v2价', 'v3价', 'v4价', 'v5价', 'v6价', '拼店价', '最低支付价', '结算价'],
            // 表格信息
            tableData: [],
            bodyLoading: false,
            // 合并上部表格单元格信息
            topTableRow: []
        };
    },

    activated() {
        this.giftId = this.$route.query.priceOfInventoryId || sessionStorage.getItem('priceOfInventoryId');
        this.tableData = [];
        // 获取参考价
        this.getPrice();
        // 获取价格区间
        this.getPriceAnd();
    },

    methods: {
        // 价格数据回显
        getPrice() {
            this.bodyLoading = true;
            request.findActivityPackageProductAndSpecById({ packageId: this.giftId }).then(res => {
                this.bodyLoading = false;
                res.data.forEach((v, k) => {
                    const specIdArr = v.productPriceId.split(',');
                    const specValArr = v.specValues.split(',');
                    const stockArr = v.stock.split(',');
                    this.topTableRow.push(specIdArr.length);
                    specIdArr.forEach((item, index) => {
                        const obj = {
                            'packageId': v.packageId,
                            'productId': v.productId,
                            'productCode': v.productCode,
                            'productName': v.productName,
                            'productNumber': 1,
                            'productPriceId': item,
                            'specValues': specValArr[index],
                            'stock': stockArr[index]
                        };
                        this.tableData.push(obj);
                    });
                });
            }).catch(err => {
                this.bodyLoading = false;
                console.log(err);
            });
        },
        // 价格区间
        getPriceAnd() {
            request.findActivityPackageProductAndSpecByIdAn({packageId: this.giftId}).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
        },
        // 提交表单
        submitForm() {
            let flag = true;
            if (this.tableTit[1].price >= this.tableTit[2].price && this.tableTit[2].price >= this.tableTit[3].price && this.tableTit[3].price >= this.tableTit[4].price && this.tableTit[4].price >= this.tableTit[5].price && this.tableTit[5].price >= this.tableTit[6].price && this.tableTit[6].price >= this.tableTit[7].price && this.tableTit[7].price >= this.tableTit[8].price) {
                flag = true;
            } else {
                flag = false;
            }
            if (!flag) {
                this.$message.warning('请输入正确的值');
                return;
            }
            const data = {};
            data.id = this.giftId;
            data.originalPrice = this.tableTit[1].price;
            data.firstLevelPrice = this.tableTit[2].price;
            data.secondLevelPrice = this.tableTit[3].price;
            data.threeLevelPrice = this.tableTit[4].price;
            data.fourLevelPrice = this.tableTit[5].price;
            data.groupPrice = this.tableTit[6].price;
            data.minPayment = this.tableTit[7].price;
            data.settlementPrice = this.tableTit[8].price;
            this.$axios.post(api.priceControl, data).then(res => {
                this.$message.success(res.data.msg);
                this.$router.push('giftManage');
            });
        },
        //  合并单元格
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            let tot = 0;
            if (columnIndex === 0) {
                this.topTableRow.forEach(v => {
                    if (rowIndex === tot) {
                        return {
                            rowspan: v,
                            colspan: 1
                        };
                    }
                    tot += v - 1;
                });
                return {
                    rowspan: 0,
                    colspan: 0
                };
            }
            // if (columnIndex > 0) {
            //     if (rowIndex === 0) {
            //         return {
            //             rowspan: this.spanRow,
            //             colspan: 1
            //         };
            //     } else {
            //         return {
            //             rowspan: 0,
            //             colspan: 0
            //         };
            //     }
            // }
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
