<template>
  <div class="product-specification">
      <v-breadcrumb :nav='nav'></v-breadcrumb>
      <el-card :body-style="{ padding: '20px 45px'}">
        <div class="spe-title">产品规格</div>
        <div class="spe-wrap">
            <div v-for="(value,index) in specificationArr" :key="index">
                <div class="small-spe-title">
                    <span>类型：</span>
                    <div @mouseover="showFirstDelBtn(index)" @mouseout="deleteFirstItem = ''" class="delete-big-tit">
                        <div class="del-big-btn" @click="deleteType(index)" v-if='index == deleteFirstItem'>×</div>
                        <el-input v-model="specificationArr[index].type" style="width:70px"></el-input>
                    </div>
                </div>
                <div class="small-spe-content">
                    <span>规格值：</span>
                    <div class="des-wrap" v-for="(v,k) in value.speArr" @mouseover="showDeleteBtn(v)" @mouseout="deleteItem = ''" :key="k">
                        <div class="delete-btn" v-if='v == deleteItem' @click="deleteSpe(index,k)">×</div>
                        <el-input v-model="value.speArr[k]" class="des-inp"></el-input>
                    </div>
                    <span class="add-spe" @click="addSpe(index)">添加规格</span>
                </div>
            </div>
            <div class="small-spe-title">
                <el-button @click="addType">添加类型</el-button>
            </div>
        </div>
        <el-button @click="createList" type="primary" style="margin:10px 0 50px 0">生成列表</el-button>
        <p style="margin:0 0 18px 10px">规格表</p>
        <el-table :data="tableData" border>
          <el-table-column prop="spec" label="规格" align="center"></el-table-column>
          <el-table-column label="条形码" align="center" width="180">
            <template slot-scope="scoped">
                <el-input v-model="scoped.row.code"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="图片" align="center" width="180">
              <template slot-scope="scoped">
                    <template v-if='scoped.row.imgUrl != ""' >
                        <div class="product-img"><img :src="scoped.row.imgUrl" alt=""></div>
                        <el-button type="danger" @click="deleteImg(scoped.$index)">删除</el-button>
                    </template>
                    <template v-else>
                        <el-upload
                        :action="imgUpload"
                        :show-file-list = "false"
                        :on-success = "uploadSuccess"
                        >
                        <el-button size="small" type="primary" @click="beforeUpload(scoped.$index)">选择图片</el-button>
                        </el-upload>
                    </template>
              </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="220">
            <template slot-scope="scoped">
                <el-button v-if="scoped.row.status == 2" type="warning" @click="operateProduct(scoped.row,'1')">启用</el-button>
                <el-button v-else type="danger" @click="operateProduct(scoped.row,'2')">停用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="submitForm" style="margin-top:10px" type="primary">确认提交</el-button>
        <!-- <el-button >取消</el-button> -->
      </el-card>
      
  </div>
</template>

