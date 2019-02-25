<template>
    <div class="second-classify">
        <v-breadcrumb :nav="['品牌产品管理','产品品牌分类管理','热门分类管理']"></v-breadcrumb>
        <div class="table-block">
            <el-button type="primary" style="margin-bottom: 20px" @click="addOrEditHotClassify(true)">添加热门分类</el-button>
            <mr-flying parentClass="content-box">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="page.pageSize" :current-page="page.currentPage" layout="total, prev, pager, next, jumper" :total="page.totalPage"></el-pagination>
            </mr-flying>
            <template>
                <el-table :data="tableData" :height="height" border style="width: 100%">
                    <el-table-column type="index" label="编号" align="center"></el-table-column>
                    <el-table-column prop="name" label="三级分类" align="center"></el-table-column>
                    <el-table-column prop="superiorName" label="二级分类" align="center"></el-table-column>
                    <el-table-column prop="className" label="一级分类" align="center"></el-table-column>
                    <el-table-column label="图标" align="center">
                        <template slot-scope="scope">
                            <img :src="scope.row.img" alt="">
                        </template>
                    </el-table-column>
                    <el-table-column prop="hotSort" label="排序" align="center"></el-table-column>
                    <el-table-column min-width="160" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="warning" size="small" @click="addOrEditHotClassify(false,scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="delItem(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>

        <!--添加/编辑弹窗-->
        <el-dialog :title="title" :visible.sync="mask">
            <el-form v-model="form">
                <div style="margin-left: 40px">请选择产品类目及产品品牌</div>
                <el-form-item class="classify-area">
                    <div class="check-area">
                        <div class="title">一级类目</div>
                        <div v-if="first.length" class="data-area">
                            <ul v-loading="loading">
                                <li v-for="(item,index) in first" :key="index"
                                    @click="getSecond(item,index)"
                                    :class="firstIndex==index?'selected':''">{{item.name}}
                                </li>
                            </ul>
                        </div>
                        <div v-else class="nodata">
                            暂无数据~
                        </div>
                    </div>
                    <div class="check-area">
                        <div class="title">二级类目</div>
                        <div v-if="second.length" class="data-area">
                            <ul v-loading="loading">
                                <li v-for="(item,index) in second" :key="index"
                                    @click="getThird(item,index)"
                                    :class="secondIndex==index?'selected':''">{{item.name}}
                                </li>
                            </ul>
                        </div>
                        <div v-else class="nodata">
                            暂无数据~
                        </div>
                    </div>
                    <div class="check-area">
                        <div class="title">三级类目</div>
                        <div v-if="third.length"  class="data-area">
                            <ul v-loading="loading">
                                <li v-for="(item,index) in third" :key="index"
                                    @click="chooseClassify(item,index)"
                                    :class="thirdIndex==index?'selected':''">{{item.name}}
                                </li>
                            </ul>
                        </div>
                        <div v-else class="nodata">
                            暂无数据~
                        </div>
                    </div>
                </el-form-item>
                <div style="margin:0 0 10px 40px">您当前选择的类目是：{{firstName}} <span v-if="secondName"> > </span> {{secondName}} <span v-if="thirdName"> > </span> {{thirdName}}</div>
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input v-model="form.hotSort" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-loading="btnLoading" @click="addOrEdit('form')">确 认</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!--删除弹窗-->
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import icon from '@/components/common/ico.vue';
import deleteToast from '@/components/common/DeleteToast';
import { myMixinTable } from '@/JS/commom';
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
            // 类目类型
            type: '',
            height: '',
            mask: false,
            isShowDelToast: false,
            formLabelWidth: '100px',
            form: {
                hotSort: '',
                id: ''
            },
            title: '添加热门分类',
            delId: 66,
            delUrl: 'http://api',
            delUri: '',
            first: [], // 一级类目
            second: [], // 二级类目
            third: [], // 三级类目
            firstIndex: -1, // 选中的一级索引值
            secondIndex: -1, // 选中的二级索引值
            thirdIndex: -1, // 选中的三级索引值
            firstName: '', // 选中的一级类目名称
            secondName: '', // 选中的二级类目名称
            thirdName: '', // 选中的三级类目名称
            btnLoading: false,
            firstId: '',
            url: '',
            fatherId: ''
        };
    },
    created() {
        const winHeight = window.screen.availHeight - 500;
        this.height = winHeight;
    },
    activated() {
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取列表
        getList(val) {
            const data = {
                page: val,
                pageSize: this.page.pageSize
            };
            this.page.currentPage = val;
            request.queryListByHotFlag(data).then(res => {
                this.tableData = [];
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch(error => {
                console.log(error);
            });
        },
        // 添加修改
        addOrEditHotClassify(status, row) {
            this.first = [];
            this.second = [];
            this.third = [];
            this.form = {};
            this.firstName = '';
            this.secondName = '';
            this.thirdName = '';
            this.firstIndex = -1;
            this.secondIndex = -1;
            this.thirdIndex = -1;
            this.btnLoading = false;
            if (status) {
                this.getFirst(false);
                this.title = '添加热门分类';
                this.url = 'addHotFlag';
            } else {
                this.getFirst(true);
                this.title = '编辑热门分类';
                this.url = 'modifyHotFlag';
                this.form.hotSort = row.hotSort;
                this.firstName = row.className;
                this.secondName = row.superiorName;
                this.thirdName = row.name;
                this.fatherId = row.id;
            }
            this.mask = true;
        },
        // 添加修改确定
        addOrEdit(formName) {
            const data = this[formName];
            if (!data.id) {
                this.$message.warning('请选择类目!');
                return;
            }
            if (!data.hotSort) {
                this.$message.warning('请输入分类排序!');
                return;
            }
            if (this.url === 'modifyHotFlag') {
                data.fatherId = this.fatherId;
            }
            this.btnLoading = true;
            request[this.url](data).then(res => {
                this.$message.success(res.msg);
                this.btnLoading = false;
                this.mask = false;
                this.getList(this.page.currentPage);
            }).catch(error => {
                console.log(error);
                this.btnLoading = false;
            });
        },
        // 删除
        delItem(id) {
            this.delId = id;
            this.delUrl = 'deleteHotFlag';
            this.isShowDelToast = true;
        },
        // 删除弹窗
        deleteToast(msg) {
            this.isShowDelToast = msg;
            this.getList(this.page.currentPage);
        },
        // 取消
        cancel() {
            this.mask = false;
            this.getList(this.page.currentPage);
        },
        // 获取一级类目
        getFirst(status) {
            this.loading = true;
            const data = {
                page: 1,
                pageSize: 10000,
                level: 1,
                fatherId: 0,
                status: 1
            };
            // 获取一级类目并回显选中状态
            request.queryProductCategoryList(data).then(res => {
                this.first = res.data.data;
                for (const i in res.data.data) {
                    if (res.data.data[i].name === this.firstName) {
                        this.firstIndex = i;
                        if (status) {
                            // this.firstId = res.data.data[i].id;
                            this.getSecond(res.data.data[i], this.firstIndex, true);
                        }
                    }
                }
                this.loading = false;
            }).catch(error => {
                console.log(error);
                this.loading = false;
            });
        },
        // 获取二级类目
        // status 判断是否为编辑回显状态 true是
        getSecond(item, index, status) {
            if (!status) {
                this.firstName = item.name;
                if (index != this.firstIndex) {
                    this.secondName = '';
                    this.thirdName = '';
                    this.secondIndex = -1;
                    this.thirdIndex = -1;
                    this.second = [];
                    this.third = [];
                } else {
                    return;
                }
            }
            this.firstIndex = index;
            const data = {
                fatherId: item.id,
                page: 1,
                pageSize: 10000,
                level: 2,
                status: 1
            };
            this.loading = false;
            // 获取二级类目并回显选中状态
            request.queryProductCategoryList(data).then(res => {
                this.second = res.data.data;
                for (const i in res.data.data) {
                    if (res.data.data[i].name === this.secondName) {
                        this.secondIndex = i;
                        if (status) {
                            this.getThird(res.data.data[i], this.secondIndex, true);
                        }
                    }
                }
            }).catch(error => {
                console.log(error);
                this.loading = false;
            });
        },
        // 获取三级类目
        // item选中项 index选中索引值
        getThird(item, index, status) {
            if (!status) {
                this.secondName = item.name;
                if (index != this.secondIndex) {
                    this.thirdName = '';
                    this.thirdIndex = -1;
                    this.third = [];
                } else {
                    return;
                }
            }
            this.secondIndex = index;
            const data = {
                fatherId: item.id,
                page: 1,
                pageSize: 10000,
                level: 3,
                status: 1
            };
            this.loading = false;
            // 获取三级类目并回显选中状态
            request.queryProductCategoryList(data).then(res => {
                this.third = res.data.data;
                for (const i in res.data.data) {
                    if (res.data.data[i].name === this.thirdName) {
                        this.thirdIndex = i;
                        this.form.id = res.data.data[i].id;
                    }
                }
            }).catch(error => {
                console.log(error);
                this.loading = false;
            });
        },
        chooseClassify(item, index) {
            this.thirdName = item.name;
            this.thirdIndex = index;
            this.form.id = item.id;
        }
    }
};
</script>

<style lang="less" scoped>
    .second-classify {
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
        /deep/.el-dialog {
            width: 700px;
            border-radius: 10px;
            .el-dialog__header {
                border-bottom: 1px solid #eee;
                padding: 20px 20px 10px 50px;
            }
            .el-dialog__title {
                color: #ff6868;
            }

            .el-dialog__footer {
                margin-right: 30px;
            }
        }
        /deep/.el-dialog .el-input {
            display: inline;
        }
        /deep/.el-dialog .el-input__inner {
            width: 360px;
        }
        /deep/.el-select .el-input__inner {
            width: 200px;
        }

        .check-area {
            float: left;
            width: 191px;
            font-size: 12px;
            color: #999;
            border: 1px solid #dfdfdf;
            margin-right: 10px;
            border-radius: 5px;
            .title {
                background: #eee;
                height: 28px;
                line-height: 28px;
                text-align: center;
                border-bottom: 1px solid #dfdfdf;
            }

            ul {
                line-height: 25px;
                overflow-y: auto;
                overflow-x: hidden
            }

            ul li {
                list-style: none;
                padding-left: 10px;
                cursor: pointer
            }

            .selected {
                background: #409EFF;
                color: #fff
            }
            .data-area {
                line-height: 25px;
                height: 200px;
                overflow-y: auto;
                overflow-x: hidden;
            }

            .nodata {
                height: 200px;
                text-align: center;
            }

        }
        /deep/.classify-area .el-form-item__content{
            margin-left: 40px;
        }
        /deep/.el-input--small .el-input__icon{
            line-height: 20px;
        }
    }
</style>
