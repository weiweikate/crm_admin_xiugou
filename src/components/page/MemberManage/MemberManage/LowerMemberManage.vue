<template>
    <div>
        <v-breadcrumb :nav="['经销商会员管理','会员管理','下级代理']"></v-breadcrumb>
        <el-card style="margin:10px 0 20px">
            <el-form ref="form" inline :model="form">
                <el-form-item prop="condition" label="会员搜索" label-width="120">
                    <el-input style="width:200px" placeholder="可通过用户ID/授权码/昵称" v-model="form.condition"></el-input>
                </el-form-item>
                <el-form-item prop="idcard" label="证件号" label-width="120">
                    <el-input style="width:200px" placeholder="请输入证件号" v-model="form.idcard"></el-input>
                </el-form-item>
                <el-form-item prop="phone" label="手机号" label-width="120">
                    <el-input style="width:200px" placeholder="请输入手机号" v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item prop="dType" label="会员类型" label-width="120">
                    <el-select v-model="form.userType" placeholder="请选择会员类型">
                        <el-option label="请选择会员类型" value=""></el-option>
                        <el-option label="网信经销商" value="1"></el-option>
                        <el-option label="供货经销商" value="2"></el-option>
                        <el-option label="网红经销商" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="levelId" label="用户层级" label-width="120">
                    <el-select v-model="exportForm.levelId" placeholder="全部层级">
                        <el-option label="全部层级" value=""></el-option>
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in levelList"
                                   :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <div style="display: inline-block;margin-right: 20px">
                        <region @regionMsg='getRegion' :regionMsg='address'></region>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getList(1)" type="primary">查询</el-button>
                    <el-button @click="exportData" type="primary">导出</el-button>
                    <!--<el-button @click="resetForm('form')">重置</el-button>-->
                </el-form-item>
            </el-form>
        </el-card>
        <div class="table-block">
            <template>
                <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%">
                    <el-table-column prop="id" label="用户ID" width="60" align="center"></el-table-column>
                    <el-table-column prop="nickname" label="用户昵称" align="center"></el-table-column>
                    <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
                    <el-table-column label="授权层级" align="center">
                        <template slot-scope="scope">{{scope.row.levelName}}级</template>
                    </el-table-column>
                    <el-table-column label="最近登录时间" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.lastLoginTime">{{scope.row.lastLoginTime|formatDateAll}}</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="code" label="授权码" align="center"></el-table-column>
                    <el-table-column label="会员类型" align="center">
                        <template slot-scope="scope">
                            <template v-if='scope.row.userType == 1'>网信经销商</template>
                            <template v-else-if='scope.row.userType == 2'>供货经销商</template>
                            <template v-else-if='scope.row.userType == 3'>网红经销商</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="idcard" label="证件号" align="center"></el-table-column>
                    <el-table-column label="区域/省市区" align="center">
                        <template slot-scope="scope">
                            {{(scope.row.province + scope.row.city + scope.row.area) || ''}}
                        </template>
                    </el-table-column>
                    <el-table-column label="下级" align="center">
                        <template slot-scope="scope">
                        <span style="cursor: pointer;color:#ff6868"
                              @click="toLower(scope.row.id)">{{scope.row.junior}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.status==0">待激活</template>
                            <template v-if="scope.row.status==1">正常</template>
                            <template v-if="scope.row.status==2">已关闭</template>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="160" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="warning" size="small" @click="detailItem(scope.$index,scope.row)">详情
                            </el-button>
                            <el-button type="danger" v-if="scope.row.status==1" size="small"
                                       @click="updateStatusItem(scope.$index,scope.row.id,1)">关闭
                            </el-button>
                            <el-button type="danger" v-else size="small"
                                       @click="updateStatusItem(scope.$index,scope.row.id,2)">开启
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <div class="block">
                <el-pagination
                        background
                        :page-size="page.pageSize"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.currentPage"
                        layout="total, prev, pager, next, jumper"
                        :total="page.totalPage">
                </el-pagination>
            </div>
        </div>
        <!--消息确认弹窗-->
        <el-dialog
            title="温馨提示"
            :visible.sync="tipsMask"
            width="30%"
            center
            >
            <p style="text-align: center">{{info}}</p>
            <span slot="footer">
                <el-button :loading="btnLoading" @click="oprSure(true)" class="del-btn" type="danger">{{btnTxt}}</el-button>
                <el-button @click="tipsMask=false">取 消</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
    import icon from '@/components/common/ico.vue';
    import region from '@/components/common/Region';
    import request from '@/http/http';
    import * as api from '@/api/api';
    export default {
        components: {
            vBreadcrumb, icon, region
        },
        mixins: [myMixinTable],
        data() {
            return {
                tableData: [],
                tableLoading: false,
                btnLoading: false,
                tipsMask: false,
                height: '',
                formLabelWidth: '100px',
                form: {
                    condition: '',
                    nickName: '',
                    code: '',
                    idCard: '',
                    phone: '',
                    dType: ''
                },
                exportForm: {
                    levelId: ''
                },
                selected: '',
                address: [],
                levelList: [], // 用户层级列表
                id: '',
                info: '',
                type: '',
                btnTxt: ''
            };
        },
        activated() {
            this.form.upUserid = this.$utils.getParam.call(this, 'memberToLowListPage');
            this.getList(this.page.currentPage);
            this.getLevelList();
        },
        methods: {
            // 获取列表
            getList(val) {
                const that = this;
                const data = that.form;
                data.page = val;
                data.pageSize = this.page.pageSize;
                data.levelId = that.exportForm.levelId;
                data.provinceId = this.address[0] == '0' ? '' : this.address[0];
                data.cityId = this.address[1];
                data.areaId = this.address[2];
                that.tableLoading = true;
                request.queryUserPageList(data).then(res => {
                    that.tableLoading = false;
                    that.tableData = [];
                    that.tableData = res.data.data;
                    that.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    that.tableLoading = false;
                    console.log(err);
                });
            },
            // 获取用户层级列表
            getLevelList() {
                const data = {};
                request.getUserLevelList(data).then(res => {
                    this.levelList = res.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            // 跳到下级列表
            toLower(id) {
                this.form.upUserid = id;
                this.getList(this.page.currentPage);
            },
            // 详情
            detailItem(index, row) {
                this.$utils.setParam.call(this, '/memberDetail', 'memberToInfo', row.id);
            },
            // 关闭,开启
            updateStatusItem(index, id, num) {
                this.id = id;
                if (num == 1) {
                    this.info = '是否确认关闭？';
                    this.type = '关闭';
                    this.btnTxt = '确认关闭';
                } else {
                    this.info = '是否确认开启？';
                    this.type = '开启';
                    this.btnTxt = '确认开启';
                }
                this.tipsMask = true;
            },
            oprSure() {
                const that = this;
                const data = {
                    id: that.id,
                    status: 1
                };
                const url = '';
                if (that.type === '关闭') {
                    data.status = 2;
                } else {
                    data.status = 1;
                }
                that.btnLoading = true;
                request.updateDealerById(data).then(res => {
                    that.btnLoading = false;
                    that.tipsMask = false;
                    that.getList(that.page.currentPage);
                }).catch(err => {
                    that.btnLoading = false;
                });
            },
            // 导出
            exportData() {
                const that = this;
                const data = that.form;
                data.page = that.page.currentPage;
                data.levelId = that.exportForm.levelId;
                const addrss = that.address;
                if (addrss && addrss[0]) {
                    data.provinceId = addrss[0];
                    if (addrss[1]) {
                        data.cityId = addrss[1];
                    }
                    if (addrss[2]) {
                        data.areaId = addrss[2];
                    }
                } else {
                    data.provinceId = '';
                    data.cityId = '';
                    data.areaId = '';
                }
                that.$axios
                    .post(api.exportDealerListExcel, data, { responseType: 'blob' })
                    .then(res => {
                        var data = res.data;
                        if (!data) {
                            return;
                        }
                        const url = window.URL.createObjectURL(new Blob([data]));
                        const link = document.createElement('a');
                        link.style.display = 'none';
                        link.href = url;
                        const time = moment(new Date()).format('YYYYMMDDHHmmss');
                        link.setAttribute('download', '会员列表' + time + '.xlsx');
                        document.body.appendChild(link);
                        link.click();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            //   重置表单
            resetForm(formName) {
                this.address = [];
                this.$refs[formName].resetFields();
                this.$refs['exportForm'].resetFields();
                this.getList(this.page.currentPage);
            },

            // 获取省市区
            getRegion(msg) {
                this.address = msg;
            }
        }
    };
</script>

<style>
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


</style>
