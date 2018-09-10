<template>
    <div class="tab-content">
        <el-button @click="addDepreciate" v-if="p.operatorAddDepreciate" class="add-product" type="primary">新建降价拍
        </el-button>
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
                <el-form-item prop="startDate" label="起拍时间">
                    <el-date-picker
                        v-model="form.startDate"
                        type="datetimerange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="tstatus" label="结束方式">
                    <el-select v-model="form.tstatus" placeholder="全部">
                        <el-option
                            v-for="item in endStyleArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="userId" label="发布人">
                    <el-select v-model="form.userId" placeholder="全部">
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
                        format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="submitForm(1)">搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <v-remark :contents='contents'></v-remark>
        <el-table v-loading="tableLoading" border :data="tableData">
            <el-table-column prop="activityCode" align="center" label="编号" min-width="100"></el-table-column>
            <el-table-column label="降价拍商品" min-width="300">
                <template slot-scope="scope">
                    <div class="product-img">
                        <img :src="scope.row.productImg">
                    </div>
                    <p class="product-inf">{{scope.row.productName}}</p>
                    <p class="product-inf" style="margin-top: 25px">原价：￥{{scope.row.productPrice}}</p>
                    <p class="product-inf">产品ID：{{scope.row.productCode}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="productSpec" label="规格" align="center" min-width="100"></el-table-column>
            <el-table-column label="起拍价(元)" align="center" min-width="60">
                <template slot-scope="scope">
                    ￥{{scope.row.startPrice}}
                </template>
            </el-table-column>
            <el-table-column label="结束价(元)" align="center" min-width="60">
                <template slot-scope="scope">
                    <span class="color-red">￥{{scope.row.floorPrice}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="totalNumber" label="拍卖数量" align="center" min-width="60"></el-table-column>
            <el-table-column label="预约购买人数" align="center" min-width="60">
                <template slot-scope="scope">{{scope.row.reseCount?scope.row.reseCount:'0'}}</template>
            </el-table-column>
            <el-table-column label="订单实付金额" align="center" min-width="60">
                <template slot-scope="scope">
                    ￥{{scope.row.payTotal?scope.row.payTotal:'0'}}
                </template>
            </el-table-column>
            <el-table-column prop="payOrderCount" label="付款订单数" align="center" min-width="60"></el-table-column>
            <el-table-column prop="freezeNumber" label="冻结库存" align="center" min-width="60"></el-table-column>
            <el-table-column prop="payUserTotal" label="付款人数" align="center" min-width="60">
                <template slot-scope="scope">{{scope.row.payUserTotal?scope.row.payUserTotal:'0'}}</template>
            </el-table-column>
            <el-table-column prop="saleNum" label="关闭时间" align="center" min-width="120">
                <template slot-scope="scope">
                    <template v-if="scope.row.closeTime">{{scope.row.closeTime | formatDate}}</template>
                </template>
            </el-table-column>
            <el-table-column label="起拍/结束时间" align="center" min-width="120">
                <template slot-scope="scope">
                    {{scope.row.beginTime|formatDate}}<br/>{{scope.row.endTime|formatDate}}
                </template>
            </el-table-column>
            <el-table-column label="发布时间/发布人" align="center" min-width="120">
                <template slot-scope="scope">
                    {{scope.row.createTime | formatDate}}<br/>{{scope.row.userAccount}}
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
            <el-table-column label="操作" align="center" min-width="100" v-if="showOpr">
                <template slot-scope="scope">
                    <el-button style="margin-bottom:10px" type="primary" v-if="p.operatorfindById"
                               @click="toDetail(scope.row)">查看
                    </el-button>
                    <el-button style="margin-bottom:10px" type="danger" @click="endOrDelete(1,scope.row)"
                               v-if="(scope.row.status == 1||scope.row.status == 2)&&p.operatorUpdateDepreciatelist_2">
                        结束
                    </el-button>
                    <el-button style="margin-bottom:10px" type="warning" @click="deInventory(scope.row)"
                               v-if="scope.row.status == 2&&p.operatorUpdateDepreciatelist_3">减少库存
                    </el-button>
                    <el-button style="margin-bottom:10px" type="danger" @click="endOrDelete(0,scope.row)"
                               v-if="scope.row.status != 1&&scope.row.status != 2&&p.operatorUpdateDepreciatelist_1">
                        删除
                    </el-button>
                    <el-button style="margin-bottom:10px" type="warning" @click="endOrDelete(2,scope.row)"
                               v-if="(scope.row.status == 3||scope.row.status == 4||scope.row.status == 5)&&p.operatorUpdateDepreciatelist_4">
                        下架
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
        <!--减少库存弹窗-->
        <el-dialog title="减少库存" :visible.sync="inventoryMask">
            <div style="text-align: center;line-height: 50px">现有库存{{inventory}}</div>
            <el-form>
                <el-form-item prop="name" label="减少">
                    <el-input v-model="number" @blur="calInventory" auto-complete="off"></el-input>
                    <span class="tip">减掉的库存不可恢复</span>
                    <div class="tip" v-if="notEnough" style="margin-left: 50px">库存不足</div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :loading="btnLoading" type="primary" @click="sure">提交</el-button>
                <el-button @click="inventoryMask=false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import * as api from "@/api/OperateManage/MarketToolsManage/index.js";
    import * as pApi from "@/privilegeList/OperateManage/MarketToolsManage/index.js";
    import utils from "@/utils/index.js";
    import icon from "@/components/common/ico";
    import moment from 'moment'
    import vRemark from '@/components/common/marketTools/remark.vue'

    export default {
        props: ["name"],

        components: {
            icon, vRemark
        },

        data() {
            return {
                contents: ['订单实付款金额=总订单付款金额-退款金额', '成交订单数=总订单数-退款/退货订单数', '付款人数=总付款人数-退款/退货人数', '删除活动归还库存时间=手动关闭时间+订单关闭时间+5分钟'],
                // 权限控制
                p: {
                    operatorAddDepreciate: false,//添加
                    operatorUpdateDepreciatelist_1: false,//删除
                    operatorUpdateDepreciatelist_2: false,//结束
                    operatorUpdateDepreciatelist_3: false,//减少库存
                    operatorUpdateDepreciatelist_4: false,//下架
                    operatorfindById: false,//详情
                },
                showOpr: true,//操作总权限

                endStyleArr: [//结束方式
                    {label: '全部', value: ''},
                    {label: '库存售完', value: '3'},
                    {label: '时间结束', value: '4'},
                    {label: '手动结束', value: '5'},
                ],
                createUserList: [],//发布人列表
                form: {
                    releaseDate: '',
                    startDate: '',
                    activityCode: '',
                    userId: '',
                    productCode: '',
                    productName: '',
                    tstatus: ''
                },
                //表格数据
                tableData: [],
                tableLoading: false,
                page: {
                    currentPage: 1,
                    totalPage: 0,
                    pageSize: 20
                },
                showMask: false,//是否显示弹窗
                btnLoading: false,//弹窗操作按钮样式
                showInf: [{//弹窗文案
                    title: '删除确认',
                    tip: '确定要删除此活动？',
                    result: '一旦删除，不能撤回',
                }, {
                    title: '结束确认',
                    tip: '确定要结束此活动？',
                    result: '一旦结束，不能再开启',
                }, {
                    title: '下架确认',
                    tip: '确定要下架此活动？',
                    result: '一旦下架，不能再开启',
                }],
                index: '',//删除0结束1
                id: '',//操作id
                inventoryMask: false,//减少库存弹窗
                inventory: '',//现有库存数量
                number: '',//减少数量
                notEnough: false,//库存不足提示信息
            };
        },

        computed: {
            // 降价拍状态
            depStaName() {
                switch (this.name) {
                    case 'allDepreciate':
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
            this.submitForm(1);
            this.pControl();
            this.getCreateUserList();//加载发布人列表
        },
        activated() {
            this.submitForm(1);
            this.pControl();
            this.getCreateUserList();//加载发布人列表
        },

        methods: {
            // 权限控制
            pControl() {
                for (const k in this.p) {
                    this.p[k] = utils.pc(pApi[k]);
                }

                if (!this.p.operatorUpdateDepreciatelist_1 && !this.p.operatorUpdateDepreciatelist_2 && !this.p.operatorUpdateDepreciatelist_3 && !this.p.operatorUpdateDepreciatelist_4 && !this.p.operatorfindById) {
                    this.showOpr = false
                }
            },
            //获取发布人列表
            getCreateUserList() {
                this.$axios
                    .post(api.operatorqueyByStatus, {})
                    .then(res => {
                        this.createUserList = [];
                        this.createUserList = res.data.data;
                    })
                    .catch(err => {
                    });
            },
            //   提交表单
            submitForm(val) {
                let data = {};
                data.productName = this.form.productName;
                data.activityCode = this.form.activityCode;
                data.userId = this.form.userId;
                data.productCode = this.form.productCode;
                data.startTime = this.form.startDate ? moment(this.form.startDate[0]).format('YYYY-MM-DD HH:mm:ss') : '';
                data.startEndTime = this.form.startDate ? moment(this.form.startDate[1]).format('YYYY-MM-DD HH:mm:ss') : '';
                data.releaseTimebegins = this.form.releaseDate ? moment(this.form.releaseDate[0]).format('YYYY-MM-DD') : '';
                data.releaseTimeEnd = this.form.releaseDate ? moment(this.form.releaseDate[1]).format('YYYY-MM-DD') : '';
                data.page = val;
                data.pageSize = this.page.pageSize;
                if (this.depStaName == 3) {
                    data.bstatus = 1;
                    data.pstatus = 2
                } else {
                    data.status = this.depStaName;
                }
                data.tstatus = this.form.tstatus;
                this.page.currentPage = val;
                this.tableLoading = true;
                this.$axios
                    .post(api.operatorDepreciatelist, data)
                    .then(res => {
                        this.tableData = [];
                        this.tableData = res.data.data.data;
                        this.page.totalPage = res.data.data.resultCount;
                        this.tableLoading = false;
                    })
                    .catch(err => {
                        this.tableLoading = false;
                    });
            },
            //   重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.form.startDate = '';
                this.form.releaseDate = '';
                this.submitForm(1)
            },
            //分页
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.submitForm(val);
            },
            // 新建降价拍
            addDepreciate() {
                this.$router.push({name: "addDepreciate"});
            },
            //结束或删除操作
            endOrDelete(num, row) {
                this.index = num;
                this.showMask = true;
                this.id = row.id;
            },
            // 结束或删除操作确认取消
            closeMask(status) {
                if (status) {
                    let data = {};
                    if (this.index == 0) {
                        data.status = this.index;
                        data.url = pApi.operatorUpdateDepreciatelist_1
                    } else if (this.index == 1) {
                        data.status = 5;
                        data.url = pApi.operatorUpdateDepreciatelist_2
                    } else {
                        data.status = 6;
                        data.url = pApi.operatorUpdateDepreciatelist_4
                    }
                    this.changeStatus(data)
                } else {
                    this.showMask = false
                }
            },
            //结束、删除、减少库存
            changeStatus(data) {
                data.id = this.id;
                this.btnLoading = true;
                this.$axios
                    .post(api.operatorUpdateDepreciatelist, data)
                    .then(res => {
                        this.submitForm(this.page.currentPage);
                        this.showMask = false;
                        this.inventoryMask = false;
                        this.btnLoading = false
                    })
                    .catch(err => {
                        this.btnLoading = false;
                    });
            },
            //查看详情
            toDetail(row) {
                sessionStorage.setItem('id', row.id);
                this.$router.push({path: '/depreciateInfo', query: {id: row.id}})
            },
            // 减少库存
            deInventory(row) {
                this.inventoryMask = true;
                this.notEnough = false;
                this.number = '';
                this.id = row.id;
                this.inventory = row.totalNumber - row.freezeNumber
            },
            //计算库存是否不足
            calInventory() {
                if (this.inventory < this.number) {
                    this.notEnough = true;
                    return false
                }
                let reg = /^[1-9]*[1-9][0-9]*$/;
                if (!reg.test(this.number)) {
                    this.$message.warning('请输入正整数!');
                    this.number == '';
                    return false
                }
                return true
            },
            sure() {
                if (this.calInventory()) {
                    let data = {
                        id: this.id,
                        freezeNumber: this.number,
                        url: pApi.operatorUpdateDepreciatelist_3
                    };
                    this.changeStatus(data)
                }
            }
        },
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
        /*弹窗样式*/
        /deep/ .el-dialog {
            width: 530px;
            border-radius: 10px;
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
            .el-input {
                width: 210px;
            }
            .el-form-item {
                margin-left: 40px;
            }
            .el-dialog__footer {
                margin-right: 30px;
            }
            .tip {
                color: #ff6868;
            }
        }

    }

</style>
