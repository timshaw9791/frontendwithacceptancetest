<template>
    <div>
        <img :src="imgUrl" :onerror="noPersonImgUrl" alt=""/>
        <div class="info">
            <span>{{form.name}}</span>
            <span>{{form.position}}</span>
        </div>
    </div>
</template>

<script>
    import uploadFile from '@/componentized/uploadFile'
    import {imgBaseUrl} from "@/api/config";

    export default {
        components: {uploadFile},
        data() {
            return {
                form: JSON.parse(localStorage.getItem('user')),
                noPersonImgUrl: "'this.src='" + require('@/assets/errorPersonImg.png') + "'"
            }
        },
        computed: {
            imgUrl() {
                if (this.form.faceInformation){
                    return  `${imgBaseUrl}${this.form.faceInformation}`
                }else {
                    console.log('c')
                    return require('@/assets/noPersonImg.png')
                }
            }
        }
        // todo 下面显示角色权限
    }
</script>

<style lang="scss">
    img {
        width: 50px;
        height: 70px;
    }
</style>