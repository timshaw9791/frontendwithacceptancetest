<template>
    <div class="img">
        <el-upload
                :disabled="disabled"
                class="avatar-uploader"
                :action=url
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
    import {imgUpUrl, imgBaseUrl} from "api/config";
    import {delFile} from "api/basic";

    export default {
        data() {
            return {
                imageUrl: '',
                url: '',
            };
        },
        props: {
            disabled: {
                type: [Boolean, String],
                default: false
            },
            image: {
                type: String,
                default: null
            }
        },


        methods: {
            handleAvatarSuccess(res) {
                this.imageUrl = `${imgBaseUrl}${res}`;
                this.$emit('success', res);
            },
            beforeAvatarUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
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

                return isLt2M
            },

        },
        watch: {
            image(newVal) {
                newVal ? this.imageUrl = newVal : this.imageUrl = '';

            }
        },


        mounted() {
            this.url = imgUpUrl
        }
    }
</script>

<style lang="scss" scoped>
    .img {
        border: 1px dashed #d9d9d9;

        .avatar-uploader .el-upload {
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }

        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 150px;
            height: 150px;
            line-height: 150px;
            text-align: center;
        }

        .avatar {
            width: 150px;
            height: 150px;
            display: block;
        }
    }

    .img:hover {
        border-color: #409EFF;
    }

    .imgDisabled {

    }

</style>