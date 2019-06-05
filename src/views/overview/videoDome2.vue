<template>
    <div>
        <my-video :playerOptions="playerOptions" class="video"></my-video>
    </div>
</template>

<script>
    import myVideo from '@/components/videoPlayer/index'
    export default {
        data(){
            return{
                playerOptions:[

                ]
            }
        },
        components:{
            myVideo
        }
    }
</script>

<style scoped>

</style>