<template>
    <div>
        <!-- <img :src="imageUrl"> -->
        <upload-file v-model="form.faceInformation" size="small" :disabled="true" margin="24px 0 15px 0"></upload-file>
        <div class="info">
            <span>{{form.name}}</span>
            <span>{{form.position}}</span>
            <span>{{form.organUnitName}}</span>
        </div>
    </div>
</template>

<script>
    import {imgBaseUrl} from "api/config";
    import {getOrganUnitById} from 'api/process'
    import { userInfoById } from 'api/user'
    import uploadFile from '@/componentized/uploadFile'
    export default {
        components:{uploadFile},
        data() {
            return {
                form: {organUnitName:'',name:'',position:"啊啊啊", faceInformation: ''},
                imageUrl: '',
            }
        },
        methods: {
            fetchData() {
                let data = JSON.parse(localStorage.getItem('user'));
                this.form = data;
                console.log(imgBaseUrl+data.faceInformation);
                // userInfoById(data.id).then(res=>{
                //     this.form.position = res.position;
                //     this.imageUrl = `${imgBaseUrl}${res.faceInformation}`;
                // });
                // this.form = Object.assign(this.form, data);
            },
        },
        mounted() {
            this.fetchData();
        }
    }
</script>

<style scoped>
    .faceinfomation {
        width: 0.4792rem;
        height: 0.4792rem;
        border-radius: 50%;
        margin: 0.125rem 0 0.0833rem 0;
    }
</style>