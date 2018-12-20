<template>
    <div class="package-product-mange">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card :body-style="{ padding: '50px' }">
            <el-autocomplete style='width:600px' v-model="keyWords" :fetch-suggestions="querySearchAsync"
                             placeholder="请输入产品名称模糊搜索" @select="handleSelect"></el-autocomplete>
            <el-button type="primary" @click="getSpecList">搜索</el-button>
            <div v-if="!showResult" class="nodata">
                请输入产品名称模糊搜索~
            </div>
            <div v-else>
                <el-table :data="tableData" border style="margin-top:10px" v-if="tableData.length">
                    <el-table-column prop="spec" label="规格" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="150px">
                        <template slot-scope="scope">
                            <el-checkbox @change="selectPro(scope.row)" label="选择产品"
                                         :value='scope.row.id' v-model="scope.row.checked"></el-checkbox>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-else class="nodata">
                    <div class="product-inf">324234234242</div>
                    <div class="color-red no-stock">该商品无库存</div>
                </div>
            </div>
            <div class="set-pro-num">
                <span style="font-size:14px">选择产品数量</span>
                <el-input-number class="my-inp" v-model="productNum" :min="1" label="请输入产品数量"></el-input-number>
                <el-button @click="setNum" type="primary">确认</el-button>
                <el-button>取消</el-button>
            </div>
            <table class="selected-product">
                <tr style="color:#aaa" v-if="selectedPro == 0">
                    <td>请选择产品</td>
                </tr>
                <tr v-for="(v,k) in selectedPro" :key="k">
                    <td>{{(v.productName || '')+(v.spec || '')}}</td>
                    <td>产品ID：{{v.productCode}}</td>
                    <td style="min-width:100px">x{{v.productNum}}</td>
                    <td style="min-width:80px;cursor: pointer;color:#33b4ff" @click="delselectedPro(v)">删除</td>
                </tr>
            </table>
            <div style="margin-top:20px">
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button>取消</el-button>
            </div>
        </el-card>
        <!--提示-->
        <el-dialog title="提示" :visible.sync="tipMask">
            <div>
                <icon class="ico" ico='icon-jinggao'/>
            </div>
            <div>该商品已添加过规格数量了</div>
            <div>要调整该商品，请先删除该商品规格!</div>
        </el-dialog>
    </div>
</template>

