<template>
    <div class="set-permission">
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <el-button v-if="p.addFunctionModule" type='primary' @click="addModule">新增功能模块</el-button>
            <el-table :span-method='mergeRow' v-loading="tableLoading" class="w-table" :data="tableData" :height="height" border style="width: 100%">
                <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
                <el-table-column prop="title" label="一级模块" width="200" align="center"></el-table-column>
                <el-table-column prop="children" label="二级模块" width="200" align="center"></el-table-column>
                <el-table-column prop="three" label="权限" align="center">
                  <template slot-scope="scope">
                    <el-tag v-for="(v,k) in scope.row.three" :key="k">{{v.title}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column v-if="p.addPrivilege" label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="p.addPrivilege" type="primary" @click='addPermission(scope.row)'>添加权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog title="添加功能模块" width='30%' :visible.sync="isShowaddToask">
            <el-form ref="addModuleForm" :rules="rules" :model="addModuleForm">
                <el-form-item prop="name" label="模块名称">
                    <el-input class="add-module-inp" v-model="addModuleForm.name"></el-input>
                </el-form-item>
                <el-form-item prop="mdLevel" label="模块层级">
                    <el-select @change="getFirstList" v-model="addModuleForm.mdLevel" placeholder="请选择">
                        <el-option
                        v-for="item in mdLevel"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="addModuleForm.mdLevel != '1'" prop="first" label="一级模块">
                    <el-select v-model="addModuleForm.first" placeholder="请选择">
                        <el-option
                        v-for="item in first"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button :loading="btnLoading" type="primary" @click="confirmAddModule('addModuleForm')">确 定</el-button>
                <el-button @click="isShowaddToask = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="添加权限" width='30%' :visible.sync="isShowPermission">
            <el-form label-position="right" ref="addPermissionForm" :rules="rules" :model="addPermissionForm">
                <el-form-item prop="url" label="URL">
                    <el-input class="add-module-inp" style="margin-left:25px" v-model.trim="addPermissionForm.url"></el-input>
                </el-form-item>
                <el-form-item prop="belongModule" label="所属模块">
                    <el-input class="add-module-inp" disabled v-model.trim="addPermissionForm.belongModule"></el-input>
                </el-form-item>
                <el-form-item prop="perName" label="权限名称">
                    <el-input class="add-module-inp" v-model.trim="addPermissionForm.perName"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button :loading="btnLoading" type="primary" @click="confirmAddPer('addPermissionForm')">确 定</el-button>
              <el-button @click="isShowPermission = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "../../common/Breadcrumb";
import * as api from "../../../api/api.js";
import utils from '../../../utils/index.js'
import * as pApi from '../../../privilegeList/index.js';
export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      // 权限控制
      p:{
        addFunctionModule:true,
        addPrivilege:true,
      },

      nav: ["权限管理", "权限设置"],
      tableLoading: false,
      isShowaddToask: false,
      isShowPermission: false,
      btnLoading:false,
      mdLevel: [
        {
          value: "1",
          label: "一级"
        },
        {
          value: "2",
          label: "二级"
        }
      ],
      first: [],
      tableData: [],
      aData: [],
      addModuleForm: {
        name: "",
        mdLevel: "1",
        first: ""
      },
      addPermissionForm: {
        id: "",
        url: "",
        belongModule: "",
        perName: ""
      },
      spanData: [],
      page: {
        currentPage: 1,
        totalPage: 0
      },
      rules: {
        url: [{ required: true, message: "请输入URL", trigger: "blur" }],
        perName: [
          { required: true, message: "请输入权限名称", trigger: "blur" }
        ],
        belongModule: [
          { required: true, message: "请先添加二级模块", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    let winHeight = window.screen.availHeight - 360;
    this.height = winHeight;
    this.pControl();
  },
  activated() {
    this.pControl();
    this.getList();
    this.getFirstList();
  },
  methods: {
    // 权限控制
    pControl() {
      for (const k in this.p) {
        this.p[k] = utils.pc(pApi[k]);
      }
    },
    //获取列表
    getList() {
      let that = this;
      this.tableLoading = true;
      this.$axios
        .post(api.queryPrivilegeList, {})
        .then(res => {
          that.tableLoading = false;
          this.aData = res.data.data;
          this.spanData = [];
          this.tableData = [];
          let t = 0;
          this.aData.forEach((v, k) => {
            if(v.value.length == 0){
              this.spanData.push({ startIndex: t, num: 1 });
              t += 1;
            }else{
              this.spanData.push({ startIndex: t, num: v.value.length });
              t += v.value.length;
            }
          });
          this.aData.forEach((v, k) => {
            if(v.value.length == 0){
              this.tableData.push({
                id: k + 1,
                title: v.title,
                children: '',
                three: []
              })
            }
            v.value.forEach((val, ind) => {
              this.tableData.push({
                id: k + 1,
                title: v.title,
                children: val.title,
                fatherId: val.id,
                three: val.value
              });
            });
          });
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

    // 新增功能模块
    addModule() {
      this.addModuleForm = {mdLevel: "1"};
      this.isShowaddToask = true;
    },
    confirmAddModule() {
      if(this.addModuleForm.name == undefined){
        this.$message.warning('请输入模块名称');
        return;
      }
      if(this.addModuleForm.mdLevel == '2' && this.addModuleForm.first == undefined || ''){
        this.$message.warning('请选择一级模块名称');
        return;
      }
      let data = {};
      data.name = this.addModuleForm.name;
      data.url = pApi.addFunctionModule;
      if(this.addModuleForm.mdLevel == '2'){
        data.parentId = this.addModuleForm.first;
      }else{
        data.parentId = 0;
      }
      this.btnLoading = true;
      this.$axios.post(api.addFunctionModule,data)
      .then(res=>{
        if(res.data.code == 200){
          this.$message.success(res.data.data);
          this.getList();
          this.btnLoading = false;
          this.isShowaddToask = false;
        }else{
          this.btnLoading = false;
          this.isShowaddToask = false;
          this.$message.error(res.data.data);
        }
      })
      .catch(err=>{
        this.btnLoading = false;
        console.log(err);
      })
    },

    // 获取一级模块列表
    getFirstList() {
      this.$axios
        .post(api.queryTopMenuList, {})
        .then(res => {
          if (res.data.code == 200) {
            this.first = [];
            res.data.data.forEach((v, k) => {
              this.first.push({ label: v.name, value: v.id });
            });
          }else{
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 添加权限
    addPermission(row) {
      this.addPermissionForm = {};
      this.addPermissionForm.parentId = row.fatherId;
      this.addPermissionForm.belongModule = row.children;
      this.isShowPermission = true;
    },
    confirmAddPer(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {};
          data.parentId = this.addPermissionForm.parentId;
          data.name = this.addPermissionForm.perName;
          data.uri = this.addPermissionForm.url;
          data.url = pApi.addPrivilege;
          this.btnLoading = true;
          this.$axios
            .post(api.addPrivilege, data)
            .then(res => {
              if (res.data.code == 200) {
                this.$message.success(res.data.data);
                this.getList();
                this.btnLoading = false;
                this.isShowaddToask = false;
              } else {
                this.btnLoading = false;
                this.isShowaddToask = false;
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
                this.btnLoading = false;
              console.log(err);
            });
          this.isShowPermission = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 合并行(第几行开始合并，合并几行)
    mergeRow({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        for (let i = 0; i < this.spanData.length; i++) {
          if (rowIndex === this.spanData[i].startIndex) {
            return {
              rowspan: this.spanData[i].num,
              colspan: 1
            };
          }
        }
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    }
  }
};
</script>
<style lang="less">
.set-permission {
  .w-table {
    margin-top: 10px;
  }
  .block {
    float: right;
    margin: 10px 0 10px 0;
  }
  .add-module-inp {
    width: 215px;
  }
  .el-dialog__title {
    color: #ff6868;
  }
  .el-dialog__header {
    border-bottom: 1px solid #eee;
    padding: 20px 20px 10px 50px;
  }
  .el-form-item__error {
    margin-left: 75px;
  }
}
</style>


