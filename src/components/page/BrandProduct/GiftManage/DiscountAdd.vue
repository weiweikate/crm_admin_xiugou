<template>
    <div class="discount-add">
        <v-breadcrumb :nav="['品牌产品管理','礼包管理','优惠券管理']"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }" v-loading="cardLoading">
            <span style="color:#666">请选择优惠券:</span>
            <draggable class="draggle" v-model="discountArr" :move="getdata" @update="datadragEnd">
                <div v-for="(v,k) in discountArr" :key="k">
                    <p class="discount-item">{{v.label}}</p>
                    <span @click="delCheckedDiscount(k,v)" class="del-discount-button">删除</span>
                </div>
            </draggable>
            <p class="add-discount" @click="showDisCountList=true">+添加优惠券</p>
            <p style="margin: 30px 0 0 55px">
                <el-button @click="submitForm" type="primary">保存</el-button>
                <el-button @click="goBack" >取消</el-button>
            </p>
        </el-card>
        <!-- 优惠券列表弹窗 -->
        <el-dialog title="选择优惠券" :visible.sync="showDisCountList" width="30%">
            <div class="wrap">
                <div class="title">
                    <div :class="{'item':true,'active-item':activeTab==1}" @click="tabChange(1)">满减券</div>
                    <div :class="{'item':true,'active-item':activeTab==2}" @click="tabChange(2)">折扣券</div>
                    <div :class="{'item':true,'active-item':activeTab==3}" @click="tabChange(3)">抵扣券</div>
                    <div :class="{'item':true,'active-item':activeTab==4}" @click="tabChange(4)">抵价券</div>
                </div>
                <div class="con-box">
                    <p v-for="(v,k) in discountList[activeTab-1]" :key="k" :class="{'discount-list':true,'active-item':v.checked}" @click="checkedDiscount(activeTab,v,k)">{{v.label}}</p>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="getDiscountList">提 交</el-button>
                <el-button @click="showDisCountList = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import draggable from 'vuedraggable';
