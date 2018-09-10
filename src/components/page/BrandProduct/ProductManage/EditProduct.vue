<template>
  <div class="release-product">
      <v-breadcrumb :nav='nav'></v-breadcrumb>
      <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
          <div class="pro-title">基本信息</div>
          <el-form :model="form" ref="form" label-width="100px">
            <el-form-item label="产品名称">
                <el-input style="width:300px" :maxlength="16" v-model="form.name" placeholder="请输入产品名称"></el-input>
            </el-form-item>
            <!-- <el-form-item label="产品ID">
                <el-input style="width:300px" v-model="form.prodCode" placeholder="请输入产品ID"></el-input>
            </el-form-item> -->
            <el-form-item label="产品图片">
                <draggable style="display:inline-block" v-model="imgArr" :move="getdata" @update="datadragEnd">
                    <transition-group>
                        <div class="img-wrap" v-for="(v,k) in imgArr" :key="k">
                            <div class="delImg" @click="deleteImg(v)"><icon ico='icon-shanchu'></icon></div>
                            <img class="uImg" :src="v.originUrl">
                        </div>
                    </transition-group>
                </draggable>
                <el-upload class="img-uploader" :before-upload="beforeUploadArr" :action="uploadImg" :show-file-list="false" :on-success="successUpload" :disabled="isUseUpload" multiple >
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div class="upload-tip">建议尺寸：800*800,拖拽图片可以改变顺序，第一张为默认头图</div>
            </el-form-item>
            <el-form-item label="产品分类">
                <el-cascader @change='getProItemId' v-model="categoryArr" :options="itemList" :props="itemProps"></el-cascader>
                <span style="margin-left:30px">产品品牌</span>
                <el-select @change="getSupplyList" v-model="form.brandId" placeholder="请选择">
                  <el-option v-for="(v,k) in brandArr" :key="k" :label="v.label" :value="v.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="供应商">
                <el-select v-model="form.supplierId" placeholder="下拉搜索供应商">
                  <el-option v-for="(v,k) in supplierArr" :key="k" :label="v.label" :value="v.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发货方">
                <el-select v-model="form.sendfrom" placeholder="选择发货方">
                  <el-option v-for="(v,k) in shipperArr" :key="k" :label="v.label" :value="v.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品重量">
                <el-input class="pro-weight" v-model="form.weight"></el-input>kg
            </el-form-item>
            <el-form-item label="产品体积">
                <el-input class="pro-weight" v-model="form.volume"></el-input>m³
            </el-form-item>
            <el-form-item label="产品参数">
              <div class="product-param">
                <span v-if='productParam.length == 0'>暂无数据</span>
                <span v-else v-for="(v,k) in productParam" :key="k">{{v.parm}}：<el-input class="inp-param" v-model="v.parm_value"></el-input></span>
              </div>
            </el-form-item>
            <div class="pro-title">基本信息</div>
            <el-form-item label="选择运费模板">
                <el-select v-model="form.freightTemplateId" placeholder="请选择模板">
                  <el-option v-for="(v,k) in freightTemplateArr" :key="k" :label="v.label" :value="v.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="售后周期">
              <transition name="fade">
                <el-select v-if="!showSaleTime" v-model="form.aferServiceDays" placeholder="请选择售后周期">
                  <el-option v-for="(v,k) in aferServiceDays" :key="k" :label="v.label" :value="v.value"></el-option>
                </el-select>
                <el-input v-if='showSaleTime' v-model="form.aferServiceDays" style="width:215px" placeholder="请输入售后周期"></el-input>
              </transition>
                <el-button @click="defSaleTime">自定义</el-button>
            </el-form-item>
            <div class="pro-title">产品信息</div>
            <quill-editor v-model="form.content" ref="myQuillEditor" :options="editorOption" @change="onEditorChange($event)"></quill-editor>
            <el-upload :action="qnLocation" :data="uploadData" :on-success='upScuccess' ref="upload" style="display:none">
              <el-button size="small" type="primary" id="imgInput" element-loading-text="插入中,请稍候">点击上传</el-button>
            </el-upload>
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
            <el-button type="primary" @click="submitForm">确认发布</el-button>
            <!-- <el-button >取消</el-button> -->
          </el-form>
      </el-card>
  </div>
</template>

