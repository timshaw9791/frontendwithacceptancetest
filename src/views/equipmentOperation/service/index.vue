<template>
    <view-container :tabs="tabs">
        <!-- 维修申请 -->
        <service-application-info slot="serviceApplicationInfo"></service-application-info>
        <!-- 正在维修 -->
        <under-service slot="underService"></under-service>
    </view-container>
</template>

<script>
    import serviceApplicationInfo from "./serviceApplicationInfo";
    import underService from "./underService";
    export default {
        name: "index",
        components:{
            serviceApplicationInfo,
            underService
        },
        data(){
            return{
                tabs: [{
                    label: '维修申请',
                    key: 'serviceApplicationInfo',
                }, {
                    label: '正在维修',
                    key: 'underService'
                }]
            }
        }
    }
</script>

<style scoped>

</style>