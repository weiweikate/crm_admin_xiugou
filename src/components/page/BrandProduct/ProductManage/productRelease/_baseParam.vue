<template>
    <div class="prod-base-param">
        <el-form :model="form" :rules="rules" label-position="left" label-width="120px">
            <div class="pro-title">基础信息</div>
            <el-form-item prop="title" label="商品标题">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item prop="subtitle" label="商品副标题">
                <el-input v-model="form.subtitle"></el-input>
            </el-form-item>
            <el-form-item prop="supplier" label="选择供应商" inline>
                <el-select v-model="form.supplier" placeholder="请选择供应商">
                    <el-option v-for="(v, k) in supplierArr" :key="k" :label="v.label" :value="v.value"></el-option>
                </el-select>
                <el-form-item prop="supplier" label="选择供应商" inline-message="asdsada">
                    <el-select v-model="form.supplier" placeholder="请选择供应商">
                        <el-option v-for="(v, k) in supplierArr" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import request from '@/http/http';
    export default {
        data() {
            return {
                form: {
                    title: '',
                    subtitle: '',
                    supplier: ''
                },
                rules: {
                    title: [{ required: true, message: '请输入商品标题', trigger: 'blur' }, { min: 2, max: 46, message: '长度在 2 到 46 个字符', trigger: 'blur' }],
                    subtitle: [{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }],
                    supplier: [{ required: true, message: '请选择供应商', trigger: 'blur' }]
                },
                supplierArr: [{label: '小米批发商', value: '1'}]
            };
        }
    };
</script>

<style scoped lang="less">
    .prod-base-param{
        .pro-title {
            width: 100%;
            height: 60px;
            background-color: #f7f7f7;
            line-height: 60px;
            padding: 0 25px;
            box-sizing: border-box;
            margin-bottom: 20px;
        }
    }
</style>
