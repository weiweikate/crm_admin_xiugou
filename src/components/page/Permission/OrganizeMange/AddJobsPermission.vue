<template>
    <div>
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <div class="add-box">
                <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                    <span class="add-box-title">基础信息</span>
                    <input type="hidden" v-model="form.privilegeInfo">
                    <el-form-item prop="name" label="岗位名称">
                        <el-input style="width:220px" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item prop="departmentId" label="所属部门">
                        <el-select v-model="form.departmentId" placeholder="请选择">
                            <el-option v-for="item in departmentList" :key="item.id + item.name" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <hr width='90%' size='1' color='#ccc' class='add-box-sep'>
                    <span class="add-box-title">权限设置</span>
                    <auth-list @message="addAuthData" :auth="auth" ref="auth"></auth-list>
                    <el-form-item class="sub-btn">
                        <el-button size="medium" type="primary" @click="submitForm('form')">提交</el-button>
                        <el-button size="medium" @click="goBack">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>


        </el-card>


    </div>
</template>
<script>
    import breadcrumb from '../../../common/Breadcrumb';
    import request from '@/http/http.js';
    import authList from '@/components/auth-list.vue';

    export default {
        components: {
            authList,
            breadcrumb
        },
        data() {
            return {
                auth: '',
                action: {},
                departmentList: [],
                nav: ['权限管理', '岗位权限管理', '添加岗位'],
                form: {
                    departmentId: '',
                    name: '',
                    privilegeInfo: ''
                },
                rules: {
                    name: { required: true, message: '岗位名称必填', trigger: 'blur' },
                    departmentId: {
                        required: true,
                        message: '请选择所属部门',
                        trigger: 'blur'
                    }
                }
            };
        },
        computed: {},
        mounted() {
            this.getDepartmentList();
            this.initAction();
        },
        methods: {
            initAction() {
                const id = this.$route.query.userId;
                // 修改
                if (id) {
                    request.findRoleById({ id: parseInt(id) }).then(res => {
                        console.log('findRoleById', res);
                        this.form = res.data || {};
                        this.auth = this.form.privilegeInfo;
                        console.log(this.auth);
                        this.$refs.auth.updateStatus(this.auth);
                    }).catch(err => {
                        console.log(err);
                    });
                    this.action = {
                        data: {
                            id: id
                        },
                        msg: '修改成功',
                        method: 'updateRole'
                    };
                } else {
                    this.action = {
                        data: {},
                        msg: '添加成功',
                        method: 'addRole'
                    };
                }
            },
            addAuthData(data) {
                this.form.privilegeInfo = data;
            },
            // 提交表单
            submitForm(formName) {
                const formData = this.form;
                const action = this.action;
                console.log(formData, action);
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        const data = Object.assign(formData, action.data);
                        request[action.method](data).then(res => {
                            this.$message.success(action.msg);
                            this.$router.go(-1);
                        }).catch(err => {
                            this.$message.warning(err.msg);
                            console.log(err);
                        });
                    } else {
                        return false;
                    }
                });
            },

            // 返回
            goBack() {
                this.$router.go(-1);
            },

            // 全选用户管理
            handleCheckAllChangeUser(val, k) {
                const tmp = [];
                this.userManList[k].value.forEach(function (v) {
                    v.value.forEach(function (val) {
                        tmp.push(val.id);
                    });
                });
                this.checkedUser[k] = val ? tmp : [];
            },
            handleCheckedUserChange(value, k) {
                const itemTmp = [];
                const checkedCount = value.length;
                this.userManList[k].value.forEach(function (v) {
                    v.value.forEach(function (val) {
                        itemTmp.push(val.value);
                    });
                });
                this.checkAllUser[k] = checkedCount == itemTmp.length;
                this.$set(this.checkAllUser, k, this.checkAllUser[k]);
            },
            // 获取部门列表
            getDepartmentList() {
                request.queryDepartmentList({}).then(res => {
                    this.departmentList = res.data || [];
                }).catch(err => {
                    this.$message.warning(err.msg);
                });
            }
        }
    };
</script>
<style lang="less">
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
            border-radius: 5px;
            line-height: 38px;
            padding: 0 10px 0 10px;
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
        .sub-btn {
            margin-top: 20px;
            padding-left: 30%;
            box-sizing: border-box;
        }
    }
</style>


