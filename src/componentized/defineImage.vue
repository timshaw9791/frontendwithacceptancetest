<template>
    <div class="define-image-container" :class="[size]"
         :style="`margin:${margin};float:${align}`"
         @mouseenter="showEnlarge=true"
         @mouseleave="showEnlarge=true"
         ref="image">
        <img :src="imgUrl"
             @error="errImg=true"
             class="img"/>
        <transition name="enlarge">
            <aside class="enlarge-background"
                   :class="[position]"
                   :style="positionClass"
                   v-show="showEnlarge">
                <div class="enlarge-box" :class="[previewSize]">
                    <img :src="imgUrl" class="img">
                </div>
            </aside>
        </transition>
    </div>
</template>

<script>
    import { imgBaseUrl} from "api/config";
    export default {
        name: "defineImage",
        props: {
            url: {
                default: ''
            },
            size: {
                type: String,
                default: 'medium'
            },
            margin: {
                type: String,
                default: '0'
            },
            align: {
                type: String,
                default: 'none'
            },
            previewSize: {
                type: String,
                default: 'small'
            },
            position: { // 浮动层显示的位置，并且控制下级伪元素的朝向
                type: String,
                default: 'right'
            }
        },
        data() {
            return {
                noImgUrl:require('@/assets/noImg.png'), // 没有图片时显示的占位图
                errorImgUrl: require('@/assets/splitImg.png'), // 图片加载失败时的占位图
                errImg: false, // 图片加载是否失败
                showEnlarge: false, // 是否显示放大的图标
                containerW: 0, // 原图宽
                containerH: 0, // 原图高
            }
        },
        computed: {
            imgUrl() {
                return this.url?this.errImg?this.errorImgUrl:imgBaseUrl+this.url:this.noImgUrl
            },
            positionClass() {
                switch (this.position) {
                    case 'right':
                        return `left:100%;transform:translate(0,calc(-50% - ${this.containerH/2}px))`
                    case 'left':
                        return `right:100%;transform:translate(0,calc(-50% - ${this.containerH/2}px))`
                    case 'top':
                        return `bottom:100%;transform:translate(calc(-50% + ${this.containerW/2}px), 0)`
                    case 'bottom':
                        return `top:100%;transform:translate(calc(-50% + ${this.containerW/2}px), 0)`
                }
            }
        },
        watch: {
            url() {
                this.errImg = false
            }
        },
        mounted() {
            this.containerW = this.$refs.image.offsetWidth
            this.containerH = this.$refs.image.offsetHeight
        }
    }
</script>

<style scoped>
    .define-image-container {
        display: inline-block;
        position: relative;
        text-align: center;
        vertical-align: top;
    }
    .img {
        width: 100%;
        height: 100%;
        vertical-align: middle;
    }
    .border {
        border: 1px dashed #d9d9d9;
    }
    .tiny {
        width: 30px;
        height: 30px;
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
    .enlarge-background .small {
        width: 200px;
        height: 200px;
    }
    .enlarge-background .medium {
        width: 500px;
        height: 500px;
    }
    .enlarge-background .large {
        width: 800px;
        height: 800px;
    }
    .enlarge-background {
        position: absolute;
        /*left: 100%;*/
        /*transform: translate(0, -50%);*/
        background-color: transparent;
        z-index: 999;
    }
    .enlarge-box {
        padding: 10px;
        background-color: white;
        margin: 12px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
    .left .enlarge-box::after {
        content: '';
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 7px;
        border-color: transparent transparent transparent white;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0;
    }
    .right .enlarge-box::after {
        content: '';
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 7px;
        border-color: transparent white transparent transparent;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
    }
    .top .enlarge-box::after {
        content: '';
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 7px;
        border-color: white transparent transparent transparent;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
    }
    .bottom .enlarge-box::after {
        content: '';
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 7px;
        border-color: transparent transparent white transparent;
        position: absolute;
        top: 0;
        transform: translateX(-50%);
        left: 50%;
    }
    .arrow {
        width: 10px;
        height: 0;
        border-style: solid;
        border-width: 7px;
        /*border-color: white white transparent transparent;*/
        border-color: orange;
        border-top-color: transparent;
        border-right-color: transparent;
        position: absolute;
        transform: rotate(45deg);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        top: 50%;
        left: -7px;
    }
    /*drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03))*/
    .enlarge-enter-active,
    .enlarge-leave-active {
        transition: opacity 0.3s;
    }
    .enlarge-enter,
    .enlarge-leave-to {
        opacity: 0;
    }
</style>