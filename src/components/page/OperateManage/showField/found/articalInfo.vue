<template>
    <div class="artical-info">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
            <el-form label-width="100px" label-position="left">
                <el-form-item label="编号:">
                    <span>{{form.code}}</span>
                </el-form-item>
                <el-form-item label="绑定发布者:">
                    <span>{{form.nickName}}</span>
                </el-form-item>
                <el-form-item label="内容:">
                    <div v-html="form.content"></div>
                </el-form-item>
                <el-form-item>
                    <span slot="label" style="color: #33b4ff">商品推广</span>
                    <div class="product" v-for="(v, k) in form.discoverArticleProductList">
                        <img :src="v.img" alt="">
                        <div class="product-info">
                            <p>{{v.name}}</p>
                            <p>
                                <span>${{v.price}}</span>
                                <icon class="cart" ico='icon-product-cart' />
                            </p>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import icon from '@/components/common/ico';
import request from '@/http/http';
export default {
    components: {
        vBreadcrumb,
        icon
    },
    data() {
        return {
            nav: ['运营管理', '秀场管理', '查看'],
            id: '',
            form: {}
        };
    },
    activated(){
        this.id = this.$route.query.foundInfoId || sessionStorage.getItem('foundInfoId');
        this.getInfo();
    },
    methods: {
        getInfo(){
            request.findDiscoverArticleById({id: this.id}).then(res=>{
                this.form = res.data;
            }).catch(err=>{
                console.log(err);
            })
        }
    }
};
</script>

<style scoped lang="less">
.artical-info {
    .product{
        display: flex;
        margin-bottom: 10px;
        & img{
            width: 100px;
            height: 100px;
            border-radius: 10px;
        }
        .product-info{
            position: relative;
            margin-left: 10px;
            padding: 10px 0;
            box-sizing: border-box;
            display: flex;
            width: 200px;
            height: 100px;
            flex-direction: column;
            justify-content: space-between;
            word-wrap: break-word;
            word-break: normal;
            p {
                font-size: 14px;
                line-height: 1em;
                .cart{
                    position: absolute;
                    right: 5px;
                    bottom: 10px;
                    font-size: 26px;
                }
                span{
                    color: red;
                }
            }
        }
    }
    .product:first-child{
        margin-top: 40px;
    }
}
</style>
