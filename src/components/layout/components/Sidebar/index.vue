<template>
    <div>
        <div v-if="!isCollapse">
            <div class="topTitle">
                <img src="@/common/images/警徽.png" @click="windowClose()"/>
            </div>
            <topInfo class="topInfo"></topInfo>
        </div>
        <el-scrollbar wrapClass="scrollbar-wrapper">
            <div class="menu">
                <el-menu
                        mode="vertical"
                        :show-timeout="200"
                        :default-active="$route.path"
                        :collapse="isCollapse"
                        background-color="#f9f9f9"
                        text-color="#707070">
                    <sidebar-item :routes="permission_routers"></sidebar-item>
                </el-menu>
                <div class="topBottom" v-if="!isCollapse">
                    服务热线:400-8265186
                </div>
            </div>
        </el-scrollbar>
    </div>


</template>

<script>
    import {mapGetters} from 'vuex'
    import SidebarItem from './SidebarItem'
    import topInfo from './personal'

    export default {
        components: {SidebarItem, topInfo},
        methods: {
            windowClose() {
                window.close();
            },
        },
        computed: {
            ...mapGetters([
                'permission_routers',
                'sidebar'
            ]),
            routes() {
                return this.$router.options.routes
            },
            isCollapse() {
                return !this.sidebar.opened
            }
        }
    }
</script>
