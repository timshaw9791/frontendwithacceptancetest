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
                    this.className = to.name == "overview/index"?"app-main":"app-main-shadow"
                },
                immediate: true
            }
        },
    }
</script>

<style lang="scss" scoped>
.app-main-shadow {
    min-height: 87vh;
    max-height: 87vh;
    margin: 2%;
    position: relative;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    .list {
        max-height: 87vh;
    }
}
</style>

