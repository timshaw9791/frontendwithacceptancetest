<template>
    <div>
        <div v-if="!isCollapse">
            <div class="topTitle">
                <img src="@/common/images/警徽.png" @click="$router.push('/')"/>
            </div>
            <div class="topInfo">
                <img src="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1556153332&di=122f924fd03abc32a0f56b4ef8f15cd4&src=http://imgsrc.baidu.com/baike/pic/item/94cad1c8a786c917f5f04434c73d70cf3ac757cf.jpg">
                <div class="info">
                    <span>假面骑士</span>
                    <span>警员</span>
                    <span>茶山分局</span>
                </div>
            </div>
        </div>
        <el-scrollbar wrapClass="scrollbar-wrapper">
            <div style="min-height: 60vh;max-height: 60vh">
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

    export default {
        components: {SidebarItem},
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
