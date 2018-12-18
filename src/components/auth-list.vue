<template>
    <div class="auth-wrap">
        <ul class="auth-list">
            <li class="auth-item" v-for="(item,index) in list" :key="item.name">
                <div class="auth-title first">
                    <el-checkbox border size="medium" @change="checked=>editAuth(checked, null, item, item.children)"
                                 :label="item.title" :value="item.checked"></el-checkbox>
                </div>
                <div class="auth-content">
                    <ul class="auth-list">
                        <li class="auth-item second" v-for="(son,index) in item.children" :key="son.name">
                            <div class="auth-title">
                                <el-checkbox @change="checked=>editAuth(checked, item, son, son.children)"
                                             :label="son.title + ' : '" :value="son.checked"></el-checkbox>
                            </div>
                            <div class="auth-content" style="">
                                <ul class="auth-list">
                                    <li class="auth-item third" v-for="(grandson,index) in son.children"
                                        :key="grandson.name">
                                        <div class="auth-title">
                                            <el-checkbox @change="checked=>editAuth(checked, son, grandson, null, item)"
                                                         :label="grandson.title"
                                                         :value="grandson.checked"></el-checkbox>
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

    function changeStatus(auth, list) {
        const res = [];
        if (!list.length) {
            return list;
        }
        list.forEach(item => {
            if (auth.includes(item.name)) {
                item.checked = true;
            } else {
                item.checked = false;
            }
            changeStatus(auth, item.children || []);
        });

        return res;
    }

    export default {
        name: 'AuthList',
        props: {
            auth: ''
        },
        data() {
            return {
                list: []
            };
        },
        mounted() {
            this.list = this.dealAuth(defAuthlist);
        },
        methods: {
            // 手动更新权限check状态
            updateStatus(auth) {
                changeStatus(auth.split(','), this.list);
                this.addAuth();
            },
            // 渲染权限列表
            dealAuth(list) {
                if (!list || list.length === 0) return list;
                list.forEach(item => {
                    item.checked = false;
                    if (item.name == 'labelManage') { console.log(item.children); }
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
            },
            //  添加权限key值
            addAuth() {
                const hasAuthMap = {};
                let result = true;
                this.list.forEach(first => {
                    if (first.checked) {
                        hasAuthMap[first.name] = 1;
                    }
                    if (first.children && first.children.length !== 0) {
                        result = first.children.some(item => {
                            return item.checked === true;
                        });
                        // 如果二级有选中则添加一级权限
                        if (result) {
                            hasAuthMap[first.name] = 1;
                        }
                        first.children.forEach(second => {
                            if (second.checked) {
                                hasAuthMap[second.name] = 1;
                            }
                            if (second.children && second.children.length !== 0) {
                                result = second.children.some(item => item.checked === true);
                                // 如果三级有选中则添加二级权限添加一级权限
                                if (result) {
                                    hasAuthMap[second.name] = 1;
                                    hasAuthMap[first.name] = 1;
                                }
                                second.children.forEach(third => {
                                    if (third.checked) {
                                        hasAuthMap[third.name] = 1;
                                    }
                                });
                            }
                        });
                    }
                });
                const tmp = [];
                for (const key in hasAuthMap) {
                    tmp.push(key);
                }
                this.$emit('message', tmp.join(','));
            },
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
