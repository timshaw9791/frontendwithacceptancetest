<template>
    <div class="upload-file-container" :class="[size,{border}]" :style="`margin:${margin};float:${align}`">
        <input type="file" class="file" :accept="acceptType" @change="changeFile" ref="file">
        <div class="icon-box" @click="showFileSelect">
            <i class="iconfont iconjiahao" v-show="!disabled&&!fileName"></i>
            <i class="iconfont iconPDF" v-show="type=='pdf'&&fileName"></i>
            <i class="iconfont icondianshi-shipinsuolve" v-show="type=='video'&&fileName"></i>
            <img :src="imgSrc" class="img" v-if="fileName&&type=='img'" alt="图片加载失败">
            <img src="@/assets/noThumbnails.png" class="img" v-if="disabled&&!fileName">
        </div>
    </div>
</template>

<script>
import { imgBaseUrl, pdfBaseUrl, videoBaseUrl, imgUpUrl, pdfUpUrl, videoUpUrl } from 'api/config'
import axios from 'axios'
export default {
    name: 'uploadFile',
    data() {
        return {
            fileName: '',
            fetch: '',
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        }
    },
    props: {
        size: {
            type: String,
            default: 'medium'
        },
        type: {
            type: String,
            default: 'img',
            validator: function(value) {
                return ['img','pdf','video'].includes(value)
            }
        },
        value: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        margin: {
            type: String,
            default: '0'
        },
        align: {
            type: String,
            default: 'none'
        }
    },
    computed: {
        acceptType() {
            return this.type=='img'?'.jpg,.jpeg,.png,.JPG,.JPEG':this.type=='pdf'?'.pdf':'video/*'
        },
        imgSrc() {
            return `${imgBaseUrl}${this.fileName}`;
        },
        border() {
            return ['video', 'pdf'].includes(this.type)?true:(this.disabled||!this.fileName)?false:true
        }
    },
    methods: {
        init() {
            this.fetch = axios.create({
                withCrDedentials: true
            })
        },
        showFileSelect() {
            if(this.disabled||this.fileName) return;
            this.$refs.file.click();
        },
        changeFile() {
            let file = this.$refs.file.files[0];
            if(!file) return;
            switch (this.type) {
                case 'img':
                    this.upFile(imgUpUrl, file);
                    break;
                case 'pdf':
                    this.upFile(pdfUpUrl, file);
                    break;
                case 'video':
                    this.upFile(videoUpUrl, file);
                    break;
                default:
                    break;
            }
            this.fileName = file.name;
            this.$emit('input', this.fileName);
        },
        upFile(url, file) {
            let param = new FormData();
            param.append('file', file, file.name);
            this.fetch.post(url, param, this.config).then(res => {
                console.log("上传成功");
            })
        }
    },
    watch: {
        value() {
            this.fileName = this.value;
        }
    },
    created() {
        this.fileName = this.value;
        this.init();
    }
}
</script>

<style lang="scss" scoped>
.upload-file-container {
    display: inline-block;
    position: relative;
    .file {
        width: 0;
        height: 0;
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
    }
    .img {
        width: 100%;
        height: 100%;
    }
}
.border {
    border: 1px dashed #d9d9d9;
}
.mini {
    width: 60px;
    height: 60px;
}
.small {
    width: 100px;
    height: 100px;
}
.medium {
    width: 150px;
    height: 150px;
}
.large {
    width: 200px;
    height: 200px;
}
.icon-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.iconPDF,
.icondianshi-shipinsuolve {
    font-size: 60px;
}
</style>