<script>
import vBreadcrumb from "@/components/common/Breadcrumb.vue";
import draggable from "vuedraggable";
import Quill from "quill";
import icon from "@/components/common/ico";
import * as api from "@/api/BrandProduct/ProductMange/index.js";
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
      nav: ["品牌产品管理", "产品管理", "发布产品"],
      isUseUpload: false,
      showSaleTime: false,
      productId:'',
      uploadImg: "",
      imgArr:[],
      itemList: [],
      brandArr:[],
      freightTemplateArr:[],
      supplierArr:[],
      shipperArr:[{label:'平台发货',value:'1'},{label:'供应商发货',value:'2'}],
      categoryArr:[],
      aferServiceDays:[
        {label:'无售后服务',value:'0'},
        {label:'到货后7天',value:'7'},
        {label:'到货后15天',value:'15'},
        {label:'到货后30天',value:'30'},
        {label:'到货后6个月',value:'180'},
        {label:'到货后1年',value:'365'},
        {label:'到货后2年',value:'730'},
        {label:'到货后3年',value:'1095'},
      ],
      itemProps: {
        value: "value",
        children: "children",
      },
      proCategoryArr: [],
      form: {
        name: "",
        // prodCode:"",
        firstCategoryId: "",
        secCategoryId:"",
        brandId: "",
        supplierId: "",
        sendfrom:"",
        weight: "",
        volume: "",
        freightTemplateId: "",
        aferServiceDays: "",
        content: "",
        tagId:'',
        originalImg:'',
        smallImg:''
      },
      productParam:[], // 产品参数
      editorOption: {
        placeholder: "请输入内容",
        modules: {
          // 配置富文本
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
            ["link", "image"]
          ]
        }
      },
      uploadData: {},
      uploadType: "", // 上传的文件类型（图片、视频）,
      selectedTagArr:[],
      tagArr:[],
      tagName:'',
    };
  },

  computed: {
    qnLocation() {
      return location.protocol === "http:" ? api.addImg : api.addImg;
    }
  },

  activated() {
    this.uploadImg = api.addImg;
    this.imgArr = [];
    this.selectedTagArr = [];
    // 获取一级类目
    this.getFirstItem();
    // 获取运费模板
    this.getFreightTemplate();
    utils.cleanFormData(this.form);
    // 获取产品信息
    this.productId = this.$route.query.releaseProductId || sessionStorage.getItem('releaseProduct');
    this.getProductInfo();
  },

  mounted() {
      // 为图片ICON绑定事件 getModule 为编辑器的内部属性
      this.$refs.myQuillEditor.quill
          .getModule("toolbar")
          .addHandler("image", this.imgHandler);
  },

  methods: {
    // 获取产品信息
    getProductInfo(){
      let data = {};
      data.productId = this.productId;
      data.url = pApi.findProductAllDataById;
      this.$axios.post(api.findProductAllDataById,data)
      .then((res) => {
        this.imgArr = [];
        res.data.data.originalList.forEach((v,k)=>{
          this.imgArr.push({'originUrl':v,'smallUrl':res.data.data.smalllList[k]})
        })
        this.categoryArr = [];
        this.categoryArr.push(res.data.data.product.first_category_id);
        this.categoryArr.push(res.data.data.product.sec_category_id);
        this.getProItemId(this.categoryArr,true);
        this.form.brandId = res.data.data.product.brand_id;
        this.getSupplyList();
        this.form.supplierId = res.data.data.product.supplier_id;
        this.form.sendfrom = res.data.data.product.sendfrom.toString();
        this.form.name = res.data.data.product.name;
        // this.form.prodCode = res.data.data.product.prod_code;
        this.form.weight = res.data.data.product.weight;
        this.form.volume = res.data.data.product.volume ;
        this.form.freightTemplateId = res.data.data.product.freight_template_id;
        this.form.aferServiceDays = res.data.data.product.afer_service_days.toString();
        this.form.content = res.data.data.product.content;
        this.selectedTagArr = [];
        res.data.data.tagProduct.forEach((v,k)=>{
          this.selectedTagArr.push({label:v.tagName,value:v.tag_id});
        })
        this.productParam = [];
        res.data.data.infoValue.forEach((v,k)=>{
          this.productParam.push({id:v.parm_id,parm:v.parm,parm_value:v.parm_value})
        })
        this.getAllTags();
      }).catch((err) => {
        console.log(err)
      });
    },
    // 提交表单前进行判断
    beforeSubmit(){
      if(this.imgArr.length == 0){
        this.$message.warning('请添加产品图片');
        return false;
      }else if(this.selectedTagArr.length == 0){
        this.$message.warning('请添加产品标签');
        return false;
      }else if(!(parseInt(this.form.weight) >= 0)){
        this.$message.warning('请输入正确的重量');
        return false;
      }else if(!(parseInt(this.form.volume) >= 0)){
        this.$message.warning('请输入正确的体积');
        return false;
      }
      if(this.productParam.length == 0){
        this.$message.warning('请输入产品参数');
        return false;
      }
      return true;
    },
    // 提交表单
    submitForm(){
      let isCanSubmit = this.beforeSubmit();
      if(!isCanSubmit){
        return;
      }
      let tmp=[],tmpSmalUrll=[],tmpOriUrl = [];
      this.selectedTagArr.forEach((v,k)=>{
        tmp.push(v.value)
      })
      this.form.tagId = tmp.join(',');
      this.imgArr.forEach((v,k)=>{
        tmpSmalUrll.push(v.smallUrl);
        tmpOriUrl.push(v.originUrl);
      })
      this.form.smallImg = JSON.stringify(tmpSmalUrll);
      this.form.originalImg = JSON.stringify(tmpOriUrl);
      this.form.type = 2;
      let data = {};
      data = this.form;
      data.id = this.productId;
      data.url = pApi.findProductAllDataById;
      let paramTmp = [];
      this.productParam.forEach((v,k)=>{
        paramTmp.push({parmId: v.id, parmValue: v.parm_value})
      })
      data.specStr = JSON.stringify(paramTmp);
      this.$axios.post(api.updateProduct,data)
      .then(res=>{
        this.$message.success(res.data.data);
        this.$router.push('/productList');
      })
      .catch(err=>{
        console.log(err);
      })
    },
    beforeUploadArr(){
      this.$message.warning("上传中...");
    },
    //  图片上传/拖拽
    getdata(evt) {
      //   console.log(evt.draggedContext.element.url);
    },
    datadragEnd(evt) {
      //   console.log(this.imgArr);
    },
    successUpload(res) {
      if (res.code == 200) {
        if (this.imgArr.length >= 5) {
          this.isUseUpload = true;
          this.$message.warning("最多只能上传五张图片");
          return;
        }
        this.imgArr.push({originUrl:res.data.imageUrl,smallUrl:res.data.imageThumbUrl});
        this.$message.success("上传成功");
      } else {
        this.$message.warning(res.data.msg);
      }
    },
    // 删除图片
    deleteImg(img) {
      let index = -1;
      this.imgArr.forEach((v,k) => {
          if(v.originUrl == img.originUrl){
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
      this.form.aferServiceDays = "";
      this.showSaleTime = !this.showSaleTime;
    },
    // 富文本编辑器
    onEditorChange({ editor, html, text }) {
      this.form.content = html;
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
        console.log(e);
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
        data.url = pApi.findProductAllDataById;
        data.type= 2;
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
    // 获取一级类目
    getFirstItem() {
      this.itemList = [];
      this.$axios
        .post(api.getCategoryList, { fatherid: 0,pageSize:1000000,url:pApi.findProductAllDataById})
        .then(res => {
            res.data.data.data.forEach((v,k)=>{
                this.itemList.push({label:v.name,value:v.id,children:[]})
                this.handleItemChange(v.id)
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
          if(v.value == val){
              index = k;
          }
      })
      let data ={};
      data.fatherid = val;
      data.url = pApi.findProductAllDataById;
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
    getProItemId(val,flag){
      this.form.brandId = '';
      let id = this.form.secCategoryId = val[1];
      this.form.firstCategoryId = val[0];
      this.form.secCategoryId = val[1];
      this.brandArr = [];
      // 如果flag等于true说明是编辑
      if(!flag){
        this.getProductParam(val[1])
      }
      this.$axios
        .post(api.queryCategoryBrandCid, {cId:id,pageSize:1000000,url:pApi.findProductAllDataById})
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
      this.form.supplierId = '';
      let data = {};
      this.supplierArr = [];
      data.firstCategoryId = this.form.firstCategoryId;
      data.secCategoryId = this.form.secCategoryId;
      data.brandId = this.form.brandId;
      data.url = pApi.findProductAllDataById;
      data.pageSize = 1000000;
      this.$axios
        .post(api.querySupplierBrandPageList, data)
        .then(res => {
            res.data.data.forEach((v,k)=>{
              this.supplierArr.push({label:v.name,value:v.supplier_id})
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
        .post(api.getFreightTemplateList, {url:pApi.findProductAllDataById})
        .then(res => {
            res.data.data.forEach((v,k)=>{
              this.freightTemplateArr.push({label:v.name,value:v.id})
            })
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取所有标签
    getAllTags(){
      this.tagArr = [];
       this.$axios
        .post(api.queryTagLibraryList, {url:pApi.findProductAllDataById,type:2})
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
    // 获取产品参数
    getProductParam(secId){
      this.$axios.post(api.infoParmByCategoryIdList,{categoryId:secId}).then(res=>{
        this.productParam = [];
        res.data.data.forEach((v,k)=>{
          v.parm_value = '';
          this.productParam.push(v);
        })
      })
    }
  }
};
</script>
<style lang='less'>
.release-product {
  color: #666;
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
    border: 1px solid #e8edf0;
    line-height: 58px;
    padding: 0 15px;
    .inp-param {
      width: 90px;
      margin: 0 50px 0 10px;
    }
  }
  .selected-tag{
    width: 100%;
    padding: 6px 22px;
    box-sizing: border-box;
    border: 1px solid #e8edf0;
    border-radius: 5px;
    margin-top: 20px;
    .tag{
      margin-right: 5px;
    }
    .tag-tip{
      font-size: 14px;
      color: #9a9a9a;
    }
  }
  .add-tag{
    width: 100%;
    margin-top: 20px;
  }
  .tag-list{
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid #e8edf0;
    border-radius: 5px;
    margin: 10px 0 20px 0;
    .tag-tip{
      font-size: 14px;
      color: #9a9a9a;
    }
    .selected-btn{
      background-color: #409EFF;
      border-color: #409EFF;
      color: #fff;
    }
  }
}
</style>
