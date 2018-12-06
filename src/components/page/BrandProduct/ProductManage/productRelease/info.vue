<template>
    <div class="prod-message" v-loading="pageLoading">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card>
            <div>
                <span style="font-weight: 900">您当前选择的分类是</span>: {{form.firstCategoryName}} > {{form.secCategoryName}} > {{form.thirdCategoryName}}
                <el-button @click="toggleCate" type="primary" style="margin-left: 30px">切换分类</el-button>
            </div>
        </el-card>
       <el-card>
           <el-steps :space="900" :active="2" finish-status="success">
               <el-step title="基础参数编辑"></el-step>
               <el-step title="销售信息编辑"></el-step>
               <el-step title="商品详情编辑"></el-step>
           </el-steps>
           <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="120px">
               <div class="pro-title">图文描述</div>
               <el-form-item label="商品主图">
                   <el-upload v-if="form.videoUrl === ''" list-type="picture-card" class="fl" :before-upload="beforeUploadVideo" :action="imgUpload" :show-file-list="false" :on-success="successUploadVideo">
                       <i class="el-icon-plus" style="font-size: 14px">添加视频</i>
                       <div slot="tip" class="el-upload__tip">请控制在5M以内</div>
                   </el-upload>
                   <div class="img-list fl" v-else style="position: relative">
                       <div class="del-video" @click="form.videoUrl = ''">删 除</div>
                       <video :src="form.videoUrl" style="width: 150px;height: 150px" controls="controls"></video>
                   </div>
                   <div class="sep-video fl"></div>
                   <draggable v-model="imgList">
                       <transition-group>
                           <div v-for="(v,k) in imgList" class="fl" :key="k">
                               <div v-if="v !== '' && v" class="img-list">
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
                                   <img v-if="v !== ''" :src="v" alt="">
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
               <el-form-item prop="needDeliver" label="是否需要发货">
                   <el-select v-model="form.needDeliver">
                       <el-option label="是" value="true"></el-option>
                       <el-option label="否" value="false"></el-option>
                   </el-select>
               </el-form-item>
               <el-form-item prop="freightTemplateId" label="运费模板">
                   <el-select v-model="form.freightTemplateId" placeholder="请选择运费模板">
                       <el-option value="" label="全部"></el-option>
                       <el-option v-for="(v, k) in freightList" :key="k" :value="v.id" :label="v.name"></el-option>
                   </el-select>
                   <a href="#/shippingTemplate" target="_blank" class="primary-text href">添加运费模板</a>
                   <span class="primary-text">|</span>
                   <span class="primary-text" @click="getFeightList">刷新</span>
               </el-form-item>
               <el-form-item label="不支持配送区域">
                   <div class="area-list" v-if="unSupportsssAreasData.length !== 0">
                       <el-tag type="primary" v-for="(v, k) in unSupportsssAreasData" :key="k">{{v}}</el-tag>
                   </div>
                   <el-button type="danger" @click="chooseArea">添加区域</el-button>
               </el-form-item>
               <div class="pro-title">其他信息</div>
               <el-form-item prop="upType" label="上架时间">
                   <el-radio-group @change="form.upTime = ''" v-model="form.upType">
                       <el-radio label="1">立即上架</el-radio>
                       <el-radio label="2">定时上架</el-radio>
                       <el-radio label="3">放入仓库</el-radio>
                   </el-radio-group>
                   <el-date-picker v-if="form.upType == 2" v-model="form.upTime" type="datetime" placeholder="请选择上架时间" style="margin-left: 10px"></el-date-picker>
               </el-form-item>
               <el-form-item prop="buyLimit" label="限购">
                   <el-checkbox-group @change="form.limitBuyNum = form.buyLimit.includes(1)?form.limitBuyNum:'-1'" v-model="form.buyLimit">
                       <el-checkbox :label="1">限制每人可购买数量</el-checkbox>
                   </el-checkbox-group>
                   <el-input-number :controls="false" :min="0" v-if="form.buyLimit.includes(1)" v-model="form.limitBuyNum"></el-input-number>
               </el-form-item>
               <el-form-item prop="flatService" label="平台服务">
                   <el-checkbox-group v-model="form.flatService">
                       <el-checkbox :label="1">不支持使用优惠券</el-checkbox>
                       <el-checkbox :label="2">提供发票</el-checkbox>
                       <el-checkbox :label="4">支持7天无理由退换</el-checkbox>
                   </el-checkbox-group>
               </el-form-item>
               <el-form-item prop="afterSaleServiceDays" label="售后保障">
                   <span v-if="form.afterSaleServiceDays">售后时间: {{form.afterSaleServiceDays || 0}}天</span>
                   <span class="grey-text ml10">注：虚拟商品默认不支持售后</span>
               </el-form-item>
               <el-form-item prop="autoUnShelve" label="自动下架">
                   <el-radio-group v-model="form.autoUnShelve">
                       <el-radio :label="true">是</el-radio>
                       <el-radio :label="false">否 </el-radio>
                   </el-radio-group>
                   <span class="grey-text ml10"> 注：库存为0时是否自动下架</span>
               </el-form-item>
               <div class="pro-title">标签信息</div>
               <div class="tag-btn-group">
                   <el-button-group v-loading="tagLoading">
                       <el-button v-for="(v, k) in tagTypeArr" :key="k" :type="v.selected?'primary':''" @click="getAllTags(v.id,k, v.selected)">{{v.name}}</el-button>
                   </el-button-group>
               </div>
               <div class="selected-tag">
                   <span v-if="selectedTagArr.length == 0" class="tag-tip">请选择标签</span>
                   <el-tag class="tag" type="info" closable v-for="(v,k) in selectedTagArr" :key="k"
                           @close="handleClose(k,v)">{{v.label}}
                   </el-tag>
               </div>
               <div class="add-tag">
                   <el-input style="width:215px;margin-right:20px" v-model="tagName"
                             placeholder="请输入标签/至多可添加20个"></el-input>
                   <el-button type="primary" @click="addTag">添加标签</el-button>
               </div>
               <div class="tag-list">
                   <span v-if="tagArr.length == 0" class="tag-tip">请添加标签</span>
                   <el-button style="margin-bottom:10px" v-for="(v,k) in tagArr" :key="k" @click="insertTag(v)"
                              :disabled="v.selected" :class="{'selected-btn':v.selected}">{{v.label}}
                   </el-button>
               </div>
               <el-form-item label=" ">
                   <el-button type="primary" :loading="subformBtn" @click="submitForm">提交</el-button>
               </el-form-item>
           </el-form>
       </el-card>
        <!--区域选择-->
        <choose-area @getArea='chooseUnSupportArea' :chooseData="unSupportAreasData" :preData="unSupportAreasData" :isSingleLine="true" v-if="unSupportMask"></choose-area>
    </div>
