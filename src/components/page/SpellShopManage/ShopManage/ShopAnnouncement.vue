<template>
    <div class="shop-announcement">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 60px' }">
            <el-table :data="tableData" border>
                <el-table-column type="index" :index='handleIndex' label="编号" align="center"></el-table-column>
                <el-table-column prop="content" label="内容" align="center"></el-table-column>
                <el-table-column label="发布时间" align="center">
                    <template slot-scope="scope" v-if='scope.row.createTime'>
                        <template>{{scope.row.createTime|formatDate}}</template>
                    </template>
                </el-table-column>
                <el-table-column prop="realname" label="发布人" align="center"></el-table-column>
                <el-table-column label="操作" v-if="isShowOperate" align="center">
                    <template slot-scope="scope">
                        <el-button @click="editAnnoun(scope.row)" v-if="p.updateStoreNotice" type="primary">编辑</el-button>
                        <el-button @click="delItem(scope.row)" v-if="p.deleteStoreNotice" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
        </el-card>
        <el-dialog title="店铺公告修改" :visible.sync="isShowEdit" width="30%">
            <el-input type="textarea" :rows="10" v-model="annContent" placeholder=""></el-input>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirmEdit">修 改</el-button>
            <el-button @click="isShowEdit = false">取 消</el-button>
        </span>
        </el-dialog>
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import deleteToast from '@/components/common/DeleteToast';
    import * as pApi from '@/privilegeList/SpellShopManage/index';
    import utils from '@/utils/index.js';
    import request from '@/http/http.js';
    import { myMixinTable } from '@/JS/commom';

    export default {
        components: { vBreadcrumb, deleteToast },
        mixins: [myMixinTable],

        data() {
            return {
                // 权限控制
                p: {
                    updateStoreNotice: false,
                    deleteStoreNotice: false
                },
                isShowOperate: false,

                nav: ['拼店店铺管理', '店铺公告管理'],
                isShowEdit: false,
                isShowDelToast: false,
                tableData: [],
                page: {
                    currentPage: 1,
                    totalPage: 0
                },
                annContent: '',
                delId: 0,
                delUrl: 'http://api',
                delUri: '',
                recruitShopId: '',
                id: ''
            };
        },

        activated() {
            this.recruitShopId =
                this.$route.query.recruitShopId || sessionStorage.getItem('recruitShopId');
            this.getList();
            this.pControl();
        },

        methods: {
            // 权限控制
            pControl() {
                for (const k in this.p) {
                    this.p[k] = utils.pc(pApi[k]);
                }
                if (this.p.updateStoreNotice && this.p.deleteStoreNotice) {
                    this.isShowOperate = true;
                }
            },
            // 获取数据
            getList() {
                const data = {
                    storeId: this.recruitShopId
                };
                request.queryStoreNoticeList(data).then(res => {
                    this.tableData = [];
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                }).catch(error => {
                    console.log(error);
                });
            },
            // 编辑公告
            editAnnoun(row) {
                this.annContent = row.content;
                this.isShowEdit = true;
                this.id = row.id;
            },
            confirmEdit() {
                if (this.annContent == '') {
                    this.$message.warning('请输入公告内容');
                    return;
                }
                this.isShowEdit = false;
                const data = {
                    id: this.id,
                    content: this.annContent
                };
                request.updateStoreNotice(data).then(res => {
                    // this.$message.success(res.data.msg);
                    this.getList(this.page.currentPage);
                }).catch(error => {
                    console.log(error);
                });
            },
            // 删除
            delItem(row) {
                this.delId = row.id;
                this.delUrl = 'deleteStoreNotice';
                this.delUri = pApi.deleteStoreNotice;
                this.isShowDelToast = true;
            },
            // 删除弹窗
            deleteToast(msg) {
                this.isShowDelToast = msg;
                this.getList(this.page.currentPage);
            },
            // 编号
            handleIndex(index) {
                return index + 1;
            }
        }
    };
</script>
<style lang='less'>
    .shop-announcement {
        .el-dialog {
            border-radius: 10px;
            .el-dialog__header {
                border-bottom: 1px solid #dcdcdc;
                .el-dialog__title {
                    color: #ff6868;
                }
            }
        }
        .block {
            margin: 10px 0;
        }
    }
</style>
