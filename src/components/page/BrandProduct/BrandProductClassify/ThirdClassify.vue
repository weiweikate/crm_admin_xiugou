<template>
    <div class="second-classify">
        <v-breadcrumb :nav="['产品管理','分类管理',superiorName,name]"></v-breadcrumb>
        <div class="table-block">
            <el-button type="primary" style="margin-bottom: 20px" @click="addClassify">添加三级类目</el-button>
            <mr-flying parentClass="content-box">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="page.pageSize" :current-page="page.currentPage" layout="total, prev, pager, next, jumper" :total="page.totalPage"></el-pagination>
            </mr-flying>
            <template>
                <el-table :data="tableData" :height="height" border style="width: 100%">
                    <el-table-column type="index" label="ID" align="center"></el-table-column>
                    <el-table-column prop="name" label="三级分类" align="center"></el-table-column>
                    <el-table-column prop="superiorName" label="二级分类" align="center"></el-table-column>
                    <el-table-column prop="className" label="一级分类" align="center"></el-table-column>
                    <el-table-column label="图标" align="center">
                        <template slot-scope="scope">
                            <img :src="scope.row.img" alt="">
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="排序" align="center"></el-table-column>
                    <el-table-column prop="porductNum" label="产品数" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="goProduct(scope.row)">{{scope.row.porductNum}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.status == 1">启用</template>
                            <template v-if="scope.row.status == 2">禁用</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="afterSaleTime" label="售后时间" align="center"></el-table-column>
                    <el-table-column min-width="160" label="操作" align="center">
                        <template slot-scope="scope">
                            <!--<el-button type="primary" size="small" @click="toDetailParam(scope.row)">产品详细参数</el-button>-->
                            <el-button type="primary" size="small" @click="property(scope.row)">属性</el-button>
                            <el-button type="warning" size="small" @click="editItem(scope.row)">编辑</el-button>
                            <!--<el-button type="danger" size="small" @click="delItem(scope.row.id)">删除</el-button>-->
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>

        <!--添加/编辑类目弹窗-->
        <el-dialog :title="title" :visible.sync="editMask">
            <el-form v-model="form" label-width="100px">
                <el-form-item label="类目名称">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                    <span style="font-size: 12px;color: #aaa">（2-16位汉字字母组合）</span>
                </el-form-item>
                <el-form-item label="类目图标" class="icon-area">
                    <el-input readonly v-model="form.img" auto-complete="off"></el-input>
                    <el-upload class="icon-uploader"
                               :action="uploadImg"
                               :before-upload="beforeAvatarUpload"
                               :on-success="handleAvatarSuccess">
                        <el-button size="small" type="primary"><i class="el-icon-upload"></i>上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="二级分类">
                    <el-input v-model="name" auto-complete="off" disabled=""></el-input>
                </el-form-item>
                <el-form-item label="是否启用">
                    <el-select v-model="form.status">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="sort" label="APP排序">
                    <el-input v-model="form.sort" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="afterSaleTime" label="售后时间">
                    <el-input v-model="form.afterSaleTime" placeholder="请输入该分类的售后天数" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="addOrEdit('form')">确 认</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!--删除弹窗-->
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
        <!--关联属性-->
        <el-dialog title="关联属性" :visible.sync="propertyMask">
            <div>对应分类：{{superiorName}}>{{name}}>{{row.name}}</div>
            <el-button style="margin-top: 20px" @click="editProperty" type="danger">添加关联属性</el-button>
            <table class="table-area">
                <tr v-for="(v,k) in propertyList" :key="k">
                    <td>
                        <i class="el-icon-close" @click="deleteProperty(k)"></i>
                        {{v.label}}
                    </td>
                </tr>
            </table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="propertySure">确 认</el-button>
                <el-button @click="propertyMask=false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="关联属性" :visible.sync="editPropertyMask" width="700px">
            <el-transfer :titles="['选择区域','选中预览']"
                         v-model="propertyCodes"
                         :data="allPropertyList">
            </el-transfer>
            <div class="tip">注：同一类型属性不能绑定相同名称的属性</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editSure">确 认</el-button>
                <el-button @click="editPropertyMask=false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import icon from '@/components/common/ico.vue';
    import deleteToast from '@/components/common/DeleteToast';
    import utils from '@/utils/index.js';
    import { myMixinTable, beforeAvatarUpload } from '@/JS/commom';
    import request from '@/http/http.js';
    import * as api from '@/api/api.js';

    export default {
        components: {
            vBreadcrumb,
            icon,
            deleteToast
        },
        mixins: [myMixinTable, beforeAvatarUpload],
        data() {
            return {

                tableData: [],
                // 类目类型
                type: '',
                height: '',
                editMask: false,
                isShowDelToast: false,
                formLabelWidth: '100px',
                form: {
                    name: '',
                    status: '1',
                    img: '',
                    afterSaleTime: ''
                },
                title: '添加三级类目',
                id: '',
                itemId: '',
                name: '',
                superiorName: '',
                itype: '',
                delId: 66,
                delUrl: 'http://api',
                delUri: '',
                uploadImg: '',
                propertyMask: false, // 关联属性弹窗
                editPropertyMask: false, // 编辑关联属性弹窗
                propertyCodes: [],
                propertyList: [],
                allPropertyList: [],
                btnLoading: false,
                row: {}
            };
        },
        created() {
            const winHeight = window.screen.availHeight - 500;
            this.height = winHeight;
        },
        activated() {
            this.uploadImg = api.uploadImg;
            this.name =
                this.$route.query.name || JSON.parse(sessionStorage.getItem('thirdClassify')).name;
            this.id =
                this.$route.query.id || JSON.parse(sessionStorage.getItem('thirdClassify')).id;
            this.type =
                this.$route.query.type || JSON.parse(sessionStorage.getItem('thirdClassify')).type;
            this.superiorName =
                this.$route.query.superiorName || JSON.parse(sessionStorage.getItem('thirdClassify')).superiorName;
            this.getList(this.page.currentPage);
        },
        methods: {
            // 获取列表
            getList(val) {
                const data = {
                    page: val,
                    fatherId: this.id,
                    pageSize: this.page.pageSize,
                    level: 3
                };
                this.page.currentPage = val;
                request.queryProductCategoryList(data).then(res => {
                    this.tableData = [];
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                }).catch(error => {
                    console.log(error);
                });
            },
            // 添加三级类目
            addClassify() {
                this.title = '添加三级类目';
                this.editMask = true;
                utils.cleanFormData(this.form);
                this.form.status = '1';
                this.itype = 'add';
            },
            // 编辑
            editItem(row) {
                this.title = '编辑三级类目';
                this.editMask = true;
                this.form.name = row.name;
                this.form.img = row.img;
                this.form.sort = row.sort;
                this.form.afterSaleTime = row.afterSaleTime;
                this.itemId = row.id;
                this.form.status = row.status.toString();
                this.itype = 'edit';
            },
            // 添加修改确定
            addOrEdit(formName) {
                let url = '';
                const data = this[formName];
                data.type = this.type;
                data.level = 3;
                data.fatherId = this.id;
                if (!data.name) {
                    this.$message.warning('请输入类目名称!');
                    return;
                }
                if (data.name.length > 16 || data.name.length < 2) {
                    this.$message.warning('请输入2-16位的类目名称!');
                    return;
                }
                if (!data.img) {
                    this.$message.warning('请上传类目图标!');
                    return;
                }
                if (!data.sort) {
                    this.$message.warning('请输入排序!');
                    return;
                }
                if (data.afterSaleTime && !/^(0|[1-9]\d*)$/.test(data.afterSaleTime)) {
                    return this.$message.warning('请输入合法的售后天数!');
                }
                if (this.itype == 'add') {
                    url = 'addProductCategory';
                } else {
                    url = 'modifyProductCategory';
                    data.id = this.itemId;
                }
                this.btnLoading = true;
                request[url](data).then(res => {
                    this.$message.success(res.msg);
                    this.btnLoading = false;
                    this.editMask = false;
                    this.getList(this.page.currentPage);
                }).catch(error => {
                    console.log(error);
                    this.btnLoading = false;
                });
            },
            // 删除
            delItem(id) {
                this.delId = id;
                this.delUrl = 'deleteProductCategory';
                this.isShowDelToast = true;
            },
            // 删除弹窗
            deleteToast(msg) {
                this.isShowDelToast = msg;
                this.getList(this.page.currentPage);
            },
            // 上传图片
            handleAvatarSuccess(res, file) {
                this.form.img = res.data;
            },
            // 取消
            cancel() {
                this.editMask = false;
                this.getList(this.page.currentPage);
            },
            // 跳转产品列表页
            goProduct(row) {
                this.$router.push({ name: 'productList', query: {
                    firstCategoryId: row.classId,
                    secCategoryId: row.fatherId,
                    thirdCatId: row.id,
                    flag: 4
                }});
            },
            // 跳转到产品详细参数
            toDetailParam(row) {
                sessionStorage.setItem('productDetailParam', JSON.stringify({ name: row.name, id: row.id, type: row.type, superiorName: row.superiorName, className: row.className }));
                this.$router.push({ path: '/productDetailParam', query: { name: row.name, id: row.id, type: row.type, superiorName: row.superiorName, className: row.className }});
            },
            // 属性
            property(row) {
                this.propertyMask = true;
                this.row = row;
                const data = {
                    categoryId: row.id,
                    type: ''
                };
                request.queryPropertyByCategoryId(data).then(res => {
                    this.propertyList = [];
                    this.propertyCodes = [];
                    res.data.forEach((v, k) => {
                        const type = v.type == 1 ? '自然属性' : '销售属性';
                        const temp = {
                            label: `${v.name}（` + type + `） ID:${v.propertyCode}`,
                            name: `${v.name}（` + type + `）`
                        };
                        this.propertyList.push(temp);
                        this.propertyCodes.push(v.propertyCode);
                    });
                }).catch(err => {
                    console.log(err);
                });
            },
            propertySure() {
                const data = {
                    propertyCodes: this.propertyCodes,
                    categoryId: this.row.id
                };
                this.btnLoading = true;
                request.bindCategoryProperty(data).then(res => {
                    this.$message.success(res.msg);
                    this.propertyMask = false;
                    this.btnLoading = false;
                    this.getList(this.page.currentPage);
                }).catch(err => {
                    console.log(err);
                    this.btnLoading = false;
                });
            },
            // 删除
            deleteProperty(index) {
                this.propertyList.splice(index, 1);
                this.propertyCodes.splice(index, 1);
            },
            // 编辑关联属性
            editProperty() {
                this.editPropertyMask = true;
                const data = {
                    page: 1,
                    pageSize: 10000,
                    status: 1
                };
                request.queryCategoryProperty(data).then(res => {
                    this.allPropertyList = [];
                    res.data.data.forEach((v, k) => {
                        const type = v.type == 1 ? '自然属性' : '销售属性';
                        const temp = {
                            key: v.code,
                            label: `${v.name}（` + type + `） ID:${v.code}`,
                            name: `${v.name}（` + type + `）`
                        };
                        this.allPropertyList.push(temp);
                    });
                });
            },
            editSure() {
                this.propertyList = [];
                this.allPropertyList.forEach((v, k) => {
                    if (this.propertyCodes.join(',').indexOf(v.key) != -1) {
                        this.propertyList.push(v);
                    }
                });
                let tempNamesStr = ''; const tempNamesArr = [];
                this.propertyList.forEach((v, k) => {
                    tempNamesArr.push(v.name);
                });
                tempNamesStr = tempNamesArr.join(',') + ',';
                for (let i = 0; i < tempNamesArr.length; i++) {
                    if (tempNamesStr.replace(tempNamesArr[i] + ',', '').indexOf(tempNamesArr[i] + ',') > -1) {
                        return this.$message.warning('存在重复的属性名');
                    }
                }
                this.editPropertyMask = false;
            }
        }
    };
</script>

<style lang="less">
    .second-classify {
        /*表格样式*/
        .table-block {
            padding: 20px 20px 60px;
            background: #fff;
        }
        img {
            width: 38px;
            height: 38px;
            border-radius: 5px;
            vertical-align: middle;
        }
        .block {
            float: right;
            margin-top: 10px;
        }

        /*弹窗样式*/
        .el-dialog {
            width: 530px;
            border-radius: 10px;
        }
        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px 50px;
        }
        .el-dialog__title {
            color: #ff6868;
        }
        .el-dialog .el-input {
            display: inline;
        }
        .el-dialog .el-input__inner {
            width: 360px;
        }
        .el-select .el-input__inner {
            width: 200px;
        }
        .el-dialog .el-upload--text {
            width: 100px;
            height: 40px;
            border: none;
        }
        .icon-area .el-input__inner {
            width: 240px;
        }
        .el-input__suffix {
            line-height: 24px;
        }
        .icon-uploader {
            float: right;
            margin-right: 31px;
            height: 33px;
        }
        .icon-uploader .el-button--small {
            border-radius: 5px;
            width: 100px;
        }
        .el-upload--text .el-icon-upload {
            line-height: 0;
            margin: 0;
            color: #fff;
            font-size: 14px;
        }
        .el-dialog__footer {
            margin-right: 30px;
        }
        .el-upload-list {
            display: none;
        }
        .table-area{
            font-size:12px;
            width: 100%;
            color:#606266;
            border: 1px solid #ebeef5;
            border-collapse: collapse;
            margin: 20px 0;
            line-height: 23px;
            i{
                font-size: 20px;
                color: #ff6868;
                vertical-align: middle;
                cursor: pointer;
            }
            td {
                border: 1px solid #ebeef5;
                padding: 8px;
                text-align: left;
            }
        }
        .el-transfer-panel{
            width: 280px;
        }
        .tip{
            font-size: 12px;
            color: #ff6868;
        }
    }
</style>
