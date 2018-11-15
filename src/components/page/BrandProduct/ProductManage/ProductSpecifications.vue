<template>
    <div class="product-specification">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card v-loading="tabLoading" :body-style="{ padding: '20px 45px'}">
            <div class="spe-title">产品规格</div>
            <div class="spe-wrap">
                <div v-for="(value,index) in specificationArr" :key="index">
                    <div class="small-spe-title">
                        <span>类型：</span>
                        <div @mouseover="showFirstDelBtn(index)" @mouseout="deleteFirstItem = ''"
                             class="delete-big-tit">
                            <div class="del-big-btn" @click="deleteType(index)" v-if='index == deleteFirstItem'>×</div>
                            <el-input v-model="specificationArr[index].type" style="width:70px"></el-input>
                        </div>
                    </div>
                    <div class="small-spe-content">
                        <span>规格值：</span>
                        <div class="des-wrap" v-for="(v,k) in value.speArr" @mouseover="showDeleteBtn(v)"
                             @mouseout="deleteItem = ''" :key="k">
                            <div class="delete-btn" v-if='v == deleteItem' @click="deleteSpe(index,k)">×</div>
                            <el-input v-model="value.speArr[k]" :maxlength="18" class="des-inp"></el-input>
                        </div>
                        <span class="add-spe" @click="addSpe(index)">添加规格</span>
                    </div>
                </div>
                <div class="small-spe-title">
                    <el-button @click="addType">添加类型</el-button>
                </div>
            </div>
            <el-button :disabled="checkStatus != '0'" @click="createList" type="primary" style="margin:10px 0 50px 0">生成列表</el-button>
            <p style="margin:0 0 18px 10px">规格表</p>
            <el-table :data="tableData" border>
                <el-table-column prop="specValues" label="规格" align="center"></el-table-column>
                <el-table-column label="条形码" align="center" width="180">
                    <template slot-scope="scoped">
                        <el-input v-model="scoped.row.barCode"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="重量（公斤）" align="center" width="180">
                    <template slot-scope="scoped">
                        <el-input v-model="scoped.row.weight"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="体积（立方）" align="center" width="180">
                    <template slot-scope="scoped">
                        <el-input v-model="scoped.row.volume"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="图片" align="center" width="180">
                    <template slot-scope="scoped">
                        <template v-if='scoped.row.imgUrl'>
                            <div class="product-img"><img :src="scoped.row.imgUrl" alt=""></div>
                            <el-button type="danger" @click="deleteImg(scoped.$index)">删除</el-button>
                        </template>
                        <template v-else>
                            <el-upload
                                :action="imgUpload"
                                :show-file-list="false"
                                :on-success="uploadSuccess"
                            >
                                <el-button size="small" type="primary" @click="beforeUpload(scoped.$index)">选择图片
                                </el-button>
                            </el-upload>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="220">
                    <template slot-scope="scoped">
                        <el-button v-if="scoped.row.status == 0" type="warning" @click="operateProduct(scoped.row,'1')">
                            启用
                        </el-button>
                        <el-button v-else type="danger" @click="operateProduct(scoped.row,'0')">停用</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button :loading="btnLoading" @click="submitForm" style="margin-top:10px" type="primary">确认提交</el-button>
            <!-- <el-button >取消</el-button> -->
        </el-card>

    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import * as api from '@/api/api.js';
    import request from '@/http/http';

    export default {
        components: {
            vBreadcrumb
        },

        data() {
            return {
                nav: ['品牌产品管理', '产品管理', '发布产品'],
                imgUpload: '',
                rowId: '',
                deleteFirstItem: '',
                deleteItem: '',
                specificationArr: [],
                tableData: [],
                btnLoading: false,
                tabLoading: false,
                flag: true,
                checkStatus: 0 // 0：可以生成列表 1：不可以生成列表
            };
        },

        activated() {
            this.flag = true;
            this.imgUpload = api.uploadImg;
            this.checkStatus = JSON.parse(this.$route.query.releaseProductId || sessionStorage.getItem('productSpecifications'))[2];
            this.productId = JSON.parse(this.$route.query.releaseProductId || sessionStorage.getItem('productSpecifications'))[1];
            this.specificationArr = [];
            this.tableData = [];
            this.getProductInfo();
        },

        methods: {
            // 提交表单信息
            submitForm() {
                const specData = [];
                this.btnLoading = true;
                this.tableData.forEach(v => {
                    specData.push({
                        id: v.id,
                        productId: this.productId,
                        specIds: v.specIds,
                        spec: v.specValues,
                        barCode: v.barCode,
                        weight: v.weight,
                        volume: v.volume,
                        specImg: v.imgUrl,
                        status: v.status
                    });
                });
                if (!this.flag) {
                    request.addProductSpecPrice({ productSpecPriceVOList: specData }).then(res => {
                        this.btnLoading = false;
                        this.$message.success(res.msg);
                        this.$router.push({ name: 'productList' });
                    }).catch(err => {
                        this.btnLoading = false;
                        console.log(err);
                    });
                } else {
                    request.updateProductSpec({ productSpecPriceVOList: specData }).then(res => {
                        this.btnLoading = false;
                        this.$message.success(res.msg);
                        this.$router.push({ name: 'productList' });
                    }).catch(err => {
                        this.btnLoading = false;
                        console.log(err);
                    });
                }
            },
            // 获取产品信息
            getProductInfo() {
                this.tabLoading = true;
                const data = {};
                data.productId = this.productId;
                request.queryProductSpecList(data).then(res => {
                    this.tabLoading = false;
                    res.data.forEach(v => {
                        v.specValues = v.spec;
                        v.imgUrl = v.specImg;
                    });
                    res.data[0].productSpecList.forEach(v => {
                        this.specificationArr.push({ type: v.spec, id: v.id, speArr: v.specValues.split(',') });
                    });
                    this.tableData = res.data;
                }).catch(err => {
                    this.tabLoading = false;
                    console.log(err);
                });
            },
            // 生成列表
            createList() {
                const tmp = [];
                this.specificationArr.forEach((v, k) => {
                    v.speArr.forEach(v1 => {
                        tmp.push({ productId: this.productId, spec: v.type, specValue: v1 });
                    });
                });
                if (tmp.length === 0) {
                    this.$message.warning('请输入产品规格');
                    return;
                }
                request.addSaleSpecValue({ productSpecVOList: tmp }).then(res => {
                    this.$message.success(res.msg);
                    this.flag = false;
                    const tmp = [];
                    res.data.forEach(v => {
                        tmp.push({
                            specIds: v.specIds,
                            specValues: v.specValues,
                            weight: '',
                            volume: '',
                            imgUrl: '',
                            barCode: '',
                            status: 1
                        });
                    });
                    this.tableData = tmp;
                    console.log(this.tableData)
                }).catch(err => {
                    console.log(err);
                });
            },
            //  添加规格
            addSpe(index) {
                this.specificationArr[index].speArr.push('');
            },
            // 删除规格
            deleteSpe(index, k) {
                this.specificationArr[index].speArr.splice(k, 1);
            },
            // 删除类型
            deleteType(index) {
                this.specificationArr.splice(index, 1);
            },
            // 删除一级按钮
            showFirstDelBtn(v) {
                this.deleteFirstItem = v;
            },
            // 删除二级按钮
            showDeleteBtn(v) {
                this.deleteItem = v;
            },
            // 添加类型
            addType() {
                this.specificationArr.push({ type: '', speArr: [] });
            },
            // 上传之前
            beforeUpload(index) {
                this.rowId = index;
            },
            // 上传成功的钩子
            uploadSuccess(res) {
                this.tableData[this.rowId].imgUrl = res.data;
            },
            // 删除图片
            deleteImg(index) {
                this.tableData[index].imgUrl = '';
            },
            // 禁用/启用
            operateProduct(row, status) {
                row.status = status;
            }
        }
    };
