<template>
    <div class="resourcesMaterialTemplate">
        <div class="r-m-img-box">
            <svg-icon :icon-class="item.typeName=='PDF'?'pdf':'视频缩略'" class="icon-img"></svg-icon>
        </div>
        <div class="r-m-span-box">
            <span v-text="item.name"></span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "resourcesMaterialTemplate",
        props:{
            item:{
                type:Object,
            }
        },
        created(){
        },
        methods:{

        }
    }
</script>

<style scoped>
    .resourcesMaterialTemplate{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 180px;
        margin-left: 60px;
    }
    .resourcesMaterialTemplate .r-m-img-box{
        width: 120px;
        height: 120px;
    }
    .r-m-img-box .icon-img{
        width: 100%;
        height: 100%;
    }
    .resourcesMaterialTemplate .r-m-span-box{
        margin-top: 14px;
    }
</style>