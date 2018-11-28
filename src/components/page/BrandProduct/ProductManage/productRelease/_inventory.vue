<template>
    <div class="prod-inventory">
        <el-form :model="form" ref="form" :rules="rules" label-position="right" label-width="100px">
            <div class="pro-title">销售属性</div>
            <el-form-item v-for="(v, k) in salesAttrArr" :key="k" :label="v.name+' : '">
                <div v-if="v.type == 1">
                    <div class="img-type" v-for="(v1, k1) in v.options" :key="`${k}-${k1}`">
                        <el-checkbox v-model="v1.value">{{v1.label}}</el-checkbox>
                        <template v-if="v1.imgUrl == ''">
                            <el-upload
                                :action="imgUpload"
                                :show-file-list="false"
                                :on-success="uploadSuccess"
                            >
                                <span class="primary-text" @click="beforeUpload(k, k1)">上传图片</span>
                            </el-upload>
                        </template>
                        <template v-else>
                            <img :src="v1.imgUrl" alt="">
                            <span class="primary-text" @click="deleteImg(k, k1)">删除</span>
                        </template>
                    </div>
                </div>
                <div v-else-if="v.type == 2" class="sales-type">
                    <el-checkbox v-for="(v1, k1) in v.options" :key="`${k}--${k1}`" v-model="v1.value">{{v1.label}}</el-checkbox>
                </div>
                <div class="primary-text">
                    <span @click="addAttrValue(k)">新建子属性</span>
                </div>
            </el-form-item>
            <el-form-item label=" ">
                <div class="primary-text">
                    <span>新建主属性</span>
                    <span>|</span>
                    <span>刷新</span>
                </div>
            </el-form-item>
            <el-form-item label=" ">
                <el-button type="primary" @click="">生成列表</el-button>
            </el-form-item>
            <div class="pro-title">价格信息</div>
            <el-form-item label="销售价格">
                <el-button type="primary" class="mb10" @click="batchPrice = true">批量输入</el-button>
                <el-table :data="priceTable" border stripe>
                    <el-table-column prop="id" label="规格" align="center"></el-table-column>
                    <el-table-column label="原价" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.value"></el-input>
                    </template>
                </el-table-column>
                </el-table>
            </el-form-item>
            <div class="pro-title">库存信息 <span class="grey-text">注：可售库存不编辑默认全部可售</span></div>
            <el-form-item label="库存信息">
                <el-table :data="priceTable" border stripe>
                    <el-table-column prop="id" label="规格" align="center"></el-table-column>
                    <el-table-column :render-header="renderTitle" prop="id" label="单位" align="center"></el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label=" ">
                <el-button type="primary" @click="nextTip">下 一 步</el-button>
            </el-form-item>
        </el-form>
        <!--批量添加产品价格-->
        <el-dialog title="批量操作" :visible.sync="batchPrice" width="30%" style="min-width: 500px">
            <el-table :data="batchPriceArr" border stripe>
                <el-table-column prop="originPrice" label="原价" align="center"></el-table-column>
            </el-table>
            <span slot="footer">
                <el-button type="primary" @click="batchPrice = false">确 定</el-button>
                <el-button @click="batchDealPrice">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import request from '@/http/http';
    import * as api from '@/api/api.js';
    export default {
        data() {
            return {
                form: {},
                rules: {},
                unit: '',
                rowIndex: { bIndex: '', mIndex: '' },
                salesAttrArr: [{ name: '体积', type: '1', options: [{ label: '大', value: false, imgUrl: '' }] }, { name: '规格', type: '2', options: [{ label: '全网通', value: true }, { label: '联通', value: false }] }],
                priceTable: [{ id: 1 }],
                wareTable: [{ id: 1 }],
                batchPrice: false,
                batchPriceArr: [{ originPrice: '' }]
            };
        },
        computed: {
            imgUpload() {
                return api.uploadImg;
            }
        },
        methods: {
            // 批量处理价格
            batchDealPrice() {
                this.batchPrice = false;
            },
            // 添加属性值
            addAttrValue(index) {
                this.$prompt('请输入属性名', null, {
                    showCancelButton: true
                }).then(({ value }) => {
                    const item = this.salesAttrArr[index];
                    if (item.type == 1) {
                        item.options.push({ label: value, value: false, imgUrl: '' });
                    } else {
                        item.options.push({ label: value, value: false });
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // 下一步
            nextTip() {
                this.$refs['form'].validate((valid) => {
                    // if (valid) {
                    //     alert('submit!');
                    // } else {
                    //     console.log('error submit!!');
                    //     return false;
                    // }
                    this.$emit('nextName', 'info');
                });
            },
            // 上传之前
            beforeUpload(bIndex, mIndex) {
                this.rowIndex.bIndex = bIndex;
                this.rowIndex.mIndex = mIndex;
            },
            // 上传成功的钩子
            uploadSuccess(res) {
                const bInd = this.rowIndex.bIndex || 0;
                const mInd = this.rowIndex.mIndex || 0;
                this.salesAttrArr[bInd].options[mInd].imgUrl = res.data;
            },
            // 删除图片
            deleteImg(bIndex, mIndex) {
                const bInd = this.rowIndex.bIndex || 0;
                const mInd = this.rowIndex.mIndex || 0;
                this.salesAttrArr[bInd].options[mInd].imgUrl = '';
            },
            // 改变表头单位
            changeTableTitle(val) {
                console.log(this.unit);
            },
            // 表头
            renderTitle(h, { column, $index }) {
                return (
                    <el-select v-model={this.unit} onChange={this.changeTableTitle} placeholder={'单位'}>
                        <el-option label='kg' value='1'></el-option>
                        <el-option label='包' value='2'></el-option>
                    </el-select>
                );
            }
        }
    };
</script>

<style scoped lang="less">
    .prod-inventory{
        /deep/.el-upload--text {
            width: 80px;
            height: 1.6em;
            margin-left: 50px;
            overflow: hidden;
            border: none;
        }
        .pro-title {
            width: 100%;
            height: 60px;
            background-color: #f7f7f7;
            line-height: 60px;
            padding: 0 25px;
            box-sizing: border-box;
            margin-bottom: 20px;
        }
        .img-type{
            width: 600px;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            img {
                width: 50px;
                height: 50px;
                border-radius: 5px;
                border: 1px solid #ccc;
                margin: 0 10px 0 50px;
            }
        }
    }
</style>
