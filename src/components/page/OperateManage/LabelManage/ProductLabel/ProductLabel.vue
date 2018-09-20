<template>
    <div class="second-classify">
        <v-breadcrumb :nav="['运营管理','标签管理','产品品类']"></v-breadcrumb>
        <div class="table-block">
            <el-button type="primary" style="margin-bottom: 20px" @click="productLabelClassify">产品标签类型设置</el-button>
            <template>
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column type="id" label="ID" align="center"></el-table-column>
                    <el-table-column prop="param" label="品类" align="center"></el-table-column>
                    <el-table-column label="图标" align="center">
                        <template slot-scope="scope">
                            <img :src="scope.row.img" alt="">
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作" align="center">
                        <template slot-scope="scope">
                            <!--<el-button type="danger" size="small" @click="delItem(scope.row.id)">删除</el-button>-->
                            <el-button type="primary" size="small" @click="toSecondClassify(scope.row.id)">二级类目</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>

        </div>

    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import icon from '@/components/common/ico.vue';
import utils from '@/utils/index.js';
import * as pApi from '@/privilegeList/index.js';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';

export default {
    components: {
        vBreadcrumb,
        icon,
    },
    mixins: [myMixinTable],
    data() {
        return {

            tableData: [],
            // 类目类型
            type: '',
            height: '',
        };
    },
    created() {
    },
    activated() {
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取列表
        getList(val) {
            request.querySysTagLibraryList({}).then(res => {
                this.tableData = [];
                this.tableData = res.data;
            }).catch(error => {
                console.log(error);
            });
        },
        // 产品标签类型设置
        productLabelClassify() {
            this.$router.push('/productLabelClassify');
        },
        // 二级类目
        toSecondClassify(id){
            this.$router.push('/secondClassify');
        }
    }
};
</script>

<style lang="less">
    .second-classify {
        /*表格样式*/
        .table-block {
            padding: 20px 20px 60px;
            background: #fff;
        }
        img {
            width: 38px;
            height: 38px;
            border-radius: 5px;
            vertical-align: middle;
        }
        .block {
            float: right;
            margin-top: 10px;
        }

    }
</style>
