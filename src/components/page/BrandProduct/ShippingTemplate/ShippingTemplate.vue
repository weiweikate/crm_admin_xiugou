<template>
    <div class="freight-template">
        <v-breadcrumb :nav="['物流管理','运费模板']"></v-breadcrumb>
        <div class="table-block" v-loading="btnLoading">
            <a v-auth="'brand.shippingTemplate.tj'" href="#/addTemplate" target="_blank" class="el-button el-button--primary el-button--small" style="margin-bottom: 20px">添加模板</a>
            <template>
                <div v-if="tableData.length==0" class="nodata">暂无模板~</div>
                <table v-else v-for="(v,k) in tableData" :key="k" class="table-area">
                    <tr>
                        <td colspan="5" class="header-info">
                            <div class="left">
                                <span>id:{{v.id}}</span>
                                <span class="name">{{v.name}}<span v-if="v.hasExemption==1">（已指定条件包邮）</span></span>
                            </div>
                            <div class="right">
                                <span>{{v.adminName}}</span>
                                <span class="time">更新于 {{v.updateTime|formatDateAll}}</span>
                                <el-button type="primary" v-if="v.status==2" @click="openOrClose(v.id,0)">启用</el-button>
                                <el-button type="danger" v-if="v.status==1" @click="openOrClose(v.id,1)">停用</el-button>
                                <el-button type="success" @click="editItem(v.id,v.num,2)">修改</el-button>
                                <el-button type="warning" @click="delItem(v.id)">删除</el-button>
                            </div>
                        </td>
                    </tr>
                    <template v-if="v.freightType==2">
                        <tr>
                            <td colspan="5">平台承担运费</td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr class="table-header">
                            <td>配送地址</td>
                            <td>{{tableHeader[v.calcType-1].unit}}</td>
                            <td>首费(元)</td>
                            <td>{{tableHeader[v.calcType-1].nextUnit}}</td>
                            <td>续费(元)</td>
                        </tr>
                        <tr v-for="(v1,k1) in v.freightTemplateInfoList" :key="k1">
                            <td>
                                <div class="city" v-for="(v2,k2) in v1.freightTemplateInfoDetailList" :key="k2" :title="v2.cityNames">
                                    <span>{{v2.provinceName}}</span>
                                    <span v-if="v2.provinceName!='中国'">:{{v2.cityNames}}</span>
                                </div>
                            </td>
                            <td>{{v1.startUnit}}</td>
                            <td>{{v1.startPrice}}</td>
                            <td>{{v1.nextUnit}}</td>
                            <td>{{v1.nextPirce}}</td>
                        </tr>
                    </template>
                </table>
                <div class="block">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-size="page.pageSize" layout="total, prev, pager, next, jumper" :total="page.totalPage">
                    </el-pagination>
                </div>
            </template>
        </div>
        <!--删除弹窗-->
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' :status='0' v-if="isShowDelToast"></delete-toast>
        <!-- 停用启用修改弹窗 -->
        <el-dialog title="温馨提示" :visible.sync="tipMask">
            <div class="tip-content">
                <div class="tip-info">{{tipInfo[index]}}</div>
                <div>
                    <el-button type="primary" :loading="btnLoading" @click="sure">确认</el-button>
                    <el-button type="success" @click="tipMask=false">取消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import icon from '@/components/common/ico.vue';
