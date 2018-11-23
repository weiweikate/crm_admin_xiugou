<template>
    <div class="message-tip" @click="closeMask">
        <div class="message-wrap" v-loading="loading">
            <div class="message-content" @click.stop="" v-for="(v,k) in messageArr" :key="k">
                <el-tag type="danger" class="msg-tag">未读</el-tag>
                <div class="msg-title">{{`【${v.title}】`}}</div>
                <div class="msg">{{v.content}}</div>
                <div class="arrow-right">
                    >
                </div>
                <div class="operate" @click="showMsgInfo(v)">
                    <span>{{v.buttonName}}</span>
                </div><br/>
                <div class="time">
                    {{v.createdTime | formatDateAll}}
                </div>
            </div>
            <div class="show-more" @click="goPageAllMsg">
                查看更多
            </div>
        </div>
    </div>
</template>

<script>
import request from '@/http/http.js';
export default {
    data() {
        return {
            messageArr: [],
            loading: false
        };
    },
    methods: {
        // 关闭弹出层
        closeMask() {
            this.$parent.showMsg = false;
        },
        // 全部消息
        getAllMsg() {
            this.loading = true;
            request.queryMessagePage({ read: false, page: 1, pageSize: 5 }).then(res => {
                this.loading = false;
                this.messageArr = res.data.data;
            }).catch(err => {
                this.loading = false;
                console.log(err);
            });
        },
        // 跳转详情
        showMsgInfo(row) {
            request.readMessages({ ids: row.id }).then(res => {
                this.closeMask();
                const type = row.messageType ? row.messageType.toString() : '';
                const id = row.bizData;
                const bizType = row.bizType ? row.bizType.toString() : '';
                if (bizType) {
                    switch (bizType) {
                        case '1': this.$router.push({ name: 'appBannerAdv', query: { appBannerAdvStatus: 1, appBannerAdvPageType: 1 }}); break; // APP首页banner广告位
                        case '2': this.$router.push({ name: 'appBannerAdv', query: { appBannerAdvStatus: 2, appBannerAdvPageType: 2 }}); break; // APP首页推荐位
                        case '3': this.$router.push({ name: 'appBannerAdv', query: { appBannerAdvStatus: 1, appBannerAdvPageType: 3 }}); break; // APP首页明星店铺推荐位
                        case '4': this.$router.push({ name: 'appBannerAdv', query: { appBannerAdvStatus: 1, appBannerAdvPageType: 4 }}); break; // APP首页今日榜单广告位
                        case '5': this.$router.push({ name: 'appBannerAdv', query: { appBannerAdvStatus: 1, appBannerAdvPageType: 5 }}); break; // APP首页精品推荐广告位
                        case '6': this.$router.push({ name: 'appBannerAdv', query: { appBannerAdvStatus: 2, appBannerAdvPageType: 6 }}); break; // APP首页超值热卖广告位
                        case '8': this.$router.push({ name: 'appBannerAdv', query: { appBannerAdvStatus: 2, appBannerAdvPageType: 8 }}); break; // APP首页为你推荐广告位
                        case '9': this.$router.push({ name: 'appBannerAdv', query: { appBannerAdvStatus: 1, appBannerAdvPageType: 9 }}); break; // 拼店首页banner推荐位
                        case '10': this.$router.push({ name: 'appBannerAdv', query: { appBannerAdvStatus: 3, appBannerAdvPageType: 10 }}); break; // 类目搜索banner广告位'
                        default: this.$message.warning('无跳转页面类型');
                    }
                } else {
                    switch (type) {
                        case '1': this.$router.push({ name: 'joinManage', query: { inviteName: id }}); break; // 会员邀请
                        case '2': this.$router.push(''); break; // 会员充值
                        case '3': this.$router.push({ path: '/productList', query: { 'prodCode': id }}); break; // 产品管理
                        case '4': this.$router.push('/productList'); break; // 产品库存
                        case '5': this.$router.push('/reportSpellShop'); break; // 店铺举报
                        case '6': this.$router.push('/discountCoupon'); break; // 优惠券库存
                        case '7': this.$router.push({ name: 'giftManage', query: { prodCode: id }}); break; // 礼包管理
                        case '8': this.$router.push('/giftManage'); break; // 礼包库存
                        default: this.$message.warning('无跳转页面类型');
                    }
                }
            }).catch(err => {
                console.log(err);
            });
        },
        // 跳转全部消息
        goPageAllMsg() {
            this.closeMask();
            this.$router.push('message');
        }
    }
};
</script>

<style lang="less" scoped>
.message-tip{
    z-index: 999999;
    position: fixed;
    top: 70px;
    right: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(102, 102, 102, 0.5);
    .message-wrap{
        position: fixed;
        top: 70px;
        right: 0;
        background-color: #fff;
        padding: 30px 40px;
        width: 615px;
        border-radius: 10px;
        .message-content{
            cursor: pointer;
            font-size: 14px;
            width: 615px;
            height: 45px;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px 20px;
            line-height: 24px;
            .msg-tag{
                float: left;
            }
            .msg-title{
                width: 90px;
                height: 24px;
                float: left;
            }
            .msg{
                float: left;
                color: #989898;
                width: 60%;
                height: 24px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .operate{
                float: right;
                color: #4fbfff;
                margin-right: 10px;
            }
            .arrow-right{
                float: right;
                color: #989898;
            }
            .time{
                color: #989898;
                float: right;
            }
            &:not(:first-child){
                margin-top: 10px;
            }
        }
        .show-more{
            font-size: 14px;
            width: 100%;
            text-align: center;
            margin-top: 10px;
            cursor: pointer;
            color: black;
        }
    }
}
</style>
