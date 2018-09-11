<template>
    <div class="brand-manage">
        <v-breadcrumb :nav="['品牌产品管理','运费模板']"></v-breadcrumb>
        <div class="table-block">
            <el-button type="primary" style="margin-bottom: 20px" @click="addTemplate">添加模板</el-button>
            <template>
                <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%">
                    <el-table-column type="index" label="运费模板编号" width="100" align="center"></el-table-column>
                    <el-table-column prop="name" label="模板名称" align="center"></el-table-column>
                    <el-table-column label="是否包邮" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.freight_type==1">自定义运费</template>
                            <template v-if="scope.row.freight_type==2">平台承担运费</template>
                            <template v-if="scope.row.freight_type==3">满{{scope.row.freight_free_price}}包邮</template>
                        </template>
                    </el-table-column>
                    <el-table-column label="计价方式" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.calc_type==1">按重量</template>
                            <template v-if="scope.row.calc_type==2">按体积</template>
                            <template v-if="scope.row.calc_type==3">按件数量</template>
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
                            <el-button type="warning" size="small" @click="editItem(scope.$index,scope.row.id)">设置模板
                            </el-button>
                            <el-button type="danger" size="small" @click="delItem(scope.$index,scope.row.id)">删除模板
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
        vBreadcrumb, icon, deleteToast
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
            delUri: ''
        };
    },
    created() {
    },
    activated() {
        this.getList();
    },
    methods: {
        // 获取列表
        getList() {
            const that = this;
            that.tableLoading = true;
            request.queryFreightTemplateList({}).then(res => {
                that.tableLoading = false;
                that.tableData = res.data;
            }).catch(error => {
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
            this.$router.push({ path: '/editTemplate', query: { templateId: id }});
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

<style lang="less">
    .brand-manage {
        img{
            width: 38px;
            height: 38px;
            border-radius: 5px;
            vertical-align: middle;
        }
        /*表格样式*/
        .table-block {
            padding: 20px 20px 60px;
            background: #fff
        }
        .block {
            float: right;
            margin-top: 10px
        }

        /*弹窗样式*/
        .el-dialog {
            width: 530px;
            border-radius: 10px
        }
        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px 50px
        }
        .el-dialog__title {
            color: #ff6868
        }
        .el-dialog .el-input {
            display: inline
        }
        .el-dialog .el-input__inner {
            width: 360px
        }
        .el-select .el-input__inner {
            width: 200px
        }
        .el-dialog .el-upload--text {
            width: 100px;
            height: 40px;
            border: none
        }
        .icon-area .el-input__inner {
            width: 240px
        }
        .el-input__suffix {
            line-height: 24px
        }
        .icon-uploader {
            float: right;
            margin-right: 31px;
            height: 33px
        }
        .icon-uploader .el-button--small {
            border-radius: 5px;
            width: 100px
        }
        .el-upload--text .el-icon-upload {
            line-height: 0;
            margin: 0;
            color: #fff;
            font-size: 14px
        }
        .el-dialog__footer {
            margin-right: 30px
        }
        .el-upload-list {
            display: none
        }
    }


</style>
