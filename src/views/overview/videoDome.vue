<template>
    <div class="container">
        <my-video :playerOptions="playerOptions"></my-video>
    </div>
</template>

<script>
    import myVideo from '@/components/videoPlayer/index'

    export default {

        data() {
            return {
                playerOptions: {
                    live: true,
                    autoplay: false, //如果true,浏览器准备好时开始回放。
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    muted: false, // 默认情况下将会消除任何音频。
                    notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    techOrder: ['flash'],
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    poster: "@/assets/logo.png", //你的封面地址
                    controlBar: {
                        timeDivider: true,
                        durationDisplay: true,
                        remainingTimeDisplay: false,
                        fullscreenToggle: true //全屏按钮
                    },
                    flash: {
                        hls: {
                            withCredentials: false
                        },
                    },
                    sources: [{
                        type: "rtmp/flv",
                        src: "rtmp://58.200.131.2:1935/livetv/hunantv",
                    }],
                }
            }
        },
        components: {
            myVideo
        },
        methods: {
            //事件
        }
    }
</script>

<style scoped>
    .container {

    }
</style>