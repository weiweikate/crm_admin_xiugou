<template>
    <div class="tab-content">
        <el-button @click="addSecKill" class="add-product" type="primary">新建秒杀</el-button>
        <div class="search-pane">
            <el-form :model="form" ref='form' inline label-width="100px">
                <el-form-item prop="productName" label="产品名称">
                    <el-input v-model.trim="form.productName" placeholder="请输入产品名称"></el-input>
                </el-form-item>
                <el-form-item prop="productCode" label="产品ID">
                    <el-input v-model.trim="form.productCode" placeholder="请输入产品ID"></el-input>
                </el-form-item>
                <el-form-item prop="activityCode" label="产品编号">
                    <el-input v-model.trim="form.activityCode" placeholder="请输入产品编号"></el-input>
                </el-form-item>
                <el-form-item prop="startDate" label="活动时间">
                    <el-date-picker
                        v-model="form.startDate"
                        type="datetimerange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="status" label="结束方式">
                    <el-select v-model="form.status" placeholder="全部">
                        <el-option
                            v-for="item in endStyleArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="createUser" label="发布人">
                    <el-select v-model="form.createUser" placeholder="全部">
                        <el-option value="">全部</el-option>
                        <el-option
                            v-for="item in createUserList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="releaseDate" label="发布时间">
                    <el-date-picker
                        v-model="form.releaseDate"
                        type="datetimerange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="topicStatus" label="是否绑定专题">
                    <el-select v-model="form.topicStatus" placeholder="全部">
                        <el-option value="">全部</el-option>
                        <el-option label="是" value="1">是</el-option>
                        <el-option label="否" value="0">否</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="getList(1)">搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--<v-remark :contents='contents'></v-remark>-->
        <el-table v-loading="tableLoading" :height="height" border :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column prop="activityCode" align="center" label="编号" min-width="100"></el-table-column>
            <el-table-column label="秒杀商品" min-width="300">
                <template slot-scope="scope">
                    <div class="product-img">
                        <img :src="scope.row.specImg">
                    </div>
                    <p class="product-inf">{{scope.row.name}}</p>
                    <p class="product-inf" style="margin-top: 25px">原价：￥{{scope.row.originalPrice}}</p>
                    <p class="product-inf">产品ID：{{scope.row.prodCode}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="spec" label="规格" align="center" min-width="100"></el-table-column>
            <el-table-column label="秒杀价格" align="center" min-width="60">
                <template slot-scope="scope">
                    ￥{{scope.row.seckillPrice}}
                </template>
            </el-table-column>
            <el-table-column prop="totalNumber" label="库存数量" align="center" min-width="60"></el-table-column>
            <el-table-column label="销量" align="center" min-width="60">
                <template slot-scope="scope">
                    <template>{{scope.row.saleNumber?scope.row.saleNumber:'0'}}</template>
                </template>
            </el-table-column>
            <el-table-column label="预约购买人数" align="center" min-width="60">
                <template slot-scope="scope">
                    <template>{{scope.row.raseCount?scope.row.raseCount:'0'}}</template>
                </template>
            </el-table-column>
            <el-table-column prop="" label="状态" align="center">
                <template slot-scope="scope">
                    <template v-if='scope.row.status == 2'>进行中</template>
                    <template v-else-if='scope.row.status == 3'>已结束<br>(库存售完)</template>
                    <template v-else-if='scope.row.status == 4'>已结束<br>(时间结束)</template>
                    <template v-else-if='scope.row.status == 5'>已结束<br>(手动结束)</template>
                    <template v-else-if='scope.row.status == 1'>未开始</template>
                    <template v-else-if='scope.row.status == 6'>下架隐藏</template>
                </template>
            </el-table-column>
            <el-table-column label="是否绑定专题" align="center" min-width="120">
                <template slot-scope="scope">
                    <template v-if="scope.row.topicStatus==1">是</template>
                    <template v-else>否</template>
                </template>
            </el-table-column>
            <el-table-column label="开始/结束时间" align="center" min-width="130">
                <template slot-scope="scope">
                    {{scope.row.beginTime|formatDateAll}}<br/>{{scope.row.endTime|formatDateAll}}
                </template>
            </el-table-column>
            <el-table-column label="关闭时间" align="center" min-width="120">
                <template slot-scope="scope">
                    <template v-if="scope.row.closeTime">{{scope.row.closeTime | formatDateAll}}</template>
                </template>
            </el-table-column>

            <el-table-column label="发布时间/发布人" align="center" min-width="130">
                <template slot-scope="scope">
                    {{scope.row.createTime | formatDateAll}}<br/>{{scope.row.adminName}}
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" min-width="100">
                <template slot-scope="scope">
                    <el-button style="margin-bottom:10px" type="primary" @click="toDetail(scope.row)">查看</el-button>
                    <el-button style="margin-bottom:10px" type="warning" @click="endOrDelete(1,scope.row)"
                               v-if="scope.row.status == 1||scope.row.status == 2">结束
                    </el-button>
                    <el-button style="margin-bottom:10px" type="danger" @click="endOrDelete(0,scope.row)"
                               v-if="scope.row.status != 1&&scope.row.status != 2">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
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
        <div class="operate-table">
            <el-popover placement="top" width="160" v-model="isShowPop">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                    <el-button @click="batchOperate(0)" type="primary" size="mini">确定</el-button>
                    <el-button size="mini" type="text" @click="isShowPop = false">取消</el-button>
                </div>
                <el-button slot="reference" @click="isShowPop = true">删除</el-button>
            </el-popover>
            <el-popover placement="top" width="160" v-model="isShowEndPop">
                <p>确定结束吗？</p>
                <div style="text-align: right; margin: 0">
                    <el-button @click="batchOperate(5)" type="primary" size="mini">确定</el-button>
                    <el-button size="mini" type="text" @click="isShowEndPop = false">取消</el-button>
                </div>
                <el-button slot="reference" @click="isShowEndPop = true">结束</el-button>
            </el-popover>
            <!--<el-button @click="batchOperate(1)">结束</el-button>-->
        </div>
        <!--结束或删除弹窗-->
        <div class="pwd-mask" v-if="showMask">
            <div class="box">
                <div class="mask-title">
                    <icon class="ico" ico='icon-jinggao'/>
                    {{showInf[index].title}}
                </div>
                <div class="mask-content">
                    <div class="del-tip">
                        <div>{{showInf[index].tip}}</div>
                        <div>{{showInf[index].result}}</div>
                    </div>
                    <div class="del-btn-group">
                        <el-button :loading="btnLoading" @click="closeMask(true)" type="primary">确认</el-button>
                        <el-button @click="closeMask(false)">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import utils from '@/utils/index.js';
    import icon from '@/components/common/ico';
    import moment from 'moment';
    import vRemark from '@/components/common/marketTools/remark.vue';
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http.js';

    export default {
        props: ['name'],
        mixins: [myMixinTable],
        components: {
            icon, vRemark
        },

        data() {
            return {
                contents: ['销量=成交订单总数-退款/退货订单数', '删除活动归还库存时间=手动关闭时间+订单关闭时间+5分钟'],

                endStyleArr: [// 结束方式
                    { label: '全部', value: '' },
                    { label: '库存售完', value: '3' },
                    { label: '时间结束', value: '4' },
                    { label: '手动结束', value: '5' }
                ],
                createUserList: [], // 发布人列表
                form: {
                    releaseDate: '',
                    startDate: '',
                    activityCode: '',
                    createUser: '',
                    productCode: '',
                    productName: '',
                    status: '',
                    topicStatus: ''
                },
                // 表格数据
                tableData: [],
                height: '',
                tableLoading: false,
                page: {
                    currentPage: 1,
                    totalPage: 0,
                    pageSize: 20
                },
                showMask: false, // 是否显示弹窗
                btnLoading: false, // 弹窗操作按钮样式
                showInf: [{// 弹窗文案
                    title: '删除确认',
                    tip: '确定要删除此活动？',
                    result: '一旦删除，不能撤回'
                }, {
                    title: '结束确认',
                    tip: '确定要结束此活动？',
                    result: '一旦结束，不能再开启'
                }, {
                    title: '下架确认',
                    tip: '确定要下架此活动？',
                    result: '一旦下架，不能再开启'
                }],
                index: '', // 删除0结束1
                id: '', // 操作id
                isShowPop: false,
                isShowEndPop: false,
                multipleSelection: [] // 复选框
            };
        },

        computed: {
            // 秒杀状态
            secStaName() {
                switch (this.name) {
                    case 'allSecKill':
                        return '';
                        break;
                    case 'notStart':
                        return '1';
                        break;
                    case 'starting':
                        return '2';
                        break;
                    case 'ended':
                        return '3';
                        break;
                }
            }
        },
        created() {
            const winHeight = window.screen.availHeight - 520;
            this.height = winHeight;
            this.getList(1);
            this.getCreateUserList();// 加载发布人列表
        },
        activated() {
            this.getList(1);
            this.getCreateUserList();// 加载发布人列表
        },

        methods: {
            // 获取发布人列表
            getCreateUserList() {
                request.queryAdminUserList({}).then(res => {
                    this.createUserList = [];
                    this.createUserList = res.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            //   提交表单
            getList(val) {
                const data = {};
                data.productName = this.form.productName;
                data.activityCode = this.form.activityCode;
                data.createUser = this.form.createUser;
                data.productCode = this.form.productCode;
                data.topicStatus = this.form.topicStatus;
                data.beginStartTime = this.form.startDate ? moment(this.form.startDate[0]).format('YYYY-MM-DD HH:mm:ss') : '';
                data.beginEndTime = this.form.startDate ? moment(this.form.startDate[1]).format('YYYY-MM-DD HH:mm:ss') : '';
                data.createStartTime = this.form.releaseDate ? moment(this.form.releaseDate[0]).format('YYYY-MM-DD HH:mm:ss') : '';
                data.createEndTime = this.form.releaseDate ? moment(this.form.releaseDate[1]).format('YYYY-MM-DD HH:mm:ss') : '';
                data.page = val;
                data.pageSize = this.page.pageSize;
                if (this.secStaName == 3) {
                    data.noStartStatus = 1;
                    data.startStatus = 2;
                } else {
                    data.unEndStatus = this.secStaName;
                }
                data.status = this.form.status;
                this.page.currentPage = val;
                this.tableLoading = true;
                request.queryOperatorSeckillList(data).then(res => {
                    if (!res.data) return;
                    this.tableData = [];
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                    this.tableLoading = false;
                }).catch(err => {
                    this.tableLoading = false;
                });
            },
            //   重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.form.startDate = '';
                this.form.releaseDate = '';
                this.getList(1);
            },
            // 新建秒杀
            addSecKill() {
                this.$router.push({ name: 'addSecKill' });
            },
            // 结束或删除操作
            endOrDelete(num, row) {
                this.index = num;
                this.showMask = true;
                this.id = row.id;
            },
            // 结束或删除操作确认取消
            closeMask(status) {
                if (status) {
                    const data = {};
                    if (this.index === 0) {
                        data.status = this.index;
                    } else if (this.index === 1) {
                        data.status = 5;
                    }
                    this.changeStatus(data);
                } else {
                    this.showMask = false;
                }
            },
            // 结束、删除
            changeStatus(data) {
                data.id = this.id;
                this.btnLoading = true;
                request.updateActiviySeckillStatus(data).then(res => {
                    this.getList(this.page.currentPage);
                    this.showMask = false;
                    this.btnLoading = false;
                }).catch(err => {
                    this.btnLoading = false;
                });
            },
            // 查看详情
            toDetail(row) {
                sessionStorage.setItem('secKillId', row.id);
                this.$router.push({ path: '/SecKillInfo', query: { secKillId: row.id }});
            },
            // 全选
            handleSelectionChange(val) {
                const that = this;
                this.multipleSelection = [];
                val.forEach((v, k) => {
                    that.multipleSelection.push(v.id);
                });
            },
            // 批量操作
            batchOperate(status) {
                if (this.multipleSelection.length == 0) {
                    this.$message.warning('请选择活动!');
                    return;
                }
                // status 0:删除 5：结束
                const data = {
                    status: status,
                    ids: this.multipleSelection
                };
                request.bathUpdateActiviySeckillStatus(data).then(res => {
                    this.isShowPop = false;
                    this.isShowEndPop = false;
                    if (res.data == 0) {
                        this.$message.success(res.msg);
                    } else {
                        this.$message.warning(res.data + '条数据不能执行该操作!');
                    }
                    this.getList(this.page.currentPage);
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };
</script>
<style lang='less' scoped>
    .tab-content {
        .add-product {
            margin: 0 0 20px 0;
        }
        .search-pane {
            width: 100%;
            padding: 30px 0 0 0;
            margin-bottom: 20px;
            background-color: #f7f7f7;
            box-sizing: border-box;
        }
        .el-input-group__append,
        .el-input-group__prepend {
            padding: 0 4px;
        }
        .operate {
            button {
                margin-right: 10px;
                margin-top: 5px;
            }
            button:nth-child(3) {
                margin-right: 0px;
            }
        }
        .operate-table {
            margin-top: 10px;
        }
        .el-button + .el-button {
            margin-left: 0px;
        }
        .block {
            float: right;
            margin-top: 10px;
        }
        .product-img {
            display: inline-block;
            float: left;
            width: 90px;
            height: 90px;
            border: 1px solid #ddd;
            overflow: hidden;
            img {
                width: 70px;
                height: 70px;
                margin: 10px;
            }
        }
        .product-inf {
            float: left;
            width: 68%;
            height: auto;
            margin-left: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .mange-sty {
            cursor: pointer;
            color: #33b4ff;
        }
        .color-red {
            color: #ff1e30;
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
                height: 285px;
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
                        top: 20%;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 18px;
                        text-align: center;
                        line-height: 40px;
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
