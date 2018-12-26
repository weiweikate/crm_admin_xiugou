<template>
    <div class="freight-template">
        <v-breadcrumb :nav="['品牌产品管理','运费模板']"></v-breadcrumb>
        <div class="table-block">
            <el-button type="primary" style="margin-bottom: 20px" @click="addTemplate" v-auth="'brand.shippingTemplate.tj'">添加模板</el-button>
            <template>
                <table v-for="(v,k) in mockData" :key="k" class="table-area">
                    <tr>
                        <td colspan="2" class="left">
                            <span>id:{{v.id}}</span>
                            <span class="name">{{v.name}}<span v-if="v.type==0">（已指定条件包邮）</span></span>
                        </td>
                        <td colspan="3" class="right">
                            <span>{{v.adminName}}</span>
                            <span class="time">更新于 {{v.updateTime|formatDateAll}}</span>
                            <el-button type="primary" v-if="v.status==0">启用</el-button>
                            <el-button type="primary" v-if="v.status==1">停用</el-button>
                            <el-button type="success">修改</el-button>
                            <el-button type="warning">删除</el-button>
                        </td>
                    </tr>
                    <tr class="table-header">
                        <td>配送地址</td>
                        <td>{{tableHeader[v.style].unit}}</td>
                        <td>首费(元)</td>
                        <td>{{tableHeader[v.style].nextUnit}}</td>
                        <td>续费(元)</td>
                    </tr>
                    <tr v-for="(v1,k1) in v.freightList" :key="k1">
                        <td class="city">{{v1.city}}</td>
                        <td>{{v1.unit}}</td>
                        <td>{{v1.unitPrice}}</td>
                        <td>{{v1.nextUnit}}</td>
                        <td>{{v1.nextUnitPrice}}</td>
                    </tr>
                </table>
                <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%">
                    <el-table-column type="index" label="运费模板编号" width="100" align="center"></el-table-column>
                    <el-table-column prop="name" label="模板名称" align="center"></el-table-column>
                    <el-table-column label="是否包邮" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.freightType==1">自定义运费</template>
                            <template v-if="scope.row.freightType==2">平台承担运费</template>
                            <template v-if="scope.row.freightType==3">满{{scope.row.freightFreePrice}}包邮</template>
                        </template>
                    </el-table-column>
                    <el-table-column label="计价方式" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.calcType==1">按重量</template>
                            <template v-if="scope.row.calcType==2">按体积</template>
                            <template v-if="scope.row.calcType==3">按件数量</template>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="状态" width="180" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.status == 1">启用</template>
                            <template v-if="scope.row.status == 2">停用</template>
                        </template>
                    </el-table-column>-->
                    <el-table-column prop="num" label="使用数" align="center"></el-table-column>
                    <el-table-column min-width="100" label="模板设置" align="center">
                        <template slot-scope="scope">
                            <!--<el-button type="primary" size="small">设为默认</el-button>-->
                            <el-button type="warning" size="small" @click="editItem(scope.$index,scope.row.id)" v-auth="'brand.shippingTemplate.sz'">设置模板
                            </el-button>
                            <el-button type="danger" v-if="scope.row.num==0" size="small" @click="delItem(scope.$index,scope.row.id)" v-auth="'brand.shippingTemplate.sc'">删除模板
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <!--删除弹窗-->
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import icon from '@/components/common/ico.vue';
import deleteToast from '@/components/common/DeleteToast';
import utils from '@/utils/index.js';
import * as pApi from '@/privilegeList/ShippingTemplate/index.js';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';

