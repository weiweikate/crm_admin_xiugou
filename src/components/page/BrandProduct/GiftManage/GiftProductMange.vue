<template>
    <div class="gift-product-mange">
        <v-breadcrumb :nav="['品牌产品管理','礼包管理']"></v-breadcrumb>
        <el-card :body-style="{ padding: '50px' }">
            <el-autocomplete style='width:600px' v-model="keyWords" :fetch-suggestions="querySearchAsync" placeholder="请输入产品名称模糊搜索" @select="handleSelect"></el-autocomplete>
            <el-button type="primary" @click="getSpecList" >搜索</el-button>
            <el-table :data="tableData" border style="margin-top:10px">
                <el-table-column prop="spec" label="规格" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="150px">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.checked" @change="checked=>selectPro(checked,scope.row)" label="选择产品" :value='scope.id'></el-checkbox>
                    </template>
                </el-table-column>
            </el-table>
            <div class="set-pro-num">
                <span style="font-size:14px">选择产品数量</span>
                <el-input-number class="my-inp" v-model="productNum" :min="1" label="请输入产品数量"></el-input-number>
                <el-button @click="setNum" type="primary">确认</el-button>
                <el-button>取消</el-button>
            </div>
            <div v-for="(v,k) in selectedPro" :key="k" style="margin-bottom:10px">
                <table class="selected-product">              
                    <tr style="color:#aaa" v-if="selectedPro.length == 0"><td>请选择产品</td></tr>
                    <tr v-for="(v1,k1) in v.value" :key="k1">
                        <td v-if='k1 == 0' :rowspan="v.value.length" style="padding:0 10px" >{{k+1}}</td>
                        <td>{{(v1.name || '')+(v1.spec || '')}}</td>
                        <td>产品ID：{{v1.prodCode}}</td>
                        <td style="min-width:100px">x1</td>
                        <td style="min-width:80px;cursor: pointer;color:#33b4ff" @click="delselectedPro(k,k1)">删除</td>
                    </tr>
                </table>
            </div>
            <div style="margin-top:20px">
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button>取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from "@/components/common/Breadcrumb.vue";
import * as api from "@/api/BrandProduct/GiftMange/index.js";
import * as pApi from "@/privilegeList/BrandProduct/GiftMange/index.js";
import utils from "@/utils/index.js";
export default {
  components: { vBreadcrumb },

  data() {
    return {
      giftId: "", // 礼包ID
      keyWords: "", // 关键字搜索
      keyWordsID:'',    // 关键字id
      productNum:"",    // 产品数量
      tableData: [],    // 规格表格
        // 选择商品列表
      checkList:[],
        // 已选择商品  
      selectedPro:[],
    };
  },

  activated() {
    this.giftId = this.$route.query.giftProductMangeId || sessionStorage.getItem("giftProductMangeId");
    this.tableData = [];
    this.checkList = [];
    this.selectedPro = [];
    this.productNum = '';   
    this.keyWords = '';
    this.getGiftProInfo();
  },

  methods: {
    //   获取礼包产品信息
    getGiftProInfo(){
        this.$axios.post(api.queryGiftBagProductById,{id:this.giftId}).then(res=>{
            this.selectedPro = [];
            this.selectedPro = res.data.data;
        })
    },
    //  提交表单
    submitForm(){
        if(this.selectedPro.length == 0){
            this.$message.warning('请选择产品规格');
            return;
        }
        let data = {};
        data.id = this.giftId;
        data.jsonStr = JSON.stringify(this.selectedPro);
        this.$axios.post(api.addGiftBagProduct,data).then(res=>{
            this.$message.success(res.data.msg);
            this.$router.push('giftManage');
        })
    },
    // 根据id查询规格列表
    getSpecList(){
        if(this.keyWordsID == ''){
            this.$message.success('暂无数据');
            return;
        }
        this.$axios.post(api.queryProductSpecById,{productId:this.keyWordsID}).then(res=>{
            this.tableData = [];
            this.checkList = [];
            res.data.data.forEach((v,k)=>{
                v.checked = false;
                this.tableData.push(v);
            })
        })
    },
    // 模糊查询
    querySearchAsync(queryString, cb) {
        if(queryString == ''){
            return;
        }
        this.keyWordsID = '';
        this.$axios.post(api.findProductInfo,{condition:queryString}).then(res=>{
            let tmpArr = [];
            res.data.data.forEach((v,k)=>{
                let o = {};
                o.value = `${v.name} 产品ID：${v.prodCode}`;
                o.id = v.id;
                tmpArr.push(o);
            })
            cb(tmpArr)
        })
    },
    // 模糊查询id
    handleSelect(item){
        this.keyWordsID = item.id;
    },
    // 选中产品，设置数量
    setNum(){
        if(this.productNum == '' || this.productNum == undefined){
            this.$message.warning('请输入产品数量');
            return;
        }
        if(this.checkList.length == 0){
            this.$message.warning('请选择产品规格');
            return;
        }
        // 添加数量
        let tmp = []; // 建立空数组保存便利出来的产品
        this.checkList.forEach((v,k)=>{
            tmp.push(v);
        })
        let giftPackge = {};
        giftPackge.productId = tmp[0].productId;
        giftPackge.value = [];
        // // 将便利出来的产品赋值给已选择商品
        tmp.forEach((v,k)=>{
            // 组装value值
            let oTmp = {};
            oTmp.id = v.id,
            oTmp.num = 1,
            oTmp.name = v.productName,
            oTmp.spec = v.spec,
            oTmp.prodCode = v.productCode;
            giftPackge.value.push(oTmp);
        })
        for(let i=0;i<this.productNum;i++){
            this.selectedPro.push(giftPackge);
        }
    },
    // 删除已选择产品
    delselectedPro(bIndex,mIndex){
        this.selectedPro[bIndex].value.splice(mIndex,1);
        if(this.selectedPro[bIndex].value.length == 0){
            this.selectedPro.splice(bIndex,1)
        }
    },
    // 选择商品操作
    selectPro(checked,row){
        if(checked == true){
            this.checkList.push(row);
        }else{
            this.checkList.forEach((v,k)=>{
                if(v.id == row.id){
                    this.checkList.splice(k,1);
                }
            })
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