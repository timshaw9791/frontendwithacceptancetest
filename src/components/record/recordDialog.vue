<template>
    <div class="record-dialog">
        <serviceDialog title="视屏监控" ref="dialogVideo" width="1040px" :button="false">
            <div class="d_body">
                <my-video :src="src" :autoplay="true"></my-video>
            </div>
        </serviceDialog>
    </div>
</template>

<script>
    import dialogs from 'components/surroundings/surroundingDialog'
    import serviceDialog from './recordServiceDialog'
    import myVideo from '@/components/videoPlayer/newLive'
    export default {
        name: "recordDialog",
        components:{
            dialogs,
            myVideo,
            serviceDialog
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
                this.$refs['dialogVideo'].show();
            },
            cancel(){
                this.$refs['dialogVideo'].close();
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