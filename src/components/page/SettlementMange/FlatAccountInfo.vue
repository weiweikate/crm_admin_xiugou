<template>
    <div class="flat-account-info">
        <v-breadcrumb :nav="['结算管理','平台账户收入明细']"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }">
            <el-row>
                <el-col :span="6">
                    <div @click="goPage('1')" class="card them1">无主账户资金收入明细</div>
                </el-col>
                <el-col :span="6">
                    <div @click="goPage('2')" class="card them2">助业金账户资金收入明细</div>
                </el-col>
            </el-row><br/>
            <el-row>
                <el-col :span="6">
                    <div @click="goPage('3')" class="card them1">其他1账户收入明细</div>
                </el-col>
                <el-col :span="6">
                    <div @click="goPage('4')" class="card them2">其他2账户收入明细</div>
                </el-col>
                <el-col :span="6">
                    <div @click="goPage('5')" class="card them3">其他3账户收入明细</div>
                </el-col>
            </el-row><br/>
            <el-row>
                <el-col :span="6">
                    <div @click="goPage('6')" class="card them1">店主账户收支明细</div>
                </el-col>
                <el-col :span="6">
                    <div @click="goPage('7')" class="card them2">店员账户收支明细</div>
                </el-col>
                <el-col :span="6">
                    <div @click="goPage('8')" class="card them3">直接上级（销售提成）账户收支明细</div>
                </el-col>
            </el-row><br/>
            <el-row>
                <el-col :span="6">
                    <div @click="goPage('9')" class="card them1">间接上级（推广提成）账户收支明细</div>
                </el-col>
                <el-col :span="6">
                    <div @click="goPage('10')" class="card them2">用户账户（自己）账户收支明细</div>
                </el-col>
            </el-row>
        </el-card>
        
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
export default {
  components: {vBreadcrumb},

  data () {
    return {
    };
  },

  methods: {
      goPage(val){
          let url = '';
          let flag = '';
          let flag1 = '';
          switch (val) {
            case '1':
                url = 'flatAct01';
                flag = 1;
                break;
            case '2':
                url = 'flatAct01';
                flag = 2;
                break;
            case '3':
                url = 'flatAct01';
                flag = 3;
                break;
            case '4':
                url = 'flatAct01';
                flag = 4;
                break;
            case '5':
                url = 'flatAct01';
                flag = 5;
                break;
            case '6':
                url = 'flatAct02';
                flag1 = 1;
                break;
            case '7':
                url = 'flatAct02';
                flag1 = 2;
                break;
            case '8':
                url = 'flatAct02';
                flag1 = 3;
                break;
            case '9':
                url = 'flatAct02';
                flag1 = 4;
                break;
            case '10':
                url = 'flatAct02';
                flag1 = 5;
                break;
              default:
                  break;
          }
          sessionStorage.setItem('flag1',flag);
          sessionStorage.setItem('flag',flag);
          this.$router.push({name:url,query:{flag:flag,flag1:flag1}});
      }
  }
}

</script>
<style lang='less' scoped>
.flat-account-info{
    .card{
        width: 350px;
        height: 200px;
        text-align: center;
        border-radius: 10px;
        cursor: pointer;
        line-height: 200px;
        color: #fff;
    }
    .them1{
            background-color: #ffa868;
        }
    .them1:hover{
        box-shadow: 1px 1px 8px 1px rgba(255, 168, 104, 0.3);
    }
    .them2{
            background-color: #33b4ff;
        }
    .them2:hover{
        box-shadow: 1px 1px 8px 1px rgba(51, 180, 255, 0.3);
    }
    .them3{
            background-color: #54d266;
        }
    .them3:hover{
        box-shadow: 1px 1px 8px 1px rgba(84, 210, 102, 0.3);
    }
}
</style>