<template>
    <div class="gift-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="query-panue" :body-style="{ padding: '20px 20px'}">
            <el-form :model="form" ref="form" inline label-width="120px">
                <el-form-item prop="productNum" label="产品编号">
                    <el-input v-model="form.productNum" placeholder="请输入产品编号"></el-input>
                </el-form-item>
                <el-form-item prop="realName" label="买家姓名">
                    <el-input v-model="form.realName" placeholder="请输入产品名称"></el-input>
                </el-form-item>
                <el-form-item prop="orderNum" label="订单编号">
                    <el-input v-model="form.orderNum" placeholder="请输入订单编号"></el-input>
                </el-form-item>
                <el-form-item prop="productName" label="产品名称">
                    <el-input v-model="form.productName" placeholder="请输入产品名称"></el-input>
                </el-form-item>
                <el-form-item prop="stars" label="订单标记">
                    <el-select v-model="form.stars" placeholder="请选择订单标记">
                      <el-option v-for="(v,k) in starArr" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="成交时间">
                  <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="getList(1)">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
                <div class="btn-group">
                    <el-button type="primary">批量导出</el-button>
                </div>
            </el-form>
        </el-card>
        <el-card style='margin-top:20px;minHeight:90vh;overflow-x: auto;min-width: 1336px' :body-style="{ padding: '20px 50px' }">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane v-loading="tabLoading" style="min-width:1366px" label="全部订单" name="allOrder">
                    <template v-if='activeName == "allOrder"'>
                        <div class="tab-title">
                            <span class="spec" :style="{width:w.name,minWidth:w.minWidth}">产品名称</span>
                            <span class="spec" :style="{width:w.price,minWidth:w.minWidth}">单价</span>
                            <span class="spec" :style="{width:w.num,minWidth:w.minWidth}">数量</span>
                            <span class="spec" :style="{width:w.consignee,minWidth:w.minWidth}">买家</span>
                            <span class="spec" :style="{width:w.status,minWidth:w.minWidth}">交易状态</span>
                            <span class="spec" :style="{width:w.collection,minWidth:w.minWidth}">实收款</span>
                        </div>
                        <div v-for="(v,k) in tableData" :key="k" class="tab-wrap">
                            <div class="tab-content-title">
                                <el-checkbox @change="orderCheckBox(v)"></el-checkbox>
                                <span>订单号：{{v.orderNum}}</span>
                                <span style="margin-left:30px">创建时间：{{v.orderCreateTime|formatDate}}</span>
                                <div class="operate-btn-group">
                                    <span v-if='v.orderStatus == 2 && p.orderSendOutGift' @click="pushCloud(v)">推送云仓</span>
                                    <span @click="orderInfo(v)" style="margin:0 15px 0 15px">订单详情</span>
                                    <el-popover placement="bottom" width="150" v-model="v.isShowPop" trigger="hover">
                                        <span slot="reference" style="cursor:pointer">标记 &nbsp <span class="star"
                                                                                                    :style="{color:v.starColor}">★</span></span>
                                        <span v-for="(v1,k1) in markArr" :key="k1" @click="changeColor(v1,v)"
                                            :style="{color:v1.label,fontSize:'22px',cursor:'pointer',marginRight:'5px'}">★</span>
                                        <el-input v-model="v.adminRemark" placeholder="请输入备注"></el-input>
                                    </el-popover>
                                </div>
                            </div>
                            <div class="tab-content">
                                <div class="left">
                                    <div v-for="(value,index) in v.orderProduct" :key="index" class="bar">
                                        <div class="name">
                                            <img :src="value.imgUrl" alt="">
                                            <span class="pro-name">{{value.productName}}</span>
                                            <span class="pro-spec">{{value.spec}}</span>
                                        </div>
                                        <div class="price">{{value.price}}</div>
                                        <div class="num">{{value.num}}</div>
                                        <div class="consignee">{{value.receiver}}</div>
                                    </div>
                                </div>
                                <div class="center">
                                    <div class="status"
                                        :style="{height:120*v.orderProduct.length+v.orderProduct.length-1+'px',lineHeight:120*v.orderProduct.length+v.orderProduct.length-1+'px'}">
                                        <template v-if='v.orderStatus == 1'>待支付</template>
                                        <template v-if='v.orderStatus == 2'>待发货</template>
                                        <template v-if='v.orderStatus == 3'>待确认</template>
                                        <template v-if='v.orderStatus == 4'>待自提</template>
                                        <template v-if='v.orderStatus == 5'>确认收货</template>
                                        <template v-if='v.orderStatus == 6'>已关闭(退款关闭)</template>
                                        <template v-if='v.orderStatus == 7||v.orderStatus == 9'>已完成</template>
                                        <template v-if='v.orderStatus == 8'>已关闭(用户关闭)</template>
                                        <template v-if='v.orderStatus == 10'>已关闭(超时关闭)</template>
                                    </div>
                                    <div class="collection"
                                        :style="{height:120*v.orderProduct.length+v.orderProduct.length-1+'px',paddingTop:120*v.orderProduct.length/2-30+'px'}">
                                        <span>{{v.price | handleMoney}}<br>（含运费：{{v.freightPrice | handleMoney}}）</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane v-loading="tabLoading" label="待支付" name="toBePaid">
                  <template v-if='activeName == "toBePaid"'>
                    <div class="tab-title">
                        <span class="spec" :style="{width:w.name,minWidth:w.minWidth}">产品名称</span>
                        <span class="spec" :style="{width:w.price,minWidth:w.minWidth}">单价</span>
                        <span class="spec" :style="{width:w.num,minWidth:w.minWidth}">数量</span>
                        <span class="spec" :style="{width:w.consignee,minWidth:w.minWidth}">买家</span>
                        <span class="spec" :style="{width:w.status,minWidth:w.minWidth}">交易状态</span>
                        <span class="spec" :style="{width:w.collection,minWidth:w.minWidth}">实收款</span>
                    </div>
                    <div v-for="(v,k) in tableData" :key="k" class="tab-wrap">
                      <div class="tab-content-title">
                          <el-checkbox @change="orderCheckBox(v)"></el-checkbox>
                          <span>订单号：{{v.orderNum}}</span>
                          <span style="margin-left:30px">创建时间：{{v.orderCreateTime|formatDate}}</span>
                          <div class="operate-btn-group">
                              <span @click="orderInfo(v)" style="margin:0 15px 0 15px">订单详情</span>
                              <el-popover placement="bottom" width="150" v-model="v.isShowPop" trigger="hover">
                                  <span slot="reference" style="cursor:pointer">标记 &nbsp <span class="star"
                                                                                              :style="{color:v.starColor}">★</span></span>
                                  <span v-for="(v1,k1) in markArr" :key="k1" @click="changeColor(v1,v)"
                                      :style="{color:v1.label,fontSize:'22px',cursor:'pointer',marginRight:'5px'}">★</span>
                                  <el-input v-model="v.adminRemark" placeholder="请输入备注"></el-input>
                              </el-popover>
                          </div>
                      </div>
                      <div class="tab-content">
                          <div class="left">
                              <div v-for="(value,index) in v.orderProduct" :key="index" class="bar">
                                  <div class="name">
                                      <img :src="value.imgUrl" alt="">
                                      <span class="pro-name">{{value.productName}}</span>
                                      <span class="pro-spec">{{value.spec}}</span>
                                  </div>
                                  <div class="price">{{value.price}}</div>
                                  <div class="num">{{value.num}}</div>
                                  <div class="consignee">{{value.receiver}}</div>
                              </div>
                          </div>
                          <div class="center">
                              <div class="status"
                                  :style="{height:120*v.orderProduct.length+v.orderProduct.length-1+'px',lineHeight:120*v.orderProduct.length+v.orderProduct.length-1+'px'}">
                                  <template>待支付</template>
                              </div>
                              <div class="collection"
                                  :style="{height:120*v.orderProduct.length+v.orderProduct.length-1+'px',paddingTop:120*v.orderProduct.length/2-30+'px'}">
                                  <span>{{v.price | handleMoney}}<br>（含运费：{{v.freightPrice | handleMoney}}）</span>
                              </div>
                          </div>
                      </div>
                    </div>
                  </template>
                </el-tab-pane>
                <el-tab-pane v-loading="tabLoading" label="待发货" name="toBeSend">
                  <template v-if='activeName == "toBeSend"'>
                    <div class="tab-title">
                        <span class="spec" :style="{width:w.name,minWidth:w.minWidth}">产品名称</span>
                        <span class="spec" :style="{width:w.price,minWidth:w.minWidth}">单价</span>
                        <span class="spec" :style="{width:w.num,minWidth:w.minWidth}">数量</span>
                        <span class="spec" :style="{width:w.consignee,minWidth:w.minWidth}">买家</span>
                        <span class="spec" :style="{width:w.status,minWidth:w.minWidth}">交易状态</span>
                        <span class="spec" :style="{width:w.collection,minWidth:w.minWidth}">实收款</span>
                    </div>
                    <div v-for="(v,k) in tableData" :key="k" class="tab-wrap">
                        <div class="tab-content-title">
                            <el-checkbox @change="orderCheckBox(v)"></el-checkbox>
                            <span>订单号：{{v.orderNum}}</span>
                            <span style="margin-left:30px">创建时间：{{v.orderCreateTime|formatDate}}</span>
                            <div class="operate-btn-group">
                                <span v-if='p.orderSendOutGift' @click="pushCloud(v)">推送云仓</span>
                                <span @click="orderInfo(v)" style="margin:0 15px 0 15px">订单详情</span>
                                <el-popover placement="bottom" width="150" v-model="v.isShowPop" trigger="hover">
                                    <span slot="reference" style="cursor:pointer">标记 &nbsp <span class="star"
                                                                                                :style="{color:v.starColor}">★</span></span>
                                    <span v-for="(v1,k1) in markArr" :key="k1" @click="changeColor(v1,v)"
                                        :style="{color:v1.label,fontSize:'22px',cursor:'pointer',marginRight:'5px'}">★</span>
                                    <el-input v-model="v.adminRemark" placeholder="请输入备注"></el-input>
                                </el-popover>
                            </div>
                        </div>
                        <div class="tab-content">
                            <div class="left">
                                <div v-for="(value,index) in v.orderProduct" :key="index" class="bar">
                                    <div class="name">
                                        <img :src="value.imgUrl" alt="">
                                        <span class="pro-name">{{value.productName}}</span>
                                        <span class="pro-spec">{{value.spec}}</span>
                                    </div>
                                    <div class="price">{{value.price}}</div>
                                    <div class="num">{{value.num}}</div>
                                    <div class="consignee">{{value.receiver}}</div>
                                </div>
                            </div>
                            <div class="center">
                                <div class="status"
                                    :style="{height:120*v.orderProduct.length+v.orderProduct.length-1+'px',lineHeight:120*v.orderProduct.length+v.orderProduct.length-1+'px'}">
                                    <template>待发货</template>
                                </div>
                                <div class="collection"
                                    :style="{height:120*v.orderProduct.length+v.orderProduct.length-1+'px',paddingTop:120*v.orderProduct.length/2-30+'px'}">
                                    <span>{{v.price | handleMoney}}<br>（含运费：{{v.freightPrice | handleMoney}}）</span>
                                </div>
                            </div>
                        </div>
                    </div>
                  </template>
                </el-tab-pane>
                <el-tab-pane v-loading="tabLoading" label="待确认" name="toBeConfirm">
                    <template v-if='activeName == "toBeConfirm"'>
                      <div class="tab-title">
                          <span class="spec" :style="{width:w.name,minWidth:w.minWidth}">产品名称</span>
                          <span class="spec" :style="{width:w.price,minWidth:w.minWidth}">单价</span>
                          <span class="spec" :style="{width:w.num,minWidth:w.minWidth}">数量</span>
                          <span class="spec" :style="{width:w.consignee,minWidth:w.minWidth}">买家</span>
                          <span class="spec" :style="{width:w.status,minWidth:w.minWidth}">交易状态</span>
                          <span class="spec" :style="{width:w.collection,minWidth:w.minWidth}">实收款</span>
                      </div>
                      <div v-for="(v,k) in tableData" :key="k" class="tab-wrap">
                          <div class="tab-content-title">
                              <el-checkbox @change="orderCheckBox(v)"></el-checkbox>
                              <span>订单号：{{v.orderNum}}</span>
                              <span style="margin-left:30px">创建时间：{{v.orderCreateTime|formatDate}}</span>
                              <div class="operate-btn-group">
                                  <span @click="orderInfo(v)" style="margin:0 15px 0 15px">订单详情</span>
                                  <el-popover placement="bottom" width="150" v-model="v.isShowPop" trigger="hover">
                                      <span slot="reference" style="cursor:pointer">标记 &nbsp <span class="star"
                                                                                                  :style="{color:v.starColor}">★</span></span>
                                      <span v-for="(v1,k1) in markArr" :key="k1" @click="changeColor(v1,v)"
                                          :style="{color:v1.label,fontSize:'22px',cursor:'pointer',marginRight:'5px'}">★</span>
                                      <el-input v-model="v.adminRemark" placeholder="请输入备注"></el-input>
                                  </el-popover>
                              </div>
                          </div>
                          <div class="tab-content">
                              <div class="left">
                                  <div v-for="(value,index) in v.orderProduct" :key="index" class="bar">
                                      <div class="name">
                                          <img :src="value.imgUrl" alt="">
                                          <span class="pro-name">{{value.productName}}</span>
                                          <span class="pro-spec">{{value.spec}}</span>
                                      </div>
                                      <div class="price">{{value.price}}</div>
                                      <div class="num">{{value.num}}</div>
                                      <div class="consignee">{{value.receiver}}</div>
                                  </div>
                              </div>
                              <div class="center">
                                  <div class="status"
                                      :style="{height:120*v.orderProduct.length+v.orderProduct.length-1+'px',lineHeight:120*v.orderProduct.length+v.orderProduct.length-1+'px'}">
                                      <template>待确认</template>
                                  </div>
                                  <div class="collection"
                                      :style="{height:120*v.orderProduct.length+v.orderProduct.length-1+'px',paddingTop:120*v.orderProduct.length/2-30+'px'}">
                                      <span>{{v.price | handleMoney}}<br>（含运费：{{v.freightPrice | handleMoney}}）</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </template>
                </el-tab-pane>
                <el-tab-pane v-loading="tabLoading" label="已完成" name="finished">
                  <template v-if='activeName == "finished"'>
                    <div class="tab-title">
                        <span class="spec" :style="{width:w.name,minWidth:w.minWidth}">产品名称</span>
                        <span class="spec" :style="{width:w.price,minWidth:w.minWidth}">单价</span>
                        <span class="spec" :style="{width:w.num,minWidth:w.minWidth}">数量</span>
                        <span class="spec" :style="{width:w.consignee,minWidth:w.minWidth}">买家</span>
                        <span class="spec" :style="{width:w.status,minWidth:w.minWidth}">交易状态</span>
                        <span class="spec" :style="{width:w.collection,minWidth:w.minWidth}">实收款</span>
                    </div>
                    <div v-for="(v,k) in tableData" :key="k" class="tab-wrap">
                        <div class="tab-content-title">
                            <el-checkbox @change="orderCheckBox(v)"></el-checkbox>
                            <span>订单号：{{v.orderNum}}</span>
                            <span style="margin-left:30px">创建时间：{{v.orderCreateTime|formatDate}}</span>
                            <div class="operate-btn-group">
                                <span @click="orderInfo(v)" style="margin:0 15px 0 15px">订单详情</span>
                                <el-popover placement="bottom" width="150" v-model="v.isShowPop" trigger="hover">
                                    <span slot="reference" style="cursor:pointer">标记 &nbsp <span class="star"
                                                                                                :style="{color:v.starColor}">★</span></span>
                                    <span v-for="(v1,k1) in markArr" :key="k1" @click="changeColor(v1,v)"
                                        :style="{color:v1.label,fontSize:'22px',cursor:'pointer',marginRight:'5px'}">★</span>
                                    <el-input v-model="v.adminRemark" placeholder="请输入备注"></el-input>
                                </el-popover>
                            </div>
                        </div>
                        <div class="tab-content">
                            <div class="left">
                                <div v-for="(value,index) in v.orderProduct" :key="index" class="bar">
                                    <div class="name">
                                        <img :src="value.imgUrl" alt="">
                                        <span class="pro-name">{{value.productName}}</span>
                                        <span class="pro-spec">{{value.spec}}</span>
                                    </div>
                                    <div class="price">{{value.price}}</div>
                                    <div class="num">{{value.num}}</div>
                                    <div class="consignee">{{value.receiver}}</div>
                                </div>
                            </div>
                            <div class="center">
                                <div class="status"
                                    :style="{height:120*v.orderProduct.length+v.orderProduct.length-1+'px',lineHeight:120*v.orderProduct.length+v.orderProduct.length-1+'px'}">
                                    <template>已完成</template>
                                </div>
                                <div class="collection"
                                    :style="{height:120*v.orderProduct.length+v.orderProduct.length-1+'px',paddingTop:120*v.orderProduct.length/2-30+'px'}">
                                    <span>{{v.price | handleMoney}}<br>（含运费：{{v.freightPrice | handleMoney}}）</span>
                                </div>
                            </div>
                        </div>
                    </div>
                  </template>
                </el-tab-pane>
                <el-tab-pane v-loading="tabLoading" label="已关闭" name="closed">
                    <template v-if='activeName == "closed"'>
                    <div class="tab-title">
                        <span class="spec" :style="{width:w.name,minWidth:w.minWidth}">产品名称</span>
                        <span class="spec" :style="{width:w.price,minWidth:w.minWidth}">单价</span>
                        <span class="spec" :style="{width:w.num,minWidth:w.minWidth}">数量</span>
                        <span class="spec" :style="{width:w.consignee,minWidth:w.minWidth}">买家</span>
                        <span class="spec" :style="{width:w.status,minWidth:w.minWidth}">交易状态</span>
                        <span class="spec" :style="{width:w.collection,minWidth:w.minWidth}">实收款</span>
                    </div>
                    <div v-for="(v,k) in tableData" :key="k" class="tab-wrap">
                        <div class="tab-content-title">
                            <el-checkbox @change="orderCheckBox(v)"></el-checkbox>
                            <span>订单号：{{v.orderNum}}</span>
                            <span style="margin-left:30px">创建时间：{{v.orderCreateTime|formatDate}}</span>
                            <div class="operate-btn-group">
                                <span @click="orderInfo(v)" style="margin:0 15px 0 15px">订单详情</span>
                                <el-popover placement="bottom" width="150" v-model="v.isShowPop" trigger="hover">
                                    <span slot="reference" style="cursor:pointer">标记 &nbsp <span class="star"
                                                                                                :style="{color:v.starColor}">★</span></span>
                                    <span v-for="(v1,k1) in markArr" :key="k1" @click="changeColor(v1,v)"
                                        :style="{color:v1.label,fontSize:'22px',cursor:'pointer',marginRight:'5px'}">★</span>
                                    <el-input v-model="v.adminRemark" placeholder="请输入备注"></el-input>
                                </el-popover>
                            </div>
                        </div>
                        <div class="tab-content">
                            <div class="left">
                                <div v-for="(value,index) in v.orderProduct" :key="index" class="bar">
                                    <div class="name">
                                        <img :src="value.imgUrl" alt="">
                                        <span class="pro-name">{{value.productName}}</span>
                                        <span class="pro-spec">{{value.spec}}</span>
                                    </div>
                                    <div class="price">{{value.price}}</div>
                                    <div class="num">{{value.num}}</div>
                                    <div class="consignee">{{value.receiver}}</div>
                                </div>
                            </div>
                            <div class="center">
                                <div class="status"
                                    :style="{height:120*v.orderProduct.length+v.orderProduct.length-1+'px',lineHeight:120*v.orderProduct.length+v.orderProduct.length-1+'px'}">
                                    <template>已关闭</template>
                                </div>
                                <div class="collection"
                                    :style="{height:120*v.orderProduct.length+v.orderProduct.length-1+'px',paddingTop:120*v.orderProduct.length/2-30+'px'}">
                                    <span>{{v.price | handleMoney}}<br>（含运费：{{v.freightPrice | handleMoney}}）</span>
                                </div>
                            </div>
                        </div>
                    </div>
                  </template>
                </el-tab-pane>
            </el-tabs>
            <div class="block">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from "@/components/common/Breadcrumb.vue";
