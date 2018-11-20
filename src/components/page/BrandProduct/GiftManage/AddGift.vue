<template>
    <div class="release-product">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
            <div class="pro-title">基本信息</div>
            <el-form :model="form" ref="form" label-width="100px">
                <el-form-item label="礼包名称">
                    <el-input style="width:300px" :maxlength="16" v-model="form.name" placeholder="请输入产品名称"></el-input>
                </el-form-item>
                <el-form-item label="礼包类型">
                    <el-select v-model="form.type" @change="changeGiftStatus" placeholder="下拉选择礼包类型">
                        <el-option label="普通礼包" value="1"></el-option>
                        <el-option label="升级礼包" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="礼包图片">
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
                                <div class="delImg" @click="deleteImg(v, k)">
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
                <el-form-item label="产品重量">
                    <el-input-number :controls="false" style="width:300px" :min="0" v-model="form.weight" placeholder="请输入产品重量"></el-input-number>(公斤)
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
                        <el-select v-if="!showSaleTime" v-model="form.aferServiceDays" placeholder="请选择售后周期">
                            <el-option v-for="(v,k) in aferServiceDays" :key="k" :label="v.label"
                                       :value="v.value"></el-option>
                        </el-select>
                        <el-input v-if='showSaleTime' v-model="form.aferServiceDays" style="width:215px"
                                  placeholder="请输入售后周期"></el-input>
                    </transition>
                    <el-button @click="defSaleTime">自定义</el-button>
                </el-form-item>
                <el-form-item label="交易默认时间">
                    <el-select v-model="form.dealDays" filterable allow-create default-first-option placeholder="请选择订单默认完成时间">
                        <el-option label="7天" value="7"></el-option>
                        <el-option label="10天" value="10"></el-option>
                        <el-option label="15天" value="15"></el-option>
                        <el-option label="20天" value="20"></el-option>
                        <el-option label="25天" value="25"></el-option>
                        <el-option label="30天" value="30"></el-option>
                    </el-select>
                </el-form-item>
                <div class="pro-title">使用限制</div>
                <el-form-item>
                    <el-checkbox disabled label="不支持优惠券" v-model="limit.notSupportCoupon"></el-checkbox>
                    <!--<el-checkbox label="不支持1元积分抵扣" v-model="limit.notSupportScore"></el-checkbox>-->
                </el-form-item>
                <el-form-item>
                    <el-checkbox :disabled="form.type == 2" label="不支持退款" v-model="limit.notSupportRetMoney"></el-checkbox>
                    <el-checkbox disabled label="不支持换货" v-model="limit.notSupportRetChange"></el-checkbox>
                    <el-checkbox :disabled="form.type == 2" label="不支持退货" v-model="limit.notSupportRetGoods"></el-checkbox>
                </el-form-item>
                <hr style="border: 0;height: 1px;background-color: #eee;"/>
                <el-form-item label="">
                    <el-checkbox label="是否限购" v-model="purchaseLimit"></el-checkbox>
                    <br>
                    <p v-if="purchaseLimit" style="margin: 10px 0 0 70px">限购数量：
                        <el-input-number :min="0" :controls="false" v-model="purchasevalue" class="my-inp"></el-input-number>
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
                <div class="pro-title">库存设置</div>
                <el-form-item label="">
                    <el-radio v-model="form.stockType" label="1">礼包商品共用库存</el-radio>
                    <el-radio v-model="form.stockType" label="2">固定发放数量</el-radio>
                </el-form-item>
                <div class="pro-title">赠品</div>
                <el-form-item>
                    <el-checkbox label="是否设置优惠券" v-model="gifts.isSetBuyTime"></el-checkbox>
                </el-form-item>
                <el-form-item v-if="gifts.isSetBuyTime">
                    <draggable v-model="selectedCoupon" >
                        <transition-group>
                            <div v-for="(v,k) in selectedCoupon" style="overflow: hidden; margin-bottom: 10px" :key="k">
                                <span class="selected-coupon">{{v.name}} </span>
                                <span class="delete-coupon" @click="deleteSelectedCoupon(k)">删除</span>
                            </div>
                        </transition-group>
                    </draggable>
                    <el-button type="primary" @click="showAddCouList">添加优惠券</el-button>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-if="form.type == 2" label="经验值" v-model="gifts.isSetExp"></el-checkbox>
                </el-form-item>
                <el-form-item v-if="gifts.isSetExp" label="设置赠送经验值" style="margin-left: 85px">
                    <el-input style="width:300px" :maxlength="16" v-model="form.experience" placeholder="请输入经验值"></el-input> 点
                </el-form-item>
                <div class="pro-title">产品详情</div>
                <quill-editor v-model="form.content" ref="myQuillEditor" :options="editorOption"
                              @change="onEditorChange($event)"></quill-editor>
                <el-upload :action="uploadImg" multiple :data="uploadData" :on-success='upScuccess' ref="upload"
                           style="display:none">
                    <el-button size="small" type="primary" id="imgInput" element-loading-text="插入中,请稍候">点击上传</el-button>
                </el-upload>
                <div class="pro-title">礼包可购买角色设置</div>
                <el-form-item>
                    <el-checkbox  v-model="checkedAllUser" @change="selectedAlLevel">全选</el-checkbox>
                    <el-checkbox-group v-model="chectedUser">
                        <el-checkbox @change="selectSingleUser" v-for="(v,k) in userLevel" :label="v.id" :key="k">{{v.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
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
        <el-dialog title="优惠券列表" :visible.sync="isShowCouponList" width="30%">
            <el-tabs v-model="couponTypecouponType" v-loading="couponLoading" @tab-click="handleClick" style="height: 500px;overflow: auto">
                <el-tab-pane label="满减券" name="1">
                    <div v-for="(v,k) in couponList" style="overflow: hidden; margin-bottom: 10px" :key="k">
                        <span :class="{'selected-coupon':true,'active-selected':v.selected}" @click="selectCoupon(v)">{{v.name}}{{v.num==0?'(暂无库存)':''}} </span>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="折扣券" name="3">
                    <div v-for="(v,k) in couponList" style="overflow: hidden; margin-bottom: 10px" :key="k">
                        <span :class="{'selected-coupon':true,'active-selected':v.selected}" @click="selectCoupon(v)">{{v.name}}{{v.num==0?'(暂无库存)':''}} </span>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="抵扣券" name="4">
                    <div v-for="(v,k) in couponList" style="overflow: hidden; margin-bottom: 10px" :key="k">
                        <span :class="{'selected-coupon':true,'active-selected':v.selected}" @click="selectCoupon(v)">{{v.name}}{{v.num==0?'(暂无库存)':''}} </span>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="抵价券" name="2">
                    <div v-for="(v,k) in couponList" style="overflow: hidden; margin-bottom: 10px" :key="k">
                        <span :class="{'selected-coupon':true,'active-selected':v.selected}" @click="selectCoupon(v)">{{v.name}}{{v.num==0?'(暂无库存)':''}} </span>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <span slot="footer">
                <el-button type="primary" @click="confirmCoupon">确 定</el-button>
                <el-button @click="isShowCouponList = false">取 消</el-button>
            </span>
        </el-dialog>
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
                nav: ['品牌产品管理', '礼包管理', '新建礼包'],
                isUseUpload: false,
                showSaleTime: false,
                checkedAllUser: false,
                uploadImg: '',
                imgArr: [],
                itemList: [],
                brandArr: [],
                freightTemplateArr: [],
                supplierArr: [],
                shipperArr: [{ label: '平台发货', value: '1' }, { label: '供应商发货', value: '2' }],
                aferServiceDays: [
                    { label: '无售后服务', value: '0' },
                    { label: '到货后7天', value: '7' },
                    { label: '到货后15天', value: '15' },
                    { label: '到货后30天', value: '30' },
                    { label: '到货后6个月', value: '180' },
                    { label: '到货后1年', value: '365' },
                    { label: '到货后2年', value: '730' },
                    { label: '到货后3年', value: '1095' }
                ],
                itemProps: {
                    value: 'value',
                    children: 'children'
                },
                proCategoryArr: [],
                form: {
                    name: '',
                    type: '1',
                    firstCategoryId: '',
                    secCategoryId: '',
                    thirdCategoryId: '',
                    brandId: '',
                    dealDays: '',
                    supplierId: '',
                    experience: '',
                    stockType: '1',
                    sendMode: '',
                    weight: '',
                    freightTemplateId: '',
                    aferServiceDays: '',
                    content: '',
                    imgFileList: [],
                    restrictions: 0,
                    paramValueList: []
                },
                // 用户层级列表
                userLevel: [],
                chectedUser: [],
                // 赠品
                gifts: {
                    isSetBuyTime: false,
                    isSetExp: false
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
                tagTypeArr: [], // 标签类型
                tagLoading: false, // 标签loading
                isShowCouponList: false, // 优惠券列表弹窗
                couponLoading: false, // 优惠券列表loding
                selectedCoupon: [], // 已选中优惠券列表
                couponList: [], // 优惠券列表
                tmpCouponList: [], // 暂时存放优惠券列表
                couponType: '1'
            };
        },

        computed: {
            qnLocation() {
                return api.uploadImg;
            }
        },

        activated() {
            this.form.restrictions = 0;
            this.getAllTagType();
            this.getUserLevel();
            this.uploadImg = api.uploadImg;
            this.selectedCoupon = [];
            this.imgArr = [];
            this.proItemArr = [];
            this.videoUrl = '';
            this.selectedTagArr = [];
            this.productParam = [];
            this.chectedUser = [];
            this.purchaseLimit = false;
            this.purchasevalue = '';
            this.isSetBuTime = false;
            this.gifts.isSetBuTime = false;
            this.gifts.isSetExp = false;
            this.setBuyTime = [];
            this.checkedAllUser = false;
            this.limit = {
                notSupportCoupon: false, // 不支持优惠券
                notSupportScore: false, // 不支持积分抵扣
                notSupportRetMoney: false, // 不支持退款
                notSupportRetChange: false, // 不支持换货
                notSupportRetGoods: false // 不支持退货
            };
            // 获取类目
            this.getAllCat();
            // 获取品牌列表
            this.getBrandList();
            // 获取运费模板
            this.getFreightTemplate();
            utils.cleanFormData(this.form);
            this.form.stockType = '1';
        },

        mounted() {
            // 为图片ICON绑定事件 getModule 为编辑器的内部属性
            this.$refs.myQuillEditor.quill
                .getModule('toolbar')
                .addHandler('image', this.imgHandler);
        },

        methods: {
            // 提交表单前进行判断
            beforeSubmit() {
                if (this.imgArr.length == 0) {
                    this.$message.warning('请添加产品图片');
                    return false;
                }
                if (this.form.weight > 9999999999999999 || this.form.weight <= 0) {
                    this.$message.warning('请输入正确的产品重量!');
                    return false;
                }
                // else if (this.selectedTagArr.length == 0) {
                //     this.$message.warning('请添加产品标签');
                //     return false;
                // }
                if (this.productParam.length !== 0) {
                    for (let i = 0; i < this.productParam.length; i++) {
                        if (this.productParam[i].value == '' || this.productParam[i].value.length > 16) {
                            this.$message.warning('请输入正确的产品参数');
                            return false;
                        }
                    }
                } else {
                    this.$message.warning('请添加产品参数');
                    return false;
                }
                if (this.chectedUser.length == 0) {
                    this.$message.warning('请选择用户层级');
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
                this.form.paramValueList = [];
                this.productParam.forEach(v => {
                    this.form.paramValueList.push({ paramId: v.id, paramValue: v.value });
                });
                this.form.imgUrl = this.imgArr[0].originalImg;
                this.form.imgFileList = this.imgArr;
                this.form.experience = this.gifts.isSetExp ? this.form.experience : '';
                const data = this.form;
                data.paramValueList = this.form.paramValueList;
                data.videoUrl = this.videoUrl;
                data.buyLimit = this.purchaseLimit ? this.purchasevalue : -1;
                data.beginTime = this.setBuyTime[0] === undefined ? '' : utils.formatTime(this.setBuyTime[0]);
                data.endTime = this.setBuyTime[1] === undefined ? '' : utils.formatTime(this.setBuyTime[1]);
                if (!this.isSetBuTime) {
                    data.beginTime = '';
                    data.endTime = '';
                }
                data.packageTagList = [];
                this.selectedTagArr.forEach(v => {
                    data.packageTagList.push({ tagId: v.value });
                });
                data.couponList = [];
                this.selectedCoupon.forEach(v => {
                    data.couponList.push({ couponId: v.id });
                });
                data.userLevelList = [];
                this.chectedUser.forEach(v => {
                    data.userLevelList.push({ userLevelId: v });
                });
                this.btnLoading = true;
                request.addActivityPackage(data).then(res => {
                    console.log(res);
                    this.btnLoading = false;
                    this.$message.success(res.msg);
                    this.$router.push('/giftManage');
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
            deleteImg(img, index) {
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
                // this.$refs['upload'].clearFiles(); // 插入成功后清除input的内容
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
            getProductParam(secId) {
                this.productParam = [];
                request.queryProductCategoryParamList({ id: secId }).then(res => {
                    res.data.forEach((v, k) => {
                        v.value = '';
                        this.productParam.push(v);
                    });
                }).catch(err => {
                    console.log(err);
                });
            },
            // 获取用户层级列表
            getUserLevel() {
                request.getLevelList({}).then(res => {
                    this.userLevel = res.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            // 全选用户层级
            selectedAlLevel(val) {
                this.chectedUser = [];
                if (val) {
                    this.userLevel.forEach(v => {
                        this.chectedUser.push(v.id);
                    });
                }
            },
            // 单选用户层级
            selectSingleUser() {
                if (this.chectedUser.length === this.userLevel.length) {
                    this.checkedAllUser = true;
                } else {
                    this.checkedAllUser = false;
                }
            },
            // 显示优惠券列表
            showAddCouList() {
                this.isShowCouponList = true;
                this.couponTypecouponType = '1';
                this.handleClick({ name: '1' });
                this.tmpCouponList = [];
                this.tmpCouponList.push(...this.selectedCoupon);
            },
            // 选择优惠券类型
            handleClick(tab) {
                this.couponLoading = true;
                request.queryCouponByType({ type: tab.name }).then(res => {
                    this.couponLoading = false;
                    this.couponList = [];
                    const tmp = [];
                    tmp.push(...this.selectedCoupon, ...this.tmpCouponList);
                    if (res.data.length === 0) return;
                    res.data.forEach(v => {
                        const obj = {
                            name: v.name,
                            id: v.id,
                            num: v.totalNumber,
                            selected: false
                        };
                        for (let i = 0; i < tmp.length; i++) {
                            if (tmp[i].id == obj.id) {
                                obj.selected = true;
                            }
                        }
                        this.couponList.push(obj);
                    });
                }).catch(err => {
                    this.couponLoading = false;
                    console.log(err);
                });
            },
            // 删除选中优惠券
            deleteSelectedCoupon(index) {
                this.selectedCoupon.splice(index, 1);
            },
            //  选择优惠券
            selectCoupon(coupon) {
                coupon.selected = true;
                if (coupon.num == 0) return this.$message.warning('该优惠券库存为0！');
                for (let i = 0; i < this.tmpCouponList.length; i++) {
                    if (this.tmpCouponList[i].id == coupon.id) {
                        coupon.selected = false;
                        this.tmpCouponList.splice(i, 1);
                        return;
                    }
                }
                this.tmpCouponList.push(coupon);
            },
            // 确定添加优惠券
            confirmCoupon() {
                this.isShowCouponList = false;
                this.selectedCoupon = [];
                this.selectedCoupon.push(...this.tmpCouponList);
            },
            // 修改礼包状态
            changeGiftStatus(status) {
                if (status == 1) {
                    this.gifts.isSetExp = false;
                    this.limit.notSupportCoupon = true; // 不支持优惠券
                    this.limit.notSupportRetChange = true; // 不支持换货
                    this.form.experience = '';
                } else {
                    this.limit.notSupportCoupon = true; // 不支持优惠券
                    this.limit.notSupportRetMoney = true; // 不支持退款
                    this.limit.notSupportRetChange = true; // 不支持换货
                    this.limit.notSupportRetGoods = true; // 不支持退货
                }
            },
            // 返回
            goBack() {
                this.$router.push('/giftManage');
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
        .selected-coupon{
            display: block;
            float: left;
            width: 300px;
            height: 30px;
            line-height: 30px;
            border: 1px solid #ccc;
            padding-left: 10px;
            border-radius: 10px;
            margin-right: 10px;
            cursor: pointer;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .active-selected{
            background-color: #33b4ff;
            color: #fff;
            border: 1px solid #33b4ff;;
        }
        .delete-coupon{
            cursor: pointer;
            color: #33b4ff;;
            float: left;
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
