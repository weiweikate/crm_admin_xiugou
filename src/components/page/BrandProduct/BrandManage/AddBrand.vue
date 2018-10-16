<template>
    <div>
        <v-breadcrumb :nav="['品牌产品管理','品牌管理','添加品牌']"></v-breadcrumb>
        <div class="container">
            <div class="brand-box">
                <el-form :model="form" ref="form" :rules="rules">
                    <el-form-item prop="name" label="品牌名称">
                        <el-input placeholder="请输入品牌名称" v-model="form.name" minlength="2" maxlength="16"></el-input>
                    </el-form-item>
                    <el-form-item prop="area" label="品牌区域">
                        <el-input placeholder="请输入品牌区域" v-model="form.area"></el-input>
                    </el-form-item>
                    <el-form-item prop="original_img" label="品牌logo">
                        <el-upload
                                class="avatar-uploader"
                                :action="uploadImg"
                                :show-file-list="false"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :before-upload="beforeAvatarUpload"
                                :on-success="handleAvatarSuccess"
                        >
                            <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <el-input v-model="form.imgUrl"></el-input>
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
    import icon from '@/components/common/ico';
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import request from '@/http/http.js';
    import * as api from '@/api/api.js';
    import { beforeAvatarUpload } from '@/JS/commom';

    export default {
        components: {
            vBreadcrumb, icon
        },
        mixins: [beforeAvatarUpload],
        data() {
            var checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入品牌名称'));
                } else {
                    if (value.length < 2 || value.length > 16) {
                        callback(new Error('请输入2-16位的品牌名称'));
                    } else {
                        callback();
                    }
                }
            };
            var checkArea = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入品牌区域'));
                } else {
                    const reg = /^[A-Za-z\u4e00-\u9fa5]{2,16}$/;
                    if (!reg.test(value)) {
                        callback(new Error('请输入2-16位由汉字字母组成的品牌区域'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                form: {
                    name: '',
                    area: '',
                    imgUrl: '',
                    status: '1'
                },
                detailData: [],
                btnLoading: false,
                classifyId: [],
                checkAll: false,
                rules: {
                    name: [
                        { required: true, trigger: 'blur', validator: checkName }
                    ],
                    area: [
                        { required: true, trigger: 'blur', validator: checkArea }
                    ],
                    // imgUrl: [
                    //     { required: true, message: '请上传品牌LOGO', trigger: 'blur' }
                    // ],
                    status: [
                        { required: true, message: '是否启用', trigger: 'blur' }
                    ]
                },
                id: '',
                addBrand: '',
                uploadImg: ''
            };
        },
        activated() {
            this.form.name = '';
            this.form.imgUrl = '';
            this.form.area = '';
            this.form.status = '1';
            this.uploadImg = api.uploadImg;
        },
        methods: {
            handlePreview(file) {
                console.log(file);
            },
            // 上传图片
            handleAvatarSuccess(res, file) {
                this.form.imgUrl = res.data;
            },
            handleRemove() {
                this.form.imgUrl = '';
            },
            // 提交表单
            submitForm(form) {
                const that = this;
                that.$refs[form].validate(valid => {
                    if (valid) {
                        const data = this[form];
                        if (!data.imgUrl) {
                            this.$message.warning('请添加品牌logo');
                            return;
                        }
                        that.btnLoading = true;
                        request.addProductBrand(data).then(res => {
                            this.$message.success(res.msg);
                            that.$router.push('/brandManage');
                            that.btnLoading = false;
                        }).catch(error => {
                            console.log(error);
                            that.btnLoading = false;
                        });
                    } else {
                        console.log('error submit!!');
                        that.btnLoading = false;
                        return false;
                    }
                });
            },
            // 取消
            cancel() {
                this.$router.push('/brandManage');
            }

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


