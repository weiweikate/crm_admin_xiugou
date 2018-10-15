<template>
    <div class="message-tip" @click="closeMask" v-loading="loading">
        <div class="message-wrap">
            <div class="message-content" @click.stop="" v-for="(v,k) in messageArr" :key="k">
                <el-tag type="danger" class="msg-tag">未读</el-tag>
                <div class="msg-title">{{`【${v.title}】`}}</div>
                <div class="msg">{{v.content}}</div>
                <div class="arrow-right">
                    >
                </div>
                <div class="operate">
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
        //  跳转
        goPageAllMsg() {
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
