<template>
    <div class="choose-box">
        <el-input
                placeholder="输入品牌关键词搜索"
                suffix-icon="el-icon-search"
                @change="search" v-model="value" v-if="!isSearch">
        </el-input>
        <div style="margin-top: 10px">
            <div class="check-area">
                <div class="title">选择一级类目</div>
                <div>
                    <ul v-loading="loading" v-if="brandList">
                        <li v-for="(item,index) in brandList"
                            @click="chooseBrand(item,index)"
                            :class="brandIndex==index?'selected':''">{{item.name}}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="check-area">
                <div class="title">选择二级类目</div>
                <div v-if="!brandList[brandIndex].allChecked">
                    <ul v-loading="loading" v-if="brandList[brandIndex]">
                        <li v-for="(item,index) in brandList[brandIndex].classifyList" v-if="!item.hasChecked"
                            @click="chooseClassify(item,index)"
                            :class="item.checked?'selected':''">{{item.name}}
                        </li>
                    </ul>
                </div>
                <div v-else class="nodata">
                    暂无数据~
                </div>
            </div>
            <div class="opr-area">
                <el-button type="primary" @click="addBrandClassify">添加类目</el-button>
                <el-button @click="delBrandClassify">删除类目</el-button>
            </div>
            <div class="check-area">
                <div class="title">已选择一级-二级</div>
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
    import icon from "./ico";
    import * as api from '../../api/api'

    export default {
        components: {
            icon
        },
        props: ['productcIds', 'detailData', 'addOrUp','isSearch','isSupplider'],
        data() {
            return {
                value: '',//查询关键词
                brandList: [{
                    allChecked:false
                }],//品牌列表
                tempChooseList: [],//缓存选择的品类
                chooseList: [],//选择的品类
                brandName: '',//选择的品牌名称
                brandId: '',//选择的品牌id
                // brandsId: [],//选择的品牌id
                classifyName: [],//选择的品类
                brandIndex: '0',//品牌索引值
                classifyId: [],//选择的品类id
                delBrandId: '',//删除的品牌id
                delClassifyId: [],//删除的品类id
                loading: false,
            };
        },
        watch: {
            detailData(params) {
                if(params){
                    this.getHistoryClassify();
                    this.search(this.value);
                }
            }

        },
        activated(){
            // 获取品牌列表并默认加载第一个品牌的对应的品类列表
            let that = this;
            if(that.addOrUp != 'update'){
                that.search(that.value);
                that.chooseList=[];
                that.tempChooseList=[];
                that.value='';
                that.brandList=[{
                    allChecked:false
                }];
                that.brandName='';
                that.brandId='';
                that.delBrandId='';
                that.classifyName=[];
                that.brandIndex='0';
                that.classifyId=[];
                that.delClassifyId=[];
            }
        },
        created() {
            // // 获取品牌列表并默认加载第一个品牌对于的品类列表
            // let that = this;
            // if(that.addOrUp != 'update'){
            //     that.search(that.value);
            // }else{
            //     console.log(that.chooseList)
            //     that.chooseList=[];
            //     that.tempChooseList=[];
            //     console.log(that.chooseList)
            // }
        },
        methods: {
            //修改时获取原数据
            getHistoryClassify() {
                let that = this;
                that.chooseList=[];
                that.classifyId=[];
                that.classifyName=[];
                that.tempChooseList=[];
                if(that.isSupplider){
                    for (let i in that.detailData) {
                        let brandName = that.detailData[i].p_name;
                        let brandId = that.detailData[i].fatherid || that.detailData[i].first_category_id;
                        let child = that.detailData[i].name;
                        let id = that.detailData[i].sec_category_id;
                        let param = {
                            brandId: brandId,
                            name: brandName + '-' + child,
                            checked: false,
                            classifyId: id,
                        };
                        that.tempChooseList.push({
                            brandId: brandId,
                            brandName: brandName
                        });
                        that.classifyId.push(id);
                        that.classifyName.push(child);
                        that.chooseList.push(param);
                    }
                    let arr=[];
                    for(let i in that.tempChooseList){
                        let temp={
                            firstCategoryId:that.tempChooseList[i].brandId,
                            secCategoryId:that.classifyId[i]
                        };
                        arr.push(temp)
                    }
                    that.$emit('productcIds',arr)
                }else{
                    for (let i in that.detailData) {
                        let brandName = that.detailData[i].product_name;
                        let brandId = that.detailData[i].product_id;
                        let child = that.detailData[i].category_name;
                        let id = that.detailData[i].c_id;
                        let param = {
                            brandId: brandId,
                            name: brandName + '-' + child,
                            checked: false,
                            classifyId: id,
                        };
                        that.tempChooseList.push({
                            brandId: brandId,
                            brandName: brandName
                        });
                        that.classifyId.push(id);
                        that.classifyName.push(child);
                        that.chooseList.push(param);
                    }
                    that.$emit('productcIds', that.classifyId)
                }

            },
            //根据品牌名称查询
            search(name) {
                let that = this;
                let data = {
                    name: name
                };
                that.loading = true;
                that.$axios
                    .post(api.getFirstList, data)
                    .then(res => {
                        that.loading = false;
                        if (res.data.code == 200) {
                            for (let i in res.data.data) {
                                res.data.data[i].checked = false;
                                res.data.data[0].checked = true;
                                res.data.data[i].allChecked = false;
                                res.data.data[i].classifyList = []
                            }
                            that.brandList = res.data.data;
                            that.brandName = that.brandList[0].name;
                            that.brandId = that.brandList[0].id;
                            that.getClassifyList(0, that.brandList[0].id);
                        } else {
                            that.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        that.loading = false;
                    })
            }
            ,
            //获取品牌下品类列表
            getClassifyList(index, id) {
                let that = this;
                that.brandList[index].classifyList = [];
                let data = {
                    fatherid: id,
                };
                that.loading = true;
                that.$axios
                    .post(api.getSecondList, data)
                    .then(res => {
                        that.loading = false;
                        if (res.data.code == 200) {
                            if (res.data.data.length) {
                                for (let i in res.data.data) {
                                    let itemId = res.data.data[i].id;
                                    if (that.classifyId.indexOf(itemId) == -1) {
                                        res.data.data[i].checked = false;
                                        res.data.data[i].hasChecked = false;
                                    } else {
                                        res.data.data[i].checked = true;
                                        res.data.data[i].hasChecked = true;
                                    }
                                }
                            } else {
                                that.brandList[index].allChecked = true
                            }
                            that.brandList[index].classifyList = res.data.data;
                            that.brandIsAllCheck();
                        } else {
                            that.$message.warning(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        that.loading = false;
                    });

            }
            ,
            //选择品牌
            chooseBrand(item, index) {
                let that = this;
                that.brandName = that.brandList[index].name;
                that.brandIndex = index;
                that.brandId = item.id;
                that.getClassifyList(index, item.id);
            }
            ,
            //选择品类
            chooseClassify(item, index) {
                let that = this;
                item.checked = !item.checked;//添加样式
                let id = item.id;
                let name = item.name;
                if (item.checked) {
                    that.classifyId.push(id);
                    that.classifyName.push(name);
                    that.tempChooseList.push({
                        brandId: that.brandList[that.brandIndex].id,
                        brandName: that.brandList[that.brandIndex].name
                    })
                } else {
                    for (let i in that.classifyId) {
                        if (id == that.classifyId[i]) {
                            that.classifyId.splice(i, 1);
                            that.classifyName.splice(i, 1);
                            that.tempChooseList.splice(i, 1);
                        }
                    }
                }
            }
            ,
            //添加品类
            addBrandClassify() {
                let that = this;
                that.chooseList = [];
                for (let i in that.tempChooseList) {
                    let param = {
                        brandId: that.tempChooseList[i].brandId,
                        classifyId: that.classifyId[i],
                        name: that.tempChooseList[i].brandName + '-' + that.classifyName[i],
                        checked: false
                    };
                    that.chooseList.push(param);
                    that.changeClassifyList(that.tempChooseList[i].brandId, that.classifyId[i], 'add');
                    that.brandIsAllCheck();
                }
                if(that.isSupplider){
                    let arr=[];
                    for(let i in that.tempChooseList){
                        let temp={
                            firstCategoryId:that.tempChooseList[i].brandId,
                            secCategoryId:that.classifyId[i]
                        };
                       arr.push(temp)
                    }
                    that.$emit('productcIds',arr)
                }else{
                    that.$emit('productcIds', that.classifyId)
                }
            }
            ,
            //选中已选择的品类
            delItem(item, index) {
                let that = this;
                item.checked = !item.checked;
                if (that.chooseList[index].checked) {
                    if (that.delClassifyId.indexOf(item.classifyId) == -1) {
                        that.delBrandId = item.brandId;
                        that.delClassifyId.push(item.classifyId);
                    }
                } else {
                    for (let i in that.delClassifyId) {
                        if (item.classifyId == that.delClassifyId[i]) {
                            that.delClassifyId.splice(i, 1);
                        }
                    }
                }
            }
            ,
            //删除品类
            delBrandClassify() {
                let that = this;
                for (let i in that.delClassifyId) {
                    for (let j in that.chooseList) {
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
                if(that.isSupplider){
                    let arr=[];
                    for(let i in that.tempChooseList){
                        let temp={
                            firstCategoryId:that.tempChooseList[i].brandId,
                            secCategoryId:that.classifyId[i]
                        };
                        arr.push(temp)
                    }
                    that.$emit('productcIds',arr)
                }else{
                    that.$emit('productcIds', that.classifyId)
                }
            }
            ,
            // 判断品牌是否已被全选
            brandIsAllCheck() {
                let that = this;
                for (let i in that.brandList) {
                    let num = 0;
                    for (let j in that.brandList[i].classifyList) {
                        if (that.brandList[i].classifyList[j].hasChecked) {
                            num++;
                        }
                        if (num == that.brandList[i].classifyList.length) {
                            that.brandList[i].allChecked = true
                        } else {
                            that.brandList[i].allChecked = false
                        }
                    }
                }
            }
            ,
            //改变品类容器节点
            changeClassifyList(brandId, classifyId, addOrDel) {
                let that = this;
                for (let i in that.brandList) {
                    if (that.brandList[i].id == brandId) {
                        for (let j in that.brandList[i].classifyList) {
                            if (that.brandList[i].classifyList[j].id == classifyId && ((!that.brandList[i].classifyList[j].hasChecked && addOrDel == 'add') || (that.brandList[i].classifyList[j].hasChecked && addOrDel == 'del'))) {
                                that.brandList[i].classifyList[j].hasChecked = !that.brandList[i].classifyList[j].hasChecked;
                                that.brandList[i].classifyList[j].checked = false
                            }
                        }
                    }
                }
            }
        }
    }
    ;
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
        .nodata {
            height: 120px;
            text-align: center;
        }
    }

</style>


