<template>
    <div class="tab-content">
        <el-table :data="tableData" @selection-change="handleSelectionChange" border stripe>
            <el-table-column type="selection" label="全选" align="center"></el-table-column>
            <el-table-column type="index" label="编号" align="center"></el-table-column>
            <el-table-column label="商品名称" width="400px">
                <template slot-scope="scope">
                    <div class="product-info">
                        <img :src="scope.row.imgUrl" :alt="scope.row.name">
                        <div class="info">
                            <div class="prod-name over-more-hidden">{{scope.row.name}}</div>
                            <div class="prod-type">{{scope.row.short}}</div>
                            <div class="prod-tag">
                                <el-tag class="tag-item" type="primary" v-for="(v,k) in scope.row.tags" :key="k">{{v}}</el-tag>
                            </div>
                            <div class="prod-spu">SPU: {{scope.row.code}}</div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="id" label="商品类目" align="center"></el-table-column>
            <el-table-column prop="id" label="商品售价" align="center"></el-table-column>
            <el-table-column prop="id" label="商品状态" align="center"></el-table-column>
            <el-table-column prop="id" label="审核状态" align="center"></el-table-column>
            <el-table-column prop="id" label="商品类型" align="center"></el-table-column>
            <el-table-column prop="id" label="贸易类型" align="center"></el-table-column>
            <el-table-column prop="id" label="税率" align="center"></el-table-column>
            <el-table-column prop="id" label="总库存" align="center"></el-table-column>
            <el-table-column prop="id" label="活动冻结库存" align="center"></el-table-column>
            <el-table-column prop="id" label="订单冻结库存" align="center"></el-table-column>
            <el-table-column prop="id" label="商品来源" align="center"></el-table-column>
            <el-table-column prop="id" label="发货方仓" align="center"></el-table-column>
            <el-table-column prop="id" label="运费模板" align="center"></el-table-column>
            <el-table-column prop="id" label="推送状态" align="center"></el-table-column>
            <el-table-column prop="id" label="创建时间" align="center"></el-table-column>
            <el-table-column prop="id" label="最近更新者" align="center"></el-table-column>
            <el-table-column prop="id" label="更新时间" align="center"></el-table-column>
            <el-table-column prop="id" label="备注" align="center"></el-table-column>
            <el-table-column prop="id" label="操作" align="center" width="80px">
                <template slot-scope="scope">
                    <div class="operate">
                        <span @click="editProduct(scope.row)">编辑</span>
                        <span>备注</span>
                        <span @click="productInfo(scope.row)">详情</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
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
            name: '',
            prodIdArr: [],
            form: {},
            tableData: [{ id: 1, name: '苹果8xApple/苹果 iPhone X 4G手机 iphonex苹果x屏,苹果8xApple/苹果 iPhone X 4G手机 iphonex苹果x屏', imgUrl: 'https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/a6bd99c9c1c04c778e86c9de57f92a09.png', short: '双十一超值热卖', tags: ['自营', '7天无理由退换'], code: '123456789' }] // 表格名称
        };
    },

    mounted() {
    },
    methods: {
        //   提交表单
        getList(val) {
            let data = {
                page: val,
                pageSize: this.page.pageSize
            }
            request.queryProdList({}).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
            console.log(this.name);
            console.log(this.form);
        },
        // 全选
        handleSelectionChange(val) {
            this.prodIdArr = [];
            if (val.length !== 0) {
                val.forEach(v => {
                    this.prodIdArr.push(v.id);
                });
            }
            console.log(this.prodIdArr);
        },
        // 编辑产品
        editProduct(row) {

        },
        // 产品上架/下架
        productStatus(row, status) {

        },
        // 通过/不通过审核
        auditProduct(row, status) {

        },
        // 查看详情
        productInfo(row) {

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
    .tab-content {
        .product-info{
            display: flex;
            align-items: center;
            img {
                width: 100px;
                height: 100px;
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
