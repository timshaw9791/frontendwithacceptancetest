<template>
    <el-popover placement="right" trigger="hover" transition="fade-in-linear">
        <img class="img" slot="reference" :src="imageUrl!=''?imgsrc(imageUrl):noImgUrl" :onerror="splitUrl"
             style="height:30px;width:30px;"/>
        <img class="img" :src="imageUrl!=''?imgsrc(imageUrl):noImgUrl" :onerror="splitUrl"
             style="height:150px;width:150px;margin-left: auto;"/>
    </el-popover>
</template>

<script>
    import {baseURL} from 'api/config'

    export default {
        name: "hoverChart",
        data() {
            return {
                splitUrl: 'this.src="' + require('@/assets/splitImg.png') + '"',
                noImgUrl: require('@/assets/noImg.png')
            }
        },
        props: {
            imageUrl: {
                type: String,
            }

        },
        methods: {
            imgsrc(data) {
                return baseURL + '/images/' + data
            },
        }

    }
</script>

<style scoped>

</style>