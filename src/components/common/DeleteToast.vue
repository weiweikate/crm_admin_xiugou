<template>
    <div class="pwd-mask">
        <div class="box">
            <div class="mask-title"><icon class="ico" ico='icon-jinggao'/>  温馨提示</div>
            <div class="mask-content">
               <span class="del-tip">是否确认{{title}}</span>
               <div class="del-btn-group">
                    <el-button :loading="btnLoading" @click="closeToask(true)" class="del-btn" type="danger">确认{{title}}</el-button>
                    <el-button @click="closeToask(false)">取消</el-button>
               </div>
            </div>
        </div>
    </div>
</template>
<script>
import icon from './ico';
import request from '@/http/http.js';
export default {
    props: {
        tip: '',
        id: {
            require: true
        },
        url: {
            require: true
        },
        status: {},
        isTopic: {}
    },
    components: {
        icon
    },
    computed: {
        title() {
            return this.tip === undefined ? '删除' : this.tip;
        }
    },
    data() {
        return {
            btnLoading: false
        };
    },
    methods: {
    //  取消弹窗
        closeToask(status) {
            if (status === true) {
                const that = this;
                that.btnLoading = true;
                const url = that.url;
                const data = {};
                if (that.isTopic) {
                    data.code = that.id;
                } else {
                    data.id = that.id;
                }
                data.status = that.status;
                request[url](data).then(res => {
                    that.btnLoading = false;
                    if (res.code === 10000) {
                        this.$message.success(`${this.title}成功`);
                    } else {
                        this.$message.success(res.msg);
                    }
                    this.$emit('msg', false);
                }).catch(err => {
                    that.tableLoading = false;
                    this.$emit('msg', false);
                });
            } else {
                this.$emit('msg', false);
            }
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
    position: relative;
    width: 530px;
    height: 305px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    .mask-title {
      width: 100%;
      height: 56px;
      border-bottom: 1px solid #ccc;
      padding-left: 45px;
      box-sizing: border-box;
      text-align: center;
      line-height: 56px;
      color: #ff6868;
      font-weight: 700;
      .ico {
        position: absolute;
        top: 16px;
        left: 228px;
        color: red;
        font-size: 20px;
      }
    }
    .mask-content {
      position: relative;
      width: 100%;
      height: 248px;
      overflow: hidden;
      padding: 30px 45px 0 45px;
      box-sizing: border-box;
      .del-tip {
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translateX(-50%);
        font-size: 22px;
      }
      .del-btn-group {
        width: 180px;
        display: flex;
        justify-content: space-between;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 15%;
        .del-btn {
          background-color: #ff6868;
        }
      }
    }
  }
}
</style>


