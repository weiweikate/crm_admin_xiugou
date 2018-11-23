<template>
    <div class="auth-wrap">
        <ul class="auth-list">
            <li class="auth-item" v-for="(item,index) in list" :key="item.name">
                <div class="auth-title first">
                    <el-checkbox border size="medium" @change="checked=>editAuth(checked, null, item, item.children)" :label="item.title" :value="item.checked"></el-checkbox>
                </div>
                <div class="auth-content">
                    <ul class="auth-list">
                        <li class="auth-item second" v-for="(son,index) in item.children" :key="son.name">
                            <div class="auth-title">
                                <el-checkbox @change="checked=>editAuth(checked, item, son, son.children)" :label="son.title + ' : '" :value="son.checked"></el-checkbox>
                            </div>
                            <div class="auth-content" style="">
                                <ul class="auth-list">
                                    <li class="auth-item third" v-for="(grandson,index) in son.children"
                                        :key="grandson.name">
                                        <div class="auth-title">
                                            <el-checkbox @change="checked=>editAuth(checked, son, grandson, null, item)" :label="grandson.title" :value="grandson.checked"></el-checkbox>
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
    const defAuthlist = require('@/auth.json');
    export default {
        name: 'AuthList',
        data() {
            return {
                list: [],
                hasAutgList: []
            };
        },
        computed: {
        },
        mounted() {
            this.list = this.dealAuth(defAuthlist);
        },
        methods: {
            // 渲染权限列表
            dealAuth(list) {
                if (!list || list.length === 0) return list;
                list.forEach(item => {
                    item.checked = false;
                    this.dealAuth(item.children);
                });
                return list;
            },
            // 添加/删除权限
            editAuth(status, parent, self, son, grand) {
                self.checked = status;
                // 判断父级元素
                if (parent && parent.length !== 0) {
                    parent.checked = parent.children.every(v => {
                        return v.checked;
                    });
                    if (grand) {
                        grand.checked = grand.children.every(v => {
                            return v.checked;
                        });
                    }
                }
                // 判断子类元素
                if (son) {
                    son.forEach(v => {
                        v.checked = status;
                        if (v.children && v.children.length !== 0) {
                            v.children.forEach(v1 => {
                                v1.checked = status;
                            });
                        }
                    });
                }
                this.addAuth();
                console.log(this.hasAutgList);
            },
            //  添加权限key值
            addAuth() {
                this.hasAutgList = [];
                this.list.forEach(first => {
                    if (first.checked) this.hasAutgList.push(first.name);
                    if (first.children && first.children.length !== 0) {
                        first.children.forEach(second => {
                            if (second.checked) this.hasAutgList.push(second.name);
                            if (second.children && second.children.length !== 0) {
                                second.children.forEach(third => {
                                    if (third.checked) this.hasAutgList.push(third.name);
                                });
                            }
                        });
                    }
                });
                this.$emit('message',this.hasAutgList);
            }
        }
    };
</script>

<style scoped lang="less">
    .auth-wrap {
        padding: 10px;
        ul, li {
            list-style: none;
        }
        .auth-title.first {
            padding-top: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #ddd;


        }

        .auth-item.second {
            overflow: hidden;
            padding: 15px 0;

            > .auth-title {
                float: left;
                width: 200px;
                font-weight: bold;
            }
            > .auth-content {
                margin-left: 200px;
            }
            .auth-item.third {
                display: inline-block;
                vertical-align: middle;
                width: 200px;
                margin: 0 15px 5px 0;

                > .auth-title {
                    color: #6f7180;
                }
            }
        }
    }
</style>
