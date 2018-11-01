<template>
    <div class="repertory-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }" style='margin-top:20px'>
           <el-button type="primary" style="margin-bottom: 20px" @click="$router.push({path:'repertorySet',query:{type:'add'}})">新建仓库</el-button>
            <el-table :data="tableData" border>
                <el-table-column prop="province" label="省" align="center"></el-table-column>
                <el-table-column prop="name" label="发货仓">
                    <template slot-scope="scope">
                        <div class="fl">
                            <div v-for="(v,k) in scope.row.send" :key="k" v-if="k<3">发货仓{{k}}：<div class="text-wrap">{{v.name}}</div></div>
                        </div>
                        <div class="fr">
                            <span class="color-blue" @click="watchAll(scope.row)">查看全部</span>
                            <i class="el-icon-circle-plus-outline" @click="addRepertory(scope.row)"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="退货仓">
                    <template slot-scope="scope">
                        <div class="fl">
                            <div v-for="(v,k) in scope.row.back" :key="k" v-if="k<3">发货仓{{k}}：<div class="text-wrap">{{v.name}}</div></div>
                        </div>
                        <div class="fr">
                            <span class="color-blue" @click="watchAll(scope.row)">查看全部</span>
                            <i class="el-icon-circle-plus-outline" @click="addRepertory(scope.row)"></i>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog title="仓库新增" :visible.sync="mask">
        <el-form v-model="formMask">
            <el-form-item label="仓库编码">
                <el-input class="inp" placeholder="请输入仓库编码" v-model="formMask.code"></el-input>
            </el-form-item>
            <el-form-item label="仓库名称">
                <el-input class="inp" placeholder="请输入仓库名称" v-model="formMask.name"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sure('formMask')">确 认</el-button>
            <el-button @click="mask=false">取 消</el-button>
        </div>
    </el-dialog>
        <el-dialog title="仓库新增" :visible.sync="allMask">
            <div>
                <span>浙江省</span>
                <span>
                    <i class="el-icon-circle-plus-outline" @click="addRepertory()"></i>
                </span>
            </div>
           <el-table :data="allData" border>
                <el-table-column label="仓库排序" align="center">
                    <template slot-scope="scope">发货仓{{scope.$index}}</template>
                </el-table-column>
                <el-table-column prop="name" label="仓库名称" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <span class="color-blue" @click="upOrDown('-1',scope.$index)" v-if="scope.$index!=0">上移</span>
                        <span class="color-blue" @click="upOrDown('1',scope.$index)" v-if="scope.$index!=allData.length-1">下移</span>
                        <span class="color-blue" @click="upOrDown('0',scope.$index)" v-if="scope.$index!=0">置顶</span>
                        <span class="color-blue" @click="deleteData(scope.$index)">删除</span>
                    </template>
                </el-table-column>
           </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sure('formMask')">确 认</el-button>
                <el-button @click="allMask=false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import moment from 'moment';
import request from '@/http/http.js';

export default {
    components: { vBreadcrumb },

    data() {
        return {
            nav: ['云仓仓库管理', '区域设置'],
            tableData: [{
                province: '浙江省',
                send: [{
                    name: '111',
                    id: 0
                }, {
                    name: 222,
                    id: 1
                }, {
                    name: '333',
                    id: 0
                }, {
                    name: 444,
                    id: 1
                }],
                back: [{
                    name: 1111,
                    id: 0
                }, {
                    name: 222,
                    id: 1
                }]
            }, {
                province: '湖北省',
                send: [{
                    name: 3333,
                    id: 0
                }, {
                    name: 222,
                    id: 1
                }],
                back: [{
                    name: 4444,
                    id: 0
                }, {
                    name: 222,
                    id: 1
                }]
            }],
            form: {},
            formMask: {},
            mask: false,
            allMask: false,
            allData: []
        };
    },
    activated() {
        // this.getList();
    },
    methods: {
        // 获取数据
        getList() {
            request.getStoreList({}).then(res => {
                this.tableData = [];
                if (!res.data) return;
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch(error => {
                console.log(error);
            });
        },
        // 新增仓库
        addRepertory(row) {
            this.mask = true;
        },
        sure(formName) {
            if (!this[formName].code || !this[formName].name) {
                return this.$message.warning('请输入仓库编码和名称');
            }
            this.mask = false;
        },
        // 查看全部
        watchAll(row) {
            this.allData = row.send;
            this.allMask = true;
        },
        // 上移下移置顶
        // num:-1上移 1下移 置顶
        upOrDown(num, index) {
            let _this = this.allData[index];
            const newArr = [];
            if (num == 0) {
                newArr.push(_this);
                console.log(this.allData.splice(index, 1))
                newArr.push(this.allData.splice(index, 1));
                this.allData = newArr;
            } else {
                let change = this.allData[index + num];
                if (num == 1) {
                    [_this, change] = [change, _this];
                } else {
                    [change, _this] = [_this, change];
                }
                this.allData[index] = _this;
                this.allData[index + num] = change;
            }
        },
        // 删除
        deleteData(index) {
            this.allData.splice(index, 1);
        }
    }
};
</script>
<style lang='less' scoped>
.repertory-list {
    .block {
        margin: 10px 0;
    }
    .color-blue {
        color: #33b4ff;
        cursor: pointer;
    }
    .fl{
        float: left;
        width: 80%;
        .text-wrap{
            display: inline-flex;
            width: 80%;
        }
    }
    .fr{
        float: right;
        width: 20%;
        cursor: pointer;
        text-align: right;
        i{
            font-size: 20px;
            vertical-align: middle;
        }
    }
    /*弹窗样式*/
    /deep/.el-dialog {
        width: 530px;
        border-radius: 10px;
        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px;
        }
        .el-dialog__title {
            color: #ff6868;
        }
        .el-input {
            display: inline;
        }
        .el-input__inner {
            width: 360px;
        }
        .el-dialog__footer {
            margin-right: 30px;
        }
    }

}
</style>
