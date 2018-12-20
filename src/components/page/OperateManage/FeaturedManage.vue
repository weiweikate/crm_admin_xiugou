<template>
    <div class="second-classify">
        <v-breadcrumb :nav="['运营管理','推荐位管理','推荐产品管理']"></v-breadcrumb>
        <div class="table-block">
            <el-button v-if="" type="primary" style="margin-bottom: 20px" @click="addClassify">添加banner图片</el-button>
            <template>
                <el-table :data="tableData" :height="height" border style="width: 100%">
                    <el-table-column type="index" label="编号" width="120" align="center"></el-table-column>
                    <el-table-column label="图片" align="center">
                        <template slot-scope="scope">
                            <img :src="scope.row.img_url" alt="">
                        </template>
                    </el-table-column>
                    <el-table-column prop="img_url" label="链接" align="center"></el-table-column>
                    <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                    <el-table-column prop="position" label="排序位置" align="center">
                    </el-table-column>
                    <el-table-column v-if="isShowOperate" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button v-if="" type="warning" size="small" @click="editItem(scope.row)">编辑</el-button>
                            <el-button v-if="" type="danger" size="small" @click="delItem(scope.row.id)">删除</el-button>
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
            </template>
        </div>

        <!--添加/编辑弹窗-->
        <el-dialog title="添加banner图片" :visible.sync="addMask">
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
                    <el-input v-model="addForm.linkTypeValue" placeholder="请输入ID" @change="searchProduct"
                              auto-complete="off"></el-input>
                </el-form-item>
                <div class="inf-area">{{productName}}</div>
                <el-form-item label="备注说明">
                    <el-input v-model="addForm.remark" placeholder="请输入备注说明" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序位置">
                    <el-input v-model="addForm.position" placeholder="请输入排序位置" auto-complete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrEdit('addForm')">确 认</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑banner图片" :visible.sync="editMask">
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
                    <el-input v-model="form.linkTypeValue" placeholder="请输入ID" @change="searchProduct"
                              auto-complete="off"></el-input>
                </el-form-item>
                <div class="inf-area">{{productName}}</div>
                <el-form-item label="备注说明">
                    <el-input v-model="form.remark" placeholder="请输入备注说明" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序位置">
                    <el-input v-model="form.position" placeholder="请输入排序位置" auto-complete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrEdit('form')">确 认</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!--删除弹窗-->
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>
</template>

