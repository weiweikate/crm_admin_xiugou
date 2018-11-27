<template>
    <div class="prod-message">
        <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="100px">
            <div class="pro-title">图文描述</div>
            <el-form-item label="商品主图">
                <el-upload v-if="form.video === ''" list-type="picture-card" class="fl" :before-upload="beforeUploadVideo" :action="imgUpload" :show-file-list="false" :on-success="successUploadVideo">
                    <i class="el-icon-plus" style="font-size: 14px">添加视频</i>
                    <div slot="tip" class="el-upload__tip">请控制在5M以内</div>
                </el-upload>
                <div class="img-list fl" v-else style="margin-right: 0px">
                    <div class="del-mask">删 除</div>
                    <video :src="form.video" style="width: 150px;height: 150px" controls="controls"></video>
                </div>
                <div class="sep-video fl"></div>
                <draggable v-model="imgList">
                    <transition-group>
                        <div v-for="(v,k) in imgList" class="fl" :key="k">
                            <div class="img-list">
                                <div @click="handleRemoveImg(k, 'imgList')" class="del-mask">删 除</div>
                                <img :src="v" alt="">
                            </div>
                        </div>
                    </transition-group>
                </draggable>
                <el-upload
                    class="fl"
                    :action="imgUpload"
                    multiple
                    :before-upload="(file)=>beforeUploadImg(file, 'mainImg')"
                    :on-success="uploadImgSuccess"
                    :show-file-list ='false'
                    list-type="picture-card">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip" style="width: 150px">建议尺寸800*800，拖拽图片可更换顺序第一张默认为头图，请控制在3M以内</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="商品详情">
                <draggable v-model="imgInfoList">
                    <transition-group>
                        <div v-for="(v,k) in imgInfoList" class="fl" :key="k">
                            <div class="img-list">
                                <div @click="handleRemoveImg(k, 'imgInfoList')" class="del-mask">删 除</div>
                                <img :src="v" alt="">
                            </div>
                        </div>
                    </transition-group>
                </draggable>
                <el-upload
                    class="fl"
                    :action="imgUpload"
                    multiple
                    :before-upload="(file)=>beforeUploadImg(file, 'infoImg')"
                    :on-success="uploadInfoImgSuccess"
                    :show-file-list ='false'
                    list-type="picture-card">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip" style="width: 150px">拖拽图片可更换顺序，请控制在3M以内</div>
                </el-upload>
            </el-form-item>
            <div class="pro-title">物流信息</div>
            <el-form-item prop="delivery" label="是否需要发货">
                <el-select v-model="form.delivery">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="feightTpl" label="运费模板">
                <el-select v-model="form.feightTpl">
                    <el-option label="t1" value="1"></el-option>
                    <el-option label="t2" value="2"></el-option>
                </el-select>
                <span class="primary-text">添加运费模板</span>
                <span class="primary-text">|</span>
                <span class="primary-text">刷新</span>
            </el-form-item>
            <el-form-item prop="feightTpl" label="不支持配送区域">
                <div class="area-list" v-if="unSupportsssAreasData.length !== 0">
                    <el-tag type="primary" v-for="(v, k) in unSupportsssAreasData" :key="k">{{v}}</el-tag>
                </div>
                <el-button type="danger" @click="unSupportMask = true">添加区域</el-button>
            </el-form-item>
            <div class="pro-title">其他信息</div>
        </el-form>
        <!--区域选择-->
        <choose-area @getArea='chooseUnSupportArea' :chooseData="unSupportAreasData" :preData="unSupportAreasData" :isSingleLine="true" v-if="unSupportMask"></choose-area>
    </div>
</template>

