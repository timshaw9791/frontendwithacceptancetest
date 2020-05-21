<template>
    <section class="app-main">
        <!-- <top-tools></top-tools> -->
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
.app-main-shadow {
    min-height: 87vh;
    max-height: 87vh;
    margin: 2%;
    position: relative;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    overflow-y: scroll;
    .list {
        max-height: 87vh;
    }
}
.app-main-shadow::-webkit-scrollbar {
    width: 8px;
    height: 10px;
}
.app-main-shadow::-webkit-scrollbar-thumb {
    background-color: rgba(144, 147, 153, 0.1);
}
.app-main-shadow::-webkit-scrollbar-thumb:hover {
    background: rgba(144, 147, 153, 0.3);
}
.app-main-shadow::-webkit-scrollbar-track {
    border-radius: 0;
    background: rgba(228, 231, 237, 0.1);
}
</style>

