<template>
    <section :class="className">
        <el-scrollbar wrap-class="list">
            <transition name="fade" mode="out-in">
                <!-- <router-view :key="key"></router-view> -->
                <router-view></router-view>
            </transition>
        </el-scrollbar>
    </section>
</template>

<script>
    export default {
        name: 'AppMain',
        data() {
            return {
                className: "app-main"
            }
        },
        computed: {
            // key() {
            //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
            // }
        },
        watch: {
            $route: {
                handler(to, from) {
                    this.className = to.name == "overview/index"?"app-main-none":"app-main"
                },
            }
        },
    }
</script>

<style lang="scss" scoped>
.app-main-none {
    min-height: 87vh;
    max-height: 87vh;
    margin: 2%;
    position: relative;
    .list {
        max-height: 87vh;
    }
}
</style>

