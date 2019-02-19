<template>
    <div class="member">
        <v-breadcrumb :nav="['会员管理','会员管理']"></v-breadcrumb>
        <el-card style="margin:10px 0 20px">
            <el-form ref="form" inline :model="form" @submit.native.prevent>
                <el-form-item prop="condition" label="会员搜索" label-width="120">
                    <el-input style="width:200px" placeholder="可通过授权码/昵称" v-model="form.condition"></el-input>
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
                    <el-select v-model="form.levelId" placeholder="全部层级">
                        <el-option label="全部层级" value=""></el-option>
                        <el-option :label="`v${item.level}`" :value="item.id" v-for="(item,index) in levelList"
                                   :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <div style="display: inline-block;margin-right: 20px">
                        <region @regionMsg='getRegion' :regionMsg='address'></region>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button native-type="submit" @click="handleCurrentChange(1)" type="primary">查询</el-button>
                    <el-button type="primary" v-auth="'vip.memberManage.dc'">导出</el-button>
                    <!--<el-button @click="resetForm('form')">重置</el-button>-->
                </el-form-item>
            </el-form>
        </el-card>
        <div class="table-block">
            <mr-flying parentClass="content-box">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    :page-size="page.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </mr-flying>
            <el-table v-loading="tableLoading" :data="tableData" stripe border style="width: 100%">
                <el-table-column prop="id" label="用户ID" width="60" align="center"></el-table-column>
                <el-table-column prop="nickname" label="用户昵称" align="center"></el-table-column>
                <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
                <el-table-column label="靓号" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.perfectNumberDTOList.length !== 0" v-for="(v, k) in scope.row.perfectNumberDTOList" :key="k">{{v.perfectNumberCode}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="授权层级" align="center">
                    <template slot-scope="scope" v-if="scope.row.level !== null && scope.row.level !== undefined">{{`v${scope.row.level}`}}</template>
                </el-table-column>
                <el-table-column label="当前经验值" align="center" prop="experience" width="100">
                    <template slot-scope="scope">
                        <router-link :to="`/memberExp?code=${scope.row.code}`">{{scope.row.experience || 0}}</router-link>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="day_count" label="本日登录" align="center"></el-table-column>-->
                <!--<el-table-column prop="month_count" label="本月登录" align="center"></el-table-column>-->
                <el-table-column label="最近登录时间" align="center">
                    <template slot-scope="scope">
                        <template>{{scope.row.lastLoginTime|formatDateAll}}</template>
                    </template>
                </el-table-column>
                <el-table-column prop="code" label="授权码" align="center"></el-table-column>
                <el-table-column prop="idcard" label="证件号" align="center"></el-table-column>
                <el-table-column label="会员类型" align="center">
                    <template slot-scope="scope">
                        <template v-if='scope.row.userType == 1'>网信经销商</template>
                        <template v-else-if='scope.row.userType == 2'>供货经销商</template>
                        <template v-else-if='scope.row.userType == 3'>网红经销商</template>
                    </template>
                </el-table-column>
                <el-table-column label="区域/省市区" align="center">
                    <template slot-scope="scope">
                        {{(scope.row.province + scope.row.city + scope.row.area) || ''}}
                    </template>
                </el-table-column>
                <!--<el-table-column prop="style" label="渠道" width="100"></el-table-column>-->
                <el-table-column label="下级" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.junior}}</span>
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
                        <a v-auth="'vip.memberManage.xq'" :href="`#/memberDetail?memberToInfo=${scope.row.code}`" target="_blank" class="el-button el-button--primary el-button--small">详情</a>
                        <!--<el-button type="danger" v-if="scope.row.status!=3" size="small"-->
                                   <!--@click="updateStatusItem(scope.$index,scope.row.id,1)">关闭-->
                        <!--</el-button>-->
                        <!--<el-button type="danger" v-if="scope.row.status==3" size="small"-->
                                   <!--@click="updateStatusItem(scope.$index,scope.row.id,2)">开启-->
                        <!--</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
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
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import icon from '@/components/common/ico.vue';
import region from '@/components/common/Region';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http';

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
                phone: '',
                userType: '',
                levelId: '',
                idcard: ''
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
            btnTxt: '',
            hasAuth: ''// 是否有查看下级的权限
        };
    },
    mounted() {
        this.getList(this.page.currentPage);
        this.getLevelList();
        this.hasAuth = this.$oprAuth('vip.memberManage.xjck');
    },
    methods: {
        // 获取列表
        getList(val) {
            const data = {
                ...this.form
            };
            data.page = val;
            data.pageSize = this.page.pageSize;
            data.provinceId = this.address[0] == '0' ? '' : this.address[0];
            data.cityId = this.address[1];
            data.areaId = this.address[2];
            this.tableLoading = true;
            request.queryUserPageList(this.$utils.trimForm(data)).then(res => {
                this.tableLoading = false;
                this.tableData = [];
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch(err => {
                this.tableLoading = false;
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
        // 详情
        detailItem(index, row) {
            this.$router.push({ name: 'memberDetail', query: { memberToInfo: row.code }});
        },
        // 关闭,开启
        updateStatusItem(index, id, num) {
            const that = this;
            that.id = id;
            if (num == 1) {
                that.info = '是否确认关闭？';
                that.type = '关闭';
                that.btnTxt = '确认关闭';
            } else {
                that.info = '是否确认开启？';
                that.type = '开启';
                that.btnTxt = '确认开启';
            }
            that.tipsMask = true;
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

<style lang="less">
    .member {
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
