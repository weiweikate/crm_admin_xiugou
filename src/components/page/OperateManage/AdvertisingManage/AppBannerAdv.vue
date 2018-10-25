<template>
    <div class="app-banner-adv">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }">
            <el-button @click="addItem"  type="primary" style="margin-bottom:20px" v-if="pageType!=10">添加产品
            </el-button>
            <el-table border :data="tableData">
                <el-table-column type="index" label="编号" align="center" v-if="pageType!=10" key="0"></el-table-column>
                <el-table-column prop="firstStageId" label="编号" align="center" v-if="pageType == 10" key="12"></el-table-column>
                <el-table-column prop="firstStageName" label="一级分类" align="center" v-if="pageType == 10" key="1"></el-table-column>
                <el-table-column prop="" label="产品" v-if="pageType == 8" key="2" min-width="120">
                    <template slot-scope="scope">
                        <div class="product-img">
                            <img :src="scope.row.imgUrl">
                        </div>
                        <p class="product-name">{{scope.row.describe}}</p>
                        <p class="product-id">产品ID：{{scope.row.linkTypeCode}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" align="center" v-if="pageType == 8" key="3">
                </el-table-column>
                <el-table-column prop="" label="状态" align="center" v-if="pageType == 8" key="4">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status==1">有效</template>
                        <template v-if="scope.row.status==0">无效</template>
                    </template>
                </el-table-column>
                <el-table-column v-if="pageType!=8" label="图片" align="center" min-width="220" key="5">
                    <template slot-scope="scope">
                            <img :src="scope.row.imgUrl">
                    </template>
                </el-table-column>
                <el-table-column label="店长/店铺名称" align="center" v-if="pageType == 3" key="6">
                    <template slot-scope="scope">
                        {{scope.row.binour}}<br>{{scope.row.storeName}}
                    </template>
                </el-table-column>
                <el-table-column prop="linkTypeCode" label="链接" align="center" v-if="pageType == 2" key="7"></el-table-column>
                <el-table-column prop="linkTypeCode" label="ID" align="center" v-if="pageType != 2 && pageType != 8 && pageType != 12" key="8"></el-table-column>
                <el-table-column label="上传人/上传时间" align="center" v-if="pageType == 12" key="9"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                <el-table-column prop="showBegintime" label="投放时间" align="center" key="10" v-if="pageType != 2 && pageType != 6 && pageType != 7 && pageType != 8 && pageType != 12">
                    <template slot-scope="scope">
                        {{scope.row.showBegintime|formatDateAll}}~<br>{{scope.row.showEndtime|formatDateAll}}
                    </template>
                </el-table-column>
                <el-table-column prop="rank" label="排序" v-if="pageType!=10&&pageType!=12" align="center" key="11"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click='editItem(scope.row)' type="primary">编辑</el-button>
                        <el-button type="warning" @click="del(scope.row.id)" v-if="pageType!=10&&pageType!=12">删除</el-button>
                        <el-button type="warning" @click="clearData(scope.row.id)" v-if="pageType==10&&scope.row.id">清空</el-button>
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
        </el-card>
        <!--添加/编辑弹窗-->
        <el-dialog :title="title" :visible.sync="mask" :before-close="closeDia">
            <el-form v-model="form" label-width="100px">
                <el-form-item label="选择banner图" class="icon-area" v-if="pageType!=8">
                    <el-input readonly v-model="form.imgUrl" placeholder="上传图片" auto-complete="off"></el-input>
                    <el-upload class="icon-uploader"
                               :action="uploadImg"
                               :on-success="handleAvatarSuccess"
                               :before-upload="beforeAvatarUpload">
                        <el-button size="small" type="primary"><i class="el-icon-upload"></i>上传</el-button>
                    </el-upload>
                </el-form-item>
                <div class="inf-area" v-if="pageType!=8">
                    <img :src="form.imgUrl" alt="" class="banner-img">
                    <div class="tips">建议图片尺寸350px*350px</div>
                </div>
                <el-form-item v-if="pageType!=3&&pageType!=12" label="请选择类型">
                    <el-select v-model="form.linkType" placeholder="请选择类型" @change="getProductName">
                        <el-option v-for="(v,k) in linkTypeList" :key="k" :label="v.type" :value="v.id">{{v.type}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="pageType!=3&&pageType!=6&&pageType!=12" label="请输入ID">
                    <el-input v-model="form.linkTypeCode" placeholder="请输入ID" @blur="getProductName"
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="pageType==3" label="请输入店铺ID">
                    <el-input v-model="form.linkTypeCode" placeholder="请输入ID" @blur="getProductName"
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="pageType==6&&form.linkType!=6" label="请输入ID/地址">
                    <el-input v-model="form.linkTypeCode" placeholder="请输入ID/地址" @blur="getProductName"
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="pageType==6&&form.linkType==6" label="请输入ID/地址">
                    <el-input v-model="form.linkTypeCode" placeholder="请输入ID/地址" auto-complete="off"></el-input>
                </el-form-item>
                <div class="inf-area">{{productName}}</div>
                <el-form-item label="备注说明" v-if="pageType!=8">
                    <el-input v-model="form.remark" placeholder="请输入备注说明" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="标题" v-if="pageType==8">
                    <el-input v-model="form.title" placeholder="请输入说明" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" v-if="pageType==8">
                    <el-input v-model="form.remark" placeholder="请输入备注" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" v-if="pageType!=10&&pageType!=12">
                    <el-input v-model="form.rank" placeholder="请输入排序" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="pageType!=2&&pageType!=6&&pageType!=7&&pageType!=8&&pageType!=12" prop="date" label="投放时间">
                    <el-date-picker @blur="changeTime" class="input-style" v-model="form.date" type="datetimerange" range-separator="至"
                                    start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="dealAdv('form')">确 认</el-button>
                <el-button @click="mask=false">取 消</el-button>
            </div>
        </el-dialog>
        <!--删除-->
        <deletetoast :id="delId" :url="delUrl" :status="3" @msg="deleteToast" v-if="isShowDel"></deletetoast>
        <!--清空-->
        <div class="clear-mask" v-if="isShowClear">
            <div class="box">
                <div class="mask-title"><icon class="ico" ico='icon-jinggao'/>  温馨提示</div>
                <div class="mask-content">
                    <span class="del-tip">确定要清空该广告位吗？</span>
                    <div class="del-btn-group">
                        <el-button :loading="btnLoading" @click="clearToask(true)" class="del-btn" type="danger">确定</el-button>
                        <el-button @click="clearToask(false)">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import deletetoast from '@/components/common/DeleteToast';
    import * as api from '@/api/api.js';
    import moment from 'moment';
    import { myMixinTable, queryDictonary, beforeAvatarUpload } from '@/JS/commom';
    import request from '@/http/http.js';

    export default {
        components: {
            vBreadcrumb,
            deletetoast
        },
        mixins: [myMixinTable, queryDictonary, beforeAvatarUpload],

        data() {
            return {
                isAddBanner: false,
                diaTitle: '添加Banner图片',
                formLabelWidth: '130px',
                tableData: [], // { id: 1,img:'src/assets/images/avatar.jpg' }
                mask: false,
                btnLoading: false,
                uploadImg: '',
                productName: '',
                page: {
                    currentPage: 1,
                    totalPage: 0
                },
                form: {
                    imgUrl: '',
                    linkType: '',
                    linkTypeCode: '',
                    remark: '',
                    rank: '',
                    date: [],
                    title: ''
                },
                id: '',
                linkTypeList: [{
                    type: '链接产品',
                    id: 1
                }, {
                    type: '链接专题',
                    id: 2
                }, {
                    type: '降价拍',
                    id: 3
                }, {
                    type: '秒杀',
                    id: 4
                }, {
                    type: '礼包',
                    id: 5
                }], // 链接类型
                isShowDel: false,
                pageType: '', // 页面进来的名字
                status: '', // 弹出框的数据格式
                nav: ['运营管理', '广告位管理'], // 导航名称
                title: '添加banner图片', // 弹窗名称
                isShowClear: false// 清空确认弹窗

            };
        },
        activated() {
            this.status = this.$route.query.appBannerAdvStatus || sessionStorage.getItem('appBannerAdvStatus');
            this.pageType = this.$route.query.appBannerAdvPageType || sessionStorage.getItem('appBannerAdvPageType');
            this.setConfig(this.status, this.pageType);
            this.tableData = [];
            this.getList(this.page.currentPage);
        },

        methods: {
            changeTime() {
                this.$mount();
            },
            // 设置导航名字，以及样式
            setConfig(status, pageType) {
                let navName = '';
                this.uploadImg = api.uploadImg;
                pageType = typeof navName === 'string' ? Number(pageType) : pageType;
                this.title = pageType === 8 ? '添加' : '添加banner图片';
                if (pageType === 6) {
                    this.linkTypeList = [{ type: '链接', id: 6 }, { type: '专题', id: 2 }, { type: '产品', id: 1 }, { type: '礼包', id: 5 }];
                } else if (pageType === 8) {
                    this.linkTypeList = [{
                        type: '链接产品',
                        id: 1
                    }, {
                        type: '降价拍',
                        id: 3
                    }, {
                        type: '秒杀',
                        id: 4
                    }, {
                        type: '礼包',
                        id: 5
                    }];
                } else {
                    this.linkTypeList = [{
                        type: '链接产品',
                        id: 1
                    }, {
                        type: '链接专题',
                        id: 2
                    }, {
                        type: '降价拍',
                        id: 3
                    }, {
                        type: '秒杀',
                        id: 4
                    }, {
                        type: '礼包',
                        id: 5
                    }];
                }
                switch (pageType) {
                    case 1: navName = 'APP首页banner广告位管理'; break;
                    case 2: navName = 'APP首页推荐位管理'; break;
                    case 3: navName = 'APP首页明星店铺推荐位管理'; break;
                    case 4: navName = 'APP首页今日榜单广告位管理'; break;
                    case 5: navName = 'APP首页精品推荐广告位管理'; break;
                    case 6: navName = 'APP首页超值热卖专题广告位管理'; break;
                    case 8: navName = 'APP首页为你推荐广告位管理'; break;
                    case 9: navName = '拼店首页banner推荐位'; break;
                    case 10: navName = '类目搜索Banner广告位设置'; break;
                    case 11: navName = '秀场banner推荐图'; break;
                    case 12: navName = '登录首页头图展示位'; break;
                }
                this.nav[2] = navName;
            },
            // 获取数据
            getList(val) {
                const data = {
                    page: val,
                    pageSize: this.page.pageSize,
                    type: this.pageType
                };
                this.page.currentPage = val;
                this.tableLoading = true;
                this.tableData = [];
                request.queryAdvertisementPageList(data).then(res => {
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                    this.tableLoading = false;
                }).catch(error => {
                    console.log(error);
                    this.tableLoading = false;
                });
            },
            // 上传图片
            handleAvatarSuccess(res) {
                this.form.imgUrl = res.data;
            },
            // 根据类型和code查询产品名称
            getProductName() {
                const data = {
                    code: this.form.linkTypeCode,
                    type: this.form.linkType
                };
                if (this.pageType == 3) {
                    data.type = 8;
                    if (!data.code) return;
                } else {
                    if (!data.code || !data.type) return;
                }
                request.getInfoByCode(data).then(res => {
                    this.productName = res.data;
                    if (!res.data) {
                        this.$message.warning('无效ID');
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // 添加
            addItem() {
                this.closeDia();
                this.mask = true;
            },
            // 编辑
            editItem(row) {
                this.id = row.id;
                this.mask = true;
                this.form.imgUrl = row.imgUrl;
                this.form.linkType = row.linkType;
                this.form.linkTypeCode = row.linkTypeCode;
                this.form.remark = row.remark;
                this.form.rank = row.rank;
                this.form.title = row.title;
                this.form.firstStageId = row.firstStageId;
                this.form.date = [];
                if (row.showBegintime) {
                    this.form.date[0] = row.showBegintime;
                    this.form.date[1] = row.showEndtime;
                }
                this.title = this.pageType === 8 ? '编辑' : '编辑banner图片';
                if (this.pageType != 12 && (this.pageType == 6 && this.form.linkType != 6)) {
                    this.getProductName();
                }
            },
            // 添加编辑
            dealAdv() {
                const data = this.form;
                let url = 'addAdvertisement';
                if (this.id) {
                    data.id = this.id;
                    url = 'updateAdvertisement';
                }
                data.type = this.pageType;
                if (this.form.date && this.form.date.length) {
                    data.showBegintime = this.form.date ? moment(this.form.date[0]).format('YYYY-MM-DD HH:mm:ss') : '';
                    data.showEndtime = this.form.date ? moment(this.form.date[1]).format('YYYY-MM-DD HH:mm:ss') : '';
                }
                if (this.pageType != 12 && (this.pageType == 6 && this.form.linkType != 6)) {
                    if (!this.productName) {
                        this.$message.warning('请输入有效ID');
                        return;
                    }
                }
                if (this.pageType != 10 && this.pageType != 12) {
                    if (!this.form.rank) {
                        this.$message.warning('请输入排序');
                        return;
                    }
                }
                this.btnLoading = true;
                request[url](data).then(res => {
                    this.$message.success(res.msg);
                    this.getList(1);
                    this.closeDia();
                    this.btnLoading = false;
                }).catch(error => {
                    console.log(error);
                    this.btnLoading = false;
                    this.getList(1);
                    this.closeDia();
                });
            },
            // 关闭弹窗
            closeDia() {
                this.form = {
                    imgUrl: '',
                    linkType: '',
                    linkTypeCode: '',
                    remark: '',
                    rank: '',
                    date: [],
                    title: ''
                };
                this.id = '';
                this.productName = '';
                this.mask = false;
            },
            // 删除
            del(val) {
                this.delUrl = 'deleteAdvertisement';
                this.delId = val;
                this.isShowDel = true;
            },
            deleteToast(msg) {
                this.isShowDel = msg;
                this.getList(1);
            },
            clearData(id) {
                this.isShowClear = true;
                this.delId = id;
                this.delUrl = 'deleteAdvertisement';
            },
            clearToask(status) {
                if (status === true) {
                    const that = this;
                    that.btnLoading = true;
                    const url = this.delUrl;
                    const data = { id: that.delId };
                    request[url](data).then(res => {
                        that.btnLoading = false;
                        this.$message.success(res.msg);
                        this.getList(1);
                        this.isShowClear = false;
                    }).catch(err => {
                        that.tableLoading = false;
                        this.isShowClear = false;
                    });
                } else {
                    this.isShowClear = false;
                }
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
            rank: absolute;
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
        .product-img {
            display: inline-block;
            float: left;
            width: 80px;
            height: 80px;
            border: 1px solid #ddd;
            overflow: hidden;
            img {
                width: 60px;
                height: 60px;
                margin: 10px;
            }
        }
        .product-name {
            float: left;
            width: 65%;
            height: auto;
            margin: 5px 0 0 20px;
        }
        .product-id {
            float: left;
            width: 65%;
            height: auto;
            margin: 20px 0 0 20px;
        }
        .clear-mask {
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
    }
</style>
