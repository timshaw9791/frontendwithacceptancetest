<template>
    <div class="surrounding-video">
        <video-player width="454px" height="248px" :videoID="1"></video-player>
    </div>
</template>

<script>
    // import myVideo from '@/components/videoPlayer/live'
    import FlvPlayerVue from 'components/videoPlayer/FlvPlayer.vue';
    export default {
        name: "s_video",
        components:{
            // myVideo
            "video-player": FlvPlayerVue
        },
        props:{
            videoSrc:{
                type:Array
            }
        },
        data(){
            return{
                srcList:[
                    'http://192.168.125.117/test.m3u8',
                    'http://192.168.125.117/test.m3u8',
                    'http://192.168.125.117/test.m3u8',
                    'http://192.168.125.117/test.m3u8'
                ]
            }
        },
    }
</script>

<style scoped>
    .surrounding-video{
        width: 100%;
        padding: 40px 40px;
        display: flex;
        justify-content: space-between;
    }
    .surrounding-video .videoBlock{
        width: 355px;
    }
    .videoBlock .header{
        display: flex;
        align-items: center;
        justify-content: center;
        background: #2F2F76;
        width: 100%;
        height: 39px;
        color: #FFFFFF;
    }
    .videoBlock .video{
        width: 100%;
        height: 206px;
    }
</style>
