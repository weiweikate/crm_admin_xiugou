<template>
    <div>
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
          <el-form ref="form" :model="form" inline label-width="120px">
              <el-form-item prop="status" label="防伪码状态">
                  <el-select v-model="form.status" placeholder="请选择">
                      <el-option v-for="(v,k) in level" :label="v.label" :value="v.value" :key="k"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item prop="beginTime" label="操作开始时间">
              <el-date-picker
                v-model="form.beginTime"
                type="datetime"
                placeholder="请选择开始时间"
                default-time="00:00:00" 
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="操作结束时间">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="请选择结束时间"
                default-time="00:00:00"
                >
              </el-date-picker>
            </el-form-item>
              <el-form-item label=" ">
                  <el-button @click="getList(1)" type="primary">搜索</el-button>
                  <el-button @click="resetForm('form')">重置</el-button>
              </el-form-item>
          </el-form>
        </el-card>
        <el-card class="con-card">
          <el-button v-if="p.productionSecurityCode" type="primary" @click="createCode">生成防伪码</el-button>
          <el-table v-loading="tableLoading" class="w-table" stripe :data="tableData" :height="height" border style="width: 100%">
              <el-table-column prop="id" label="方位记录ID" width="100" align="center"></el-table-column>
              <el-table-column prop="categoryId" label="产品类型" align="center"></el-table-column>
              <el-table-column prop="brandName" label="产品品牌" align="center"></el-table-column>
              <el-table-column label="导出时间" align="center">
                <template slot-scope="scope">
                  {{scope.row.createTime | formatDate}}
                </template>
              </el-table-column>
              <el-table-column prop="productNum" label="导出数量" align="center"></el-table-column>
              <el-table-column prop="remark" label="备注说明" align="center"></el-table-column>
              <el-table-column prop="name" label="状态" align="center">
                <template slot-scope="scope">
                  <template v-if="scope.row.status == 0">待确认</template>
                  <template v-else-if="scope.row.status == 1">未入库</template>
                  <template v-else-if="scope.row.status == 2">已入库</template>
                  <template v-else-if="scope.row.status == 3">已出库</template>
                  <template v-else-if="scope.row.status == 8">正在生成 </template>
                  <template v-else-if="scope.row.status == 9">已经生成</template>
                </template>
              </el-table-column>
              <el-table-column prop="inWareHouseNum" label="已入库" width="70"  align="center"></el-table-column>
              <el-table-column prop="noWareHouseNum" label="未入库" width="70" align="center"></el-table-column>
              <el-table-column prop="outWareHouseNum" label="已出库" width="70"  align="center"></el-table-column>
              <el-table-column v-if="isShowOperate" label="操作"  width="250" align="center">
                <template slot-scope="scope">
                  <el-button v-if="p.exportSecurityCode" @click="importCode(scope.row)" size="mini" type="primary">导出防伪码</el-button>
                  <el-button v-if="scope.row.status == 0 && p.updateCodeStatus" @click="updateCodeStatus(scope.row,'1')" size="mini" type="primary">待确认</el-button>
                  <el-button v-if="scope.row.status == 1 && p.updateCodeStatus" @click="updateCodeStatus(scope.row,'2')" size="mini" type="primary">确认入库</el-button>
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
        </el-card>
        <el-dialog title="生成防伪码" :visible.sync="isShowDialog">
          <el-form :model="diaForm" :rules="diaRules" ref="diaForm" label-width="80px">
            <el-form-item prop="firstProductItem" label="产品分类" >
              <el-select @change="getProductSecondName" v-model="diaForm.firstProductItem" placeholder="请选择分类">
                <el-option v-for="(v,k) in firstProduct" :label="v.label" :value="v.value" :key="k"></el-option>
              </el-select>
              <el-select @change="getProductBrand" v-model="diaForm.secondProductItem" placeholder="请选择分类">
                <el-option v-for="(v,k) in secondProduct" :label="v.label" :value="v.value" :key="k"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="productBrand" label="产品品牌" >
              <el-select v-model="diaForm.productBrand" placeholder="请选择品牌">
                <el-option v-for="(v,k) in productList" :label="v.label" :value="v.value" :key="k"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="product" label="产品" >
              <el-select v-model="diaForm.product" placeholder="请选择产品">
                <el-option v-for="(v,k) in product" :label="v.label" :value="v.value" :key="k"></el-option>
              </el-select>
            </el-form-item><br/>
            <el-form-item prop="tpl" label="选择模板" >
              <el-select @change="getCodeTplMsg" v-model="diaForm.tpl" placeholder="请选择模板">
                <el-option v-for="(v,k) in codetplList" :label="v.label" :value="v.value" :key="k"></el-option>
              </el-select>
              <span @click="selectTpl" class="selectTpl">去选择模板</span>
            </el-form-item>
            <el-form-item prop="productNum" label="产品数量" >
              <el-input @input="getCodeNum" class="roots-inp" v-model="diaForm.productNum"></el-input> 套
            </el-form-item>
            <el-form-item label="" >
              <el-input  v-model="diaForm.note" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="生成:">
              <span style="color:#ff6868">共生成{{smallNum}}个箱码，{{packageNum}}个包装码</span>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirmCreateCode('diaForm')">确 定</el-button>
            <el-button @click="isShowDialog = false">取 消</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "../../common/Breadcrumb";