export default {
    components: { draggable, vBreadcrumb },

    data() {
        return {
            cardLoading: false,
            // 活动ID
            disCountId: '',
            // 优惠券列表弹窗
            showDisCountList: false,
            // 已选择优惠券
            discountArr: [],
            // 已选中的选项卡
            activeTab: 1,
            // 优惠码列表
            discountList: [],
            // 临时储存已选中优惠码
            tmpDiscountList: []
        };
    },

    activated() {
        this.disCountId = this.$route.query.discountAddId || sessionStorage.getItem('discountAddId');
        this.discountArr = [];
        this.discountList = [];
        this.getGiftDisList();
        this.getDisList();
    },

    methods: {
    // 获取礼包优惠券
        getGiftDisList() {
            this.cardLoading = true;
            this.$axios.post(api.queryCouponListByGiftBagId, { id: this.disCountId }).then(res => {
                this.discountArr = [];
                res.data.data.forEach((v, k) => {
                    const tmp = {};
                    tmp.label = v.couponName;
                    tmp.value = v.couponId;
                    this.discountArr.push(tmp);
                });
                this.cardLoading = false;
            });
        },
        // 提交表单
        submitForm() {
            // if(this.discountArr.length == 0){
            //   this.$message.warning('请选择优惠券');
            //   return;
            // }
            const ids = [];
            this.discountArr.forEach((v, k) => {
                ids.push(v.value);
            });
            this.$axios.post(api.couponControl, { id: this.disCountId, couponStr: ids.join(',') }).then(res => {
                this.$message.success(res.data.msg);
                this.$router.push('giftManage');
            });
        },
        // 返回
        goBack() {
            this.$router.push('giftManage');
        },
        // 获取优惠券列表
        getDisList() {
            this.$axios.post(api.queryCouponList, {}).then(res => {
                // 循环遍历将优惠券放入列表
                res.data.data.forEach((v, k) => {
                    if (v.name == 'MJ') {
                        this.discountList[0] = [];
                        v.list.forEach((v, k) => {
                            const tmp = {};
                            tmp.label = v.name;
                            tmp.value = v.id;
                            tmp.checked = false;
                            this.discountList[0].push(tmp);
                        });
                    } else if (v.name == 'ZK') {
                        this.discountList[1] = [];
                        v.list.forEach((v, k) => {
                            const tmp = {};
                            tmp.label = v.name;
                            tmp.value = v.id;
                            tmp.checked = false;
                            this.discountList[1].push(tmp);
                        });
                    } else if (v.name == 'DK') {
                        this.discountList[2] = [];
                        v.list.forEach((v, k) => {
                            const tmp = {};
                            tmp.label = v.name;
                            tmp.value = v.id;
                            tmp.checked = false;
                            this.discountList[2].push(tmp);
                        });
                    } else if (v.name == 'DJ') {
                        this.discountList[3] = [];
                        v.list.forEach((v, k) => {
                            const tmp = {};
                            tmp.label = v.name;
                            tmp.value = v.id;
                            tmp.checked = false;
                            this.discountList[3].push(tmp);
                        });
                    }
                });
            });
        },
        // 拖拽
        getdata(evt) {},
        // 拖拽结束
        datadragEnd(evt) {},
        // 选择选择选项卡
        tabChange(index) {
            this.activeTab = index;
        },
        // 选择优惠券
        checkedDiscount(actIndex, row, index) {
            row.checked = !row.checked;
            this.$set(this.discountList[actIndex - 1], index, row);
            this.$set(this.discountList, actIndex - 1, this.discountList[actIndex - 1]);
            if (row.checked) {
                this.tmpDiscountList.push(row);
            } else {
                this.tmpDiscountList.forEach((v, k) => {
                    if (v.value == row.value) {
                        this.tmpDiscountList.splice(k, 1);
                    }
                });
            }
        },
        // 将选中的优惠券放在列表中
        getDiscountList() {
            this.discountArr.push(...this.tmpDiscountList);
            // 重置优惠券列表以及临时储存区
            this.tmpDiscountList = [];
            this.discountList.forEach((v, k) => {
                v.forEach((v1, k1) => {
                    v1.checked = false;
                });
            });
            this.showDisCountList = false;
        },
        // 删除已选中的优惠券
        delCheckedDiscount(index, row) {
            this.discountArr.splice(index, 1);
            this.$message.success('删除成功');
        }
    }
};
</script>
<style lang='less'>
.discount-add {
  .el-dialog {
    border-radius: 10px;
    .el-dialog__header {
      border-bottom: 1px solid #ccc;
      .el-dialog__title {
        color: #ff6868;
      }
    }
  }
  .draggle {
    color: #666;
    margin-left: 5%;
    .discount-item {
        display: inline-block;
      cursor: move;
      height: 38px;
      width: 20%;
      border: 1px solid #ddd;
      border-radius: 5px;
      line-height: 38px;
      padding: 0 13px;
      box-sizing: border-box;
      margin-top: 20px;
      font-size: 14px;
    }
    .del-discount-button{
        color: #33b4ff;
        margin-left: 20px;
        cursor: pointer;
    }
  }
  .add-discount {
    width: 120px;
    height: 25px;
    border-radius: 5px;
    line-height: 25px;
    background-color: #33b4ff;
    text-align: center;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
    margin: 20px 0 0 80px;
  }
  .active-item {
    background-color: #33b4ff;
    color: #fff;
  }
  .wrap {
    width: 100%;
    border: 1px solid #ddd;
    .title {
      display: flex;
      height: 50px;
      border-bottom: 1px solid #ddd;
      .item {
        flex: 1;
        text-align: center;
        line-height: 50px;
        border-right: 1px solid #ddd;
        cursor: pointer;
      }
      .item:last-child {
        border-right: none;
      }
    }
    .con-box {
      height: 400px;
      background-color: #f7f7f7;
      overflow-y: auto;
      .discount-list {
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        box-sizing: border-box;
        cursor: pointer;
        margin-top: 1px;
      }
    }
  }
}
</style>
