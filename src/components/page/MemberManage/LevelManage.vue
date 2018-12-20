<template>
    <div class="level">
        <v-breadcrumb :nav="['会员管理','会员层级管理']"></v-breadcrumb>
        <div class="table-block">
            <!--<el-button type="primary" style="margin-bottom: 20px" @click="addClassify">添加层级</el-button>-->
            <template>
                <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%">
                    <el-table-column prop="id" label="层级编码" width="120" align="center"></el-table-column>
                    <el-table-column prop="name" label="名称" align="center"></el-table-column>
                    <el-table-column label="层级" align="center">
                        <template slot-scope="scope">
                            {{scope.row.level}}级
                        </template>
                    </el-table-column>
                    <el-table-column label="能否参加拼店" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.allowGroupStore == 1">是</template>
                            <template v-if="scope.row.allowGroupStore == 2">否</template>
                        </template>
                    </el-table-column>
                    <el-table-column label="能否创建店铺" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.allowCreateStore == 1">是</template>
                            <template v-if="scope.row.allowCreateStore == 2">否</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注说明" align="center"></el-table-column>
                    <el-table-column label="是否能晋级" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.autoUp == 1">是</template>
                            <template v-if="scope.row.autoUp == 2">否</template>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="350px" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="upSet(scope.$index,scope.row)" v-auth="'vip.levelManage.jssz'">晋级设置</el-button>
                            <el-button type="warning" size="small" @click="downSet(scope.$index,scope.row)" v-auth="'vip.levelManage.jjsz'">降级设置</el-button>
                            <!--<el-button type="primary" size="small" @click="priceLevel(scope.$index,scope.row)">价格阶层</el-button>-->
                            <el-button type="success" size="small" @click="editItem(scope.$index,scope.row)" v-auth="'vip.levelManage.bj'">编辑
                            </el-button>
                            <!--<el-button type="danger" size="small" @click="delItem(scope.$index,scope.row.id)">删除-->
                            <!--</el-button>-->
                            <el-button type="danger" size="small" @click="toLevelInfo(scope.$index,scope.row)" v-auth="'vip.levelManage.cjxx'">层级信息
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.currentPage"
                        :page-size="page.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="page.totalPage">
                    </el-pagination>
                </div>
            </template>
        </div>

        <!--添加/编辑层级弹窗-->
        <el-dialog :title="title" :visible.sync="editMask">
            <el-form v-model="form" label-width="100px">
                <el-form-item prop="name" label="名称">
                    <el-input v-model="form.name" auto-complete="off" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item prop="level" label="层级">
                    <el-input v-model="form.level" auto-complete="off" placeholder="请输入数值"></el-input>
                    <span>级</span>
                </el-form-item>
                <el-form-item label="能否参加拼店">
                    <el-radio-group v-model="form.allowGroupStore">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="能否创建店铺">
                    <el-radio-group v-model="form.allowCreateStore">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否晋级">
                    <el-radio-group v-model="form.autoUp">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注说明" class="remark-area">
                    <el-input v-model="form.remark" auto-complete="off" placeholder="请输入说明文字"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="addOrEdit('form')">确定保存</el-button>
                <el-button  @click="cancel">取消</el-button>
            </div>
        </el-dialog>
        <!--价格层级弹窗-->
        <!--<el-dialog title="选择价格层级" :visible.sync="priceLevelMask">
            <el-form v-model="priceLevelForm">
                <el-form-item label="用户层级名称" :label-width="formLabelWidth">
                    <el-input v-model="priceLevelForm.name" auto-complete="off" placeholder="请输入名称"></el-input>
                    <span>元</span>
                </el-form-item>
                <el-form-item label="层级" :label-width="formLabelWidth">
                    <el-input v-model="priceLevelForm.level" auto-complete="off" placeholder="请输入数值"></el-input>
                    <span>分</span>
                </el-form-item>
                <el-form-item label="选择价格层级模板" :label-width="formLabelWidth">
                    <el-select v-model="priceLevelForm.status">
                        <el-option label="是" value="0"></el-option>
                        <el-option label="否" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注说明" :label-width="formLabelWidth" class="remark-area">
                    <el-input v-model="priceLevelForm.remarks" auto-complete="off" placeholder="请输入说明文字"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrEdit">确定保存</el-button>
                <el-button @click="priceLevelMask = false">重置</el-button>
            </div>
        </el-dialog>-->
        <!--删除弹窗-->
        <delete-toast :id='delId' :uri='delUri' :url='delUrl' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import icon from '@/components/common/ico.vue';
    import deleteToast from '@/components/common/DeleteToast';
    import utils from '@/utils/index.js';
    import request from '@/http/http.js';
    import { myMixinTable } from '@/JS/commom';

    export default {
        components: {
            vBreadcrumb, icon, deleteToast
        },
        mixins: [myMixinTable],
        data() {
            return {

                tableData: [],
                height: '',
                editMask: false,
                // priceLevelMask:false,//价格层级弹窗
                form: {// 添加修改表单
                    name: '',
                    level: '',
                    autoUp: '1',
                    allowGroupStore: '1',
                    allowCreateStore: '1',
                    remark: ''
                },
                rules: {},
                title: '添加层级',
                isShowDelToast: false,
                delId: '',
                delUrl: '',
                delUri: '',
                tableLoading: false,
                btnLoading: false,
                isUp: false,
                id: ''
            };
        },
        activated() {
            this.getList();
        },
        methods: {
            // 取消
            cancel() {
                this.editMask = false;
                this.getList();
            },
            // 获取列表
            getList(val) {
                const that = this;
                const data = {
                    page: 1,
                    pageSize: this.page.pageSize
                };
                that.tableLoading = true;
                request.getList(data).then(res => {
                    that.tableLoading = false;
                    that.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    console.log(err);
                    that.tableLoading = false;
                });
            },
            // 添加层级
            addClassify() {
                this.title = '添加层级';
                this.editMask = true;
                this.isUp = false;
                utils.cleanFormData(this.form);
                this.form.autoUp = '1';
                this.form.allowGroupStore = '1';
                this.form.allowCreateStore = '1';
            },
            // 编辑
            editItem(index, row) {
                this.title = '编辑层级';
                this.editMask = true;
                this.form.name = row.name;
                this.form.level = row.level;
                this.form.remark = row.remark;
                this.form.autoUp = row.autoUp.toString();
                this.form.allowGroupStore = row.allowGroupStore.toString();
                this.form.allowCreateStore = row.allowCreateStore.toString();
                this.id = row.id;
                this.isUp = true;
            },
            // 添加修改确定
            addOrEdit(formName) {
                const url = '';
                const data = {};
                data.name = this[formName].name;
                data.level = this[formName].level;
                if (data.name === '' || data.level === '') {
                    this.$message.warning('层级、层级名称不能为空!');
                    return;
                }
                data.autoUp = this[formName].autoUp;
                data.allowGroupStore = this[formName].allowGroupStore;
                data.allowCreateStore = this[formName].allowCreateStore;
                data.remark = this[formName].remark;
                // if (!this.isUp) {
                //     url = 'addDealerLevel';
                // } else {
                //     url = 'updateUserLevel';
                //     data.id = this.id;
                // }
                data.id = this.id;
                this.btnLoading = true;
                request.updateUserLevel(data).then(res => {
                    // this.$message.success(res.data.msg);
                    this.btnLoading = false;
                    this.editMask = false;
                    this.getList();
                }).catch(err => {
                    this.btnLoading = false;
                    console.log(err);
                });
            },

            // 晋级设置
            upSet(index, row) {
                this.$router.push({ name: 'promotionManage', query: { levelMangeToUp: row.id }});
            },
            // 降级设置
            downSet(index, row) {
                this.$router.push({ name: 'degradeManage', query: { levelMangeToLower: row.id }});
            },
            // //价格阶层
            // priceLevel(index,row){
            //
            // },
            // 删除
            delItem(index, id) {
                this.delId = id;
                this.delUrl = 'deleteUserLevelById';
                this.isShowDelToast = true;
            },
            // 删除弹窗
            deleteToast(msg) {
                this.isShowDelToast = msg;
                this.getList();
            },
            // 上传图片
            handleIconSuccess(res, file) {

            },
            beforeIconUpload(file) {
                this.form.icon = file.name;
            },
            // 层级信息页面
            toLevelInfo(index, row) {
                this.$router.push({ name: 'levelInfo', query: { levelMangeInfo: row.id }});
            }
        }
    };
</script>

<style lang="less">
    .level{
        /*表格样式*/
        .table-block {
            padding: 20px 20px 60px;
            background: #fff
        }

        .block {
            float: right;
            margin-top: 10px
        }

        /*弹窗样式*/
        .el-dialog {
            width: 530px;
            border-radius: 10px
        }

        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px 50px
        }

        .el-dialog__title {
            color: #ff6868
        }

        .el-dialog .el-input {
            display: inline
        }

        .el-dialog .el-input__inner {
            width: 180px
        }

        .remark-area .el-input__inner {
            width: 360px
        }

        .el-dialog .el-upload--text {
            width: 100px;
            height: 40px;
            border: none
        }

        .el-input__suffix {
            line-height: 24px
        }

        .icon-uploader {
            float: right;
            margin-right: 31px;
            height: 33px
        }

        .icon-uploader .el-button--small {
            border-radius: 5px;
            width: 100px
        }

        .el-upload--text .el-icon-upload {
            line-height: 0;
            margin: 0;
            color: #fff;
            font-size: 14px
        }

        .el-dialog__footer {
            margin-right: 30px
        }

        .el-upload-list {
            display: none
        }
    }
</style>
