<template>
    <div class="app-wrapper" :class="classObj">
        <navbar></navbar>
        <sidebar class="sidebar-container"></sidebar>
        <div class="main-container">
            <app-main></app-main>
            <div class="information">
                <span>&copy; 2019 - 2020 警用装备智能管理系统</span>
                <span style="margin-left: 10px">技术支持：浙江华安安全设备有限公司</span>
                <span style="margin-left: 20px">服务热线:400-8265186</span>
                <span style="margin-left: 20px">V {{ version }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {Navbar, Sidebar, AppMain} from "./components";
    import ResizeMixin from "./mixin/ResizeHandler";

    var version = require('@/../package.json').version

    export default {
        name: "layout",
        components: {
            Navbar,
            Sidebar,
            AppMain
        },
        data() {
            return {
                version
            }
        },
        mixins: [ResizeMixin],
        computed: {
            sidebar() {
                return this.$store.state.app.sidebar;
            },
            device() {
                return this.$store.state.app.device;
            },
            classObj() {
                return {
                    hideSidebar: !this.sidebar.opened,
                    withoutAnimation: this.sidebar.withoutAnimation,
                    mobile: this.device === "mobile"
                };
            }
        },
        methods: {
            handleClickOutside() {
                this.$store.dispatch("CloseSideBar", {withoutAnimation: false});
            }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "~common/css/mixin.scss";

    .app-wrapper {
        // @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
        overflow: hidden;
        font-size: 16px;

        .information {
            width: 100%;
            position: absolute;
            font-size: 0.0625rem  /* 12/192 */;
            text-align: center;
            bottom: 0;
            right: 0;
            color: #707070;
            height: 32px;
            line-height:32px;
        }
    }
</style>
