<template>
    <div class="breadcrumb">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item class="bread-item" v-for="(item,index) in nav" :key="index"><icon class="ico" v-if="index == 0" ico="icon-dingwei1" />{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="now-date">
            <span style="color: red">{{version}}</span>
          {{time}}
        </div>
    </div>
</template>
<script>
import icon from './ico';
import moment from 'moment';
export default {
    props: ['nav'],
    components: {
        icon
    },
    data() {
        return {
            time: '',
            version: ''
        };
    },
    created() {
        this.version = VERSION;
        this.timeDown();
    },
    methods: {
        timeDown() {
            const that = this;
            clearInterval(timer);
            var timer = setInterval(function() {
                const nowDate = new Date();
                that.time = moment(nowDate).format('YYYY年MM月DD日') + ' ' + moment(nowDate).format('HH:mm:ss');
            }, 1000);
        }
    }
};
</script>
<style lang="less" scoped>
.breadcrumb {
  position: absolute;
  width: 100%;
  top: 0px;
  left: 0px;
  height: 30px;
  overflow: hidden;
  background: white;
  padding-left:40px;
  box-sizing:border-box;
}
.bread-item {
  line-height: 30px;
}
.ico {
    margin-right:5px;
    color:#33b4ff;
    font-size:18px;
}
.now-date{
  position: absolute;
  top: 0px;
  right: 45px;
  font-size: 14px;
  line-height: 30px;
}
</style>


