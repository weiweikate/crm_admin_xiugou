<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <!-- <v-tags></v-tags> -->
            <div class="content">
                <transition name="move" mode="out-in">
                    <router-view v-if="$route.meta.noKeepAlive"></router-view>
                    <keep-alive v-else>
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </div>
            <!-- <v-footer></v-footer> -->
        </div>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import bus from '../common/bus';
import vFooter from './Footer.vue';
export default {
    data() {
        return {
            collapse: false
        };
    },
    components: {
        vHead,
        vSidebar,
        vTags,
        vFooter
    },
    created() {
        bus.$on('collapse', msg => {
            this.collapse = msg;
        });
    }
};
</script>
<style scoped>
</style>