<script>
    import vBreadcrumb from "@/components/common/Breadcrumb.vue";
    import icon from "@/components/common/ico.vue";
    import deleteToast from "@/components/common/DeleteToast";
    import * as api from "@/api/OperateManage/FeaturedManage";
    import utils from '@/utils/index.js'
    import * as pApi from '@/privilegeList/OperateManage/FeaturedManage';
    import {myMixinTable, queryDictonary} from '@/JS/commom';

    export default {
        components: {
            vBreadcrumb,
            icon,
            deleteToast
        },
        mixins: [myMixinTable, queryDictonary],
        data() {
            return {
                // 权限控制
                p: {
                    addFeatured: false,
                    updateFeatured: false,
                    deleteFeatured: false,
                },
                isShowOperate: true,

                tableData: [],
                height: '',
                addMask: false,
                editMask: false,
                isShowDelToast: false,
                form: {
                    img: '',
                    imgUrl: '',
                    linkType: '',
                    linkTypeValue: '',
                    remark: '',
                    position: ''
                },
                addForm: {
                    img: '',
                    imgUrl: '',
                    linkType: '',
                    linkTypeValue: '',
                    remark: '',
                    position: ''
                },
                id: "",
                itemId: "",
                name: "",
                itype: "",
                delId: '',
                delUrl: "",
                delUri: '',
                showDetail: false,
                productName: '',
                pageType: '',
                proId: true,
                linkTypeList: [],
            };
        },
        created() {
            let winHeight = window.screen.availHeight - 500;
            this.height = winHeight;
            this.pControl();
        },
        activated() {
            this.pControl();
            this.pageType = this.$route.query.pageType || sessionStorage.getItem("pageType");
            this.getList();
        },

        methods: {
            // 权限控制
            pControl() {
                for (const k in this.p) {
                    this.p[k] = utils.pc(pApi[k]);
                }
                if (!this.p.updateFeatured && !this.p.deleteFeatured) {
                    this.isShowOperate = false;
                }
            },
            //获取列表
            getList() {
                let data = {
                    page: this.page.currentPage,
                    pageType: this.pageType,
                    url: pApi.queryFeaturedList
                };
                this.$axios
                    .post(api.queryFeaturedList, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            this.tableData = [];
                            this.tableData = res.data.data.data;
                            this.page.totalPage = res.data.data.resultCount;
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            //分页
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.page.currentPage = val;
                this.getList(val)
            },
            // 添加
            async addClassify() {
                this.addMask = true;
                this.addForm.imgUrl = '';
                this.addForm.img = '';
                this.addForm.linkType = '';
                this.addForm.linkTypeValue = '';
                this.productName = '';
                this.addForm.remark = '';
                this.addForm.position = '';
                this.itype = "add";
                this.proId = true;
                await this.queryDictonary(9);
                this.linkTypeList = this.tmpAxiosData;
            },
            //编辑
            async editItem(row) {
                this.editMask = true;
                this.itemId = row.id;
                this.getDetail(row.id);
                this.itype = "edit";
                this.productName = '';
                this.proId = true;
                await this.queryDictonary(9);
                this.linkTypeList = this.tmpAxiosData;
            },
            //添加修改确定
            addOrEdit(formName) {
                let url = "";
                let data = {};
                data.imgUrl = this[formName].imgUrl;
                data.linkType = this[formName].linkType;
                data.linkTypeValue = this[formName].linkTypeValue;
                data.pageType = this.pageType;
                data.remark = this[formName].remark;
                data.position = this[formName].position;
                if (!data.imgUrl) {
                    this.$message.warning('请上传图片!');
                    return
                }
                if (!data.linkType) {
                    this.$message.warning('请选择类型!');
                    return
                }
                if (!data.linkTypeValue) {
                    this.$message.warning('请输入ID!');
                    return
                }
                if (!data.position) {
                    this.$message.warning('请输入排序!');
                    return
                }
                if (!this.proId) {
                    return false
                }
                if (this.itype == "add") {
                    url = api.addFeatured;
                    data.url = pApi.addFeatured;
                } else {
                    url = api.updateFeatured;
                    data.id = this.itemId;
                    data.url = pApi.updateFeatured;
                }
                this.btnLoading = true;
                this.$axios
                    .post(url, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            this.$message.success(res.data.msg);
                            this.btnLoading = false;
                            this.addMask = false;
                            this.editMask = false;
                            this.getList();
                        } else {
                            this.btnLoading = false;
                            this.$message.warning(res.data.msg);
                            this.getList();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            //删除
            delItem(id) {
                this.delId = id;
                this.delUrl = api.deleteFeatured;
                this.delUri = pApi.deleteFeatured;
                this.isShowDelToast = true;
            },
            // 删除弹窗
            deleteToast(msg) {
                this.isShowDelToast = msg;
                this.getList();
            },
            //上传图片
            handleAvatarSuccess(res, file) {
                if (this.itype == "add") {
                    this.addForm.img = res.data.imageUrl;
                    this.addForm.imgUrl = res.data.imageUrl;
                } else {
                    this.form.img = res.data.imageUrl;
                    this.form.imgUrl = res.data.imageUrl;
                }
            },
            //取消
            cancel() {
                this.addMask = false;
                this.editMask = false;
                this.getList();
            },
            //根据产品id查询产品名称
            searchProduct() {
                let data = {};
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
                        this.showDetail = true;
                        this.productName = res.data.data;
                        this.proId = true
                    })
                    .catch(err => {
                        console.log(err);
                        this.proId = false;
                    });
            },
            //获取详情
            getDetail(id) {
                let data = {
                    id: id,
                    pageType: this.pageType,
                };
                this.$axios
                    .post(api.findFeaturedById, data)
                    .then(res => {
                        this.form = res.data.data;
                        this.form.img = this.form.imgUrl;
                        this.form.linkType = this.form.linkType.toString();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
        },

    };
</script>

<style lang="less">
    .second-classify {
        /*表格样式*/
        .table-block {
            padding: 20px 20px 60px;
            background: #fff;
        }
        img {
            width: 94px;
            height: 94px;
            background-color: #ffffff;
            border-radius: 4px;
            border: solid 2px #dddddd;
        }
        .block {
            float: right;
            margin-top: 10px;
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
