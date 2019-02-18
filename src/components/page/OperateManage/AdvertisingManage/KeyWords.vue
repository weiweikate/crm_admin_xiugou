<template>
    <div class="keywords">
        <v-breadcrumb :nav="['运营管理','广告位管理','搜索热门搜索关键词']"></v-breadcrumb>
        <transition name="move" appear>
            <el-card style="margin:10px 0 20px">
                <el-form ref="form" :inline="true" :model="form" @submit.native.prevent>
                    <el-form-item prop="name" label="关键词" label-width="120">
                        <el-input style="width:200px" placeholder="请输入关键词搜索" v-model="form.wordName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="getList(1)" native-type="submit" type="primary">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </transition>
        <div class="table-block">
                <el-button @click="addHotWord" type="primary" style="margin-bottom: 20px">添加搜索关键词</el-button>
            <template>
                <el-table :data="tableData" :height="height" border style="width: 100%">
                    <el-table-column type="index" label="编号" align="center"></el-table-column>
                    <el-table-column prop="wordName" label="关键词" align="center"></el-table-column>
                    <el-table-column prop="hits" label="获得点击数" align="center"></el-table-column>
                    <el-table-column prop="rank" label="排序" align="center"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="success" v-if="scope.row.status==2" size="small"
                                       @click="upStatusItem(scope.row,1)">开启
                            </el-button>
                            <el-button type="success" v-if="scope.row.status==1" size="small"
                                       @click="upStatusItem(scope.row,2)">关闭
                            </el-button>
                            <el-button type="primary" size="small" @click="editItem(scope.row)">编辑
                            </el-button>
                            <el-button type="danger" size="small" @click="upStatusItem(scope.row,3)" style="width: 80px"> 删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
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
        </div>
        <!--添加/编辑类目弹窗-->
        <el-dialog title="添加热搜关键词" :visible.sync="addMask">
            <el-form v-model="addForm" label-width="100px">
                <el-form-item label="关键词">
                    <el-input v-model="addForm.wordName" auto-complete="off" placeholder="请输入关键词"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="addForm.rank" auto-complete="off" placeholder="请输入排序数值"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrEdit('addForm')">确认保存</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改热搜关键词" :visible.sync="editMask">
            <el-form v-model="editForm" label-width="100px">
                <el-form-item label="关键词">
                    <el-input v-model="editForm.wordName" auto-complete="off" placeholder="请输入关键词"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="editForm.rank" auto-complete="off" placeholder="请输入排序数值"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrEdit('editForm')">确 认</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!--消息确认弹窗-->
        <div class="pwd-mask" v-if="tipsMask">
            <div class="box">
                <div class="mask-title">
                    <icon class="ico" ico='icon-jinggao'/>
                    温馨提示
                </div>
                <div class="mask-content">
                    <span class="del-tip">{{info}}</span>
                    <div class="del-btn-group">
                        <el-button :loading="btnLoading" @click="oprSure(true)" class="del-btn" type="danger">确认
                        </el-button>
                        <el-button @click="tipsMask=false">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import icon from '@/components/common/ico.vue';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';

