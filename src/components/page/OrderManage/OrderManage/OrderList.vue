<template>
    <div class="product-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="query-panue" :body-style="{ padding: '20px 20px'}">
            <el-form :model="form" ref="form" inline label-width="120px">
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
                <el-form-item prop="receiver" label="收货人姓名">
                    <el-input v-model="form.receiver" placeholder="请输入收货人姓名"></el-input>
                </el-form-item>
                <el-form-item prop="recevicePhone" label="收货人手机">
                    <el-input v-model="form.recevicePhone" placeholder="请输入收货人手机号"></el-input>
                </el-form-item>
                <el-form-item prop="dateRange" label="下单时间">
                    <el-date-picker
                        v-model="dateRange"
                        type="datetimerange"
                        format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="refundStatus" label="退款状态">
                    <el-select v-model="form.refundStatus" placeholder="请选择">
                      <el-option label="暂不选择" value=""></el-option>
                        <el-option v-for="(v,k) in refundStatusArr" :label="v.type" :value="v.id" :key="k">{{v.type}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="afterSaleStatus" label="售后状态">
                    <el-select v-model="form.afterSaleStatus" placeholder="请选择">
                      <el-option label="暂不选择" value=""></el-option>
                      <el-option v-for="(v,k) in afterSaleStatusArr" :label="v.type" :value="v.id" :key="k">{{v.type}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="closeReason" label="关闭状态">
                    <el-select v-model="form.closeReason" placeholder="请选择">
                        <el-option label="暂不选择" value=""></el-option>
                        <el-option v-for="(v,k) in closeReasonArr" :label="v.type" :value="v.id" :key="k">{{v.type}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="getList(1)">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style='margin-top:20px;minHeight:90vh;overflow-x: auto;min-width: 1336px' :body-style="{ padding: '20px 50px' }">
            <div class="btn-group">
                <el-button type="primary">批量导出</el-button>
                <el-button type="warning" @click="orderBtn('today')">今日订单</el-button>
                <el-button type="warning" @click="orderBtn('yesterday')">昨日订单</el-button>
                <el-button type="warning" @click="orderBtn('threeMonths')">最近三个月订单</el-button>
                <el-button type="warning" @click="unDealOrder">待处理订单</el-button>
            </div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane v-loading="tabLoading" style="min-width:1366px" label="全部订单" name="allOrder">
                    <template v-if='activeName == "allOrder"'>
                        <div class="tab-title">
                            <span class="spec" :style="{width:w.name,minWidth:w.minWidth}">产品名称</span>
                            <span class="spec" :style="{width:w.price,minWidth:w.minWidth}">单价</span>
                            <span class="spec" :style="{width:w.num,minWidth:w.minWidth}">数量</span>
                            <span class="spec" :style="{width:w.consignee,minWidth:w.minWidth}">收货人</span>
                            <span class="spec" :style="{width:w.status,minWidth:w.minWidth}">交易状态</span>
                            <span class="spec" :style="{width:w.collection,minWidth:w.minWidth}">实收款</span>
                            <span class="spec" :style="{width:w.shipper,minWidth:w.minWidth}">发货方</span>
                            <span class="spec" :style="{width:w.operate,minWidth:w.minWidth}">操作</span>
                        </div>
                        <div v-for="(v,k) in tableData" :key="k" class="tab-wrap">
                            <div class="tab-content-title">
                                <el-checkbox @change="orderCheckBox(v)"></el-checkbox>
                                <span>订单号：{{v.orderNum}}</span>
                                <span style="margin-left:30px">创建时间：{{v.orderCreateTime|formatDate}}</span>
                                <div class="operate-btn-group">
                                    <span v-if='v.status == 2' @click="pushCloud(v)">推送云仓</span>
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
                                    <div v-for="(value,index) in v.orderProductList" :key="index" class="bar">
                                        <div class="name">
                                            <img :src="value.imgUrl" alt="">
                                            <span class="pro-name">{{value.productName}}</span>
                                            <span class="pro-spec">{{value.spec}}</span>
                                        </div>
                                        <div class="price">{{value.price}}</div>
                                        <div class="num">{{value.num}}</div>
                                        <div class="consignee">{{v.receiver}}</div>
                                    </div>
                                </div>
                                <div class="center">
                                    <div class="status"
                                        :style="{height:120*v.orderProductList.length+v.orderProductList.length-1+'px',lineHeight:120*v.orderProductList.length+v.orderProductList.length-1+'px'}">
                                        <template v-if='v.status == 1'>待支付</template>
                                        <template v-if='v.status == 2'>待发货</template>
                                        <template v-if='v.status == 3'>待收货</template>
                                        <template v-if='v.status == 4'>确认收货</template>
                                        <template v-if='v.status == 5'>已完成</template>
                                        <template v-if='v.status == 6'>已关闭(退款关闭)</template>
                                        <template v-if='v.status == 7'>已关闭(用户关闭)</template>
                                        <template v-if='v.status == 8'>已关闭(超时关闭)</template>
                                    </div>
                                    <div class="collection"
                                        :style="{height:120*v.orderProductList.length+v.orderProductList.length-1+'px',paddingTop:120*v.orderProductList.length/2-30+'px'}">
                                        <span>{{v.totalPrice | handleMoney}}<br>（含运费：{{v.freightPrice | handleMoney}}）</span>
                                    </div>
                                </div>
                                <div class="right">
                                    <div v-for="(value,index) in v.orderProductList" :key="index" class="bar">
                                        <div class="shipper">{{value.origin}}</div>
                                        <div class="operate">
                                            <template v-if="value.returnType">
                                                <!--退款-->
                                                <template v-if="value.returnType==1">
                                                     <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">退款中</el-button>
                                                     <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">退款完成</el-button>
                                                </template>
                                                <!--退货-->
                                                <template v-if="value.returnType==2">
                                                     <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">退货中</el-button>
                                                     <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">退货完成</el-button>
                                                </template>
                                                <!--换货-->
                                                <template v-if="value.returnType==3">
                                                     <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">换货中</el-button>
                                                     <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">换货完成</el-button>
                                                </template>
                                            </template>
                                            <template v-else>
                                                <template v-if="value.status==6">已完成</template>
                                            </template>
                                        </div>
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
                      <span class="spec" :style="{width:w.consignee,minWidth:w.minWidth}">收货人</span>
                      <span class="spec" :style="{width:w.status,minWidth:w.minWidth}">交易状态</span>
                      <span class="spec" :style="{width:w.collection,minWidth:w.minWidth}">实收款</span>
                      <span class="spec" :style="{width:w.shipper,minWidth:w.minWidth}">发货方</span>
                      <span class="spec" :style="{width:w.operate,minWidth:w.minWidth}">操作</span>
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
                              <div v-for="(value,index) in v.orderProductList" :key="index" class="bar">
                                  <div class="name">
                                      <img :src="value.imgUrl" alt="">
                                      <span class="pro-name">{{value.productName}}</span>
                                      <span class="pro-spec">{{value.spec}}</span>
                                  </div>
                                  <div class="price">{{value.price}}</div>
                                  <div class="num">{{value.num}}</div>
                                  <div class="consignee">{{v.receiver}}</div>
                              </div>
                          </div>
                          <div class="center">
                              <div class="status"
                                  :style="{height:120*v.orderProductList.length+v.orderProductList.length-1+'px',lineHeight:120*v.orderProductList.length+v.orderProductList.length-1+'px'}">
                                  <template>{{status}}</template>
                              </div>
                              <div class="collection"
                                  :style="{height:120*v.orderProductList.length+v.orderProductList.length-1+'px',paddingTop:120*v.orderProductList.length/2-30+'px'}">
                                  <span>{{v.totalPrice | handleMoney}}<br>（含运费：{{v.freightPrice | handleMoney}}）</span>
                              </div>
                          </div>
                          <div class="right">
                                <div v-for="(value,index) in v.orderProductList" :key="index" class="bar">
                                    <div class="shipper">{{value.origin}}</div>
                                    <div class="operate">
                                        <template v-if="value.returnType">
                                            <!--退款-->
                                            <template v-if="value.returnType==1">
                                                <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">退款中</el-button>
                                                <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">退款完成</el-button>
                                            </template>
                                            <!--退货-->
                                            <template v-if="value.returnType==2">
                                                <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">退货中</el-button>
                                                <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">退货完成</el-button>
                                            </template>
                                            <!--换货-->
                                            <template v-if="value.returnType==3">
                                                <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">换货中</el-button>
                                                <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">换货完成</el-button>
                                            </template>
                                        </template>
                                        <template v-else>
                                            <template v-if="value.status==6">已完成</template>
                                        </template>
                                    </div>
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
                        <span class="spec" :style="{width:w.consignee,minWidth:w.minWidth}">收货人</span>
                        <span class="spec" :style="{width:w.status,minWidth:w.minWidth}">交易状态</span>
                        <span class="spec" :style="{width:w.collection,minWidth:w.minWidth}">实收款</span>
                        <span class="spec" :style="{width:w.shipper,minWidth:w.minWidth}">发货方</span>
                        <span class="spec" :style="{width:w.operate,minWidth:w.minWidth}">操作</span>
                    </div>
                    <div v-for="(v,k) in tableData" :key="k" class="tab-wrap">
                        <div class="tab-content-title">
                            <el-checkbox @change="orderCheckBox(v)"></el-checkbox>
                            <span>订单号：{{v.orderNum}}</span>
                            <span style="margin-left:30px">创建时间：{{v.orderCreateTime|formatDate}}</span>
                            <div class="operate-btn-group">
                                <span @click="pushCloud(v)">推送云仓</span>
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
                                <div v-for="(value,index) in v.orderProductList" :key="index" class="bar">
                                    <div class="name">
                                        <img :src="value.imgUrl" alt="">
                                        <span class="pro-name">{{value.productName}}</span>
                                        <span class="pro-spec">{{value.spec}}</span>
                                    </div>
                                    <div class="price">{{value.price}}</div>
                                    <div class="num">{{value.num}}</div>
                                    <div class="consignee">{{v.receiver}}</div>
                                </div>
                            </div>
                            <div class="center">
                                <div class="status"
                                    :style="{height:120*v.orderProductList.length+v.orderProductList.length-1+'px',lineHeight:120*v.orderProductList.length+v.orderProductList.length-1+'px'}">
                                    <template>{{status}}</template>
                                </div>
                                <div class="collection"
                                    :style="{height:120*v.orderProductList.length+v.orderProductList.length-1+'px',paddingTop:120*v.orderProductList.length/2-30+'px'}">
                                    <span>{{v.totalPrice | handleMoney}}<br>（含运费：{{v.freightPrice | handleMoney}}）</span>
                                </div>
                            </div>
                            <div class="right">
                                <div v-for="(value,index) in v.orderProductList" :key="index" class="bar">
                                    <div class="shipper">{{value.origin}}</div>
                                    <div class="operate">
                                        <template v-if="value.returnType">
                                            <!--退款-->
                                            <template v-if="value.returnType==1">
                                                <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">退款中</el-button>
                                                <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">退款完成</el-button>
                                            </template>
                                            <!--退货-->
                                            <template v-if="value.returnType==2">
                                                <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">退货中</el-button>
                                                <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">退货完成</el-button>
                                            </template>
                                            <!--换货-->
                                            <template v-if="value.returnType==3">
                                                <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">换货中</el-button>
                                                <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">换货完成</el-button>
                                            </template>
                                        </template>
                                        <template v-else>
                                            <template v-if="value.status==6">已完成</template>
                                        </template>
                                    </div>
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
                          <span class="spec" :style="{width:w.consignee,minWidth:w.minWidth}">收货人</span>
                          <span class="spec" :style="{width:w.status,minWidth:w.minWidth}">交易状态</span>
                          <span class="spec" :style="{width:w.collection,minWidth:w.minWidth}">实收款</span>
                          <span class="spec" :style="{width:w.shipper,minWidth:w.minWidth}">发货方</span>
                          <span class="spec" :style="{width:w.operate,minWidth:w.minWidth}">操作</span>
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
                                  <div v-for="(value,index) in v.orderProductList" :key="index" class="bar">
                                      <div class="name">
                                          <img :src="value.imgUrl" alt="">
                                          <span class="pro-name">{{value.productName}}</span>
                                          <span class="pro-spec">{{value.spec}}</span>
                                      </div>
                                      <div class="price">{{value.price}}</div>
                                      <div class="num">{{value.num}}</div>
                                      <div class="consignee">{{v.receiver}}</div>
                                  </div>
                              </div>
                              <div class="center">
                                  <div class="status"
                                      :style="{height:120*v.orderProductList.length+v.orderProductList.length-1+'px',lineHeight:120*v.orderProductList.length+v.orderProductList.length-1+'px'}">
                                      <template>{{status}}</template>
                                  </div>
                                  <div class="collection"
                                      :style="{height:120*v.orderProductList.length+v.orderProductList.length-1+'px',paddingTop:120*v.orderProductList.length/2-30+'px'}">
                                      <span>{{v.totalPrice | handleMoney}}<br>（含运费：{{v.freightPrice | handleMoney}}）</span>
                                  </div>
                              </div>
                              <div class="right">
                                  <div v-for="(value,index) in v.orderProductList" :key="index" class="bar">
                                        <div class="shipper">{{value.origin}}</div>
                                        <div class="operate">
                                            <template v-if="value.returnType">
                                                <!--退款-->
                                                <template v-if="value.returnType==1">
                                                    <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">退款中</el-button>
                                                    <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">退款完成</el-button>
                                                </template>
                                                <!--退货-->
                                                <template v-if="value.returnType==2">
                                                    <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">退货中</el-button>
                                                    <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">退货完成</el-button>
                                                </template>
                                                <!--换货-->
                                                <template v-if="value.returnType==3">
                                                    <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">换货中</el-button>
                                                    <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">换货完成</el-button>
                                                </template>
                                            </template>
                                            <template v-else>
                                                <template v-if="value.status==6">已完成</template>
                                            </template>
                                        </div>
                                    </div>
                              </div>
                          </div>
                      </div>
                  </template>
                </el-tab-pane>
                <el-tab-pane v-loading="tabLoading" label="退款中" name="toBeStay">
                    <template v-if='activeName == "toBeStay"'>
                        <div class="tab-title">
                            <span class="spec" :style="{width:w.name,minWidth:w.minWidth}">产品名称</span>
                            <span class="spec" :style="{width:w.price,minWidth:w.minWidth}">单价</span>
                            <span class="spec" :style="{width:w.num,minWidth:w.minWidth}">数量</span>
                            <span class="spec" :style="{width:w.consignee,minWidth:w.minWidth}">收货人</span>
                            <span class="spec" :style="{width:w.status,minWidth:w.minWidth}">交易状态</span>
                            <span class="spec" :style="{width:w.collection,minWidth:w.minWidth}">实收款</span>
                            <span class="spec" :style="{width:w.shipper,minWidth:w.minWidth}">发货方</span>
                            <span class="spec" :style="{width:w.operate,minWidth:w.minWidth}">操作</span>
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
                                    <div v-for="(value,index) in v.orderProductList" :key="index" class="bar">
                                        <div class="name">
                                            <img :src="value.imgUrl" alt="">
                                            <span class="pro-name">{{value.productName}}</span>
                                            <span class="pro-spec">{{value.spec}}</span>
                                        </div>
                                        <div class="price">{{value.price}}</div>
                                        <div class="num">{{value.num}}</div>
                                        <div class="consignee">{{v.receiver}}</div>
                                    </div>
                                </div>
                                <div class="center">
                                    <div class="status"
                                         :style="{height:120*v.orderProductList.length+v.orderProductList.length-1+'px',lineHeight:120*v.orderProductList.length+v.orderProductList.length-1+'px'}">
                                        <template>{{status}}</template>
                                    </div>
                                    <div class="collection"
                                         :style="{height:120*v.orderProductList.length+v.orderProductList.length-1+'px',paddingTop:120*v.orderProductList.length/2-30+'px'}">
                                        <span>{{v.totalPrice | handleMoney}}<br>（含运费：{{v.freightPrice | handleMoney}}）</span>
                                    </div>
                                </div>
                                <div class="right">
                                    <div v-for="(value,index) in v.orderProductList" :key="index" class="bar">
                                        <div class="shipper">{{value.origin}}</div>
                                        <div class="operate">
                                            <template v-if="value.returnType">
                                                <!--退款-->
                                                <template v-if="value.returnType==1">
                                                    <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">退款中</el-button>
                                                    <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">退款完成</el-button>
                                                </template>
                                                <!--退货-->
                                                <template v-if="value.returnType==2">
                                                    <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">退货中</el-button>
                                                    <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">退货完成</el-button>
                                                </template>
                                                <!--换货-->
                                                <template v-if="value.returnType==3">
                                                    <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">换货中</el-button>
                                                    <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">换货完成</el-button>
                                                </template>
                                            </template>
                                            <template v-else>
                                                <template v-if="value.status==6">已完成</template>
                                            </template>
                                        </div>
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
                        <span class="spec" :style="{width:w.consignee,minWidth:w.minWidth}">收货人</span>
                        <span class="spec" :style="{width:w.status,minWidth:w.minWidth}">交易状态</span>
                        <span class="spec" :style="{width:w.collection,minWidth:w.minWidth}">实收款</span>
                        <span class="spec" :style="{width:w.shipper,minWidth:w.minWidth}">发货方</span>
                        <span class="spec" :style="{width:w.operate,minWidth:w.minWidth}">操作</span>
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
                                <div v-for="(value,index) in v.orderProductList" :key="index" class="bar">
                                    <div class="name">
                                        <img :src="value.imgUrl" alt="">
                                        <span class="pro-name">{{value.productName}}</span>
                                        <span class="pro-spec">{{value.spec}}</span>
                                    </div>
                                    <div class="price">{{value.price}}</div>
                                    <div class="num">{{value.num}}</div>
                                    <div class="consignee">{{v.receiver}}</div>
                                </div>
                            </div>
                            <div class="center">
                                <div class="status"
                                    :style="{height:120*v.orderProductList.length+v.orderProductList.length-1+'px',lineHeight:120*v.orderProductList.length+v.orderProductList.length-1+'px'}">
                                    <template>{{status}}</template>
                                </div>
                                <div class="collection"
                                    :style="{height:120*v.orderProductList.length+v.orderProductList.length-1+'px',paddingTop:120*v.orderProductList.length/2-30+'px'}">
                                    <span>{{v.totalPrice | handleMoney}}<br>（含运费：{{v.freightPrice | handleMoney}}）</span>
                                </div>
                            </div>
                            <div class="right">
                                <div v-for="(value,index) in v.orderProductList" :key="index" class="bar">
                                        <div class="shipper">{{value.origin}}</div>
                                        <div class="operate">
                                            <template v-if="value.returnType">
                                                <!--退款-->
                                                <template v-if="value.returnType==1">
                                                    <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">退款中</el-button>
                                                    <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">退款完成</el-button>
                                                </template>
                                                <!--退货-->
                                                <template v-if="value.returnType==2">
                                                    <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">退货中</el-button>
                                                    <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">退货完成</el-button>
                                                </template>
                                                <!--换货-->
                                                <template v-if="value.returnType==3">
                                                    <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">换货中</el-button>
                                                    <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">换货完成</el-button>
                                                </template>
                                            </template>
                                            <template v-else>
                                                <template v-if="value.status==6">已完成</template>
                                            </template>
                                        </div>
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
                        <span class="spec" :style="{width:w.consignee,minWidth:w.minWidth}">收货人</span>
                        <span class="spec" :style="{width:w.status,minWidth:w.minWidth}">交易状态</span>
                        <span class="spec" :style="{width:w.collection,minWidth:w.minWidth}">实收款</span>
                        <span class="spec" :style="{width:w.shipper,minWidth:w.minWidth}">发货方</span>
                        <span class="spec" :style="{width:w.operate,minWidth:w.minWidth}">操作</span>
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
                                <div v-for="(value,index) in v.orderProductList" :key="index" class="bar">
                                    <div class="name">
                                        <img :src="value.imgUrl" alt="">
                                        <span class="pro-name">{{value.productName}}</span>
                                        <span class="pro-spec">{{value.spec}}</span>
                                    </div>
                                    <div class="price">{{value.price}}</div>
                                    <div class="num">{{value.num}}</div>
                                    <div class="consignee">{{v.receiver}}</div>
                                </div>
                            </div>
                            <div class="center">
                                <div class="status"
                                    :style="{height:120*v.orderProductList.length+v.orderProductList.length-1+'px',lineHeight:120*v.orderProductList.length+v.orderProductList.length-1+'px'}">
                                    <template v-if='v.status == 6'>已关闭(退款关闭)</template>
                                    <template v-if='v.status == 7'>已关闭(用户关闭)</template>
                                    <template v-if='v.status == 8'>已关闭(超时关闭)</template>
                                </div>
                                <div class="collection"
                                    :style="{height:120*v.orderProductList.length+v.orderProductList.length-1+'px',paddingTop:120*v.orderProductList.length/2-30+'px'}">
                                    <span>{{v.totalPrice | handleMoney}}<br>（含运费：{{v.freightPrice | handleMoney}}）</span>
                                </div>
                            </div>
                            <div class="right">
                                <div v-for="(value,index) in v.orderProductList" :key="index" class="bar">
                                    <div class="shipper">{{value.origin}}</div>
                                    <div class="operate">
                                        <template v-if="value.returnType">
                                            <!--退款-->
                                            <template v-if="value.returnType==1">
                                                <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">退款中</el-button>
                                                <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">退款完成</el-button>
                                            </template>
                                            <!--退货-->
                                            <template v-if="value.returnType==2">
                                                <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">退货中</el-button>
                                                <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">退货完成</el-button>
                                            </template>
                                            <!--换货-->
                                            <template v-if="value.returnType==3">
                                                <el-button v-if="value.returnProductStatus!=6" @click='toAfterSale(value.id)' type="primary">换货中</el-button>
                                                <el-button v-if="value.returnProductStatus==6" @click='toAfterSale(value.id)' type="primary">换货完成</el-button>
                                            </template>
                                        </template>
                                        <template v-else>
                                            <template v-if="value.status==6">已完成</template>
                                        </template>
                                    </div>
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
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import moment from 'moment';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';

export default {
    components: {
        vBreadcrumb
    },

    mixins: [myMixinTable],

    data() {
        return {

            nav: ['订单管理', '订单管理'],
            tabLoading: false,
            w: {
                name: '25%',
                price: '8%',
                num: '8%',
                consignee: '12%',
                status: '8%',
                collection: '12%',
                shipper: '8%',
                operate: '15%',
                minWidth: '100px'
            },
            starArr: [
                { label: '红色标记', value: '1' },
                { label: '蓝色标记', value: '2' },
                { label: '绿色标记', value: '3' },
                { label: '黄色标记', value: '4' },
                { label: '紫色标记', value: '5' }
            ],
            markArr: [
                { label: 'red', value: '1' },
                { label: 'skyblue', value: '2' },
                { label: 'lightgreen', value: '3' },
                { label: 'orange', value: '4' },
                { label: 'purple', value: '5' }
            ],
            activeName: 'allOrder',
            tabName: '',
            status: '',
            dateRange: [],
            form: {
                orderNum: '',
                productName: '',
                receiver: '',
                recevicePhone: '',
                stars: '',
                today: '',
                yesterday: '',
                threeMonths: '',
                closeReason: '',
                pickUp: '',
                afterSaleStatus: '', // 售后状态
                refundStatus: ''// 退款状态
            },
            url: '', // 请求地址
            priUrl: '', // 权限地址,
            tableData: [],
            // 售后状态数组
            afterSaleStatusArr: [{
                type: '售后中+售后完毕',
                id: 1
            }, {
                type: '售后中',
                id: 2
            }, {
                type: '售后完毕',
                id: 3
            }],
            // 退款状态数组
            refundStatusArr: [{
                type: '退款中+退款成功',
                id: 1
            }, {
                type: '退款中',
                id: 2
            }, {
                type: '退款成功',
                id: 3
            }, {
                type: '换货中',
                id: 4
            }, {
                type: '换货成功',
                id: 5
            }],
            // 关闭状态
            closeReasonArr: [{
                type: '取消超时关闭',
                id: 1
            }, {
                type: '退款完成',
                id: 2
            }]
        };
    },

    created() {
        this.url = 'queryOrderPageList';
    },

    activated() {
        this.getList(1);
    },

    methods: {
        // 提交表单
        getList(val) {
            this.page.currentPage = 1;
            this.tableData = [];
            const data = {};
            Object.assign(data, this.form);
            data.startTime = this.dateRange.length != 0 ? moment(this.dateRange[0]).format('YYYY-MM-DD') : '';
            data.endTime = this.dateRange.length != 0 ? moment(this.dateRange[1]).format('YYYY-MM-DD') : '';
            data.page = val;
            data.size = this.page.pageSize;
            this.tabLoading = true;
            request[this.url](data).then(res => {
                console.log(res)
                this.tabLoading = false;
                for (const i in res.data.data) {
                    // res.data.data[i].isShowPop = false;
                    // res.data.data[i].starColor =
                    //     this.markArr[res.data.data[i].stars - 1] == undefined
                    //         ? '#ccc'
                    //         : this.markArr[res.data.data[i].stars - 1].label;
                    // res.data.data[i].price =
                    //     res.data.data[i].totalPrice == null
                    //         ? '0'
                    //         : res.data.data[i].totalPrice;
                    this.tableData.push(res.data.data[i]);
                }
                this.page.totalPage = res.data.totalNum;
                this.form.today = '';
                this.form.yesterday = '';
                this.form.threeMonths = '';
            }).catch(err => {
                this.tabLoading = false;
                console.log(err);
            });
        },
        //  重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.form.today = '';
            this.form.yesterday = '';
            this.form.threeMonths = '';
            this.dateRange = [];
            this.getList(1);
        },
        //  点击tab选项卡
        handleClick(tab) {
            this.activeName = tab.name;
            this.getQueryStatus(this.activeName);
        },
        // 获取订单状态
        getQueryStatus(n) {
            // 所有订单
            this.url = 'queryOrderPageList';
            if (n == 'allOrder') {
                this.status = '';
            } else if (n == 'toBePaid') {
                // 待支付订单
                // this.url = 'queryUnPaidOrderPageList';
                this.status = '待支付';
            } else if (n == 'toBeSend') {
                // 待发货订单
                // this.url = '5';
                this.status = '待发货';
                // this.url = 'queryUnSendOutOrderPageList';
            } else if (n == 'toBeStay') {
                // 待自提订单
                // this.url = 'queryPickUpByCustomerOrderPageList';
                this.status = '待自提';
            } else if (n == 'toBeConfirm') {
                // 待确认订单
                // this.url = 'queryWaitReceivingOrderPageList';
                this.status = '待确认';
            } else if (n == 'finished') {
                // 已完成订单
                // this.url = 'queryCompletedOrderPageList';
                this.status = '已完成';
            } else if (n == 'closed') {
                // 已关闭订单
                this.url = 'queryClosedOrderPageList';
                this.status = '已关闭';
            }
            this.getList(1);
        },
        // 修改星级
        changeColor(v1, v) {
            const data = {};
            data.orderId = v.id;
            data.star = v1.value;
            data.remarks = v.adminRemark;
            request.orderSign(data).then(res => {
                this.$message.success(res.msg);
                v.starColor = v1.label;
                v.isShowPop = false;
            }).catch(err => {
                console.log(err);
            });
        },
        // 推送云仓
        pushCloud(row) {
            request.orderSendOut({ orderId: row.id }).then(res => {
                this.$message.success(res.data.data);
                this.getList(this.page.currentPage);
            }).catch(err => {
                console.log(err);
            });
        },
        // 订单详情
        orderInfo(row) {
            sessionStorage.setItem('orderInfoId', row.id);
            this.$router.push({ name: 'orderInfo', query: { orderInfoId: row.id }});
        },
        // 订单多选框
        orderCheckBox(row) {
            console.log(row);
        },
        // 订单按钮
        orderBtn(status) {
            if (status == 'today') {
                this.form.today = 'yes';
                this.form.yesterday = '';
                this.form.threeMonths = '';
            } else if (status == 'yesterday') {
                this.form.today = '';
                this.form.yesterday = 'yes';
                this.form.threeMonths = '';
            } else if (status == 'threeMonths') {
                this.form.today = '';
                this.form.yesterday = '';
                this.form.threeMonths = 'yes';
            }
            this.getList(1);
        },
        // 更改订单状态（单个）
        changeStatus(row, status) {
            if (status == 3) {
                request.pickUpOrderProduct({ orderProductId: row.id }).then(res => {
                    this.$message.success(res.data.data);
                    this.getList(1);
                }).catch(err => {
                    console.log(err);
                });
            }
        },
        // 待处理订单
        unDealOrder() {
            this.$router.push('/undealOrder');
        },
        toAfterSale(id) {
            sessionStorage.setItem('afterSaleOprId', id);
            this.$router.push({ path: '/afterSaleOpr', query: { afterSaleOprId: id }});
        }
    }
};
</script>
<style lang='less'>
.product-list {
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
    margin-bottom: 10px;
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
        width: 53%;
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
            width: 43%;
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
            width: 16%;
            height: 100px;
            text-align: center;
            line-height: 100px;
          }
          .consignee {
            float: left;
            display: inline-block;
            width: 16%;
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
        border-right: 1px solid #eee;
        width: 21%;
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
      .right {
        float: left;
        width: 25%;
        .bar {
          padding: 10px;
          box-sizing: border-box;
          font-size: 14px;
          overflow: hidden;
          border-bottom: 1px solid #eee;
          .shipper {
            float: left;
            width: 36%;
            height: 100px;
            text-align: center;
            line-height: 100px;
          }
          .operate {
            float: left;
            width: 63%;
            height: 100px;
            text-align: center;
            line-height: 100px;
          }
        }
        .bar:last-child {
          border: none;
        }
      }
    }
  }
}
</style>
