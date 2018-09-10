<template>
    <div>
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <el-form ref="form" :model="form" inline label-width="80px">
                <el-form-item prop="queryItem" label="">
                    <el-select class="sel-w" v-model="form.queryItem" placeholder="请选择">
                        <el-option label="防伪码" value="防伪码"></el-option>
                        <el-option label="授权码" value="授权码"></el-option>
                        <el-option label="条形码" value="条形码"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="queryContent" label="">
                    <el-input v-model="form.queryContent" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" @click="query('form')">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card v-if="showType == '授权码'" class="con-card">
            <span>经销商信息</span>
            <div class="msg-box">
                <div class="avatar"></div>
                <p>经销商姓名: 张三</p>
                <p @click="shouUserDetail" class="user-detail">查看用户详情 》</p>
            </div>
            <el-form class="auth-item">
                <el-form-item label="上级代理">王建建</el-form-item>
                <el-form-item label="授权码">123456789</el-form-item>
                <el-form-item label="授权层级">明星CEO</el-form-item>
                <el-form-item label="授权品牌">
                    <el-tag type="info">朵女郎</el-tag>
                    <el-tag type="info">雅诗兰黛</el-tag>
                </el-form-item>
                <el-form-item label="授权品类">
                    <el-tag type="info">朵女郎-化妆品</el-tag>
                    <el-tag type="info">雅诗兰黛-化妆品</el-tag>
                </el-form-item>
                <el-form-item label="授权渠道">
                    <el-tag type="info">朵女郎-化妆品</el-tag>
                    <el-tag type="info">雅诗兰黛-化妆品</el-tag>
                </el-form-item>
                <el-form-item label="授权时间">
                    2018-5-17 15:15:15
                </el-form-item>
            </el-form>
        </el-card>
        <el-card v-if="showType == '防伪码'" class="con-card">
            <span>产品信息</span>
            <div class="product-box">
                <div class="avatar"></div>
                <p style="position:absolute;left:150px;top:20px">产品名称: 清清裤<span @click="showProductDet" class='show-det'>查看详情 》</span></p>
                <p style="position:absolute;left:150px;top:60px">产品品牌: 朵女郎</p>
                <p style="position:absolute;left:150px;top:95px"> 产品规格: 240*568</p>
            </div>
            <div style="margin-top:25px">经销商信息</div>
            <div class="dea-bar">
                <div class="dealer" v-for="(v,k) in userList" :key="k">
                    <span class="del-title">{{v.title}}</span>
                    <span class="del-name">{{v.name}}</span>
                    <span class="in-time">{{v.inTime}}</span>
                    <span class="in">{{v.in}}</span>
                    <span class="out-time">{{v.outTime}}</span>
                    <span class="out">{{v.out}}</span>
                </div>
            </div>
        </el-card>
        <el-card v-if="showType == '条形码'" class="con-card">
            <span>产品信息</span>
            <div class="product-box">
                <div class="avatar"></div>
                <p style="position:absolute;left:150px;top:20px">产品名称: 清清裤<span @click="showProductDet" class='show-det'>查看详情 》</span></p>
                <p style="position:absolute;left:150px;top:60px">产品品牌: 朵女郎</p>
                <p style="position:absolute;left:150px;top:95px"> 产品规格: 240*568</p>
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
      nav: ["溯源管理", "溯源防伪码查询"],
      showType: "防伪码",
      userList:[
          {
              title:'一级经销商',
              name:'张三',
              inTime:'2018-05-05 16:16:16',
              in:'入库',
              outTime:'2018-05-05 16:16:16',
              out:'出库'
          },
          {
              title:'一级经销商',
              name:'张三',
              inTime:'2018-05-05 16:16:16',
              in:'入库',
              outTime:'2018-05-05 16:16:16',
              out:'出库'
          },
          {
              title:'一级经销商',
              name:'张三',
              inTime:'2018-05-05 16:16:16',
              in:'入库',
              outTime:'2018-05-05 16:16:16',
              out:'出库'
          },
          {
              title:'一级经销商',
              name:'张三',
              inTime:'2018-05-05 16:16:16',
              in:'入库',
              outTime:'2018-05-05 16:16:16',
              out:'出库'
          },
      ],
      form: {
        queryItem: "防伪码",
        queryContent: ""
      }
    };
  },
  methods: {
    //   查询
    query(formName) {
        this.showType = this.form.queryItem;
        
    },

    //   重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 查看用户详情
    shouUserDetail(){

    },

    // 查看商品伤情
    showProductDet(){

    }
  }
};
</script>
<style lang="less" scoped>
.sel-w {
  width: 110px;
}
.con-card {
  position: relative;
  box-sizing: border-box;
  padding-left: 20px;
  margin-top: 20px;
  height: 70vh;
  .dealer{
      position: relative;
      width: 700px;
      height: 38px;
      border: 1px solid #ccc;
      border-radius: 10px;
      margin-top: 20px;
      line-height: 38px;
      font-size: 14px;
      .del-title{
          margin: 0 50px 0 20px;
      }
      .del-name{
          cursor: pointer;
          color: #7dcaff;
      }
      .del-name,
      .in-time,
      .in,
      .out-time,
      .out {
          margin: 0 30px 0 0;
      }
  }
}
.dea-bar div:nth-child(2){
    margin-left: 20px;
}
.dea-bar div:nth-child(3){
    margin-left: 40px;
}
.dea-bar div:nth-child(4){
    margin-left: 60px;
}
.auth-item {
    margin: 30px 0 0 20px;
}
.msg-box{
    position: relative;
    width: 345px;
    height: 75px;
    margin: 30px 0 0 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 6px 0 6px 10px;
    box-sizing: border-box;
    .avatar{
        float: left;
        width: 60px;
        height: 60px;
        border: 1px solid #ccc;
        border-radius: 5px;
        overflow: hidden;
        margin-right: 20px;
    }
    p{
        font-size: 14px;
        line-height: 30px;
    }
    .user-detail {
        cursor: pointer;
        color: #7dcaff;
    }
}
.product-box{
    position: relative;
    width: 600px;
    height: 138px;
    margin: 30px 0 0 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 6px 0 6px 10px;
    box-sizing: border-box;
    .avatar{
        float: left;
        width: 100px;
        height: 100px;
        border: 1px solid #ccc;
        border-radius: 5px;
        overflow: hidden;
        margin: 10px 0 0 10px;
    }
    p {
        font-size: 14px;
    }
    .show-det {
        margin-left: 50px;
        cursor: pointer;
        color: #7dcaff;
    }
}
</style>


