<template>
    <div class="scratch-cards">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="mb10">
            <el-form :model="form" ref="form" inline label-width="120px">
                <el-form-item prop="id" label="编号">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item prop="createUser" label="创建人">
                    <el-select v-model="form.createUser">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(v, k) in createUserArr" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="createTime" label="创建时间">
                    <el-date-picker type="datetimerange" v-model="form.createTime" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item prop="cardName" label="刮刮卡名称">
                    <el-input v-model="form.cardName"></el-input>
                </el-form-item>
                <el-form-item prop="updateName" label="修改人">
                    <el-select v-model="form.updateName">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(v, k) in createUserArr" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="updateTime" label="修改时间">
                    <el-date-picker type="datetimerange" v-model="form.updateTime" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button @click="getList(1)" type="primary">查 询</el-button>
                    <el-button @click="$refs['form'].resetFields()" >重 置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
            <el-button type="primary" class="mb10" @click="$router.push('cardMange')">新增刮刮卡</el-button>
            <el-table :data="tableDate" border stripe>
                <el-table-column prop="id" label="编号" align="center"></el-table-column>
                <el-table-column prop="id" label="刮刮卡名称" align="center"></el-table-column>
                <el-table-column prop="id" label="奖项数" align="center"></el-table-column>
                <el-table-column prop="id" label="奖品发放数" align="center"></el-table-column>
                <el-table-column prop="id" label="剩余数量" align="center"></el-table-column>
                <el-table-column prop="id" label="当前活动使用数" align="center">
                    <template slot-scope="scope">
                        <el-tag style="cursor: pointer" @click="showUse(scope.row)">{{scope.row.id}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="状态" align="center"></el-table-column>
                <el-table-column prop="id" label="创建人/创建时间" align="center"></el-table-column>
                <el-table-column prop="id" label="修改人/修改时间" align="center"></el-table-column>
                <el-table-column prop="id" label="操作" align="center" width="320px">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="showTip(scope.row.id, '2')">暂 停</el-button>
                        <el-button type="warning" @click="editCard(scope.row.id)">编 辑</el-button>
                        <el-button type="success" @click="showTip(scope.row.id, '4')">详 情</el-button>
                        <el-button type="danger" @click="showTip(scope.row.id, '3')">删 除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                    background
                    :page-size="page.pageSize"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </div>
        </el-card>
        <toask ref="toask"></toask>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
    import toask from './components/toask';
    export default {
        mixins: [myMixinTable],
        components: { vBreadcrumb, toask },
        data() {
            return {
                nav: ['运营管理', '营销工具管理', '刮刮卡'],
                form: {
                    id: '',
                    createUser: '',
                    createTime: [],
                    cardName: '',
                    updateName: '',
                    updateTime: []
                },
                createUserArr: [
                    { label: '张三', value: '1' }
                ],
                tableDate: [{ id: 1 }]
            };
        },
        methods: {
            getList(val) {

            },
            showTip(id, val) {
                // 1: 开启 2：暂停 3：删除
                this.$refs['toask'].status = val;
                this.$refs['toask'].id = id;
                this.$refs['toask'].toask = true;
            },
            editCard(id) {
                sessionStorage.setItem('cardId', id);
                this.$router.push({ name: 'cardMange', query: { cardId: id }});
            },
            showUse(row) {
                this.$router.push({ name: 'activityUse', query: { activityUseId: row.id }});
            }
        }
    };
</script>

<style lang="less" scoped>
.scratch-cards{}
</style>
