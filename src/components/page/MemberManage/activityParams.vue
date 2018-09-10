<template>
    <div class="activityParams">
        <v-breadcrumb :nav="['经销商会员管理','会员管理','活跃度参数设置']"></v-breadcrumb>
        <el-card style="margin:10px 0 20px" >
            <el-form ref="form" :inline="true" :model="form">
                <div class="cardContent">
                    <div class="card-title">
                        每日登录频率
                    </div>
                    <div class="card-line">
                        <el-form-item label="达到">
                            <el-input style="width:180px;height: 40px" placeholder="请输入数值" v-model="form.val"></el-input>
                            <span class="unit">次</span>
                        </el-form-item>
                        <el-form-item label="增加">
                            <el-input style="width:180px" placeholder="请输入数值"></el-input>
                            <span class="unit">分</span>
                        </el-form-item>
                    </div>
                </div>
                <div class="cardContent">
                    <div class="card-title">
                        每日交易情况
                    </div>
                    <div class="card-line">
                        <el-form-item label="达到">
                            <el-input style="width:180px" placeholder="请输入数值"></el-input>
                            <span class="unit">次</span>
                        </el-form-item>
                        <el-form-item label="增加">
                            <el-input style="width:180px" placeholder="请输入数值"></el-input>
                            <span class="unit">分</span>
                        </el-form-item>
                    </div>
                </div>
                <div class="cardContent">
                    <div class="card-title">
                        每日邀请情况
                    </div>
                    <div class="card-line">
                        <el-form-item label="达到">
                            <el-input style="width:180px" placeholder="请输入数值"></el-input>
                            <span class="unit">次</span>
                        </el-form-item>
                        <el-form-item label="增加">
                            <el-input style="width:180px" placeholder="请输入数值"></el-input>
                            <span class="unit">分</span>
                        </el-form-item>
                    </div>
                </div>
                <div class="cardContent">
                    <div class="card-title">
                        每日账户提现
                    </div>
                    <div class="card-line">
                        <span class="lineInfo">出现提现并成功</span>
                        <el-form-item label="增加">
                            <el-input style="width:180px" placeholder="请输入数值"></el-input>
                            <span class="unit">分</span>
                        </el-form-item>
                    </div>
                </div>
                <div class="cardContent">
                    <div>
                        活跃等级
                    </div>
                    <div style="width: 400px" class="tableBox card-line">
                        <el-row>
                            <el-col :span="6">
                                <div class="grid-content bg-purple">等级</div>
                            </el-col>
                            <el-col :span="6">
                                <div class="grid-content bg-purple-light">不活跃</div>
                            </el-col>
                            <el-col :span="6"><div class="grid-content bg-purple">活跃</div></el-col>
                            <el-col :span="6"><div class="grid-content bg-purple-light">忠实</div></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <div class="grid-content bg-purple">积分</div>
                            </el-col>
                            <el-col :span="6">
                                <div class="grid-content bg-purple-light">
                                    <el-input  placeholder="0"></el-input>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="grid-content bg-purple">
                                    <el-input  placeholder="0"></el-input>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="grid-content bg-purple-light">
                                    <el-input  placeholder="0"></el-input>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
               <div class="cardContent cadBtn" >
                   <el-form-item>
                       <el-button type="primary">确认保存</el-button>
                       <el-button >取消</el-button>
                   </el-form-item>
               </div>
            </el-form>
        </el-card>
    </div>
</template>


<script>
    import vBreadcrumb from '../../common/Breadcrumb.vue';
    import { getUserId } from '../../../JS/commom.js';

    export default {
        components: {
            vBreadcrumb
        },
        mixins: [getUserId],
        data: function () {
            return {
                id:'', //用户ID
                form:{
                    val:'1111'
                }

            }
        },
        activated() {
            this.getUserId()
        },
        methods: {

        }
    }
</script>
<style>
    .activityParams .el-input--small .el-input__inner{
        height: 40px;
        line-height: 40px;
        width: 180px;
    }
    .activityParams .el-form-item--small .el-form-item__label{
        line-height: 40px;
    }
    .activityParams .tableBox .el-input--small .el-input__inner{
        line-height: 30px;
        height: 30px;
        width: 80px;
        text-align: center;
        vertical-align: middle;
    }
    .activityParams .tableBox  .el-input--small{
        vertical-align: top;
        display: flex;
        height: 40px;
        align-items: center;
        justify-content: center;
    }
</style>
<style lang="less" scoped>
    .cardContent{
       padding-left: 30px;
       padding-top: 10px;
       color: #666666;
       .card-line{
           padding-left: 10px;
           margin-top: 20px;
           .unit{
               padding-left:10px;
               padding-right: 25px;
           }
           .lineInfo{
               font-size: 14px;
               display: inline-block;
               height:40px;
               line-height: 40px;
               margin-right: 15px;
           }
       }
        .el-row{
            height: 40px;
            line-height: 40px;
            border:1px solid #dfdfdf;
            text-align: center;
            border-right: 0;
            overflow: hidden;
        }
        .el-col{
            border-right: 1px solid #dfdfdf ;
        }
        .tableBox>div:first-child{
            border-bottom: 0;
        }
    }
    .cadBtn{
        padding-left: 50px;
        margin-top: 60px;
        padding-bottom: 50px;
    }
</style>
