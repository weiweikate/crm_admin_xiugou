<template>
    <div class="show-value-set">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card v-loading="pageLoading">
            <el-form label-width="150px">
                <el-form-item label="秀值分配模板名称：">
                    <el-input class="inp" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="选择分润参数：">
                    <el-select class="inp" v-model="form.param">
                        <el-option v-for="(v, k) in profitParm" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="option">
                <img class="img-title" src="@/assets/images/icon_project01@2x.png" alt="">
                <span class="project-title">秀值占比</span>
                <div class="my-inp">
                    设置：X= <el-input-number :controls="false" :min="0" :max="100" @input="computedShowBean" v-model="form.showValue" placeholder="请输入数值"></el-input-number> %
                </div>
            </div>
            <div class="option">
                <img class="img-title" src="@/assets/images/icon_project03@2x.png" alt="">
                <span class="project-title">秀豆占比</span>
                <div class="my-inp">
                    设置：Y= <el-input disabled style='width:200px' v-model="form.showBean" placeholder="请输入数值"></el-input> %
                </div>
            </div>
            <el-button-group class="btn-group">
                <el-button @click="toggleShowModle(1)" :class="{'btn-active': active == 1, 'btn-def': active == 2}">秀值设置</el-button>
                <el-button @click="toggleShowModle(2)" :class="{'btn-active': active == 2, 'btn-def': active == 1}">秀豆设置</el-button>
            </el-button-group>
            <tpl v-show="active == 1" name="秀值" ref="showValue"></tpl>
            <tpl v-show="active == 2" name="秀豆" ref="showBean"></tpl>
            <div class="time">
                <el-checkbox v-model="isSetTime" @change="changeTimeStatus"></el-checkbox>
                <span>设置开启时间</span>
                <el-date-picker :disabled="!isSetTime" v-model="form.beginTime" type="datetime" placeholder="请选择开启时间"></el-date-picker>
                <span>设置结束时间</span>
                <el-date-picker :disabled="!isSetTime" v-model="form.endTime" type="datetime" placeholder="请选择结束时间"></el-date-picker>
            </div>
            <div>
                <el-button :loading="btnLoading" type="primary" @click="submitForm">确 认</el-button>
                <el-button @click="$router.push('showValueList')">取 消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import tpl from './_showValue/profitTemplate.vue';
    import request from '@/http/http';
    export default {
        components: { vBreadcrumb, tpl },
        data() {
            return {
                nav: ['秀值模块', '秀值分配设置', '新建利润分配模板'],
                id: '',
                url: '',
                form: {
                    name: '',
                    param: '',
                    showValue: '',
                    showBean: '',
                    beginTime: '',
                    endTime: ''
                },
                profitParm:[{label: '其他1', value:'1'}],
                active: '1',
                isSetTime: true,
                pageLoading: false,
                btnLoading: false
            };
        },
        activated(){
            this.id = this.$route.query.showValueTplId || sessionStorage.getItem('showValueTplId');
            this.getInfo();
        },
        methods: {
            // 提交表单
            submitForm(){

            },
            // 获取信息
            getInfo() {
                if (this.id === null) {
                    this.nav[2] = '新建利润分配模板';
                    this.id = '';
                    this.url = '';
                } else {
                    this.nav[2] = '编辑利润分配模板';
                    this.url = '';
                }
            },
            // 计算秀豆占比
            computedShowBean(val){
                this.form.showBean = 100 - val;
            },
            // 切换秀值秀豆
            toggleShowModle(val){
                this.active = val;
            },
            // 是否启用时间
            changeTimeStatus(status){
                if(!status){
                    this.form.beginTime = '';
                    this.form.endTime = '';
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.show-value-set{
    .option{
        position: relative;
        width: 585px;
        height: 105px;
        background-color: #f7f7f7;
        margin-bottom: 10px;
        .project-title{
            position: absolute;
            top: 20px;
            left: 110px;
        }
        .img-title{
            position: absolute;
            top: 20px;
            left: 20px;
            width: 66px;
            height: 66px;
        }
        .my-inp{
            position: absolute;
            top: 55px;
            left: 110px ;
            width: 350px;
        }
    }
    .btn-group{
        width: 340px;
        height: 50px;
        .btn-active{
            width: 50%;
            height: 50px;
            background-color: #33b4ff;
            color: white;
        }
        .btn-def{
            width: 50%;
            height: 50px;
            color: #33b4ff;
        }
    }
    .time{
        margin: 20px 0;
        & span{
            font-size: 14px;
        }
    }
    .inp{
        width: 210px;
    }
}
</style>
