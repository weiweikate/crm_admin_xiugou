<template>
    <div class="tab-remark">
        <el-table v-loading="tableLoading" border :data="tableData">
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column label="商品信息" width="350">
                <template slot-scope="scope">
                    <div class="product-info">
                        <img :src="scope.row.imgUrl" alt="图片加载失败">
                        <div class="info">
                            <div class="prod-name over-more-hidden">3434343434</div>
                            <div class="prod-spu">商品SUP编码: 34343434334343</div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="userCount" label="用户账号" align="center" width="150"></el-table-column>
            <el-table-column label="晒单信息" width="300">
                <template slot-scope="scope">
                    <div>
                        <el-rate v-model="scope.row.status" disabled text-color="#ff9900">
                        </el-rate>
                    </div>
                    <div>fjasjflasdfaskdfkdlflkdksfkdsafk</div>
                    <div>
                        <viewer :images="scope.row.imgList">
                            <img v-for="(item,index) in scope.row.imgList" :key="index" :src="item" alt="">
                        </viewer>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="回复内容" align="center" width="250"></el-table-column>
            <el-table-column prop="status" label="状态" align="center" width="150"></el-table-column>
            <el-table-column prop="user" label="更新人" align="center" width="150"></el-table-column>
            <el-table-column prop="" label="更新时间" align="center" width="150">
                <template slot-scope="scope">{{scope.row.updateTime|formatDateAll}}</template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" slot="reference" v-if="!scope.row.remark" @click="reply(scope.row,scope.$index)">回复</el-button>
                    <el-button type="success" v-if="!scope.row.isTop">置顶</el-button>
                    <el-button type="success" v-else>取消置顶</el-button>
                    <el-button type="warning" v-if="!scope.row.isHide">隐藏</el-button>
                    <el-button type="warning" v-else>取消隐藏</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-size="page.pageSize" layout="total, prev, pager, next, jumper" :total="page.totalPage">
            </el-pagination>
        </div>
        <el-dialog title="回复评价" :visible.sync="mask">
            <div>
                <div class="reply-area">
                    <el-input type="textarea" v-model="remark" @input="inputReply"></el-input>
                    <span>{{count}}/180</span>
                </div>
                <div class="warning" v-if="isWarning">存在敏感词信息</div>
                <div>注：晒单只能回复一次，请注意措辞</div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="mask=false">取消</el-button>
                    <el-button type="primary" :loading="btnLoading" @click="replySure">确认回复</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';

export default {
    props: ['name'],
    components: {},
    mixins: [myMixinTable],

    data() {
        return {
            status: '',
            tableData: [],
            tableLoading: false,
            data: {},
            // 回复弹窗
            btnLoading: false,
            count: 0,
            index: '',
            id: '',
            remark: '',
            mask: false,
            isWarning: false
        };
    },
    created() {},
    mounted() {},

    methods: {
        //  提交表单
        getList(val) {
            this.data.page = val;
            this.data.size = this.page.pageSize;
            this.page.currentPage = val;
            this.tableLoading = true;
            request
                .queryMerchant(this.data)
                .then(res => {
                    if (!res.data) return;
                    this.tableData = [];
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                    this.tableLoading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.tableLoading = false;
                });
        },
        // 回复
        reply(row, index) {
            this.id = row.id;
            this.index = index;
            this.mask = true;
            this.remark = '';
            this.count = 0;
        },
        // 监听回复内容
        inputReply() {
            this.count = this.remark.length;
        },
        // 确认回复
        replySure() {
            this.tableData[this.index].remark = this.remark;
            this.mask = false;
            this.btnLoading = true;
        }
    }
};
</script>
<style lang='less' scoped>
.tab-remark {
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
    .product-info {
        display: flex;
        img {
            width: 100px;
            height: 100px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        .info {
            width: 220px;
            padding-left: 10px;
            box-sizing: border-box;
            position: relative;
            & .prod-name {
                line-height: 16px;
                margin-bottom: 5px;
                position: absolute;
                top: 5px;
            }
            & .prod-spu {
                margin-top: 5px;
                position: absolute;
                bottom: 5px;
            }
        }
    }

    .el-button + .el-button {
        margin-left: 0px;
    }
    .block {
        float: right;
        margin-top: 10px;
    }
}
.warning {
    color: #ff6868;
}
.reply-area {
    position: relative;
    /deep/.el-textarea__inner {
        height: 160px;
        resize: none;
    }
    span {
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
}
.dialog-footer {
    text-align: right;
}
</style>
