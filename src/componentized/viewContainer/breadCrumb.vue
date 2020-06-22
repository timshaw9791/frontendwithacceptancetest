<template>
    <div class="breadcrumb-container">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
        <div v-for="(route, i) in routeList" :key="route.name" class="route-box">
            <router-link :to="{path: route.path}">{{ route.meta.title }}</router-link>
            <span style="margin: 0 5px; color: #d1c7cc" v-show="i!=routeCount-1">/</span>
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
            routeCount: 0
        }
    },
    props: {
        routeList: {
            type: Array,
            default() {
                return []
            }
        }
    },
    computed: {
        ...mapGetters(['sidebar'])
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('ToggleSideBar')
        }
    },
    created() {
        this.routeCount = this.routeList.length
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