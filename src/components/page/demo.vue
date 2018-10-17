<template>
  <div>
      <el-button @click="geInfo" type="success">demo</el-button>
      <region @regionMsg='getRegion' :regionMsg='address'></region>
  </div>
</template>

<script>
import request from '@/http/http.js';
import region from '@/components/common/Region';
export default {
    components: {region},

    data() {
        return {
            address: []
        };
    },

    methods: {
        geInfo() {
            request.LOGIN({ name: 'asdasd' }).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
        },
        // 获取省市区
        getRegion(msg) {
            this.address = msg;
            console.log(this.address);
        }
    }
};

</script>
<style lang='less' scoped>
</style>
