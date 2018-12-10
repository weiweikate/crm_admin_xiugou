<template>
    <div class="gift-product-mange">
        <v-breadcrumb :nav="['运营管理','营销管理', '产品礼包管理', '产品管理']"></v-breadcrumb>
        <el-card v-loading="bodyLoading" :body-style="{ padding: '50px' }">
            <el-autocomplete style='width:600px' v-model="keyWords" :fetch-suggestions="querySearchAsync" placeholder="请输入产品名称模糊搜索" @select="handleSelect"></el-autocomplete>
            <el-button type="primary" >搜索</el-button>
            <el-table :data="tableData" border style="margin-top:10px">
                <el-table-column prop="spec" label="规格" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="150px">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.checked" @change="checked=>selectPro(checked,scope.row)" label="选择产品" :value='scope.id' :disabled="scope.row.stock<=0"></el-checkbox><span class="red" v-if="scope.row.stock<=0">已停用</span>
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
                        <td>产品ID：{{v1.prodCode}}</td>
                        <td style="min-width:100px">x1</td>
                        <td style="min-width:80px;cursor: pointer;color:#33b4ff" @click="delselectedPro(k,k1)">删除</td>
                    </tr>
                </table>
            </div>
            <div style="margin-top:20px">
                <el-button :loading="btnLoading" type="primary" @click="submitForm">提交</el-button>
                <el-button @click="goBack">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import * as api from '@/api/BrandProduct/GiftMange/index.js';
import request from '@/http/http';
import { deepClone } from "@/assets/js/util/util";
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
                    const itemArr = v.specValues?v.specValues.split(','):[];
                    let specWrapArr = [];
                    let skuCode = v.skuCode?v.skuCode.split(','):[];
                    itemArr.forEach((item, index) => {
                        let itemObj = {};
                        itemObj.packageId = v.packageId;
                        // itemObj.productId = v.productId;
                        itemObj.prodCode = v.prodCode;
                        // itemObj.productName = v.productName;
                        itemObj.productNumber = 1;
                        itemObj.skuCode = skuCode[index];
                        itemObj.specValues = item.replace('@','-');
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
            let parms = deepClone(this.selectedPro)
            parms.forEach(v=>{
                v.forEach(el=>{
                    el.specValues = el.specValues.replace('-','@')
                })

            })
            const data = {
                productAndSpecStr: JSON.stringify(parms).replace('-','@')
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
                    if(v.stock.length<1){
                        o.value += '(无库存)'
                    }
                    o.id = v.id;
                    o.spec = { skuCode: v.skuCode ? v.skuCode.split(',') : [], spec: v.spec ? v.spec.replace(/@([0-9a-zA-Z\u4e00-\u9fa5]+)@([0-9a-zA-Z\u4e00-\u9fa5]+)@/g,'$1-$2').split(',') : [] };
                    // o.productId = v.id;
                    o.prodCode = v.prodCode;
                    o.stock = v.stock.split(',');
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
            if(item.stock<=0){
                this.$message.warning('库存不足，请选择其他产品')
                return;
            }
            item.spec.skuCode.forEach((v, k) => {
                const specItem = {
                    id: v,
                    spec: item.spec.spec[k],
                    stock:item.stock[k],
                    checked: false,
                    // productId: item.productId,
                    prodCode: item.prodCode,
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
            // 礼包重复获取阻止
            // let tag = false
            // this.checkList.forEach(v => {
            //      this.selectedPro.forEach(element => {
            //         element.forEach(el => {
            //             if(v.prodCode == el.prodCode){
            //                 this.$message.warning('同一个礼包不能绑定相同的产品')
            //                 tag = true
            //             }
            //         });
            //     });
            // });
            // if(tag){
            //     return
            // }
            // 添加数量
            const tmp = []; // 建立空数组保存便利出来的产品
            this.checkList.forEach((v, k) => {
                const specItem = {
                    packageId: this.giftId,
                    // productId: v.productId,
                    prodCode: v.prodCode,
                    // productName: v.productName,
                    skuCode: v.id,
                    specValues: v.spec,
                    productNumber: 1
                };
                tmp.push(specItem);
            });
            this.selectedPro.push(tmp);
            console.log(`this.selectedPro`+this.selectedPro)
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
        },
        // 返回
        goBack() {
            this.$router.push('/giftManage');
        }
    }
};
</script>
<style lang='less' scoped>
@import '../../../../assets/css/common/common.less';
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
.red{
    color: @color-red;
}
</style>
