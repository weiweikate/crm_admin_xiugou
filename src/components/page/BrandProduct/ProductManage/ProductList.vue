<template>
    <div class="product-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="mb10">
            <el-form :model="form" ref='form' inline label-width="130px">
                <el-form-item prop="prodSpuCode" label="商品SPU">
                    <el-input v-model.trim="form.prodSpuCode" placeholder="请输入商品SPU"></el-input>
                </el-form-item>
                <el-form-item prop="feightTpl" label="运费模板">
                    <el-select v-model="form.feightTpl" placeholder="请选择运费模板">
                        <el-option value="" label="全部"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="prodType" label="商品类型">
                    <el-select v-model="form.prodType" placeholder="请选择商品类型">
                        <el-option value="" label="全部"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="updateUser" label="更新者">
                    <el-input v-model.trim="form.updateUser" placeholder="模糊下拉搜索"></el-input>
                </el-form-item>
                <el-form-item prop="firstCate" label="一级分类">
                    <el-select v-model="form.firstCate" placeholder="请选择一级分类">
                        <el-option value="" label="全部"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="isProprietary" label="是否自营">
                    <el-select v-model="form.isProprietary" placeholder="请选择是否自营">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="1" label="是"></el-option>
                        <el-option value="2" label="否"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="pushStatus" label="推送状态">
                    <el-select v-model="form.pushStatus" placeholder="请选择推送状态">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="1" label="未推送"></el-option>
                        <el-option value="2" label="推送成功"></el-option>
                        <el-option value="3" label="推送失败"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="deliveryWare" label="发货方仓">
                    <el-select v-model="form.deliveryWare" placeholder="请选择发货方仓">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="1" label="自建仓"></el-option>
                        <el-option value="2" label="第三方仓"></el-option>
                        <el-option value="3" label="供应商仓"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="updateTime" label="更新时间">
                    <el-date-picker type="daterange" v-model="form.updateTime" placeholder="请输入更新时间" start-placeholder="开始时间" end-placeholder="结束时时间"></el-date-picker>
                </el-form-item>
                <el-form-item prop="minPrice" label="价格">
                    <el-input v-model.trim="form.minPrice">
                        <template slot="prepend">￥</template>
                    </el-input>
                    -
                    <el-input v-model.trim="form.maxPrice">
                        <template slot="prepend">￥</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="maxPrice" label=""></el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="handleClick">搜索</el-button>
                    <el-button @click="$refs['form'].resetFields()">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="mb10">
            <el-button>删除</el-button>
            <el-button>下架</el-button>
            <el-button>审核</el-button>
            <el-button>调整运费模板</el-button>
            <el-button type="danger">推送云仓</el-button>
            <el-button type="danger">导出</el-button>
            <el-button @click="createProd" type="danger">创建商品</el-button>
        </el-card>
        <el-card>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="全部(0)" name="allProduct">
                    <v-tab-content ref="allProduct"></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="待审核(66)" name="auditProduct">
                    <v-tab-content ref="auditProduct"></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="出售中(99)" name="sale">
                    <v-tab-content ref="sale"></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="仓库中(100)" name="warehouse">
                    <v-tab-content ref="warehouse"></v-tab-content>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import vTabContent from './productList/_tabContent';

    export default {
        components: {
            vBreadcrumb,
            vTabContent
        },

        data() {
            return {
                nav: ['品牌产品管理', '产品管理'],
                form: {
                    prodSpuCode: '',
                    feightTpl: '',
                    prodType: '',
                    updateUser: '',
                    firstCate: '',
                    isProprietary: '',
                    pushStatus: '',
                    deliveryWare: '',
                    updateTime: '',
                    minPrice: '',
                    maxPrice: ''
                },
                activeName: 'allProduct'
            };
        },
        mounted() {
            this.handleClick();
        },
        methods: {
            handleClick(tab) {
                let status = '';
                switch (this.activeName) {
                    case 'allProduct': status = 'allProduct'; break;
                    case 'auditProduct': status = 'auditProduct'; break;
                    case 'sale': status = 'sale'; break;
                    case 'warehouse': status = 'warehouse'; break;
                    default: status = 'allProduct';
                }
                this.$refs[this.activeName].name = status;
                this.$refs[this.activeName].form = this.form;
                this.$refs[this.activeName].handleCurrentChange(1);
            },
            // 创建商品
            createProd() {
                this.$router.push('releaseProduct');
            }
        }
    };
</script>
<style lang='less' scoped>
    .product-list {
        /deep/.el-tabs__active-bar {
            background-color: #ff1e30;
        }
        /deep/.el-tabs__item.is-active,
        /deep/.el-tabs__item:hover {
            color: #ff1e30;
        }
        /deep/.el-input {
            width: 215px;
        }
        /deep/.el-input-group__prepend{
            padding: 0 5px;
        }
    }
</style>
