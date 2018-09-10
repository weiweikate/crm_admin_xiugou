<template>
    <div class="tpl-001">
        <div class="banner">
            <el-form :model="bannerForm" label-width="130px">
                <el-form-item prop="img" label="添加banner" >
                    <el-input class="my-inp" v-model="bannerForm.img" disabled placeholder="请上传图片"></el-input>
                    <el-upload class="icon-uploader"
                               :action="uploadImg"
                               :show-file-list="false"
                               :on-success="handleAvatarSuccess">
                        <el-button style="width:100px;height:32px" size="small" type="primary">上传</el-button>
                    </el-upload>
                    <span style="color:#fe8080"><br/>建议图片750px*350px</span>
                </el-form-item>
                <el-form-item label=" " >
                    <div class="upload-img-show">
                        <i v-if='!bannerForm.img' class="el-icon-picture-outline"></i>
                        <img v-else-if="bannerForm.img" :src="bannerForm.img" alt="">
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="tip">
            <el-form :model="bannerForm">
                <el-form-item prop="tip" label="专题说明" label-width="130px">
                    <div class="text-area">
                        <span class="total-num">{{totalNum}}/200</span>
                        <el-input maxlength="200" v-model="bannerForm.tip" @input="getFontNum" type="textarea" :rows="8" placeholder="可为空，不填则不显示" style='width:350px'></el-input>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div v-for='(v,k) in nav' :key="k" class="nav">
            <el-form>
                <el-form-item :label="`导航${k+1}`" label-width="130px">
                    <el-input v-model="v.name" class="inp" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item v-for="(v1,k1) in v.product" :key="k1" label='添加产品' label-width="130px">
                    <div class="del-row">
                        <span v-if='k1>0' @click="delNavProduct(k,k1)" class="del-btn">x</span>
                        <el-input v-model="v1.prodCode" class="inp" placeholder="请输入产品ID"></el-input>
                        <el-select v-model="v1.type" class="prod-type">
                            <el-option v-for="(pv,pk) in prodTypeList" :label="pv.label" :value="pv.value" :key="pk"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label=" " label-width="130px">
                    <el-button @click="addProduct(k)" type="primary">添加产品</el-button>
                </el-form-item>
            </el-form>
            <div class="addBanner" v-for="(v2,k2) in v.banner" :key="k2">
                <el-form label-width="130px">
                    <el-form-item label="添加banner" >
                        <el-input class="my-inp" v-model="v2.img" disabled placeholder="请上传图片"></el-input>
                        <el-upload class="icon-uploader"
                                :action="uploadImg"
                                :show-file-list="false"
                                :on-success="res=>uploadBanner(res,k,k2)">
                            <el-button style="width:100px;height:32px" size="small" type="primary">上传</el-button>
                        </el-upload>
                        <span style="color:#fe8080"><br/>建议图片750px*350px</span>
                    </el-form-item>
                    <el-form-item label=" " >
                        <div class="upload-img-show">
                            <i v-if='!v2.img' class="el-icon-picture-outline"></i>
                            <img v-else-if="v2.img" :src="v2.img" alt="">
                        </div>
                    </el-form-item>
                    <el-form-item v-for="(v3,k3) in v2.product" :key="k3" label="添加产品" label-width="130px">
                        <div class="del-row">
                            <span v-if='k3>0' @click="delProduct(k,k2,k3)" class="del-btn">x</span>
                            <el-input v-model="v3.prodCode" class="inp" placeholder="请输入产品ID"></el-input>
                            <el-select v-model="v3.type" class="prod-type">
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
            <el-button >取消</el-button>
        </div>
    </div>
</template>

