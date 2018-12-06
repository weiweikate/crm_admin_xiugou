<template>
    <div class="price-of-inventory">
        <v-breadcrumb :nav="['运营管理',' 营销管理 ','产品礼包管理','价格库存']"></v-breadcrumb>
        <el-card v-loading="bodyLoading" :body-style="{ padding: '30px' }">
            <p>礼包名称：<el-input disabled class="my-inp" v-model="giftName"></el-input></p>
            <div v-if="stockType == 2" class="manage-title">发放库存设置</div>
            <v-remark v-if="stockType == 2" :contents='remarkContent' style="margin-left:20px"></v-remark>
            <el-table v-if="stockType == 2" :data="tableData" border :span-method="objectSpanMethod">
                <el-table-column type="index" :index="indexMethod" label="产品序号" align="center"></el-table-column>
                <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
                <el-table-column prop="specValues" label="规格" align="center"></el-table-column>
                <el-table-column prop="stock" label="现有库存" align="center"></el-table-column>
                <el-table-column label="发放数量" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.num"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 设置礼包价格 -->
            <div class="manage-title">售价设置</div>
            <el-table :data="priceInterval" border :span-method="spanSpriceInterval">
                <el-table-column prop="name" label="产品名称" align="center"></el-table-column>
                <el-table-column prop="originPrice" label="原价" align="center"></el-table-column>
                <el-table-column prop="v0" label="v0价" align="center"></el-table-column>
                <el-table-column prop="v1" label="v1价" align="center"></el-table-column>
                <el-table-column prop="v2" label="v2价" align="center"></el-table-column>
                <el-table-column prop="v3" label="v3价" align="center"></el-table-column>
                <el-table-column prop="v4" label="v4价" align="center"></el-table-column>
                <el-table-column prop="v5" label="v5价" align="center"></el-table-column>
                <el-table-column prop="v6" label="v6价" align="center"></el-table-column>
                <el-table-column prop="groupPrice" label="拼店价" align="center"></el-table-column>
                <el-table-column prop="minPayment" label="最低支付价" align="center"></el-table-column>
                <el-table-column prop="settlementPrice" label="结算价" align="center"></el-table-column>
            </el-table>
            <div class="set-price">
                <div class="set-price-tit" style="min-width:100px">礼包价</div>
                <div class="price-item" v-for="(v,k) in tableTit" :key="k" >
                    <div class="top">{{v.name}}</div>
                    <div class="bot">
                        <el-input-number style="width:100%" v-model="v.price" :min="0" :controls="false" ></el-input-number>
                    </div>
                </div>
            </div>
            <div class="btn-group">
                <el-button :loading="btnLoading" @click="submitForm" type="primary">保存</el-button>
                <el-button @click="goBack">取消</el-button>
            </div>
        </el-card>

    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import vRemark from '@/components/common/marketTools/remark.vue'
