<template>
    <div>
        <breadcrumb :nav='breadcrumb'></breadcrumb>
        <el-card>
            <div class="tpl" v-for="(v,k) in data" :key="k">
                <span class='tem-title'>{{v.title}}</span>
                <div class="tem-content"></div>
                <el-button @click="setStatus(v.id,true)" class="tem-btn" type="primary">启用</el-button>
                <el-button @click="setStatus(v.id,false)" class="tem-btn">停用</el-button>
            </div>
        </el-card>
    </div>
</template>
<script>
import breadcrumb from "../../common/Breadcrumb";
export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      breadcrumb: ["授权审核管理", "授权证书模板"],
      data: [
        {
          title: "A模板",
          id: "1",
          url: "aaa"
        },
        {
          title: "B模板",
          id: "2",
          url: "bbb"
        },
      ]
    };
  },
  methods: {
    setStatus(id,status) {
        console.log(id,status)
    }
  }
};
</script>
<style lang="less" scoped>
.tpl {
  position: relative;
  width: 270px;
  height: 460px;
  border-radius: 10px;
  background-color: #eee;
  text-align: center;
  float: left;
  margin:20px;
  .tem-title {
    height: 55px;
    line-height: 55px;
  }
  .tem-content {
    margin: 0 auto;
    width: 220px;
    height: 315px;
    background-color: red;
    margin-bottom: 20px;
  }
  .tem-btn {
    width: 80px;
    height: 38px;
  }
}
</style>


