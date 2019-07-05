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
    import api from 'gql/admin.gql'

    export default {
        data() {
            return {
                form: {},
                disabled: true,
                imageUrl: '',
            }
        },
        mixins: [formRulesMixin],

        methods: {
            getList() {
                let data = JSON.parse(localStorage.getItem('user'));
                this.gqlQuery(api.getUser, {
                    id: data.unitId
                }, (res) => {
                    this.form = data;
                    this.form['unitName'] = `${res.data.OrganUnit.location}${res.data.OrganUnit.name}`;
                    this.imageUrl = `${imgBaseUrl}${data.faceInformation}`;
                })
            },
        },
        mounted() {
            this.getList();
        }
    }
</script>

<style lang="scss" scoped>


</style>