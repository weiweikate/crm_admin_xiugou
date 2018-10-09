<template>
    <div>
        <v-breadcrumb :nav="['会员管理','会员层级管理','层级信息']"></v-breadcrumb>
            <div class="inf-box">
                <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
                <el-form :model="form" ref="form">
                    <div>用户晋升后所获得的权益：</div>
                    <el-form-item class="content-area">
                        <template>
                            <div style="display: inline-block">
                                <quill-editor v-model="form.content" ref="myQuillEditor" :options="editorOption"
                                              @change="onEditorChange($event)"></quill-editor>
                                <el-upload :action="uploadImg" :data="uploadData" :on-success='upSuccess' ref="upload"
                                           style="display:none">
                                    <el-button size="small" type="primary" id="imgInput" element-loading-text="插入中,请稍候">点击上传</el-button>
                                </el-upload>
                            </div>
                        </template>
                    </el-form-item>

                    <div class="submit-btn">
                        <el-button type="primary" :loading="btnLoading" @click="submitForm('form')">确认保存</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </div>
                </el-form>
                </el-card>
            </div>
    </div>

</template>
<script>
    import icon from '@/components/common/ico';
    import Quill from 'quill';
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import request from '@/http/http.js';
    import * as api from '@/api/api.js';
    export default {
        components: {
            vBreadcrumb, icon
        },
        data() {
            return {
                editorOption: {
                    placeholder: '请输入内容',
                    modules: {
                        // 配置富文本
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote', 'code-block'],
                            [{ header: 1 }, { header: 2 }],
                            [{ direction: 'rtl' }],
                            [{ size: ['small', false, 'large', 'huge'] }],
                            [{ header: [1, 2, 3, 4, 5, 6, false] }],
                            [{ color: [] }, { background: [] }],
                            [{ font: [] }],
                            [{ align: [] }],
                            ['clean'],
                            ['link', 'image']
                        ]
                    }
                },
                uploadImg: '',
                uploadData: {},
                uploadType: '', // 上传的文件类型（图片、视频）,
                form: {
                    content: '' //   内容
                },
                btnLoading: false,
                id: ''
            };
        },
        created() {
        },
        activated() {
            this.form.content = '';
            this.uploadImg = api.uploadImg;
        },
        computed: {
            qnLocation() {
                return api.uploadImg;
            }
        },
        // 页面加载后执行 为编辑器的图片图标和视频图标绑定点击事件
        mounted() {
            // 为图片ICON绑定事件 getModule 为编辑器的内部属性
            this.$refs.myQuillEditor.quill
                .getModule('toolbar')
                .addHandler('image', this.imgHandler);
        },
        methods: {
            // 取消
            cancel() {
                this.$router.push('/levelManage');
            },
            // 提交表单
            submitForm() {
                const that = this;
                const params = {};
                if (!params.content) {
                    that.$message.warning('请输入详情!');
                    return;
                }
                that.btnLoading = true;
                request.addNotice(params).then(res => {
                    that.$message.success(res.msg);
                    that.$router.push('/levelManage');
                    that.btnLoading = false;
                }).catch(err => {
                    that.btnLoading = false;
                });
            },
            // 富文本编辑器
            onEditorChange({ editor, html, text }) {
                this.form.content = html;
            },
            // 图片上传成功回调 插入到编辑器中
            upSuccess(e, file, fileList) {
                this.fullscreenLoading = false;
                const vm = this;
                let url = '';
                if (this.uploadType === 'image') {
                    // 获得文件上传后的URL地址
                    url = e.data;
                    this.form.original_img = e.data;
                    // this.form.small_img = e.data.imageThumbUrl;
                }
                if (url != null && url.length > 0) {
                    // 将文件上传后的URL地址插入到编辑器文本中
                    let value = url;
                    // this.$refs.myTextEditor.quillEditor.getSelection();
                    // 获取光标位置对象，里面有两个属性，一个是index 还有 一个length，这里要用range.index，即当前光标之前的内容长度，然后再利用 insertEmbed(length, 'image', imageUrl)，插入图片即可。
                    vm.addRange = vm.$refs.myQuillEditor.quill.getSelection();
                    value = value.indexOf('http') !== -1 ? value : 'http:' + value;
                    vm.$refs.myQuillEditor.quill.insertEmbed(
                        vm.addRange !== null ? vm.addRange.index : 0,
                        vm.uploadType,
                        value,
                        Quill.sources.USER
                    ); // 调用编辑器的 insertEmbed 方法，插入URL
                    this.$message.success('插入成功');
                } else {
                    this.$message.error(`${vm.uploadType}插入失败`);
                }
                this.$refs['upload'].clearFiles(); // 插入成功后清除input的内容
            },
            // 点击图片ICON触发事件
            imgHandler(state) {
                this.addRange = this.$refs.myQuillEditor.quill.getSelection();
                if (state) {
                    const fileInput = document.getElementById('imgInput');
                    fileInput.click(); // 加一个触发事件
                }
                this.uploadType = 'image';
            }
        }
    };
</script>
<style lang="less">
    .inf-box {
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
        .opr-area {
            float: left;
            width: 150px;
            text-align: center;
            margin-left: -10px;
        }
        .opr-area .el-button {
            margin-top: 30px
        }
        .opr-area .el-button:nth-child(2) {
            margin-left: 0
        }
        .check-area {
            float: left;
            width: 191px;
            font-size: 12px;
            color: #999;
            border: 1px solid #dfdfdf;
            margin-right: 10px;
            border-radius: 5px;
        }
        .clearfix {
            clear: both;
            content: ''
        }
        .title {
            background: #eee;
            height: 28px;
            line-height: 28px;
            text-align: center;
            border-bottom: 1px solid #dfdfdf;
        }
        ul {
            line-height: 25px;
            height: 120px;
            overflow-y: auto;
            overflow-x: hidden
        }
        ul li {
            list-style: none;
            padding-left: 10px;
            cursor: pointer
        }
        ul li.selected {
            background: #409EFF;
            color: #fff
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
        .el-checkbox-group {
            margin-left: 112px;
        }
        .el-radio {
            display: block;
            margin-left: 0 !important;
            line-height: 32px;
        }
        .el-date-editor {
            position: absolute;
            top: 32px;
            left: 210px;
            .el-input__inner {
                width: 200px;
            }
        }
        .el-date-editor.el-input {
            width: 200px
        }
        .region-area {
            position: relative;
            .el-checkbox {
                display: block;
                margin-left: 0;
            }
        }
        .el-cascader {
            position: absolute;
            top: -5px;
            left: 180px;
            .el-input {
                width: 150px;
            }
            .el-input__inner {
                width: 150px;
            }
        }
        .quill-editor {
            width: 800px;
        }
        .detail-content,.el-textarea__inner{
           width: 350px;
           height: 200px;
           resize: none;
           overflow: hidden;
        }
        .content-area{
            position: relative;
            .content-count{
                position: absolute;
                left: 345px;
                bottom: 0;
                color: #a5a5a5;
                display: inline-block;
                width: 100px;
                text-align: right;
            }
        }
    }
</style>


