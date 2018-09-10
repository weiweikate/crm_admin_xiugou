<template>
    <div class="app-banner-adv">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }">
            <el-button @click="addBanImg" v-if="pageType!=5" type="primary" style="margin-bottom:20px">添加banner图片
            </el-button>
            <el-button @click="addBanImg" v-else type="primary" style="margin-bottom:20px">添加首页长条广告位</el-button>
            <el-table border :data="tableData">
                <el-table-column type="index" label="编号" align="center"></el-table-column>
                <el-table-column label="图片" align="center">
                    <template slot-scope="scope">
                        <img class="img" :src="scope.row.img_url">
                    </template>
                </el-table-column>
                <el-table-column v-if="pageType!=5" prop="link_type" label="链接" align="center"></el-table-column>
                <el-table-column v-else prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column v-if="pageType!=5" prop="show_begintime" label="投放时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.show_begintime|formatDate}}~{{scope.row.show_endtime|formatDate}}
                    </template>
                </el-table-column>
                <el-table-column prop="sort_rank" label="排序" align="center" width="80"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click='editBanImg(scope.row.id)' type="primary">编辑</el-button>
                        <el-button type="warning" @click="del(scope.row.id)">删除</el-button>
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
        <!--添加/编辑弹窗-->
        <el-dialog :title="addTitle" :visible.sync="addMask">
            <el-form v-model="addForm" label-width="100px">
                <el-form-item label="选择banner图" class="icon-area">
                    <el-input readonly v-model="addForm.img" placeholder="上传图片" auto-complete="off"></el-input>
                    <el-upload class="icon-uploader"
                               action="/admin/ossClient/aliyunOSSUploadImage"
                               :on-success="handleAvatarSuccess">
                        <el-button size="small" type="primary"><i class="el-icon-upload"></i>上传</el-button>
                    </el-upload>
                </el-form-item>
                <div class="inf-area">
                    <img :src="addForm.imgUrl" alt="" class="banner-img">
                    <div class="tips">建议图片尺寸350px*350px</div>
                </div>
                <el-form-item label="请选择类型">
                    <el-select v-model="addForm.linkType" placeholder="请选择类型">
                        <el-option v-for="(v,k) in linkTypeList" :key="k" :label="v.dValue" :value="v.dKey"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请输入ID">
                    <el-input v-model="addForm.linkTypeValue" placeholder="请输入ID" @blur="searchProduct"
                              auto-complete="off"></el-input>
                </el-form-item>
                <div class="inf-area">{{productName}}</div>
                <el-form-item label="备注说明">
                    <el-input v-model="addForm.remark" placeholder="请输入备注说明" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="addForm.sortRank" placeholder="请输入排序" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="pageType!=5" prop="date" label="投放时间">
                    <el-date-picker class="input-style" v-model="addForm.date" type="datetimerange" range-separator="至"
                                    start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="addOrEdit('addForm')">确 认</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="editTitle" :visible.sync="editMask">
            <el-form v-model="form" label-width="100px">
                <el-form-item label="选择banner图" class="icon-area">
                    <el-input readonly v-model="form.img" placeholder="上传图片" auto-complete="off"></el-input>
                    <el-upload class="icon-uploader"
                               action="/admin/ossClient/aliyunOSSUploadImage"
                               :on-success="handleAvatarSuccess">
                        <el-button size="small" type="primary"><i class="el-icon-upload"></i>上传</el-button>
                    </el-upload>
                </el-form-item>
                <div class="inf-area">
                    <img :src="form.imgUrl" alt="" class="banner-img">
                    <div class="tips">建议图片尺寸350px*350px</div>
                </div>
                <el-form-item label="请选择类型">
                    <el-select v-model="form.linkType" placeholder="请选择类型">
                        <el-option v-for="(v,k) in linkTypeList" :key="k" :label="v.dValue" :value="v.dKey"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请输入ID">
                    <el-input v-model="form.linkTypeValue" placeholder="请输入ID" @blur="searchProduct"
                              auto-complete="off"></el-input>
                </el-form-item>
                <div class="inf-area">{{productName}}</div>
                <el-form-item label="备注说明">
                    <el-input v-model="form.remark" placeholder="请输入备注说明" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="form.sortRank" placeholder="请输入排序" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="pageType!=5" prop="date" label="投放时间">
                    <el-date-picker @blur="changeTime" class="input-style" v-model="form.date" type="datetimerange" range-separator="至"
                                    start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="addOrEdit('form')">确 认</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <deletetoast :id="delId" :url="delUrl" :uri="delUri" :status="3" @msg="deleteToast" v-if="isShowDel"></deletetoast>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import deletetoast from '@/components/common/DeleteToast';
    import utils from '@/utils/index.js';
    import moment from 'moment';
    import * as api from '@/api/OperateManage/Advertising/adverListUrl.js';
    import * as pApi from '@/privilegeList/OperateManage/Advertising/adverListUrl.js';
    import { myMixinTable, queryDictonary } from '@/JS/commom';

    export default {
        components: {
            vBreadcrumb,
            deletetoast
        },
        mixins: [myMixinTable, queryDictonary],

        data() {
            return {
                nav: ['运营管理', '广告位管理', 'APP首页banner广告位'],
                isAddBanner: false,
                diaTitle: '添加Banner图片',
                formLabelWidth: '130px',
                tableData: [], // { id: 1,img:'src/assets/images/avatar.jpg' }
                addMask: false,
                editMask: false,
                btnLoading: false,
                form: {
                    img: '',
                    imgUrl: '',
                    linkType: '',
                    linkTypeValue: '',
                    remark: '',
                    sortRank: '',
                    date: []
                },
                addForm: {
                    img: '',
                    imgUrl: '',
                    linkType: '',
                    linkTypeValue: '',
                    remark: '',
                    sortRank: '',
                    date: []
                },
                linkTypeList: [],
                row: '',
                id: '',
                itemId: '',
                delUrl: '', // 删除接口地址
                delUri: '', // 权限
                delId: '', // id
                isShowDel: false,
                value: '',
                itype: '',
                showDetail: false,
                productName: '',
                proId: '',
                type: 1,
                pageType: '',
                addTitle: '添加banner图片',
                editTitle: '编辑banner图片'
            };
        },

        activated() {
            this.pageType = this.$route.query.appBannerAdvId || sessionStorage.getItem('appBannerAdvId');
            if (this.pageType == 5) {
                this.addTitle = '添加首页长条广告位';
                this.editTitle = '编辑首页长条广告位';
            } else {
                this.addTitle = '添加banner图片';
                this.editTitle = '编辑banner图片';
            }
            this.getList();
            this.showNav(this.pageType);
        },

        methods: {
            changeTime(){
                this.$mount();
            },
            showNav(index) {
                let nav = '';
                switch (index) {
                    case 1:
                        nav = ['运营管理', '广告位管理', 'APP首页banner广告位'];
                        break;
                    case 2:
                        nav = ['运营管理', '广告位管理', '拼店首页banner推荐位'];
                        break;
                    case 3:
                        nav = ['运营管理', '广告位管理', '登录首页头图展示图'];
                        break;
                    case 4:
                        nav = ['运营管理', '广告位管理', '发现模块banner推荐图'];
                        break;
                    case 5:
                        nav = ['运营管理', '广告位管理', '首页长条广告位管理'];
                        break;
                }
                this.nav = nav;
            },
            // 获取数据
            getList() {
                const data = {
                    page: this.page.currentPage,
                    pageType: this.pageType,
                    type: this.pageType == 5 ? '2' : ''
                };
                this.$axios.post(api.bannerListUrl, data).then((res) => {
                    if (res.data.code == 200) {
                        this.tableData = [];
                        this.tableData = res.data.data.data;
                        this.page.totalPage = res.data.data.resultCount;
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // 添加banner图
            async addBanImg() {
                this.addMask = true;
                this.addForm.imgUrl = '';
                this.addForm.img = '';
                this.addForm.linkType = '';
                this.addForm.linkTypeValue = '';
                this.productName = '';
                this.addForm.remark = '';
                this.addForm.sortRank = '';
                this.addForm.date = '';
                this.itype = 'add';
                this.proId = true;
                await this.queryDictonary(9);
                this.linkTypeList = this.tmpAxiosData;
            },
            // 编辑banner图
            async editBanImg(row) {
                this.editMask = true;
                this.itemId = row;
                this.getDetail(row);
                this.itype = 'edit';
                this.productName = '';
                this.proId = true;
                await this.queryDictonary(9);
                this.linkTypeList = this.tmpAxiosData;
            },
            addOrEdit(formName) {
                let url = '';
                const data = {};
                data.imgUrl = this[formName].imgUrl;
                data.linkType = this[formName].linkType;
                data.linkTypeValue = this[formName].linkTypeValue;
                data.pageType = this.pageType;
                data.remark = this[formName].remark;
                data.sortRank = this[formName].sortRank;
                if (this[formName].date && this.pageType != 5) {
                    data.showBegintime = moment(this[formName].date[0]).format('YYYY-MM-DD HH:mm:ss');
                    data.showEndtime = moment(this[formName].date[1]).format('YYYY-MM-DD HH:mm:ss');
                }
                if (!data.imgUrl) {
                    this.$message.warning('请上传图片!');
                    return;
                }
                if (!data.linkType) {
                    this.$message.warning('请选择类型!');
                    return;
                }
                if (!data.linkTypeValue) {
                    this.$message.warning('请输入ID!');
                    return;
                }
                if (!data.sortRank) {
                    this.$message.warning('请输入排序!');
                    return;
                }
                if (!this.proId) {
                    return false;
                }
                if (this.itype == 'add') {
                    url = api.addItemUrl;
                    data.url = pApi.addItemUrl;
                } else {
                    url = api.editdUrl;
                    data.id = this.itemId;
                    data.url = pApi.editdUrl;
                }
                data.type = this.pageType == 5 ? '2' : this.type;
                data.pageType = this.pageType;
                this.btnLoading = true;
                this.$axios
                    .post(url, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            this.$message.success(res.data.msg);
                            this.btnLoading = false;
                            this.addMask = false;
                            this.editMask = false;
                            this.btnLoading = false;
                            this.getList();
                        } else {
                            this.btnLoading = false;
                            this.$message.warning(res.data.msg);
                            this.getList();
                        }
                    })
                    .catch(err => {
                        this.btnLoading = false;
                        console.log(err);
                    });
            },
            // 上传图片
            handleAvatarSuccess(res) {
                if (this.itype == 'add') {
                    this.addForm.img = res.data.imageUrl;
                    this.addForm.imgUrl = res.data.imageUrl;
                } else {
                    this.form.img = res.data.imageUrl;
                    this.form.imgUrl = res.data.imageUrl;
                }
            },
            // 取消
            cancel() {
                this.addMask = false;
                this.editMask = false;
                this.getList();
            },
            del(val) {
                this.delUrl = api.delItemUrl;
                this.delUri = pApi.delItemUrl;
                this.delId = val;
                this.isShowDel = true;
            },
            deleteToast(msg) {
                this.isShowDel = msg;
                this.getList();
            },
            // 根据产品id查询产品名称
            searchProduct() {
                const data = {};
                let url = '';
                this.productName = '';
                if (this.itype == 'add') {
                    if (this.addForm.linkType == 1) {
                        data.prodCode = this.addForm.linkTypeValue;
                        url = api.findProductNameByProdCode;
                    } else {
                        data.id = Number(this.addForm.linkTypeValue);
                        url = api.getById;
                    }
                } else {
                    if (this.form.linkType == 1) {
                        data.prodCode = this.form.linkTypeValue;
                        url = api.findProductNameByProdCode;
                    } else {
                        data.id = Number(this.form.linkTypeValue);
                        url = api.getById;
                    }
                }
                this.$axios
                    .post(url, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            this.showDetail = true;
                            this.productName = res.data.data;
                            this.proId = true;
                        } else {
                            this.proId = false;
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        this.proId = false;
                    });
            },
            // 获取详情
            getDetail(id) {
                const data = {
                    id: id
                };
                this.$axios
                    .post(api.queryUrl, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            this.form = res.data.data;
                            this.form.img = this.form.imgUrl;
                            this.form.linkType = this.form.linkType.toString();
                            this.form.date = []; //  投放时间
                            this.form.date[0] = this.form.showBegintime;
                            this.form.date[1] = this.form.showEndtime;
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    });
            }
        }
    };
