<template>
    <div class="data-dictionary">
        <v-breadcrumb :nav='["权限管理","数据字典"]'></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }">
            <el-form :model="form" inline>
                <el-form-item label="数据类型">
                    <el-select v-model="form.dType" placeholder="">
                        <el-option v-for="(v,k) in dicList" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button @click="getList" type="primary">提交</el-button>
                    <el-button @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card :body-style="{ padding: '30px' }" style='marginTop:20px'>
            <el-table :data="tableData" border>
                <el-table-column prop="dKey" label="dKey" align="center"></el-table-column>
                <el-table-column prop="dValue" label="dValue" align="center"></el-table-column>
            </el-table>
        </el-card>

    </div>
</template>

<script>
import vBreadcrumb from "@/components/common/Breadcrumb.vue";
import * as cApi from '@/api/api';
import { queryDictonary } from '@/JS/commom';
export default {
  components: {vBreadcrumb},
  mixins:[queryDictonary],
  data () {
    return {
        dicList:[
            {label:'取消订单',value:1},
            {label:'退款理由',value:2},
            {label:'换货理由',value:3},
            {label:'退货退款',value:4},
            {label:'问题类型',value:5},
            {label:'实名驳回',value:6},
            {label:'拒接退款',value:7},
            {label:'产品报损',value:8},
            {label:'广告位',value:9},
            {label:'结算驳回',value:10},
        ],
        form:{
            dType:1
        },
        tableData:[],
    };
  },

  activated(){
      this.getList();
  },

  methods: {
    //   获取列表
      getList(){
          this.$axios.post(cApi.queryDictionaryDetailsType,{dType:this.form.dType}).then(res=>{
              this.tableData = res.data.data;
          })
      },
    //   重置表单
    reset(){
        this.form = {dType:1};
        this.getList();
    },
  }
}

</script>
<style lang='less' scoped>
.data-dictionary{
    .block{
        margin: 10px;
    }
}
</style>
