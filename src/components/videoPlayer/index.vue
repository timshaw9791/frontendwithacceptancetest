<template>
    <div>
        <video-player class="vjs-custom-skin" :playsinline="true" :options="playerOptions"></video-player>
    </div>
</template>

<script>

    import 'video.js/dist/video-js.css'
    import 'vue-video-player/src/custom-theme.css'
    import 'videojs-flash'
    import 'videojs-contrib-hls'

    export default {
        data() {
            return {}
        },
        props: {
            playerOptions: {
                type: Object,
                default: {}
            }
        }
    }
</script>

<style scoped>

</style>