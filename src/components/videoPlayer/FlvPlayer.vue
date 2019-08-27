<template>
    <div>
        <video class="video-js  vjs-big-play-centered" ref="player" autoplay @click="dome"></video>
    </div>
</template>

<script>
    // import flvjs from "flv.js";

    import 'video.js/dist/video-js.css'

    export default {
        props: {
            videoID: Number,
            width: {
                type: String,
            },
            height: {
                type: String,
            }
        },

        data() {
            return {
                player: null
            }
        },
        methods: {
            initVideo() {
                //初始化视频方法
                let myPlayer = this.$video(this.$refs.player, {
                    //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
                    controls: true,
                    //自动播放属性,muted:静音播放
                    autoplay: "muted",
                    //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
                    //设置视频播放器的显示宽度（以像素为单位）
                    width: this.width,
                    //设置视频播放器的显示高度（以像素为单位）
                    height: this.height,

                    controlBar: {
                        playToggle: false,
                        fullscreenToggle: true,
                        liveDisplay: true,
                        volumeMenuButton: false,
                    }
                });
            },
            dome() {
                this.player.play();
            }
        },
        mounted() {
            this.initVideo();

            if (flvjs.isSupported()) {
                let video = this.$refs.player;
                if (video) {
                    this.player = flvjs.createPlayer({
                        type: "flv",
                        isLive: true,
                        // url: `ws://127.0.0.1:8888/rtsp/${this.videoID}/?url=rtsp://127.0.0.1:8554/changan.E01.sdp`
                        url: `ws://127.0.0.1:8888/rtsp/${this.videoID}`
                    });
                    this.player.attachMediaElement(video);
                    this.player.load();
                    this.player.play();
                }
                // setTimeout(() => {
                //     if (video.paused) {
                //         this.player.player();
                //     }
                // }, 3000);
            }
        },
        beforeDestroy() {
            this.player.destroy();
        }
    }
</script>
<style scoped>
    /*.vjs-tech {*/
    /*pointer-events: none;*/
    /*}*/


</style>