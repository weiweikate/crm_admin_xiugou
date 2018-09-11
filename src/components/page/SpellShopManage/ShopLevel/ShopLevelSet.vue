<template>
    <div class="shop-level-set">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }">
            <!--<el-button @click="addShopLevel" style="margin-bottom:20px" type="primary">添加店铺等级</el-button>-->
            <el-table border :data="tableData">
                <el-table-column type="index" label="编号" align="center"></el-table-column>
                <el-table-column prop='name' label="名称" align="center"></el-table-column>
                <el-table-column prop='level' label="层级" align="center">
                    <template slot-scope="scope">
                        <template>{{scope.row.level}}级</template>
                    </template>
                </el-table-column>
                <el-table-column prop='maxUser' label="人数限制" align="center"></el-table-column>
                <el-table-column prop='groupMoney' label="拼店金额" align="center"></el-table-column>
                <el-table-column prop='remark' label="备注说明" align="center"></el-table-column>
                <el-table-column prop='autoUpgrade' label="自动晋级" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.autoUpgrade==0">不自动</template>
                        <template v-if="scope.row.autoUpgrade==1">自动</template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" minWidth="300">
                    <template slot-scope="scope">
                        <el-button @click="shopPromotion(scope.row)" type="primary">晋级设置</el-button>
                        <el-button @click="shopDemotion(scope.row)" type="success">降级设置</el-button>
                        <el-button @click="editShopLevel(scope.row)" type="warning">编辑</el-button>
                        <!--<el-button @click="delItem(scope.row.id)" type="danger">删除</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog :title="diaTitle" :visible.sync="isShowAddShopLevel" width="30%">
            <el-form :model="form" label-width="100px">
                <el-form-item prop="name" label="等级名称">
                    <el-input v-model="form.name" placeholder="请输入等级名称"></el-input>
                </el-form-item>
                <el-form-item prop="level" label="层级">
                    <el-input v-model="form.level" placeholder="6级（自动获取、可修改、但是不可重复）"></el-input>
                </el-form-item>
                <el-form-item prop="autoUpgrade" label="自动晋级">
                    <el-radio v-model="form.autoUpgrade" label="1">是</el-radio>
                    <el-radio v-model="form.autoUpgrade" label="0">否</el-radio>
                </el-form-item>
                <el-form-item prop="maxUser" label="店铺人数设置">
                    <el-input v-model="form.maxUser" placeholder="请输入限制人数"></el-input>
                </el-form-item>
                <el-form-item prop="groupMoney" label="拼店金额设置">
                    <el-input v-model="form.groupMoney" placeholder="请输入金额"></el-input>
                </el-form-item>
                <el-form-item prop="remark" label="备注说明">
                    <el-input v-model="form.remark" placeholder="请输入说明"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
            <el-button type="primary" :loading="btnLoading" @click="confirmAddShopLevel">确 定</el-button>
            <el-button @click="isShowAddShopLevel=false">取 消</el-button>
        </span>
        </el-dialog>
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import utils from '@/utils/index.js';
    import deleteToast from '@/components/common/DeleteToast';
    import * as pApi from '@/privilegeList/SpellShopManage/index';
    import request from '@/http/http.js';

    export default {
        components: { vBreadcrumb, deleteToast },

        data() {
            return {

                nav: ['拼店店铺管理', '店铺等级设置'],
                diaTitle: '',
                isShowAddShopLevel: false,
                isShowDelToast: false,
                tableData: [],
                delId: 0,
                delUrl: 'http://api',
                delUri: '',
                form: {
                    name: '',
                    level: '',
                    autoUpgrade: '1',
                    maxUser: '',
                    groupMoney: '',
                    remark: ''
                },
                itype: '',
                id: '',
                btnLoading: false
            };
        },
        activated() {
            this.getList();
        },
        methods: {

            // 获取数据
            getList() {
                request.getAllStoreStar({}).then((res) => {
                    this.tableData = [];
                    this.tableData = res.data;
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 添加店铺等级
            addShopLevel() {
                this.diaTitle = '添加店铺等级';
                utils.cleanFormData(this.form);
                this.isShowAddShopLevel = true;
                this.itype = 'add';
                this.getMaxLevel();
            },
            // 编辑店铺
            editShopLevel(row) {
                this.diaTitle = '编辑店铺等级';
                this.isShowAddShopLevel = true;
                this.itype = 'edit';
                this.id = row.id;
                this.form.name = row.name;
                this.form.level = row.level;
                this.form.autoUpgrade = row.autoUpgrade.toString();
                this.form.maxUser = row.maxUser;
                this.form.groupMoney = row.groupMoney;
                this.form.remark = row.remark;
            },
            // 确认
            confirmAddShopLevel() {
                const data = this.form;
                if (!data.name) {
                    this.$message.warning('请输入等级名称!');
                    return;
                }
                if (!data.level) {
                    this.$message.warning('请输入层级!');
                    return;
                }
                if (!data.autoUpgrade) {
                    this.$message.warning('请选择是否自动晋级!');
                    return;
                }
                if (!data.maxUser) {
                    this.$message.warning('请输入店铺人数!');
                    return;
                }
                if (!data.groupMoney) {
                    this.$message.warning('请输入拼店金额!');
                    return;
                }
                this.isShowAddShopLevel = false;
                let url = '';
                if (this.itype == 'add') {
                    url = 'addStoreStar';
                } else {
                    data.id = this.id;
                    url = 'updateStoreStarById';
                }
                this.btnLoading = true;
                request[url](data).then((res) => {
                    // this.$message.success(res.data.msg);
                    this.getList();
                    this.btnLoading = false;
                }).catch((err) => {
                    console.log(err);
                    this.btnLoading = false;
                });
            },
            // 取消
            cancel() {
                this.isShowAddShopLevel = false;
                this.getList();
            },
            // 获取最大等级
            // getMaxLevel() {
            //     this.$axios.post(api.getMaxLevel, {})
            //         .then((res) => {
            //             this.form.level = res.data.data;
            //         }).catch((err) => {
            //             console.log(err);
            //         });
            // },

            // 店铺晋级
            shopPromotion(row) {
                sessionStorage.setItem('promotionShopId', row.id);
                this.$router.push({
                    name: 'promotionShop',
                    query: { promotionShopId: row.id }
                });
            },
            // 店铺降级
            shopDemotion(row) {
                sessionStorage.setItem('demotionShopId', row.id);
                this.$router.push({
                    name: 'demotionShop',
                    query: { demotionShopId: row.id }
                });
            },
            // 删除
            delItem(id) {
                this.delId = id;
                this.delUrl = 'deleteStoreStar';
                this.delUri = pApi.deleteStoreStar;
                this.isShowDelToast = true;
            },
            // 删除弹窗
            deleteToast(msg) {
                this.isShowDelToast = msg;
                this.getList();
            }
        }
    };
</script>
<style lang='less'>
    .shop-level-set {
        .el-dialog {
            border-radius: 10px;
            .el-dialog__header {
                border-bottom: 1px solid #ddd;
                .el-dialog__title {
                    color: #ff6868;
                }
            }
        }
        .block {
            margin: 20px;
        }
    }
</style>
