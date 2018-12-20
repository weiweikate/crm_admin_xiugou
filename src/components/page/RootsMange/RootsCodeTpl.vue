<template>
    <div>
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <el-button v-if="p.addCodeTemplate" type='primary' @click="addCodeTpl('addTplForm')">添加模板</el-button>
            <el-table v-loading="tableLoading" class="w-table" stripe :data="tableData" :height="height" border style="width: 100%">
                <el-table-column prop="id" label="编号" width="180" align="center"></el-table-column>
                <el-table-column prop="templateName" label="模板名称" align="center"></el-table-column>
                <el-table-column prop="bigBoxCodeNum" label="大箱码" align="center">
                  <template slot-scope="scope">
                    <template v-if="scope.row.bigBoxCodeNum == undefined">
                      /
                    </template>
                    <template v-else>
                      {{scope.row.bigBoxCodeNum}}
                    </template>
                  </template>
                </el-table-column>
                <el-table-column prop="smallBoxCodeNum" label="小箱码" align="center">
                  <template slot-scope="scope">
                    <template v-if="scope.row.smallBoxCodeNum == undefined">
                      /
                    </template>
                    <template v-else>
                      {{scope.row.smallBoxCodeNum}}
                    </template>
                  </template>
                </el-table-column>
                <el-table-column prop="packagingCodeNum" label="包装码" align="center"></el-table-column>
                <el-table-column prop="productCount" label="已生成" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.productCount == 0">
                          <el-button v-if="p.updateCodeTemplate" type="warning" @click='editCodeTpl(scope.row)'>编辑</el-button>
                          <el-button v-if="p.deleteCodeTemplate" type="danger" @click="deleteTpl(scope.row)">删除</el-button>
                        </template>
                        <template v-if="scope.row.productCount > 0">
                          <el-button v-if="p.loseCodeTemplate && scope.row.status == 1" type="warning" @click="failureTpl(scope.row)">失效</el-button>
                          <el-button v-if="p.loseCodeTemplate && scope.row.status == 0" type="warning" disabled>已失效</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog title="添加防伪码模板" :visible.sync="isShowaddCodeDialog">
            <el-form :model="addTplForm" :rules="rules" ref="addTplForm" label-width="140px">
                <el-form-item prop="templateName" label="模板名称" >
                    <el-input class="rootscode-inp" v-model="addTplForm.templateName" placeholder="请输入模板名称"></el-input>
                </el-form-item><br />
                    <el-form-item label="" ><h3 style="position:absolute;top:-15px;left:-70px">防伪码数量设置</h3></el-form-item><br/>
                <el-form-item label="是否需要大箱防伪码" >
                  <el-select @change='setBigBoxCode' v-model="useBigBoxCode">
                    <el-option value="1" label="是"></el-option>
                    <el-option value="2" label="否"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="isShowBigBox" prop="bigBoxCodeNum" label="大箱防伪码数量" >
                    <el-input class="rootscode-inp" :disabled="true" v-model="addTplForm.bigBoxCodeNum" placeholder="请输入大箱码"></el-input>
                </el-form-item>
                <el-form-item prop="smallBoxCodeNum" label="小箱防伪码数量" >
                    <el-input :disabled="isUseSmallBox" class="rootscode-inp" v-model="addTplForm.smallBoxCodeNum" placeholder="请输入箱码"></el-input>
                </el-form-item>
                <el-form-item prop="packagingCodeNum" label="包装防伪码数量" >
                    <el-input class="rootscode-inp" v-model="addTplForm.packagingCodeNum" placeholder="请输入包装码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="confirmAddCodeTpl('addTplForm')">确 定</el-button>
                <el-button @click="isShowaddCodeDialog = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改防伪码模板" :visible.sync="isShoweditCodeDialog">
            <el-form :model="editTplForm" :rules="rules" ref="editTplForm" label-width="140px">
                <el-form-item prop="templateName" label="模板名称" >
                    <el-input class="rootscode-inp" v-model="editTplForm.templateName" placeholder="请输入模板名称"></el-input>
                </el-form-item><br />
                    <el-form-item label="" ><h3 style="position:absolute;top:-15px;left:-70px">防伪码数量设置</h3></el-form-item><br/>
                <el-form-item label="是否需要大箱防伪码" >
                  <el-select @change='setBigBoxCode' v-model="useBigBoxCode">
                    <el-option value="1" label="是"></el-option>
                    <el-option value="2" label="否"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="isShowBigBox" prop="bigBoxCodeNum" label="大箱防伪码数量" >
                    <el-input class="rootscode-inp" :disabled="true" v-model="addTplForm.bigBoxCodeNum" placeholder="请输入大箱码"></el-input>
                </el-form-item>
                <el-form-item prop="smallBoxCodeNum" label="小箱防伪码数量" >
                    <el-input :disabled="isUseSmallBox" class="rootscode-inp" v-model="editTplForm.smallBoxCodeNum" placeholder="请输入箱码"></el-input>
                </el-form-item>
                <el-form-item prop="packagingCodeNum" label="包装码" >
                    <el-input class="rootscode-inp" v-model="editTplForm.packagingCodeNum" placeholder="请输入包装码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :loading="btnLoading" type="primary" @click="confirmEditCodeTpl('editTplForm')">确 定 修 改</el-button>
                <el-button @click="isShoweditCodeDialog = false">取 消</el-button>
            </div>
        </el-dialog>
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>
</template>
<script>
import breadcrumb from "../../common/Breadcrumb";
import deleteToast from "../../common/DeleteToast";
import * as api from "../../../api/api.js";
import utils from '../../../utils/index.js'
import * as pApi from '../../../privilegeList/index.js';
export default {
  components: {
    breadcrumb,
    deleteToast
  },
  data() {
    return {
      // 权限控制
      p:{
        addCodeTemplate:false,
        updateCodeTemplate:false,
        deleteCodeTemplate:false,
        loseCodeTemplate:false,
      },

      nav: ["溯源管理", "防伪码模板"],
      tableLoading: false,
      btnLoading: false,
      isShowaddCodeDialog: false,
      isShoweditCodeDialog: false,
      isShowDelToast: false,
      isShowBigBox:true,
      isUseSmallBox:false,
      useBigBoxCode:'1',
      delId: 0,
      delUrl: "http://api",
      delUri:'',
      addTplForm: {
        templateName: "",
        bigBoxCodeNum: "1",
        smallBoxCodeNum: "",
        packagingCodeNum: ""
      },
      editTplForm: {
        id: "",
        templateName: "",
        bigBoxCodeNum: "1",
        smallBoxCodeNum: "",
        packagingCodeNum: ""
      },
      tableData: [],
      page: {
        currentPage: 1,
        totalPage: 0
      },
      rules: {
        templateName: [
          { required: true, message: "请输入模板名称", trigger: "blur" }
        ],
        // bigBoxCodeNum: [
        //   { required: true, message: "请输入大箱码", trigger: "blur" }
        // ],
        smallBoxCodeNum: [
          { required: true, message: "请输入小箱码", trigger: "blur" }
        ],
        packagingCodeNum: [
          { required: true, message: "请输入包装码", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    let winHeight = window.screen.availHeight - 360;
    this.height = winHeight;
    this.pControl();
  },
  activated(){
    this.pControl();
    this.getList(this.page.currentPage);
  },
  methods: {
    // 权限控制
    pControl() {
      for (const k in this.p) {
        this.p[k] = utils.pc(pApi[k]);
      }
    },
    //获取列表
    getList(val) {
      let that = this;
      this.tableLoading = true;
      this.$axios
        .post(api.rootsGetCodeTplList, {url:pApi.securityCodeTemplate})
        .then(res => {
          that.tableLoading = false;
          if (res.data.code == 200) {
            this.tableData = [];
            this.tableData = res.data.data;
          } else {
            this.$message.error(res.data.msg);
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

    // 添加防伪码模板
    addCodeTpl(formName) {
      this.addTplForm = {bigBoxCodeNum: "1",smallBoxCodeNum: "1"};
      this.isShowaddCodeDialog = true;
    },
    confirmAddCodeTpl(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let reg = /^\d+(?=\.{0,1}\d+$|$)/;
          if((!reg.test(this.addTplForm.bigBoxCodeNum) && this.addTplForm.bigBoxCodeNum != '') || !reg.test(this.addTplForm.smallBoxCodeNum) || !reg.test(this.addTplForm.packagingCodeNum)){
            this.$message.warning('请输入正确的数值');
            return;
          }
          this.btnLoading = true;
          let that = this;
          let data = {};
          data = this.addTplForm;
          data.url = pApi.addCodeTemplate;
          this.$axios
            .post(api.rootsAddCodeTplList, data)
            .then(res => {
              that.btnLoading = false;
              if (res.data.code == 200) {
                this.btnLoading = false;
                this.$message.success('添加成功');
                this.isShowaddCodeDialog = false;
                this.getList(this.page.currentPage);
              } else {
                this.btnLoading = false;
                this.$message.error(res.data.msg);
                this.isShowaddCodeDialog = false;
              }
            })
            .catch(err => {
              console.log(err);
              this.btnLoading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 编辑防伪码模板
    editCodeTpl(row) {
      this.editTplForm = {};
      this.btnLoading = true;
      let data = {id:row.id};
      this.$axios
        .post(api.rootsQueryCodeTplList, data)
        .then(res => {
          if (res.data.code == 200) {
            this.editTplForm = res.data.data;
            this.btnLoading = false;
          } else {
            this.$message.error(res.data.msg);
            this.btnLoading = false;
          }
        })
        .catch(err => {
          console.log(err);
          that.tableLoading = false;
        });
      this.isShoweditCodeDialog = true;
    },
    confirmEditCodeTpl(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let reg = /^\d+(?=\.{0,1}\d+$|$)/;
          if(!reg.test(this.editTplForm.smallBoxCodeNum) || !reg.test(this.editTplForm.packagingCodeNum)){
            console.log(this.editTplForm)
            this.$message.warning('请输入正确的数值');
            return;
          }
          this.btnLoading = true;
          let data = {};
          data.id = this.editTplForm.id;
          data.templateName = this.editTplForm.templateName;
          data.smallBoxCodeNum = this.editTplForm.smallBoxCodeNum;
          data.packagingCodeNum = this.editTplForm.packagingCodeNum;
          data.url = pApi.updateCodeTemplate;
          this.$axios
            .post(api.rootsEditCodeTplList, data)
            .then(res => {
              this.btnLoading = false;
              if (res.data.code == 200) {
                this.btnLoading = false;
                this.$message.success('编辑成功');
                this.getList(this.page.currentPage);
                this.isShoweditCodeDialog = false;
              } else {
                this.btnLoading = false;
                this.$message.error(res.data.msg);
                this.isShoweditCodeDialog = false;
              }
            })
            .catch(err => {
              console.log(err);
              this.btnLoading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 失效防伪码模板
    failureTpl(row){
      this.$axios.post(api.loseById,{id:row.id,url:pApi.loseCodeTemplate})
      .then(res=>{
        if(res.data.code == 200){
          this.$message.success('修改成功!');
          this.getList(this.page.currentPage)
          row.status = 0;
        }else{
          this.$message.warning(res.data.msg);
        }
      })
      .catch(err=>{
        console.log(err)
      })
    },

    // 删除模板
    deleteTpl(row) {
      this.delId = row.id;
      this.delUrl = api.rootsDelCodeTplList;
      this.delUri = pApi.deleteCodeTemplate;
      this.isShowDelToast = true;
    },
    deleteToast(msg) {
      this.isShowDelToast = msg;
      this.getList(this.page.currentPage);
    },

    // 是否需要大箱防伪码
    setBigBoxCode(val){
      if(val == 2){
        this.isShowBigBox = false;
        this.addTplForm.bigBoxCodeNum = '';
        this.editTplForm.bigBoxCodeNum = '';
        this.isUseSmallBox = true;
        this.addTplForm.smallBoxCodeNum = 1;
        this.editTplForm.smallBoxCodeNum = 1;
      }else{
        this.isShowBigBox = true
        this.isUseSmallBox = false;
        this.addTplForm.bigBoxCodeNum = 1;
        this.editTplForm.bigBoxCodeNum = 1;
      }
    }
  }
};
</script>
<style lang="less">
.w-table {
  margin-top: 10px;
}
.block {
  float: right;
  margin: 10px 0 10px 0;
}
.el-dialog__title {
  color: #ff6868;
}
.rootscode-inp {
  width: 215px;
}
.el-dialog__header {
  border-bottom: 1px solid #eee;
  padding: 20px 20px 10px 50px;
}
</style>


