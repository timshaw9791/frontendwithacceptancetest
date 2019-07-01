<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>


    export default {
        name: 'App',
        mounted() {
            console.log(111);
        }

    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "common/css/index"; // global css

</style>