<script>
    import request from '@/http/http';
    import * as api from '@/api/api.js';
    import draggable from 'vuedraggable';
    import chooseArea from '@/components/common/chooseArea';
    export default {
        components: { draggable, chooseArea },
        data() {
            return {
                form: {
                    video: '',
                    delivery: '',
                    feightTpl: ''
                },
                rules: {
                    delivery: [{ required: true, message: '请选择是否发货', trigger: 'blur' }],
                    feightTpl: [{ required: true, message: '请选择运费模板', trigger: 'blur' }]
                },
                unSupportMask: false,
                unSupportAreasData: [], // 不配送区域
                unSupportsssAreasData: [], // 不配送区域
                imgList: [], // 商品主图
                imgInfoList: [] // 商品详情
            };
        },
        computed: {
            imgUpload() {
                return api.uploadImg;
            }
        },
        methods: {
            // 校验视频参数
            beforeUploadVideo(file) {
                const that = this;
                const arr = ['video/mp4', 'video/rmvb', 'video/avi', 'video/mkv', 'video/wmv'];
                const isVideo = arr.includes(file.type);
                const size = (file.size || 0) / 1024 / 1024;
                return new Promise(function(resolve, reject) {
                    if (!isVideo) reject();
                    if (size > 3) reject();
                    resolve();
                }).then(
                    () => {
                        this.$message.warning(`正在上传${file.name}`);
                        return file;
                    },
                    (err = '请上传正确格式的视频!') => {
                        console.log(file);
                        this.$message.error(err);
                        return Promise.reject();
                    }
                );
            },
            // 上传成功视频
            successUploadVideo(res) {
                this.form.video = res.data;
            },
            // 校验图片大小
            beforeUploadImg(file, type) {
                const that = this;
                const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png';
                return new Promise(function(resolve, reject) {
                    if (!isJPG) reject('请上传图片');
                    if (that.imgList.length >= 10) reject('最多上传十张图片');
                    const _URL = window.URL || window.webkitURL;
                    const image = new Image();
                    if (type == 'mainImg') {
                        image.onload = function() {
                            if (image.width == 800 && image.height == 800) {
                                that.imageSize = `${image.width}*${image.height}`;
                                resolve();
                            } else {
                                console.log(`${image.width}*${image.height}`);
                                resolve();
                                // reject();
                            }
                        };
                    }
                    image.src = _URL.createObjectURL(file);
                }).then(
                    () => {
                        this.$message.warning(`正在上传${file.name}`);
                        return file;
                    },
                    (err = '上传图片尺寸不符合!') => {
                        this.$message.error(err);
                        return Promise.reject();
                    }
                );
            },
            // 上传主图图片成功
            uploadImgSuccess(res, file, fileList) {
                if (this.imgList.length >= 10) return this.$message.error('最多上传十张图片');
                this.imgList.push(res.data);
            },
            // 上传详情图片成功
            uploadInfoImgSuccess(res, file, fileList) {
                this.imgInfoList.push(res.data);
            },
            // 移除图片
            handleRemoveImg(index, fileList) {
                this[fileList].splice(index, 1);
            },
            // 选择区域
            chooseUnSupportArea(getArea) {
                this.unSupportMask = false;
                if (getArea.length === 0) return;
                let str = '';
                getArea.forEach(v => {
                    str += v.cityNames + ',';
                });
                const arr = str.split(',');
                arr.splice(arr.length - 1, 1);
                this.unSupportsssAreasData = arr;
            }
        }
    };
</script>

<style scoped lang="less">
    .prod-message{
        .pro-title {
            width: 100%;
            height: 60px;
            background-color: #f7f7f7;
            line-height: 60px;
            padding: 0 25px;
            box-sizing: border-box;
            margin-bottom: 20px;
        }
        .sep-video{
            width: 2px;
            height: 150px;
            border-radius: 1px;
            margin: 0 20px;
            background: #e2e2e2;
        }
        .img-list{
            cursor: pointer;
            position: relative;
            width: 150px;
            height: 150px;
            border-radius: 6px;
            margin: 0 10px 40px 0;
            overflow: hidden;
            img {
                width: 150px;
                height: 150px;
            }
        }
        .del-mask{
            position: absolute;
            top: 0px;
            left: 0px;
            width: 150px;
            height: 150px;
            line-height: 150px;
            text-align: center;
            background-color: rgba(0,0,0,0);
            color: rgba(0,0,0,0);
        }
        .del-mask:hover{
            z-index: 99;
            color: #33b4ff;
            background-color: rgba(0,0,0,0.3);
        }
        .area-list{
            padding: 10px;
            box-sizing: border-box;
            width: 50%;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 10px;
        }
    }
</style>
