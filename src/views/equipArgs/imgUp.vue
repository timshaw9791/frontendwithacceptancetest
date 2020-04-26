<template>
    <el-upload
            :class="haveImg?'img':'upImg'"
            accept=".jpg,.jpeg,.png,.JPG,.JPEG"
            :action=url
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :disabled=disabled
            :before-upload="beforeAvatarUpload">
        <img v-if="haveImg" :src="imageUrl" class="img" alt="" onerror="this.src='@/assets/noThumbnails.png'">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</template>


<script>
    import {imgUpUrl, imgBaseUrl} from "../../api/config";
    import {delFile} from "api/basic";

    export default {
        name: "imgUp",
        data() {
            return {
                url: imgUpUrl,
                imageUrl: '',
                haveImg: false
            };
        },
        props: {
            src: {
                type: String,
                default: ""
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            //上传图片成功后的调用方法
            handleAvatarSuccess(res) {
                this.imageUrl = `${imgBaseUrl}${res}`;
                this.haveImg=true
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
                // delFile({
                //     filename: this.imageUrl.split('/')[this.imageUrl.split('/').length - 1],
                //     category: 'image'
                // }).then(res => {
                //     console.log(res);
                // }).catch(err => {
                //     console.log(err);
                // });
                return isLt2M;
            },

        },
        watch:{
            src:function () {
                if (this.src) {
                    this.imageUrl = imgBaseUrl+this.src
                    this.haveImg = true
                }
                this.disabled = this.$props.disabled
            }
        }
    }
</script>

<style lang="scss" scoped>
    .upImg {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        overflow: hidden;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .upImg:hover {
        border-color: #409EFF;
    }

    .img {
        border-radius: 6px;
        overflow: hidden;
        width: 178px;
        height: 178px;
        display: block;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
    }
</style>