<template>
    <div class="show-value-set">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card v-loading="pageLoading">
            <el-form label-width="150px">
                <el-form-item label="秀值分配模板名称：">
                    <el-input class="inp" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="选择分润参数：">
                    <el-select class="inp" v-model="form.source">
                        <el-option v-for="(v, k) in profitParm" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="option">
                <img class="img-title" src="@/assets/images/icon_project01@2x.png" alt="">
                <span class="project-title">秀值占比</span>
                <div class="my-inp">
                    设置：X= <el-input-number :controls="false" :min="0" :max="100" @input="computedShowBean" v-model="form.valueRate" placeholder="请输入数值"></el-input-number> %
                </div>
            </div>
            <div class="option">
                <img class="img-title" src="@/assets/images/icon_project03@2x.png" alt="">
                <span class="project-title">秀豆占比</span>
                <div class="my-inp">
                    设置：Y= <el-input disabled style='width:200px' v-model="form.showPeas" placeholder="请输入数值"></el-input> %
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
                <el-date-picker :disabled="!isSetTime" v-model="form.startTime" type="datetime" placeholder="请选择开启时间"></el-date-picker>
                <span>设置结束时间</span>
                <el-date-picker :disabled="!isSetTime" v-model="form.endTime" type="datetime" placeholder="请选择结束时间"></el-date-picker>
            </div>
            <div>
                <el-button :loading="btnLoading" type="primary" @click="beforeSubmit">确 认</el-button>
                <el-button @click="$router.push('showValueList')">取 消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import tpl from './_showValue/profitTemplate.vue';
    import moment from 'moment';
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
                    source: '',
                    valueRate: '',
                    showPeas: '',
                    startTime: '',
                    endTime: ''
                },
                data: {}, // 表单数据
                profitParm: [{ label: '其他1', value: '1' }],
                active: '1',
                isSetTime: true,
                pageLoading: false,
                btnLoading: false
            };
        },
        activated() {
            this.id = this.$route.query.showValueTplId;
            this.getInfo();
        },
        deactivated() {
            this.id = '';
            this.active = '1'
            this.form = {
                name: '',
                source: '',
                valueRate: '',
                showPeas: '',
                startTime: '',
                endTime: ''
            }
            this.$refs['showValue'].userLevel = [
                { name: 'v0', level: '1', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v1', level: '2', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v2', level: '3', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v3', level: '4', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v4', level: '5', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v5', level: '6', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v6', level: '7', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] }
            ];
            this.$refs['showValue'].valueX = false;
            this.$refs['showValue'].valueY = false;
            this.$refs['showValue'].valueZ = false;
            this.$refs['showBean'].userLevel = [
                { name: 'v0', level: '1', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v1', level: '2', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v2', level: '3', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v3', level: '4', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v4', level: '5', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v5', level: '6', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] },
                { name: 'v6', level: '7', valueX: [0, 0, 0], valueY: [0, 0, 0], valueZ: [0, 0, 0] }
            ];
            this.$refs['showBean'].valueX = false;
            this.$refs['showBean'].valueY = false;
            this.$refs['showBean'].valueZ = false;
        },
        methods: {
            // 提交之前判断
            beforeSubmit() {
                // 秀值XYZ值
                const showVal = {
                    X: [],
                    Y: [],
                    Z: []
                };
                // 秀豆XYZ值
                const showBean = {
                    X: [],
                    Y: [],
                    Z: []
                };
                const nameArr = ['X', 'Y', 'Z'];
                // 秀值递减判断
                nameArr.forEach(name => {
                    for (let i = 0; i < 3; i++) {
                        this.$refs['showValue'].userLevel.forEach(v => {
                            // if (this.$refs['showValue'][`value${name}`]) {
                            let num = v[`value${name}`][i];
                            num = num.toFixed(2);
                            showVal[name].push(Number(num));
                            // }
                        });
                    }
                });
                for (let i = 0; i < nameArr.length; i++) {
                    const v = nameArr[i];
                    if (this.$refs['showValue'][`value${v}`]) {
                        for (let i = 0; i < 6; i++) {
                            if (showVal[v][i] > showVal[v][i + 1]) {
                                console.log(showVal);
                                return this.$message.warning(`秀值${v}间接分润值设置错误!`);
                            }
                        }
                        for (let i = 7; i < 12; i++) {
                            if (showVal[v][i] > showVal[v][i + 1]) {
                                return this.$message.warning(`秀值${v}直接分润值设置错误!`);
                            }
                        }
                        for (let i = 14; i < 19; i++) {
                            if (showVal[v][i] > showVal[v][i + 1]) {
                                return this.$message.warning(`秀值${v}自己值设置错误!`);
                            }
                        }
                        // 秀值横向相加等于100判断
                        if (showVal[v][6] + showVal[v][13] + showVal[v][20] !== 100) {
                            return this.$message.warning(`秀值${v}最大秀值相加未等于100!`);
                        }
                    }
                }
                // 秀豆递减判断
                nameArr.forEach(name => {
                    for (let i = 0; i < 3; i++) {
                        this.$refs['showBean'].userLevel.forEach(v => {
                            // if (this.$refs['showBean'][`value${name}`]) {
                            let num = v[`value${name}`][i];
                            num = num.toFixed(2);
                            showBean[name].push(Number(num));
                            // }
                        });
                    }
                });
                for (let i = 0; i < nameArr.length; i++) {
                    const v = nameArr[i];
                    if (this.$refs['showBean'][`value${v}`]) {
                        for (let i = 0; i < 6; i++) {
                            if (showBean[v][i] > showBean[v][i + 1]) {
                                return this.$message.warning(`秀豆${v}间接分润值设置错误!`);
                            }
                        }
                        for (let i = 7; i < 12; i++) {
                            if (showBean[v][i] > showBean[v][i + 1]) {
                                return this.$message.warning(`秀豆${v}直接分润值设置错误!`);
                            }
                        }
                        for (let i = 14; i < 19; i++) {
                            if (showBean[v][i] > showBean[v][i + 1]) {
                                return this.$message.warning(`秀豆${v}自己值设置错误!`);
                            }
                        }
                        // 秀豆横向相加等于100判断
                        if (showBean[v][6] + showBean[v][13] + showBean[v][20] !== 100) {
                            return this.$message.warning(`秀豆${v}最大秀值相加未等于100!`);
                        }
                    }
                }
                if (this.isSetTime) {
                    this.form.startTime = this.form.startTime === '' ? '' : moment(this.form.startTime).format('YYYY-MM-DD HH:mm:ss');
                    this.form.endTime = this.form.endTime === '' ? '' : moment(this.form.endTime).format('YYYY-MM-DD HH:mm:ss');
                }
                this.data = {
                    ...this.form,
                    showValue: JSON.stringify({
                        'xz': {
                            'x': {
                                'zj': {
                                    'v0': showVal.X[7],
                                    'v1': showVal.X[8],
                                    'v2': showVal.X[9],
                                    'v3': showVal.X[10],
                                    'v4': showVal.X[11],
                                    'v5': showVal.X[12],
                                    'v6': showVal.X[13]
                                },
                                'jj': {
                                    'v0': showVal.X[0],
                                    'v1': showVal.X[1],
                                    'v2': showVal.X[2],
                                    'v3': showVal.X[3],
                                    'v4': showVal.X[4],
                                    'v5': showVal.X[5],
                                    'v6': showVal.X[6]
                                },
                                'my': {
                                    'v0': showVal.X[14],
                                    'v1': showVal.X[15],
                                    'v2': showVal.X[16],
                                    'v3': showVal.X[17],
                                    'v4': showVal.X[18],
                                    'v5': showVal.X[19],
                                    'v6': showVal.X[20]
                                }
                            },
                            'y': {
                                'zj': {
                                    'v0': showVal.Y[7],
                                    'v1': showVal.Y[8],
                                    'v2': showVal.Y[9],
                                    'v3': showVal.Y[10],
                                    'v4': showVal.Y[11],
                                    'v5': showVal.Y[12],
                                    'v6': showVal.Y[13]
                                },
                                'jj': {
                                    'v0': showVal.Y[0],
                                    'v1': showVal.Y[1],
                                    'v2': showVal.Y[2],
                                    'v3': showVal.Y[3],
                                    'v4': showVal.Y[4],
                                    'v5': showVal.Y[5],
                                    'v6': showVal.Y[6]
                                },
                                'my': {
                                    'v0': showVal.Y[14],
                                    'v1': showVal.Y[15],
                                    'v2': showVal.Y[16],
                                    'v3': showVal.Y[17],
                                    'v4': showVal.Y[18],
                                    'v5': showVal.Y[19],
                                    'v6': showVal.Y[20]
                                }
                            },
                            'z': {
                                'zj': {
                                    'v0': showVal.Z[7],
                                    'v1': showVal.Z[8],
                                    'v2': showVal.Z[9],
                                    'v3': showVal.Z[10],
                                    'v4': showVal.Z[11],
                                    'v5': showVal.Z[12],
                                    'v6': showVal.Z[13]
                                },
                                'jj': {
                                    'v0': showVal.Z[0],
                                    'v1': showVal.Z[1],
                                    'v2': showVal.Z[2],
                                    'v3': showVal.Z[3],
                                    'v4': showVal.Z[4],
                                    'v5': showVal.Z[5],
                                    'v6': showVal.Z[6]
                                },
                                'my': {
                                    'v0': showVal.Z[14],
                                    'v1': showVal.Z[15],
                                    'v2': showVal.Z[16],
                                    'v3': showVal.Z[17],
                                    'v4': showVal.Z[18],
                                    'v5': showVal.Z[19],
                                    'v6': showVal.Z[20]
                                }
                            }
                        }
                    }),
                    showPeas: JSON.stringify({
                        'xd': {
                            'x': {
                                'zj': {
                                    'v0': showBean.X[7],
                                    'v1': showBean.X[8],
                                    'v2': showBean.X[9],
                                    'v3': showBean.X[10],
                                    'v4': showBean.X[11],
                                    'v5': showBean.X[12],
                                    'v6': showBean.X[13]
                                },
                                'jj': {
                                    'v0': showBean.X[0],
                                    'v1': showBean.X[1],
                                    'v2': showBean.X[2],
                                    'v3': showBean.X[3],
                                    'v4': showBean.X[4],
                                    'v5': showBean.X[5],
                                    'v6': showBean.X[6]
                                },
                                'my': {
                                    'v0': showBean.X[14],
                                    'v1': showBean.X[15],
                                    'v2': showBean.X[16],
                                    'v3': showBean.X[17],
                                    'v4': showBean.X[18],
                                    'v5': showBean.X[19],
                                    'v6': showBean.X[20]
                                }
                            },
                            'y': {
                                'zj': {
                                    'v0': showBean.Y[7],
                                    'v1': showBean.Y[8],
                                    'v2': showBean.Y[9],
                                    'v3': showBean.Y[10],
                                    'v4': showBean.Y[11],
                                    'v5': showBean.Y[12],
                                    'v6': showBean.Y[13]
                                },
                                'jj': {
                                    'v0': showBean.Y[0],
                                    'v1': showBean.Y[1],
                                    'v2': showBean.Y[2],
                                    'v3': showBean.Y[3],
                                    'v4': showBean.Y[4],
                                    'v5': showBean.Y[5],
                                    'v6': showBean.Y[6]
                                },
                                'my': {
                                    'v0': showBean.Y[14],
                                    'v1': showBean.Y[15],
                                    'v2': showBean.Y[16],
                                    'v3': showBean.Y[17],
                                    'v4': showBean.Y[18],
                                    'v5': showBean.Y[19],
                                    'v6': showBean.Y[20]
                                }
                            },
                            'z': {
                                'zj': {
                                    'v0': showBean.Z[7],
                                    'v1': showBean.Z[8],
                                    'v2': showBean.Z[9],
                                    'v3': showBean.Z[10],
                                    'v4': showBean.Z[11],
                                    'v5': showBean.Z[12],
                                    'v6': showBean.Z[13]
                                },
                                'jj': {
                                    'v0': showBean.Z[0],
                                    'v1': showBean.Z[1],
                                    'v2': showBean.Z[2],
                                    'v3': showBean.Z[3],
                                    'v4': showBean.Z[4],
                                    'v5': showBean.Z[5],
                                    'v6': showBean.Z[6]
                                },
                                'my': {
                                    'v0': showBean.Z[14],
                                    'v1': showBean.Z[15],
                                    'v2': showBean.Z[16],
                                    'v3': showBean.Z[17],
                                    'v4': showBean.Z[18],
                                    'v5': showBean.Z[19],
                                    'v6': showBean.Z[20]
                                }
                            }
                        }
                    })
                };
                this.submitForm();
            },
            // 提交表单
            submitForm() {
                request[this.url](this.data).then(res => {
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
                    request.queryProfitTemplateById({ id: this.id }).then(res => {
                        this.pageLoading = false;
                        this.form.name = res.data.name;
                        this.form.source = res.data.name;
                        this.form.valueRate = Number(res.data.valueRate);
                        this.isSetTime = !!res.data.startTime;
                        this.form.startTime = res.data.startTime || '';
                        this.form.endTime = res.data.endTime || '';
                        res.data.showValueList.forEach((v, k) => {
                            this.$refs['showValue'].userLevel.forEach((v1, k1) => {
                                if (v.type == 'X') {
                                    if (v.shareType == 1) {
                                        v1.valueX[0] = v[`v${k1}`];
                                    } else if (v.shareType == 2) {
                                        v1.valueX[1] = v[`v${k1}`];
                                    } else {
                                        v1.valueX[2] = v[`v${k1}`];
                                    }
                                } else if (v.type == 'Y') {
                                    if (v.shareType == 1) {
                                        v1.valueY[0] = v[`v${k1}`];
                                    } else if (v.shareType == 2) {
                                        v1.valueY[1] = v[`v${k1}`];
                                    } else {
                                        v1.valueY[2] = v[`v${k1}`];
                                    }
                                } else {
                                    if (v.shareType == 1) {
                                        v1.valueZ[0] = v[`v${k1}`];
                                    } else if (v.shareType == 2) {
                                        v1.valueZ[1] = v[`v${k1}`];
                                    } else {
                                        v1.valueZ[2] = v[`v${k1}`];
                                    }
                                }
                                this.$set(this.$refs['showValue'].userLevel, k1, this.$refs['showValue'].userLevel[k1]);
                            });
                        });
                        res.data.showPeasList.forEach((v, k) => {
                            this.$refs['showBean'].userLevel.forEach((v1, k1) => {
                                if (v.type == 'X') {
                                    if (v.shareType == 1) {
                                        v1.valueX[0] = v[`v${k1}`];
                                    } else if (v.shareType == 2) {
                                        v1.valueX[1] = v[`v${k1}`];
                                    } else {
                                        v1.valueX[2] = v[`v${k1}`];
                                    }
                                } else if (v.type == 'Y') {
                                    if (v.shareType == 1) {
                                        v1.valueY[0] = v[`v${k1}`];
                                    } else if (v.shareType == 2) {
                                        v1.valueY[1] = v[`v${k1}`];
                                    } else {
                                        v1.valueY[2] = v[`v${k1}`];
                                    }
                                } else {
                                    if (v.shareType == 1) {
                                        v1.valueZ[0] = v[`v${k1}`];
                                    } else if (v.shareType == 2) {
                                        v1.valueZ[1] = v[`v${k1}`];
                                    } else {
                                        v1.valueZ[2] = v[`v${k1}`];
                                    }
                                }
                                this.$set(this.$refs['showBean'].userLevel, k1, this.$refs['showBean'].userLevel[k1]);
                            });
                        });
                    }).catch(err => {
                        this.pageLoading = false;
                        console.log(err);
                    });
                }
            },
            // 计算秀豆占比
            computedShowBean(val) {
                this.form.showPeas = 100 - val;
            },
            // 切换秀值秀豆
            toggleShowModle(val) {
                this.active = val;
            },
            // 是否启用时间
            changeTimeStatus(status) {
                if (!status) {
                    this.form.startTime = '';
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
