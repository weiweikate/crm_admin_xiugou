<script src="../../../../../webpack.dll.conf.js"></script>
<template>
    <div class="supplier">
        <v-breadcrumb :nav="['经销商会员管理','供应商管理']"></v-breadcrumb>
        <el-card style="margin:10px 0 20px">
            <el-form ref="form" :inline="true" :model="form">
                <el-form-item prop="name" label="供应商名称" label-width="120">
                    <el-input style="width:200px" placeholder="请输入供应商名称" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item prop="mobile" label="手机号" label-width="120">
                    <el-input style="width:200px" placeholder="请输入手机号" v-model="form.mobile"></el-input>
                </el-form-item>
                <el-form-item>
                    <div style="display: inline-block;margin-right: 20px">
                        <region @regionMsg='getRegion' :regionMsg='address'></region>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getList(1)" type="primary">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <div class="table-block">
            <template>
                <el-button type="primary" style="margin-bottom: 20px" @click="addSupplier">添加供应商</el-button>
                <el-table v-loading="tableLoading" :data="tableData" :height="height" border style="width: 100%">
                    <el-table-column type="index" label="供应商编号" width="100" align="center"></el-table-column>
                    <el-table-column prop="code" label="供应商ID" width="100" align="center"></el-table-column>
                    <el-table-column prop="name" label="供应商名称" align="center"></el-table-column>
                    <el-table-column label="供应商类型" width="100" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.type==1">产品供应商</template>
                            <template v-if="scope.row.type==2">服务供应商</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
                    <el-table-column prop="porductNum" label="供应产品数" width="100" align="center"></el-table-column>
                    <el-table-column label="区域/省市区" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.country==2">海外</template>
                            <template v-else>
                                {{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.areaName}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.status==1">正常</template>
                            <template v-if="scope.row.status==2">停用</template>
                            <template v-if="scope.row.status==3">删除</template>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="warning" size="small"
                                       @click="detailItem(scope.$index,scope.row)">详情
                            </el-button>
                            <template v-if="scope.row.status==2">
                                <el-button type="primary" size="small"
                                           @click="editItem(scope.$index,scope.row)">编辑
                                </el-button>
                            </template>
                           <template v-else>
                               <el-button type="primary" disabled size="small"
                                          @click="editItem(scope.$index,scope.row)">编辑
                               </el-button>
                           </template>
                            <el-button type="danger" :disabled="!(scope.row.porductNum == 0)" v-if="scope.row.status==1" size="small"
                                       @click="updateStatusItem(scope.$index,scope.row.id,1)">停用
                            </el-button>
                            <el-button type="danger" v-if="scope.row.status==2" size="small"
                                       @click="updateStatusItem(scope.$index,scope.row.id,2)">启用
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <div class="block">
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        :page-size="page.pageSize"
                        @current-change="handleCurrentChange"
                        :current-page="page.currentPage"
                        layout="total, prev, pager, next, jumper"
                        :total="page.totalPage">
                </el-pagination>
            </div>
        </div>
        <!--消息确认弹窗-->
        <div class="pwd-mask" v-if="tipsMask">
            <div class="box">
                <div class="mask-title">
                    <icon class="ico" ico='icon-jinggao'/>
                    温馨提示
                </div>
                <div class="mask-content">
                    <span class="del-tip">{{info}}</span>
                    <div class="del-btn-group">
                        <el-button :loading="btnLoading" @click="oprSure(true)" class="del-btn" type="danger">{{btnTxt}}
                        </el-button>
                        <el-button @click="tipsMask=false">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import vBreadcrumb from '../../common/Breadcrumb.vue';
    import icon from '../../common/ico.vue';
    import region from '../../common/Region';
    import * as api from '../../../api/MemberManage/SupplierManage/index';
    import * as pApi from '../../../privilegeList/MemberManage/SupplierManage/index.js';
    import moment, { min } from 'moment';
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http';

    export default {
        components: {
            vBreadcrumb, icon, region
        },
        mixins: [myMixinTable],
        data() {
            return {
                isShowOperate: true,
                tableData: [],
                tableLoading: false,
                btnLoading: false,
                tipsMask: false,
                height: '',
                formLabelWidth: '100px',
                form: {
                    name: '',
                    mobile: ''
                },
                exportForm: {},
                selected: '',
                address: [],
                id: '',
                info: '',
                type: '',
                btnTxt: ''
            };
        },
        created() {
            const winHeight = window.screen.availHeight - 520;
            this.height = winHeight;
        },
        activated() {
            this.getList(this.page.currentPage);
        },
        methods: {
            // 获取列表
            getList(val) {
                const that = this;
                const data = that.form;
                data.page = val;
                data.pageSize = this.page.pageSize;
                data.provinceId = this.address[0] == '0' ? '' : this.address[0];
                data.cityId = this.address[1];
                data.areaId = this.address[2];
                that.tableLoading = true;
                request.queryProductSupplierList(data).then(res => {
                    that.tableLoading = false;
                    that.tableData = res.data.data;
                    that.page.totalPage = res.data.totalNum;
                    this.page.currentPage = res.data.currentPage;
                }).catch(err => {
                    that.tableLoading = false;
                    console.log(err);
                });
            },
            // 详情
            detailItem(index, row) {
                this.$router.push({name: 'supplierDetail', query: {supplierInfo: row.id}});
            },
            // 编辑
            editItem(index, row) {
                this.$router.push({name: 'editSupplier', query: {supplierEditInfo: row.id}});
            },
            // 关闭,开启
            updateStatusItem(index, id, num) {
                const that = this;
                that.id = id;
                if (num == 1) {
                    that.info = '是否确认停用？';
                    that.type = 2;
                    that.btnTxt = '确认停用';
                } else {
                    that.info = '是否确认启用？';
                    that.type = 1;
                    that.btnTxt = '确认启用';
                }
                that.tipsMask = true;
            },
            oprSure() {
                const that = this;
                const data = {
                    id: that.id
                };
                if (that.type == 1) {
                    data.status = 1;
                } else {
                    data.status = 2;
                }
                that.btnLoading = true;
                request.stopProductSupplier(data).then(res => {
                    that.getList(that.page.currentPage);
                    that.btnLoading = false;
                    that.tipsMask = false;
                }).catch(err => {
                    console.log(err);
                    that.btnLoading = false;
                    that.tipsMask = false;
                });
            },
            // 添加供应商
            addSupplier() {
                this.$router.push('/addSupplier');
            },
            //   重置表单
            resetForm(formName) {
                this.address = [];
                this.$refs[formName].resetFields();
                this.getList(this.page.currentPage);
            },

            // 获取省市区
            getRegion(msg) {
                this.address = msg;
            }
        }
    };
</script>

<style lang="less">
    .supplier {
        /*表格样式*/
        .table-block {
            padding: 20px 20px 60px;
            background: #fff
        }

        .block {
            float: right;
            margin-top: 10px
        }

        .content {
            padding: 40px 40px 0
        }

        .table-block .el-form-item {
            margin-bottom: 0 !important;
        }

        .search-area {
            margin-bottom: 20px
        }

        .search-area .el-input__inner {
            width: 160px
        }
        .pwd-mask {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.2);
            .box {
                position: relative;
                width: 530px;
                height: 305px;
                background-color: #fff;
                border-radius: 10px;
                overflow: hidden;
                .mask-title {
                    width: 100%;
                    height: 56px;
                    border-bottom: 1px solid #ccc;
                    padding-left: 45px;
                    box-sizing: border-box;
                    text-align: center;
                    line-height: 56px;
                    color: #ff6868;
                    font-weight: 700;
                    .ico {
                        position: absolute;
                        top: 16px;
                        left: 228px;
                        color: red;
                        font-size: 20px;
                    }
                }
                .mask-content {
                    position: relative;
                    width: 100%;
                    height: 248px;
                    overflow: hidden;
                    padding: 30px 45px 0 45px;
                    box-sizing: border-box;
                    .del-tip {
                        position: absolute;
                        top: 30%;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 22px;
                    }
                    .del-btn-group {
                        width: 180px;
                        display: flex;
                        justify-content: space-between;
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        bottom: 15%;
                        .del-btn {
                            background-color: #ff6868;
                        }
                    }
                }
            }
        }

    }


</style>
