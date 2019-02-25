<template>
    <div class="tab-remark">
        <mr-flying parentClass="content-box">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="page.pageSize" :current-page="page.currentPage" layout="total, prev, pager, next, jumper" :total="page.totalPage"></el-pagination>
        </mr-flying>
        <el-table v-loading="tableLoading" border :data="tableData">
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column label="商品信息" width="350">
                <template slot-scope="scope">
                    <div class="product-info">
                        <img :src="scope.row.productImg" alt="图片加载失败">
                        <div class="info">
                            <div class="prod-name over-more-hidden">{{scope.row.productName}}</div>
                            <div class="prod-spu">商品SPU编码: {{scope.row.prodCode}}</div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="用户账号" align="center" width="150"></el-table-column>
            <el-table-column label="晒单信息" width="300">
                <template slot-scope="scope">
                    <div>
                        <el-rate v-model="scope.row.star" disabled text-color="#ff9900">
                        </el-rate>
                    </div>
                    <div>{{scope.row.comment}}</div>
                    <div class="pic-wrap">
                        <video v-if="scope.row.videoUrl" @click="showItem(scope.row,0)" class="video-pic" :src="scope.row.videoUrl"></video>
                        <span v-if="scope.row.videoUrl" class="video-btn"><i class="el-icon-caret-right"></i></span>
                        <template v-if="scope.row.imgUrls">
                            <img :key="k" v-for="(v,k) in scope.row.imgUrls" @click="showItem(scope.row,k+1)" :src="v" class="video-pic" alt="图片加载失败">
                        </template>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="回复内容" align="center" width="250">
                <template slot-scope="scope">
                    <template v-if="scope.row.reply">{{scope.row.reply}}</template>
                    <template v-else>/</template>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center" width="150">
                <template slot-scope="scope">
                    <template v-if="scope.row.status==2">上架</template>
                    <template v-else-if="scope.row.status==3">下架</template>
                    <template v-else>/</template>
                </template>
            </el-table-column>
            <el-table-column prop="adminName" label="更新人" align="center" width="150">
                <template slot-scope="scope">
                    <template v-if="scope.row.adminName">{{scope.row.adminName}}</template>
                    <template v-else>/</template>
                </template>
            </el-table-column>
            <el-table-column prop="" label="更新时间" align="center" width="150">
                <template slot-scope="scope">
                    <template v-if="scope.row.updateTime">{{scope.row.updateTime|formatDateAll}}</template>
                    <template v-else>/</template>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="220" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" slot="reference" v-if="!scope.row.reply && scope.row.type!=1" @click="replyItem(scope.row,scope.$index)" v-auth="'brand.shareOrderManage.sdhf'">回复</el-button>
                    <el-button type="success" v-if="!scope.row.stick&&scope.row.status==2 && scope.row.type!=1" @click="stickItem(scope.row,true)" v-auth="'brand.shareOrderManage.zdsd'">置顶</el-button>
                    <el-button type="success" v-if="scope.row.stick&&scope.row.status==2 && scope.row.type!=1" @click="stickItem(scope.row,false)" v-auth="'brand.shareOrderManage.zdsd'">取消置顶</el-button>
                    <el-button type="danger" v-if="scope.row.type!=1&&scope.row.status!=2" @click="displayItem(scope.row,true)" v-auth="'brand.shareOrderManage.sj'">上架</el-button>
                    <el-button type="warning" v-if="scope.row.status<=2 && scope.row.type!=1" @click="displayItem(scope.row,false)" v-auth="'brand.shareOrderManage.xj'">下架</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="回复评价" :visible.sync="mask">
            <div>
                <div class="reply-area">
                    <el-input type="textarea" maxlength="180" v-model="reply" @input="inputReply"></el-input>
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
        <!--图片视频预览弹出窗-->
        <video-pict :link="linkList" :dialogVisible="showMask" @msg="closeMask" :current="current" :imgUrls="imgUrls"></video-pict>
    </div>
</template>
<script>
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';
import videoPict from '@/components/common/pictureVideo';

