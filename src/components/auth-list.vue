<template>
    <div class="auth-wrap">
        <el-tree
            class="auth-tree"
            :data="list"
            :show-checkbox="!disabled"
            ref="tree"
            @check="onCheckChange"
            :default-expanded-keys="expandedKeys"
            node-key="name">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{data.title}} <el-tag type="danger" size="mini" v-if="data.note">{{data.note}}</el-tag></span>
                <el-tag :type="renderType(data)" size="mini">{{data | renderTag}}</el-tag>
            </span>
        </el-tree>
    </div>
</template>
<script>
    const defAuthlist = require('@/auth.json');
    const AUTH_KEYS = [];

    function filterAsyncRouter(routes, admin, callback) {
        const res = [];
        const len = routes.length;
        for (let i = 0; i < len; i++) {
            const tmp = { ...routes[i] };
            const needAuth = tmp.roles && tmp.roles.includes('admin');
            tmp.note = needAuth ? '机密模块' : '';
            callback && callback(tmp);
            if (!needAuth || admin) {
                if (tmp.children) {
                    tmp.children = filterAsyncRouter(tmp.children, admin, callback);
                }
                res.push(tmp);
            }

        }
        return res;
    }

    export default {
        name: 'AuthList',
        props: {
            auth: '',
            disabled: false
        },
        data() {
            return {
                expandedKeys: [],
                list: []
            };
        },
        filters: {
            renderTag(data) {
                if (data.type === 'menu') {
                    return '菜单';
                } else if (data.type === 'catalog') {
                    return '目录';
                } else if (data.name.indexOf('.') === -1 || data.type === 'page') {
                    return '页面';
                } else {
                    return '按钮';
                }
            }
        },
        mounted() {
            const roles = this.$store.getters.roles;
            const isAdmin = roles.includes('admin');
            const expandedKeys = [];
            const authList = filterAsyncRouter(defAuthlist, isAdmin, function (item) {
                if (item.type === 'catalog') {
                    expandedKeys.push(item.name);
                }
                AUTH_KEYS.push(item.name);
            });
            this.expandedKeys = expandedKeys;
            this.list = authList;
        },
        methods: {
            onCheckChange(node, status) {
                let checkedKeys = status.checkedKeys;
                let halfCheckedKeys = status.halfCheckedKeys;
                const keys = halfCheckedKeys.concat(checkedKeys);
                this.$emit('message', keys.join(','));
            },
            renderType(data) {
                if (data.type === 'menu') {
                    return 'success';
                } else if (data.type === 'page') {
                    return 'info';
                } else if (data.type === 'catalog') {
                    return '';
                } else {
                    return 'warning';
                }
            },
            // 手动更新权限check状态
            updateStatus(auth) {
                const map = {};
                const keys = auth.split(',');
                const noCheckedKeys = [];
                keys.forEach((key) => {
                    map[key] = 1;
                });
                AUTH_KEYS.forEach((key) => {
                    if (!map[key]) {
                        noCheckedKeys.push(key);
                    }
                });
                this.$refs.tree.setCheckedKeys(keys);
                noCheckedKeys.forEach((key) => {
                    this.$refs.tree.setChecked(key, false, false);
                });
            }
        }
    };
</script>

<style scoped lang="less">
    .auth-tree {
        width: 800px;

        /deep/ .el-tree-node {
            margin: 5px 0;
        }
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

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