</script>
<style lang='less'>
    .app-banner-adv {
        .el-dialog__header {
            border-bottom: 1px solid #ccc;
            .el-dialog__title {
                color: #ff4e4e;
                font-weight: 700;
            }
        }
        img {
            width: 94px;
            height: 94px;
            background-color: #ffffff;
            border-radius: 4px;
            border: solid 2px #dddddd;
        }
        .input-style {
            width: 260px;
        }
        .el-input__suffix {
            line-height: 24px;
        }
        .icon-uploader {
            float: right;
            margin-right: 31px;
            height: 33px;
        }
        .icon-uploader .el-button--small {
            border-radius: 5px;
            width: 100px;
        }
        .el-upload--text {
            width: 100px;
            height: 40px;
            border: none;
        }
        .el-upload--text .el-icon-upload {
            line-height: 0;
            margin: 0;
            color: #fff;
            font-size: 14px;
        }
        .el-upload-list {
            display: none;
        }
        .img {
            width: 200px;
            height: 100px;
        }
        .tip {
            color: #ff4e4e;
            font-size: 12px;
            sortRank: absolute;
            left: 0;
            top: 80%;
        }
        .block {
            margin: 10px 0px;
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
            width: 360px;
        }
        .el-select .el-input__inner {
            width: 200px;
        }
        .el-dialog .el-upload--text {
            width: 100px;
            height: 40px;
            border: none;
        }
        .icon-area .el-input__inner {
            width: 240px;
        }
        .el-input__suffix {
            line-height: 24px;
        }
        .icon-uploader {
            float: right;
            margin-right: 31px;
            height: 33px;
        }
        .icon-uploader .el-button--small {
            border-radius: 5px;
            width: 100px;
        }
        .el-upload--text .el-icon-upload {
            line-height: 0;
            margin: 0;
            color: #fff;
            font-size: 14px;
        }
        .el-dialog__footer {
            margin-right: 30px;
        }
        .el-upload-list {
            display: none;
        }
        .inf-area {
            margin: -10px 0 10px 100px;
            .tips {
                color: #ff6868;
            }
        }
    }
</style>
