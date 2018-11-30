<template>
    <div class="error-page">
        <div class="error-bg">
            <img src="../../assets/images/common/bg-404.png" alt="">
        </div>
        <div class="error-code">
            <img src="../../assets/images/common/404.png" alt="">
        </div>
        <div class="error-desc">抱歉，您暂无权限访问此页面</div>
        <div class="error-handle">
            <router-link to="/dashboard">
                <el-button type="primary" size="large">返回首页</el-button>
            </router-link>
            <el-button class="error-btn" type="primary" size="large" @click="logout">退出登录</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            goBack() {
                this.$router.go(-1);
            },
            logout() {
                this.$store.dispatch('LogOut').then(() => {
                    location.href = location.protocol + '//' + location.host;
                });
            }
        }
    };
</script>


<style lang="less">
    .error-page {
        padding: 50px;
        width: 100%;
        height: 100%;
        background: #f3f3f3;
        text-align: center;
    }

    .error-bg {
        margin-bottom: 20px;
        img {
            width: 500px;
        }
    }

    .error-code {
        margin-bottom: 20px;
        img {
            width: 150px;
        }

    }

    .error-code span {
        color: #00a854;
    }

    .error-desc {
        font-size: 30px;
        color: #777;
    }

    .error-handle {
        margin-top: 30px;
        padding-bottom: 200px;
    }

    .error-btn {
        margin-left: 100px;
    }
</style>
