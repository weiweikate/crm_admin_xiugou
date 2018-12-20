<template>
    <div class="pwd-mask">
        <div class="box">
            <div class="mask-title">编辑渠道</div>
            <div class="mask-content">
                <el-form :model="form" label-width="80px">
                    <el-form-item label="渠道名称">
                        <el-input v-model="form.name" placeholder="请输入渠道名称" size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用">
                        <el-select v-model="form.status">
                            <el-option value="1" label="是"></el-option>
                            <el-option value="2" label="否"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="submit-btn">
                        <el-button type="primary" @click="submitForm('form')">确认</el-button>
                        <el-button @click="closeToask">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import icon from "../../../common/ico";
import * as api from '../../../../api/api.js';
import * as pApi from '../../../../privilegeList/index.js';
export default {
  props:['row'],
  components: {
    icon
  },
  data() {
    return {
      form: {
        id:'',
        name:'',
        status:''
      }
    };
  },
  mounted(){
    this.form.name = this.row.name;
    this.form.status = this.row.status.toString();
    this.form.id = this.row.id;
  },
  methods:{
    //  取消弹窗
    closeToask(){
      this.$emit('status',false);
    },
    // 提交表单
    submitForm(form){
        if(this.form.name == ''){
            this.$message.warning('请输入渠道名称！');
            return;
        }
        let data = {};
        data.name = this.form.name;
        data.status = this.form.status;
        data.id = this.form.id;
        data.url = pApi.updatePermitChannel_1;
        this.$axios
        .post(api.updatePermitChannel, data)
        .then(res => {
          if(res.data.code == 200){
            this.$message.success(res.data.msg);
            this.closeToask();
          }else{
            this.$message.warning(res.data.msg);
          }   
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="less" scoped>
.pwd-mask {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  .box {
    width: 530px;
    height: 275px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    .mask-title {
      width: 100%;
      height: 56px;
      border-bottom: 1px solid #ccc;
      padding-left: 45px;
      box-sizing: border-box;
      line-height: 56px;
      color: #ff6868;
      font-weight: 700;
    }
    .mask-content {
        position: relative;
        width: 100%;
        height: 218px;
        overflow: hidden;
        padding: 30px 45px 0 45px;
        box-sizing: border-box;
        .submit-btn {
            margin-top:40px;
            padding-left: 225px;
            box-sizing: border-box;
        }
    }
  }
}
</style>