export default {
    components: {
        vBreadcrumb, icon
    },
    mixins: [myMixinTable],
    data() {
        return {

            editForm: {
                wordName: '',
                rank: ''
            },
            addForm: {
                wordName: '',
                rank: ''
            },
            addMask: false,
            editMask: false,
            id: '',
            itemId: '',
            page: {
                currentPage: 1,
                totalPage: 0
            },
            tableData: [],
            height: '',
            tipsMask: false,
            info: '',
            form: {
                wordName: ''
            },
            isShowDelToast: false,
            btnLoading: false
        };
    },
    created() {
        const winHeight = window.screen.availHeight - 520;
        this.height = winHeight;
    },
    activated() {
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取列表
        getList(val) {
            const that = this;
            const data = {
                page: val,
                name: that.form.wordName,
                pageSize: that.page.pageSize
            };
            this.page.currentPage = val;
            that.tableLoading = true;
            request.getHotWordsByPage(this.$utils.trimForm(data)).then(res => {
                that.tableLoading = false;
                that.tableData = res.data.data;
                that.page.totalPage = res.data.totalNum;
            }).catch(err => {
                that.tableLoading = false;
                console.log(err);
            });
        },
        // 添加热搜关键词
        addHotWord() {
            this.addMask = true;
            this.addForm.wordName = '';
            this.addForm.rank = '';
            this.itype = 'add';
        },
        // 编辑
        editItem(row) {
            this.editMask = true;
            this.editForm = row;
            this.itemId = row.id;
            this.itype = 'edit';
        },
        // 添加修改确定
        addOrEdit(formName) {
            let url = '';
            const data = this[formName];
            if (!data.wordName) {
                this.$message.warning('请输入关键词!');
                return;
            }
            if (!data.rank) {
                this.$message.warning('请输入排序数值!');
                return;
            }
            if (this.itype == 'add') {
                url = 'addHotWord';
            } else {
                url = 'updateHotWordsById';
                data.id = this.itemId;
            }
            this.btnLoading = true;
            request[url](data).then(res => {
                this.$message.success(res.msg);
                this.btnLoading = false;
                this.addMask = false;
                this.editMask = false;
                this.getList(this.page.currentPage);
            }).catch(err => {
                console.log(err);
            });
        },
        // 开启关闭/删除
        upStatusItem(row, status) {
            const that = this;
            that.tipsMask = true;
            if (status == 1) {
                that.info = '确定开启？';
            }
            if (status == 2) {
                that.info = '确定关闭？';
            }
            if (status == 3) {
                that.info = '确定删除"' + row.wordName + '"关键词？';
            }
            that.status = status;
            that.id = row.id;
        },
        oprSure() {
            const that = this;
            const data = {
                id: that.id
            };
            data.type = that.status == 3 ? 0 : that.status;
            that.btnLoading = true;
            request.updateHotWordsStatusById(data).then(res => {
                that.tipsMask = false;
                that.$message.success(res.msg);
                that.getList(that.page.currentPage);
                that.btnLoading = false;
            }).catch(err => {
                console.log(err);
                that.btnLoading = false;
                that.tipsMask = false;
            });
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.form.wordName = '';
            this.getList(this.page.currentPage);
        },
        // 取消
        cancel() {
            this.addMask = false;
            this.editMask = false;
            this.getList(this.page.currentPage);
        }
    }
};
</script>

<style lang="less">
    .keywords {
        .breadcrumb {
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
            height: 30px;
            overflow: hidden;
            background: white;
            padding-left: 40px;
            box-sizing: border-box;
        }
        .bread-item {
            line-height: 30px;
        }
        .ico {
            margin-right: 5px;
            color: #33b4ff;
            font-size: 18px;
        }
        .tab-item {
            width: 116px;
            height: 50px;
            line-height: 50px;
            border-radius: 0 0 5px 5px;
            text-align: center;
            color: #fff;
            background: #dddddd;
            display: inline-block;
            cursor: pointer;
        }
        .checked {
            background: #ff6868;
        }
        /*表格样式*/
        .table-block {
            padding: 20px 20px 60px;
            background: #fff
        }
        .block {
            float: right;
            margin-top: 10px
        }
        .content {
            padding: 40px 40px 0
        }
        .table-block .el-form-item {
            margin-bottom: 0 !important;
        }
        .search-area {
            margin-bottom: 20px
        }
        .search-area .el-input__inner {
            width: 160px
        }

        .pwd-mask {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.2);
            .box {
                position: relative;
                width: 530px;
                height: 305px;
                background-color: #fff;
                border-radius: 10px;
                overflow: hidden;
                .mask-title {
                    width: 100%;
                    height: 56px;
                    border-bottom: 1px solid #ccc;
                    padding-left: 45px;
                    box-sizing: border-box;
                    text-align: center;
                    line-height: 56px;
                    color: #ff6868;
                    font-weight: 700;
                    .ico {
                        position: absolute;
                        top: 16px;
                        left: 228px;
                        color: red;
                        font-size: 20px;
                    }
                }
                .mask-content {
                    position: relative;
                    width: 100%;
                    height: 248px;
                    overflow: hidden;
                    padding: 30px 45px 0 45px;
                    box-sizing: border-box;
                    .del-tip {
                        position: absolute;
                        top: 30%;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 22px;
                    }
                    .del-btn-group {
                        width: 180px;
                        display: flex;
                        justify-content: space-between;
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        bottom: 15%;
                        .del-btn {
                            background-color: #ff6868;
                        }
                    }
                }
            }
        }
        /*弹窗样式*/
        .el-dialog {
            width: 530px;
            border-radius: 10px;
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
            width: 180px;
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
