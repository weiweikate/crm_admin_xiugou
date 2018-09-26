<template>
    <div class="gift-product-mange">
        <v-breadcrumb :nav="['品牌产品管理','礼包管理']"></v-breadcrumb>
        <el-card v-loading="bodyLoading" :body-style="{ padding: '50px' }">
            <el-autocomplete style='width:600px' v-model="keyWords" :fetch-suggestions="querySearchAsync" placeholder="请输入产品名称模糊搜索" @select="handleSelect"></el-autocomplete>
            <el-button type="primary" >搜索</el-button>
            <el-table :data="tableData" border style="margin-top:10px">
                <el-table-column prop="spec" label="规格" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="150px">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.checked" @change="checked=>selectPro(checked,scope.row)" label="选择产品" :value='scope.id'></el-checkbox>
                    </template>
                </el-table-column>
            </el-table>
            <div class="set-pro-num">
                <span style="font-size:14px;margin-right: 50px">产品数量 x 1</span>
                <el-button @click="setNum" type="primary">确认</el-button>
            </div>
            <div v-for="(v,k) in selectedPro" :key="k" style="margin-bottom:10px">
                <table class="selected-product">
                    <tr style="color:#aaa" v-if="selectedPro.length == 0"><td>请选择产品</td></tr>
                    <tr v-for="(v1,k1) in v" :key="k1">
                        <td v-if='k1 == 0' :rowspan="v.length" style="padding:0 10px" >{{k+1}}</td>
                        <td>{{(v1.productName || '')+' '+(v1.specValues || '')}}</td>
                        <td>产品ID：{{v1.productCode}}</td>
                        <td style="min-width:100px">x1</td>
                        <td style="min-width:80px;cursor: pointer;color:#33b4ff" @click="delselectedPro(k,k1)">删除</td>
                    </tr>
                </table>
            </div>
            <div style="margin-top:20px">
                <el-button :loading="btnLoading" type="primary" @click="submitForm">提交</el-button>
                <el-button>取消</el-button>
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
            giftId: '', // 礼包ID
            keyWords: '', // 关键字搜索
            keyWordsID: '', // 关键字id
            tableData: [], // 规格表格
            // 选择商品列表
            checkList: [],
            // 已选择商品
            selectedPro: [],
            bodyLoading: false,
            btnLoading: false
        };
    },

    activated() {
        this.giftId = this.$route.query.giftProductMangeId || sessionStorage.getItem('giftProductMangeId');
        this.tableData = [];
        this.checkList = [];
        this.selectedPro = [];
        this.productNum = '';
        this.keyWords = '';
        this.getGiftProInfo();
    },

    methods: {
    //   获取礼包产品信息
        getGiftProInfo() {
            this.bodyLoading = true;
            request.findActivityPackageProductAndSpecById({ packageId: this.giftId }).then(res => {
                res.data.forEach(v => {
                    this.bodyLoading = false;
                    const itemArr = v.specValues.split(',');
                    let specWrapArr = [];
                    let specIdArr = v.productPriceId.split(',');
                    let itemObj = {};
                    itemArr.forEach((item, index) => {
                        itemObj.packageId = v.packageId;
                        itemObj.productId = v.productId;
                        itemObj.productCode = v.productCode;
                        itemObj.productName = v.productName;
                        itemObj.productNumber = 1;
                        itemObj.productPriceId = specIdArr[index];
                        itemObj.specValues = item;
                        specWrapArr.push(itemObj);
                    });
                    this.selectedPro.push(specWrapArr);
                });
            }).catch(err => {
                this.bodyLoading = false;
                console.log(err);
            });
        },
        //  提交表单
        submitForm() {
            if (this.selectedPro.length == 0) {
                this.$message.warning('请选择产品规格');
                return;
            }
            const data = {
                productAndSpecStr: JSON.stringify(this.selectedPro)
            };
            this.btnloading = true;
            request.addActivityPackageProduct(data).then(res => {
                this.btnloading = false;
                this.$message.success(res.msg);
                this.$router.push('giftManage');
            }).catch(err => {
                this.btnloading = false;
                console.log(err);
            });
        },
        // 模糊查询
        querySearchAsync(queryString, cb) {
            if (queryString == '') {
                return;
            }
            this.keyWordsID = '';
            request.queryProductList({ param: this.keyWords }).then(res => {
                const tmpArr = [];
                res.data.forEach((v, k) => {
                    const o = {};
                    o.value = `${v.name} 产品ID：${v.prodCode}`;
                    o.id = v.id;
                    o.spec = { specId: v.priceId.split(','), spec: v.spec.split(',') };
                    o.productId = v.id;
                    o.productCode = v.prodCode;
                    o.productName = v.name;
                    tmpArr.push(o);
                });
                cb(tmpArr);
            }).catch(err => {
                console.log(err);
            });
        },
        // 模糊查询id, 根据id获取规格列表
        handleSelect(item) {
            this.tableData = [];
            this.checkList = [];
            item.spec.specId.forEach((v, k) => {
                const specItem = {
                    id: v,
                    spec: item.spec.spec[k],
                    checked: false,
                    productId: item.productId,
                    productCode: item.productCode,
                    productName: item.productName
                };
                this.tableData.push(specItem);
            });
            this.keyWordsID = item.prodCode;
        },
        // 选中产品，设置数量
        setNum() {
            if (this.checkList.length == 0) {
                this.$message.warning('请选择产品规格');
                return;
            }
            // 添加数量
            const tmp = []; // 建立空数组保存便利出来的产品
            this.checkList.forEach((v, k) => {
                const specItem = {
                    packageId: this.giftId,
                    productId: v.productId,
                    productCode: v.productCode,
                    productName: v.productName,
                    productNumber: 1,
                    productPriceId: v.id,
                    specValues: v.spec
                };
                tmp.push(specItem);
            });
            this.selectedPro.push(tmp);
        },
        // 删除已选择产品
        delselectedPro(bIndex, mIndex) {
            this.selectedPro[bIndex].splice(mIndex, 1);
            if (this.selectedPro[bIndex].length === 0) {
                this.selectedPro.splice(bIndex, 1);
            }
        },
        // 选择商品操作
        selectPro(checked, row) {
            if (checked == true) {
                this.checkList.push(row);
            } else {
                this.checkList.forEach((v, k) => {
                    if (v.id == row.id) {
                        this.checkList.splice(k, 1);
                    }
                });
            }
        }
    }
};
</script>
<style lang='less' scoped>
.gift-product-mange {
    /deep/.el-input__inner{
        border-radius: 0px;
    }
  .my-inp {
    width: 215px;
  }
  .set-pro-num{
      width: 100%;
      height: 100px;
      line-height: 100px;
      padding: 0 60px;
      box-sizing: border-box;
      border: 1px solid #ebeef5;
      border-top: none;
  }
  .selected-product{
      border-collapse: collapse;
      text-align: center;
      margin-top: 50px;
      width: 60%;
      border: 1px solid #ebeef5;
      border-radius: 5px;
      font-size: 14px;
      th,td{
        border: 1px solid #ebeef5;
        height: 55px;
      }
  }
}
</style>
