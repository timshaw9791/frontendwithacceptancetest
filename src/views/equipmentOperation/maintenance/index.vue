<template>
    <view-container :tabs="tabs">
        <!-- 需要保养 -->
        <need-maintenance slot="needMaintenance"></need-maintenance>
        <!-- 正在保养 -->
        <under-maintenance slot="underMaintenance"></under-maintenance>

    </view-container>
</template>

<script>
    import needMaintenance from "@/views/equipmentOperation/maintenance/needMaintenance";
    import underMaintenance from "@/views/equipmentOperation/maintenance/underMaintenance";

    export default {
        name: "newMaintenance",
        components: {
            needMaintenance,
            underMaintenance
        },
        data() {
            return {
                tabs: [{
                    label: '需要保养',
                    key: 'needMaintenance',
                }, {
                    label: '正在保养',
                    key: 'underMaintenance'
                }]
            }
        }
    }
</script>

<style scoped>

</style>

