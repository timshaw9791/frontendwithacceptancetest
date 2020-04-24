<template>
    <!--使用imageUrl和noImg区分样式-->
    <div :class="imageUrl||noImg?'haveImg':'img'">
        <el-upload
                class="avatar-uploader"
                accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                :action=url
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :disabled=disabled
                :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="haveImg" alt="">
            <img v-else-if="noImg" src="@/assets/noThumbnails.png" class="haveImg" alt="">
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>


<script>
    import {imgUpUrl, imgBaseUrl} from "api/config";
    import {delFile} from "api/basic";
    export default {
        name: "imgUp",
        data() {
            return {
                url:'',
                imageUrl:'',
            };
        },
        props:{
            //noImg是否显示暂无缩略图
            noImg:{
                type:Boolean,
                default:false
            },
            //是否可以点击
            disabled:{
                type:Boolean,
                default:false
            }
        },
        methods: {
            //上传图片成功后的调用方法
            handleAvatarSuccess(res) {
                this.imageUrl = `${imgBaseUrl}${res}`;
                this.$emit('success', res);
            },
            //上传图片前调用，该方法限制上传内容
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                // const isJPG = file.type === 'image/jpeg/png/JPG/JPEG';
                // if (!isJPG) {
                //     this.$message.error('上传头像图片只能是 JPG 格式!');
                // }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                delFile({
                    filename: this.imageUrl.split('/')[this.imageUrl.split('/').length - 1],
                    category: 'image'
                }).then(res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                });
                return isLt2M;
            }
        },
        mounted() {
            this.url = imgUpUrl
        },
    }
</script>

<style lang="scss" scoped>
    .img{
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        overflow: hidden;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;

    }
    .img:hover  {
        border-color: #409EFF;
    }

    .haveImg{
        border-radius: 6px;
        overflow: hidden;
        width: 178px;
        height: 178px;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
    }
</style>