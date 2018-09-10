<template>
    <div>
        <v-breadcrumb :nav="['品牌产品管理','品牌管理','编辑品牌']"></v-breadcrumb>
        <div class="container">
            <div class="brand-box">
                <el-form :model="form" ref="form" :rules="rules">
                    <el-form-item prop="name" label="品牌名称">
                        <el-input placeholder="请输入品牌名称" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item prop="area" label="品牌区域">
                        <el-input placeholder="请输入品牌区域" v-model="form.area"></el-input>
                    </el-form-item>
                    <el-form-item class="classify-area" prop="productcIds" label="品牌类目">
                        <!--<v-choosearea @productcIds="productcIds" @brandsId="brandsId" v-model="form.productcIds" :detailData="detailData"-->
                                      <!--:addOrUp="isUp?'update':''"></v-choosearea>-->
                        <v-choosearea @productcIds="productcIds" v-model="form.productcIds" :detailData="detailData"
                                      :addOrUp="'update'"></v-choosearea>
                        <div class="clearfix"></div>
                    </el-form-item>
                    <el-form-item prop="original_img" label="品牌logo">
                        <el-upload
                                class="avatar-uploader"
                                action="/admin/ossClient/aliyunOSSUploadImage"
                                :show-file-list="false"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :on-success="handleAvatarSuccess"
                        >
                            <img v-if="form.original_img" :src="form.original_img" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <el-input v-model="form.small_img"></el-input>
                        </el-upload>
                    </el-form-item>
                    <el-form-item prop="status" label="是否启用">
                        <el-radio-group v-model="form.status">
                            <el-radio label="1">启用</el-radio>
                            <el-radio label="2">停用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div class="submit-btn">
                        <el-button type="primary" :loading="btnLoading" @click="submitForm('form')">确认保存</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </div>

</template>
<script>
    import icon from "../../../common/ico";
    import vBreadcrumb from '../../../common/Breadcrumb.vue';
    import vChoosearea from '../../../common/chooseClassify.vue';
    import * as api from '../../../../api/api'
    import * as pApi from '../../../../privilegeList/index.js';

    export default {
        components: {
            vBreadcrumb, icon, vChoosearea
        },
        data() {
            return {
                form: {
                    name: "",
                    original_img: '',
                    small_img: '',
                    area: '',
                    status: '1',
                    productcIds: ''
                },
                detailData: [],
                btnLoading: false,
                classifyId: [],
                checkAll: false,
                rules: {
                    name: [
                        {required: true, message: "请输入品牌名称", trigger: "blur"}
                    ],
                    area: [
                        {required: true, message: "请输入品牌区域", trigger: "blur"}
                    ],
                    productcIds: [
                        {required: true, message: "请选择品牌类目", trigger: "blur"}
                    ],
                    original_img: [
                        {required: true, message: "请上传品牌LOGO", trigger: "blur"}
                    ]
                },
                isUp: false,//添加false，修改true
                id: '',
                addBrand:''
            }
        },
        activated() {
            let that = this;
            that.id = that.$route.query.brandId || sessionStorage.getItem('brandId');
            that.getDetail();
        },
        methods: {
            //获取详情
            getDetail() {
                let that = this;
                let data = {
                    id: that.id
                };
                that.loading = true;
                that.$axios
                    .post(api.findBrandById, data)
                    .then(res => {
                        if (res.data.code == 200) {
                            that.loading = false;
                            that.form = res.data.data.product;
                            that.form.status=that.form.status.toString();
                            that.detailData = res.data.data.userProduct;
                        } else {
                            that.loading = false;
                            that.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        that.loading = false
                    })
            },
            handlePreview(file) {
                console.log(file);
            },
            //上传图片
            handleAvatarSuccess(res, file) {
                this.form.original_img = res.data.imageUrl;
                this.form.small_img = res.data.imageThumbUrl;
            },
            productcIds(productcIds) {
                this.form.productcIds = productcIds.join(',');
            },
            // brandsId(brandsId) {
            // },
            handleRemove() {
                this.form.original_img = ''
            },
            // 提交表单
            submitForm(form) {
                let that = this;
                that.btnLoading = true;
                that.$refs[form].validate(valid => {
                    if (valid) {
                        let data = {};
                        data.originalImg = this[form].original_img;
                        data.smallImg = this[form].small_img;
                        data.name=this[form].name;
                        data.area=this[form].area;
                        data.status=this[form].status;
                        data.productcIds=this[form].productcIds;
                        data.id = that.id;
                        data.url = pApi.updateBrand;
                        this.$axios
                            .post(api.updateBrand, data)
                            .then(res => {
                                if (res.data.code == 200) {
                                    that.$message.success(res.data.msg);
                                    setTimeout(function () {
                                        that.$router.push('/brandManage');
                                        that.btnLoading = false;
                                    }, 1000)
                                } else {
                                    that.$message.warning(res.data.msg);
                                    that.btnLoading = false;
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                that.btnLoading = false;
                            });
                    } else {
                        console.log("error submit!!");
                        that.btnLoading = false;
                        return false;
                    }
                });
            },
            //取消
            cancel() {
                this.$router.push('/brandManage');
            },
        }
    };
</script>
<style lang="less">
    .brand-box {
        .label {
            width: 100px;
            text-align: right;
            display: inline-block;
            margin-right: 10px;
            vertical-align: top;
        }
        .el-input {
            width: 350px
        }
        .el-input__inner {
            width: 350px
        }
        .classify-area {
            .el-input {
                width: 200px
            }
            .el-input__inner {
                width: 200px
            }
        }
        .required {
            color: #ff1e30;
            margin-right: 5px;
        }
        .el-form-item__label {
            width: 112px;
        }

        .clearfix {
            clear: both;
            content: ''
        }
        .select-area {
            width: 500px;
            max-height: 150px;
            overflow-x: hidden;
            overflow-y: auto;
            border: 1px solid #eee;
            border-radius: 10px;
        }
        .select-area .el-checkbox {
            margin: 0 10px 0
        }
        .select-area .el-checkbox-group {
            font-size: 12px;
            line-height: 10px
        }
        .submit-btn {
            padding: 0 50px 20px 100px
        }
        .avatar-uploader {
            height: 70px;
            display: inline-block;
        }
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 70px;
            height: 70px;
            line-height: 70px;
            text-align: center;
        }
        .avatar {
            width: 70px;
            height: 70px;
            display: block;
        }
        .el-upload--text {
            width: 70px;
            height: 70px;
        }
        .el-form-item__error {
            margin-left: 120px;
        }
    }
</style>


