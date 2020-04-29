<template>
    <div>
        <img :src="imageUrl">
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
    export default {
        data() {
            return {
                form: {organUnitName:'',name:'',position:"啊啊啊"},
                imageUrl: '',
            }
        },
        methods: {
            fetchData() {
                let data = JSON.parse(localStorage.getItem('user'));
                userInfoById(data.id).then(res=>{
                    this.form.position = res.position;
                    this.imageUrl = `${imgBaseUrl}${res.faceInformation}`;
                });
                this.form = Object.assign(this.form, data);
            },
        },
        mounted() {
            this.fetchData();
        }
    }
</script>