<script>
import vBreadcrumb from "@/components/common/Breadcrumb.vue";
import * as api from "@/api/BrandProduct/ProductMange/index.js";
import * as pApi from "@/privilegeList/BrandProduct/ProductMange/index.js";
export default {
  components: {
    vBreadcrumb
  },

  data() {
    return {
      nav: ["品牌产品管理", "产品管理", "发布产品"],
      imgUpload: "",
      rowId:'',
      deleteFirstItem: "",
      deleteItem: "",
      specificationArr: [], 
      tableData: []
    };
  },

  activated() {
    this.clickStatus = '0';
    this.imgUpload = api.addImg;
    this.productId = JSON.parse(this.$route.query.releaseProductId || sessionStorage.getItem('productSpecifications'))[1];
    this.secondItemId = JSON.parse(this.$route.query.releaseProductId || sessionStorage.getItem('productSpecifications'))[0];
    this.specificationArr = []; 
    this.tableData = [];
    this.getProductInfo();
  },

  methods: {
    // 提交表单信息
    submitForm(){
      let data = {};
      let specData = [];
      let flag = false;
      this.tableData.map((v,k)=>{
        if(v.code == ''){
          flag =true;
        }
        specData.push({id:v.priId,specIds:v.id.join(','),spec:v.spec,specImg:v.imgUrl,status:v.status,productId:this.productId,barCode:v.code});
      })
      if(flag){
        this.$message.warning('请输入条形码');
        return;
      }
      data.specData = JSON.stringify(specData);
      data.productId = this.productId;
      data.url = pApi.querySaleSpecList;
      this.$axios.post(api.addProductSpec,data)
      .then((res) => {
          this.$message.success(res.data.msg);
          this.$router.push({name:'productList'});
      }).catch((err) => {
          console.log(err)
      });
    },
    // 获取产品信息
    getProductInfo(){
      let data = {};
      data.secCategoryId = this.secondItemId;
      data.productId = this.productId;
      data.url = pApi.querySaleSpecList;
      this.$axios.post(api.querySaleSpecList,data)
      .then((res) => {
        this.specificationArr = [];
        res.data.data.spec.forEach((v,k)=>{
          this.specificationArr.push({type:v.spec,id:v.spec_id,speArr:v.spec_values.split(',')});
        })
        res.data.data.specValue.forEach((v,k)=>{
          this.tableData.push({priId:v.id,spec:v.spec,imgUrl:v.specImg,code:v.barCode,id:v.specIds.split(','),status:v.status})
        })
      }).catch((err) => {
        console.log(err)
      });
    },
    // 生成列表
    createList(){
      let data = {};
      let tmp = [];
      this.specificationArr.forEach((v,k)=>{
        let tmpObj = {};
        tmpObj.spec = v.type;
        tmpObj.specId = v.id || "";
        tmpObj.specValue = v.speArr;
        tmpObj.productId = this.productId;
        tmp.push(tmpObj)
      })
      if(tmp.length == 0){
        this.$message.warning('请输入产品规格');
        return;
      }
      data.saleSpecValue = JSON.stringify(tmp);
      data.secCategoryId = this.secondItemId;
      data.productId = this.productId;
      data.url = pApi.querySaleSpecList;
      this.$axios.post(api.addSaleSpecValue,data)
      .then((res) => {
          this.$message.success('生成成功!');
          this.tableData = [];
          res.data.data.saleSpecValue.forEach((v,k)=>{
            this.tableData.push({spec:v.specValue.join('-'),imgUrl:'',code:'',id:v.id,status:'1'})
          })
      }).catch((err) => {
          console.log(err);
      });
    },
    //  添加规格
    addSpe(index) {
      this.specificationArr[index].speArr.push("");
    },
    // 删除规格
    deleteSpe(index, k) {
      this.specificationArr[index].speArr.splice(k, 1);
    },
    // 删除类型
    deleteType(index) {
      this.specificationArr.splice(index, 1);
    },
    // 删除一级按钮
    showFirstDelBtn(v) {
      this.deleteFirstItem = v;
    },
    //删除二级按钮
    showDeleteBtn(v) {
      this.deleteItem = v;
    },
    // 添加类型
    addType() {
      this.specificationArr.push({ type: "", speArr: [] });
    },
    // 上传之前
    beforeUpload(index) {
        this.rowId = index;
    },
    // 上传成功的钩子
    uploadSuccess(res) {
      if (res.code == 200) {
          this.tableData[this.rowId].imgUrl = res.data.imageUrl;
      } else {
        this.$message.warning(res.data.msg);
      }
    },
    // 删除图片
    deleteImg(index){
        this.tableData[index].imgUrl = '';
    },
    // 禁用/启用
    operateProduct(row,status){
      row.status = status;
    }
  }
};
</script>
<style lang='less'>
.product-specification {
  .el-upload--text {
    width: 80px;
    height: 32px;
    overflow: hidden;
    border: none;
  }
  .product-img {
    display: inline-block;
    width: 45px;
    height: 45px;
    border: 1px solid #ddd;
    border-radius: 3px;
    vertical-align: middle;
    margin-right: 5px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .spe-title {
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    background-color: #f7f7f7;
    box-sizing: border-box;
  }
  .spe-wrap {
    width: 100%;
    border: 1px solid #ddd;
    margin-top: 20px;
    padding: 10px;
    box-sizing: border-box;
    font-size: 14px;
    color: #666;
    .small-spe-title {
      width: 100%;
      height: 60px;
      line-height: 60px;
      background-color: #f7f7f7;
      padding: 0 30px;
      box-sizing: border-box;
      .delete-big-tit {
        display: inline-block;
        position: relative;
        .del-big-btn {
          position: absolute;
          top: 8px;
          right: -5px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 1px solid #ccc;
          background-color: #fff;
          cursor: pointer;
          z-index: 1000;
          line-height: 15px;
          text-align: center;
          color: #ccc;
        }
      }
    }
    .small-spe-content {
      width: 100%;
      padding: 20px 0 10px 70px;
      box-sizing: border-box;
      overflow: hidden;
      .des-wrap {
        position: relative;
        display: inline-block;
        .delete-btn {
          position: absolute;
          top: -6px;
          right: 5px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 1px solid #ccc;
          background-color: #fff;
          cursor: pointer;
          z-index: 1000;
          line-height: 15px;
          text-align: center;
          color: #ccc;
        }
        .des-inp {
          width: 160px;
          margin: 0 10px 10px 0;
        }
      }
      .add-spe {
        color: #33b4ff;
        cursor: pointer;
      }
    }
  }
}
</style>