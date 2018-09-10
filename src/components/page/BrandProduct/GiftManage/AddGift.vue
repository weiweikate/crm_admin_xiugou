<template>
    <div class="add-gift">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
            <div class="pro-title">基本信息</div>
            <el-form :model="form" ref="form" label-width="100px">
                <el-form-item label="礼包名称">
                    <el-input style="width:300px" :maxlength="16" v-model="form.name" placeholder="请输入产品名称"></el-input>
                </el-form-item>
                <el-form-item label="产品图片">
                    <draggable style="display:inline-block" v-model="imgArr" :move="getdata" @update="datadragEnd">
                        <transition-group>
                            <div class="img-wrap" v-for="(v,k) in imgArr" :key="k">
                                <div class="delImg" @click="deleteImg(v)">
                                    <icon ico='icon-shanchu'></icon>
                                </div>
                                <img class="uImg" :src="v">
                            </div>
                        </transition-group>
                    </draggable>
                    <el-upload class="img-uploader" :action="uploadImg" :show-file-list="false"
                               :on-success="successUpload" :disabled="isUseUpload" multiple>
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <div class="upload-tip">建议尺寸：800*800,拖拽图片可以改变顺序，第一张为默认头图</div>
                </el-form-item>
                <el-form-item label="产品分类">
                    <el-cascader filterable  @change='getProItemId' @active-item-change='handleItemChange' v-model="proItemArr" :options="itemList" :props="itemProps"></el-cascader>
                    <span style="margin-left:30px">产品品牌</span>
                    <el-select @change="getSupplyList" v-model="form.brandId" placeholder="请选择">
                        <el-option v-for="(v,k) in brandArr" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="供应商">
                    <el-select v-model="form.supplier" placeholder="下拉搜索供应商">
                        <el-option v-for="(v,k) in supplierList" :key="k" :label="v.label"
                                   :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发货方">
                    <el-select v-model="form.originAddress" placeholder="选择发货方">
                        <el-option v-for="(v,k) in shipperArr" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品重量">
                    <el-input class="pro-weight" v-model="form.weight"></el-input>kg
                </el-form-item>
                <el-form-item label="产品参数">
                    <div class="product-param">
                        <span v-if='productParam.length == 0'>暂无数据</span>
                        <span v-else v-for="(v,k) in productParam" :key="k">{{v.param}}：<el-input class="inp-param" v-model="v.value"></el-input></span>
                    </div>
                </el-form-item>
                <div class="pro-title">运费其他</div>
                <el-form-item label="选择运费模板">
                    <el-select v-model="form.freightTpl" placeholder="请选择模板">
                        <el-option v-for="(v,k) in freightTemplateArr" :key="k" :label="v.label"
                                   :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交易默认时间">
                    <transition name="fade">
                        <el-select v-if="!showSaleTime" v-model="form.saleTime">
                            <el-option
                                v-for="(item,index) in times"
                                :key="index"
                                :label="item.label"
                                :value="item.id"
                            >
                                {{item.label}}
                            </el-option>
                        </el-select>
                        <el-input style='width:215px' v-if="showSaleTime" v-model="form.saleTime"></el-input>
                    </transition>
                    <el-button @click="defSaleTime">自定义</el-button>
                </el-form-item>
                <div class="pro-title">产品详情</div>
                <el-form-item>
                    <quill-editor v-model="form.editorContent" ref="myQuillEditor" :options="editorOption"
                                  @change="onEditorChange($event)"></quill-editor>
                    <el-upload :action="qnLocation" :data="uploadData"
                               :on-success='upScuccess' ref="upload" style="display:none">
                        <el-button size="small" type="primary" id="imgInput" element-loading-text="插入中,请稍候">点击上传
                        </el-button>
                    </el-upload>
                </el-form-item>
                <div class="pro-title">礼包可购买角色设置</div>
                <el-form-item label="请选择角色层级" class="role-choose">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                        全部用户
                    </el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="checkedUsers" @change="handleCheckedUsersChange">
                        <el-checkbox v-for="(item,index) in users" :label="item.id" :key="index">{{item.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                    <div class="tips">选择层级之后，根据用户的等级，购买受到限制</div>
                </el-form-item>
                <div class="selected-tag">
                    <span v-if="selectedTagArr.length == 0" class="tag-tip">请选择标签</span>
                    <el-tag class="tag" type="info" closable v-for="(v,k) in selectedTagArr" :key="k" @close="handleClose(k,v)" >{{v.label}}</el-tag>
                </div>
                <div class="add-tag">
                    <el-input style="width:215px;margin-right:20px" v-model="tagName" placeholder="请输入标签/至多可添加20个"></el-input>
                    <el-button type="primary" @click="addTag">添加标签</el-button>
                </div>
                <div class="tag-list">
                    <span v-if="tagArr.length == 0" class="tag-tip">请添加标签</span>
                    <el-button style="margin-bottom:10px" v-for="(v,k) in tagArr" :key="k" @click="insertTag(v)" :disabled="v.selected" :class="{'selected-btn':v.selected}">{{v.label}}</el-button>
                </div>
                <el-button @click="submitForm" type="primary">确认发布</el-button>
                <el-button @click="goBack">取消</el-button>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from "@/components/common/Breadcrumb.vue";
    import draggable from "vuedraggable";
    import Quill from "quill";
    import icon from "@/components/common/ico";
    import * as api from "@/api/BrandProduct/GiftMange/index.js";
    import * as pApi from "@/privilegeList/BrandProduct/ProductMange/index.js";
    import utils from "@/utils/index.js";

    export default {
        components: {
            draggable,
            vBreadcrumb,
            icon
        },

        data() {
            return {
                nav: ["品牌产品管理", "礼包管理", "发布礼包"],
                isUseUpload: false, // 上传礼包图片
                showSaleTime: false,
                uploadImg: "",
                // 礼包原图图片
                imgArr: [],
                // 礼包缩略图图片
                imgSmallArr: [],
                // 供应商列表
                supplierList:[],
                // 分类列表值
                proItemArr: [],
                brandArr:[],    // 品牌列表
                freightTemplateArr:[],  // 运费模板列表
                // 发货地列表
                shipperArr:[{label:'平台发货',value:'1'},{label:'供应商发货',value:'2'}],
                // 售后周期
                times: [{label: '7天', id: "7"},
                    {label: '10天', id: "10"},
                    {label: '15天', id: "15"},
                    {label: '20天', id: "20"},
                    {label: '25天', id: "25"},
                    {label: '30天', id: "30"},
                ],
                checkAll: false,    // 用户层级全选
                checkedUsers: [],   // 用户层级选中的用户
                users: [],  // 用户层级
                itemList:[],    // 一级类目列表
                isIndeterminate: false,
                // 产品参数
                productParam:[],
                form: {
                    name: "",   // 礼包名称
                    firstCategoryId: "",    // 一级分类id
                    secCategoryId:"",   // 二级分类id
                    brandId: "",    // 品牌id
                    supplier: "",   // 供应商
                    originAddress: "",     //发货方
                    weight: "", // 重量
                    freightTpl: "", // 运费模板
                    saleTime: "",   // 交易默认时间
                    editorContent: "",  // 富文本编辑器
                    pushWay:'', // 用户层级字符串
                    tagStr:'',  // 已选中标签字符串
                    imgStr:'',  // 产品图片字符串
                    imgSmallStr:''
                },
                // 级联选择器配置选项
                itemProps: {
                    value: "value",
                    children: "children",
                },
                editorOption: {
                    placeholder: "请输入内容",
                    modules: {
                        // 配置富文本
                        toolbar: [
                            ["bold", "italic", "underline", "strike"],
                            ["blockquote", "code-block"],
                            [{header: 1}, {header: 2}],
                            [{direction: "rtl"}],
                            [{size: ["small", false, "large", "huge"]}],
                            [{header: [1, 2, 3, 4, 5, 6, false]}],
                            [{color: []}, {background: []}],
                            [{font: []}],
                            [{align: []}],
                            ["clean"],
                            ["link", "image"]
                        ]
                    }
                },
                uploadData: {},
                uploadType: "", // 上传的文件类型（图片、视频）,
                tagArr: [],// 所有标签
                selectedTagArr: [],
                tagName: ''
            };
        },

        computed: {
            qnLocation() {
                return location.protocol === "http:" ? api.addImg : api.addImg;
            }
        },

        activated() {
            this.uploadImg = api.addImg;
            // 清空数据
            this.imgArr = [];
            this.imgSmallArr = [];
            this.selectedTagArr = [];
            this.checkedUsers = [];
            this.isIndeterminate = false;
            utils.cleanFormData(this.form);

            // 获取所有标签
            this.getAllTags();
            // 获取一级类目列表
            this.getFirstItem();
            //加载用户层级
            this.getLevelList();
            // 获取运费模板列表
            this.getFreightTemplate();
        },

        mounted() {
            // 为图片ICON绑定事件 getModule 为编辑器的内部属性
            this.$refs.myQuillEditor.quill
                .getModule("toolbar")
                .addHandler("image", this.imgHandler);
        },

        methods: {
            // 提交表单
            submitForm(){
                // 处理产品图片,标签,产品参数
                let tagTmp = [];
                this.selectedTagArr.forEach((v,k)=>{
                    tagTmp.push(v.value);
                })
                this.form.tagStr = tagTmp.join(',')
                this.form.imgStr = this.imgArr.join(',')
                this.form.imgSmallStr = this.imgSmallArr.join(',');
                // 判空
                for (const key in this.form) {
                    if (this.form[key] == '' && (this.form[key] != 'original_img' ||this.form[key] != 'small_img') ) {
                        console.log(this.form)
                        this.$message.warning('礼包参数不能为空，请输入完整参数');
                        return;
                    }
                }
                if(this.productParam.length == 0){
                    this.$message.warning('请输入产品参数');
                    return false;
                }
                // 表单提交
                let data = {};
                if(this.form.name.length<4){
                    this.$message.warning('礼包名称不能少于四位');
                    return;
                }
                data.giftName = this.form.name; // 礼包名称
                data.classifyId = this.form.firstCategoryId; // 一级类目id
                data.secCategoryId = this.form.secCategoryId; // 二级类目id
                data.brandId = this.form.brandId; // 品牌id
                data.supplierId = this.form.supplier; // 供应商
                data.shipperId = this.form.originAddress; // 发货方
                data.weight = this.form.weight; // 重量
                data.freightId = this.form.freightTpl; // 运费模版
                data.afterSaleDays = this.form.saleTime; // 交易默认时间
                data.details = this.form.editorContent; // 礼包介绍
                data.roleStr = this.form.pushWay; // 用户层级
                data.tagStr = this.form.tagStr; // 标签
                data.originalImgStr = this.form.imgStr; // 原图
                data.smallImgStr = this.form.imgSmallStr; // 缩略图
                // 产品参数
                let paramTmp = [];
                this.productParam.forEach((v,k)=>{
                    paramTmp.push({paramId: v.id, value: v.value})
                })
                data.specStr = JSON.stringify(paramTmp);
                this.$axios.post(api.addGiftBag,data).then(res=>{
                    this.$message.success(res.data.msg);
                    this.$router.push('giftManage');
                })
            },
            //  图片上传/拖拽
            getdata(evt) {
                //   console.log(evt.draggedContext.element.url);
            },
            datadragEnd(evt) {
                //   console.log(this.imgArr);
            },
            // 上传图片成功回调
            successUpload(res) {
                this.$message.warning("上传中...");
                if (res.code == 200) {
                    if (this.imgArr.length >= 5) {
                        this.isUseUpload = true;
                        this.$message.warning("最多只能上传五张图片");
                        return;
                    }
                    this.imgArr.push(res.data.imageUrl);
                    this.imgSmallArr.push(res.data.imageThumbUrl);
                    this.$message.success("上传成功");
                } else {
                    this.$message.warning(res.data.msg);
                }
            },
            // 删除图片
            deleteImg(img) {
                let index = this.imgArr.indexOf(img);
                if (index == -1) {
                    return;
                }
                this.imgArr.splice(index, 1);
                this.imgSmallArr.splice(index, 1);
                if (this.imgArr.length < 5) {
                    this.isUseUpload = false;
                }
            },
            // 自定义售后周期
            defSaleTime() {
                this.form.saleTime = "";
                this.showSaleTime = !this.showSaleTime;
            },
            // 富文本编辑器
            onEditorChange({editor, html, text}) {
                this.form.editorContent = html;
            },
            // 图片上传成功回调 插入到编辑器中
            upScuccess(e, file, fileList) {
                this.fullscreenLoading = false;
                let vm = this;
                let url = "";
                if (this.uploadType === "image") {
                    // 获得文件上传后的URL地址
                    url = e.data.imageUrl;
                    this.form.original_img = e.data.imageUrl;
                    this.form.small_img = e.data.imageThumbUrl;
                }
                if (url != null && url.length > 0) {
                    // 将文件上传后的URL地址插入到编辑器文本中
                    let value = url;
                    // this.$refs.myTextEditor.quillEditor.getSelection();
                    // 获取光标位置对象，里面有两个属性，一个是index 还有 一个length，这里要用range.index，即当前光标之前的内容长度，然后再利用 insertEmbed(length, 'image', imageUrl)，插入图片即可。
                    vm.addRange = vm.$refs.myQuillEditor.quill.getSelection();
                    value = value.indexOf("http") !== -1 ? value : "http:" + value;
                    vm.$refs.myQuillEditor.quill.insertEmbed(
                        vm.addRange !== null ? vm.addRange.index : 0,
                        vm.uploadType,
                        value,
                        Quill.sources.USER
                    ); // 调用编辑器的 insertEmbed 方法，插入URL
                    this.$message.success("插入成功");
                } else {
                    this.$message.error(`${vm.uploadType}插入失败`);
                }
                this.$refs["upload"].clearFiles(); // 插入成功后清除input的内容
            },
            // 点击图片ICON触发事件
            imgHandler(state) {
                this.addRange = this.$refs.myQuillEditor.quill.getSelection();
                if (state) {
                    let fileInput = document.getElementById("imgInput");
                    fileInput.click(); // 加一个触发事件
                }
                this.uploadType = "image";
            },
            // 关闭标签
            handleClose(index,value) {
                this.selectedTagArr.splice(index,1);
                this.tagArr.forEach((v,k)=>{
                    if(value.label == v.label){
                        this.tagArr[k].selected = false;
                    }
                })
            },
            // 加入新的标签
            addTag(){
                if(this.tagName == ''){
                    this.$message.warning('请输入正确的标签');
                    return;
                }
                let tmp = false;
                this.tagArr.forEach((v,k)=>{
                    if(this.tagName == v.label){
                        tmp = true;
                    }
                })
                if(!tmp){
                    let data = {};
                    data.name = this.tagName;
                    data.url = pApi.addProduct;
                    data.type = 2;
                    this.$axios.post(api.addTagLibrary,data)
                        .then(res=>{
                            this.$message.success('添加成功!');
                            this.tagName = '';
                            this.getAllTags();
                        })
                        .catch(err=>{
                            console.log(err)
                        })

                }else{
                    this.$message.warning('标签已经添加，请不要重复添加!');
                }
            },
            // 添加标签
            insertTag(v){
                if(this.selectedTagArr.length >19){
                    this.$message.warning('最多添加20个标签');
                    return;
                }
                v.selected = true;
                this.selectedTagArr.push({label:v.label,value:v.value});
            },
            // 获取所有标签
            getAllTags(){
                this.tagArr = [];
                this.$axios
                    .post(api.queryTagLibraryList, {type:2})
                    .then(res => {
                        res.data.data.forEach((v,k)=>{
                            this.tagArr.push({label:v.name,value:v.id})
                        })
                        this.tagArr.forEach((v,k) => {
                        this.selectedTagArr.forEach((v1,k1)=>{
                            if(v.value == v1.value){
                            v.selected = true;
                            }
                        })
                        });
                    })
                    .catch(err => {
                    console.log(err);
                    });
            },
            //获取用户层级列表
            getLevelList() {
                let that = this;
                let data = {};
                that.$axios
                    .post(api.getDealerLevelList, data)
                    .then(res => {
                        that.users = res.data.data;
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            //推送人群选择
            handleCheckAllChange(val) {
                this.checkedUsers = [];
                this.isIndeterminate = false;
                if(val){
                    this.users.forEach((v,k)=>{
                        this.checkedUsers.push(v.id)
                    })
                    this.form.pushWay = this.checkedUsers.join(',')
                }else{
                    this.checkedUsers = [];
                    this.form.pushWay = '';
                }
            },
            handleCheckedUsersChange(value) {
                let checkedCount = value.length;
                this.form.pushWay = value.join(',');
                this.checkAll = checkedCount === this.users.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.users.length;
            },
             // 获取一级类目
            getFirstItem() {
                this.itemList = [];
                this.$axios
                .post(api.getCategoryList, { fatherid: 0,pageSize:1000000})
                .then(res => {
                    res.data.data.data.forEach((v,k)=>{
                        this.itemList.push({label:v.name,value:v.id,children:[]});
                        // this.handleItemChange(v.id)
                    })
                })
                .catch(err => {
                    console.log(err);
                });
            },
            // 获取二级类目
            handleItemChange(val){
                let index = 0;
                this.itemList.forEach((v,k)=>{
                    if(v.value == val[0]){
                        index = k;
                    }
                })
                let data ={};
                data.fatherid = val[0];
                data.pageSize = 1000000;
                this.itemList[index].children = [];
                this.$axios
                .post(api.getCategoryList, data)
                .then(res => {
                    res.data.data.data.forEach((v,k)=>{
                        this.itemList[index].children.push({label:v.name,value:v.id});
                    })
                })
                .catch(err => {
                    console.log(err);
                });
            },
            // 获取品牌列表
            getProItemId(val){
                this.form.brandId = ''
                let id = this.form.secCategoryId = val[1];
                this.form.firstCategoryId = val[0];
                this.form.secCategoryId = val[1];
                this.getProductParam(val[1])
                this.brandArr = [];
                this.$axios
                .post(api.queryCategoryBrandCid, {cId:id,pageSize:1000000})
                .then(res => {
                    res.data.data.forEach((v,k)=>{
                        this.brandArr.push({label:v.name,value:v.id})
                    })
                })
                .catch(err => {
                    console.log(err);
                });
            },
            // 获取供应商列表
            getSupplyList(){
                this.form.supplier = '';
                let data = {};
                this.supplierList = [];
                data.firstCategoryId = this.form.firstCategoryId;
                data.secCategoryId = this.form.secCategoryId;
                data.brandId = this.form.brandId;
                data.pageSize = 1000000
                this.$axios
                    .post(api.querySupplierBrandPageList, data)
                    .then(res => {
                        res.data.data.forEach((v,k)=>{
                            this.supplierList.push({label:v.name,value:v.supplier_id})
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 获取运费模板列表
            getFreightTemplate(){
                this.freightTemplateArr = [];
                this.$axios
                    .post(api.getFreightTemplateList, {})
                    .then(res => {
                        res.data.data.forEach((v,k)=>{
                            this.freightTemplateArr.push({label:v.name,value:v.id})
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 返回礼包列表
            goBack(){
                this.$router.push('giftManage');
            },
            // 获取产品参数
            getProductParam(secId){
                this.$axios.post(api.infoParmByCategoryIdList,{categoryId:secId}).then(res=>{
                    this.productParam = [];
                    res.data.data.forEach((v,k)=>{
                    v.value = '';
                    this.productParam.push(v);
                    })
                })
            }
        }
    };
</script>
<style lang='less'>
    .add-gift {
        color: #666;
        .address-item {
            .el-form-item__label {
                line-height: 20px
            }
        }
        .quill-editor {
            margin-left: -100px;
        }
        .role-choose {
            .el-form-item__label {
                width: 120px !important;
            }
        }
        .el-checkbox-group{
            margin-left: 20px;
        }
        .tips{
            margin-left: 20px;
            font-size: 12px;
            color: #ff6868;
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
            // height: 58px;
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
        .gift-info-wrap{
            width: 100%;
            border: 1px solid  #eee;
            padding: 10px;
            box-sizing: border-box;
            .gift-info-item{
                width: 100%;
                .gift-info-title{
                    position: relative;
                    width: 100%;
                    height: 60px;
                    line-height: 40px;
                    padding: 10px 30px;
                    box-sizing: border-box;
                    background-color: #f7f7f7;
                    .delete-btn{
                        position: absolute;
                        top: 16px;
                        right: 30px;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        border: 2px solid #a5a5a5;
                        cursor: pointer;
                        text-align: center;
                        line-height: 24px;
                        color: #a5a5a5;
                        font-size: 18px;
                        font-weight: 700;
                    }
                }
                .gift-info-content{
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    height: 40px;
                    line-height:40px;
                    padding-left: 60px;
                    margin: 20px 0;
                    box-sizing: border-box;
                    .el-input--small .el-input__inner{
                        line-height: 30px;
                    }
                    .el-input-group__append, .el-input-group__prepend{
                        padding: 0 5px;
                    }
                }
            }
            .gift-info-footer{
                display: inline-block;
                color: #22aeff;
                font-size: 14px;
                margin-left: 30px;
                cursor: pointer;
            }
        }
    }
</style>
