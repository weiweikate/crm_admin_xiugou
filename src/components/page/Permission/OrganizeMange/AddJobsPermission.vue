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
                    <auth-list @message="addAuthData"></auth-list>
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
                authList: [
                    {
                        title: '系统首页',
                        name: 'dasnboard',
                        children: [
                            {
                                title: '数据类模块',
                                name: 'dashboard.data',
                                children: []
                            },
                            {
                                title: '快捷操作模块',
                                name: 'dashboard.data',
                                children: [
                                    {
                                        title: '发布产品',
                                        name: 'dashboard.shortcut.fbcp'
                                    },
                                    {
                                        title: '发布礼包',
                                        name: 'dashboard.shortcut.fblb'
                                    },
                                    {
                                        title: '会员邀请',
                                        name: 'dashboard.shortcut.hyyq'
                                    },
                                    {
                                        title: '实名认证查看',
                                        name: 'dashboard.shortcut.smrzck'
                                    },
                                    {
                                        title: '防伪码查询',
                                        name: 'dashboard.shortcut.fwmcx'
                                    },
                                    {
                                        title: '推荐位管理',
                                        name: 'dashboard.shortcut.tjwgl'
                                    },
                                    {
                                        title: '创建管理员账号',
                                        name: 'dashboard.shortcut.cjglyzh'
                                    },
                                    {
                                        title: '会员搜索',
                                        name: 'dashboard.shortcut.hyss'
                                    },
                                    {
                                        title: '添加供应商',
                                        name: 'dashboard.shortcut.tjgys'
                                    },
                                    {
                                        title: '广告位管理',
                                        name: 'dashboard.shortcut.ggwgl'
                                    },
                                    {
                                        title: '敏感词库管理',
                                        name: 'dashboard.shortcut.mgckgl'
                                    },
                                    {
                                        title: '账户充值',
                                        name: 'dashboard.shortcut.zhcz'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: '会员管理',
                        name: 'vip',
                        children: {
                            title: '会员层级管理',
                            name: 'levelManage',
                            children: [
                                {
                                    title: '晋升设置',
                                    name: 'vip.levelManage.jssz'
                                },
                                {
                                    title: '降级设置',
                                    name: 'vip.levelManage.jjsz'
                                },
                                {
                                    title: '编辑',
                                    name: 'vip.levelManage.bj'
                                },
                                {
                                    title: '层级信息',
                                    name: 'vip.levelManage.cjxx'
                                }]
                        }
                    }
                ],
                departmentList: [],
                nav: ['权限管理', '岗位权限管理', '添加岗位'],
                form: {
                    departmentId: '',
                    name: '',
                    privilegeInfo: '{}'
                },
                rules: {
                    name: { required: true, message: '岗位名称必填', trigger: 'blur' },
                    departmentId: {
                        required: true,
                        message: '请选择所属部门',
                        trigger: 'blur'
                    }
                },

                headColor: ['#1c71fb', '#f7aa47', '#00c182', '#ff6769', '#917ee6', '#2cb2eb'], // 待选颜色
                jobList: [],
                selectPeople: [], // 存储被选择的人员
                isOpenItem: [], // 控制每级面板的打开与折叠
                isSelectAll: []// 控制每级面板的选中状态
            };
        },
        computed: {
            action() {
                const id = this.$route.params.id;
                // 修改
                if (id) {
                    request.findRoleById({ id }).then(res => {
                        console.log(res);
                        this.form = res.data || {};
                    }).catch(err => {

                    });
                    return {
                        data: {
                            id: id
                        },
                        method: 'updateRole'
                    };
                } else {
                    return {
                        data: {},
                        method: 'addRole'
                    };
                }
            }
        },
        mounted() {
            console.log('mounted addJobsPermission');
        },
        activated() {
            console.log('activated addJobsPermission');
            this.getDepartmentList();
            this.initData();
            // this.getRoleList();
        },
        methods: {
            addAuthData(data){
                console.log('addAuthData',data)
                this.form.privilegeInfo = data.join(',');
            },
            initData() { // 数据初始化
                // 设置头像背景颜色
                const len = this.jobList.length;
                for (let i = 0; i < len; i++) {
                    this.setHeadColor(this.jobList[i].member, this.headColor);
                    // 根据数据初始化全选按钮状态
                    this.isSelectAll.push([]);
                    this.$set(this.isSelectAll[i], 'group', false);
                    this.$set(this.isSelectAll[i], 'child', []);
                    // 根据数据初始化折叠面板折叠状态
                    this.isOpenItem.push([]);
                    this.$set(this.isOpenItem[i], 'group', false);
                    this.$set(this.isOpenItem[i], 'child', []);
                    // 设置第二层级的状态
                    for (const j in this.jobList[i].son) {
                        this.isSelectAll[i].child.push(false);
                        this.isOpenItem[i].child.push(false);
                        this.setHeadColor(this.jobList[i].son[j].member, this.headColor);
                    }
                }
            },
            // 提交表单
            submitForm(formName) {
                const formData = this.form;
                const action = this.action;
                console.log(formData);
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        const data = Object.assign(formData, action.data);
                        request[action.method](data).then(res => {
                            console.log(res);
                        }).catch(err => {
                            console.log(err);
                        });
                    } else {
                        console.log('error submit!!');
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
                this.userManList[k].value.forEach(function(v) {
                    v.value.forEach(function(val) {
                        tmp.push(val.id);
                    });
                });
                this.checkedUser[k] = val ? tmp : [];
            },
            handleCheckedUserChange(value, k) {
                const itemTmp = [];
                const checkedCount = value.length;
                this.userManList[k].value.forEach(function(v) {
                    v.value.forEach(function(val) {
                        itemTmp.push(val.value);
                    });
                });
                this.checkAllUser[k] = checkedCount == itemTmp.length;
                this.$set(this.checkAllUser, k, this.checkAllUser[k]);
            },

            // 获取权限列表
            getRoleList() {
                const data = {};
                /* this.$axios
                    .post(api.getRoleList, data)
                    .then(res => {
                        this.userManList = res.data.data;
                    })
                    .catch(err => {
                        console.log(err);
                    });*/
            },
            // 获取部门列表
            getDepartmentList() {
                this.department = [];
                request.queryDepartmentList({}).then(res => {
                    this.departmentList = res.data || [];
                    console.log(111, res);
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


