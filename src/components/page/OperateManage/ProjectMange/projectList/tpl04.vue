<template>
    <div class="tpl-004">
      <div class="banner">
        <el-form :model="bannerForm" label-width="130px">
          <el-form-item prop="img" label="添加banner" >
              <el-input class="my-inp" v-model="bannerForm.imgUrl" disabled placeholder="请上传图片"></el-input>
              <!--<el-upload class="icon-uploader"-->
                          <!--:action="uploadImg"-->
                          <!--:show-file-list="false"-->
                          <!--:on-success="handleAvatarSuccess"-->
                          <!--:before-upload="beforeAvatarUpload">-->
                  <!--<el-button style="width:100px;height:32px" size="small" type="primary">上传</el-button>-->
              <!--</el-upload>-->
              <upload @img="imgBanner"></upload>
              <span style="color:#fe8080"><br/>建议图片750px*350px</span>
          </el-form-item>
          <el-form-item label=" " >
              <div class="upload-img-show">
                  <i v-if='!bannerForm.imgUrl' class="el-icon-picture-outline"></i>
                  <img v-else-if="bannerForm.imgUrl" :src="bannerForm.imgUrl" alt="">
              </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="tip">
        <el-form :model="bannerForm">
          <el-form-item prop="tip" label="专题说明" label-width="130px">
            <div class="text-area">
              <span class="total-num">{{totalNum}}/200</span>
              <el-input :autosize='{ minRows: 8, maxRows: 8 }' maxlength="200" v-model="bannerForm.remark" @input="getFontNum" type="textarea" placeholder="可为空，不填则不显示" style='width:350px'></el-input>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="add-product-list">
        <el-form label-width="130px">
          <el-form-item v-for="(v,k) in topicNavbarList.topicBannerProducts" :key="k" label="添加产品">
            <div class="del-row">
              <span v-if='k>0' @click="delPro(k)" class="del-btn" style="right:225px">x</span>
              <el-input class="my-inp" v-model="v.prodCode" placeholder="请输入产品ID"></el-input>
              <el-select v-model="v.productType" class="prod-type">
                <el-option v-for="(pv,pk) in prodTypeList" :label="pv.label" :value="pv.value" :key="pk"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label=" " label-width="130px">
            <el-button @click="addProduct" type="primary">添加产品</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-for="(v,k) in topicNavbarList.topicNavbarBannerList" :key="k" class="add-banner">
        <el-form label-width="130px">
          <el-form-item label="添加banner">
              <div class="del-area">
                  <span @click="delBanner(k)" class="del-btn">x</span>
            <el-input class="my-inp" v-model="v.bannerImg" disabled placeholder="请上传图片"></el-input>
            <!--<el-upload class="icon-uploader"-->
                    <!--:action="uploadImg"-->
                    <!--:show-file-list="false"-->
                    <!--:on-success="res=>uploadBanner(res,k)"-->
                    <!--:before-upload="beforeAvatarUpload">-->
                <!--<el-button style="width:100px;height:32px" size="small" type="primary">上传</el-button>-->
            <!--</el-upload>-->
                  <upload @img="imgUrl=>img(imgUrl,k)"></upload>
            <span style="color:#fe8080"><br/>建议图片750px*350px</span>
              </div>
          </el-form-item>
          <el-form-item label=" " >
            <div class="upload-img-show">
                <i v-if='!v.bannerImg' class="el-icon-picture-outline"></i>
                <img v-else-if="v.bannerImg" :src="v.bannerImg" alt="">
            </div>
          </el-form-item>
          <el-form-item v-for="(v1,k1) in v.topicBannerProductList" :key="k1" label="添加产品" label-width="130px">
            <div class="del-row">
              <span @click="delProduct(k,k1)" class="del-btn">x</span>
              <el-input v-model="v1.prodCode" class="inp" placeholder="请输入产品ID"></el-input>
              <el-select v-model="v1.productType" class="prod-type">
                <el-option v-for="(pv,pk) in prodTypeList" :label="pv.label" :value="pv.value" :key="pk"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label=" " label-width="130px">
            <el-button @click="addBannerProduct(k)" type="primary">添加产品</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="add-nav">
        <div class="add-nav-btn" @click="addBanner">
          <span style="font-weight:900">+</span>
          <span>添加区间banner</span>
        </div>
      </div>
      <div class="submit-btn">
        <el-button @click="submitForm" type="primary">确认保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
</template>

