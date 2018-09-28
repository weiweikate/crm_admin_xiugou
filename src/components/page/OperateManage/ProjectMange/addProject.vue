<template>
    <div class="add-project">
        <v-breadcrumb :nav="['运营管理','专题管理',title]"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }" v-loading="pageLoading">
            <div class="option">
                <img class="img-title" src="@/assets/images/icon_project01@2x.png" alt="">
                <span class="project-title">专题名称</span>
                <el-input class="my-inp" v-model="name" placeholder="请输入专题名称"></el-input>
            </div>
            <div class="option">
                <img class="img-title" src="@/assets/images/icon_project03@2x.png" alt="">
                <span class="project-title">专题模板</span>
                <el-select class="my-inp" @change="toggleList" v-model="tpl" placeholder="请选择专题模板">
                    <el-option v-for="(v,k) in tplList" :key="k" :label="v.label" :value="v.value"></el-option>
                </el-select>
            </div>
            <component v-if='isShow' :is='comp' :name='name' :tplData='tplInfo'></component>
        </el-card>

    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import request from '@/http/http.js';
import tpl1 from './projectList/tpl01';
import tpl2 from './projectList/tpl02';
import tpl3 from './projectList/tpl03';
import tpl4 from './projectList/tpl04';
import tpl5 from './projectList/tpl05';
import tpl6 from './projectList/tpl06';
export default {
    components: { vBreadcrumb, tpl1, tpl2, tpl3, tpl4, tpl5, tpl6 },

    data() {
        return {
            pageLoading: false,
            isShow: false, // 组件显示隐藏
            title: '',
            tplId: '', // 专题模板id
            comp: 'tpl1',
            name: '', // 专题名称
            tpl: '1', // 专题模板
            // 专题模板列表
            tplList: [
                { label: '模版1', value: '1' },
                { label: '模版2', value: '2' },
                { label: '模版3', value: '3' },
                { label: '模版4', value: '4' },
                { label: '秒杀模版', value: '5' },
                { label: '降价拍模版', value: '6' }
            ],
            tplInfo: {} // 专题信息
        };
    },

    activated() {
        this.name = '';
        this.tplId = this.$route.query.topicId || sessionStorage.getItem('topicId');
        if (this.tplId == 'add') {
            this.title = '添加专题';
            this.tplInfo = 'add';
            this.isShow = true;
        } else {
            this.title = '编辑专题';
            this.getTplInfo();
        }
    },

    deactivated() {
        this.tplInfo = {};
        this.isShow = false;
    },

    methods: {
        // 切换模板列表
        toggleList(val, status) {
            this.comp = `tpl${val}`;
        },
        // 获取模板数据
        getTplInfo() {
            this.pageLoading = true;
            const data = {
                id: this.tplId
            };
            request.findTopicById(data).then(res => {
                this.tplInfo = res.data;
                this.tpl = res.data.templateId.toString();
                this.tplId = res.data.id;
                this.name = res.data.name;
                this.toggleList(this.tpl);
                this.isShow = true;
                this.pageLoading = false;
            }).catch(err => {
                this.pageLoading = false;
            });
        }
    }
};

</script>
<style lang='less' scoped>
.add-project{
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
}
</style>
