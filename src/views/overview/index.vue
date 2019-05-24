<template>
    <div>
        <tb-select :options="[{label:'瞧你吗',value:'瞧你吗'},{label:'瞧你吗嘎嘎',value:'瞧你吗嘎嘎'}]" indexDefault="瞧你吗"></tb-select>
        <serviceDialog title="提示" ref="dialogButton" @confirm="submit">
            <div>123</div>
        </serviceDialog>

    </div>
</template>

<script>
    import tbSelect from 'components/base/tabs-select'
    import serviceDialog from 'components/base/serviceDialog'

    export default {
        data() {
            return {}
        },
        methods: {
            submit() {
            },
        },
        mounted() {
            this.$message({
                message: '恭喜你，这是一条成功消息',
                type: 'error',
                duration: 99999
            });
        },

        components: {
            tbSelect,
            serviceDialog
        }
    }
</script>

<style scoped>

</style>