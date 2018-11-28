<template>
    <div class="property-list">
        <v-breadcrumb :nav="['品牌产品管理','属性管理']"></v-breadcrumb>
        <el-card style="margin:10px 0 20px">
            <el-form ref="form" :inline="true" :model="form">
                <el-form-item prop="date" label="更新时间">
                    <el-date-picker v-model="form.date" type="datetimerange" format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item prop="code" label="属性编号" label-width="120">
                    <el-input style="width:200px" placeholder="请输入属性编号" v-model="form.code"></el-input>
                </el-form-item>
                <el-form-item prop="name" label="属性名称" label-width="120">
                    <el-input style="width:200px" placeholder="请输入属性名称" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item prop="type" label="属性类型" label-width="120">
                    <el-select v-model="form.type" placeholder="全部">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(v,k) in typeArr" :label="v.label" :value="v.value" :key="k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="valueType" label="属性值类型" label-width="120">
                    <el-select v-model="form.valueType" placeholder="全部">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(v,k) in valueTypeArr" :label="v.label" :value="v.value" :key="k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="status" label="状态" label-width="120">
                    <el-select v-model="form.status" placeholder="全部">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(v,k) in statusArr" :label="v.label" :value="v.value" :key="k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getList(1)" type="primary">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <div class="table-block">
            <el-button type="primary" style="margin-bottom: 20px" @click="addProperty">添加属性</el-button>
            <el-button type="success" style="margin-bottom: 20px" @click="deleteProperty">删除</el-button>
            <template>
                <el-table :data="tableData" v-loading="tableLoading" border style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column
                        type="selection"
                        width="55" align="center">
                    </el-table-column>
                    <el-table-column prop="code" label="编号" align="center"></el-table-column>
                    <el-table-column prop="name" label="属性名称" align="center"></el-table-column>
                    <el-table-column prop="remark" label="属性描述" align="center"></el-table-column>
                    <el-table-column prop="type" label="属性类型" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.type==1">自然属性</template>
                            <template v-if="scope.row.type==2">销售属性</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="valueType" label="属性值类型" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.valueType==1">文字</template>
                            <template v-if="scope.row.valueType==2">图片</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.status==0">启用</template>
                            <template v-if="scope.row.status==1">停用</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createAdmin" label="最近更新者" align="center"></el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" align="center">
                        <template slot-scope="scope">
                            {{scope.row.updateTime|formatDateAll}}
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="danger" size="small" @click="editProperty(scope.row.id)">编辑</el-button>
                            <el-button type="success" size="small" @click="openOrstop(scope.row.id,1)" v-if="scope.row.status==1">启用</el-button>
                            <el-button type="success" size="small" @click="openOrstop(scope.row.id,0)" v-else>停用</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.currentPage"
                        :page-size="page.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="page.totalPage">
                    </el-pagination>
                </div>
            </template>

        </div>

        <!--添加产品详细参数弹窗-->
        <el-dialog :title="title" :visible.sync="mask">
            <el-form :model="maskForm" :rules="rules" ref="maskForm" label-width="100px">
                <el-form-item prop="name" label="属性名称">
                    <el-input v-model="maskForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="type" label="属性类型">
                    <el-select v-model="maskForm.type" placeholder="全部">
                        <el-option v-for="(v,k) in typeArr" :label="v.label" :value="v.value" :key="k"></el-option>
                    </el-select>                </el-form-item>
                <el-form-item prop="valueType" label="属性值类型">
                    <el-select v-model="maskForm.valueType" placeholder="全部">
                        <el-option v-for="(v,k) in valueTypeArr" :label="v.label" :value="v.value" :key="k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="status" label="启用状态">
                    <el-radio-group v-model="maskForm.status" placeholder="全部">
                        <el-radio v-for="(v,k) in statusArr" :label="v.value" :key="k">{{v.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="remark" label="属性描述">
                    <el-input v-model="maskForm.remark" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item class="add-item">
                    <el-button type="danger" @click="addPropertyValue">添加属性值</el-button>
                    <el-table :data="maskForm.values" border>
                        <el-table-column label="属性值名称" align="center">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.value" placeholder="请输入属性值名称"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <span class="color-blue" @click="upOrDown(-1,scope.$index)" v-if="scope.$index!=0">上移</span>
                                <span class="color-blue" @click="upOrDown(1,scope.$index)" v-if="scope.$index!=maskForm.values.length-1">下移</span>
                                <span class="color-blue" @click="deleteData(scope.$index)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="addOrEdit('maskForm')">确 认</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!--删除弹窗-->
        <delete-toast :id='delId' :url='delUrl' :isProperty="true" :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import icon from '@/components/common/ico.vue';
import deleteToast from '@/components/common/DeleteToast';
import { myMixinTable } from '@/JS/commom';
import moment from 'moment';
import utils from '@/utils/index.js';
import request from '@/http/http.js';

export default {
    components: {
        vBreadcrumb,
        icon,
        deleteToast
    },
    mixins: [myMixinTable],
    data() {
        return {
            tableData: [],
            height: '',
            mask: false,
            isShowDelToast: false,
            form: {
                date: '',
                code: '',
                name: '',
                type: '',
                valueType: '',
                status: ''
            },
            title: '添加属性',
            id: '',
            itemId: '',
            itype: '',
            delId: '',
            delUrl: 'http://api',
            typeArr: [// 属性类型数组
                { label: '自然属性', value: 1 },
                { label: '销售属性', value: 2 }
            ],
            valueTypeArr: [// 属性值类型数组
                { label: '文字', value: 1 },
                { label: '图片', value: 2 }
            ],
            statusArr: [// 状态数组
                { label: '启用', value: 0 },
                { label: '停用', value: 1 }
            ],
            maskForm: { // 编辑编辑表单
                name: '',
                type: 1,
                valueType: 1,
                status: 1,
                values: []
            },
            rules: {
                name: [{ required: true, message: '请输入属性名称', trigger: 'blur' }],
                type: [{ required: true, message: '请选择属性类型', trigger: 'blur' }],
                valueType: [{ required: true, message: '请选择属性值类型', trigger: 'blur' }],
                status: [{ required: true, message: '请选择启用状态', trigger: 'blur' }]
            },
            multipleSelection: [],
            tableLoading: false,
            btnLoading: false

        };
    },
    created() {
    },
    activated() {
        this.id = this.$route.query.classifyId;
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取列表
        getList(val) {
            const data = {
                name: this.form.name,
                code: this.form.code,
                valueType: this.form.valueType,
                type: this.form.type,
                status: this.form.status,
                updateTimeBegin: this.form.date[0] ? moment(this.form.date[0]).format('YYYY-MM-DD') : '',
                updateTimeEnd: this.form.date[1] ? moment(this.form.date[1]).format('YYYY-MM-DD') : '',
                page: val,
                pageSize: this.page.pageSize
            };
            this.page.currentPage = val;
            this.tableLoading = true;
            request.queryCategoryProperty(data).then(res => {
                this.tableData = [];
                if (!res.data.data) return;
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
                this.tableLoading = false;
            }).catch(err => {
                this.tableLoading = false;
            });
        },
        // 删除
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((v, k) => {
                this.multipleSelection.push(v.id);
            });
        },
        deleteProperty() {
            if (!this.multipleSelection.length) {
                return this.$message.warning('请选择要删除的属性');
            }
            this.isShowDelToast = true;
            this.delId = this.multipleSelection;
            this.delUrl = 'deleteCategoryProperty';
        },
        // 删除弹窗
        deleteToast(msg) {
            this.isShowDelToast = msg;
            this.getList(this.page.currentPage);
        },
        addProperty() {
            this.itemId = '';
            this.title = '添加属性';
            utils.cleanFormData(this.maskForm);
            this.maskForm.status = 0;
            this.mask = true;
        },
        editProperty(id) {
            this.itemId = id;
            this.title = '编辑属性';
            this.mask = true;
        },
        // 添加确定
        addOrEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    return;
                } else {
                    if (!this.maskForm.values.length) {
                        return this.$message.warning('请添加属性值');
                    }
                    const data = this[formName];
                    if (this.itemId) data.id = this.itemId;
                    const tempArr = [];
                    this.maskForm.values.forEach((v, k) => {
                        const temp = {
                            value: v.value,
                            sort: k
                        };
                        tempArr.push(temp);
                    });
                    data.values = tempArr;
                    this.btnLoading = true;
                    request.saveCategoryProperty(data).then(res => {
                        this.$message.success(res.msg);
                        this.btnLoading = false;
                        this.mask = false;
                        this.getList(this.page.currentPage);
                    }).catch(err => {
                        this.btnLoading = false;
                    });
                }
            });
        },
        // 取消
        cancel() {
            this.mask = false;
        },
        // 添加属性值
        addPropertyValue() {
            const temp = {
                value: ''
            };
            this.maskForm.values.push(temp);
        },
        // 上移下移
        // num:-1上移 1下移
        upOrDown(num, index) {
            const _this = this.maskForm.values[index];
            const change = this.maskForm.values[index + num];
            this.maskForm.values[index] = change;
            this.maskForm.values[index + num] = _this;
            this.$set(this.maskForm.values, index, change);
            this.$set(this.maskForm.values, index + num, _this);
        },
        deleteData() {
            this.maskForm.values.splice(this.index, 1);
        },
        //   重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.getList(this.page.currentPage);
        },
        // 启用停用
        openOrstop(id, num) {
            const data = {
                id: id,
                status: num
            };
            request.updateCategoryPropertyStatus(data).then(res => {
                this.$message.success(res.msg);
                this.getList(this.page.currentPage);
            }).catch(err => {

            });
        }
    }
};
</script>

