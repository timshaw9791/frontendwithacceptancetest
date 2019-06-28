<template>
    <div class="record-dialog">
        <dialogs ref="dialog" :width="1040" :title="'视频监控'">
            <div class="d_body">
                <my-video :src="src" :autoplay="true"></my-video>
            </div>
        </dialogs>
    </div>
</template>

<script>
    import dialogs from 'components/surroundings/surroundingDialog'
    import myVideo from '@/components/videoPlayer/newLive'
    export default {
        name: "recordDialog",
        components:{
            dialogs,
            myVideo
        },
        data(){
            return{
            }
        },
        props:{
           src:{
               type:String
           }
        },
        methods:{
            show(){
                this.$refs['dialog'].show();
            },
            cancel(){
                this.$refs['dialog'].close();
            }
        }
    }
</script>

<style scoped>
    .record-dialog{
        width: 523px;
    }
    .record-dialog .d_body{
        width: 100%;
    }
    .d_body .videosH{
        width: 100%;
    }
</style>