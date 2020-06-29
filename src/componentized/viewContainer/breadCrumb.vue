<template>
    <div class="breadcrumb-container">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
        <div v-for="(route, i) in routeList" :key="route.name" class="route-box">
            <router-link :to="{path: route.path}">{{ route.meta?route.meta.crumb:'' }}</router-link>
            <span style="margin: 0 5px; color: #d1c7cc" v-show="i!=routeCount-1&&!route.meta.singlePage">/</span>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import hamburger from 'components/base/Hamburger'
export default {
    name: 'breadCrumb',
    components: { hamburger },
    data() {
        return {
            routeList: [],
            routeCount: 0
        }
    },
    computed: {
        ...mapGetters(['sidebar'])
    },
    methods: {
        init() {
            this.routeList = this.$route.matched
            this.routeCount = this.routeList.length
        },
        toggleSideBar() {
            this.$store.dispatch('ToggleSideBar')
        }
    },
    created() {
        this.init()
    }
}
</script>

<style scoped>
    .breadcrumb-container {
        font-size: 20px;
    }
    .hamburger-container {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
    }
    .route-box {
        vertical-align: middle;
        display: inline-block;
    }
</style>