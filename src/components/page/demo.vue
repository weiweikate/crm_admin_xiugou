<template>
  <div>
      <el-button @click="geInfo" type="success">demo</el-button>
  </div>
</template>

<script>
// import * as api from '@/http/http.js'
import request from '@/http/http.js';
export default {
    components: {},

    data() {
        return {
        };
    },

    methods: {
        geInfo() {
            request.LOGIN({ name: 'asdasd' }).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
        }
    }
};

</script>
<style lang='less' scoped>
</style>
