<template>
    <div>
        <img :src="imageUrl">
        <div class="info">
            <span>{{form.name}}</span>
            <span>{{form.position}}</span>
            <span>{{form.unitName}}</span>
        </div>
    </div>
</template>

<script>
    import {imgBaseUrl} from "api/config";
    import {formRulesMixin} from 'field/common/mixinComponent';
    import {getUserInfo} from 'api/layout'
    import {getOrganUnitById} from 'api/process'

    export default {
        data() {
            return {
                form: {unitName:'',name:'',position:"啊啊啊"},
                disabled: true,
                imageUrl: '',
            }
        },
        mixins: [formRulesMixin],
        methods: {
            getList() {
                let data = JSON.parse(localStorage.getItem('user'));
                getUserInfo(data.id).then(res=>{
                    this.$set(this.form,'name',res.name);
                    this.$set(this.form,'position',res.position);
                    this.imageUrl = `${imgBaseUrl}${res.faceInformation}`;
                });
                getOrganUnitById({id:data.unitId}).then(res=>{
                    this.$set(this.form,'unitName',`${res.location}${res.name}`)
                });
            },
        },
        mounted() {
            this.getList();
        }
    }
</script>

<style lang="scss" scoped>


</style>