<template>
    <div class="add-manger">
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <div class="add-box">
                <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                    <span class="add-box-title">基础信息</span>
                    <el-form-item prop="name" label="姓名">
                        <el-input class="add-mange-inp" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item prop="telephone" label="手机号">
                        <el-input class="add-mange-inp" v-model="form.telephone"></el-input>
                    </el-form-item>
                    <div class="avatar">
                        <img v-if="form.face" :src="form.face">
                        <img v-else src="../../../assets/images/avatar.jpg" alt="">
                        <el-upload
                            :action="uploadImg"
                            :show-file-list="false"
                            :on-success="uploadAvatar">
                            <el-button type="primary">编辑头像</el-button>
                        </el-upload>
                        <div class="tip">请上传jpg，png格式</div>
                    </div>
                    <div class="clearfix"></div>
                    <hr width='90%' size='1' color='#ccc' class='add-box-sep'>
                    <span class="add-box-title">部门信息</span>
                    <el-form-item prop="deptmentId" label="所属部门">
                        <el-select v-model="form.deptmentId" @change="getJobList" placeholder="请选择">
                            <el-option v-for="item in departmentList" :key="item.id + item.name" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="jobId" label="所在岗位">
                        <el-select v-model="form.jobId" placeholder="请选择" @change="onJobChange">
                            <el-option v-for="item in jobList" :key="item.value" :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <!--<el-form-item prop="immediateSuperior" label="直接上级">
                        <el-input class="add-mange-inp" v-model="form.immediateSuperior"></el-input>
                    </el-form-item>-->
                    <input type="hidden" v-model="form.immediateSuperior">
                    <hr width='90%' size='1' color='#ccc' class='add-box-sep'>
                    <span class="add-box-title">权限信息</span>
                    <auth-list @message="addAuthData" :auth="auth" ref="auth"></auth-list>
                    <el-form-item>
                        <el-button type="primary" :loading="btnLoading" @click="submitForm('form')"
                                   style="margin-left:35%">提交
                        </el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>
    import breadcrumb from '../../common/Breadcrumb';
    import * as api from '@/api/api.js';
    import request from '@/http/http.js';
    import authList from '@/components/auth-list.vue';

    export default {
        components: {
            breadcrumb,
            authList
        },
        data() {
            return {
                auth: '',
                departmentList: [],
                nav: ['权限管理', '创建账号'],
                btnLoading: false,
                uploadImg: '',
                jobList: [],
                form: {
                    privilegeInfo: '',
                    name: '',
                    telephone: '',
                    deptmentId: '',
                    jobId: '',
                    immediateSuperior: 1,
                    face: ''
                },
                rules: {
                    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                    telephone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
                    deptmentId: [{ required: true, message: '请输入所属部门', trigger: 'blur' }],
                    jobId: [{ required: true, message: '请输入所在岗位', trigger: 'blur' }],
                    immediateSuperior: [{ required: true, message: '请输入直接上级ID', trigger: 'blur' }]
                }
            };
        },
        mounted() {
            this.uploadImg = api.uploadImg;
            this.getDepartmentList();
            this.initAction();
        },
        methods: {
            initAction() {
                const id = this.$route.query.id;
                // 修改
                if (id) {
                    request.findAdminUserbyId({ id: id }).then(res => {
                        console.log('findAdminUserbyId', res);
                        let data = res.data || {};
                        this.form = {
                            id: data.id,
                            privilegeInfo: data.privilegeInfo,
                            name: data.name,
                            telephone: data.telephone,
                            deptmentId: data.deptmentId,
                            jobId: data.jobId,
                            immediateSuperior: 1,
                            face: data.face
                        };
                        this.auth = data.privilegeInfo;
                        this.$refs.auth.updateStatus(this.auth);
                        this.getJobList(data.deptmentId);
                    }).catch(err => {
                        console.log(err);
                    });
                    this.action = {
                        data: {
                            id: id
                        },
                        msg: '修改成功',
                        method: 'updateAdminUser'
                    };
                } else {
                    this.action = {
                        data: {},
                        msg: '添加成功',
                        method: 'addManger'
                    };
                }
            },
            onJobChange(val) {
                request.findRoleById({ id: val }).then(res => {
                    console.log('findRoleById', res);
                    let data = res.data || {};
                    this.auth = data.privilegeInfo;
                    console.log(this.auth);
                    this.$refs.auth.updateStatus(this.auth);
                }).catch(err => {
                    console.log(err);
                });
            },
            addAuthData(data) {
                this.form.privilegeInfo = data;
            },
            // 提交表单
            submitForm(formName) {
                let action = this.action;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = {};
                        const reg = /^\d{11}$/;
                        if (!reg.test(this.form.telephone)) {
                            this.$message.warning('请输入正确的手机号！');
                            return;
                        }
                        data = this.form;
                        this.btnLoading = true;
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                data.type = 1;
                                request[action.method](data).then(res => {
                                    this.btnLoading = false;
                                    this.$message.success(action.msg);
                                    this.$router.go(-1);
                                }).catch(err => {
                                    this.btnLoading = false;
                                    this.$message.warning(err);
                                    /*console.log(err);
                                    this.$message.warning(err.msg);*/
                                });
                            } else {
                                console.log('error submit!!');
                                return false;
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            // 上传图片
            uploadAvatar(res) {
                this.form.face = res.data;
                this.$set(this.form, 'face', res.data);
            },
            // 获取部门列表
            getDepartmentList() {
                request.queryDepartmentList({}).then(res => {
                    this.departmentList = res.data || [];
                }).catch(err => {
                    this.$message.warning(err.msg);
                });
            },
            // 获取岗位列表
            getJobList(val) {
                this.jobList = [];
                request.queryJobList({ id: val }).then(res => {
                    if (res.data.length !== 0) {
                        res.data.forEach((v, k) => {
                            this.jobList.push({ label: v.name, value: v.id });
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };
</script>
<style lang="less">
    .add-manger {
        .add-box {
            position: relative;
            width: 100%;
            height: 100%;
            padding: 30px;
            box-sizing: border-box;
            .add-mange-inp {
                width: 217px;
            }
            .add-box-title {
                display: block;
                margin: 0px 0px 20px 10px;
            }
            .add-box-sep {
                margin-bottom: 20px;
            }
            .el-collapse {
                width: 90%;
                border: 1px solid #ccc;
                padding: 3px;
                box-sizing: border-box;
                border-radius: 5px;
                margin-bottom: 10px;
                .el-collapse-item__header,
                .el-collapse-item__wrap {
                    border: none;
                }
                .el-collapse-item__content {
                    padding-bottom: 0;
                }
            }
            .collapse-tit .el-checkbox__label {
                font-size: 18px;
            }
            .collapse-item {
                float: left;
                width: 90%;
                height: auto;
                border: 1px solid #ccc;
                border-radius: 10px;
                line-height: 38px;
                padding: 0 20px 0 20px;
                box-sizing: border-box;
            }
            .collapse-title {
                float: left;
                height: 38px;
                line-height: 38px;
                margin: 0px 10px 0px 20px;
                font-size: 14px;
            }
            .el-checkbox {
                margin-left: 20px;
            }
            .avatar {
                z-index: 100;
                position: absolute;
                right: 1%;
                top: 3%;
                width: 150px;
                height: 150px;
                text-align: center;
                img {
                    width: 100px;
                    height: 100px;
                    border-radius: 10px;
                    border: 2px solid #dfdfdf;
                    margin-bottom: 10px;
                }
            }
            .clearfix {
                clear: both;
            }
            .el-upload {
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            .el-upload:hover {
                border-color: #409eff;
            }
            .el-upload--text {
                width: 80px;
                height: 32px;
                border: none;
            }
            .tip {
                font-size: 12px;
                color: #999;
            }
            .submit-btn {
                width: 100%;
                text-align: right;
            }
        }
    }
</style>


