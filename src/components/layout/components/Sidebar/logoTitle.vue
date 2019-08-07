<template>
    <div class="logo">
        {{name}}警用装备智能管理系统
    </div>
</template>

<script>

    import {formRulesMixin} from 'field/common/mixinComponent';
    import api from 'gql/admin.gql'


    export default {
        data() {
            return {
                name: '',
            }
        },
        mixins: [formRulesMixin],
        methods: {
            getList() {
                let data = JSON.parse(localStorage.getItem('user'));
                this.gqlQuery(api.getUser, {
                    id: data.unitId
                }, (res) => {
                    console.log('nmsl', res);
                    this.name = res.data.OrganUnit.name;
                })
            }
        },

        mounted() {
            this.getList();
        }
    }
</script>

<style lang="scss" scoped>
    .logo {
        font-size: 18px;
        color: #707070;
    }
</style>