import deleteToast from '@/components/common/DeleteToast';
// import utils from '@/utils/index.js';
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
            /*   mockData: [
                { id: 1, name: '名字1', type: 0, adminName: 'cc', updateTime: 12823484344, status: 0, style: 0, freightList: [{ city: '中国', unit: 1, unitPrice: 1, nextUnit: 1, nextUnitPrice: 1 }, { city: '杭州市', unit: 1, unitPrice: 10, nextUnit: 1, nextUnitPrice: 8 }] },
                { id: 2, name: '名字2', type: 1, adminName: 'cc', updateTime: 15000000000, status: 1, style: 1, freightList: [{ city: '中国', unit: 1, unitPrice: 1, nextUnit: 1, nextUnitPrice: 1 }, { city: '杭州市,宁波市，湖州市，绍兴市，金华市，诸暨市，宁波市，湖州市，绍兴市，金华市，诸暨市', unit: 1, unitPrice: 10, nextUnit: 1, nextUnitPrice: 8 }] },
                { id: 3, name: '名字3', type: 1, adminName: 'cc', updateTime: 15000000000, status: 1, style: 2, freightList: [{ city: '中国', unit: 1, unitPrice: 1, nextUnit: 1, nextUnitPrice: 1 }, { city: '杭州市', unit: 1, unitPrice: 10, nextUnit: 1, nextUnitPrice: 8 }] }
            ], */
            tableHeader: [{ unit: '首重(kg)', nextUnit: '续重(kg)' }, { unit: '首体积(m³)', nextUnit: '续体积(m³)' }, { unit: '首件(件)', nextUnit: '续件(件)' }],
            tipInfo: ['确认启用？', '确认停用？', '存在商品使用该运费模板，调整后立即生效'],
            index: 0,
            tipMask: false,
            id: '',
            btnLoading: false
        };
    },
    created() {},
    activated() {
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取列表
        getList(val) {
            const data = {
                page: this.page.currentPage,
                pageSize: this.page.pageSize
            };
            this.page.currentPage = val;
            this.tableLoading = true;
            request
                .queryFreightTemplatePageList(data)
                .then(res => {
                    this.tableLoading = false;
                    if (!res.data.data) {
                        return;
                    }
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                })
                .catch(error => {
                    console.log(error);
                    this.tableLoading = false;
                });
        },
        // 编辑
        // num模板被应用次数 0未被使用，直接跳到编辑页面，否则弹窗确认后跳转
        editItem(id, num, index) {
            this.id = id;
            if (num) {
                this.index = index;
                this.tipMask = true;
            } else {
                this.toEditPage(id);
            }
        },
        // 删除
        delItem(id) {
            this.delId = id;
            this.delUrl = 'deleteFreightTemplateById';
            this.delUri = pApi.deleteFreightTemplateById;
            this.isShowDelToast = true;
        },
        // 删除弹窗
        deleteToast(msg) {
            this.isShowDelToast = msg;
            this.getList(this.page.currentPage);
        },
        // 停用启用
        openOrClose(id, index) {
            this.id = id;
            this.index = index;
            this.tipMask = true;
        },
        // 弹窗确认
        sure() {
            if (this.index === 2) {
                // 修改
                this.toEditPage(this.id);
            } else {
                const data = {
                    id: this.id,
                    status: 1 + this.index
                };
                this.btnLoading = true;
                request
                    .deleteFreightTemplateById(data)
                    .then(res => {
                        this.$message.success(res.msg);
                        this.getList(this.page.currentPage);
                        this.tipMask = false;
                        this.btnLoading = false;
                    })
                    .catch(error => {
                        console.log(error);
                        this.tipMask = false;
                        this.btnLoading = false;
                    });
            }
        },
        // 跳转到编辑页面
        toEditPage(id) {
            sessionStorage.setItem('templateId', id);
            // this.$router.push({ path: '/editTemplate', query: { templateId: id }});
            window.open('#/editTemplate?templateId=' + id);
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
    .nodata {
        text-align: center;
        height: 100px;
        line-height: 100px;
        border: 1px solid #eee;
        color: #303133;
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
    .tip-content {
        text-align: center;
    }
    .tip-info {
        height: 70px;
        line-height: 40px;
        font-size: 22px;
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
        margin-bottom: 50px;
        line-height: 23px;
        td {
            border: 1px solid #ebeef5;
            padding: 8px;
            text-align: center;
        }
        .header-info {
            text-align: left;
        }
        .left {
            float: left;
            text-align: left;
            .name {
                margin-left: 20px;
            }
        }
        .right {
            float: right;
            text-align: right;
            padding-right: 20px;
            .time {
                margin: 0 20px 0 10px;
            }
        }
        .table-header {
            background: #f7f7f7;
            td {
                width: 15%;
            }
            td:first-child {
                width: 40%;
            }
        }
        .city {
            width: 500px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
