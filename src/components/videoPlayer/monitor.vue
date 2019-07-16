<template>
    <div>
        <canvas :style="{width:width,height:height}"></canvas>
    </div>
</template>

<script>
    import "@/plugins/jsmpg.min.js"

    export default {
        data() {
            return {}
        },
        methods: {
            getList() {
                let client = new WebSocket(`${this.src}`);
                let canvas = document.querySelector('canvas');
                let player = new jsmpeg(client, {
                    canvas: canvas
                });
            }
        },
        props: {
            src: {
                type: String,
            },
            width: {
                type: String,
            },
            height: {
                type: String,
            }
        },

        mounted() {
            this.getList();
        },
    }
</script>

<style scoped>

</style>