<script>
import * as cApi from '@/api/api.js';
import * as api from '@/api/OperateManage/topicManage.js';
export default {
  components: {},

  props:['name','tplData'],

  watch:{
      name(newVal,oldVal){
        this.pName = newVal;
      }
  },

  data () {
    return {
        // 专题id
        id:'',
        // 专题名称
        pName:'',
        // 上传图片
        uploadImg:'',
        // banner
        bannerForm:{
            img:'',
            tip:''
        },
        // 产品类型
        prodTypeList:[
            {label:'产品',value:1},
            {label:'礼包',value:2},
            {label:'套餐',value:3},
            {label:'其他',value:4},
            {label:'专题',value:5},
        ], // 1.产品 2.礼包 3.套餐 4.其他 5.专题
        totalNum:0, // 字数统计
        nav:[
            {
                name:'',
                product:[{prodCode:'',type:1}],
                banner:[{img:'',product:[{prodCode:'',type:1}]}]
            },
        ],
    };
  },

created(){
    this.uploadImg =  cApi.addImg;
    this.pName = this.name;
    this.id = '';
    this.nav = [
        {
            name:'',
            product:[{prodCode:'',type:1}],
            banner:[{img:'',product:[{prodCode:'',type:1}]}]
        },
    ];
    if(this.tplData != 'add'){
        this.bannerForm.img = this.tplData.bigBanner;
        this.bannerForm.tip = this.tplData.desc;
        this.nav = this.tplData.content;
        this.id = this.tplData.id;
    }
    if(this.tplData.content == 'edit'){
        this.nav = [
            {
                name:'',
                product:[{prodCode:'',type:1}],
                banner:[{img:'',product:[{prodCode:'',type:1}]}]
            },
        ];
    }
},

  methods: {
    // 确认保存
    submitForm(){
        // 判空
        if(this.pName == ''){
            this.$message.warning('请输入专题名称');
            return;
        }else if(this.bannerForm.img == ''){
            this.$message.warning('请上传banner图');
            return;
        }
        // 判空
        try {
            this.nav.forEach((v,k) => {
                if(v.name == ''){
                    throw '请输入导航名称';
                }
                v.product.forEach((v1,k1)=>{
                    if(v1.prodCode == ''){
                        throw '请输入产品id';
                    }
                })
                v.banner.forEach((v2,k2)=>{
                    if(v2.img == ''){
                        throw '请上传banner图';
                    }
                    v2.product.forEach((v3,k3)=>{
                        if(v3.prodCode == ''){
                            throw '请输入产品id';
                        }
                    })
                })
            });
        } catch (error) {
            this.$message.warning(error);
            return;
        }
        
        let data = {};
        if(this.id != ''){
           data.id = this.id.toString(); 
        }
        data.templateId = 1;
        data.name = this.pName;
        data.bigBanner = this.bannerForm.img;
        data.desc = this.bannerForm.tip;
        data.content = this.nav;
        this.$axios.post(api.topicSave,{topicStr:JSON.stringify(data)}).then(res=>{
            this.$message.success(res.data.msg);
            this.$router.push('topicManage');
        })
    },
    //   删除导航下产品
    delNavProduct(bIndex,sIndex){
        this.nav[bIndex].product.splice(sIndex,1);
    },
    // 删除banner下的产品
    delProduct(bIndex,mIndex,sIndex){
      this.nav[bIndex].banner[mIndex].product.splice(sIndex,1)
    },
    //   添加导航
    addNav(){
        this.nav.push(
            {
                name:'',
                product:[{prodCode:'',type:1},{prodCode:'',type:1}],
                banner:[]
            }
        );
    },
    //   添加区间banner
    addBanner(index){
        this.nav[index].banner == undefined?this.nav[index].banner = [{img:'',product:[]}]:this.nav[index].banner.push({img:'',product:[]})
        // this.nav[index].banner.push({img:'',product:[{prodCode:'',type:1}]});
        this.$set(this.nav,index,this.nav[index]);
    },
    //   添加banner的产品
    addBannerProduct(bIndex,sIndex){
        this.nav[bIndex].banner[sIndex].product.push({prodCode:'',type:1});
        this.$set(this.nav,bIndex,this.nav[bIndex]);
    },
    //  上传banner
    uploadBanner(res,bIndex,sIndex){
        this.nav[bIndex].banner[sIndex].img = res.data.imageUrl;
        this.$set(this.nav,bIndex,this.nav[bIndex]);
    },
    //   添加产品
    addProduct(index){
        this.nav[index].product == null?this.nav[index].product=[{prodCode:'',type:1}]:this.nav[index].product.push({prodCode:'',type:1});
        this.$set(this.nav,index,this.nav[index]);
    },
    //   获取输入字数
    getFontNum(){
        this.totalNum = this.bannerForm.tip.length;
    },
    //  上传头部banner成功回调
    handleAvatarSuccess(res){
        this.bannerForm.img = res.data.imageUrl;
    }
  }
}

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
    .submit-btn{margin-top: 20px}
}
</style>