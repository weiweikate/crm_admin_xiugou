<template>
    <div v-show="show" class="message-tip" @click="closeMask">
        <div class="message-wrap">
            <div class="message-content" @click.stop="" v-for="(v,k) in messageArr" :key="k">
                <el-tag class="msg-tag">{{v.read}}</el-tag>
                <div class="msg-title">{{`【${v.type}】`}}</div>
                <div class="msg">{{v.content}}</div>
                <div class="arrow-right">
                    >
                </div>
                <div class="operate">
                    <span>{{v.status}}</span>
                </div><br/>
                <div class="time">
                    {{v.time}}
                </div>
            </div>
            <div class="show-more">
                查看更多
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                messageArr: [
                    {status: '11212121', read: '1', type: '1', content: '有1个商品库存已低于100，请即时补充库存有1个商品库存已低于100，请即时补充库存', time: '123456789'},
                    {status: '1', read: '1', type: '1', content: '有1个商品库存已低于100，请即时补充库存有1个商品库存已低于100，请即时补充库存', time: '123456789'}
                ],
                show: true
            };
        },
        activated() {

        },
        methods: {
            // 关闭遮罩层
            closeMask() {
                this.show = false;
            }
        }
    };
</script>

<style lang="less" scoped>
.message-tip{
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
        }
    }
}
</style>