export default {
    components: {
        vBreadcrumb,
        icon,
        deleteToast
    },
    mixins: [myMixinTable],
    data() {
        return {
            tableData: [],
            tableLoading: false,
            height: '',
            isShowDelToast: false,
            formLabelWidth: '100px',
            form: {
                name: '',
                status: '',
                icon: ''
            },
            delId: '',
            delUrl: '',
            delUri: '',
            mockData: [
                { id: 1, name: '名字1', type: 0, adminName: 'cc', updateTime: 12823484344, status: 0, style: 0, freightList: [{ city: '中国', unit: 1, unitPrice: 1, nextUnit: 1, nextUnitPrice: 1 }, { city: '杭州市', unit: 1, unitPrice: 10, nextUnit: 1, nextUnitPrice: 8 }] },
                { id: 2, name: '名字2', type: 1, adminName: 'cc', updateTime: 15000000000, status: 1, style: 1, freightList: [{ city: '中国', unit: 1, unitPrice: 1, nextUnit: 1, nextUnitPrice: 1 }, { city: '杭州市,宁波市，湖州市，绍兴市，金华市，诸暨市，宁波市，湖州市，绍兴市，金华市，诸暨市', unit: 1, unitPrice: 10, nextUnit: 1, nextUnitPrice: 8 }] },
                { id: 3, name: '名字3', type: 1, adminName: 'cc', updateTime: 15000000000, status: 1, style: 2, freightList: [{ city: '中国', unit: 1, unitPrice: 1, nextUnit: 1, nextUnitPrice: 1 }, { city: '杭州市', unit: 1, unitPrice: 10, nextUnit: 1, nextUnitPrice: 8 }] }
            ],
            tableHeader: [{ unit: '首件(件)', nextUnit: '续件(件)' }, { unit: '首体积(m³)', nextUnit: '续体积(m³)' }, { unit: '首重(kg)', nextUnit: '续重(kg)' }]
        };
    },
    created() {},
    activated() {
        this.getList();
    },
    methods: {
        // 获取列表
        getList() {
            const that = this;
            that.tableLoading = true;
            request
                .queryFreightTemplateList({})
                .then(res => {
                    that.tableLoading = false;
                    that.tableData = res.data;
                })
                .catch(error => {
                    console.log(error);
                    that.tableLoading = false;
                });
        },

        // 添加模版
        addTemplate() {
            this.$router.push({ path: '/addTemplate' });
        },
        // 编辑
        editItem(index, id) {
            sessionStorage.setItem('templateId', id);
            this.$router.push({ path: '/editTemplate', query: { templateId: id } });
        },

        // 跳到品牌页面
        // toBrand(index,row){
        //     this.$router.push({ path: "/addOrUpBrand", query: { params: row } });
        // },
        // 删除
        delItem(index, id) {
            this.delId = id;
            this.delUrl = 'deleteFreightTemplateById';
            this.delUri = pApi.deleteFreightTemplateById;
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

<style lang="less" scoped>
.freight-template {
    img {
        width: 38px;
        height: 38px;
        border-radius: 5px;
        vertical-align: middle;
    }
    /*表格样式*/
    .table-block {
        padding: 20px 20px 60px;
        background: #fff;
    }
    .block {
        float: right;
        margin-top: 10px;
    }

    /*弹窗样式*/
    .el-dialog {
        width: 530px;
        border-radius: 10px;
    }
    .el-dialog__header {
        border-bottom: 1px solid #eee;
        padding: 20px 20px 10px 50px;
    }
    .el-dialog__title {
        color: #ff6868;
    }
    .el-dialog .el-input {
        display: inline;
    }
    .el-dialog .el-input__inner {
        width: 360px;
    }
    .el-select .el-input__inner {
        width: 200px;
    }
    .el-dialog .el-upload--text {
        width: 100px;
        height: 40px;
        border: none;
    }
    .icon-area .el-input__inner {
        width: 240px;
    }
    .el-dialog__footer {
        margin-right: 30px;
    }

    .table-area {
        font-size: 12px;
        width: 100%;
        color: #606266;
        border: 1px solid #ebeef5;
        border-collapse: collapse;
        margin-bottom: 20px;
        line-height: 23px;
        td {
            border: 1px solid #ebeef5;
            padding: 8px;
            text-align: center;
        }
        .left {
            text-align: left;
            border: none;
            .name {
                margin-left: 20px;
            }
        }
        .right {
            text-align: right;
            border: none;
            padding-right: 20px;
            .time {
                margin: 0 20px 0 10px;
            }
        }
        .table-header {
            background: #f7f7f7;
        }
        .city {
            width: 600px;
        }
    }
}
</style>