<script>
import * as api from '@/api/api.js';
import request from '@/http/http.js';
// import { beforeAvatarUpload } from '@/JS/commom';
import upload from '@/components/common/upload';

export default {
    components: { upload },
    // mixins: [beforeAvatarUpload],
    props: ['name', 'tplData'],

    watch: {
        name(newVal, oldVal) {
            this.pName = newVal;
        }
    },

    data() {
        return {
            // 专题id
            id: '',
            // 专题名称
            pName: '',
            // 上传图片
            uploadImg: '',
            // banner
            bannerForm: {
                imgUrl: '',
                remark: '',
                width: '',
                height: ''
            },
            // 产品类型
            prodTypeList: [
                { label: '产品', value: 99 },
                { label: '礼包', value: 3 },
                // { label: '套餐', value: 3 },
                // { label: '其他', value: 4 },
                { label: '专题', value: 5 }
            ],
            totalNum: 0, // 字数统计
            topicNavbarList: {
                navName: '',
                type: '', // 导航属性 1文字 2时间
                topicBannerProducts: [{ prodCode: '', productType: 99 }],
                topicNavbarBannerList: [{ bannerImg: '', width: '', height: '',  topicBannerProductList: [] }]
            }
        };
    },

    created() {
        this.uploadImg = api.uploadImg;
        this.pName = this.name;
        this.id = '';
        this.topicNavbarList = {
            navName: '',
            type: '',
            topicBannerProducts: [{ prodCode: '', productType: 99 }],
            topicNavbarBannerList: [{ bannerImg: '', width: '', height: '',  topicBannerProductList: [] }]
        };
        if (this.tplData != 'add') {
            this.bannerForm.imgUrl = this.tplData.imgUrl;
            this.bannerForm.remark = this.tplData.remark;
            this.bannerForm.width = this.tplData.width;
            this.bannerForm.height = this.tplData.height;
            this.topicNavbarList = this.tplData.topicNavbarList[0];
            this.id = this.tplData.id;
        }
    },

    methods: {
    // 删除产品
        delPro(index) {
            this.topicNavbarList.topicBannerProducts.splice(index, 1);
        },
        // 删除banner产品
        delProduct(bIndex, sIndex) {
            this.topicNavbarList.topicNavbarBannerList[bIndex].topicBannerProductList.splice(sIndex, 1);
        },
        // 提交表单
        submitForm() {
            // 判空
            if (this.pName == '') {
                this.$message.warning('请输入专题名称');
                return;
            } else {
                const reg = /^[A-Za-z_\u4e00-\u9fa5]{2,50}$/;
                if (!reg.test(this.pName)) {
                    this.$message.warning('请输入2-50位由汉字字母下划线组成的专题名称');
                    return;
                }
            }
            if (this.bannerForm.imgUrl == '') {
                this.$message.warning('请上传banner图');
                return;
            }
            try {
                if (this.topicNavbarList.topicBannerProducts && this.topicNavbarList.topicBannerProducts.length) {
                    this.topicNavbarList.topicBannerProducts.forEach((v, k) => {
                        if (v.prodCode == '') {
                            throw '请输入产品ID';
                        }
                    });
                }
                if (this.topicNavbarList.topicNavbarBannerList && this.topicNavbarList.topicNavbarBannerList.length) {
                    this.topicNavbarList.topicNavbarBannerList.forEach((v, k) => {
                        if (v.bannerImg == '') {
                            throw '请上传banner图';
                        }
                        if (v.topicBannerProductList && v.topicBannerProductList.length) {
                            v.topicBannerProductList.forEach((v1, k1) => {
                                if (v1.prodCode == '') {
                                    throw '请输入产品ID';
                                }
                            });
                        }
                    });
                }
            } catch (error) {
                this.$message.warning(error);
                return;
            }
            const data = {};
            if (this.id != '') {
                data.id = this.id.toString();
            }
            data.templateId = 4;
            data.name = this.pName;
            data.imgUrl = this.bannerForm.imgUrl;
            data.remark = this.bannerForm.remark;
            data.width = this.bannerForm.width;
            data.height = this.bannerForm.height;
            const temp = [];
            temp.push(this.topicNavbarList);
            data.topicNavbarList = temp;
            request.addOrModifyTopic(data).then(res => {
                this.$message.success(res.msg);
                this.$router.push('topicManage');
            }).catch(err => {
                console.log(err);
            });
        },
        // 添加banner
        addBanner() {
            this.topicNavbarList.topicNavbarBannerList == undefined || null ? this.topicNavbarList.topicNavbarBannerList = [{ bannerImg: '', width: '', height: '',  topicBannerProductList: [] }] : this.topicNavbarList.topicNavbarBannerList.push({ bannerImg: '', topicBannerProductList: [] });
        },
        // 删除区间banner
        delBanner(index) {
            this.topicNavbarList.topicNavbarBannerList.splice(index, 1);
        },
        // 添加banner图产品
        addBannerProduct(index) {
            if (this.topicNavbarList.topicNavbarBannerList[index].topicBannerProductList == undefined || null) {
                this.topicNavbarList.topicNavbarBannerList[index].topicBannerProductList = [];
            }
            this.topicNavbarList.topicNavbarBannerList[index].topicBannerProductList.push({ prodCode: '', productType: 99 });
        },
        // 上传banner图
        uploadBanner(res, index) {
            this.topicNavbarList.topicNavbarBannerList[index].bannerImg = res.data;
        },
        // 添加产品
        addProduct() {
            this.topicNavbarList.topicBannerProducts.push({ prodCode: '', productType: 99 });
        },
        // 获取输入字数
        getFontNum() {
            this.totalNum = this.bannerForm.remark.length;
        },
        // 上传头部banner成功回调
        handleAvatarSuccess(res) {
            this.bannerForm.imgUrl = res.data;
        },
        // 取消
        cancel() {
            this.$router.push('/topicManage');
        },
        imgBanner(imgUrl) {
            this.bannerForm.imgUrl = imgUrl[0];
            this.bannerForm.width = imgUrl[1];
            this.bannerForm.height = imgUrl[2];
        },
        img(imgUrl, sIndex) {
            this.topicNavbarList.topicNavbarBannerList[sIndex].bannerImg = imgUrl[0];
            this.topicNavbarList.topicNavbarBannerList[sIndex].width = imgUrl[1];
            this.topicNavbarList.topicNavbarBannerList[sIndex].height = imgUrl[2];
            this.$set(this.topicNavbarList.topicNavbarBannerList, sIndex, this.topicNavbarList.topicNavbarBannerList[sIndex]);
        }
    }
};

