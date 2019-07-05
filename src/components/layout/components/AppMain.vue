<template>
    <section class="app-main">
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
        computed: {
            // key() {
            //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
            // }
        }
    }
</script>

