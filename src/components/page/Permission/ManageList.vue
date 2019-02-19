<template>
    <div>
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <el-form ref="form" @submit.native.prevent :model="form" inline label-width="100px">
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
                    <el-button native-type="submit" @click="getList(1)" type="primary">搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="con-card">
          <a href="#/addManger" target="_blank" v-auth="'quanxian.manageList.xjzh'" class="el-button el-button--primary el-button--small">新建管理员</a>
          <mr-flying parentClass="content-box">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    :page-size="page.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
          </mr-flying>
          <el-table v-loading="tableLoading" class="w-table" stripe :data="tableData" :height="height" border style="width: 100%">
              <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
              <el-table-column prop="name" label="管理员姓名" align="center"></el-table-column>
              <el-table-column prop="telephone" label="手机号" align="center"></el-table-column>
              <el-table-column prop="departmentName" label="部门" align="center"></el-table-column>
              <el-table-column prop="jobName" label="岗位" align="center"></el-table-column>
              <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                  <template v-if="scope.row.status == 2">关闭</template>
                  <template v-else-if="scope.row.status == 1">正常</template>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="500" align="center">
                <template slot-scope="scope">
                    <a :href="`#/editManger?id=${scope.row.id}`" target="_blank" v-auth="'quanxian.manageList.bjzh'" class="el-button el-button--primary el-button--mini">编辑</a>
                  <el-button v-if='scope.row.status == 1' size="mini" type="warning" @click="resetPwd(scope.row)" v-auth="'quanxian.manageList.mmcz'">密码重置</el-button>
                  <!-- <el-button size="mini" type="warning" @click="showLog(scope.row)">查看日志</el-button> -->
                  <el-button v-if='scope.row.status == 2' @click="deleteUser(scope.row)" size="mini" type="danger" v-auth="'quanxian.manageList.sczh'">账号删除</el-button>
                  <template >
                    <el-popover placement="top" width="160" v-model="scope.row.visible">
                      <p v-if='scope.row.status == 1'>确定关闭账号？</p>
                      <p v-if='scope.row.status == 2'>确定开启账号？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button slot="reference" :loading="closeBtn" v-if='scope.row.status == 1' size="mini" type="primary" @click='accountMange(scope.row,2)' >确定</el-button>
                        <el-button slot="reference" :loading="closeBtn" v-if='scope.row.status == 2' size="mini" type="primary" @click='accountMange(scope.row,1)' >确定</el-button>
                        <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                      </div>
                      <el-button v-auth="'quanxian.manageList.kqgb'" slot="reference" :loading="closeBtn" v-if='scope.row.status == 1' size="mini" type="danger" class="ml10">账号关闭</el-button>
                      <el-button v-auth="'quanxian.manageList.kqgb'" slot="reference" :loading="closeBtn" v-if='scope.row.status == 2' size="mini" type="danger" class="ml10">账号开启</el-button>
                    </el-popover>
                  </template>
                </template>
              </el-table-column>
          </el-table>
        </el-card>
        <el-dialog :visible.sync="isShowResetPwd" title="修改密码" width="30%">
            <el-form ref="pwdForm" :rules="rules" :model="pwdForm" inline label-width="100px">
              <el-form-item prop="password" label='密码重置'>
                <el-input v-model.trim="pwdForm.password"></el-input>
              </el-form-item>
              <el-form-item prop="checkPassword" label='确认密码'>
                <el-input v-model.trim="pwdForm.checkPassword"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="confirmReset('pwdForm')">确 定</el-button>
              <el-button @click="cancelReset('pwdForm')">取 消</el-button>
            </span>
        </el-dialog>
        <delete-toast :id='delId' :url='delUrl' :type='2' :status = '0' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>
</template>
<script>
import breadcrumb from '@/components/common/Breadcrumb';
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
        const validatePwd = (rule, value, callback) => {
            if (value === '' || value === null || value === undefined) {
                callback(new Error('请输入密码'));
            } else {
                if (this.pwdForm.checkPassword !== '') {
                    this.$refs.pwdForm.validateField('checkPassword');
                }
                callback();
            }
        };
        const validateCheckPwd = (rule, value, callback) => {
            if (value === '' || value === null || value === undefined) {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.pwdForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
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
                password: '',
                checkPassword: ''
            },
            tableLoading: false,
            tableData: [],
            height: '',
            rules: {
                password: [
                    { validator: validatePwd, trigger: 'blur' }
                ],
                checkPassword: [
                    { validator: validateCheckPwd, trigger: 'blur' }
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
            const data = {};
            data.page = val;
            data.pageSize = this.page.pageSize;
            data.name = this.form.name;
            data.telephone = this.form.phone;
            data.url = pApi.manageList;
            this.tableLoading = true;
            request.getMangerList(this.$utils.trimForm(data)).then(res => {
                this.tableData = [];
                res.data.data.forEach((v, k) => {
                    v.visible = false;
                    this.tableData.push(v);
                });
                this.page.totalPage = res.data.totalNum;
                this.page.currentPage = res.data.currentPage;
                this.tableLoading = false;
            }).catch(err => {
                console.log(err);
                this.tableLoading = false;
            });
        },

        //   重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.getList(1);
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
            this.pwdForm.password = '';
            this.pwdForm.checkPassword = '';
            this.pwdForm.id = row.id;
            this.isShowResetPwd = true;
        },
        confirmReset(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    request['resetPassword'](this.pwdForm)
                        .then(res => {
                            this.$message.success('密码重置成功');
                            this.$refs[formName].resetFields();
                            this.isShowResetPwd = false;
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
        // 取消重置
        cancelReset(formName) {
            this.isShowResetPwd = false;
            this.$refs[formName].resetFields();
        },
        // 删除用户
        deleteUser(row) {
            this.delId = row.id;
            this.delUrl = 'updateDeleteAdminUser';
            // this.delUri = pApi.deleteAdminUser;
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
            data.type = 1;
            // data.url = pApi.updateAdminUser[0];
            this.closeBtn = true;
            request['updateDeleteAdminUser'](data)
                .then(res => {
                    this.closeBtn = false;
                    this.$message.success(res.msg);
                    row.status = status;
                    row.visible = false;
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