<script>
    import vBreadcrumb from "@/components/common/Breadcrumb.vue";
    import * as api from "@/api/OperateManage/MarketToolsManage/index.js";
    import * as pApi from "@/privilegeList/OperateManage/MarketToolsManage/index.js";
    import utils from "@/utils/index.js";
    import icon from "@/components/common/ico";

    export default {
        components: {vBreadcrumb, icon},

        data() {
            return {
                nav: ["运营管理", "营销工具管理", "优惠套餐", "产品管理"],
                packageId: "", // 套餐ID
                keyWords: "", // 关键字搜索
                keyWordsID: '',    // 关键字id
                productNum: "",    // 产品数量
                showResult: false,//是否显示搜索结果
                tableData: [],    // 规格表格
                // 选择商品列表
                checkList: [],
                // 已选择商品
                selectedPro: [],
                //缓存选择的商品及其规格
                productSpecList: [],
                //缓存选择的商品ids
                productIds: [],
                //缓存选择的规格ids
                specIds: [],
                tipMask: false//提示弹窗
            };
        },

        activated() {
            this.packageId = this.$route.query.id;
            this.tableData = [];
            this.keyWords = '';
            this.showResult = false;
            this.getPackageProInfo();
        },

        methods: {
            //   获取套餐产品信息
            getPackageProInfo() {
                // this.$axios.post(api.queryGiftBagProductById, {id: this.packageId}).then(res => {
                //     this.selectedPro = [];
                //     res.data.data.forEach((v, k) => {
                //         let tmp = {};
                //         tmp.id = v.id;
                //         tmp.productName = v.name;
                //         tmp.spec = v.spec;
                //         tmp.productNum = 1;
                //         this.selectedPro.push(tmp);
                //     })
                // })
            },
            //  提交表单
            submitForm() {
                // if (this.selectPro.length == 0) {
                //     this.$message.warning('请选择产品规格');
                //     return;
                // }
                // let proStr = [];
                // this.selectedPro.forEach((v, k) => {
                //     let o = {};
                //     o.id = v.id;
                //     o.num = v.productNum;
                //     proStr.push(o);
                // });
                // if (proStr.length == 0) {
                //     this.$message.warning('请选择产品');
                //     return;
                // }
                // let data = {};
                // data.id = this.packageId;
                // data.jsonStr = JSON.stringify(proStr);
                // this.$axios.post(api.addGiftBagProduct, data).then(res => {
                //     this.$message.success(res.data.msg);
                //     this.$router.push('/packageList');
                // })
            },
            // 根据id查询规格列表
            getSpecList() {
                let that = this;
                if (that.keyWordsID == '') {
                    that.$message.success('暂无数据');
                    return;
                }
                that.$axios.post(api.queryProductSpecById, {productId: that.keyWordsID}).then(res => {
                    that.tableData = [];
                    that.showResult = true;
                    res.data.data.forEach(function (v, k) {
                        if (that.specIds.indexOf(v.id) != -1) {
                            v.checked = true
                        } else {
                            v.checked = false
                        }
                        v.productId=that.keyWordsID;
                        that.tableData.push(v);
                    });
                    if (that.productIds.indexOf(that.keyWordsID) == -1) {
                        that.productIds.push(that.keyWordsID);
                        let temp = {
                            productId: that.keyWordsID,//产品id
                            specIds: [],//存放规格ids
                        };
                        that.productSpecList.push(temp)
                    }
                })
            },
            // 模糊查询
            querySearchAsync(queryString, cb) {
                if (queryString == '') {
                    return;
                }
                this.checkList = [];
                this.$axios.post(api.queryProductByNameOrCode, {condition: queryString,activityType:3}).then(res => {
                    let tmpArr = [];
                    res.data.data.forEach((v, k) => {
                        let o = {};
                        o.value = `${v.name} 产品ID：${v.prodCode}`;
                        o.id = v.id;
                        tmpArr.push(o);
                    });
                    cb(tmpArr)
                })
            },
            // 模糊查询id
            handleSelect(item) {
                this.keyWordsID = item.id;
            },
            // 选中产品，设置数量
            setNum() {
                if (this.productNum == '') {
                    this.$message.warning('请输入产品数量');
                    return;
                }
                let tmp = []; // 建立空数组保存遍历出来的产品
                this.checkList.forEach((v, k) => {
                    v.productNum = this.productNum;
                    v.productId = this.keyWordsID;
                    tmp.push(v);
                });
                // 将遍历出来的产品赋值给已选择商品
                this.selectedPro.push(...tmp);
            },
            // 删除已选择产品
            delselectedPro(row) {
                this.tableData.forEach(function (v, k) {//取消对应表格数据选中效果
                    if (v.id == row.id) {
                        v.checked = false;
                    }
                });
                this.checkList.forEach((v, k) => {
                    if (v.id == row.id) {
                        this.checkList.splice(k, 1);
                    }
                });
                let index = this.getIdIndex(row.productId);//获取当前产品id在缓存选择的商品及其规格列表中的位置
                this.addOrDeleteSpec(index, false, row.id)//更新缓存选择的商品及其规格列表中规格ids
            },
            // 选择商品操作
            selectPro(row) {
                let checked = row.checked;
                let index = this.getIdIndex(row.productId);//获取当前产品id在缓存选择的商品及其规格列表中的位置
                if (checked == true) {//添加规格
                    if (this.specIds.indexOf(row.id) == -1) {
                        this.checkList.push(row);
                        this.addOrDeleteSpec(index, true, row.id)//更新缓存选择的商品及其规格列表中规格ids
                    }
                } else {//取消
                    this.checkList.forEach((v, k) => {
                        if (v.id == row.id) {
                            this.checkList.splice(k, 1);
                        }
                    });
                    this.addOrDeleteSpec(index, false, row.id)//更新缓存选择的商品及其规格列表中规格ids
                }
            },
            //获取当前产品id索引值，遍历缓存选择的商品，缓存选择的商品及其规格，供添加规格、删除规格时调用
            getIdIndex(id) {
                let index;
                index = this.productIds.indexOf(id);
                return index
            },
            // 添加/删除规格
            // index产品id索引值
            // status添加或删除，true添加
            // id规格id
            addOrDeleteSpec(index, status, id) {
                if (status) {
                    this.productSpecList[index].specIds.push(id);
                    this.specIds.push(id);
                } else {
                    for (let i in this.productSpecList[index].specIds) {//删除规格
                        let tempId = this.productSpecList[index].specIds[i];
                        if (tempId == id) {
                            this.productSpecList[index].specIds.splice(i, 1);
                        }
                    }
                    if (this.productSpecList[index].specIds.length == 0) {//规格删除完，删除对应的产品id
                        if (this.keyWordsID == this.productSpecList[index].productId) {
                            this.productSpecList[index]={
                                productId:this.keyWordsID,
                                specIds:[]
                            };
                            this.productIds[index]=this.keyWordsID;
                        } else {
                            this.productSpecList.splice(index, 1);
                            this.productIds.splice(index, 1)
                        }
                    }
                    for(let i in this.selectedPro){
                        if(this.selectedPro[i].id==id){
                            this.selectedPro.splice(i,1)
                        }
                    }
                    for (let i in this.specIds) {
                        if (this.specIds[i] == id) {
                            this.specIds.splice(i, 1)
                        }
                    }
                }

            }
        }
    };
</script>
<style lang='less' scoped>
    .package-product-mange {
        /deep/ .el-input__inner {
            border-radius: 0;
        }
        .my-inp {
            width: 215px;
        }
        .set-pro-num {
            width: 100%;
            height: 100px;
            line-height: 100px;
            padding: 0 60px;
            box-sizing: border-box;
            border: 1px solid #ebeef5;
            border-top: none;
        }
        .selected-product {
            border-collapse: collapse;
            text-align: center;
            margin-top: 50px;
            width: 60%;
            border: 1px solid #ebeef5;
            border-radius: 5px;
            font-size: 14px;
            th, td {
                border: 1px solid #ebeef5;
                height: 55px;
            }
        }
        /*弹窗样式*/
        /deep/ .el-dialog {
            width: 530px;
            border-radius: 10px;
            .el-dialog__header {
                border-bottom: 1px solid #eee;
                padding: 10px 50px;
            }
            .el-dialog__title {
                color: #ff6868;
            }
            .ico {
                color: #ff6868;
                font-size: 36px;
                margin-bottom: 10px;
            }
            div {
                text-align: center;
                font-size: 18px;
                color: #000;
                line-height: 40px;
            }
        }
        .nodata {
            margin-top: 30px;
            height: 112px;
            line-height: 112px;
            text-align: center;
            border-radius: 4px;
            border: solid 1px #dddddd;
            div {
                display: inline-block;
            }
            .product-inf {
                width: 70%;
                border-right: 1px solid #ddd;
            }
            .no-stock {
                width: 29%;
            }
        }
    }
</style>