import * as api from "@/api/OrderManage/GiftOrder/index.js";
import * as pApi from "@/privilegeList/OrderManage/GiftOrder/index.js";
import moment from 'moment';
import utils from "@/utils/index.js";
import { myMixinTable } from '@/JS/commom';

export default {
  components: {
    vBreadcrumb
  },

  mixins:[myMixinTable],

  data() {
    return {
      nav: ["订单管理", "礼包订单"],
      p:{
          orderSendOutGift:false,   // 推送云仓
      },
      tabLoading: false,
      w: {
        name: "28%",
        price: "12%",
        num: "12%",
        consignee: "16%",
        status: "12%",
        collection: "18%",
        minWidth: "100px"
      },
        // 标记列表
      starArr: [
        { label: "红色标记", value: "1" },
        { label: "蓝色标记", value: "2" },
        { label: "绿色标记", value: "3" },
        { label: "黄色标记", value: "4" },
        { label: "紫色标记", value: "5" }
      ],
       // 标记列表
      markArr: [
        { label: "red", value: "1" },
        { label: "skyblue", value: "2" },
        { label: "lightgreen", value: "3" },
        { label: "orange", value: "4" },
        { label: "purple", value: "5" }
      ],
        //当前选项卡值
      activeName: "allOrder",
      tabName: "",
        //  成交时间
      dateRange:[],
      form: {
        productNum: "",   //产品编号
        realName: "",    //买家姓名
        orderNum: "",   //订单编号
        productName: "",  //产品名称
        stars: "",  //订单标记
      },
      url:'',   // 订单列表接口
      status:'',// 订单状态
      tableData: [],
    };
  },

  activated() {
      this.url = api.queryAllGiftBagOrderPageList;
        this.getList(1);
        this.pControl();
  },

  methods: {
      // 权限控制
    pControl() {
      for (const k in this.p) {
        this.p[k] = utils.pc(pApi[k]);
      }
    },
    // 提交表单
    getList(val) {
      let data = {};
      this.page.currentPage = val;
      data.giftBagCode = this.form.productNum;
      data.receiver = this.form.realName;
      data.orderNum = this.form.orderNum;
      data.giftBagName = this.form.productName;
      data.stars = this.form.stars;
      data.startTime =this.dateRange.length!=0?moment(this.dateRange[0]).format('YYYY-MM-DD'):'';
      data.endTime = this.dateRange.length!=0?moment(this.dateRange[1]).format('YYYY-MM-DD'):'';
      data.page = val;
      this.tabLoading = true;
      this.$axios.post(this.url,data).then(res=>{
            this.tabLoading = false;
            for (let i in res.data.data.data) {
                res.data.data.data[i].isShowPop = false;
                res.data.data.data[i].starColor =
                this.markArr[res.data.data.data[i].stars - 1] == undefined
                    ? "#ccc"
                    : this.markArr[res.data.data.data[i].stars - 1].label;
                res.data.data.data[i].price =
                res.data.data.data[i].totalPrice == null
                    ? "0"
                    : res.data.data.data[i].totalPrice;
                this.tableData.push(res.data.data.data[i]);
            }
            this.tableData = res.data.data.data;
            this.page.totalPage = res.data.data.resultCount;
      }).catch(err=>{
          this.tabLoading = false;
      })
    },
    //  重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dateRange = [];
      this.getList(1);
    },
    //  点击tab选项卡
    handleClick(tab) {
      this.activeName = tab.name;
      switch (this.activeName) {
            case 'allOrder':
                this.url = api.queryAllGiftBagOrderPageList;
                break;
            case 'toBePaid':
                this.url = api.queryUnPayGiftBagOrderPageList;
                break;
            case 'toBeSend':
                this.url = api.queryUnSendOutGiftBagOrderPageList;
                break;
            case 'toBeConfirm':
                this.url = api.queryUnVerifyGiftBagOrderPageList;
                break;
            case 'finished':
                this.url = api.queryCompletedGiftBagOrderPageList;
                break;
            case 'closed':
                this.url = api.queryClosedGiftBagOrderPageList;
                break;
      }
      this.getList(1);
    },
    // 修改星级
    changeColor(v1, v) {
      let data = {};
      data.orderId = v.id;
      data.star = v1.value;
      data.remarks = v.adminRemark;
      this.$axios
        .post(api.orderSign, data)
        .then(res => {
          this.$message.success(res.data.data);
          v.starColor = v1.label;
          v.isShowPop = false;
        })
        .catch(err => {
          console.log(res);
        });
    },
    // 推送云仓
    pushCloud(row) {
      this.$axios
        .post(api.orderSendOut, { orderId: row.id })
        .then(res => {
          this.$message.success(res.data.data);
          this.getList(this.page.currentPage);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 订单详情
    orderInfo(row) {
      sessionStorage.setItem("giftOrderInfoId", row.id);
      this.$router.push({ name: "giftOrderInfo", query: { giftOrderInfoId: row.id } });
    },
    // 订单多选框
    orderCheckBox(row) {
      console.log(row);
    },
  }
};
</script>
<style lang='less'>
.gift-list {
    .el-card__body{
        overflow-x: auto;
        min-width: 1336px;
    }
  .el-tabs__active-bar {
    background-color: #ff1e30;
  }
  .el-tabs__item.is-active,
  .el-tabs__item:hover {
    color: #ff1e30;
  }
  .query-panue {
    .el-input--small .el-input__inner,
    .el-input--small {
      width: 220px;
    }
  }
  .btn-group {
    margin:0 0 10px 30px;
  }
  .block {
    margin: 20px 0px;
  }
  .tab-title {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #eee;
    background-color: #f7f7f7;
    margin-bottom: 20px;
    .spec {
      display: inline-block;
      text-align: center;
      box-sizing: border-box;
    }
  }
  .tab-wrap {
    border: 1px solid #eee;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 20px;
    .tab-content-title {
      width: 100%;
      height: 40px;
      background-color: #f7f7f7;
      padding: 0 18px;
      line-height: 40px;
      border-bottom: 1px solid #eee;
      span {
        font-size: 14px;
        color: #666;
      }
      .star {
        font-size: 22px;
        vertical-align: middle;
        cursor: pointer;
      }
      .operate-btn-group {
        float: right;
        margin-right: 90px;
        span {
          color: #33b4ff;
          cursor: pointer;
        }
      }
    }
    .tab-content {
      .left {
        float: left;
        width: 68%;
        border-right: 1px solid #eee;
        .bar {
          padding: 10px;
          box-sizing: border-box;
          font-size: 14px;
          overflow: hidden;
          border-bottom: 1px solid #eee;
          .name {
            float: left;
            position: relative;
            display: inline-block;
            height: 100px;
            width: 38%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100px;
              height: 100px;
              border-radius: 5px;
              border: 1px solid #eee;
            }
            .pro-name {
              position: absolute;
              top: 5px;
              left: 110px;
              display: inline-block;
            }
            .pro-spec {
              position: absolute;
              bottom: 5px;
              left: 110px;
              display: inline-block;
            }
          }
          .price {
            float: left;
            display: inline-block;
            width: 16%;
            height: 100px;
            margin-left: 4%;
            text-align: center;
            line-height: 100px;
          }
          .num {
            float: left;
            display: inline-block;
            width: 21%;
            height: 100px;
            text-align: center;
            line-height: 100px;
          }
          .consignee {
            float: left;
            display: inline-block;
            width: 15%;
            height: 100px;
            margin-left: 4%;
            text-align: center;
            line-height: 100px;
          }
        }
        .bar:last-child {
          border-bottom: none;
        }
      }
      .center {
        float: left;
        width: 31%;
        font-size: 14px;
        .status {
          display: inline-block;
          float: left;
          width: 50%;
          text-align: center;
          border-right: 1px solid #eee;
        }
        .collection {
          display: inline-block;
          float: left;
          width: 46%;
          text-align: center;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>
