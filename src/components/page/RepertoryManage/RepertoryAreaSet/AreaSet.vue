<template>
    <div class="repertory-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }" style='margin-top:20px'>
            <el-table :data="tableData" v-loading="tableLoading" border>
                <el-table-column prop="addressName" label="省" align="center"></el-table-column>
                <el-table-column prop="name" label="发货仓">
                    <template slot-scope="scope">
                        <div class="fl">
                            <div v-for="(v,k) in scope.row.sendList" :key="k" v-if="k<3">发货仓{{k+1}}：<div class="text-wrap">{{v.warehouseName}}</div></div>
                        </div>
                        <div class="fr">
                            <span class="color-blue" @click="watchAll(scope.row,1)">查看全部</span>
                            <i class="el-icon-circle-plus-outline" @click="addRepertory(scope.row.sendList,scope.row.addressCode,1)"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="退货仓">
                    <template slot-scope="scope">
                        <div class="fl">
                            <div v-for="(v,k) in scope.row.returnList" :key="k" v-if="k<3">退货仓{{k+1}}：<div class="text-wrap">{{v.warehouseName}}</div></div>
                        </div>
                        <div class="fr">
                            <span class="color-blue" @click="watchAll(scope.row,2)">查看全部</span>
                            <i class="el-icon-circle-plus-outline" @click="addRepertory(scope.row.returnList,scope.row.addressCode,2)"></i>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--仓库新增-->
        <el-dialog title="仓库新增" :visible.sync="mask">
            <el-form v-model="formMask">
                <el-form-item label="仓库编码">
                    <el-autocomplete class="inp" :fetch-suggestions="querySearchAsync" @select="handleSelect" placeholder="请输入仓库编码或名称" v-model="formMask.code"></el-autocomplete>
                </el-form-item>
                <el-form-item label="仓库名称">
                    <el-input class="inp" placeholder="请输入仓库名称" disabled="" v-model="formMask.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="sure('formMask')">确 认</el-button>
                <el-button @click="mask=false">取 消</el-button>
            </div>
        </el-dialog>
        <!--查看全部-->
        <el-dialog title="查看全部" :visible.sync="allMask">
            <div>
                <span>{{addressName}}</span>
                <span>
                    <i class="el-icon-circle-plus-outline" @click="addRepertory(allData,addressCode,type)"></i>
                </span>
            </div>
            <el-table :data="tempAllData" border width="100%">
                <el-table-column label="仓库排序" align="center" key="1">
                    <template slot-scope="scope">{{title[type]}}{{scope.$index+1}}</template>
                </el-table-column>
                <el-table-column prop="warehouseName" label="仓库名称" align="center" key="2"></el-table-column>
                <el-table-column label="操作" align="center"  key="3">
                    <template slot-scope="scope">
                        <span class="color-blue" @click="upOrDown(-1,scope.$index)" v-if="scope.$index!=0">上移</span>
                        <span class="color-blue" @click="upOrDown(1,scope.$index)" v-if="scope.$index!=tempAllData.length-1">下移</span>
                        <span class="color-blue" @click="upOrDown(0,scope.$index)" v-if="scope.$index!=0">置顶</span>
                        <span class="color-blue" @click="deleteData(scope.$index)">删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="sureSort">确 认</el-button>
                <el-button @click="allMask=false">取 消</el-button>
            </div>
        </el-dialog>
        <!--删除-->
        <el-dialog title="温馨提示" :visible.sync="deleteMask">
            <div class="tip">确认要删除？</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="deleteSure">确 认</el-button>
                <el-button @click="deleteMask=false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import request from '@/http/http.js';

