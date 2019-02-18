<template>
    <div class="notice">
        <v-breadcrumb :nav="['服务管理','公告通知管理']"></v-breadcrumb>
        <transition name="move" appear>
            <el-card style="margin:10px 0 20px">
                <el-form ref="form" :inline="true" :model="form" @submit.native.prevent>
                    <el-form-item prop="status" label="状态" label-width="120">
                        <el-select v-model="form.status" placeholder="请选择">
                            <el-option label="全部状态" value=""></el-option>
                            <el-option label="待推送" value="100"></el-option>
                            <el-option label="进行中" value="150"></el-option>
                            <el-option label="已结束" value="200"></el-option>
                            <el-option label="已取消" value="300"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="keyword" label="发布者/关键词" label-width="120">
                        <el-input style="width:200px" placeholder="请输入发布者/关键词" v-model="form.keyword"></el-input>
                    </el-form-item>
                    <el-form-item prop="date" label="时间" label-width="120">
                        <el-date-picker
                                v-model="form.date"
                                type="datetimerange"
                                format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="getList(1)" native-type="submit" type="primary">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </transition>
        <div class="table-block">
            <div style="margin: -20px 0 20px">
                <div class="tab-item" :class="index==0?'checked':''" @click="change(0)" v-auth="'yunying.noticeInformManage.gg'">公告</div>
                <div class="tab-item" :class="index==1?'checked':''" @click="change(1)" v-auth="'yunying.noticeInformManage.tz'" style="margin-left: -5px">通知
                </div>
            </div>
            <el-form ref="exportForm" :inline="true" :model="form" class="search-area">
                <el-form-item>
                    <el-button @click="addInf" type="primary" v-auth="'yunying.noticeInformManage.fbggtz'">发布公告/通知</el-button>
                </el-form-item>
            </el-form>
            <template>
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column prop="code" label="ID" align="center"></el-table-column>
                    <el-table-column prop="type" label="类型" width="80" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.type==100">公告</template>
                            <template v-if="scope.row.type==200">通知</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="标题" align="center"></el-table-column>
                    <el-table-column prop="userLevel" label="推送用户" align="center"></el-table-column>
                    <el-table-column label="推送区域">
                        <template slot-scope="scope">
                            <div class="area-detail" v-for="(v,k) in scope.row.provinces" :key="k" :title="v.cityNames">{{v.provinceName}}:{{v.cityNames}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="推送时间" align="center">
                        <template slot-scope="scope">
                            <template>{{scope.row.startTime|formatDateAll}}</template>
                            <br>
                            <template>{{scope.row.endTime|formatDateAll}}</template>
                        </template>
                    </el-table-column>
                    <el-table-column label="发布者/发布时间" align="center">
                        <template slot-scope="scope">
                            {{scope.row.createdUserName}}<br>{{scope.row.createdTime|formatDateAll}}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.status==100">待推送</template>
                            <template v-if="scope.row.status==150">进行中</template>
                            <template v-if="scope.row.status==200">已结束</template>
                            <template v-if="scope.row.status==300">已取消</template>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="120">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="detailItem(scope.$index,scope.row)" v-auth="'yunying.noticeInformManage.ckxq'">查看详情
                            </el-button>
                            <el-button type="success" v-if="index==0" size="small" @click="editItem(scope.row)" v-auth="'yunying.noticeInformManage.bj'">编辑
                            </el-button>
                            <!--<el-button type="warning" size="small" @click="upStatusItem(scope.row.id,2)"-->
                                       <!--v-if="scope.row.status==200">再次推送-->
                            <!--</el-button>-->
                            <el-button type="warning" size="small" @click="upStatusItem(scope.row.id,3)"
                                       v-if="scope.row.status==100" v-auth="'yunying.noticeInformManage.qxts'">取消推送
                            </el-button>
                            <el-button type="warning" size="small" @click="upStatusItem(scope.row.id,4)"
                                       v-if="scope.row.status==300" style="width: 80px" v-auth="'yunying.noticeInformManage.sc'"> 删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <div class="block">
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.currentPage"
                        :page-size="page.pageSize"
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
                        <el-button :loading="btnLoading" @click="oprSure(true)" class="del-btn" type="danger">确认
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
import moment from 'moment';
import utils from '@/utils/index.js';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';

export default {
    components: {
        vBreadcrumb, icon
    },
    mixins: [myMixinTable],
    data() {
        return {

            index: 0,
            tableData: [],
            height: '',
            tipsMask: false,
            info: '',
            formLabelWidth: '100px',
            form: {
                status: '',
                keyword: '',
                date: '',
                type: 100
            },
            exportForm: {
                level: ''
            },
            selected: '',
            nav: ['服务管理', '公告'],
            isShowDelToast: false,
            id: '',
            url: '',
            btnLoading: false,
            levels: [],
            levelIds: []
        };
    },
    created() {
    },
    activated() {
        this.getTableData();
    },
    methods: {
        getTableData() {
            request.getUserLevelList({}).then(res => {
                for (const i in res.data) {
                    const level = res.data[i].level;
                    const id = res.data[i].id;
                    this.levels.push(level);
                    this.levelIds.push(id);
                }
                this.getList(this.page.currentPage);
            }).catch(err => {
                console.log(err);
            });
        },
        change(num) {
            this.index = num;
            if (num === 0) { // 公告
                this.nav = ['服务管理', '公告'];
                this.form.type = 100;
            } else { // 通知
                this.nav = ['服务管理', '通知'];
                this.form.type = 200;
            }
            this.page.currentPage = 1;
            this.getList(this.page.currentPage);
        },
        // 获取列表
        getList(val) {
            const data = {
                page: val,
                pageSize: this.page.pageSize,
                status: this.form.status,
                keyword: this.form.keyword,
                type: this.form.type,
                startTime: this.form.date ? moment(this.form.date[0]).format('YYYY-MM-DD') : '',
                endTime: this.form.date ? moment(this.form.date[1]).format('YYYY-MM-DD') : ''
            };
            this.page.currentPage = val;
            this.tableLoading = true;
            request.queryNoticeList(this.$utils.trimForm(data)).then(res => {
                this.tableLoading = false;
                for (const i in res.data.data) {
                    const arr = res.data.data[i].userLevel.split(',');
                    const temp = [];
                    for (const k in arr) {
                        for (const j in this.levelIds) {
                            if (utils.stringToNumber(arr[k]) === utils.stringToNumber(this.levelIds[j])) {
                                const level = 'V' + this.levels[j];
                                if (temp.indexOf(level) === -1) {
                                    temp.push('V' + this.levels[j]);
                                }
                            }
                        }
                        if (arr[k] === 'new') {
                            temp.push('新注册用户');
                        }
                        if (arr[k] === 'no') {
                            temp.push('未注册用户');
                        }
                    }
                    if (this.index === 0) {
                        if (temp.length === this.levelIds.length + 2) {
                            res.data.data[i].userLevel = '全部';
                        } else {
                            res.data.data[i].userLevel = temp.join(',');
                        }
                    } else {
                        if (temp.length === this.levelIds.length + 1) {
                            res.data.data[i].userLevel = '全部';
                        } else {
                            res.data.data[i].userLevel = temp.join(',');
                        }
                    }
                }
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch(err => {
                this.tableLoading = false;
                console.log(err);
            });
        },
        // 详情
        detailItem(index, row) {
            sessionStorage.setItem('noticeInformId', row.id);
            this.$router.push({ path: '/noticeInformDetail', query: { noticeInformId: row.id }});
        },
        // 再次推送,取消推送
        upStatusItem(id, status) {
            this.tipsMask = true;
            // if (status === 2) {
            //     this.info = '确定再次推送？';
            //     this.url = 'cancelNoticeById';
            // }
            if (status === 3) {
                this.info = '确定取消推送？';
                this.url = 'cancelNoticeById';
            }
            if (status === 4) {
                this.info = '确定删除？';
                this.url = 'deleteNoticeById';
            }
            this.id = id;
        },
        oprSure() {
            const data = {
                id: this.id
            };
            this.btnLoading = true;
            request[this.url](data).then(res => {
                this.tipsMask = false;
                this.$message.success(res.msg);
                this.getList(this.page.currentPage);
                this.btnLoading = false;
            }).catch(err => {
                console.log(err);
                this.btnLoading = false;
                this.tipsMask = false;
            });
        },
        // 发布通知/公告
        addInf() {
            sessionStorage.setItem('isNotice', this.index);
            this.$router.push({ path: '/addNoticeInform', query: { isNotice: this.index }});
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.form.date = '';
            this.getList(this.page.currentPage);
        },
        // 编辑
        editItem(row) {
            sessionStorage.setItem('noticeId', row.id);
            this.$router.push({ path: '/editNotice', query: { noticeId: row.id }});
        }
    }
};
</script>

<style lang="less">
    .notice {
        .breadcrumb {
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
            height: 30px;
            overflow: hidden;
            background: white;
            padding-left: 40px;
            box-sizing: border-box;
        }
        .bread-item {
            line-height: 30px;
        }
        .ico {
            margin-right: 5px;
            color: #33b4ff;
            font-size: 18px;
        }
        .tab-item {
            width: 116px;
            height: 50px;
            line-height: 50px;
            border-radius: 0 0 5px 5px;
            text-align: center;
            color: #fff;
            background: #dddddd;
            display: inline-block;
            cursor: pointer;
        }
        .checked {
            background: #ff6868;
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
        .area-detail{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

    }


</style>
