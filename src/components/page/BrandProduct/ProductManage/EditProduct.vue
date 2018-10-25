<template>
    <div class="release-product">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card v-loading="bodyLoading" :body-style="{ padding: '20px 45px',color:'#666' }">
            <div class="pro-title">基本信息</div>
            <el-form :model="form" ref="form" label-width="100px">
                <el-form-item label="产品名称">
                    <el-input style="width:300px" :maxlength="46" v-model="form.name" placeholder="请输入产品名称"></el-input>
                </el-form-item>
                <el-form-item label="产品图片">
                    <el-upload class="img-uploader" :action="uploadImg"
                               :show-file-list="false" :on-success="res=>successUpload(res,1)" v-if="videoUrl === ''">
                        <i class="el-icon-plus avatar-uploader-icon">添加视频</i>
                    </el-upload>
                    <div class="img-wrap" v-else>
                        <div class="delImg" @click="videoUrl = ''">
                            <icon ico='icon-shanchu'></icon>
                        </div>
                        <video :src="videoUrl" controls="controls"></video>
                    </div>
                    <draggable style="display:inline-block" v-model="imgArr" :move="getdata" @update="datadragEnd">
                        <transition-group>
                            <div class="img-wrap" v-for="(v,k) in imgArr" :key="k">
                                <div class="delImg" @click="deleteImg(v)">
                                    <icon ico='icon-shanchu'></icon>
                                </div>
                                <img class="uImg" :src="v.originalImg">
                            </div>
                        </transition-group>
                    </draggable>
                    <el-upload class="img-uploader" :before-upload="beforeAvatarUpload" :action="uploadImg"
                               :show-file-list="false" :on-success="successUpload" :disabled="isUseUpload" multiple>
                        <i class="el-icon-plus avatar-uploader-icon">添加图片</i>
                    </el-upload>
                    <div class="upload-tip">建议尺寸：800*800,拖拽图片可以改变顺序，第一张为默认头图</div>
                </el-form-item>
                <el-form-item label="产品分类">
                    <el-cascader @change='getProItemId' v-model="proItemArr" :options="itemList"
                                  :props="itemProps"></el-cascader>
                    <span style="margin-left:30px">产品品牌</span>
                    <el-select filterable @change="getSupplyList" v-model="form.brandId" placeholder="请选择">
                        <el-option v-for="(v,k) in brandArr" :key="k" :label="v.name" :value="v.brandId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="供应商">
                    <el-select @change="getBrandList" v-model="form.supplierId" placeholder="下拉搜索供应商">
                        <el-option v-for="(v,k) in supplierArr" :key="k" :label="v.name" :value="v.supplierId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发货方">
                    <el-select v-model="form.sendMode" placeholder="选择发货方">
                        <el-option v-for="(v,k) in shipperArr" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品参数">
                    <div class="product-param">
                        <span v-if='productParam.length == 0'>暂无数据</span>
                        <span v-else v-for="(v,k) in productParam" :key="k">{{v.param}}：<el-input class="inp-param"
                                                                                                  v-model="v.value"></el-input></span>
                    </div>
                </el-form-item>
                <div class="pro-title">运费其他</div>
                <el-form-item label="选择运费模板">
                    <el-select v-model="form.freightTemplateId" placeholder="请选择模板">
                        <el-option v-for="(v,k) in freightTemplateArr" :key="k" :label="v.name"
                                   :value="v.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="售后周期">
                    <transition name="fade">
                        <el-select v-if="!showSaleTime" v-model="form.afterSaleServiceDays" placeholder="请选择售后周期">
                            <el-option v-for="(v,k) in aferServiceDays" :key="k" :label="v.label"
                                       :value="v.value"></el-option>
                        </el-select>
                        <el-input v-if='showSaleTime' v-model="form.afterSaleServiceDays" style="width:215px"
                                  placeholder="请输入售后周期"></el-input>
                    </transition>
                    <el-button @click="defSaleTime">自定义</el-button>
                </el-form-item>
                <div class="pro-title">使用限制</div>
                <el-form-item>
                    <el-checkbox label="不支持优惠卷" v-model="limit.notSupportCoupon"></el-checkbox>
                    <!--<el-checkbox label="不支持1元券抵扣" v-model="limit.notSupportScore"></el-checkbox>-->
                </el-form-item>
                <el-form-item>
                    <el-checkbox label="不支持退款" v-model="limit.notSupportRetMoney"></el-checkbox>
                    <el-checkbox label="不支持换货" v-model="limit.notSupportRetChange"></el-checkbox>
                    <el-checkbox label="不支持退货" v-model="limit.notSupportRetGoods"></el-checkbox>
                </el-form-item>
                <hr style="border: 0;height: 1px;background-color: #eee;"/>
                <el-form-item label="">
                    <el-checkbox label="是否限购" v-model="purchaseLimit"></el-checkbox>
                    <br>
                    <p v-if="purchaseLimit" style="margin: 10px 0 0 70px">限购数量：
                        <el-input v-model="purchasevalue" class="my-inp"></el-input>
                        件/人
                    </p>
                </el-form-item>
                <el-form-item>
                    <el-checkbox label="是否设置购买时间" v-model="isSetBuTime"></el-checkbox>
                    <br>
                    <p v-if="isSetBuTime" style="margin: 10px 0 0 70px">可购买时间：
                        <el-date-picker
                            v-model="setBuyTime"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="年 / 月 / 日"
                            end-placeholder="年 / 月 / 日">
                        </el-date-picker>
                    </p>
                </el-form-item>
                <div class="pro-title">产品详情</div>
                <quill-editor v-model="form.content" ref="myQuillEditor" :options="editorOption"
                              @change="onEditorChange($event)"></quill-editor>
                <el-upload :action="uploadImg" :data="uploadData" :on-success='upScuccess' ref="upload"
                           style="display:none">
                    <el-button size="small" type="primary" id="imgInput" element-loading-text="插入中,请稍候">点击上传</el-button>
                </el-upload>
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
                <el-button type="primary" :loading="btnLoading" @click="submitForm">确认发布</el-button>
                <el-button @click="goBack">取消</el-button>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import draggable from 'vuedraggable';
    import Quill from 'quill';
    import icon from '@/components/common/ico';
    import * as api from '@/api/api.js';
    import utils from '@/utils/index.js';
    import request from '@/http/http';
    import { beforeAvatarUpload } from '@/JS/commom';
    export default {
        components: {
            draggable,
            vBreadcrumb,
            icon
        },
        mixins: [beforeAvatarUpload],
        data() {
            return {
                nav: ['品牌产品管理', '产品管理', '发布产品'],
                productId: '',
                isUseUpload: false,
                showSaleTime: false,
                uploadImg: '',
                imgArr: [],
                itemList: [],
                brandArr: [],
                freightTemplateArr: [],
                supplierArr: [],
                shipperArr: [{ label: '平台发货', value: 1 }, { label: '供应商发货', value: 2 }],
                aferServiceDays: [
                    { label: '无售后服务', value: 0 },
                    { label: '到货后7天', value: 7 },
                    { label: '到货后15天', value: 15 },
                    { label: '到货后30天', value: 30 },
                    { label: '到货后6个月', value: 180 },
                    { label: '到货后1年', value: 365 },
                    { label: '到货后2年', value: 730 },
                    { label: '到货后3年', value: 1095 }
                ],
                itemProps: {
                    value: 'value',
                    children: 'children'
                },
                proCategoryArr: [],
                form: {
                    name: '',
                    firstCategoryId: '',
                    secCategoryId: '',
                    thirdCategoryId: '',
                    brandId: '',
                    supplierId: '',
                    sendMode: '',
                    freightTemplateId: '',
                    afterSaleServiceDays: '',
                    content: '',
                    imgFileList: [],
                    restrictions: 0,
                    productParamValueVOList: []
                },
                // 使用限制
                limit: {
                    notSupportCoupon: false, // 不支持优惠券
                    notSupportScore: false, // 不支持积分抵扣
                    notSupportRetMoney: false, // 不支持退款
                    notSupportRetChange: false, // 不支持换货
                    notSupportRetGoods: false // 不支持退货
                },
                videoUrl: '', // 视频
                // 是否限购
                purchaseLimit: false,
                purchasevalue: '',
                // 是否设置购买时间
                isSetBuTime: false,
                setBuyTime: [],
                productParam: [], // 产品参数
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
                uploadData: {},
                uploadType: '', // 上传的文件类型（图片、视频）,
                selectedTagArr: [],
                tagArr: [],
                tagName: '',
                proItemArr: [],
                btnLoading: false,
                bodyLoading: false,
                tagTypeArr: [], // 标签类型
                tagLoading: false // 标签loading
            };
        },

        computed: {
            qnLocation() {
                return api.uploadImg;
            }
        },

        activated() {
            this.getAllTagType();
            this.uploadImg = api.uploadImg;
            this.imgArr = [];
            this.proItemArr = [];
            this.setBuyTime = [];
            this.videoUrl = '';
            this.selectedTagArr = [];
            this.tagArr = [];
            this.productParam = [];
            this.getInfo();
            utils.cleanFormData(this.form);
        },

        mounted() {
            // 为图片ICON绑定事件 getModule 为编辑器的内部属性
            this.$refs.myQuillEditor.quill
                .getModule('toolbar')
                .addHandler('image', this.imgHandler);
        },

        methods: {
            // 获取产品信息
            async getInfo() {
                this.bodyLoading = true;
                this.productId = this.$route.query.releaseProduct || sessionStorage.getItem('releaseProduct');
                // 获取类目
                await this.getAllCat();
                // 获取品牌列表
                await this.getBrandList();
                // 获取运费模板
                await this.getFreightTemplate();
                request.findProductById({ id: this.productId }).then(res => {
                    res.data.productTagDTOList.forEach(v => {
                        this.selectedTagArr.push({ label: v.name, value: v.tagId });
                    });
                    this.form.name = res.data.name;
                    this.form.firstCategoryId = Number(res.data.firstCategoryId);
                    this.proItemArr.push(this.form.firstCategoryId);
                    this.form.secCategoryId = Number(res.data.secCategoryId);
                    this.proItemArr.push(this.form.secCategoryId);
                    this.form.thirdCategoryId = Number(res.data.thirdCategoryId);
                    this.proItemArr.push(this.form.thirdCategoryId);
                    this.form.brandId = res.data.brandId;
                    this.form.supplierId = res.data.supplierId;
                    this.getSupplyList(this.form.brandId);
                    this.form.sendMode = res.data.sendMode;
                    this.form.freightTemplateId = res.data.freightTemplateId;
                    this.form.afterSaleServiceDays = res.data.afterSaleServiceDays;
                    this.form.content = res.data.content;
                    this.imgArr = res.data.imgFileList;
                    this.form.restrictions = Number(res.data.restrictions);
                    this.limit.notSupportCoupon = (this.form.restrictions & 1) !== 0;
                    this.limit.notSupportScore = (this.form.restrictions & 2) !== 0;
                    this.limit.notSupportRetMoney = (this.form.restrictions & 4) !== 0;
                    this.limit.notSupportRetChange = (this.form.restrictions & 8) !== 0;
                    this.limit.notSupportRetGoods = (this.form.restrictions & 16) !== 0;
                    this.purchaseLimit = res.data.buyLimit !== 0;
                    this.purchasevalue = res.data.buyLimit;
                    this.setBuyTime.push(res.data.beginTime);
                    this.setBuyTime.push(res.data.endTime);
                    this.$set(this.setBuyTime, 0, this.setBuyTime[0]);
                    this.$set(this.setBuyTime, 1, this.setBuyTime[1]);
                    this.isSetBuTime = !!res.data.beginTime;
                    this.videoUrl = res.data.videoUrl;
                    res.data.productParamValueVOList.forEach((v, k) => {
                        this.productParam.push({ param: v.param, id: v.paramId, value: v.paramValue });
                    });
                    this.bodyLoading = false;
                }).catch(err => {
                    this.bodyLoading = false;
                    console.log(err);
                });
            },
            // 提交表单前进行判断
            beforeSubmit() {
                if (this.imgArr.length == 0) {
                    this.$message.warning('请添加产品图片');
                    return false;
                }
                // else if (this.selectedTagArr.length == 0) {
                //     this.$message.warning('请添加产品标签');
                //     return false;
                // }
                if (this.productParam.length == 0) {
                    this.$message.warning('请输入产品参数');
                    return false;
                }
                return true;
            },
            // 提交表单
            submitForm() {
                const isCanSubmit = this.beforeSubmit();
                if (!isCanSubmit) {
                    return;
                }
                this.form.restrictions = 0;
                if (this.limit.notSupportCoupon) {
                    this.form.restrictions += 1;
                }
                if (this.limit.notSupportScore) {
                    this.form.restrictions += 2;
                }
                if (this.limit.notSupportRetMoney) {
                    this.form.restrictions += 4;
                }
                if (this.limit.notSupportRetChange) {
                    this.form.restrictions += 8;
                }
                if (this.limit.notSupportRetGoods) {
                    this.form.restrictions += 16;
                }
                this.productParam.forEach(v => {
                    this.form.productParamValueVOList.push({ paramId: v.id, paramValue: v.value });
                });
                this.form.imgUrl = this.imgArr[0].originalImg;
                this.form.imgFileList = this.imgArr;
                const data = this.form;
                data.productParamValueVOList = this.form.productParamValueVOList;
                data.videoUrl = this.videoUrl;
                data.buyLimit = this.purchaseLimit ? this.purchasevalue : 0;
                data.beginTime = this.setBuyTime[0] === undefined ? '' : utils.formatTime(this.setBuyTime[0]);
                data.endTime = this.setBuyTime[1] === undefined ? '' : utils.formatTime(this.setBuyTime[1]);
                data.productTagDTOList = [];
                this.selectedTagArr.forEach(v => {
                    data.productTagDTOList.push({ tagId: v.value });
                });
                data.id = this.productId;
                this.btnLoading = true;
                request.updateProduct(data).then(res => {
                    this.btnLoading = false;
                    this.$message.success(res.msg);
                    this.$router.push('/productList');
                }).catch(err => {
                    this.btnLoading = false;
                    console.log(err);
                });
            },
            beforeUploadArr() {
                this.$message.warning('上传中...');
            },
            //  图片上传/拖拽
            getdata(evt) {
                //   console.log(evt.draggedContext.element.url);
            },
            datadragEnd(evt) {
                this.imgArr.forEach((v, k) => {
                    v.sort = k + 1;
                });
            },
            successUpload(res, status) {
                if (status === 1) {
                    this.videoUrl = res.data;
                    return;
                }
                if (this.imgArr.length >= 5) {
                    this.isUseUpload = true;
                    this.$message.warning('最多只能上传五张图片');
                    return;
                }
                this.imgArr.push({ originalImg: res.data, smallImg: res.data, status: 1, sort: this.imgArr.length + 1 });
                this.$message.success('上传成功');
            },
            // 删除图片
            deleteImg(img) {
                let index = -1;
                this.imgArr.forEach((v, k) => {
                    if (v.originUrl == img.originUrl) {
                        index = k;
                    }
                });
                if (index == -1) {
                    return;
                }
                this.imgArr.splice(index, 1);
                if (this.imgArr.length < 5) {
                    this.isUseUpload = false;
                }
            },
            // 自定义售后周期
            defSaleTime() {
                this.form.aferServiceDays = '';
                this.showSaleTime = !this.showSaleTime;
            },
            // 富文本编辑器
            onEditorChange({ editor, html, text }) {
                this.form.content = html;
            },
            // 图片上传成功回调 插入到编辑器中
            upScuccess(e, file, fileList) {
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
            // 获取所有分类
            getAllCat() {
                this.itemList = [];
                request.getAllProductCategory({}).then(res => {
                    res.data.firstList.forEach(v => {
                        this.itemList.push({ label: v.name, value: v.id, children: [] });
                    });
                    res.data.secList.forEach(v => {
                        for (let i = 0; i < this.itemList.length; i++) {
                            if (v.fatherId == this.itemList[i].value) {
                                this.itemList[i].children.push({ label: v.name, value: v.id, children: [] });
                            }
                        }
                    });
                    res.data.thirdList.forEach(v => {
                        for (let i = 0; i < this.itemList.length; i++) {
                            if (this.itemList[i].children.length == 0) { continue; }
                            for (let j = 0; j < this.itemList[i].children.length; j++) {
                                if (v.fatherId == this.itemList[i].children[j].value) {
                                    this.itemList[i].children[j].children.push({ label: v.name, value: v.id });
                                }
                            }
                        }
                    });
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                });
            },
            // 获取一二三级类目id
            getProItemId(val) {
                this.form.firstCategoryId = val[0];
                this.form.secCategoryId = val[1];
                this.form.thirdCategoryId = val[2];
                this.getProductParam(val[2]);
                this.getAllTags(this.tagTypeArr[0].id, 0, this.tagTypeArr[0].selected);
            },
            // 获取品牌列表
            getBrandList(val) {
                if (val) {
                    request.findBySupplierId({ id: val }).then(res => {
                        this.brandArr = res.data;
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    request.findProductBrandListNoStop({}).then(res => {
                        if (res.data.length === 0) return;
                        this.brandArr = [];
                        res.data.forEach(v => {
                            this.brandArr.push({ brandId: v.id, name: v.name });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            },
            // 获取供应商列表
            getSupplyList(val) {
                request.findByBrandId({ id: val }).then(res => {
                    this.supplierArr = [];
                    this.supplierArr.push({ name: '全部', id: '' });
                    this.supplierArr.push(...res.data);
                }).catch(err => {
                    console.log(err);
                });
            },
            // 获取运费模板列表
            getFreightTemplate() {
                this.freightTemplateArr = [];
                request.queryFreightTemplateList({}).then(res => {
                    this.freightTemplateArr = res.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            // 获取所有标签
            getAllTags(val, key, status) {
                if (this.form.secCategoryId === '') return;
                this.tagTypeArr.forEach(v => {
                    v.selected = false;
                });
                this.tagTypeArr[key].selected = status;
                this.tagLoading = true;
                request.querySysTagLibraryList({ typeId: val, secCategoryId: this.form.secCategoryId }).then(res => {
                    this.tagLoading = false;
                    this.tagArr = [];
                    this.tagTypeArr[key].selected = !this.tagTypeArr[key].selected;
                    res.data[0].sysTagLibraryVOList.forEach(v => {
                        this.tagArr.push({ label: v.name, value: v.id });
                    });
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
            // 获取所有标签类型
            getAllTagType() {
                request.querySysTagTypePageList({ pageSize: 100000 }).then(res => {
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
            // 获取产品参数
            async getProductParam(secId) {
                this.productParam = [];
                await request.queryProductCategoryParamList({ id: secId }).then(res => {
                    res.data.forEach((v, k) => {
                        v.value = '';
                        this.productParam.push(v);
                    });
                }).catch(err => {
                    console.log(err);
                });
            },
            // 返回
            goBack() {
                this.$router.push('/productList');
            }
        }
    };
</script>
<style lang='less'>
    .release-product {
        color: #666;
        .my-inp {
            width: 210px;
        }
        .pro-title {
            width: 100%;
            height: 60px;
            background-color: #f7f7f7;
            line-height: 60px;
            padding: 0 25px;
            box-sizing: border-box;
            margin-bottom: 20px;
        }
        .tag-btn-group{
            margin-top: 15px;
        }
        .img-wrap {
            display: inline-block;
            position: relative;
            width: 100px;
            height: 100px;
            margin-right: 10px;
            border-radius: 10px;
            overflow: hidden;
            .uImg {
                position: relative;
                display: inline-block;
                width: 100px;
                height: 100px;
            }
            .delImg {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 15px;
                color: white;
                background-color: red;
                z-index: 99999;
                line-height: 15px;
                text-align: center;
                font-weight: 900;
                cursor: pointer;
            }
        }
        .upload-tip {
            color: #999;
            font-size: 12px;
            margin: -10px 0 0 10px;
        }
        .img-uploader {
            display: inline-block;
        }
        .el-upload--text {
            width: 100px;
            height: 100px;
            line-height: 100px;
        }
        .pro-weight {
            width: 80px;
            margin-right: 10px;
        }
        .product-param {
            width: 95%;
            border: 1px solid #e8edf0;
            line-height: 58px;
            padding: 0 15px;
            .inp-param {
                width: 90px;
                margin: 0 50px 0 10px;
            }
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