export default {
    components: { vBreadcrumb },

    data() {
        return {
            nav: ['云仓仓库管理', '区域设置'],
            tableData: [],
            tableLoading: false,
            form: {},
            formMask: {},
            mask: false,
            allMask: false,
            addressName: '',
            allData: [], // 查看全部数据
            tempAllData: [], // 暂时存放查看的全部数据
            deleteMask: false,
            index: '', // 删除索引
            row: '', // 查看全部添加参数
            addressCode: '',
            type: '', // 发货仓1  退货仓2
            btnLoading: false,
            title: ['', '发货仓', '退货仓']
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        // 获取数据
        getList() {
            this.tableLoading = true;
            request.areaWarehouseList({}).then(res => {
                this.tableData = [];
                if (!res.data) return;
                this.tableData = res.data;
                this.tableLoading = false;
            }).catch(error => {
                console.log(error);
                this.tableLoading = false;
            });
        },
        // 新增仓库
        addRepertory(allData, addressCode, num) {
            this.mask = true;
            this.formMask.name = '';
            this.formMask.code = '';
            this.addressCode = addressCode;
            this.type = num;
            this.allData = allData;
        },
        // 模糊搜索
        querySearchAsync(queryString, cb) {
            if (queryString === '') {
                return;
            }
            request.findWarehouseLike({ 'keyword': this.formMask.code, type: this.type }).then(res => {
                const tmpArr = [];
                res.data.forEach((v, k) => {
                    const o = {};
                    o.value = `${v.name} 仓库编码：${v.code}`;
                    o.code = v.code;
                    o.name = v.name;
                    o.type = v.type;
                    o.id = v.id;
                    tmpArr.push(o);
                });
                cb(tmpArr);
            });
        },
        handleSelect(item) {
            this.formMask = item;
            this.$set(this.formMask, 'warehouseCode', item.code);
            this.$set(this.formMask, 'name', item.name);
        },
        sure(formName) {
            if (!this[formName].warehouseCode || !this[formName].name) {
                return this.$message.warning('请输入仓库编码和名称');
            }
            const data = this.formMask;
            data.addressCode = this.addressCode;
            data.type = this.type;
            data.warehouseId = this.formMask.id;
            data.warehouseName = this.formMask.name;
            this.btnLoading = true;
            request.addAreaOption(data).then(res => {
                this.$message.success(res.msg);
                this.mask = false;
                this.getList();
                if (this.allMask) {
                    this.tempAllData = this.tempAllData ? this.tempAllData : [];
                    this.tempAllData.push(data);
                }
                this.btnLoading = false;
            }).catch(err => {
                console.log(err);
                this.btnLoading = false;
            });
        },
        // 查看全部
        watchAll(row, num) {
            this.allData = [];
            this.allData = num === 1 ? row.sendList ? row.sendList : [] : row.returnList ? row.returnList : [];
            this.tempAllData = [];
            this.tempAllData.push(...this.allData);
            this.allMask = true;
            this.addressName = row.addressName;
            this.row = row;
            this.addressCode = row.addressCode;
            this.type = num;
        },
        // 上移下移置顶
        // num:-1上移 1下移 0置顶
        upOrDown(num, index) {
            const _this = this.tempAllData[index];
            const tempArr = [];
            if (num === 0) {
                tempArr.push(_this);
                this.tempAllData.splice(index, 1);
                const newArr = tempArr.concat(this.tempAllData);
                this.tempAllData = newArr;
            } else {
                const change = this.tempAllData[index + num];
                this.tempAllData[index] = change;
                this.tempAllData[index + num] = _this;
                this.$set(this.tempAllData, index, change);
                this.$set(this.tempAllData, index + num, _this);
            }
        },
        sureSort() {
            this.btnLoading = true;
            const data = {
                provinceCode: this.addressCode,
                type: this.type,
                list: []
            };
            if (!this.tempAllData) return;
            this.tempAllData.forEach((v, k) => {
                const temp = v;
                temp.sort = k + 1;
                temp.addressCode = this.addressCode;
                temp.type = this.type;
                data.list.push(temp);
            });
            request.areaOption(data).then(res => {
                this.$message.success(res.msg);
                this.allMask = false;
                this.getList();
                this.btnLoading = false;
            }).catch(err => {
                console.log(err);
                this.btnLoading = false;
            });
        },
        // 删除
        deleteData(index) {
            this.deleteMask = true;
            this.index = index;
        },
        deleteSure() {
            this.tempAllData.splice(this.index, 1);
            this.deleteMask = false;
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
    }
    i{
        font-size: 20px;
        vertical-align: middle;
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
        .tip{
            text-align: center;
            font-size: 20px;
        }
    }

}
</style>
