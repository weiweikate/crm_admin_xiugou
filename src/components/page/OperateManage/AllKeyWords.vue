<template>
    <div class="keywords">
        <v-breadcrumb :nav="['运营管理','搜索关键词']"></v-breadcrumb>
        <transition name="move" appear>
            <el-card style="margin:10px 0 20px">
                <el-form ref="form" :inline="true" :model="form" @submit.native.prevent>
                    <el-form-item prop="keyword" label="关键词" label-width="120">
                        <el-input style="width:200px" placeholder="请输入关键词搜索" v-model="form.keyword"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="getList(1)" native-type="submit" type="primary">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </transition>
        <div class="table-block">
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
            <template>
                <el-table :data="tableData" :height="height" border style="width: 100%">
                    <el-table-column type="index" label="编号" align="center"></el-table-column>
                    <el-table-column prop="keyword" label="关键词" align="center"></el-table-column>
                    <el-table-column prop="hotwordHits" label="运营搜索类别" align="center"></el-table-column>
                    <el-table-column prop="hits" label="搜索频次" align="center"></el-table-column>
                    <!--<el-table-column label="操作" align="center">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-button type="primary" size="small">查看区域表-->
                            <!--</el-button>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                </el-table>
            </template>
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
                page: {
                    currentPage: 1,
                    totalPage: 0
                },
                tableData: [],
                height: '',
                form: {
                    keyword: ''
                }
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
                    pageSize: that.page.pageSize,
                    keyword: that.form.keyword
                };
                this.page.currentPage = val;
                that.tableLoading = true;
                request.getWordsByPage(this.$utils.trimForm(data)).then(res => {
                    that.tableLoading = false;
                    that.tableData = res.data.data;
                    that.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    that.tableLoading = false;
                    console.log(err);
                });
            },

            // 重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.form.keyword = '';
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
