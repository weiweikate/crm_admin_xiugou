<template>
    <div class="organize-mange">
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <el-button @click="operateDepartment('add')" type="primary" class='add'>添加部门
            </el-button>
            <el-table border :data="tableData">
                <el-table-column prop="id" label="部门编号" align="center" min-width="150"></el-table-column>
                <el-table-column prop="name" label="部门名称" align="center" min-width="150"></el-table-column>
                <el-table-column prop="manager" label="负责人" align="center" min-width="150"></el-table-column>
                <el-table-column label="操作" align="center" min-width="250">
                    <template slot-scope="scope">
                        <el-button @click="operateDepartment('edit',scope.row)"
                                   type="primary">编辑
                        </el-button>
                        <el-button @click="redirect2Permisson(scope.row)"
                                   type="success">岗位管理
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog :title="dialogTitle" :visible.sync="isShowDialog" width="30%">
            <div style="width:100%">
                <el-form :model="diaForm" ref="diaForm" :rules="rules" label-width='90px' inline label-position='right'
                         style="width:300px;margin:0 auto">
                    <el-form-item prop="name" label="部门名称">
                        <el-input v-model="diaForm.name"></el-input>
                    </el-form-item>
                    <el-form-item prop="manager" label="部门负责人">
                        <el-input v-model="diaForm.manager"></el-input>
                    </el-form-item>
                    <el-form-item prop="remark" label="备注说明">
                        <el-input type="textarea" autosize v-model="diaForm.remark"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer">
                <el-button @click="confirmForm('diaForm')" type="primary">确 定</el-button>
                <el-button @click="resetForm('diaForm')">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import breadcrumb from '../../../common/Breadcrumb';
    import utils from '../../../../utils/index.js';
    import request from '@/http/http.js';

    export default {
        components: {
            breadcrumb
        },
        data() {
            return {
                nav: ['权限管理', '组织结构管理'],
                isShowDialog: false,
                dialogTitle: '',
                diaForm: {
                    name: '',
                    manager: '',
                    remark: ''
                },
                formType: 'add',
                departId: '',
                rules: {
                    departmentName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
                },
                tableData: []
            };
        },
        activated() {
            this.getList();
        },
        methods: {
            // 获取数据
            getList() {
                let data = {};
                request.queryDepartmentList(data)
                    .then(res => {
                        this.tableData = res.data;
                    })
                    .catch(err => {
                        this.$message.warning(err.msg);
                    });
            },

            // 添加/编辑部门
            operateDepartment(type, row) {
                this.formType = type;
                utils.cleanFormData(this.diaForm);
                if (type === 'add') {
                    this.dialogTitle = '添加部门';
                } else {
                    this.dialogTitle = '编辑部门';
                    this.departId = row.id;
                    Object.assign(this.diaForm, row);
                }
                this.isShowDialog = true;
            },
            confirmForm(formName) {
                this.$refs[formName].validate((valid) => {
                    let formData = this.diaForm;
                    let method = 'addRole';
                    if (valid) {
                        let data = {
                            name: formData.name,
                            manager: formData.manager,
                            remark: formData.remark
                        };
                        if (this.formType === 'add') {
                            method = 'addDepartment';
                        } else {
                            data.id = this.departId;
                            method = 'updateDepartment';
                        }
                        request[method](data)
                            .then(() => {
                                this.$message.success('保存成功');
                                this.resetForm(formName);
                                this.getList();
                            })
                            .catch(err => {
                                this.resetForm(formName);
                            });
                    } else {
                        return false;
                    }
                });
            },
            // 重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.isShowDialog = false;
            },
            // 跳转岗位权限
            redirect2Permisson(row) {
                this.$router.push({ name: 'jobsPermissionMange', query: { id: row.id } });
            }
        }
    };
</script>
<style lang='less'>
    .organize-mange {
        .el-dialog {
            border-radius: 10px;
        }
        .el-dialog__header {
            border-bottom: 1px solid #ff6868;
            .el-dialog__title {
                color: #ff6868;
            }
        }
        .add {
            margin-bottom: 10px;
        }
        .block {
            margin: 10px 0;
            float: right;
        }
    }
</style>


