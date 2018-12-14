<template>
    <div class="show-value-set">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card v-loading="pageLoading">
            <el-form label-width="180px">
                <el-form-item label="综合活跃度分配模板名称：">
                    <el-input placeholder="请输入模板名称" class="inp" v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <div class="option">
                <div>综合活跃度占比</div>
                <div>
                    设置：综合活跃度 <el-input-number :controls="false" :min="0" :max="100" @input="computedShowBean" @blur="toFixed" v-model="form.showValueRate" placeholder="请输入数值"></el-input-number> %
                </div>
            </div>
            <div class="option">
                <div>秀豆占比</div>
                <div>
                    设置：秀豆 <el-input disabled style='width:200px' v-model="form.showPeas" placeholder="请输入数值"></el-input> %
                    <span class="grey-text ml10">则自动计算出Y=0%</span>
                </div>
            </div>
            <el-button-group class="btn-group">
                <el-button @click="toggleShowModle(1)" :class="{'btn-active': active == 1, 'btn-def': active == 2}">综合活跃度设置</el-button>
                <el-button @click="toggleShowModle(2)" :class="{'btn-active': active == 2, 'btn-def': active == 1}">秀豆设置</el-button>
            </el-button-group>
            <tpl v-show="active == 1" ref="showValue"></tpl>
            <tpl v-show="active == 2" ref="showBean"></tpl>
            <p class="grey-text mt10" style="padding-left: 50px">最高等级项相加需小于等于100%，参数可为空/填写0</p>
            <div class="time">
                <el-checkbox v-model="isSetTime" @change="changeTimeStatus">
                    <span>设置开启时间</span>
                </el-checkbox>
                <el-date-picker :disabled="!isSetTime" v-model="form.activeTime" type="datetime" placeholder="请选择开启时间"></el-date-picker>
                <span>设置结束时间</span>
                <el-date-picker :disabled="!isSetTime" v-model="form.stopTime" type="datetime" placeholder="请选择结束时间"></el-date-picker>
                <p class="grey-text mt10" style="margin-left: 110px">设置时间只能是0点</p>
            </div>
            <div>
                <el-button :loading="btnLoading" type="primary" @click="submitForm">确 认 保 存</el-button>
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
                copy: '', // true: 复制模版
                form: {
                    name: '',
                    showValueRate: '',
                    showPeas: '',
                    activeTime: '',
                    stopTime: '',
                    defuaultTemplate: '0'
                },
                data: {}, // 表单数据
                profitParm: [{ label: '其他1', value: 1 }],
                active: '1',
                isSetTime: false,
                pageLoading: false,
                btnLoading: false
            };
        },
        mounted() {
            this.id = this.$route.query.showValueTplId;
            this.copy = this.$route.query.copy;
            this.getInfo();
        },
        destroyed() {
            this.id = null;
            this.copy = null;
            this.defuaultTemplate = '';
        },
        methods: {
            // 提交表单
            submitForm() {
                const showValue = this.$refs['showValue'].validForm();
                const showBean = this.$refs['showBean'].validForm();
                if (!showValue.status) return this.$message.warning(showValue.msg);
                if (!showBean.status) return this.$message.warning(showBean.msg);
                if (this.form.name === '') return this.$message.warning('请输入综合活跃度分配模板名称！');
                if (this.form.showValueRate === '') return this.$message.warning('请输入综合活跃度占比！');
                const data = {
                    id: this.form.id,
                    name: this.form.name,
                    defuaultTemplate: this.form.defuaultTemplate,
                    valueRate: this.form.showValueRate,
                    activeTime: this.form.activeTime ? this.$utils.formatTime(this.form.activeTime) : '',
                    stopTime: this.form.stopTime ? this.$utils.formatTime(this.form.stopTime) : '',
                    showValue: JSON.stringify({
                        xz: { ...showValue.msg },
                        flow: this.$refs['showValue'].flow
                    }),
                    showPeas: JSON.stringify({
                        xd: { ...showBean.msg },
                        flow: this.$refs['showBean'].flow
                    })
                };
                request[this.url](data).then(res => {
                    this.$message.success(res.msg);
                    this.$router.push('/showValueList');
                }).catch(err => {
                    console.log(err);
                });
            },
            // 获取信息
            getInfo() {
                if (this.id === undefined || this.id === '') {
                    this.nav[2] = '新建利润分配模板';
                    this.form.id = '';
                    this.url = 'addShowValBeanTemplate';
                } else {
                    this.nav[2] = '编辑利润分配模板';
                    this.url = 'updateProfitTemplateById';
                    this.form.id = this.id;
                    this.pageLoading = true;
                    // 如果是复制则清空id
                    if (this.copy) {
                        this.nav[2] = '复制利润分配模板';
                        this.form.id = null;
                        this.url = 'addShowValBeanTemplate';
                    }
                    request.queryProfitTemplateById({ id: this.id }).then(res => {
                        this.pageLoading = false;
                        const resData = res.data || {};
                        // 赋值其他信息
                        this.form.name = resData.name;
                        this.form.showValueRate = resData.valueRate || 0;
                        this.form.showPeas = 100 - (resData.valueRate || 0);
                        this.form.activeTime = resData.activeTime || '';
                        this.form.stopTime = resData.stopTime || '';
                        this.form.defuaultTemplate = resData.defuaultTemplate || '0';
                        this.isSetTime = !!resData.activeTime || !!resData.stopTime;
                        // 赋值综合活跃度和秀豆
                        const showValue = resData.showValueList || [];
                        const showBeans = resData.showPeasList || [];
                        const showValueParam = this.$refs['showValue'];
                        const showBeansParam = this.$refs['showBean'];
                        if (showValue.length !== 0) {
                            showValue.forEach(v => {
                                const obj = {
                                    v0: v.v0,
                                    v1: v.v1,
                                    v2: v.v2,
                                    v3: v.v3,
                                    v4: v.v4,
                                    v5: v.v5
                                };
                                if (v.shareType == 1) showValueParam.form.indirect = obj;
                                if (v.shareType == 2) showValueParam.form.direct = obj;
                                if (v.shareType == 3) showValueParam.form.oneself = obj;
                                showValueParam.flow = v.flow ? v.flow.toString() : '';
                            });
                        }
                        if (showBeans.length !== 0) {
                            showBeans.forEach(v => {
                                const obj = {
                                    v0: v.v0,
                                    v1: v.v1,
                                    v2: v.v2,
                                    v3: v.v3,
                                    v4: v.v4,
                                    v5: v.v5
                                };
                                if (v.shareType == 1) showBeansParam.form.indirect = obj;
                                if (v.shareType == 2) showBeansParam.form.direct = obj;
                                if (v.shareType == 3) showBeansParam.form.oneself = obj;
                                showBeansParam.flow = v.flow ? v.flow.toString() : '';
                            });
                        }
                    }).catch(err => {
                        this.pageLoading = false;
                        console.log(err);
                    });
                }
            },
            // 保留小数
            toFixed() {
                this.form.showValueRate = this.form.showValueRate ? this.form.showValueRate : 0;
                this.form.showValueRate = this.form.showValueRate.toFixed(2);
            },
            // 计算秀豆占比
            computedShowBean(val) {
                this.form.showPeas = (100 - val).toFixed(2);
            },
            // 切换秀值秀豆
            toggleShowModle(val) {
                this.active = val;
            },
            // 禁用/启用时间
            changeTimeStatus(val) {
                if (!val) {
                    this.form.activeTime = '';
                    this.form.stopTime = '';
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.show-value-set{
    .option{
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 585px;
        height: 105px;
        background-color: #f7f7f7;
        margin-bottom: 10px;
        font-size: 14px;
        padding: 0 20px;
        box-sizing: border-box;
        & div{
            line-height: 42px;
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
