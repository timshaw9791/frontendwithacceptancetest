<template>
    <div>
        <tb-select :options="[{label:'瞧你吗',value:'瞧你吗'},{label:'瞧你吗嘎嘎',value:'瞧你吗嘎嘎'}]" indexDefault="瞧你吗"></tb-select>
    </div>
</template>

<script>
    import tbSelect from 'components/base/tabs-select'
    export default {
        data(){
            return{

            }
        },
        components:{
            tbSelect
        }
    }
</script>

<style scoped>

</style>