</script>
<style lang='less'>
    .product-specification {
        .el-upload--text {
            width: 80px;
            height: 32px;
            overflow: hidden;
            border: none;
        }
        .product-img {
            display: inline-block;
            width: 45px;
            height: 45px;
            border: 1px solid #ddd;
            border-radius: 3px;
            vertical-align: middle;
            margin-right: 5px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .spe-title {
            width: 100%;
            height: 60px;
            line-height: 60px;
            padding: 0 20px;
            background-color: #f7f7f7;
            box-sizing: border-box;
        }
        .spe-wrap {
            width: 100%;
            border: 1px solid #ddd;
            margin-top: 20px;
            padding: 10px;
            box-sizing: border-box;
            font-size: 14px;
            color: #666;
            .small-spe-title {
                width: 100%;
                height: 60px;
                line-height: 60px;
                background-color: #f7f7f7;
                padding: 0 30px;
                box-sizing: border-box;
                .delete-big-tit {
                    display: inline-block;
                    position: relative;
                    .del-big-btn {
                        position: absolute;
                        top: 8px;
                        right: -5px;
                        width: 15px;
                        height: 15px;
                        border-radius: 50%;
                        border: 1px solid #ccc;
                        background-color: #fff;
                        cursor: pointer;
                        z-index: 1000;
                        line-height: 15px;
                        text-align: center;
                        color: #ccc;
                    }
                }
            }
            .small-spe-content {
                width: 100%;
                padding: 20px 0 10px 70px;
                box-sizing: border-box;
                overflow: hidden;
                .des-wrap {
                    position: relative;
                    display: inline-block;
                    .delete-btn {
                        position: absolute;
                        top: -6px;
                        right: 5px;
                        width: 15px;
                        height: 15px;
                        border-radius: 50%;
                        border: 1px solid #ccc;
                        background-color: #fff;
                        cursor: pointer;
                        z-index: 1000;
                        line-height: 15px;
                        text-align: center;
                        color: #ccc;
                    }
                    .des-inp {
                        width: 160px;
                        margin: 0 10px 10px 0;
                    }
                }
                .add-spe {
                    color: #33b4ff;
                    cursor: pointer;
                }
            }
        }
    }
</style>