import request from '@/http/http';
export default {
    components: { vBreadcrumb, vRemark },

    data() {
        return {
            giftId: '', // 礼包id
            giftName: '', // 礼包名称
            spanRow: '16', // 合并行数
            remarkContent: ['当出现相同产品时，填写规格的发放数量之和请勿大于该规格现有库存'], // 备注
            // 表头信息
            tableTit: [{name:'原价',price:''}, {name:'v0价',price:''}, {name:'v1价',price:''}, {name:'v2价',price:''}, {name:'v3价',price:''}, {name:'v4价',price:''}, {name:'v5价',price:''}, {name:'v6价',price:''}, {name:'最低支付价',price:''}, {name:'拼店价',price:''}, {name:'结算价',price:''}],
            // 表格信息
            tableData: [],
            bodyLoading: false,
            btnLoading:false,
            // 合并上部表格单元格信息
            topTableRow: [],
            // 价格区间信息
            priceInterval: [],
            // 库存状态 1:商品共用库存 2：固定发放库存
            stockType:1,
        };
    },

    activated() {
        this.giftId = this.$route.query.priceOfInventoryId || JSON.parse(sessionStorage.getItem('priceOfInventoryId')).id;
        this.stockType = this.$route.query.stockType || JSON.parse(sessionStorage.getItem('priceOfInventoryId')).stockType;
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
                let tmp = 0;
                this.topTableRow = [];
                res.data.forEach((v, k) => {
                    const specIdArr = v.skuCode.split(',');
                    const specValArr = v.specValues.split(',');
                    const productPriceIdArr = v.skuCode.split(',');
                    const  idArr = v.packageSpecPriceId.split(',');
                    const stockArr = v.stock.split(',');
                    const totalNumber = v.totalNumber.split(',');
                    if(specIdArr.length == 0){
                        this.topTableRow.push({startIndex: tmp, num: 1});
                        tmp += 1;
                    }else{
                        this.topTableRow.push({startIndex: tmp, num: specIdArr.length});
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
                            'productPriceIdA': productPriceIdArr[index],
                            'num': totalNumber[index]
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
                let max = res.data.maxPrice;
                let min = res.data.minPrice;
                this.giftName = res.data.packageName;
                this.priceInterval = [];
                let obj = {
                    originPrice: `${min.originalPrice?min.originalPrice:0}-${max.originalPrice?max.originalPrice:0}`,
                    v0: `${min.v0?min.v0:0}-${max.v0?max.v0:0}`,
                    v1: `${min.v1?min.v1:0}-${max.v1?max.v1:0}`,
                    v2: `${min.v2?min.v2:0}-${max.v2?max.v2:0}`,
                    v3: `${min.v3?min.v3:0}-${max.v3?max.v3:0}`,
                    v4: `${min.v4?min.v4:0}-${max.v4?max.v4:0}`,
                    v5: `${min.v5?min.v5:0}-${max.v5?max.v5:0}`,
                    v6: `${min.v6?min.v6:0}-${max.v6?max.v6:0}`,
                    groupPrice: `${min.groupPrice?min.groupPrice:0}-${max.groupPrice?max.groupPrice:0}`,
                    minPayment: `${min.minPayment?min.minPayment:0}-${max.minPayment?max.minPayment:0}`,
                    settlementPrice: `${min.settlementPrice?min.settlementPrice:0}-${max.settlementPrice?max.settlementPrice:0}`,
                }
                res.data.productList.forEach(v=>{
                    let tmp = {
                        name: v.name,
                        ...obj
                    }
                    this.priceInterval.push(tmp);
                })
                this.tableTit[0].price = res.data.originalPrice;
                this.tableTit[1].price = res.data.v0;
                this.tableTit[2].price = res.data.v1;
                this.tableTit[3].price = res.data.v2;
                this.tableTit[4].price = res.data.v3;
                this.tableTit[5].price = res.data.v4;
                this.tableTit[6].price = res.data.v5;
                this.tableTit[7].price = res.data.v6;
                this.tableTit[8].price = res.data.minPayment;
                this.tableTit[9].price = res.data.groupPrice;
                this.tableTit[10].price = res.data.settlementPrice;
            }).catch(err => {
                console.log(err);
            });
        },
        // 提交表单
        submitForm() {
            let stockArr = [];
            for (let i = 0; i < this.tableData.length; i++) {
                if(this.stockType == 2){
                    if(this.tableData[i].num === undefined){
                        this.$message.warning('请输入发放数量!');
                        return;
                    }else if(this.tableData[i].num < 0){
                        this.$message.warning('请输入正确的发放数量!');
                        return;
                    }
                }
                let obj = {
                    id: this.tableData[i].id,
                    totalNumber: this.tableData[i].num,
                    surplusNumber: this.tableData[i].num,
                    skuCode: this.tableData[i].skuCode
                }
                stockArr.push(obj);
            }
            let flag = true;
            if (this.tableTit[1].price >= this.tableTit[2].price && this.tableTit[2].price >= this.tableTit[3].price && this.tableTit[3].price >= this.tableTit[4].price && this.tableTit[4].price >= this.tableTit[5].price && this.tableTit[5].price >= this.tableTit[6].price && this.tableTit[6].price >= this.tableTit[7].price && this.tableTit[7].price >= this.tableTit[8].price) {
                flag = true;
            } else {
                flag = false;
            }
            if (!flag) {
                this.$message.warning('请输入正确的礼包价格!');
                return;
            }
            const data = {
                id: this.giftId,
                specPriceList: stockArr,
                originalPrice: this.tableTit[0].price,
                v0: this.tableTit[1].price,
                v1: this.tableTit[2].price,
                v2: this.tableTit[3].price,
                v3: this.tableTit[4].price,
                v4: this.tableTit[5].price,
                v5: this.tableTit[6].price,
                v6: this.tableTit[7].price,
                groupPrice: this.tableTit[9].price,
                minPayment: this.tableTit[8].price,
                settlementPrice: this.tableTit[10].price
            };
            this.btnloading = true;
            request.updataActivityPackagePriceAndStock(data).then(res=>{
                this.btnloading = false;
                this.$message.success(res.msg);
                this.tableTit = [{name:'原价',price:''}, {name:'v0价',price:''}, {name:'v1价',price:''}, {name:'v2价',price:''}, {name:'v3价',price:''}, {name:'v4价',price:''}, {name:'v5价',price:''}, {name:'v6价',price:''}, {name:'最低支付价',price:''}, {name:'拼店价',price:''}, {name:'结算价',price:''}];
                this.$router.push('giftManage');
            }).catch(err=>{
                this.btnloading = false;
                console.log(err);
            })
        },
        //  合并单元格
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0 || columnIndex === 1) {
                for(let i = 0;i<this.topTableRow.length;i++){
                    if(rowIndex === this.topTableRow[i].startIndex){
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
        // 合并价格区间单元格
        spanSpriceInterval({ row, column, rowIndex, columnIndex }){
            if (columnIndex > 0) {
                if (rowIndex === 0) {
                    return {
                        rowspan: this.priceInterval.length,
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
        // 序号
        indexMethod(index){
            for(let i = 0;i<this.topTableRow.length;i++){
                if(index == this.topTableRow[i].startIndex){
                    return i+1;
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
