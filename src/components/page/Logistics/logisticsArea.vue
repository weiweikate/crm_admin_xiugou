<template>
    <div>
        <v-breadcrumb :nav="['物流管理','地区列表']"></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }">
            <div class="search">
                <el-form :inline="true" :model="searchFields" class="demo-form-inline" ref="searchForm">
                    <el-form-item label="更新时间">
                        <el-date-picker
                            v-model="searchFields.time"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            format="yyyy/MM/dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="地区名称">
                        <el-input v-model="searchFields.name"></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="searchFields.status">
                            <el-option label="全部" :value="''"></el-option>
                            <el-option label="启用" :value="1"></el-option>
                            <el-option label="停用" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getList">查询</el-button>
                        <el-button @click="searchReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card :body-style="{ padding: '20px 40px'}" style="margin-top: 20px;" v-loading="loading">
            <el-button type="danger" size="big" class="mb20" @click="showDialog('add')">添加地区</el-button>
            <el-button type="default" size="big" class="mb20" @click="openAll">展开地区</el-button>
            <el-button type="default" size="big" class="mb20" @click="closeAll">收起地区</el-button>
            <tree-grid
                class="mb20"
                :items="data"
                :columns="columns"
                :doc="specDoc"
                @toggle-item="toggleItem"
                @on-row-click='rowClick'
                ref="grid"
            ></tree-grid>
        </el-card>



        <el-dialog :title="dialogTitle" :visible.sync="dialog">
            <el-form :model="singleArea" :rules="rules" label-width="120px" label-position="left" ref="ruleArea">
                <el-form-item label="地区名称" prop="name">
                    <el-input v-model="singleArea.name" ></el-input>
                </el-form-item>
                <el-form-item label="上级地区" prop="fatherName">
                    <el-input v-model="singleArea.fatherName" disabled="disabled" placeholder="无需输入，自动获取" ></el-input>
                </el-form-item>
                <el-form-item label="地区属性" prop="district">
                    <!--1.华东 2.华南 3.华中 4. 华北 5.西北 6.西南 7. 东北 8.港澳台 9.海外-->
                    <el-select v-model="singleArea.district">
                        <el-option label="华东" :value="1"></el-option>
                        <el-option label="华南" :value="2"></el-option>
                        <el-option label="华中" :value="3"></el-option>
                        <el-option label="华北" :value="4"></el-option>
                        <el-option label="西北" :value="5"></el-option>
                        <el-option label="西南" :value="6"></el-option>
                        <el-option label="东北" :value="7"></el-option>
                        <el-option label="港澳台" :value="8"></el-option>
                        <el-option label="海外" :value="9"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="singleArea.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import treeGrid from '@/components/common/treeGrid.vue';
    import request from '@/http/http';
    export default {
        name: 'logisticsArea',
        components: {
            vBreadcrumb,
            treeGrid
        },
        data() {
            return {
                dialog: false,
                dialogTitle: '添加地区',
                singleArea: {
                    id: null,
                    name: '',
                    fatherName: '',
                    district: 1,
                    status: 1
                },
                loading: false,
                rules: {
                    name: [
                        { required: true, message: '请输入地区名称', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在1-20个字符', trigger: 'blur' }
                    ]
                },
                searchFields: {
                    time: [],
                    name: '',
                    status: '',
                    start: '',
                    end: ''
                },
                // 表格展示字段相关在这里
                columns: [{
                    title: 'ID',
                    key: 'id'
                }, {
                    title: '地区名称',
                    key: 'name'
                }, {
                    title: '地区属性',
                    key: 'district'
                }, {
                    title: '状态',
                    key: 'status'
                }, {
                    title: '最近更新者',
                    key: 'userAccount'
                }, {
                    title: '更新时间',
                    key: 'updateTime'
                }, {
                    title: '操作',
                    type: 'action',
                    actions: [{
                        type: 'primary',
                        text: '编辑',
                        trigger: 'editArea'
                    }, {
                        type: 'primary',
                        text: '添加下级地区',
                        trigger: 'addArea'
                    }],
                    width: '150'
                }],
                // 表格内容对应表
                specDoc: {
                    status: {
                        0: '停用',
                        1: '启用'
                    },
                    district: {
                        1: '华东',
                        2: '华南',
                        3: '华中',
                        4: '华北',
                        5: '西北',
                        6: '西南',
                        7: '东北',
                        8: '港澳台',
                        9: '海外'
                    }
                },
                data: []
            };
        },
        methods: {
            // 编辑地区
            editArea(index, area, componentData) {
                const parentName = componentData.parent ? componentData.parent.name : '';
                const parentCode = componentData.parent ? componentData.parent.code : 0;
                this.singleArea = Object.assign({}, {
                    id: area.id,
                    name: area.name,
                    fatherName: parentName,
                    fatherCode: parentCode,
                    district: area.district,
                    status: area.status
                });
                this.showDialog('edit');
            },
            // 添加地区、添加下级地区的参数
            addArea(index, area) {
                this.singleArea = Object.assign({}, {
                    id: '',
                    name: '',
                    fatherName: area.name,
                    fatherCode: area.code,
                    district: 1,
                    status: 1
                });
                this.showDialog('more');
            },
            // 启用停用地区
            toggleAreaStatus(index, area) {
                let api = 'disabledArea';
                if (area.status === 0) {
                    api = 'enabledArea';
                }
                request[api]({ ids: area.id }).then(res => {
                    this.getList();
                }).catch(res => {
                    this.$message.warning(res.msg);
                });
            },
            // 弹窗展示
            showDialog(type) {
                this.dialogType = type;
                this.$refs['ruleArea'] && this.$refs['ruleArea'].resetFields();
                if (type === 'add') {
                    this.initAreaParams();
                    this.dialogTitle = '添加地区';
                } else if (type === 'more') {
                    this.dialogTitle = '添加下级地区';
                } else {
                    this.dialogTitle = '编辑地区';
                }
                this.dialog = true;
            },
            // 初始化地区参数
            initAreaParams() {
                this.singleArea = {
                    id: null,
                    fatherName: '',
                    fatherCode: 0,
                    name: '',
                    district: 1,
                    status: 1
                };
            },
            // 添加地区、添加下级地区、编辑地区
            confirm() {
                this.$refs['ruleArea'].validate((valid) => {
                    if (valid) {
                        let api = 'addArea';
                        if (this.dialogType === 'edit') {
                            api = 'editArea';
                        }
                        if (this.singleArea.fatherCode === null) return this.$message.warning('当前添加区域的父级CODE不存在，添加结果会为一级省份级别');
                        request[api](this.singleArea).then(res => {
                            this.$message.success(res.msg);
                            this.dialog = false;
                            this.searchReset();
                        }).catch(res => {
                            this.$message.warning(res.msg);
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 重置搜索参数
            searchReset() {
                this.searchFields = {
                    time: [],
                    name: '',
                    code: '',
                    start: '',
                    end: '',
                    status: ''
                };
                this.getList();
            },
            // 获取地区列表
            getList() {
                const data = {
                    name: this.searchFields.name,
                    status: this.searchFields.status
                };
                data.code = '';
                if (this.searchFields.time && this.searchFields.time.length) {
                    data.start = this.searchFields.time[0];
                    data.end = this.searchFields.time[1];
                }
                this.loading = true;
                request.queryAreaList(data).then(res => {
                    this.data = res.data || [];
                    this.loading = false;
                }).catch(res => {
                    this.loading = false;
                });
            },
            // 展开或收起树
            toggleItem(item, index) {
                // 暂时不显示街道相关的
                if (item.level === 3) return this.$message.warning(`${item.name}无下级地区`);
                const originIndex = this.getToggleItemIndex(this.data, item.id);
                const data = {
                    code: item.code
                };
                this.loading = true;
                request.queryAreaList(data).then(res => {
                    this.loading = false;
                    const data = res.data;
                    //  接口返回所有分支的数据结构中res.data[0].children才是最终需要的结果
                    if (data[0].children && data[0].children.length > 0) {
                        this.data[originIndex].children = this.data[originIndex].children.concat(data[0].children);
                        this.$nextTick(() => {
                            // 获取所有分支后通知组件展开点击的一级项
                            this.$refs['grid'].showItemById(item.id);
                        });
                    } else {
                        this.$message.warning(`${item.name}无下级地区`);
                    }
                }).catch(res => {
                    this.loading = false;
                });
            },
            // 获取展开收起项所在位置 初始一级下没有子项 点击获取所有分支
            getToggleItemIndex(data, targetId) {
                let index = 0;
                for (let i = 0, len = data.length; i < len; i++) {
                    if (data[i].id === targetId) {
                        index = i;
                    }
                }
                return index;
            },
            closeAll() {
                this.$refs['grid'].closeAll();
            },
            openAll() {
                this.$refs['grid'].openAll();
            },
            /**
             *  data 为传进去组件的数据  componentData是组件中处理后的数据
             * */
            rowClick(data, index, componentData, trigger, event) {
                this[trigger](index, data, componentData);
            }
        },
        mounted() {
            this.getList();
        }

    };
</script>
<style lang='less' scoped>
    .mb20 {
        margin-bottom: 20px;
    }
    .pagination .el-pagination{
        text-align: center;
    }
    .t {
        padding-left: 20px;
    }
</style>
