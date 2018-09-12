<template>
    <div class="keywords">
        <v-breadcrumb :nav="['运营管理','搜索关键词']"></v-breadcrumb>
        <transition wordName="move" appear>
            <el-card style="margin:10px 0 20px">
                <el-form ref="form" :inline="true" :model="form">
                    <el-form-item prop="wordName" label="关键词" label-width="120">
                        <el-input style="width:200px" placeholder="请输入关键词搜索" v-model="form.wordName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="getList(1)" type="primary">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </transition>
        <div class="table-block">
            <template>
                <el-table :data="tableData" :height="height" border style="width: 100%">
                    <el-table-column type="index" label="编号" width="60" align="center"></el-table-column>
                    <el-table-column prop="wordName" label="关键词" align="center"></el-table-column>
                    <el-table-column prop="clickRate" label="搜索频次" align="center"></el-table-column>
                    <el-table-column v-if="isShowOperate" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small">查看区域表
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
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import vBreadcrumb from '../../common/Breadcrumb.vue';
    import icon from '../../common/ico.vue';
    import * as api from '../../../api/OperateManage/allKeysWords';
    import * as pApi from '../../../privilegeList/OperateManage/allKeysWords';
    import { myMixinTable } from '@/JS/commom';

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
            this.getList();
        },
        methods: {
            // 获取列表
            getList(val) {
                const that = this;
                const data = {
                    page: val,
                    wordName: that.form.wordName
                };
                data.url = pApi.getAllWordsByPage;
                that.tableLoading = true;
                // that.$axios
                //     .post(api.getAllWordsByPage, data)
                //     .then(res => {
                //         if (res.data.code == 200) {
                //             that.tableLoading = false;
                //             that.tableData = res.data.data.data;
                //             that.page.totalPage = res.data.data.resultCount;
                //         } else {
                //             that.$message.warning(res.data.msg);
                //             that.tableLoading = false;
                //         }
                //     })
                //     .catch(err => {
                //         that.tableLoading = false;
                //         console.log(err);
                //     });
            },

            // 重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.form.wordName = '';
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
