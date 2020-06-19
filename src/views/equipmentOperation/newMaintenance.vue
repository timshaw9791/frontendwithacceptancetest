<template>
    <view-container :tabs="tabs">
        <!-- 需要保养 -->
        <template slot="car1">
            <need-maintenance></need-maintenance>
            <base-button size="default" align="right" label="开始保养" @click="startMain"></base-button>
        </template>
        <!-- 正在保养 -->
        <template slot="car2">
            <maintenance-new></maintenance-new>
        </template>
    </view-container>
</template>

<script>
    import bosTabs from "@/componentized/table/bosTabs";
    import needMaintenance from "@/views/equipmentOperation/needMaintenance";
    import maintenanceNew from "@/views/equipmentOperation/maintenanceNew";

    export default {
        name: "newMaintenance",
        components: {
            bosTabs,
            needMaintenance,
            maintenanceNew
        },
        data() {
            return {
                tabs: [{
                    label: '需要保养',
                    key: 'car1',
                    baseSearch: false,
                    advancedSearch: false,
                    baseSearchValue: ''
                }, {
                    label: '正在保养',
                    key: 'car2'
                }],
            }
        },
        methods: {
            startMain(){
                return "哈哈哈"
            }
        }


    }
</script>

<style scoped>

</style>

