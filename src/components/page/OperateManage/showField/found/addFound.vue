<template>
    <div class="add-found">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item prop="adminName" label="发布者">
                    <el-select v-model="form.adminName">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="wcj" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="categoryId" label="选择分类">
                    <el-select v-model="form.categoryId">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="wcj" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="title" label="标题">
                    <el-input style="width: 210px" v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="上传封面图片">
                    <el-upload
                        :action="upload"
                        :on-success="uploadSuccess1"
                        :on-remove="handleRemove1"
                        :limit="6"
                        :file-list="fileList1"
                        list-type="picture-card">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">图片尺寸（336px*336px 336px446px 336px*250px）</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="上传图片">
                    <el-upload
                        :action="upload"
                        :on-success="uploadSuccess2"
                        :on-remove="handleRemove2"
                        :limit="6"
                        :file-list="fileList2"
                        list-type="picture-card">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">最多可上传6张（图片尺寸建议750px*750px）</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="文章内容">
                    <quill-editor v-model="form.content" ref="myQuillEditor" :options="editorOption"
                                  @change="onEditorChange($event)"></quill-editor>
                    <el-upload :action="upload" :on-success='upScuccess' ref="upload"
                               style="display:none">
                        <el-button size="small" type="primary" id="imgInput" element-loading-text="插入中,请稍候">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item prop="generalize" label="推广入口">
                    <el-radio-group v-model="form.generalize">
                        <el-radio label="1">精选</el-radio>
                        <el-radio label="2">热门</el-radio>
                        <el-radio label="3">推荐</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="商品推广">
                    <p class="link-position" v-for="(v, k) in linkPosition" :key="k">
                        <span>链接位置</span>
                        <el-input @blur="getProductName(v)" style="width: 210px" v-model="v.id" placeholder="产品ID"></el-input>
                        <span>{{v.name}}</span>
                        <span class="add" @click="delPosition(k)" type="primary">删除</span>
                    </p>
                    <p><span class="add" @click="addPosition" type="primary">新增</span></p>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="submitForm">保 存</el-button>
                    <el-button>取 消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import Quill from 'quill';
    import * as api from '@/api/api.js';
    import request from '@/http/http';

    export default {
        components: { vBreadcrumb },
        data() {
            return {
                nav: ['运营管理', '发现管理', '分类管理', '新建发布者'],
                id: '',
                form: {
                    adminName: '',
                    categoryId: '',
                    title: '',
                    content: '',
                    generalize: ''
                },
                linkPosition: [{ id: '', name: '' }],
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
                uploadType: '', // 上传的文件类型（图片、视频）,
                fileList1: [],
                fileList2: [],
                rules: {
                    title: [
                        { required: true, message: '请输入标题名称', trigger: 'blue' },
                        { min: 1, max: 20, message: '标题的文字不能超过1~20个字符', trigger: 'change' }
                    ],
                    adminName: [
                        { required: true, message: '请输入发布者', trigger: 'blue' }
                    ],
                    categoryId: [
                        { required: true, message: '请选择分类', trigger: 'blue' }
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
        },
        mounted() {
            // 为图片ICON绑定事件 getModule 为编辑器的内部属性
            this.$refs.myQuillEditor.quill
                .getModule('toolbar')
                .addHandler('image', this.imgHandler);
        },
        methods: {
            uploadSuccess1(res, file, fileList) {
                file.url = res.data;
                this.fileList1 = fileList;
            },
            handleRemove1(file, fileList) {
                this.fileList1 = fileList;
            },
            uploadSuccess2(res, file, fileList) {
                file.url = res.data;
                this.fileList2 = fileList;
            },
            handleRemove2(file, fileList) {
                this.fileList2 = fileList;
            },
            // 获取信息
            getInfo() {
                if (this.id === null) {
                    this.nav[3] = '新建发布者';
                } else {
                    this.nav[3] = '编辑发布者';
                }
            },
            // 富文本编辑器
            onEditorChange({ editor, html, text }) {
                this.form.content = html;
            },
            // 图片上传成功回调 插入到编辑器中
            upScuccess(e, file, fileList) {
                const vm = this;
                let url = '';
                if (this.uploadType === 'image') {
                    // 获得文件上传后的URL地址
                    url = e.data;
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
            },
            // 添加连接位置
            addPosition() {
                this.linkPosition.push({ id: '', name: '' });
            },
            // 删除链接
            delPosition(index) {
                this.linkPosition.splice(index, 1);
            },
            // 根据类型和code查询产品名称
            getProductName(row) {
                const data = {
                    code: row.id,
                    type: 1
                };
                request.getInfoByCode(data).then(res => {
                    if (res.data === '') {
                        this.$message.warning('暂无数据!');
                    }
                    row.name = res.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            // 提交表单
            submitForm() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        if (this.fileList2.length === 0) return this.$message.warning('请上传图片');
                        const imgArr1 = [];
                        const imgArr2 = [];
                        const codeArr = [];
                        if (this.fileList1.length !== 0) {
                            this.fileList1.forEach(v => {
                                imgArr1.push(v.url);
                            });
                        }
                        if (this.fileList2.length !== 0) {
                            this.fileList2.forEach(v => {
                                imgArr2.push(v.url);
                            });
                        }
                        if (this.linkPosition.length !== 0) {
                            this.linkPosition.forEach(v => {
                                codeArr.push(v.id)
                            });
                        }
                        const data = {
                            ...this.form,
                            coverImg: imgArr1.join(','),
                            img: imgArr2.join(','),
                            codeList: codeArr.join(',')
                        };
                        request.addDiscoverArticle(data).then(res => {
                            console.log(res);
                        }).catch(err => {
                            console.log(err);
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .add-found {
        .tip{
            font-size: 14px;
            color: #bbb;
            margin: 70px 0 0 10px;
            display: inline-block;
        }
        .link-position{
            margin-top: 20px;
            & span{
                font-size: 14px;
                margin-right: 10px;
            }
        }
        .add {
            cursor: pointer;
            margin-left: 10px;
            color: #33b4ff;
        }
    }
</style>
