<template>
    <div class="app-banner-adv">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }">
            <el-button @click="mask = true"  type="primary" style="margin-bottom:20px">添加banner图片
            </el-button>
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
        <el-dialog title="添加banner图片" :visible.sync="mask" :before-close="closeDia">
            <el-form v-model="form" label-width="100px">
                <el-form-item label="选择banner图" class="icon-area">
                    <el-input readonly v-model="form.imgUrl" placeholder="上传图片" auto-complete="off"></el-input>
                    <el-upload class="icon-uploader"
                               :action="uploadImg"
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
                    <el-input v-model="form.linkTypeValue" placeholder="请输入ID" @blur=""
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
                    <el-date-picker @blur="" class="input-style" v-model="form.date" type="datetimerange" range-separator="至"
                                    start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="dealAdv('form')">确 认</el-button>
                <el-button @click="closeDia">取 消</el-button>
            </div>
        </el-dialog>
        <deletetoast :id="delId" :url="delUrl" :uri="delUri" :status="3" @msg="deleteToast" v-if="isShowDel"></deletetoast>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import deletetoast from '@/components/common/DeleteToast';
    import * as api from '@/api/api.js';
    import { myMixinTable, queryDictonary } from '@/JS/commom';

    export default {
        components: {
            vBreadcrumb,
            deletetoast
        },
        mixins: [myMixinTable, queryDictonary],

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
                form: {
                    imgUrl: '',
                    linkType: '',
                    linkTypeValue: '',
                    remark: '',
                    sortRank: '',
                    date: []
                },
                linkTypeList: [], // 链接类型
                isShowDel: false,
                pageType: '', // 页面进来的名字
                status: '', // 弹出框的数据格式
                nav: ['运营管理', '广告位管理'] // 导航名称
            };
        },

        activated() {
            this.status = this.$route.query.appBannerAdvStatus || this.sessionStorage.getItem('appBannerAdvStatus');
            this.pageType = this.$route.query.appBannerAdvPageType || this.sessionStorage.getItem('appBannerAdvPageType');
            this.setConfig(this.status, this.pageType);
            // this.getList();
        },

        methods: {
            // 设置导航名字，以及样式
            setConfig(status, pageType) {
                let navName = '';
                this.uploadImg = api.uploadImg;
                switch (pageType) {
                    case 1: navName = 'APP首页banner广告位管理'; break;
                    case 2: navName = 'APP首页推荐位管理'; break;
                    case 3: navName = 'APP首页明星店铺推荐位管理'; break;
                    case 4: navName = 'APP首页今日榜单广告位管理'; break;
                    case 5: navName = 'APP首页精品推荐广告位管理'; break;
                    case 6: navName = 'APP首页超值热卖广告位管理'; break;
                    case 7: navName = 'APP首页专题广告位管理'; break;
                    case 8: navName = 'APP首页为你推荐广告位管理'; break;
                    case 9: navName = '拼店首页banner推荐位'; break;
                    case 10: navName = '类目搜索Banner广告位设置'; break;
                    case 11: navName = '秀场banner推荐图'; break;
                    case 12: navName = '登录首页头图展示位'; break;
                }
                this.nav[2] = navName;
            },
            // 获取数据
            getList() {

            },
            // 上传图片
            handleAvatarSuccess(res) {
                this.form.imgUrl = res.data;
            },
            // 添加编辑
            dealAdv() {
                console.log(this.form);
            },
            // 关闭弹窗
            closeDia() {
                this.form = {
                    imgUrl: '',
                    linkType: '',
                    linkTypeValue: '',
                    remark: '',
                    sortRank: '',
                    date: []
                };
                this.mask = false;
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
