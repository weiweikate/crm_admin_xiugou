<template>
    <div class="tpl-001">
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
                        <el-input maxlength="200" v-model="bannerForm.remark" @input="getFontNum" type="textarea" :rows="8" placeholder="可为空，不填则不显示" style='width:350px'></el-input>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div v-for='(v,k) in topicNavbarList' :key="k" class="nav">
            <el-form>
                <el-form-item :label="`导航${k+1}`" label-width="130px">
                    <div class="del-area">
                    <el-input v-model="v.navName" maxlength="6" class="inp" placeholder="请输入"></el-input>
                    <span v-if='k>0' @click="delNav(k)" class="del-btn">x</span>
                    </div>
                </el-form-item>
                <el-form-item v-for="(v1,k1) in v.topicBannerProducts" :key="k1" label='添加产品' label-width="130px">
                    <div class="del-row">
                        <span v-if='k1>0' @click="delNavProduct(k,k1)" class="del-btn">x</span>
                        <el-input v-model="v1.prodCode" class="inp" placeholder="请输入产品ID"></el-input>
                        <el-select v-model="v1.productType" class="prod-type">
                            <el-option v-for="(pv,pk) in prodTypeList" :label="pv.label" :value="pv.value" :key="pk"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label=" " label-width="130px">
                    <el-button @click="addProduct(k)" type="primary">添加产品</el-button>
                </el-form-item>
            </el-form>
            <div class="addBanner" v-for="(v2,k2) in v.topicNavbarBannerList" :key="k2">
                <el-form label-width="130px">
                    <el-form-item label="添加banner" >
                        <div class="del-area">
                            <span @click="delBanner(k,k2)" class="del-btn">x</span>
                        <el-input class="my-inp" v-model="v2.bannerImg" disabled placeholder="请上传图片"></el-input>
                        <!--<el-upload class="icon-uploader"-->
                                <!--:action="uploadImg"-->
                                <!--:show-file-list="false"-->
                                <!--:on-success="res=>uploadBanner(res,k,k2)"-->
                                <!--:before-upload="beforeAvatarUpload">-->
                            <!--<el-button style="width:100px;height:32px" size="small" type="primary">上传</el-button>-->
                        <!--</el-upload>-->
                            <upload @img="imgUrl=>img(imgUrl,k,k2)"></upload>
                        <span style="color:#fe8080"><br/>建议图片750px*350px</span>
                        </div>
                    </el-form-item>
                    <el-form-item label=" " >
                        <div class="upload-img-show">
                            <i v-if='!v2.bannerImg' class="el-icon-picture-outline"></i>
                            <img v-else-if="v2.bannerImg" :src="v2.bannerImg" alt="">
                        </div>
                    </el-form-item>
                    <el-form-item v-for="(v3,k3) in v2.topicBannerProductList" :key="k3" label="添加产品" label-width="130px">
                        <div class="del-row">
                            <span @click="delProduct(k,k2,k3)" class="del-btn">x</span>
                            <el-input v-model="v3.prodCode" class="inp" placeholder="请输入产品ID"></el-input>
                            <el-select v-model="v3.productType" class="prod-type">
                                <el-option v-for="(pv,pk) in prodTypeList" :label="pv.label" :value="pv.value" :key="pk"></el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item label=" " label-width="130px">
                        <el-button @click="addBannerProduct(k,k2)" type="primary">添加产品</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="add-banner-btn" @click="addBanner(k)">
                <span style="font-weight:900">+</span>
                <span>添加区间banner</span>
            </div>
        </div>
        <div class="add-nav">
            <div class="add-nav-btn" @click="addNav">
                <span style="font-weight:900">+</span>
                <span>添加导航</span>
            </div>
        </div>
        <div class="submit-btn">
            <el-button @click="submitForm" type="primary">确认保存</el-button>
            <el-button @click="cancel">取消</el-button>
        </div>
    </div>
</template>

