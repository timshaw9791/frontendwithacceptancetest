<template>
    <div class="container">

        <my-video :playerOptions="playerOptions" class="video"></my-video>

        <my-video :playerOptions="playerOptions" class="video"></my-video>

        <my-video :playerOptions="playerOptions" class="video"></my-video>

        <my-video :playerOptions="playerOptions" class="video"></my-video>

    </div>
</template>

<script>
    import myVideo from '@/components/videoPlayer/index'

    export default {

        data() {
            return {
                playerOptions: {
                    live: false,
                    autoplay: true, //如果true,浏览器准备好时开始回放。
                    preload: 'auto', //视频预加载
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    muted: false, // 默认情况下将会消除任何音频。
                    notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    // techOrder: ['flash'],
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    // poster: "@/assets/logo.png", //你的封面地址
                    controlBar: {
                        timeDivider: false,
                        durationDisplay: false,
                        liveDisplay: false,
                        remainingTimeDisplay: false,
                        fullscreenToggle: true, //全屏按钮
                        progressControl: true,
                        CurrentTimeDisplay: false,
                        RemainingTimeDisplay: false,
                        PlayToggle: false,
                        DurationDisplay: false,
                        // audioTrackButton: false,
                        // subsCapsButton: false
                    },
                    controls: true, //控制条
                    // flash: {
                    //     hls: {
                    //         withCredentials: false
                    //     },
                    // },
                    // sources: [{
                    //     type: "rtmp/flv",
                    //     src: "rtmp://58.200.131.2:1935/livetv/hunantv",
                    // }],
                    sources: [{
                        type: "video/mp4",
                        src: "http://cloud.video.taobao.com/play/u/2300650542/p/1/e/6/t/1/221304735688.mp4",
                    }],

                },
            }
        },
        components: {
            myVideo
        },

    }
</script>

<style lang="scss" scoped>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;

        .video {
            height: 355px;
            width: 300px;
            margin-right: 50px;
        }
    }
</style>