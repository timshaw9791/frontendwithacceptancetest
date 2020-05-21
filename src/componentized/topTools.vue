<template>
    <div class="top-tools-contaienr">
        <div class="breadcrumb-box">
            <bread-crumb :routeList="routeList"></bread-crumb>
        </div>
        <div class="tools-box">
            <span></span>
        </div>
    </div>
</template>

<script>
import breadCrumb from './components/topTools/breadCrumb'
export default {
    name: 'topTools',
    data() {
        return {
            routeList: []
        }
    },
    methods: {
    },
    watch: {
        $route: {
            handler(val, oldVal) {
                this.routeList = this._.drop(val.matched);
            },
            deep: true,
            immediate: true
        }
    },
    components: {breadCrumb}
}
</script>

<style lang="scss" scoped>
    .top-tools-contaienr {
        width: 100%;
        height: 60px;
        padding: 0 18px;
        box-shadow:1px 3px 8px rgba(0,0,0,0.04);
        .breadcrumb-box {
            height: 100%;
            display: inline-flex;
            align-items: center;
        }
    }
</style>