<template>
    <div>
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <el-form ref="form" :model="form" inline label-width="100px">
              <!-- <el-form-item prop="id" label="ID">
                <el-input v-model="form.id"></el-input>
              </el-form-item> -->
              <el-form-item prop="name" label="管理员姓名">
                <el-input v-model.trim="form.name"></el-input>
              </el-form-item>
              <el-form-item prop="phone" label="手机号">
                <el-input v-model.trim="form.phone"></el-input>
              </el-form-item>
                <el-form-item label=" ">
                    <el-button @click="getList(1)" type="primary">搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="con-card">
          <el-button type="primary" @click="addManger">新建管理员</el-button>
          <el-table v-loading="tableLoading" class="w-table" stripe :data="tableData" :height="height" border style="width: 100%">
              <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
              <el-table-column prop="name" label="管理员姓名" align="center"></el-table-column>
              <el-table-column prop="telephone" label="手机号" align="center"></el-table-column>
              <el-table-column prop="deptmentName" label="部门" align="center"></el-table-column>
              <el-table-column prop="jobName" label="岗位" align="center"></el-table-column>
              <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                  <template v-if="scope.row.status == 0">关闭</template>
                  <template v-else-if="scope.row.status == 1">正常</template>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="400" align="center">
                <template slot-scope="scope">
                  <el-button  size="mini" type="primary" @click="editManger(scope.row)">编辑</el-button>
                  <!--<el-button v-if='scope.row.status == 1' size="mini" type="warning" @click="resetPwd(scope.row)">密码重置</el-button>-->
                  <!--<el-button size="mini" type="warning" @click="showLog(scope.row)">查看日志</el-button>-->
                  <!--<el-button v-if='scope.row.status == 0' @click="deleteUser(scope.row)" size="mini" type="danger"  >账号删除</el-button>-->
                  <!--<template >-->
                    <!--<el-popover placement="top" width="160" v-model="scope.row.visible">-->
                      <!--<p v-if='scope.row.status == 1'>确定关闭账号？</p>-->
                      <!--<p v-if='scope.row.status == 0'>确定开启账号？</p>-->
                      <!--<div style="text-align: right; margin: 0">-->
                        <!--<el-button slot="reference" :loading="closeBtn" v-if='scope.row.status == 1' size="mini" type="primary" @click='accountMange(scope.row,0)' >确定</el-button>-->
                        <!--<el-button slot="reference" :loading="closeBtn" v-if='scope.row.status == 0' size="mini" type="primary" @click='accountMange(scope.row,1)' >确定</el-button>-->
                        <!--<el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>-->
                      <!--</div>-->
                      <!--<el-button slot="reference" :loading="closeBtn" v-if='scope.row.status == 1' size="mini" type="danger" >账号关闭</el-button>-->
                      <!--<el-button slot="reference" :loading="closeBtn" v-if='scope.row.status == 0' size="mini" type="danger">账号开启</el-button>-->
                    <!--</el-popover>-->
                  <!--</template>-->
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
        <el-dialog :visible.sync="isShowResetPwd" width="20%">
            <el-form ref="pwdForm" :rules="rules" :model="pwdForm" inline label-width="100px">
              <el-form-item prop="password" label='密码重置'>
                <el-input v-model.trim="pwdForm.password"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="confirmReset('pwdForm')">确 定</el-button>
              <el-button @click="isShowResetPwd = false">取 消</el-button>
            </span>
        </el-dialog>
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>
</template>
<script>
import breadcrumb from '@/components/common/Breadcrumb';
import * as api from '@/api/api.js';
import deleteToast from '@/components/common/DeleteToast';
import * as pApi from '@/privilegeList/index.js';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http';
export default {
    components: {
        breadcrumb, deleteToast
    },
    mixins: [myMixinTable],
    data() {
        return {
            nav: ['权限管理', '管理员账号管理'],
            isShowResetPwd: false,
            isShowDelToast: false,
            closeBtn: false,
            delId: -1,
            delUrl: 'api',
            delUri: '',
            form: {
                name: '',
                phone: ''
            },
            pwdForm: {
                id: '',
                phone: '',
                password: ''
            },
            tableLoading: false,
            tableData: [],
            height: '',
            rules: {
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        };
    },
    created() {
        const winHeight = window.screen.availHeight - 500;
        this.height = winHeight;
    },
    activated() {
        this.getList(this.page.currentPage);
    },
    methods: {
        //  获取数据
        getList(val) {
            const that = this;
            const data = {};
            data.page = val;
            data.name = this.form.name;
            data.phone = this.form.phone;
            data.url = pApi.manageList;
            this.tableLoading = true;
            request.getMangerList(data).then(res => {
                that.tableData = [];
                res.data.data.forEach((v, k) => {
                    v.visible = false;
                    that.tableData.push(v);
                });
                that.page.totalPage = res.data.totalNum;
                that.page.currentPage = res.data.currentPage;
                that.tableLoading = false;
            }).catch(err => {
                console.log(err);
                that.tableLoading = false;
            });
        },

        //   重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        // 新建管理员
        addManger() {
            this.$router.push('/addManger');
        },

        // 编辑管理员
        editManger(row) {
            sessionStorage.setItem('editManger', row.id);
            this.$router.push({ name: 'editManger', query: { id: row.id }});
        },

        // 查看操作日志
        showLog(row) {
            sessionStorage.setItem('showMangeLogTmp', row.id);
            this.$router.push({ name: 'showMangeLog', params: { userId: row.id }});
        },

        // 密码重置
        resetPwd(row) {
            this.pwdForm = {};
            this.pwdForm.id = row.id;
            this.pwdForm.url = pApi.resetPassword;
            this.isShowResetPwd = true;
        },
        confirmReset(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios.post(api.resetPassword, this.pwdForm)
                        .then(res => {
                            if (res.data.code == 200) {
                                this.$message.success(res.data.data);
                                this.isShowResetPwd = false;
                            } else {
                                this.$message.warning(res.data.msg);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        // 删除用户
        deleteUser(row) {
            this.delId = row.id;
            this.delUrl = api.deleteAdminUser;
            this.delUri = pApi.deleteAdminUser;
            this.isShowDelToast = true;
        },
        deleteToast(msg) {
            this.isShowDelToast = msg;
            this.getList(this.page.currentPage);
        },

        // 账号开启/关闭
        accountMange(row, status) {
            const data = {};
            data.id = row.id;
            data.status = status;
            data.url = pApi.updateAdminUserStatus;
            this.closeBtn = true;
            this.$axios.post(api.updateAdminUserStatus, data)
                .then(res => {
                    this.closeBtn = false;
                    if (res.data.code == 200) {
                        this.$message.success(res.data.data);
                        row.status = status;
                        row.visible = false;
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                })
                .catch(err => {
                    this.closeBtn = false;
                    console.log(err);
                });
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
.roots-inp {
  width: 215px;
}
</style>


