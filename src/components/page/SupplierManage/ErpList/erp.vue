<template>
    <div class="recruit-shop-man">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }">
            <el-form :model="form" ref="form" inline label-width="100px">
                <el-form-item prop="date" label="更新时间">
                    <el-date-picker v-model="form.date" type="datetimerange" format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="name" label="ERP名称">
                    <el-input v-model="form.name" placeholder=""></el-input>
                </el-form-item>
                <el-form-item prop="name" label="ERP编号">
                    <el-input v-model="form.code" placeholder=""></el-input>
                </el-form-item>
                <el-form-item prop="closeReason" label="状态">
                    <el-select v-model="form.status" placeholder="请选择">
                        <el-option v-for="(v,k) in statusList" :label="v.title" :value="v.value" :key="v.value">
                            {{v.title}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click='getList(1)'>搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card :body-style="{ padding: '20px 40px',}" style="margin-top:20px">
            <el-button @click="gotoAddModal" type="success" style="margin-bottom: 10px;" v-auth="'supplier.erp.tj'">添加ERP</el-button>
            <el-table :data="tableData" border :height="height" v-loading="loading">
                <el-table-column prop="erpCode" label="ERP编号" align="center"></el-table-column>
                <el-table-column prop="name" label="ERP名称" align="center"></el-table-column>
                <el-table-column prop="accessKeyId" label="ERP账号" align="center"></el-table-column>
                <el-table-column prop="userAccount" label="最近更新者" align="center"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <template>{{scope.row.status==0?'停用':'启用'}}</template>
                    </template>
                </el-table-column>
                <el-table-column label="最近更新时间" align="center">
                    <template slot-scope="scope" v-if='scope.row.createTime'>
                        <template>{{scope.row.updateTime|formatDateAll}}</template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" @click='gotoEditModal(scope.row)' v-auth="'supplier.erp.bj'">编辑</el-button>
                        <el-button :type="scope.row.status==0?'warning':'success'" @click='disableErp(scope.row)' v-auth="'supplier.erp.tyqy'">{{scope.row.status==0?'启用':'停用'}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-size="page.pageSize" layout="total, prev, pager, next, jumper" :total="page.totalPage">
                </el-pagination>
            </div>
        </el-card>

        <!--添加/编辑层级弹窗-->
        <el-dialog :title="action.title" :visible.sync="isShowModal">
            <el-form :model="modalData" label-width="100px" :rules="rules" ref="modalForm">
                <el-form-item prop="accessKeyId" label="ERP账号">
                    <el-input v-model="modalData.accessKeyId" auto-complete="off" placeholder="" :disabled="action.name=='update'"></el-input>
                </el-form-item>

                <el-form-item label="ERP秘钥" v-if="action.name == 'update'">
                    <span class="secret">{{modalData.accessKeySecret}}</span>
                    <el-button @click="copy" :data-clipboard-text="modalData.accessKeySecret" id="copy">复制</el-button>
                </el-form-item>
                <el-form-item prop="name" label="ERP名称">
                    <el-input v-model="modalData.name" auto-complete="off" placeholder=""></el-input>
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-radio-group v-model="modalData.status">
                        <el-radio :label="1">启动</el-radio>
                        <el-radio :label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注说明" class="">
                    <el-input type="textarea" v-model="modalData.remark" auto-complete="off" placeholder="请输入说明文字"></el-input>
                </el-form-item>
                <el-form-item label="授权" class="">
                    <div>
                        <el-button type="primary" @click="addSupplier">添加供应商</el-button>
                    </div>
                    <div class="s-list">
                        <div class="s-item" v-for="(item) in modalData.list" :key="item._id">
                            <el-input v-model="item.value" auto-complete="off" placeholder="请输入供应商编号" style="width: 300px"></el-input>
                            <el-button @click="removeSupplier(item)">删除</el-button>
                        </div>

                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelModal">取消</el-button>
                <el-button type="primary" :loading="btnLoading" @click="submitModal">确定保存</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import moment from 'moment';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';
import Clipboard from 'clipboard';

export default {
    components: { vBreadcrumb },

    mixins: [myMixinTable],

    data() {
        const validateInput = (rule, value, callback) => {
            const uPattern = /^[a-zA-Z0-9_-]{1,20}$/;
            if (!uPattern.test(value)) {
                callback(new Error('请输入6-20位'));
            } else {
                callback();
            }
        };
        return {
            loading: false,
            page: {
                currentPage: 1,
                pageSize: 20
            },
            btnLoading: false,
            rules: {
                name: [{ required: true, message: '请输入ERP名称', trigger: 'blur' }, { validator: validateInput, trigger: 'blur' }],
                accessKeyId: [{ required: true, message: '请输入ERP账号', trigger: 'blur' }, { validator: validateInput, trigger: 'blur' }],
                status: [{ required: true, message: '请输入ERP状态', trigger: 'blur' }]
            },
            action: {
                title: '添加ERP',
                msg: '添加成功',
                name: 'add',
                uri: 'addErp'
            },
            modalData: {
                name: '',
                accessKeyId: '',
                status: 0,
                accessKeySecret: '',
                remark: '',
                list: []
            },
            isShowModal: false,
            statusList: [
                {
                    title: '启用',
                    value: 1
                },
                {
                    title: '停用',
                    value: 0
                }
            ],
            nav: ['供应商管理', 'ERP列表'],
            form: {
                name: '',
                date: '',
                start: '',
                end: '',
                code: '',
                erpCode: '',
                status: '',
                accessKeyId: ''
            },
            tableData: [],
            height: ''
        };
    },
    created() {
        const winHeight = window.screen.availHeight - 540;
        this.height = winHeight;
    },
    mounted() {
        this.getList(1);
    },
    methods: {
        // 停用和启用ERP账号
        disableErp(row) {
            const status = row.status;
            const msg = status === 0 ? '启用成功' : '停用成功';
            this.loading = true;
            request
                .updateERPstatus({ id: row.id })
                .then(() => {
                    this.loading = false;
                    this.$message.success(msg);
                    this.getList();
                })
                .catch(err => {
                    this.loading = false;
                    this.$message.warning(err);
                });
        },
        // 复制秘钥
        copy() {
            const clipboard = new Clipboard('#copy');

            clipboard.on('success', () => {
                this.$message.success('复制成功');
            });
        },
        // 移除供应商和
        removeSupplier(target) {
            // console.log('remove', target, this.modalData.list);
            let index = -1;
            let count = 0;
            this.modalData.list.forEach(item => {
                if (item._id === target._id) {
                    index = count;
                }
                count++;
            });
            if (index > -1) {
                this.modalData.list.splice(index, 1);
            } else {
                console.log('fail', index);
            }

            // console.log('remove this.modalData.list', this.modalData.list);
        },
        // 新增供应商
        addSupplier(item = { _id: +new Date(), value: '1' }) {
            this.modalData.list.push(item);
        },
        // 为erp账号的供应商赋予自定义的key
        transformSupplier(list) {
            const ts = +new Date(), result = [];
            let count = 0;
            list.forEach(item => {
                result.push({
                    _id: ts + '' + ++count,
                    value: item
                });
            });
            return result;
        },
        gotoAddModal() {
            this.modalData = {
                list: []
            };
            this.isShowModal = true;
            this.action = {
                title: '添加ERP',
                msg: '添加成功',
                name: 'add',
                uri: 'addERP'
            };
        },
        gotoEditModal(row) {
            this.loading = true;
            request
                .getERP({ id: row.id })
                .then(res => {
                    this.loading = false;
                    const data = res.data || {};
                    data.list = this.transformSupplier(data.supplierCodeList || []);
                    this.modalData = Object.assign({}, data);
                    // console.log('this.modalData', this.modalData);
                    this.isShowModal = true;
                    this.action = {
                        title: '编辑ERP',
                        msg: '修改成功',
                        name: 'update',
                        uri: 'updateERP'
                    };
                })
                .catch(err => {
                    this.loading = false;
                    this.$message.warning(err);
                });
        },
        cancelModal() {
            this.isShowModal = false;
            this.modalData = {
                name: '',
                accessKeyId: '',
                status: 0,
                accessKeySecret: '',
                remark: '',
                list: []
            };
        },
        transformModalData() {
            const tmp = [];
            let result = {};
            this.modalData.list &&
                this.modalData.list.forEach(item => {
                    if (item.value) {
                        tmp.push(item.value);
                    }
                });
            result = {
                ...this.modalData,
                supplierCodeList: tmp
            };

            return result;
        },
        submitModal() {
            const action = this.action;
            this.$refs['modalForm'].validate(valid => {
                if (valid) {
                    const result = this.transformModalData();
                    console.log('result', result);
                    request[action.uri]({
                        ...result
                    })
                        .then(() => {
                            this.$message.success(action.msg);
                            this.cancelModal();
                            this.getList();
                        })
                        .catch(err => {
                            this.$message.warning(err);
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 获取数据
        getList(val) {
            const page = val || this.page.currentPage;
            const data = {
                ...this.form,
                start: this.form.date ? moment(this.form.date[0]).format('YYYY-MM-DD 00:00:00') : '',
                end: this.form.date ? moment(this.form.date[1]).format('YYYY-MM-DD 00:00:00') : '',
                page: page,
                size: this.page.pageSize
            };
            this.page.currentPage = page;
            delete data.date;
            this.loading = true;
            request
                .getERPList(data)
                .then(res => {
                    this.loading = false;
                    const data = res.data || {};
                    this.tableData = data.data || [];
                    this.page.totalPage = data.totalNum;
                })
                .catch(error => {
                    this.loading = false;
                    console.log(error);
                });
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.form = {};
            this.getList(1);
        }
    }
};
</script>
<style lang='less' scoped>
.recruit-shop-man {
    .block {
        margin: 10px 0px;
    }
    .color-blue {
        color: #33b4ff;
        cursor: pointer;
    }
}

.s-list {
    margin-top: 10px;

    .s-item {
        margin-bottom: 10px;
    }
}

.secret {
    display: block;
}
</style>