<script>
    import request from '@/http/http.js';
    import * as api from '@/api/api.js';
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
                // 专题code
                code: '',
                // 专题名称
                pName: '',
                // 上传图片
                uploadImg: '',
                // banner
                bannerForm: {
                    imgUrl: '',
                    remark: ''
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
                topicNavbarList: [
                    {
                        navName: '',
                        type: 1, // 导航属性 1文字 2时间
                        topicBannerProducts: [{ prodCode: '', productType: 99 }],
                        topicNavbarBannerList: [{ bannerImg: '', topicBannerProductList: [] }]
                    }
                ]
            };
        },

        created() {
            this.uploadImg = api.uploadImg;
            this.pName = this.name;
            this.id = '';
            this.code = '';
            this.topicNavbarList = [
                {
                    navName: '',
                    type: 1,
                    topicBannerProducts: [{ prodCode: '', productType: 99 }],
                    topicNavbarBannerList: [{ bannerImg: '', topicBannerProductList: [] }]
                }
            ];
            if (this.tplData != 'add') {
                this.bannerForm.imgUrl = this.tplData.imgUrl;
                this.bannerForm.remark = this.tplData.remark;
                this.topicNavbarList = this.tplData.topicNavbarList;
                this.id = this.tplData.id;
                this.code = this.tplData.code;
            }
            if (this.tplData.content == 'edit') {
                this.topicNavbarList = [
                    {
                        navName: '',
                        type: 1,
                        topicBannerProducts: [{ prodCode: '', productType: 99 }],
                        topicNavbarBannerList: [{ bannerImg: '', topicBannerProductList: [] }]
                    }
                ];
            }
        },

        methods: {
            // 确认保存
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
                // 判空
                try {
                    if (!this.topicNavbarList.length) {
                        return;
                    }
                    this.topicNavbarList.forEach((v, k) => {
                        if (v.navName == '') {
                            throw '请输入导航名称';
                        }
                        if (v.topicBannerProducts) {
                            v.topicBannerProducts.forEach((v1, k1) => {
                                if (v1.prodCode == '') {
                                    throw '请输入产品id';
                                }
                            });
                        }
                        if (v.topicNavbarBannerList && v.topicNavbarBannerList.length) {
                            v.topicNavbarBannerList.forEach((v2, k2) => {
                                if (v2.bannerImg == '') {
                                    throw '请上传banner图';
                                }
                                if (v2.topicBannerProductList && v2.topicBannerProductList.length) {
                                    v2.topicBannerProductList.forEach((v3, k3) => {
                                        if (v3.prodCode == '') {
                                            throw '请输入产品id';
                                        }
                                    });
                                }
                            });
                        }
                    });
                } catch (error) {
                    this.$message.warning(error);
                    return;
                }

                const data = {};
                if (this.id != '') {
                    data.id = this.id.toString();
                    data.code = this.code;
                }
                data.templateId = 1;
                data.name = this.pName;
                data.imgUrl = this.bannerForm.imgUrl;
                data.remark = this.bannerForm.remark;
                data.width = this.bannerForm.width;
                data.height = this.bannerForm.height;
                data.topicNavbarList = this.topicNavbarList;
                request.addOrModifyTopic(data).then(res => {
                    this.$message.success(res.msg);
                    this.$router.push('topicManage');
                }).catch(err => {
                    console.log(err);
                });
            },
            //   删除导航下产品
            delNavProduct(bIndex, sIndex) {
                this.topicNavbarList[bIndex].topicBannerProducts.splice(sIndex, 1);
            },
            // 删除banner下的产品
            delProduct(bIndex, mIndex, sIndex) {
                this.topicNavbarList[bIndex].topicNavbarBannerList[mIndex].topicBannerProductList.splice(sIndex, 1);
            },
            //   添加导航
            addNav() {
                this.topicNavbarList.push(
                    {
                        navName: '',
                        type: 1,
                        topicBannerProducts: [{ prodCode: '', productType: 99 }],
                        topicNavbarBannerList: []
                    }
                );
            },
            // 删除导航
            delNav(index) {
                this.topicNavbarList.splice(index, 1);
            },
            //   添加区间banner
            addBanner(index) {
                this.topicNavbarList[index].topicNavbarBannerList == undefined || null ? this.topicNavbarList[index].topicNavbarBannerList = [{ bannerImg: '', topicBannerProductList: [] }] : this.topicNavbarList[index].topicNavbarBannerList.push({ bannerImg: '', topicBannerProductList: [] });
                // this.topicNavbarList[index].banner.push({img:'',product:[{prodCode:'',type:1}]});
                this.$set(this.topicNavbarList, index, this.topicNavbarList[index]);
            },
            // 删除区间banner
            delBanner(index, bIndex) {
                this.topicNavbarList[index].topicNavbarBannerList.splice(bIndex, 1);
            },
            //   添加banner的产品
            addBannerProduct(bIndex, sIndex) {
                if (this.topicNavbarList[bIndex].topicNavbarBannerList[sIndex].topicBannerProductList == undefined || null) {
                    this.topicNavbarList[bIndex].topicNavbarBannerList[sIndex].topicBannerProductList = [];
                }
                this.topicNavbarList[bIndex].topicNavbarBannerList[sIndex].topicBannerProductList.push({ prodCode: '', productType: 99 });
                this.$set(this.topicNavbarList, bIndex, this.topicNavbarList[bIndex]);
            },
            //  上传banner
            uploadBanner(res, bIndex, sIndex) {
                this.topicNavbarList[bIndex].topicNavbarBannerList[sIndex].bannerImg = res.data;
                this.$set(this.topicNavbarList, bIndex, this.topicNavbarList[bIndex]);
            },
            //   添加产品
            addProduct(index) {
                this.topicNavbarList[index].topicBannerProducts == null ? this.topicNavbarList[index].topicBannerProducts = [{ prodCode: '', productType: 99 }] : this.topicNavbarList[index].topicBannerProducts.push({ prodCode: '', productType: 99 });
                this.$set(this.topicNavbarList, index, this.topicNavbarList[index]);
            },
            //   获取输入字数
            getFontNum() {
                this.totalNum = this.bannerForm.remark.length;
            },
            //  上传头部banner成功回调
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
            img(imgUrl, bIndex, sIndex) {
                this.topicNavbarList[bIndex].topicNavbarBannerList[sIndex].bannerImg = imgUrl[0];
                this.topicNavbarList[bIndex].topicNavbarBannerList[sIndex].width = imgUrl[1];
                this.topicNavbarList[bIndex].topicNavbarBannerList[sIndex].height = imgUrl[2];
                this.$set(this.topicNavbarList, bIndex, this.topicNavbarList[bIndex]);
            }
        }
    };

