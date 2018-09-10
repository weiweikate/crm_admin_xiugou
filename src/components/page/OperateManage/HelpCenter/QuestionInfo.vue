<template>
  <div class="question-info">
      <v-breadcrumb :nav='nav'></v-breadcrumb>
      <el-card :body-style="{ padding: '20px' }">
          <h2>问题标题：{{title}}</h2>
          <h2 style="margin-top:20px">问题内容：</h2>
          <p class="question-content" v-html="content"></p>
      </el-card>

  </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import request from '@/http/http.js';

export default {
    components: { vBreadcrumb },

    data() {
        return {
            nav: ['帮助中心管理', '问题管理', '产看问题'],
            questionId: '',
            title: '',
            content: ''
        };
    },

    activated() {
        this.questionId = this.$route.query.questionInfo || sessionStorage.getItem('questionInfo');
        this.getList();
    },

    methods: {
        getList() {
            const data = {
                id: this.questionId
            };
            request.findHelpQuestionById(data).then(res => {
                this.title = res.data.title || '';
                this.content = res.data.content || '';
            }).catch(error => {
                console.log(error);
            });
        }
    }
};
</script>
<style lang='less' scoped>
.question-info {
  .question-content {
    padding-left: 105px;
    box-sizing: border-box;
  }
}
</style>
