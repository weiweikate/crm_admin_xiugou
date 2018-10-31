<template>
    <div class="repertory-set">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card>
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item prop="type" label="仓库类型">
                    <el-select v-model="form.type" placeholder="请选择仓库类型" class="inp">
                        <el-option value="1">自建仓</el-option>
                        <el-option value="2">加盟仓</el-option>
                        <el-option value="3">供应商仓</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="supplierId" label="供应商ID" v-if="form.type==3">
                    <el-input class="inp" v-model="form.supplierId" placeholder="请输入供应商ID"></el-input>
                </el-form-item>
                <el-form-item prop="supplierName" label="供应商名称" v-if="form.type==3">
                    <el-input class="inp" v-model="form.supplierName" placeholder="请输入供应商名称"></el-input>
                </el-form-item>
                <el-form-item prop="type" label="加盟仓类型" v-if="form.type==2">
                    <el-select v-model="form.type" placeholder="请选择加盟仓类型" class="inp">
                        <el-option value="1">百世汇通</el-option>
                        <el-option value="2">顺丰</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="code" label="仓库编码">
                    <el-input class="inp" v-model="form.code" placeholder="请输入仓库编码"></el-input>
                </el-form-item>
                <el-form-item prop="name" label="仓库名称">
                    <el-input class="inp" v-model="form.name" placeholder="请输入仓库名称"></el-input>
                </el-form-item>
                <el-form-item prop="user" label="仓库负责人">
                    <el-input class="inp" v-model="form.user" placeholder="请输入仓库负责人"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="仓库负责人手机号">
                    <el-input class="inp" v-model="form.phone" placeholder="请输入仓库负责人手机号"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="仓库地址">
                    <region @regionMsg='getRegion(1)' :regionMsg='address' :num="1"></region>
                    <div style="margin-top: 10px">
                        <el-input type="textarea" class="inp-textarea" placeholder="请输入详细地址" v-model="form.address"></el-input>
                    </div>
                </el-form-item>
                <el-form-item prop="send" label="是否能发货" required="">
                    <el-radio-group v-model="form.send">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="send" label="是否为退货仓" required="">
                    <el-radio-group v-model="form.send">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="linkName" label="联系人名称">
                    <el-input class="inp" v-model="form.linkName" placeholder="请输入联系人名称"></el-input>
                </el-form-item>
                <el-form-item prop="linkPhone" label="退货仓联系方式">
                    <el-input class="inp" v-model="form.linkPhone" placeholder="请输入退货仓联系方式"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="仓库地址">
                    <region @regionMsg='getRegion(2)' :regionMsg='address' :num="2"></region>
                    <div style="margin-top: 10px">
                        <el-input type="textarea" class="inp-textarea" placeholder="请输入详细地址" v-model="form.address"></el-input>
                    </div>
                </el-form-item>
                <el-form-item prop="remark" label="备注">
                    <el-input type="textarea" class="inp-textarea" v-model="form.remark" maxlength="180" placeholder="请填写备注"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="btnLoading" @click="submitForm('form')">提 交</el-button>
                    <el-button type="success" @click="cancel">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import request from '@/http/http';
    import region from '@/components/common/Region.vue';

    export default {
        components: { vBreadcrumb, region },
        data() {
            return {
                nav: ['云仓仓库管理', '仓库管理', '新建仓库'],
                id: '',
                url: '',
                form: {
                    type: 1,
                    supplierId: '',
                    supplierName: '',
                    code: '',
                    name: '',
                    user: '',
                    phone: '',
                    send: '',
                    linkName: '',
                    linkPhone: '',
                    remark: ''
                },
                tableData: [],
                type: '', // 1.添加 2.编辑
                rules: {
                    name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 1, max: 16, message: '活动名称长度在1到16个字符', trigger: 'blur' }
                    ],
                    loseHint: [
                        { required: true, message: '请输入未中奖提示语', trigger: 'blur' }
                    ]
                },
                btnLoading: false,
                address: ''
            };
        },
        activated() {
            this.id = this.$route.query.repertoryId || sessionStorage.getItem('repertoryId');
            this.type = this.$route.query.type == 'add' ? 1 : 2;
            this.getInfo();
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return;
                    const data = this.form;
                    if (this.status == 2) {
                        this.tableData.forEach((v, k) => {
                            v.totalNum = v.addNum || 0;
                        });
                        data.id = this.id;
                    }
                    try {
                        this.tableData.forEach((v, k) => {
                            const isInt = /^0|[1-9]\d*$/; const isDouble = /^(0|[1-9]\d*)([.]{1}[0-9]{1,2})?$/;
                            if (!isInt.test(v.totalNum) || v.totalNum.length > 12) {
                                throw '发放数为1-12位数字';
                            } else {
                                if (v.stockNum != -1 && v.totalNum > v.stockNum) {
                                    throw '发放数不能大于库存';
                                }
                            }
                            if (!isDouble.test(v.winRate)) {
                                throw '中奖概率保留2位小数';
                            }
                        });
                    } catch (error) {
                        this.$message.warning(error);
                        return;
                    }

                    data.scratchCardPrize = this.tableData;
                    this.btnLoading = true;
                    request[this.url](data).then(res => {
                        this.$message.success(res.msg);
                        this.$router.push('/scratchCardsList');
                        this.btnLoading = false;
                    }).catch(err => {
                        console.log(err);
                        this.btnLoading = false;
                    });
                });
            },
            getInfo() {
                this.resetValue();
                if (this.type == 1) {
                    this.nav[2] = '新建仓库';
                    this.url = 'addScratchCard';
                } else {
                    this.nav[2] = '编辑仓库';
                    this.url = 'updateScratchCard';
                    this.getDetail();
                }
            },
            resetValue() {
                this.form = {
                    name: '',
                    loseHint: ''
                };
                this.totalRatio = 0;
                this.tableData = [];
                this.selectedCoupon = [];
                this.tempChooseList = [];
            },
            getDetail() {
                const data = {
                    id: this.id
                };
                request.findScratchCardById(data).then(res => {
                    this.form = res.data;
                    this.tableData = res.data.scratchCardPrize;
                    this.tableData.forEach((v, k) => {
                        this.totalRatio += v.winRate;
                        this.selectedCoupon.push(v);
                    });
                }).catch(err => {
                    console.log(err);
                });
            },
            // 获取省市区
            getRegion(num, msg) {
                console.log(num);
                this.address = msg;
                this.form.provinceCode = this.address[0];
                this.form.cityCode = this.address[1];
                this.form.areaCode = this.address[2];
                console.log(this.$refs);
            },
            // 取消
            cancel() {
                this.$router.push('/scratchCardsList');
            }
        }
    };
</script>

<style lang="less" scoped>
.repertory-set{
    /deep/.el-dialog {
        border-radius: 10px;
        overflow: auto;
        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px 50px;
            .el-dialog__title {
                color: #ff6868;
            }
        }
    }
    .inp{
        width: 300px;
    }
    .inp-textarea,/deep/.el-textarea__inner{
        resize: none;
        width: 300px;
        height: 150px;
    }
}
</style>
