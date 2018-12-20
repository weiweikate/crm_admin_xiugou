<template>
    <div class="choose-box">
        <el-input
            placeholder="输入品牌关键词搜索"
            suffix-icon="el-icon-search"
            @change="getBrandList" v-model="brandName">
        </el-input>
        <div style="margin-top: 10px">
            <div class="check-area">
                <div class="title">品牌</div>
                <div>
                    <ul v-loading="loading" v-if="allBrandList">
                        <li v-for="(item,index) in allBrandList"
                            @click="chooseBrand(item,index)"
                            :class="item.checked?'selected':''">{{item.brand_name}}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="opr-area">
                <el-button type="primary" @click="addBrand">添加品牌</el-button>
                <el-button @click="delBrand">删除品牌</el-button>
            </div>
            <div class="check-area">
                <div class="title">已选择品牌</div>
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
    import * as api from '@/api/MemberManage/SupplierManage/index'
    import * as pApi from '@/privilegeList/MemberManage/SupplierManage/index'

    export default {
        components: {
            icon
        },
        props: ['addOrUp', 'brandids', 'detailBrand','secIds'],
        data() {
            return {
                brandName: '',
                allBrandList: [],
                chooseList: [],
                brandIds: [],
                brandNames: [],
                delIds: [],
                loading: false
            }
        },
        watch: {
            detailBrand(params) {
                if(params){
                    this.getHistoryData();
                    this.getBrandList(this.brandName);
                }
            },
            secIds(newVal,oldVal){
                this.getBrandList();
                this.allBrandList.forEach((v,k)=>{
                    this.$set(this.allBrandList,k,v);
                })
            }

        },
        activated() {
            // 获取品牌列表并默认加载第一个品牌的对应的品类列表
            let that = this;
            that.chooseList=[];
            that.tempChooseList=[];
            that.brandName='';
            that.brandName='';
            that.brandNames=[];
            that.brandIds=[];
            that.delIds=[];
            if(that.addOrUp != 'update'){
                
            }else{
                this.getBrandList(this.brandName); 
            }
        },
        methods: {
            //修改时获取原数据
            getHistoryData() {
                let that = this;
                that.chooseList=[];
                that.classifyId=[];
                that.classifyName=[];
                that.tempChooseList=[];
                for (let i in that.detailBrand) {
                    let brandName = that.detailBrand[i].name;
                    let brandId = that.detailBrand[i].brand_id;
                    let param = {
                        id: brandId,
                        name: brandName,
                        checked: false
                    };
                    that.brandIds.push(brandId);
                    that.brandNames.push(brandName);
                    that.chooseList.push(param);
                }
                that.$emit('brandids', that.brandIds)
            },
            // search(){
            //     this.getBrandList(this.brandName)
            // },
            //获取品牌
            getBrandList(value) {
                let that = this;
                that.allBrandList=[];
                if(this.secIds == '') return;
                let data = {
                    cIds:this.secIds,
                    name: value || '',
                };
                // this.$axios
                //     .post(api.queryBrandPageList, data)
                //     .then(res => {
                //         for (let i in res.data.data.data) {
                //             let id=res.data.data.data[i].id;
                //             if(that.brandIds.indexOf(id)==-1&&that.allBrandList.indexOf(id)==-1){
                //                 res.data.data.data[i].checked = false;
                //                 that.allBrandList.push(res.data.data.data[i]);
                //             }
                //         }
                //     })
                //     .catch(err => {
                //         console.log(err);
                //         that.btnLoading = false;
                //     });
                this.$axios.post(api.queryCategoryBrandByCId,data).then(res=>{
                     for (let i in res.data.data) {
                        let id=res.data.data[i].brand_id;
                        if(that.brandIds.indexOf(id)==-1&&that.allBrandList.indexOf(id)==-1){
                            res.data.data[i].checked = false;
                            that.allBrandList.push(res.data.data[i]);
                        }
                    }
                })
            },
            //选择品牌
            chooseBrand(item, index) {
                let that = this;
                item.checked = !item.checked;//添加样式
                let id = item.brand_id;
                let name = item.brand_name;
                if (item.checked && that.brandIds.indexOf(id) == -1) {
                    that.brandIds.push(id);
                    that.brandNames.push(name);
                } else {
                    for (let i in that.brandIds) {
                        if (id == that.brandIds[i]) {
                            that.brandIds.splice(i, 1);
                            that.brandNames.splice(i, 1);
                        }
                    }
                }
            },
            //添加品牌
            addBrand() {
                let that = this;
                that.chooseList = [];
                for (let i in that.brandIds) {
                    let param = {
                        id: that.brandIds[i],
                        name: that.brandNames[i],
                        checked: false
                    };
                    that.chooseList.push(param);
                    this.$set(this.chooseList,i,this.chooseList[i]);
                    for (let j in that.allBrandList) {
                        if (that.allBrandList[j].brand_id == that.brandIds[i]) {
                            that.allBrandList.splice(j, 1)
                        }
                    }
                }
                that.$emit('brandids', that.brandIds)
            },
            //选中已选择的品类
            delItem(item, index) {
                let that = this;
                item.checked = !item.checked;
                if (that.chooseList[index].checked) {
                    if (that.delIds.indexOf(item.brand_id) == -1) {
                        that.delIds.push(item.brand_id);
                    }
                } else {
                    for (let i in that.delIds) {
                        if (item.brand_id == that.delIds[i]) {
                            that.delIds.splice(i, 1);
                        }
                    }
                }
            },
            //删除品类
            delBrand() {
                let that = this;
                console.log(that.chooseList);
                for (let i in that.delIds) {
                    for (let j in that.chooseList) {
                        if (that.delIds[i] == that.chooseList[j].brand_id && that.chooseList[j].checked) {
                            let temp = {
                                brand_id: that.chooseList[j].id,
                                brand_name: that.chooseList[j].name,
                                checked: false
                            };
                            that.allBrandList.push(temp);
                            that.chooseList.splice(j, 1);
                            that.brandIds.splice(j, 1);
                            that.brandNames.splice(j, 1);
                        }
                    }
                }
                that.$emit('brandids', that.brandIds)
            },
        }
    }
</script>

<style scoped lang="less">
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
