<template>
    <div class="surrounding-video">
        <div class="videoBlock" v-for="item in 4">
            <div class="header">
               {{item}}号视频监控
            </div>
           <my-video :src="srcList[item-1]" :autoplay="true" class="video"></my-video>
        </div>
    </div>
</template>

<script>
    import myVideo from '@/components/videoPlayer/live'
    export default {
        name: "s_video",
        components:{
            myVideo
        },
        data(){
            return{
                srcList:[
                    'http://10.128.4.152/test.m3u8',
                    'http://10.128.4.152/test.m3u8',
                    'http://10.128.4.152/test.m3u8',
                    'http://10.128.4.152/test.m3u8'
                ]
            }
        }
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