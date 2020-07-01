<template>
    <section class="app-main">
        <el-scrollbar wrap-class="list">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </el-scrollbar>
    </section>
</template>

<script>
    export default {
        name: 'AppMain',
    }
</script>

<style lang="scss" scoped>

</style>