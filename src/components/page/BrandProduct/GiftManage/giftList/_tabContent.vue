<template>
    <div class="tab-content">
      <el-button @click="releaseProduct" class="add-product" type="primary">添加礼包</el-button>
      <div class="search-pane">
          <el-form :model="form" ref='form' inline label-width="100px">
              <el-form-item prop="name" label="礼包名称">
                  <el-input v-model.trim="form.name" placeholder="请输入礼包名称"></el-input>
              </el-form-item>
              <el-form-item prop="prodCode" label="礼包ID">
                  <el-input v-model.trim="form.prodCode" placeholder="请输入礼包ID"></el-input>
              </el-form-item>
              <el-form-item prop="level" label="可购买层级" >
                  <el-select v-model="form.level" placeholder="请选择用户层级">
                      <el-option label="全部" value=""></el-option>
                      <el-option :label="item.name" :value="item.id" v-for="(item,index) in levelList" :key="index"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item prop="type" label="礼包类型" >
                  <el-select v-model="form.type" placeholder="请选择用户层级">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="普通礼包" value="1"></el-option>
                      <el-option label="升级礼包" value="2"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label=" ">
                  <el-button type="primary" @click="getList(1)">搜索</el-button>
                  <el-button @click="resetForm('form')">重置</el-button>
              </el-form-item>
          </el-form>
      </div>
      <el-table v-loading="tableLoading" border :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column prop="name" label="产品名称" min-width="300">
              <template slot-scope="scope">
                  <div class="product-img">
                      <img :src="scope.row.imgUrl">
                  </div>
                  <p class="product-name">{{scope.row.name}}</p>
                  <p class="product-id">礼包ID：{{scope.row.giftCode}}</p>
              </template>
          </el-table-column>
          <el-table-column label="产品类目" align="center" min-width="120">
              <template slot-scope="scope">
                  {{scope.row.categoryName}}
              </template>
          </el-table-column>
          <el-table-column label="售价" align="center" min-width="50">
              <template slot-scope="scope">
                  {{scope.row.originalPrice == undefined?'0':scope.row.originalPrice | formatPrice}}
              </template>
          </el-table-column>
           <el-table-column prop="type" label="类型" align="center" min-width="50"></el-table-column>
           <el-table-column prop="type" label="产品数" align="center" min-width="50"></el-table-column>
           <el-table-column prop="type" label="库存" align="center" min-width="50"></el-table-column>
          <el-table-column prop="saleNum" label="销量" align="center" min-width="50"></el-table-column>
          <el-table-column prop="buyer" label="可购买层级" align="center" min-width="100">
            <template slot-scope="scope">
              {{scope.row.buyer.join(',')}}
            </template>
          </el-table-column>
          <el-table-column label="发布时间/发布人" align="center" min-width="120">
              <template slot-scope="scope">
                  {{scope.row.createTime | formatDate}}<br/>{{`产品编辑:${scope.row.createAdminName || ''}`}}
              </template>
          </el-table-column>
          <el-table-column prop="" label="状态" align="center" min-width="50">
              <template slot-scope="scope">
                  <template v-if='scope.row.status == 1'>待审核</template>
                  <template v-else-if='scope.row.status == 2'>已通过</template>
                  <template v-else-if='scope.row.status == 3'>未通过</template>
                  <template v-else-if='scope.row.status == 4'>已上架</template>
                  <template v-else-if='scope.row.status == 5'>已下架</template>
                  <template v-else-if='scope.row.status == 6'>删除</template>
              </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="100">
            <template slot-scope="scope">
              <el-button @click="giftAudit(scope.row,2)" v-if='scope.row.status == 1' style="margin-bottom:10px" type="success">通过审核</el-button>
              <el-button @click="giftAudit(scope.row,3)" v-if='scope.row.status == 1' style="margin-bottom:10px" type="danger">驳回审核</el-button>
              <el-button @click="giftUporDown(scope.row,4)" v-if='scope.row.status == 5 || scope.row.status == 2' style="margin-bottom:10px" type="success">礼包上架</el-button>
              <el-button @click="giftUporDown(scope.row,5)" v-if='scope.row.status == 4' type="danger">礼包下架</el-button>
            </template>
          </el-table-column>
          <el-table-column label="管理操作" align="center" min-width="100">
              <template slot-scope="scope">
                  <div v-if='scope.row.status == 1 || scope.row.status == 5 || scope.row.status == 2 || scope.row.status == 3' class="mange-sty" @click="editProduct(scope.row)">编辑礼包</div>
                  <div v-if='scope.row.status == 1 || scope.row.status == 5 || scope.row.status == 2 || scope.row.status == 3' class="mange-sty" @click="priceOfInventory(scope.row)">价格库存</div>
                  <div v-if='scope.row.status == 1 || scope.row.status == 5 || scope.row.status == 2 || scope.row.status == 3' class="mange-sty" @click="productMange(scope.row)">礼包管理</div>
                  <div v-if='scope.row.status == 1 || scope.row.status == 5 || scope.row.status == 2 || scope.row.status == 3' class="mange-sty" @click="inventoryManage(scope.row)">优惠券管理</div>
                  <div v-if='scope.row.status == 1 || scope.row.status == 5 || scope.row.status == 2 || scope.row.status == 3' class="mange-sty" @click="expMange(scope.row)">经验值管理</div>
                  <div v-if='scope.row.status == 1 || scope.row.status == 5 || scope.row.status == 2 || scope.row.status == 3' class="mange-sty" @click="productInfo(scope.row)">查看详情</div>
              </template>
          </el-table-column>
      </el-table>
      <div class="block">
          <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.currentPage"
              layout="total, prev, pager, next, jumper"
              :total="page.totalPage">
          </el-pagination>
      </div>
      <div class="operate-table">
          <el-popover placement="top" width="160" v-model="isShowPop">
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                  <el-button @click="batchOperate(1)" type="primary" size="mini">确定</el-button>
                  <el-button size="mini" type="text" @click="isShowPop = false">取消</el-button>
              </div>
              <el-button slot="reference" @click="isShowPop = true">删除</el-button>
          </el-popover>
          <el-button @click="batchOperate(2)">下架</el-button>
      </div>
    </div>
