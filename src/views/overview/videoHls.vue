<template>
    <div class="container">
        <div class="videoBlock" v-for="item in 4">
            <div class="header">
                CCTV-{{item}}号视频监控
            </div>
            <my-video :src="srcList[item-1]" class="video"></my-video>
        </div>

    </div>
</template>

<script>
    import myVideo from '@/components/videoPlayer/live'

    export default {

        data() {
            return {
                srcList: [
                    'http://192.168.125.117/test.m3u8',
                    'http://192.168.125.117/test.m3u8',
                    'http://192.168.125.117/test.m3u8',
                    'http://192.168.125.117/test.m3u8'
                ]
            }
        },
        mounted() {

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

        .videoBlock {
            width: 336px;
            margin-right: 50px;


            .header {
                background: #2F2F76;
                height: 40px;
                width: 100%;
                color: white;
                text-align: center;
                line-height: 40px;
                letter-spacing: 1px;
            }

            .video {
                height: 206px;
                width: 100%;

            }
        }
    }

</style>
