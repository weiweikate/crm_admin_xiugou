<template>
    <div>
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <div class="add-box">
                <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                    <span class="add-box-title">基础信息</span>
                    <el-form-item prop="name" label="岗位名称">
                        <el-input style="width:220px" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="auth">
                        <el-input style="width:220px" v-model="form.privilegeInfo"></el-input>
                    </el-form-item>
                    <el-form-item prop="departmentId" label="所属部门">
                        <el-select v-model="form.departmentId" placeholder="请选择">
                            <el-option v-for="item in departmentList" :key="item.id + item.name" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <hr width='90%' size='1' color='#ccc' class='add-box-sep'>
                    <span class="add-box-title">权限设置</span>

                    <el-form-item class="sub-btn">
                        <el-button size="medium" type="primary" @click="submitForm('form')">提交</el-button>
                        <el-button size="medium" @click="goBack">取消</el-button>
                    </el-form-item>


                </el-form>
            </div>

            <auth-list :source="authList"></auth-list>
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
                        title:'首页',
                        name: '首页',
                        children: [{
                            name: '模块1',
                            title:'模块1'
                        }, {
                            name: '模块2',
                            title:'模块2',
                        }]
                    },
                    {
                        name: '会员管理',
                        title:'会员管理',
                        children: [{
                            name: '会员1',
                            title:'会员1',
                            children: [
                                {
                                    title:'查看',
                                    name: '查看'
                                },
                                {
                                    title:'删除',
                                    name: '删除'
                                },
                                {
                                    title:'查看1',
                                    name: '查看1'
                                },
                                {
                                    title:'删除2',
                                    name: '删除2'
                                },
                                {
                                    title:'查看3',
                                    name: '查看3'
                                },
                                {
                                    title:'删除4',
                                    name: '删除4'
                                }
                            ]
                        }, {
                            title:'会员2',
                            name: '会员2',
                            children: [
                                {
                                    title:'天剑',
                                    name: '天剑'
                                },
                                {
                                    title:'首页11',
                                    name: 'sadsd'
                                }
                            ]
                        }]
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

                headColor: ['#1c71fb', '#f7aa47', '#00c182', '#ff6769', '#917ee6', '#2cb2eb'],//待选颜色
                jobList: [],
                selectPeople: [],//存储被选择的人员
                isOpenItem: [],//控制每级面板的打开与折叠
                isSelectAll: [],//控制每级面板的选中状态
            };
        },
        computed: {
            action() {
                let id = this.$route.params.id;
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
            //this.getRoleList();
        },
        methods: {
            checkItem(index) {//展开或折叠面板
                this.$set(this.isOpenItem[index], 'group', !this.isOpenItem[index].group);
            },
            checkSecondItem(firstIndex, secondIndex) {//展开或折叠第二层面板
                this.$set(this.isOpenItem[firstIndex].child, secondIndex, !this.isOpenItem[firstIndex].child[secondIndex]);
            },
            checkAll(index) {//第一层级的全选操作
                this.$set(this.isSelectAll[index], 'group', !this.isSelectAll[index].group);//改变当前按钮的选中状态
                if (!this.jobList[index].member && !this.jobList[index].son) {
                    return;
                }
                if (!this.isSelectAll[index].group) {// 从全选 =》 全不选
                    for (let key in this.isSelectAll[index].child) { // 移除所有第二层级子项的选中状态
                        this.$set(this.isSelectAll[index].child, key, false);
                    }
                    for (let i = 0, len = this.selectPeople.length; i < len; i++) {
                        if (!this.selectPeople[i]) { //删除干净了
                            return;
                        }
                        for (let k in this.jobList[index].son) {//循环删除有部门的人员（对应列表第三层级）
                            for (let j in this.jobList[index].son[k].member) {
                                if (this.selectPeople[i] && this.selectPeople[i].pid == this.jobList[index].son[k].member[j].pid) {
                                    this.selectPeople.splice(i, 1);
                                    i--;
                                    break;
                                }
                            }
                        }
                        for (let j in this.jobList[index].member) {//循环删除没有部门的人员（对应列表第二层级）
                            if (this.selectPeople[i] && this.selectPeople[i].pid == this.jobList[index].member[j].pid) {
                                this.selectPeople.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                    }
                } else {// 从全不选 =》 全选
                    for (let key in this.isSelectAll[index].child) { // 给所有第二层级子项添加选中状态
                        this.$set(this.isSelectAll[index].child, key, true);
                    }
                    for (let i in this.jobList[index].member) {//循环添加没有部门的人员（对应列表第二层级）
                        if (this.selectPeople.includes(this.jobList[index].member[i])) { //如果已经存在，就不用再进行添加
                            continue;
                        }
                        this.selectPeople.push(this.jobList[index].member[i]);
                    }
                    for (let i in this.jobList[index].son) {//循环添加有部门的人员（对应列表第三层级）
                        for (let j in this.jobList[index].son[i].member) {
                            if (this.selectPeople.includes(this.jobList[index].son[i].member[j])) { //如果已经存在，就不用再进行添加
                                continue;
                            }
                            this.selectPeople.push(this.jobList[index].son[i].member[j]);
                        }
                    }
                }
            },
            checkSecondAll(index, secondIndex) {//第二层级的全选操作
                this.$set(this.isSelectAll[index].child, secondIndex, !this.isSelectAll[index].child[secondIndex]);//改变当前按钮的选中状态
                let members = this.jobList[index].son[secondIndex].member;//当前选项的所有成员
                if (!members) {
                    return;
                }
                if (!this.isSelectAll[index].child[secondIndex]) {// 从全选 =》 全不选
                    this.$set(this.isSelectAll[index], 'group', false);//改变顶级按钮的选中状态为非选中状态
                    for (let i = 0, len = this.selectPeople.length; i < len; i++) {
                        if (!this.selectPeople[i]) { //删除干净了
                            return;
                        }
                        for (let j in members) {//循环删除当前部门的所有人员（对应列表第三层级）
                            if (this.selectPeople[i].pid == members[j].pid) {
                                this.selectPeople.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                    }
                } else {// 从全不选 =》 全选
                    for (let j in members) {//循环添加当前部门的所有人员（对应列表第三层级）
                        if (this.selectPeople.includes(members[j])) { //如果已经存在，就不用再进行添加
                            continue;
                        }
                        this.selectPeople.push(members[j]);
                    }
                    this.setFirstLevelChecked(index);
                }
            },
            setHeadColor(data, headColor) {//设置头像背景颜色
                let length = headColor.length;
                for (let i in data) {
                    //添加headColor属性
                    this.$set(data[i], 'headColor', headColor[Math.floor(Math.random() * length)]);
                }
            },
            stateChanged(index, i, j) {
                if (j !== undefined) { //如果有j值，代表第三层级数据
                    if (this.selectPeople.includes(this.jobList[index].son[i].member[j])) {//点击之前为选中状态
                        this.$set(this.isSelectAll[index].child, i, false);//改变父级按钮的选中状态为非选中状态
                        this.$set(this.isSelectAll[index], 'group', false);//改变顶级按钮的选中状态为非选中状态
                    } else {//点击之前为非选中状态
                        //给父级添加选中状态
                        for (let k = 0; k < this.jobList[index].son[i].member.length; k++) {
                            if (!this.selectPeople.includes(this.jobList[index].son[i].member[k]) && this.jobList[index].son[i].member[k] != this.jobList[index].son[i].member[j]) {//只要有其中一个未选中，就跳出循环，不给父级添加选中状态
                                return false;
                            }
                        }
                        this.$set(this.isSelectAll[index].child, i, true);//改变父级按钮的选中状态为选中状态
                        this.setFirstLevelChecked(index, this.jobList[index].son[i].member[j]);//给第一级添加选中状态
                    }
                } else {//没有j值，第二层级数据
                    if (this.selectPeople.includes(this.jobList[index].member[i])) {//点击之前为选中状态
                        this.$set(this.isSelectAll[index], 'group', false);//改变父级按钮的选中状态为非选中状态
                    } else {//点击之前为非选中状态
                        this.setFirstLevelChecked(index, this.jobList[index].member[i]);//给第一级添加选中状态
                    }
                }
            },
            setFirstLevelChecked(index, data) {//给第一级添加选中状态
                for (let k in this.jobList[index].member) {
                    if (!this.selectPeople.includes(this.jobList[index].member[k]) && data != this.jobList[index].member[k]) {//只要有其中一个未选中，就跳出循环，不给父级添加选中状态
                        return false;
                    }
                }
                for (let i in this.jobList[index].son) {//循环添加有部门的人员（对应列表第三层级）
                    for (let j in this.jobList[index].son[i].member) {
                        if (!this.selectPeople.includes(this.jobList[index].son[i].member[j]) && data != this.jobList[index].son[i].member[j]) { //如果已经存在，就不用再进行添加
                            return false;
                        }
                    }
                }
                this.$set(this.isSelectAll[index], 'group', true);//改变第一级按钮的选中状态为选中状态
            },
            initData() {//数据初始化
                //设置头像背景颜色
                let len = this.jobList.length;
                for (let i = 0; i < len; i++) {
                    this.setHeadColor(this.jobList[i].member, this.headColor);
                    //根据数据初始化全选按钮状态
                    this.isSelectAll.push([]);
                    this.$set(this.isSelectAll[i], 'group', false);
                    this.$set(this.isSelectAll[i], 'child', []);
                    //根据数据初始化折叠面板折叠状态
                    this.isOpenItem.push([]);
                    this.$set(this.isOpenItem[i], 'group', false);
                    this.$set(this.isOpenItem[i], 'child', []);
                    //设置第二层级的状态
                    for (let j in this.jobList[i].son) {
                        this.isSelectAll[i].child.push(false);
                        this.isOpenItem[i].child.push(false);
                        this.setHeadColor(this.jobList[i].son[j].member, this.headColor);
                    }
                }
            },
            // 提交表单
            submitForm(formName) {
                let formData = this.form;
                let action = this.action;
                console.log(formData);
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let data = Object.assign(formData, action.data);
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
                let tmp = [];
                this.userManList[k].value.forEach(function (v) {
                    v.value.forEach(function (val) {
                        tmp.push(val.id);
                    });
                });
                this.checkedUser[k] = val ? tmp : [];
            },
            handleCheckedUserChange(value, k) {
                let itemTmp = [];
                let checkedCount = value.length;
                this.userManList[k].value.forEach(function (v) {
                    v.value.forEach(function (val) {
                        itemTmp.push(val.value);
                    });
                });
                this.checkAllUser[k] = checkedCount == itemTmp.length;
                this.$set(this.checkAllUser, k, this.checkAllUser[k]);
            },

            // 获取权限列表
            getRoleList() {
                let data = {};
                /*this.$axios
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
            },
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


