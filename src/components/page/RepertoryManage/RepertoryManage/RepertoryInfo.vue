<template>
    <div class="repertory-info">
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <div class="wrap">
                <span class='title'>仓库基础信息</span>
                <div class="info-area">
                    <div class="item">
                        <span>仓库编码：</span>
                        <span>{{detail.code}}</span>
                    </div>
                    <div class="item">
                        <span>仓库名称：</span>
                        <span>{{detail.name}}</span>
                    </div>
                    <div class="item">
                        <span>仓库类型：</span>
                        <span>{{!detail.type==1?'自建仓':detail.type==2?'加盟仓':detail.type==3?'虚拟仓':'供应商仓'}}</span>
                    </div>
                    <div class="item">
                        <span>仓库状态：</span>
                        <span>{{detail.status==1?'启用':'停用'}}</span>
                    </div>
                    <div class="item">
                        <span>仓库负责区域：</span>
                        <span>{{detail.code}}</span>
                    </div>
                    <div class="item">
                        <span>仓库地址：</span>
                        <span>{{detail.addressProvinceName}}{{detail.addressCityName}}{{detail.addressDistrictName}}{{detail.address}}</span>
                    </div>
                    <div class="item">
                        <span>创建时间：</span>
                        <span>{{detail.createTime|formatDateAll}}</span>
                    </div>
                    <div class="item">
                        <span>创建人：</span>
                        <span>{{detail.createUserName}}</span>
                    </div>
                    <div class="item">
                        <span>仓库负责人：</span>
                        <span>{{detail.manager}}</span>
                    </div>
                    <div class="item">
                        <span>是否为发货仓：</span>
                        <span>{{detail.sendGoods?'是':'否'}}</span>
                    </div>
                    <div class="item">
                        <span>是否为退货仓：</span>
                        <span>{{detail.returnGoods?'是':'否'}}</span>
                    </div>
                    <div class="item" v-if="detail.returnGoods">
                        <span>联系人名称：</span>
                        <span>{{detail.returnManager}}</span>
                    </div>
                    <div class="item" v-if="detail.returnGoods">
                        <span>退货仓库联系方式：</span>
                        <span>{{detail.returnContact}}</span>
                    </div>
                    <div class="item" v-if="detail.returnGoods">
                        <span>退货仓库地址：</span>
                        <span>{{detail.returnProvinceName}}{{detail.returnCityName}}{{detail.returnDistrictName}}{{detail.returnWarehouseAddress}}</span>
                    </div>
                    <div class="item">
                        <span>仓库品类数：</span>
                        <span class="color-blue" @click="toProduct(detail)">{{detail.productCount||0}}</span>
                    </div>
                    <div class="item">
                        <span>仓库报损数：</span>
                        <span>{{detail.lossCount||0}}</span>
                    </div>
                    <div class="item" v-if="detail.type==3&&detail.type==4">
                        <span>供应商ID：</span>
                        <span>{{detail.supplierCode}}</span>
                    </div>
                    <div class="item" v-if="detail.type==3&&detail.type==4">
                        <span>供应商名称：</span>
                        <span>{{detail.supplierName}}</span>
                    </div>
                    <div class="item" v-if="!detail.returnGoods&&detail.type!=3&&detail.type!=4">
                        <span>加盟仓类型：</span>
                        <span v-if="detail.joinWarehouseType==1">百世汇通</span>
                        <span v-if="detail.joinWarehouseType==2">顺丰</span>
                        <span v-if="detail.joinWarehouseType==3">申通</span>
                        <span v-if="detail.joinWarehouseType==4">韵达</span>
                    </div>
                    <div class="item">
                        <span>库存总数：</span>
                        <span>{{detail.totalStock||0}}</span>
                    </div>
                    <div class="item">
                        <span>剩余仓库库存：</span>
                        <span>{{detail.remainderStock||0}}</span>
                    </div>
                    <div class="item">
                        <span>冻结库存：</span>
                        <span>{{detail.freezeStock||0}}</span>
                    </div>
                    <div class="item">
                        <span>备注：</span>
                        <span>{{detail.remark}}</span>
                    </div>
                </div>
                <el-button type="primary" @click="back">返回列表</el-button>
            </div>
        </el-card>
    </div>
</template>
<script>
import breadcrumb from '@/components/common/Breadcrumb';
import request from '@/http/http';
import { getUserId } from '@/JS/commom.js';

export default {
    components: {
        breadcrumb
    },
    mixins: [getUserId],
    data() {
        return {
            nav: ['云仓仓库管理', '仓库管理', '仓库详情'],
            detail: {
                type: 2, // 1非退货仓  2退货仓  3供应商仓
                code: 111
            },
            id: ''
        };
    },
    mounted() {
        this.id = this.$route.query.repertoryInfoId || sessionStorage.getItem('repertoryInfoId');
        this.getDetail();
    },
    methods: {
        getDetail() {
            const that = this;
            const data = {
                code: that.id
            };
            request.queryRepertoryById(data).then(res => {
                that.detail = res.data;
            }).catch(err => {
                console.log(err);
            });
        },
        back() {
            this.$router.push('/repertoryList');
        },
        // 跳转到品类数
        toProduct(row) {
            sessionStorage.setItem('repertotyId', row.id);
            this.$router.push({ path: '/repertoryInventory', query: { repertotyId: row.id }});
        }
    }
};
</script>
<style lang='less' scoped>
.repertory-info{
    .color-blue{
        color:#3a8ee6;
        cursor: pointer;
    }
    .wrap{
        margin: 10px 50px;
        .title{
            font-size: 16px;
            line-height: 40px;
        }
        .info-area{
            .item{
                width: 33%;
                display: inline-block;
                line-height: 32px;
                height: 32px;
                color: #666;
                font-size: 14px;
            }
        }
    }
}
</style>


