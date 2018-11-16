<template>
  <div>
      <el-upload
          action="/admin/common/upload/oss"
          :show-file-list="false"
          :before-upload="file=>beforeUploadImage(file, imgList1)"
          :on-progress="(event, file)=>onProgressImage(event, file, imgList1)"
          :on-error="(res, file) =>onErrorImage(res, file,imgList1)"
          :on-success="(res, file) =>onSuccessImage(res, file,imgList1)">
          <!--<img v-if="imageUrl" :src="imageUrl" class="avatar">-->
          <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
      </el-upload>
  </div>
</template>

<script>
import { uploadImage } from '@/JS/commom';
export default {
    mixins: [uploadImage],
    data() {
        return {
            imgList1: 'imgList1',
            imgList1Size: ['335*251', '750*750'],
            imgList2: 'imgList2'
        };
    },
    methods: {
    }
};

</script>
<style lang='less' scoped>
</style>
