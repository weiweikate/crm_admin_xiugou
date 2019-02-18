<template>
    <div class="package-manage">
        <v-breadcrumb :nav="['运营管理','推广订单管理','套餐管理']"></v-breadcrumb>
        <el-card style="margin:10px 0 20px">
            <el-form ref="form" inline :model="form" @submit.native.prevent>
                <el-form-item prop="name" label="套餐名称" label-width="120">
                    <el-input style="width:200px" placeholder="请输入套餐名称" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getList(1)" native-type="submit" type="primary">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <div class="table-block">
            <el-button type="primary" style="margin-bottom: 20px" @click="addPackage" v-auth="'yunying.promotionOrderManage.tcgl'">新建套餐</el-button>
            <el-table v-loading="tableLoading" :height="height" border :data="tableData">
                <el-table-column type="index" label="编号" align="center" width="50"></el-table-column>
                <el-table-column prop="name" label="套餐名称" align="center"></el-table-column>
                <el-table-column prop="total" label="套餐金额(元)" align="center"></el-table-column>
                <el-table-column prop="price" label="套餐单红包金额(元)" align="center"></el-table-column>
                <el-table-column prop="count" label="红包数" align="center"></el-table-column>
                <el-table-column prop="cycle" label="推广周期(天)" align="center"></el-table-column>
                <el-table-column prop="period" label="翻倍周期(天)" align="center"></el-table-column>
                <el-table-column prop="probability" label="翻倍次数" align="center"></el-table-column>
                <el-table-column prop="totalNumber" label="总库存数(份)" align="center"></el-table-column>
                <el-table-column prop="sold" label="已售份数" align="center">
                    <template slot-scope="scope">{{scope.row.sold||0}}</template>
                </el-table-column>
                <el-table-column label="剩余份数" align="center">
                    <template slot-scope="scope">{{scope.row.totalNumber-scope.row.sold}}</template>
                </el-table-column>
                <el-table-column label="正在进行中(份)" align="center">
                    <template slot-scope="scope">{{scope.row.processing||0}}</template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                </el-table-column>
                <el-table-column prop="" label="状态" align="center">
                    <template slot-scope="scope">
                        <template v-if='scope.row.status == 1'>正常</template>
                        <template v-if='scope.row.status == 0||scope.row.status == 2'>关闭</template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="200">
                    <template slot-scope="scope">
                        <el-button type="success"  @click="addInventory(scope.row)" v-auth="'yyunying.promotionOrderManage.tcgl.zjkc'">增加库存</el-button>
                        <el-button type="primary" @click="buyDetail(scope.row)" v-auth="'yunying.promotionOrderManage.tcgl.gmxq'">购买详情</el-button>
                        <el-button type="warning" @click="toDetail(scope.row)" v-auth="'yunying.promotionOrderManage.tcgl.ckxq'">查看详情</el-button>
                        <el-button @click="openOrClose(scope.row,0)" v-if="scope.row.status==1" type="danger" v-auth="'yunying.promotionOrderManage.tcgl.gb'">关闭</el-button>
                        <!--<el-button @click="openOrClose(scope.row,1)" v-else type="warning">开启</el-button>-->
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
            <div class="mask" v-if="addMask">
                <div class="content">
                    <div class="item"><span>增加</span><el-input v-model="count" placeholder="请输入数值"></el-input>份</div>
                    <div style="text-align: center;margin-top: 30px">
                        <el-button type="primary" :loading="btnLoading"  @click="addRepertory">确定</el-button>
                        <el-button @click="addMask=false">取消</el-button>
                    </div>

                </div>
            </div>
            <!--结束或删除弹窗-->
            <div class="pwd-mask" v-if="showMask">
                <div class="box">
                    <div class="mask-title">
                        <icon class="ico" ico='icon-jinggao'/>
                        温馨提示
                    </div>
                    <div class="mask-content">
                        <div class="del-tip">
                            <div>{{showInf[index].tip}}</div>
                        </div>
                        <div class="del-btn-group">
                            <el-button :loading="btnLoading" @click="closeMask(true)" type="primary">确认</el-button>
                            <el-button @click="showMask=false">取消</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import icon from '@/components/common/ico.vue';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';

