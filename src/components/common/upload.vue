<template>
    <el-upload class="icon-uploader"
               :action="uploadImg"
               :show-file-list="false"
               :on-success="handleSuccess"
               :before-upload="beforeUpload">
        <el-button style="width:100px;height:32px" size="small" type="primary">上传</el-button>
    </el-upload>
</template>
<script>
import * as api from '@/api/api.js';
export default {
    props: [],
    data() {
        return {
            // 上传图片
            uploadImg: '',
            img: '',
            width: '',
            height: ''
        };
    },
    created() {
        this.uploadImg = api.uploadImg;
    },
    methods: {
        beforeUpload(file) {
            const _this = this;
            const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt3M = file.size / 1024 / 1024 < 3;
            const isSize = new Promise(function(resolve, reject) {
                const _URL = window.URL || window.webkitURL;
                const img = new Image();
                img.onload = function() {
                    const valid = isJPG && isLt3M;
                    _this.width = img.width;
                    _this.height = img.height;
                    valid ? resolve() : reject();
                };
                img.src = _URL.createObjectURL(file);
            }).then(() => {
                return file;
            }, () => {
                _this.$message.error('请上传3M以内jpg,jpeg,png格式的图片!');
                return Promise.reject();
            });
            return isSize;
        },
        handleSuccess(res) {
            this.img = res.data;
            const tempArr = [];
            tempArr.push(this.img, this.width, this.height);
            this.$emit('img', tempArr);
        }
    }
};
</script>
<style lang="less" scoped>
    .icon-uploader{float: right;margin-right: 103px;width: 100px;}
    .el-upload--text {width: 100px;height: 35px;border: none;}
</style>