import * as api from "../../../api/api.js";
import * as pApi from '../../../privilegeList/index.js'
import utils from '../../../utils/index.js';
import moment from 'moment';
export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      // 权限控制
      p:{
          productionSecurityCode:false,
          exportSecurityCode:false,
          updateCodeStatus:false,
      },
      isShowOperate:true,

      nav: ["溯源管理", "防伪码管理"],
      isShowDialog: false,
      exportBtn:false,
      level: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "待确认",
          value: "0"
        },
        {
          label: "未入库",
          value: "1"
        },
        {
          label: "已入库",
          value: "2"
        },
        {
          label: "已出库",
          value: "3"
        },
        {
          label: "正在生成",
          value: "8"
        },
        {
          label: "已经生成",
          value: "9"
        },
      ],
      form: {
        status: "",
        beginTime:'',
        endTime:''
      },
      firstProduct:[],
      secondProduct:[],
      codetplList:[],
      productList:[],
      product:[{label:'袜子',value:1}],
      smallBoxCodeNum:0,
      packagingCodeNum:0,
      smallNum:0,
      packageNum:0,
      diaForm: {
        firstProductItem:'',
        secondProductItem:'',
        productBrand: "",
        product: "",
        tpl: "",
        productNum: "",
        note: ""
      },
      diaRules: {
        productNum: [{ required: true, message: '请输入产品数量', trigger: 'blur' },],
        firstProductItem: [{ required: true, message: '请输入类目', trigger: 'blur' },],
        productBrand: [{ required: true, message: '请选择品牌', trigger: 'blur' },],
        product: [{ required: true, message: '请选择产品', trigger: 'blur' },],
        tpl: [{ required: true, message: '请选择模板', trigger: 'blur' },],
      },
      tableLoading: false,
      tableData: [],
      height: "",
      page: {
        currentPage: 1,
        totalPage: 20
      }
    };
  },
  created() {
    let winHeight = window.screen.availHeight - 500;
    this.height = winHeight;
    this.pControl();
  },
  activated(){
    this.pControl();
    this.getList(this.page.currentPage);
    this.getProductFirstName();
    this.getCodeTplList();
  },
  methods: {
    // 权限控制
    pControl() {
        for (const k in this.p) {
            this.p[k] = utils.pc(pApi[k]);
        }
        if (!this.p.exportSecurityCode && !this.p.updateCodeStatus) {
            this.isShowOperate = false;
        }
    },
    //  获取数据
    getList(val) {
      let that = this;
      let data = {};
      this.tableData = [];
      data.beginTime = this.form.beginTime == ''?'':moment(this.form.beginTime).format('YYYY-MM-DD HH:mm:ss');
      data.endTime = this.form.endTime == ''?'':moment(this.form.endTime).format('YYYY-MM-DD HH:mm:ss');
      data.status = this.form.status;
      data.page = val;  
      data.url = pApi.getRecordPage;
      this.tableLoading = true;
      this.$axios
        .post(api.getRecordPage, data)
        .then(res => {
          if(res.data.code ==200){
            that.tableData = res.data.data.data;
            that.tableLoading = false;
            that.page.totalPage = res.data.data.resultCount;
          }else{
            that.tableLoading = false;
            this.$message.warning(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
          that.tableLoading = false;
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page.currentPage = val;
      this.getList(val);
    },

    // 生成防伪码
    createCode() {
      this.diaForm = {};
      this.smallNum = 0;
      this.packageNum = 0;
      this.isShowDialog = true;
    },
    confirmCreateCode(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {};
          data.brandId = this.diaForm.productBrand;
          data.categoryId = this.diaForm.product;
          data.productNum = this.diaForm.productNum;
          data.templateId = this.diaForm.tpl;
          data.remark = this.diaForm.note;
          data.url = pApi.productionSecurityCode;
          this.$axios.post(api.productionSecurityCode,data)
          .then(res=>{
            if(res.data.code == 200){
              this.$message.success(res.data.data);
              this.isShowDialog = false;
            }else{
              this.$message.warning(res.data.msg);
            }
          })
          .catch(err=>{
            console.log(err)
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 选择模板
    selectTpl(){
      this.isShowDialog = false;
      this.$router.push('/rootsCodeTpl');
    },

    //   重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 导出防伪码
    importCode(row){
      let data = {};
      data.productCode = row.productCode;
      data.recordId = row.id;
      data.url = pApi.exportSecurityCode;
      this.$axios
      .post(api.exportSecurityCode, data, {responseType: "blob"})
      .then(res => {
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", row.brandName+".xlsx");
          document.body.appendChild(link);
          link.click();
      })
      .catch(err => {
          console.log(err);
      });
    },
    // 修改防伪码状态
    updateCodeStatus(row,status){
      let data = {};
      data.id = row.id;
      data.productCode = row.productCode;
      data.status = status;
      data.url = pApi.updateCodeStatus;
      this.$axios.post(api.updateCodeStatus,data)
      .then(res=>{
        if(res.data.code ==200){
          this.$message.success('修改成功！');
          row.status = status;
        }else{
          this.$message.warning(res.data.msg);
        }
      })
      .catch(err=>{
        console.log(err)
      })
    },
    // 获取产品分类一级名称
    getProductFirstName(){
      let that = this;
      this.firstProduct = [];
      this.$axios.post(api.getFirstList,{})
      .then(res=>{
        if(res.data.code == 200){
          res.data.data.forEach((v,k)=>{
            that.firstProduct.push({label:v.name,value:v.id})
          })
        }else{
          this.$message.warning(res.data.msg);
        }
      })
      .catch(err=>{
        console.log(err);
      })
    },
    // 获取产品分类二级名称
    getProductSecondName(id){
      let that = this;  
      let data = {};
      this.secondProduct = [];
      data.fatherid = id;
      this.$axios.post(api.getSecondList,data)
      .then(res=>{
        if(res.data.code == 200){
          res.data.data.forEach((v,k)=>{
            that.secondProduct.push({label:v.name,value:v.id})
          })
          that.diaForm.secondProductItem = that.secondProduct[0] == undefined?'':that.secondProduct[0].value;
        }else{
          this.$message.warning(res.data.msg);
        }
      })
      .catch(err=>{
        console.log(err);
      })
    },
    // 获取产品品牌
    getProductBrand(id){
      let that = this;  
      let data = {};
      this.productList = [];
      data.cId = id;
      this.$axios.post(api.queryCategoryBrandCid,data)
      .then(res=>{
        if(res.data.code == 200){
          res.data.data.forEach((v,k)=>{
            that.productList.push({label:v.name,value:v.id})
          })
        }else{
          this.$message.warning(res.data.msg);
        }
      })
      .catch(err=>{
        console.log(err);
      })
    },
    // 获取模板列表
    getCodeTplList(){
      let that = this;
      this.codetplList = [];
      this.$axios.post(api.getAllgetAllActivety,{})
      .then(res=>{
        if(res.data.code == 200){
          res.data.data.forEach((v,k)=>{
            that.codetplList.push({label:v.templateName,value:v.id})
          })
        }else{
          this.$message.warning(res.data.msg);
        }
      })
      .catch(err=>{
        console.log(err);
      })
    },
    // 获取模板信息
    getCodeTplMsg(id){
      let that = this;
      let data = {};
      data.id = id;
      this.$axios.post(api.rootsQueryCodeTplList,data)
      .then(res=>{
        if(res.data.code == 200){
          this.smallBoxCodeNum = res.data.data.smallBoxCodeNum;
          this.packagingCodeNum = res.data.data.packagingCodeNum;
          this.getCodeNum();
        }else{
          this.$message.warning(res.data.msg);
        }
      })
      .catch(err=>{
        console.log(err);
      })
    },
    // 计算生成数量
    getCodeNum(){
      let num = this.diaForm.productNum;
      let reg = /^[0-9]*[1-9][0-9]*$/;
      num = num == undefined?0:num;
      if(reg.test(num) == false && num !=0){
        this.$message.warning('请输入正确的数字!');
        return;
      }
      this.smallNum = this.smallBoxCodeNum * parseInt(num);
      this.packageNum = this.packagingCodeNum * parseInt(num);
      console.log(this.smallNum)
    }
  }
};
</script>
<style lang="less">
.w-table {
  margin-top: 10px;
}
.con-card {
  margin-top: 20px;
}
.block {
  float: right;
  margin: 10px 0 10px 0;
}
.el-dialog__title {
  color: #ff6868;
}
.roots-inp {
  width: 215px;
}
.el-dialog__header {
  border-bottom: 1px solid #eee;
  padding: 20px 20px 10px 50px;
}
.selectTpl{
  color:#6ac8ff;
  cursor: pointer;
}
</style>


