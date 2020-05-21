<template>
    <div class="breadcrumb-container">
        <div v-for="(route, i) in routeList" :key="route.name" class="route-box">
            <router-link :to="{path: route.path}">{{ route.meta.title }}</router-link>
            <span style="margin: 0 5px; color: #d1c7cc" v-show="i!=routeCount-1">/</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'breadCrumb',
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
    created() {
        this.routeCount = this.routeList.length
    }
}
</script>

<style scoped>
.breadcrumb-container {
    font-size: 20px;
}
</style>