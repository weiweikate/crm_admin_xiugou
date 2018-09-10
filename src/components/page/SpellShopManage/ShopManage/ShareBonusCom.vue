<template>
  <div class="share-bonus-comp">
    <v-breadcrumb :nav='nav'></v-breadcrumb>
    <el-card :body-style="{ padding: '20px' }">
        <div class="wrap">
            <div class="charts" ref="charts" style="width: 80%;height:70vh;"></div>
        </div>
    </el-card>
  </div>
</template>

<script>
import vBreadcrumb from "@/components/common/Breadcrumb.vue";
export default {
  components: { vBreadcrumb },

  data() {
    return {
      nav: ["拼店店铺管理", "店铺管理", "分红详情", "分红组成"],
      option: {
        title: {
          text: ""
        },
        tooltip: {},
        legend: {
          data: ["分红"]
        },
        xAxis: {
          data: ["美容美妆", "百货轻奢", "母婴玩具", "水果蔬菜", "箱包服饰", "休闲零食","生鲜肉类"]
        },
        yAxis: {
            splitNumber:[10]
        },
        series: [
          {
            name: "分红",
            type: 'bar',
            data: [1280, 650, 820, 880, 810, 1020,1400]
          }
        ],
        barWidth:30,
        color:['#33b4ff']
      }
    };
  },

  mounted() {
    this.echartsInit();
  },

  methods: {
    //  图表初始化
    echartsInit() {
      let chart = this.$echarts.init(this.$refs.charts);
      chart.setOption(this.option);
    }
  }
};
</script>
<style lang='less' scoped>
.share-bonus-comp {
  .wrap {
      overflow: hidden;
    .charts {
      margin: 0 auto;
    }
  }
}
</style>