<template>
    <div class="upload-file-container" :class="[size]">
        <!-- <div class="select-file"></div> -->
        <input type="file" class="file" :accept="acceptType">
        <div class="icon-box">
            <i class="iconfont iconjiahao"></i>
            <i class="iconfont iconPDF"></i>
            <i class="iconfont icondianshi-shipinsuolve"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'uploadFile',
    data() {
        return {
            acceptType: '.jpg,.jpeg,.png,.JPG,.JPEG'
        }
    },
    props: {
        size: {
            type: String,
            default: 'medium'
        }
    }
}
</script>

<style lang="scss" scoped>
.upload-file-container {
    display: inline-block;
    position: relative;
    border: 1px solid black;
    .file {
        width: 100%;
        height: 100%;
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
    }
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
    background-color: orange;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>