<template>
    <div class="choose-box">
        <el-input v-if="!isLevel"
                placeholder="输入品牌关键词搜索"
                suffix-icon="el-icon-search"
                @change="search" v-model="value">
        </el-input>
        <div style="margin-top: 10px">
            <div class="check-area">
                <div class="title">选择品牌</div>
                <div>
                    <ul v-loading="loading" v-if="brandList">
                        <li v-for="(item,index) in brandList" v-if="!item.allChecked"
                            @click="chooseBrand(item,index)"
                            :class="item.checked?'selected':''">{{item.name}}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="check-area">
                <div class="title">选择品类</div>
                <div>
                    <ul v-loading="loading" v-if="brandList[brandIndex]">
                        <li v-for="(item,index) in brandList[brandIndex].classifyList" v-if="!item.hasChecked"
                            @click="chooseClassify(item,index)"
                            :class="item.checked?'selected':''">{{item.name}}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="opr-area">
                <el-button type="primary" @click="addBrandClassify">添加品类</el-button>
                <el-button @click="delBrandClassify">删除品类</el-button>
            </div>
            <div class="check-area">
                <div class="title">已选择品牌-品类</div>
                <div>
                    <ul>
                        <li v-for="(item,index) in chooseList" @click="delItem(item,index)"
                            :class="item.checked?'selected':''">{{item.name}}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import icon from './ico';
    import * as api from '../../api/api';

    export default {
        components: {
            icon
        },
        props: ['productcIds', 'isLevel', 'brands'],
        data() {
            return {
                value: '',
                brandList: [],
                tempChooseList: [],
                chooseList: [],
                brandName: '',
                classifyName: [],
                brandIndex: '0',
                brandId: '',
                classifyId: [],
                brandsId: [],
                delBrandId: '',
                delClassifyId: [],
                loading: false
            };
        },
        created() {
            // 获取品牌列表并默认加载第一个品牌对于的品类列表
            const that = this;
            that.search(that.value);
        },
        methods: {
            // 根据品牌名称查询
            search(name) {
                const that = this;
                const data = {
                    name: name
                };
                that.loading = true;
                let url = '';
                if (that.isLevel) {
                    url = api.getList;
                } else {
                    url = api.getFirstList;
                }
                that.$axios
                    .post(url, data)
                    .then(res => {
                        that.loading = false;
                        if (res.data.code == 200) {
                            for (const i in res.data.data) {
                                res.data.data[i].checked = false;
                                res.data.data[0].checked = true;
                                res.data.data[i].allChecked = false;
                                res.data.data[i].classifyList = [];
                            }
                            that.brandList = res.data.data;
                            that.brandName = that.brandList[0].name;
                            that.brandId = that.brandList[0].id;
                            that.brandsId.push(that.brandList[0].id);
                            that.getClassifyList(0, that.brandList[0].id);
                        } else {
                            that.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        that.loading = false;
                    });
            },
            // 获取品牌下品类列表
            getClassifyList(index, id) {
                const that = this;
                that.brandList[index].classifyList = [];
                const data = {
                    fatherid: id
                };
                let url = '';
                if (that.isLevel) {
                    url = api.getProductCategoryList;
                } else {
                    url = api.getSecondList;
                }
                that.loading = true;
                that.$axios
                    .post(url, data)
                    .then(res => {
                        that.loading = false;
                        if (res.data.code == 200) {
                            for (const i in res.data.data) {
                                const itemId = res.data.data[i].id;
                                if (that.classifyId.indexOf(itemId) == -1 && that.brandList[index].classifyList.indexOf(itemId) == -1) {
                                    res.data.data[i].checked = false;
                                    res.data.data[i].hasChecked = false;
                                }
                            }
                            that.brandList[index].classifyList = res.data.data;
                        } else {
                            that.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        that.loading = false;
                    });
            },
            // 选择品牌
            chooseBrand(item, index) {
                const that = this;
                that.brandName = that.brandList[index].name;
                that.brandIndex = index;
                that.brandId = item.id;
                if (that.brandsId.indexOf(item.id) == -1) {
                    that.brandsId.push(item.id);
                }
                that.$emit('brandsId', that.brandsId);
                that.getClassifyList(index, item.id);
                for (const i in that.brandList) {
                    if (i == index) {
                        that.brandList[i].checked = true;
                    } else {
                        that.brandList[i].checked = false;
                    }
                }
            },
            // 选择品类
            chooseClassify(item, index) {
                const that = this;
                item.checked = !item.checked;// 添加样式
                const id = item.id;
                const name = item.name;
                if (item.checked) {
                    that.classifyId.push(id);
                    that.classifyName.push(name);
                    that.tempChooseList.push({
                        brandId: that.brandList[that.brandIndex].id,
                        brandName: that.brandList[that.brandIndex].name
                    });
                } else {
                    for (const i in that.classifyId) {
                        if (id == that.classifyId[i]) {
                            that.classifyId.splice(i, 1);
                            that.classifyName.splice(i, 1);
                            that.tempChooseList.splice(i, 1);
                        }
                    }
                }
            },
            // 添加品类
            addBrandClassify() {
                const that = this;
                that.chooseList = [];
                for (const i in that.tempChooseList) {
                    const param = {
                        brandId: that.tempChooseList[i].brandId,
                        classifyId: that.classifyId[i],
                        name: that.tempChooseList[i].brandName + '-' + that.classifyName[i],
                        checked: false
                    };
                    that.chooseList.push(param);
                    that.changeClassifyList(that.tempChooseList[i].brandId, that.classifyId[i], 'add');
                    that.brandIsAllCheck();
                }
                that.$emit('productcIds', that.classifyId);
            },
            // 选中已选择的品类
            delItem(item, index) {
                const that = this;
                item.checked = !item.checked;
                if (that.chooseList[index].checked) {
                    if (that.delClassifyId.indexOf(item.classifyId) == -1) {
                        that.delBrandId = item.brandId;
                        that.delClassifyId.push(item.classifyId);
                    }
                } else {
                    for (const i in that.delClassifyId) {
                        if (item.classifyId == that.delClassifyId[i]) {
                            that.delClassifyId.splice(i, 1);
                        }
                    }
                }
            },
            // 删除品类
            delBrandClassify() {
                const that = this;
                for (const i in that.delClassifyId) {
                    for (const j in that.chooseList) {
                        if (that.delClassifyId[i] == that.chooseList[j].classifyId && that.chooseList[j].checked) {
                            that.changeClassifyList(that.chooseList[j].brandId, that.delClassifyId[i], 'del');
                            that.brandIsAllCheck();
                            that.chooseList.splice(j, 1);
                            that.tempChooseList.splice(j, 1);
                            that.classifyId.splice(j, 1);
                            that.classifyName.splice(j, 1);
                        }
                    }
                }
                that.$emit('productcIds', that.classifyId);
            },
            // 判断品牌是否已被全选
            brandIsAllCheck() {
                const that = this;
                for (const i in that.brandList) {
                    let num = 0;
                    for (const j in that.brandList[i].classifyList) {
                        if (that.brandList[i].classifyList[j].hasChecked) {
                            num++;
                        }
                        if (num == that.brandList[i].classifyList.length) {
                            that.brandList[i].allChecked = true;
                        } else {
                            that.brandList[i].allChecked = false;
                        }
                    }
                }
            },
            // 改变品类容器节点
            changeClassifyList(brandId, classifyId, addOrDel) {
                const that = this;
                for (const i in that.brandList) {
                    if (that.brandList[i].id == brandId) {
                        for (const j in that.brandList[i].classifyList) {
                            if (that.brandList[i].classifyList[j].id == classifyId && ((!that.brandList[i].classifyList[j].hasChecked && addOrDel == 'add') || (that.brandList[i].classifyList[j].hasChecked && addOrDel == 'del'))) {
                                that.brandList[i].classifyList[j].hasChecked = !that.brandList[i].classifyList[j].hasChecked;
                                that.brandList[i].classifyList[j].checked = false;
                            }
                        }
                    }
                }
            }
        }
    };
</script>
<style lang="less" scoped>
    .choose-box {
        display: inline-block;
        .opr-area {
            float: left;
            width: 150px;
            text-align: center;
            margin-left: -10px;
        }

        .opr-area .el-button {
            margin-top: 30px
        }

        .opr-area .el-button:nth-child(2) {
            margin-left: 0
        }

        .check-area {
            float: left;
            width: 191px;
            font-size: 12px;
            color: #999;
            border: 1px solid #dfdfdf;
            margin-right: 10px;
            border-radius: 5px;
        }

        .title {
            background: #eee;
            height: 28px;
            line-height: 28px;
            text-align: center;
            border-bottom: 1px solid #dfdfdf;
        }

        ul {
            line-height: 25px;
            height: 120px;
            overflow-y: auto;
            overflow-x: hidden
        }

        ul li {
            list-style: none;
            padding-left: 10px;
            cursor: pointer
        }

        .selected {
            background: #409EFF;
            color: #fff
        }
    }

</style>