</template>

<script>
import * as api from '@/api/BrandProduct/GiftMange/index.js';
import { myMixinTable } from '@/JS/commom';

export default {
    props: ['name'],

    components: {},

    mixins: [myMixinTable],

    data() {
        return {
            levelList: [], // 用户层级列表
            giftStatus: '', // 礼包状态
            form: {
                name: '',
                prodCode: '',
                level: '',
                type: ''
            },
            tableData: [],
            tableLoading: false,
            isShowPop: false,
            multipleSelection: [] // 复选框
        };
    },
    methods: {
        //   提交表单
        getList(val) {
            const data = {};
            data.name = this.form.name;
            data.code = this.form.prodCode;
            data.level = this.form.level;
            data.page = val;
            data.pageSize = this.page.pageSize;
            data.status = this.giftStatus;
            console.log(data);
        },
        // 礼包上下架
        giftUporDown(row, status) {
            // status:4：上架 2：下架
            this.$axios.post(api.giftBagUpOrDown, { id: row.id, status: status }).then(res => {
                this.$message.success(res.data.msg);
                this.getList(this.page.currentPage);
            });
        },
        // 礼包审核
        giftAudit(row, status) {
            // status: 2：通过 3:驳回
            this.$axios.post(api.checkGiftBag, { id: row.id, status: status }).then(res => {
                this.$message.success(res.data.msg);
                this.getList(this.page.currentPage);
            });
        },
        // 获取可购买层级列表
        getLevelList() {
            const that = this;
            const data = {};
            that.$axios
                .post(api.getDealerLevelList, data)
                .then(res => {
                    if (res.data.code == 200) {
                        that.levelList = res.data.data;
                    } else {
                        that.$message.warning(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        //   重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.getList(1);
        },
        // 全选
        handleSelectionChange(val) {
            const that = this;
            this.multipleSelection = [];
            val.forEach((v, k) => {
                that.multipleSelection.push(v.id);
            });
        },
        // 发布礼包
        releaseProduct() {
            this.$router.push({ name: 'addGift' });
        },
        // 编辑礼包
        editProduct(row) {
            sessionStorage.setItem('giftId', row.id);
            this.$router.push({
                name: 'editGift',
                query: { giftId: row.id }
            });
        },
        // 价格库存管理
        priceOfInventory(row) {
            sessionStorage.setItem('priceOfInventoryId', row.id);
            this.$router.push({
                name: 'priceOfInventory',
                query: { priceOfInventoryId: row.id }
            });
        },
        // 优惠券管理
        inventoryManage(row) {
            sessionStorage.setItem('discountAddId', row.id);
            this.$router.push({
                name: 'discountAdd',
                query: { discountAddId: row.id }
            });
        },
        // 经验值管理
        expMange(row) {
            sessionStorage.setItem('expMangeId', row.id);
            this.$router.push({
                name: 'expMange',
                query: { expMangeId: row.id }
            });
        },
        // 查看详情
        productInfo(row) {
            // 查看详情
            sessionStorage.setItem('giftId', row.id);
            this.$router.push({
                name: 'giftInfo',
                query: { giftId: row.id }
            });
        },
        // 产品管理
        productMange(row) {
            sessionStorage.setItem('giftProductMangeId', row.id);
            this.$router.push({
                name: 'giftProductMange',
                query: { giftProductMangeId: row.id }
            });
        },
        // 批量操作
        batchOperate(status) {
            if (this.multipleSelection.length == 0) {
                this.$message.warning('请选择礼包!');
                return;
            }
            // status 1:删除 2：下架
            let url = '';
            const idStr = this.multipleSelection.join(',');
            if (status == 1) {
                url = api.batchDeleteGiftBag;
            } else {
                url = api.batchSoldOutGiftBag;
            }
            this.$axios.post(url, { idStr: idStr }).then(res => {
                this.isShowPop = false;
                this.$message.success(res.data.msg);
                this.getList(this.page.currentPage);
            });
        }
    },
    filters: {
        formatPrice(val) {
            return `￥${val}`;
        }
    }
};
</script>
<style lang='less'>
.tab-content {
  .add-product {
    margin: 0 0 20px 0;
  }
  .search-pane {
    width: 100%;
    padding: 30px 0 0 0;
    margin-bottom: 20px;
    background-color: #f7f7f7;
    box-sizing: border-box;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    padding: 0 4px;
  }
  .operate {
    button {
      margin-right: 10px;
      margin-top: 5px;
    }
    button:nth-child(3) {
      margin-right: 0px;
    }
  }
  .operate-table {
    margin-top: 10px;
  }
  .el-button + .el-button {
    margin-left: 0px;
  }
  .block {
    float: right;
    margin-top: 10px;
  }
  .product-img {
    display: inline-block;
    float: left;
    width: 80px;
    height: 80px;
    border: 1px solid #ddd;
    overflow: hidden;
    img {
      width: 60px;
      height: 60px;
      margin: 10px;
    }
  }
  .product-name {
    float: left;
    width: 65%;
    height: auto;
    margin: 5px 0 0 20px;
  }
  .product-id {
    float: left;
    width: 65%;
    height: auto;
    margin: 20px 0 0 20px;
  }
  .mange-sty {
    cursor: pointer;
    color: #33b4ff;
  }
}
</style>
