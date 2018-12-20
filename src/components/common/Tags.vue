<template>
    <div class="tags" v-if="showTags">
        <ul>
            <li @click="checkout(tagsList)" class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
                <!--<router-link :to="item.path" class="tags-li-title">-->
                    <!--{{item.title}}-->
                <!--</router-link>-->
                <span class="tags-li-title" @click="$router.push({path: item.path,query: item.query })">
                    {{item.title}}
                </span>
                <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
            </li>
        </ul>
        <div class="tags-close-box" v-if="showOthers">
            <el-dropdown @command="handleTags">
                <el-button style="background-color:#f56c6c;border-color:#f56c6c" size="mini" type="primary">
                    标签选项<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu size="small" slot="dropdown">
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                    <el-dropdown-item v-for="(v,k) in extraLst" :key="k" :command="'extra-'+v.path">{{v.title}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tagsList: [],
                extraLst: [],
                showOthers: false
            };
        },
        methods: {
            isActive(path) {
                return path === this.$route.path;
            },
            // 关闭单个标签
            closeTags(index) {
                const delItem = this.tagsList.splice(index, 1)[0];
                const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
                if (item) {
                    this.$router.push({ path: item.path, query: item.query }) && delItem.path === this.$route.path;
                } else {
                    this.$router.push('/dashboard');
                }
            },
            // 关闭全部标签
            closeAll() {
                this.tagsList = [];
                this.$router.push('/dashboard');
            },
            // 关闭其他标签
            closeOther() {
                const curItem = this.tagsList.filter(item => {
                    return item.path === this.$route.path;
                });
                this.tagsList = curItem;
            },
            // 设置标签
            setTags(route) {
                let index = 0;
                const isExist = this.tagsList.some((item, key) => {
                    index = key;
                    return item.path === route.path;
                });
                if (!isExist) {
                    this.tagsList.push({
                        title: route.meta.title,
                        name: route.name,
                        path: route.path,
                        query: route.query
                    });
                } else {
                    if (Object.keys(route.query).length !== 0) {
                        this.tagsList[index].query = route.query;
                    }
                }
                if (!isExist && this.tagsList.length > 11) {
                    this.showOthers = true;
                    this.extraLst.push({
                        title: route.meta.title,
                        name: route.name,
                        path: route.path,
                        query: route.query
                    });
                }
            },
            handleTags(command) {
                if (command === 'other') {
                    this.closeOther();
                    this.extraLst = [];
                } else if (command === 'all') {
                    this.closeAll();
                    this.extraLst = [];
                } else {
                    const path = command.split('-')[1];
                    this.$router.push(path);
                }
            },
            checkout(row) {
                if (row.length <= 11) {
                    this.extraLst = [];
                }
            }
        },
        computed: {
            showTags() {
                return this.tagsList.length > 0;
            }
        },
        watch: {
            $route(to, from) {
                this.setTags(to);
            }
        },
        created() {
            this.setTags(this.$route);
        }
    };

</script>


<style>
    .tags {
        position: relative;
        height: 30px;
        overflow: hidden;
        /*background: white;*/
        padding-right: 120px;
    }

    .tags ul {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }

    .tags-li {
        float: left;
        margin: 3px 5px 2px 3px;
        border-radius: 3px;
        font-size: 12px;
        overflow: hidden;
        cursor: pointer;
        height: 23px;
        line-height: 23px;
        background-color: #f56c6c;
        border-color: #f56c6c;
        padding: 0 5px 0 12px;
        vertical-align: middle;
        color: #fff;
        -webkit-transition: all .3s ease-in;
        -moz-transition: all .3s ease-in;
        transition: all .3s ease-in;
    }

    /*.tags-li:not(.active):hover {*/
        /*background: #f8f8f8;*/
    /*}*/

    .tags-li.active {
        color: #ff6868;
        border: 1px solid #e9eaec;
        background: #fff;
    }

    .tags-li-title {
        float: left;
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
        color: #fff;
    }

    .tags-li.active .tags-li-title {
        color: #ff6868;
    }

    .tags-close-box {
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-top: 1px;
        text-align: center;
        width: 110px;
        height: 30px;
        /*background: #fff;*/
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
        z-index: 10;
    }

</style>
