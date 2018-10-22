<template>
    <div class="found-cate">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card>
            <el-form ref="form" :model="form" inline >
                <el-form-item prop="pubUser" label="编号">
                    <el-input v-model="form.pubUser"></el-input>
                </el-form-item>
                <el-form-item prop="pubUser" label="绑定发布者">
                    <el-input v-model="form.pubUser"></el-input>
                </el-form-item>
                <el-form-item prop="time" label="发布时间">
                    <el-date-picker v-model="form.time" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item prop="pubUser" label="发布人">
                    <el-select v-model="form.pubUser">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="正常" value="1"></el-option>
                        <el-option label="已停用" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary">查询</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin-top: 10px">
            <el-button type="primary" style="margin-bottom: 10px" @click="$router.push('addFound')">新建发现文章</el-button>
            <el-table :data="tableData" border stripe @sort-change="sortChange">
                <el-table-column prop="id" label="编号" align="center"></el-table-column>
                <el-table-column prop="id" label="内容" align="center"></el-table-column>
                <el-table-column prop="id" label="绑定发布者" align="center"></el-table-column>
                <el-table-column prop="id" label="浏览量" sortable align="center"></el-table-column>
                <el-table-column prop="id" label="收藏数" sortable align="center"></el-table-column>
                <el-table-column prop="id" label="点赞数" sortable align="center"></el-table-column>
                <el-table-column prop="id" label="推广入口" align="center"></el-table-column>
                <el-table-column prop="id" label="发布时间/发布人" align="center">
                    <template slot-scope="scope">
                        <span>2018-08-19 12:34:42</span><br>
                        <span>客服小王</span>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="操作" align="center" min-width="150px">
                    <template slot-scope="scope">
                        <el-button type="primary">开启</el-button>
                        <el-button type="warning" @click="editFound(scope.row)">编辑</el-button>
                        <el-button type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    :page-size="page.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http';
    export default {
        mixins: [myMixinTable],
        components: { vBreadcrumb },
        data() {
            return {
                nav: ['运营管理', '发现管理', '发现列表'],
                tableData: [{ id: 1, imgUrl: 'https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/TB2mMgxiIyYBuNkSnfoXXcWgVXa_!!2867551008.jpg' }],
                form: {
                    pubUser: '',
                    time: []
                }
            };
        },
        methods: {
            sortChange({ column, prop, order }) {
                console.log(column, prop, order);
            },
            // 编辑
            editFound(row) {
                sessionStorage.setItem('foundId', row.id);
                this.$router.push({ name: 'addFoundCategory', query: { 'foundId': row.id }});
            }
        }
    };
</script>

<style lang="less" scoped>
    .found-cate{
        img {
            width: 50px;
            height: 50px;
            border-radius: 5px;
        }
        .block {
            float: right;
            margin: 10px 0;
        }
    }
</style>
