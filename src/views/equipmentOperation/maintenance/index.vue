<template>
    <view-container :tabs="tabs">
        <!-- 需要保养 -->
        <need-maintenance slot="car1"></need-maintenance>
        <!-- 正在保养 -->
        <under-maintenance slot="car2"></under-maintenance>
        <need-maintenance slot="car3"></need-maintenance>

    </view-container>
</template>

<script>
    import bosTabs from "@/componentized/table/bosTabs";
    import needMaintenance from "@/views/equipmentOperation/maintenance/needMaintenance";
    import underMaintenance from "@/views/equipmentOperation/maintenance/underMaintenance";

    export default {
        name: "newMaintenance",
        components: {
            bosTabs,
            needMaintenance,
            underMaintenance
        },
        data() {
            return {
                tabs: [{
                    label: '需要保养',
                    key: 'car1',
                }, {
                    label: '正在保养',
                    key: 'car2'
                },{
                    label: 'test',
                    key: 'car3'
                }],
            }
        }
    }
</script>

<style scoped>

</style>