export default {
    components: { vBreadcrumb, icon },
    mixins: [myMixinTable],

    data() {
        return {
            height: '',
            status: '',
            form: {
                name: ''
            },
            tableData: [],
            tableLoading: false,
            // 新增库存对应参数
            addMask: false,
            id: '', // 优惠券id
            btnLoading: false,
            showMask: false,
            showInf: [{// 弹窗文案
                tip: '确认关闭该套餐吗？'
            }, {
                tip: '确认开启该套餐吗？'
            }],
            index: '', // 关闭0开启1
            count: '' // 增加红包数
        };
    },
    created() {
        const winHeight = window.screen.availHeight - 520;
        this.height = winHeight;
    },
    activated() {
        this.getList(1);
    },
    methods: {
        //  提交表单
        getList(val) {
            const data = {
                page: val,
                name: this.form.name,
                pageSize: this.page.pageSize
            };
            this.tableLoading = true;
            request.queryPromotionPackagePageList(this.$utils.trimForm(data)).then(res => {
                // if (!res.data) return;
                // this.tableData = [];
                // for (const i in res.data.data) {
                //     if (res.data.data[i].couponUserLevelList) {
                //         const userLevelIds = [];
                //         for (const j in res.data.data[i].couponUserLevelList) {
                //             userLevelIds.push(res.data.data[i].couponUserLevelList[j].name);
                //         }
                //         res.data.data[i].userLevelIds = userLevelIds.join(',');
                //     }
                //     // this.tableData.push(res.data.data[i])
                // }
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
                this.tableLoading = false;
            }).catch(error => {
                console.log(error);
                this.tableLoading = false;
            });
        },
        // 新建
        addPackage() {
            this.$router.push('/addPromotionPackage');
        },
        // 添加库存
        addInventory(row) {
            this.addMask = true;
            this.count = '';
            this.id = row.id;
        },
        addRepertory() {
            const data = {
                id: this.id,
                totalNumber: this.count
            };
            if (!this.count || !/^(0|[1-9]\d*)$/.test(this.count)) {
                this.$message.warning('请输入数值!');
                return;
            }
            this.btnLoading = true;
            request.updatePromotionPackageStockAndStatus(data).then(res => {
                this.$message.success(res.msg);
                this.addMask = false;
                this.getList(this.page.currentPage);
                this.btnLoading = false;
            }).catch(error => {
                console.log(error);
                this.btnLoading = false;
            });
        },
        // 开启关闭
        openOrClose(row, num) {
            this.id = row.id;
            this.index = num;
            this.showMask = true;
        },
        closeMask() {
            const data = {
                id: this.id,
                status: this.index
            };
            this.btnLoading = true;
            request.updatePromotionPackageStockAndStatus(data).then(res => {
                this.$message.success(res.msg);
                this.showMask = false;
                this.getList(this.page.currentPage);
                this.btnLoading = false;
            }).catch(error => {
                console.log(error);
                this.btnLoading = false;
            });
        },
        // 查看详情
        toDetail(row) {
            sessionStorage.setItem('packageDetailId', row.id);
            this.$router.push({ path: 'packageDetail', query: { packageDetailId: row.id }});
        },
        // 购买详情
        buyDetail(row) {
            sessionStorage.setItem('promotionOrderId', row.id);
            this.$router.push({ path: 'promotionOrderList', query: { promotionOrderId: row.id }});
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.getList(this.page.currentPage);
        }
    },
    filters: {
        formatPrice(val) {
            return `￥${val}`;
        }
    }
};
</script>
<style lang='less'>
    .package-manage {
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
            width: 80px;
            height: 80px;
            border: 1px solid #ddd;
            overflow: hidden;
            img {
                width: 60px;
                height: 60px;
                margin: 10px;
            }
        }
        .product-name {
            float: left;
            width: 75%;
            height: auto;
            margin: 5px 0 0 20px;
        }
        .product-id {
            float: left;
            width: 75%;
            height: auto;
            margin: 20px 0 0 20px;
        }
        .mask{
            width: 100%;
            height:100%;
            background: rgba(0,0,0,.3);
            position: fixed;
            top:0;
            left: 0;
            z-index: 2;
            .content{
                margin: 300px auto;
                background: #fff;
                padding:30px;
                width: 400px;
                border-radius: 10px;
                .item{
                    line-height: 40px;
                    span{
                        display: inline-block;
                        margin-left: 50px;
                    }
                    .el-input{
                        width: 150px;
                        margin: 0 10px;
                    }
                }
                .el-button:first-child{
                    margin-right: 30px;
                }
            }
        }
        .blue{
            color: #33b4ff;
            cursor: pointer;
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