<style lang="less">
    .property-list {
        /*表格样式*/
        .table-block {
            padding: 20px 20px 60px;
            background: #fff;
        }
        img {
            width: 38px;
            height: 38px;
            border-radius: 5px;
            vertical-align: middle;
        }
        .block {
            float: right;
            margin-top: 10px;
        }

        /*弹窗样式*/
        .el-dialog {
            width: 530px;
            border-radius: 10px;
            .el-table{
                .el-input__inner{
                    width: 200px;
                }
                .color-blue{
                    cursor: pointer;
                    color: #33b4ff;
                }
            }
            .add-item{
                border: 1px solid #eee;
                padding: 10px;
                .el-button{
                    margin-bottom: 10px;
                }
                .el-form-item__content{
                    margin-left: 0 !important;
                }
            }
        }
        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px 50px;
        }
        .el-dialog__title {
            color: #ff6868;
        }
        .el-dialog .el-input {
            display: inline;
        }
        .el-dialog .el-input__inner {
            width: 360px;
        }
        .el-select .el-input__inner {
            width: 200px;
        }
        .icon-area .el-input__inner {
            width: 240px;
        }
        .el-input__suffix {
            line-height: 24px;
        }

        .el-dialog__footer {
            margin-right: 30px;
        }
    }
</style>
