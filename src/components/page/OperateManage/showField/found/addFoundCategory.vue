<template>
    <div class="add-found-cate">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card v-loading="pageLoading">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item prop="name" label="分类名称" name="asdasdssa">
                    <el-input style="width: 210px" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item prop="icon" label="分类图标">
                    <el-upload
                        v-loading="upLoading"
                        :action="upload"
                        :show-file-list="false"
                        :on-success="uploadSuccess"
                        :on-error = 'uploadError'
                        :before-upload="beforeAvatarUpload"
                        style="float: left">
                        <img v-if="form.icon" :src="form.icon">
                        <i v-else class="el-icon-plus"></i>
                    </el-upload>
                    <span class="tip">请上传jpg，jpeg，png格式图片3M以内</span>
                </el-form-item>
                <el-form-item label="">
                    <el-button :loading="btnLoading" type="primary" @click="submitForm">保 存</el-button>
                    <el-button>取 消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import * as api from '@/api/api.js';
    import request from '@/http/http';

    export default {
        name: 'addFoundCategory',
        components: { vBreadcrumb },
        data() {
            return {
                nav: ['运营管理', '发现管理', '分类管理', '新建发布者'],
                id: '',
                url: 'addDiscoverCategory',
                btnLoading: false,
                pageLoading: false,
                form: {
                    icon: '',
                    name: ''
                },
                upLoading: false,
                rules: {
                    icon: [
                        { required: true, message: '请添加分类图标' }
                    ],
                    name: [
                        { required: true, message: '请输入分类名称', trigger: 'blue' },
                        { min: 2, max: 20, message: '分类名称不可重复，字符长度2-20位', trigger: 'change' }
                    ]
                }
            };
        },
        computed: {
            upload() {
                return api.uploadImg;
            }
        },
        activated() {
            this.id = this.$route.query.foundId || sessionStorage.getItem('foundId');
            this.getInfo();
        },
        deactivated() {
            sessionStorage.clear('foundId');
            this.form = {};
        },
        methods: {
            beforeAvatarUpload() {
                this.upLoading = true;
            },
            uploadError(err) {
                this.upLoading = false;
            },
            uploadSuccess(res) {
                this.upLoading = false;
                this.form.icon = res.data;
            },
            // 获取信息
            getInfo() {
                if (this.id === null) {
                    this.nav[3] = '新建发布者';
                    this.form.id = '';
                    this.url = 'addDiscoverCategory';
                } else {
                    this.nav[3] = '编辑发布者';
                    this.pageLoading = true;
                    this.url = 'updateDiscoverCategory';
                    request.findDiscoverCategoryById({ id: this.id }).then(res => {
                        this.pageLoading = false;
                        this.form = res.data;
                    }).catch(err => {
                        this.pageLoading = false;
                    });
                }
            },
            // 提交表单
            submitForm() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.btnLoading = true;
                        request[this.url](this.form).then(res => {
                            this.btnLoading = false;
                            this.$message.success(res.msg);
                            this.$router.push('foundCategory');
                        }).catch(err => {
                            this.btnLoading = false;
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>
.add-found-cate {
    /deep/.el-upload--text{
        width: 100px;
        height: 100px;
        line-height: 100px;
        img {
            width: 100px;
            height: 100px;
        }
    }
    .tip{
        font-size: 14px;
        color: #bbb;
        margin: 70px 0 0 10px;
        display: inline-block;
    }
}
</style>
