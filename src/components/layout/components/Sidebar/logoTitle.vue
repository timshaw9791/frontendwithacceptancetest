<template>
    <div class="logo">
        {{name}}警用装备智能管理系统
    </div>
</template>

<script>
    // 未引用组件
    import {getOrganUnitById} from 'api/process'
    export default {
        data() {
            return {
                name: '',
            }
        },
        methods: {
            getList() {
                let data = JSON.parse(localStorage.getItem('user'));
                getOrganUnitById({id:data.unitId}).then(res=>{
                    this.name = res.name;
                });
                console.log('this.name',this.name)
                // getUserInfo(data.id).then(res=>{
                //     this.name = res.data.OrganUnit.name;
                // })
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