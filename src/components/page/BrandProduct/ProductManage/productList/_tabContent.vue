<template>
    <div class="tab-content">
        <el-table v-loading="tableLoading" :data="tableData" @selection-change="handleSelectionChange" border stripe>
            <el-table-column type="selection" label="全选" align="center"></el-table-column>
            <el-table-column type="index" label="编号" align="center"></el-table-column>
            <el-table-column label="商品名称" width="400px">
                <template slot-scope="scope">
                    <div class="product-info">
                        <img :src="scope.row.imgUrl" alt="图片加载失败">
                        <div class="info">
                            <div class="prod-name over-more-hidden">{{scope.row.name}}</div>
                            <div class="prod-type">{{scope.row.secondName}}</div>
                            <div class="prod-tag">
                                <!--位运算取值 restrictions-->
                                <el-tag class="tag-item" type="primary" v-for="(v,k) in scope.row.tags" :key="k">{{v}}</el-tag>
                            </div>
                            <div class="prod-spu">SPU: {{scope.row.prodCode}}</div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="商品类目" align="center">
                <template slot-scope="scope">
                    <p>{{scope.row.firstCategoryName}}</p>
                    <p>{{scope.row.secCategoryName}}</p>
                    <p>{{scope.row.thirdCategoryName}}</p>
                </template>
            </el-table-column>
            <el-table-column label="商品售价" align="center" width="180px">
                <template slot-scope="scope">
                    <p>最低价:{{scope.row.minPrice | formatMoney}}</p>
                    <p>最高价:{{scope.row.maxPrice | formatMoney}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="商品状态" align="center">
                <template slot-scope="scope">
                    <!--<span v-if="scope.row.status == 0">删除</span>-->
                    <span v-if="scope.row.status == 1">待发布</span>
                    <span v-else-if="scope.row.status == 2">待审核</span>
                    <span v-else-if="scope.row.status == 3">待上架</span>
                    <span v-else-if="scope.row.status == 4">已上架</span>
                    <span v-else-if="scope.row.status == 5">待发布</span>
                    <span v-else-if="scope.row.status == 6">已下架</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="审核状态" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 3 || scope.row.status == 4">审核通过</span>
                    <span v-else-if="scope.row.status == 2">审核中</span>
                    <span v-else-if="scope.row.status == 5">审核驳回</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="商品类型" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == 1">普通商品</span>
                    <span v-else-if="scope.row.type == 2">内购商品</span>
                    <span v-else-if="scope.row.type == 3">虚拟商品</span>
                    <span v-else-if="scope.row.type == 4">卡券商品</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="businessType" label="贸易类型" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.businessType == 1">一般贸易</span>
                    <span v-else-if="scope.row.businessType == 2">跨境保税</span>
                    <span v-else-if="scope.row.businessType == 3">海外直邮</span>
                    <span v-else-if="scope.row.businessType == 4">海淘</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="taxRate" label="税率" align="center"></el-table-column>
            <el-table-column prop="stock" label="总库存" align="center"></el-table-column>
            <el-table-column prop="activityFreezeStock" label="活动冻结库存" align="center"></el-table-column>
            <el-table-column prop="freezeStock" label="订单冻结库存" align="center"></el-table-column>
            <el-table-column prop="warehouseType" label="商品来源" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.warehouseType == 1 || scope.row.warehouseType == 2">平台</span>
                    <span v-else-if="scope.row.warehouseType == 3 || scope.row.warehouseType == 4">供应商</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="warehouseType" label="发货方仓" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.warehouseType == 1 ">自建仓</span>
                    <span v-else-if="scope.row.warehouseType == 2">加盟仓</span>
                    <span v-else-if="scope.row.warehouseType == 3">供应商</span>
                    <span v-else-if="scope.row.warehouseType == 4">虚拟仓库</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="freightTemplateName" label="运费模板" align="center"></el-table-column>
            <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
            <el-table-column prop="supplierCode" label="供应商ID" align="center"></el-table-column>
            <el-table-column prop="sendType" label="推送状态" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.sendType == 1">未推送</span>
                    <span v-else-if="scope.row.sendType == 2">推送成功</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
                <template slot-scope="scope" v-if="scope.row.createTime">
                    {{scope.row.createTime | formatDateAll}}
                </template>
            </el-table-column>
            <el-table-column prop="createAdminName" label="最近更新者" align="center"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" align="center">
                <template slot-scope="scope" v-if="scope.row.updateTime">
                    {{scope.row.updateTime | formatDateAll}}
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="80px" fixed="right">
                <template slot-scope="scope">
                    <div class="operate">
                        <!--<span v-if="scope.row.status == 1 || scope.row.status == 5 || scope.row.status == 6" @click="editProduct(scope.row)">编辑</span>-->
                        <span v-if="scope.row.status != 2 " @click="editProduct(scope.row)">编辑</span>
                        <span @click="addRemark(scope.row)">备注</span>
                        <span @click="productInfo(scope.row)">详情</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size="page.pageSize"
                :current-page="page.currentPage"
                layout="total, prev, pager, next, jumper"
                :total="page.totalPage">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import request from '@/http/http';
import { myMixinTable } from '@/JS/commom';

export default {
    components: {},

    mixins: [myMixinTable],

    data() {
        return {
            prodIdArr: [],
            form: {},
            listNum: {
                checkingTotal: 0,
                inSellingTotal: 0,
                inWarehouseTotal: 0
            },
            tableLoading: false,
            tableData: [] // 表格名称
        };
    },

    mounted() {
    },
    methods: {
        //   提交表单
        getList(val) {
            const data = {
                ...this.form,
                page: val,
                pageSize: this.page.pageSize
            };
            this.tableLoading = true;
            request.queryProdList(data).then(res => {
                this.tableLoading = false;
                const tblData = res.data || [];
                this.listNum.checkingTotal = tblData.checkingTotal || 0;
                this.listNum.inSellingTotal = tblData.inSellingTotal || 0;
                this.listNum.inWarehouseTotal = tblData.inWarehouseTotal || 0;
                this.$emit('transData', this.listNum);
                this.page.totalPage = tblData.totalNum;
                this.tableData = [];
                if (tblData.data && tblData.data.length !== 0) {
                    tblData.data.forEach(v => {
                        const restrictions = v.restrictions || 0;
                        if (restrictions.toString() == 4) {
                            v.tags = ['支持7天无理由退换'];
                        }
                        if (!v.imgUrl || v.imgUrl == '') {
                            v.imgUrl = '/static/img/defaultImg.png';
                        }
                        this.tableData.push(v);
                    });
                }
            }).catch(err => {
                this.tableLoading = false;
                console.log(err);
            });
        },
        // 全选
        handleSelectionChange(val) {
            this.prodIdArr = [];
            if (val.length !== 0) {
                val.forEach(v => {
                    this.prodIdArr.push(v.prodCode);
                });
            }
        },
        // 编辑产品
        editProduct(row) {
            const selectedItem = [];
            selectedItem.push({ type: 1, label: row.firstCategoryName, value: row.firstCategoryId });
            selectedItem.push({ type: 2, label: row.secCategoryName, value: row.secCategoryId });
            selectedItem.push({ type: 3, label: row.thirdCategoryName, value: row.thirdCategoryId });
            this.$router.push({ name: 'productBaseParam', query: { cate: JSON.stringify(selectedItem), prodCode: row.prodCode }});
        },
        // 产品删除/下架
        productStatus(status) {
            if (this.prodIdArr.length === 0) return this.$message.warning('请先选择产品再进行操作');
            // 0：删除 1：待发布2：待审核3：已通过4:已上架5：未通过6:已下架
            const data = {
                codes: this.prodIdArr.join(','),
                status: status
            };
            this.$confirm(`是否${status == 0 ? '删除' : '下架'}选中商品?`, '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                request.batchUpdateProductStatus(data).then(res => {
                    this.$message.success(res.msg);
                    this.getList(this.page.currentPage);
                }).catch(err => {
                    console.log(err);
                });
            }).catch(() => {

            });
        },
        // 添加备注
        addRemark(row) {
            this.$prompt('请输入备注', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^.{1,180}$/,
                inputErrorMessage: '备注不能为空'
            }).then(({ value }) => {
                const data = {
                    prodCode: row.prodCode,
                    remark: value
                };
                request.updateProdRemark(data).then(res => {
                    this.$message.success(res.msg);
                    this.getList(this.page.currentPage);
                }).catch(err => {
                    console.log(err);
                });
            }).catch(() => {});
        },
        // 查看详情
        productInfo(row) {
            this.$router.push({ name: 'productInfo', query: { prodCode: row.prodCode }});
        }
    },
    filters: {
        formatPrice(val) {
            return `￥${val}`;
        }
    }
};
</script>
<style lang='less' scoped>
    .tab-content {
        .product-info{
            display: flex;
            align-items: center;
            img {
                width: 100px;
                height: 100px;
                border: 1px solid #ccc;
                border-radius: 5px;
            }
            .info {
                width: 260px;
                padding-left: 10px;
                box-sizing: border-box;
                & .prod-name{
                    line-height: 16px;
                    margin-bottom: 5px;
                }
                & .prod-type {
                    color: #aaa;
                }
                & .prod-tag{
                    margin-top: 5px;
                    & .tag-item{
                        margin-right: 3px;
                    }
                }
                & .prod-spu{
                    margin-top: 5px;
                }
            }
        }
        .operate{
            color: #33b4ff;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            & span{
                cursor: pointer;
            }
        }
    }
</style>
