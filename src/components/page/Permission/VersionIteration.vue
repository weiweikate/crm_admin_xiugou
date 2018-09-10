<template>
    <div class="versionpage">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px 60px' }">
            <el-tabs v-model="activeName" @tab-click="changeTab">
                <el-tab-pane label="IOS" name="IOS">
                    <v-version-temp :name="activeName" @showDeleteToast="showDeleteToast" ref="IOS" @addVersion="addVersion"></v-version-temp>
                </el-tab-pane>
                <el-tab-pane label="Android" name="Android">
                    <v-version-temp :name="activeName" @showDeleteToast="showDeleteToast" ref="Android" @addVersion="addVersion"></v-version-temp>
                </el-tab-pane>
            </el-tabs>
            <el-dialog :title="title" :visible.sync="isShowAddQues" width="30%" @close='resetForm'>
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="版本号">
                        <el-input v-model="form.versionNum"></el-input>
                    </el-form-item>
                    <el-form-item v-if='activeName !="IOS"' label="上传APK">
                        <el-input v-model="form.dowloadUrl"></el-input>
                        <el-upload 
                            :action="upUrl"
                            :show-file-list="false"
                            :before-upload="beforeUpload"
                            :on-success="uploadSuccess">
                          <el-button :loading="uploadLoading" type="primary">上传apk</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="是否强制更新">
                        <el-radio-group v-model="form.coerce">
                            <el-radio :label="1" value=1>是</el-radio>
                            <el-radio :label="2" value=2>否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注说明">
                        <el-input :maxlength="180" type="textarea" v-model="form.remark"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <div class="btnDiv">
                          <el-button type="primary" :loading="btnLoading" @click="onSubmit">确认保存</el-button>
                          <el-button @click="resetForm('form')">重置</el-button>
                      </div>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from "@/components/common/Breadcrumb.vue";
    import vVersionTemp from "./versionTemp/versionTemp";
    import deleteToast from "@/components/common/DeleteToast";
    import * as cApi from '@/api/api';
    import * as pApi from "@/privilegeList/OperateManage/HelpCenter/index.js";
    import utils from '@/utils/index.js';
    export default {
        components: { vBreadcrumb,deleteToast,vVersionTemp },

        data() {
            return {
                nav: ["权限设置", "版本迭代管理"],
                activeName:'IOS',
                isShowAddQues:false,
                uploadLoading:false,
                questionType:'',
                addQuesTypeBtn:false,
                isShowDelToast:false,
                uploadUrl:'',
                delId:'',
                delUrl:'',
                delUri:'',
                form:{

                },
                title:"新增版本",
                type:'', // 2：安卓 3：IOS
                url:'',
                btnLoading:false,
            };
        },
        computed:{
            upUrl(){
                return cApi.addFile;
            }
        },
        activated(){
            this.$refs[this.activeName].getList(this.$refs[this.activeName].page.currentPage,this.$refs[this.activeName].status = this.activeName == 'IOS'?3:2);
        },
        methods: {
            beforeUpload(file){
                // 上传之前
                this.uploadLoading = true;
            },
            uploadSuccess(res){
                // 上传文件
                this.form.dowloadUrl = res.data;
                this.uploadLoading = false;
            },
            showDeleteToast(row){
              // 显示删除弹框
              this.delId = row.id;
              this.delUrl = cApi.deleteVersionRecord;
              this.isShowDelToast = !this.isShowDelToast
            },
            deleteToast(msg) {
               this.isShowDelToast = msg;
                // 更新相应的模板
                this.$refs[this.activeName].getList(this.$refs[this.activeName].page.currentPage,this.$refs[this.activeName].status = this.activeName == 'IOS'?3:2);
            },
            addVersion(row){
              // 回显信息
               if(row){
                   this.title = '编辑版本信息'
                   this.$axios.post(cApi.findVersionRecordById,{id:row.id}).then(res=>{
                       this.form = {
                            id:row.id,
                            versionNum:res.data.data.version,
                            coerce:res.data.data.coerce,
                            remark:res.data.data.description,
                            dowloadUrl:res.data.data.url || '',
                        }
                        this.form.type = this.activeName == 'IOS'?3:2;
                        this.url = cApi.updateVersionRecord;
                        this.isShowAddQues = !this.isShowAddQues
                   })
               }else{
                   this.form.type = this.activeName == 'IOS'?3:2;
                   this.url = cApi.addVersionRecord;
                   this.isShowAddQues = !this.isShowAddQues
               }
            },
            onSubmit(){ 
                // 提交表单
                if(this.form.versionNum == ''||this.form.coerce == ''||this.form.remark == ''||this.form.dowloadUrl == ''){
                    this.$message.warning('请填写完整信息');
                    return;
                }
                this.btnLoading = true;
                this.$axios.post(this.url,this.form).then(res=>{
                    this.$message.success(res.data.msg);
                    this.$refs[this.activeName].getList(this.$refs[this.activeName].page.currentPage,this.$refs[this.activeName].status = this.activeName == 'IOS'?3:2);
                    this.isShowAddQues = false;
                    this.btnLoading = false;
                }).catch(err=>{
                    this.btnLoading = false;
                })
            },
            resetForm(){
                this.form ={}
            },
            changeTab(val){
                // 切换tab选项卡
                if(val.name == 'IOS'){
                    this.$refs[this.activeName].getList(this.$refs[this.activeName].page.currentPage,this.$refs[this.activeName].status = 3);
                }else{
                    this.$refs[this.activeName].getList(this.$refs[this.activeName].page.currentPage,this.$refs[this.activeName].status = 2);
                }
            },
        }
    };
</script>
<style lang='less' scoped>
    .versionpage {
        /deep/.el-dialog .el-upload--text {
            position: absolute;
            top:0;
            left: 200px;
            width: 100px;
            height: 35px;
            border: none;
        }
        /deep/.el-tabs__active-bar {
            background-color: #ff1e30;
        }
        /deep/.el-textarea__inner{
            height: 150px;
        }
        /deep/.el-tabs__item.is-active,
        /deep/.el-tabs__item:hover {
            color: #ff1e30;
        }
        .btnDiv{
            text-align: right;
            width: 350px;
        }
        .input-sty{
            width: 210px;
        }
        .block {
            float: right;
            margin: 10px 0 10px 0;
        }
        /deep/.el-dialog{
            border-radius:10px;
            .el-dialog__header{
                border-bottom: 1px solid #dfdfdf;
                .el-dialog__title{
                    color: #ff4e4e;
                }
            }
            .el-input.el-input--small{
                width: 180px;
            }
            .el-textarea.el-input--small{
                width: 350px;
            }
        }
    }
</style>