</template>

<script>
    import request from '@/http/http';
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import * as api from '@/api/api.js';
    import draggable from 'vuedraggable';
    import chooseArea from '@/components/common/chooseArea';
    export default {
        components: { draggable, chooseArea, vBreadcrumb },
        data() {
            return {
                nav: ['品牌产品管理', '产品管理', '商品详情编辑'],
                unSupportMask: false,
                pageLoading: false,
                subformBtn: false,
                prodCode: '',
                form: {
                    firstCategoryName: '',
                    secCategoryName: '',
                    thirdCategoryName: '',
                    videoUrl: '',
                    imgUrl: '', // 主图
                    needDeliver: '', // 0: 否 1: 是
                    freightTemplateId: '',
                    undeliveredList: [], // 不支持配送区域
                    upType: '',
                    upTime: '',
                    buyLimit: [],
                    limitBuyNum: 0,
                    afterSaleServiceDays: 0, // 售后周期
                    flatService: [],
                    autoUnShelve: '',
                    secCategoryId: '',
                    skuList: []
                },
                rules: {
                    needDeliver: [{ required: true, message: '请选择是否发货', trigger: 'blur' }],
                    freightTemplateId: [{ required: true, message: '请选择运费模板', trigger: 'blur' }],
                    upType: [{ required: true, message: '请选择上架时间', trigger: 'blur' }],
                    autoUnShelve: [{ required: true, message: '请选择是否自动下架', trigger: 'blur' }]
                },
                freightList: [], // 运费模板
                imgList: [], // 商品主图
                imgInfoList: [], // 商品详情
                unSupportsssAreasData: [], // tag区域列表
                unSupportAreasData: [],
                tagTypeArr: [], // 标签类型
                tagLoading: false, // 标签loading
                selectedTagArr: [],
                tagArr: [],
                tagName: '',
                paramList: []
            };
        },
        computed: {
            imgUpload() {
                return api.uploadImg;
            }
        },
        created() {
            this.prodCode = this.$route.query.prodCode || null;
        },
        mounted() {
            this.getProductInfo();
        },
        methods: {
            // 提交表单
            submitForm() {
                if (!this.form.upTime) this.form.upTime = [];
                let restrictions = 0;
                if (this.form.flatService.includes(1)) restrictions += 1;
                if (this.form.flatService.includes(2)) restrictions += 2;
                if (this.form.flatService.includes(4)) restrictions += 4;
                const tags = [];
                if (this.selectedTagArr.length !== 0) {
                    this.selectedTagArr.forEach(v => {
                        const obj = {
                            tagName: v.label,
                            tagId: v.value
                        };
                        tags.push(obj);
                    });
                }
                const data = {
                    ...this.form,
                    videoUrl: this.form.videoUrl,
                    imgUrl: this.imgList[0],
                    content: this.imgInfoList.join(','),
                    needDeliver: this.form.needDeliver,
                    freightTemplateId: this.form.freightTemplateId,
                    undeliveredList: this.unSupportAreasData,
                    upType: this.form.upType,
                    upTime: this.form.upType == '2' ? this.$utils.formatTime(this.form.upTime) : '',
                    buyLimit: this.form.limitBuyNum,
                    restrictions: restrictions,
                    autoUnShelve: this.form.autoUnShelve,
                    tagList: tags,
                    prodCode: this.prodCode,
                    paramList: this.form.paramList,
                    skuList: this.form.skuList
                };
                if (this.imgList.length == 0 || this.imgList.length == 1) {
                    data.imgFileList = [];
                } else {
                    this.imgList.splice(0, 1);
                    const arr = [];
                    this.imgList.forEach(v => {
                        arr.push({
                            originalImg: v,
                            smallImg: v
                        });
                    });
                    data.imgFileList = arr;
                }
                this.subformBtn = true;
                request.addProducts(data).then(res => {
                    this.subformBtn = false;
                    this.$router.push('/productList');
                    this.$message.success(res.msg);
                }).catch(err => {
                    this.subformBtn = false;
                    console.log(err);
                });
            },
            // 获取产品信息
            async getProductInfo() {
                await this.getAllTagType();
                await this.getFeightList();
                if (!this.prodCode) return this.$message.warning('产品编码丢失!');
                this.pageLoading = true;
                let resData = {};
                await request.findProductDetailsByCode({ code: this.prodCode }).then(res => {
                    resData = res.data || {};
                    let flatServiceArr = [];
                    const limitServer = resData.restrictions || 0;
                    switch (limitServer.toString()) {
                        case '1': flatServiceArr = [1]; break;
                        case '2': flatServiceArr = [2]; break;
                        case '3': flatServiceArr = [1, 2]; break;
                        case '4': flatServiceArr = [4]; break;
                        case '5': flatServiceArr = [1, 4]; break;
                        case '6': flatServiceArr = [2, 4]; break;
                        case '7': flatServiceArr = [1, 2, 4]; break;
                    }
                    resData.flatService = flatServiceArr;
                    this.form = {
                        ...resData,
                        buyLimit: resData.buyLimit == -1 ? [] : [1],
                        limitBuyNum: resData.buyLimit == -1 ? '' : resData.buyLimit,
                        secCategoryId: resData.secCategoryId,
                        paramList: resData.paramList,
                        skuList: resData.skuList,
                        afterSaleServiceDays: resData.afterSaleServiceDays,
                        firstCategoryName: resData.firstCategoryName,
                        secCategoryName: resData.secCategoryName,
                        thirdCategoryName: resData.thirdCategoryName
                    };
                }).catch(err => {
                    this.pageLoading = false;
                    console.log(err);
                });
                this.imgInfoList = resData.content ? resData.content.split(',') : [];
                await this.getFeightList();
                let str = '';
                resData.undeliveredList.forEach(v => {
                    str += v.cityNames + ',';
                });
                const cArr = str.split(',');
                cArr.splice(cArr.length - 1, 1);
                this.unSupportsssAreasData = cArr;
                const arr = [];
                if (resData.imgUrl && resData.imgUrl !== '') {
                    arr.push(resData.imgUrl);
                }
                if (resData.imgFileList && resData.imgFileList.length !== 0) {
                    resData.imgFileList.forEach(v => {
                        arr.push(v.originalImg);
                    });
                }
                this.imgList = arr;
                if (resData.tagList && resData.tagList.length !== 0) {
                    resData.tagList.forEach(v => {
                        this.selectedTagArr.push({ label: v.tagName, value: v.tagId });
                    });
                }
                // const tagId = this.tagTypeArr[0] ? this.tagTypeArr[0].id : 0;
                // const tagSel = this.tagTypeArr[0] ? this.tagTypeArr[0].selected : false;
                // await this.getAllTags(tagId, 0, tagSel);
                this.form.videoUrl = resData.videoUrl ? resData.videoUrl : '';
                this.form.needDeliver = resData.needDeliver !== null ? resData.needDeliver.toString() : '';
                this.form.freightTemplateId = resData.freightTemplateId ? resData.freightTemplateId : '';
                this.form.upType = resData.upType ? resData.upType.toString() : '';
                this.form.upTime = resData.upType == 2 ? resData.upTime : '';
                this.form.buyLimit = resData.buyLimit == -1 ? [] : [1];
                this.form.limitBuyNum = resData.buyLimit == -1 ? '' : resData.buyLimit;
                this.form.autoUnShelve = resData.autoUnShelve;
                this.unSupportAreasData = resData.undeliveredList;
                this.pageLoading = false;
            },
            // 获取运费模板列表
            async getFeightList() {
                await request.queryFreightTemplateList({}).then(res => {
                    this.freightList = res.data;
                }).catch(err => {
                    console.log(err);
                });
            },
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
                this.form.videoUrl = res.data;
            },
            // 校验图片大小
            beforeUploadImg(file, type) {
                const that = this;
                const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png';
                return new Promise(function(resolve, reject) {
                    if (!isJPG) reject('请上传图片');
                    if (type == 'mainImg') {
                        if (that.imgList.length >= 10) reject('最多上传十张图片');
                    }
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
                    resolve();
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
            // 显示区域mask
            chooseArea() {
                this.unSupportMask = true;
                let arr = this.unSupportAreasData;
                for (const i in arr) {
                    arr[i].includeAreaName = arr[i].provinceName + ':' + arr[i].cityNames;
                    arr[i].includeArea = arr[i].provinceCode + ':' + arr[i].cityCodes;
                }
                this.unSupportAreasData = arr;
            },
            // 选择区域
            chooseUnSupportArea(getArea) {
                this.unSupportMask = false;
                if (getArea.length === 0 || !getArea) return;
                getArea.forEach(v => {
                    v.prodCode = this.prodCode;
                });
                this.unSupportAreasData = getArea;
                let str = '';
                getArea.forEach(v => {
                    str += v.cityNames + ',';
                });
                const arr = str.split(',');
                arr.splice(arr.length - 1, 1);
                this.unSupportsssAreasData = arr;
            },
            // 获取所有标签
            async getAllTags(val, key, status) {
                if (this.form.secCategoryId === '') return;
                if (this.tagTypeArr && this.tagTypeArr.length !== 0) {
                    this.tagTypeArr.forEach(v => {
                        v.selected = false;
                    });
                    this.tagTypeArr[key].selected = status;
                }
                this.tagLoading = true;
                await request.querySysTagLibraryList({ typeId: val, secCategoryId: this.form.secCategoryId }).then(res => {
                    this.tagLoading = false;
                    this.tagArr = [];
                    this.tagTypeArr[key].selected = !this.tagTypeArr[key].selected;
                    if (res.data[0].sysTagLibraryVOList && res.data[0].sysTagLibraryVOList.length !== 0) {
                        res.data[0].sysTagLibraryVOList.forEach(v => {
                            this.tagArr.push({ label: v.name, value: v.id });
                        });
                    }
                    this.tagArr.forEach((v, k) => {
                        this.selectedTagArr.forEach((v1, k1) => {
                            if (v.value == v1.value) {
                                v.selected = true;
                            }
                        });
                    });
                }).catch(err => {
                    this.tagLoading = false;
                    console.log(err);
                });
            },
            // 关闭标签
            handleClose(index, value) {
                this.selectedTagArr.splice(index, 1);
                this.tagArr.forEach((v, k) => {
                    if (value.label == v.label) {
                        this.tagArr[k].selected = false;
                    }
                });
            },
            // 加入新的标签
            addTag() {
                if (this.tagName == '') {
                    this.$message.warning('请输入正确的标签');
                    return;
                }
                if (this.selectedTagArr.length === 20) return this.$message.warning('最多添加二十个标签');
                let tmp = false;
                this.tagArr.forEach((v, k) => {
                    if (this.tagName == v.label) {
                        tmp = true;
                    }
                });
                if (!tmp) {
                    let typeId = 1;
                    let tagName = '';
                    this.tagTypeArr.forEach((v, k) => {
                        if (v.selected) {
                            typeId = v.id;
                            tagName = k;
                        }
                    });
                    const data = {
                        name: this.tagName,
                        status: 1
                    };
                    request.addSysTagLibrary(data).then(res => {
                        this.$message.success(res.msg);
                        this.selectedTagArr.push({ label: res.data.name, value: res.data.id });
                        this.tagTypeArr[tagName].selected = true;
                        this.tagName = '';
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    this.$message.warning('标签已存在，请不要重复添加!');
                }
            },
            // 添加标签
            insertTag(v) {
                if (this.selectedTagArr.length > 19) {
                    this.$message.warning('最多添加20个标签');
                    return;
                }
                v.selected = true;
                this.selectedTagArr.push({ label: v.label, value: v.value });
            },
            // 获取所有标签类型
            async getAllTagType() {
                await request.querySysTagTypePageList({ pageSize: 100000 }).then(res => {
                    this.tagTypeArr = [];
                    if (res.data.data.length === 0) return;
                    res.data.data.forEach(v => {
                        this.tagTypeArr.push({
                            id: v.id,
                            name: v.name,
                            isSelected: false
                        });
                    });
                }).catch(err => {
                    console.log(err);
                });
            },
            // 切换分类
            toggleCate() {
                this.$confirm('切换后系统不会保留您本次的编辑', '您确定要切换分类吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$router.push({ path: '/releaseProduct', query: { prodCode: this.prodCode || null }});
                }).catch(() => {});
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
        .del-video{
            z-index: 99;
            position: absolute;
            cursor: pointer;
            left: 0px;
            top: 0px;
            width: 150px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            color: #33b4ff;
            background-color: rgba(0,0,0,0.3);
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
        .tag-btn-group{
            margin-top: 15px;
        }
        .selected-tag {
            width: 100%;
            padding: 6px 22px;
            box-sizing: border-box;
            border: 1px solid #e8edf0;
            border-radius: 5px;
            margin-top: 20px;
            .tag {
                margin-right: 5px;
            }
            .tag-tip {
                font-size: 14px;
                color: #9a9a9a;
            }
        }
        .add-tag {
            width: 100%;
            margin-top: 20px;
        }
        .tag-list {
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
            border: 1px solid #e8edf0;
            border-radius: 5px;
            margin: 10px 0 20px 0;
            .tag-tip {
                font-size: 14px;
                color: #9a9a9a;
            }
            .selected-btn {
                background-color: #409EFF;
                border-color: #409EFF;
                color: #fff;
            }
        }
    }
</style>
