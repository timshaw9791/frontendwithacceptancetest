<template>
    <div>
        <img class="personImg" :src="imgUrl" :onerror="noPersonImgUrl" alt=""/>
        <div class="info">
            <span>{{form.name}}</span>
            <span>[{{$store.getters.enumsObj.Role[form.role]}}]</span>
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
                    return require('@/assets/noPersonImg.png')
                }
            }
        }
    }
</script>

<style lang="scss">
    .personImg {
        width: 50px;
        height: 70px;
    }
</style>