export default {
    props: ['name'],
    components: { videoPict },
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
            reply: '',
            mask: false,
            isWarning: false,
            showMask: false,
            linkList: [], // 图片视频数组
            current: 0, // 当前预览
            imgUrls: [] // 图片数组
        };
    },
    created() {},
    mounted() {},
    methods: {
        //  提交表单
        getList(val) {
            this.data.page = val;
            this.data.pageSize = this.page.pageSize;
            this.page.currentPage = val;
            this.tableLoading = true;
            this.tableData = [];
            request
                .getCommentPage(this.$utils.trimForm(this.data))
                .then(res => {
                    if (!res.data) {
                        return;
                    }
                    this.tableData = res.data.data;
                    for (const i in res.data.data) {
                        const v = res.data.data[i];
                        v.linkList = []; // 图片视频数组
                        v.imgUrls = [];
                        if (v.videoUrl) {
                            const temp = {
                                type: 'video',
                                link: v.videoUrl
                            };
                            v.linkList.push(temp);
                        }
                        if (v.imgUrl) {
                            const imgUrls = v.imgUrl.split('$');
                            v.imgUrls = imgUrls;
                            for (const j in imgUrls) {
                                const temp = {
                                    type: 'picture',
                                    link: imgUrls[j]
                                };
                                v.linkList.push(temp);
                            }
                        }
                    }
                    this.page.totalPage = res.data.totalNum;
                    this.tableLoading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.tableLoading = false;
                });
        },
        // 回复
        replyItem(row, index) {
            this.id = row.id;
            this.index = index;
            this.mask = true;
            this.reply = '';
            this.count = 0;
        },
        // 监听回复内容
        inputReply() {
            this.count = this.reply.length;
            this.isWarning = false;
        },
        // 确认回复
        replySure() {
            const data = {
                id: this.id,
                reply: this.reply
            };
            this.btnLoading = true;
            request
                .sensitiveWords({ content: this.reply })
                .then(res => {
                    if (res.data && res.data.length) {
                        // 有敏感词，标星
                        this.isWarning = true;
                        this.replaceWords(this.reply, res.data);
                        this.btnLoading = false;
                    } else {
                        // 无敏感词，回复
                        request
                            .replyComment(data)
                            .then(res => {
                                this.$message.success(res.msg);
                                this.tableData[this.index].reply = this.reply;
                                this.mask = false;
                                this.isWarning = false;
                                this.btnLoading = false;
                            })
                            .catch(error => {
                                console.log(error);
                                this.btnLoading = false;
                            });
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.btnLoading = false;
                    this.isWarning = false;
                });
        },
        // 替换敏感词
        replaceWords(string, words) {
            if (words && words.length) {
                for (const i in words) {
                    const v = words[i];
                    string = string.replace(v, this.wordToStar(v));
                }
            }
            this.reply = string;
        },
        wordToStar(word) {
            let string = '';
            for (let i = 0; i < word.length; i++) {
                string += '*';
            }
            return string;
        },
        // （取消）置顶
        stickItem(row, status) {
            const data = {
                id: row.id,
                stick: status
            };
            request
                .stickComment(data)
                .then(res => {
                    this.$message.success(res.msg);
                    this.getList(this.page.currentPage);
                })
                .catch(error => {
                    console.log(error);
                    this.tableLoading = false;
                });
        },
        // 上（下）架
        displayItem(row, status) {
            const data = {
                id: row.id,
                display: status
            };
            request
                .displayComment(data)
                .then(res => {
                    this.$message.success(res.msg);
                    this.getList(this.page.currentPage);
                })
                .catch(error => {
                    console.log(error);
                    this.tableLoading = false;
                });
        },
        // 图片视频预览
        showItem(row, num) {
            this.linkList = row.linkList;
            this.current = row.videoUrl ? num : num - 1;
            this.showMask = true;
        },
        closeMask(msg) {
            this.showMask = msg;
        }
    }
};
</script>
<style lang='less' scoped>
.tab-remark {
    .pic-wrap {
        position: relative;
        .video-btn {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #fff;
            i {
                position: absolute;
                left: 5px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 20px;
            }
        }
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
    .product-info {
        display: flex;
        img {
            width: 100px;
            height: 100px;
            margin-right: 5px;
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
.video-pic {
    width: 60px;
    height: 60px;
    border: 1px solid #ccc;
    border-radius: 5px;
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
