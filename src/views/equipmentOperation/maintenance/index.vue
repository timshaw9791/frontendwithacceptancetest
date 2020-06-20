<template>
    <view-container :tabs="tabs">
        <!-- 需要保养 -->
        <template slot="car1">
            <need-maintenance></need-maintenance>
        </template>
        <base-button slot="car1button" type="text" label="开始保养" @click="startMain"></base-button>

        <!-- 正在保养 -->
        <template slot="car2">
            <under-maintenance></under-maintenance>
        </template>
        <base-button slot="car2button" type="text" label="结束保养" @click="endMain"></base-button>
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
                this.$router.push({path: '/equipmentOperation/startMaintenance'});
            },
            endMain() {
                this.$router.push({path: '/equipmentOperation/endMaintenance'});
            }
        }
    }
</script>

<style scoped>

</style>

