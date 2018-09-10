<template>
  <div class="add-question ">
    <v-breadcrumb :nav="nav"></v-breadcrumb>
    <el-card :body-style="{ padding: '30px 60px' }">
        <el-form :model="form" label-width="70px">
          <el-form-item label="问题标题">
              <el-input class="input-sty" v-model="form.questionTitle" placeholder="请输入问题标题"></el-input>
          </el-form-item>
          <el-form-item label="通知详情">
            <div style="display: inline-block;width:80%">
                <quill-editor v-model="form.content" ref="myQuillEditor" :options="editorOption" @change="onEditorChange($event)"></quill-editor>
                <el-upload :action="qnLocation" :data="uploadData" :on-success='upScuccess' ref="upload" style="display:none">
                <el-button size="small" type="primary" id="imgInput" element-loading-text="插入中,请稍候">点击上传</el-button>
                </el-upload>
            </div>
          </el-form-item>
          <el-form-item label=" ">
              <el-button type="primary" @click="submitForm">确认保存</el-button>
              <el-button >取消</el-button>
          </el-form-item>
        </el-form>
    </el-card>
  </div>
</template>

<script>
import vBreadcrumb from "@/components/common/Breadcrumb.vue";
import * as api from "@/api/OperateManage/HelpCenter/index.js";
import Quill from "quill";
export default {
  components: { vBreadcrumb },

  data() {
    return {
      nav: ["运营管理", "帮助中心管理", "问题管理", "添加问题"],
      height: "100vh",
      questionTypeId:'',
      form: {
        questionTitle: "",
        content: ""
      },
      editorOption: {
        placeholder: "请输入内容",
        modules: {
          // 配置富文本
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
            ["link", "image"]
          ]
        }
      },
      uploadData: {}
    };
  },
  computed: {
    qnLocation() {
      return api.addImg;
    }
  },
  activated() {
    this.height = window.screen.availHeight - 400;
    this.questionTypeId = this.$route.query.questionTypeId || sessionStorage.getItem('questionTypeId');
    this.form.questionTitle = '';
    this.form.content = '';
  },
  mounted() {
    // 为图片ICON绑定事件 getModule 为编辑器的内部属性
    this.$refs.myQuillEditor.quill
      .getModule("toolbar")
      .addHandler("image", this.imgHandler);
  },
  methods: {
    // 富文本编辑器
    onEditorChange({ editor, html, text }) {
      this.form.content = html;
    },
    // 图片上传成功回调 插入到编辑器中
    upScuccess(e, file, fileList) {
      this.fullscreenLoading = false;
      let vm = this;
      let url = "";
      if (this.uploadType === "image") {
        // 获得文件上传后的URL地址
        url = e.data.imageUrl;
      }
      if (url != null && url.length > 0) {
        // 将文件上传后的URL地址插入到编辑器文本中
        let value = url;
        // this.$refs.myTextEditor.quillEditor.getSelection();
        // 获取光标位置对象，里面有两个属性，一个是index 还有 一个length，这里要用range.index，即当前光标之前的内容长度，然后再利用 insertEmbed(length, 'image', imageUrl)，插入图片即可。
        vm.addRange = vm.$refs.myQuillEditor.quill.getSelection();
        value = value.indexOf("http") !== -1 ? value : "http:" + value;
        vm.$refs.myQuillEditor.quill.insertEmbed(
          vm.addRange !== null ? vm.addRange.index : 0,
          vm.uploadType,
          value,
          Quill.sources.USER
        ); // 调用编辑器的 insertEmbed 方法，插入URL
        this.$message.success("插入成功");
      } else {
        this.$message.error(`${vm.uploadType}插入失败`);
      }
      this.$refs["upload"].clearFiles(); // 插入成功后清除input的内容
    },
    // 点击图片ICON触发事件
    imgHandler(state) {
      this.addRange = this.$refs.myQuillEditor.quill.getSelection();
      if (state) {
        let fileInput = document.getElementById("imgInput");
        fileInput.click(); // 加一个触发事件
      }
      this.uploadType = "image";
    },
    submitForm(){
      let data = {};
      data.title = this.form.questionTitle;
      data.content = this.form.content;
      data.typeid = this.questionTypeId;
      this.$axios.post(api.addHelpQuestion,data)
      .then((res) => {
        this.$message.success(res.data.msg);
        this.$router.push('/questionList');
      }).catch((err) => {
        console.log(err);
      });
    }
  }
};
</script>
<style lang='less'>
.add-question {
  .input-sty {
    width: 210px;
  }

}
</style>