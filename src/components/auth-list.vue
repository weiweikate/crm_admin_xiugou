<template>
    <div class="auth-wrap">
        <ul class="auth-list">
            <li class="auth-item" v-for="(item,index) in list" :key="item.name">
                <div class="auth-title first">
                    <input type="checkbox" v-model='item.checked'>
                    <span>{{item.title}}</span>
                </div>
                <div class="auth-content" style="">
                    <ul class="auth-list">
                        <li class="auth-item second" v-for="(son,index) in item.children" :key="son.name">
                            <div class="auth-title">
                                <input type="checkbox" v-model='son.checked'>
                                <span>{{son.title}} {{son.children?':':''}}</span>
                            </div>
                            <div class="auth-content" style="">
                                <ul class="auth-list">
                                    <li class="auth-item third" v-for="(grandson,index) in son.children"
                                        :key="grandson.name">
                                        <div class="auth-title">
                                            <input type="checkbox" v-model='grandson.checked'>
                                            <span>{{grandson.title}}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                        </li>
                    </ul>
                </div>

            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name:'AuthList',
        data(){
            return {

            }
        },
        props:{
            source: {
                type: Object,
                default: {}
            },
        },
        computed:{
            list(){
                return Object.assign({},this.source)
            }
        },
        mounted(){
            console.log(111,this.list)
        },
        methods: {

        }
    }
</script>

<style scoped lang="less">
.auth-wrap {
    padding: 10px;
    ul , li{
        list-style: none;
    }
    .auth-title.first {
        color: #bbbbbb;
        font-size: 16px;
        padding-top: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid #ddd;
    }

    .auth-item.second {
        overflow: hidden;
        padding: 15px 0;

        > .auth-title {
            float: left;
            width: 100px;
            font-weight: bold;
        }
        > .auth-content {
            margin-left: 100px;
        }
        .auth-item.third {
            display: inline-block;
            vertical-align: middle;
            width: 100px;
            margin: 0 15px 5px 0;

            > .auth-title {
                color: #6f7180;
            }
        }
    }
}
</style>