</script>
<style lang='less' scoped>
.tpl-004{
  .my-inp{width: 215px;}
  .banner{width: 585px;height: 280px;background-color: #f7f7f7;padding: 20px 0;box-sizing: border-box;}
  .icon-uploader{float: right;margin-right: 103px;width: 100px;}
  /deep/.el-upload--text {width: 100px;height: 35px;border: none;}
  .upload-img-show{width: 350px;height: 160px;border: 1px solid #dfdfdf;border-radius: 5px;background-color: #fff;text-align: center;line-height: 160px;font-size: 54px;color: #eee;overflow: hidden;
      img{width: 100%;height: 100%;}
  }
  .tip{height: 170px;width: 585px;background-color: #f7f7f7;margin: 10px 0;padding: 20px 0;
      .text-area{position: relative;width: 350px;
          .total-num{position:absolute;bottom: 0px;right: 10px;color: #dfdfdf;}
      }
  }
  .inp{width: 300px}
  .prod-type{width: 100px;margin-left: 10px}
  .add-product-list{width: 585px;background-color: #f7f7f7;padding: 20px 0}
  .add-banner{width: 585px;background-color: #f7f7f7;padding: 20px 0;margin: 20px 0}
  .add-nav{width: 585px;height: 105px; background-color: #f7f7f7;overflow: hidden;
    .add-nav-btn{cursor: pointer; height: 65px;width: 90%;border: 1px solid #ddd;margin: 20px auto 0;line-height: 65px;background-color: #fff;text-align: center;
      span{color: #33b4ff;font-size: 14px;}
    }
  }
  .submit-btn{margin-top: 20px}
  .del-row{position: relative;
    .del-btn{position: absolute;top:-10px;right: 145px;width: 25px;height: 25px;border-radius: 50%;background-color: #c6c6c6;text-align: center;line-height: 25px;color: #fff;z-index: 99;cursor: pointer;}
  }
    .del-area{position: relative;
        .del-btn{position: absolute;top:0;right: 20px;width: 25px;height: 25px;border-radius: 50%;background-color: #c6c6c6;text-align: center;line-height: 25px;color: #fff;z-index: 99;cursor: pointer;}
    }
}
</style>
