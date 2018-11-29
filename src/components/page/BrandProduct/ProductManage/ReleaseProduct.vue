<template>
    <div class="select-prod-cate">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card style="min-height: 75vh">
            <div class="search">
                <span class="search-title">您当前选择的分类是：</span>
                <el-cascader class="search-inp" :options="itemList" filterable placeholder="选择或者搜索分类" v-model="content"></el-cascader>
                <el-button type="success" @click="getAllItem">获取所有分类</el-button>
                <p class="operate-btn">
                    <el-button type="primary" @click="nextSage">下一步,编辑商品信息</el-button>
                    <el-button @click="content = []">取消</el-button>
                </p>
            </div>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import request from '@/http/http';
export default {
    components: {
        vBreadcrumb
    },
    data() {
        return {
            nav: ['品牌产品管理', '产品管理', '发布商品'],
            loading: false,
            itemList: [],
            content: []
        };
    },

    computed: {
        selectedItem() {
            const arr = [];
            this.itemList.forEach(v => {
                if (this.content[0] == v.value) arr.push({ type: '1', label: v.label, value: v.value });
                v.children.forEach(v1 => {
                    if (this.content[1] == v1.value) arr.push({ type: '2', label: v1.label, value: v1.value });
                    v1.children.forEach(v2 => {
                        if (this.content[2] == v2.value) arr.push({ type: '3', label: v2.label, value: v2.value });
                    });
                });
            });
            return arr;
        }
    },

    mounted() {
        this.getAllItem();
    },

    methods: {
        // 获取所有分类
        getAllItem() {
            this.loading = true;
            request.getAllProductCategory({}).then(res => {
                this.loading = false;
                const firstList = res.data.firstList || [];
                const secList = res.data.secList || [];
                const thirdList = res.data.thirdList || [];
                firstList.forEach(v => {
                    this.itemList.push({ label: v.name, value: v.id, children: [] });
                });
                secList.forEach(v => {
                    for (let i = 0; i < this.itemList.length; i++) {
                        if (v.fatherId == this.itemList[i].value) {
                            this.itemList[i].children.push({ label: v.name, value: v.id, children: [] });
                        }
                    }
                });
                thirdList.forEach(v => {
                    for (let i = 0; i < this.itemList.length; i++) {
                        if (this.itemList[i].children.length == 0) { continue; }
                        for (let j = 0; j < this.itemList[i].children.length; j++) {
                            if (v.fatherId == this.itemList[i].children[j].value) {
                                this.itemList[i].children[j].children.push({ label: v.name, value: v.id });
                            }
                        }
                    }
                });
            }).catch(err => {
                this.loading = false;
                console.log(err);
            });
        },
        // 下一步
        nextSage() {
            if (this.content.length === 0) return this.$message.warning('请选择产品分类!');
            this.$router.push({ name: 'editProductInfo', query: { cate: JSON.stringify(this.selectedItem) }});
        }
    }
};
</script>
<style lang='less' scoped>
    .select-prod-cate {
        .search{
            text-align: center;
            margin: 30px;
            > .search-title{
                font-size: 20px;
                font-weight: 900;
            }
            & .search-inp {
                width: 20vw;
            }
            & /deep/.el-input-group__append, .el-input-group__prepend{
                color: #fff;
                background-color: #33b4ff;
            }
        }
        .operate-btn{
            text-align: center;
            margin-top: 50px;
        }
    }
</style>