</script>
<style lang='less'>
.tpl-001{
    .my-inp{width: 215px;}
    .banner{width: 585px;height: 280px;background-color: #f7f7f7;padding: 20px 0;box-sizing: border-box;}
    .icon-uploader{float: right;margin-right: 103px;width: 100px;}
    .el-upload--text {width: 100px;height: 35px;border: none;}
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
    .nav{width: 585px;background-color: #f7f7f7;margin: 10px 0;padding: 20px 0;overflow: hidden;
        .addBanner{width: 100%;border-top: 1px dashed #ddd;border-bottom: 1px dashed #ddd;padding: 20px 0;}
    }
    .add-banner-btn{cursor: pointer; height: 65px;width: 90%;border: 1px solid #ddd;margin: 20px auto 0;line-height: 65px;background-color: #fff;text-align: center;
        span{color: #33b4ff;font-size: 14px;}
    }
    .add-nav{width: 585px;height: 105px; background-color: #f7f7f7;overflow: hidden;
        .add-nav-btn{cursor: pointer; height: 65px;width: 90%;border: 1px solid #ddd;margin: 20px auto 0;line-height: 65px;background-color: #fff;text-align: center;
            span{color: #33b4ff;font-size: 14px;}
        }
    }
    .del-row{position: relative;
        .del-btn{position: absolute;top:-10px;right: 145px;width: 25px;height: 25px;border-radius: 50%;background-color: #c6c6c6;text-align: center;line-height: 25px;color: #fff;z-index: 99;cursor: pointer;}
    }
    .del-area{position: relative;
        .del-btn{position: absolute;top:0;right: 20px;width: 25px;height: 25px;border-radius: 50%;background-color: #c6c6c6;text-align: center;line-height: 25px;color: #fff;z-index: 99;cursor: pointer;}
    }
    .submit-btn{margin-top: 20px}
}
</style>
