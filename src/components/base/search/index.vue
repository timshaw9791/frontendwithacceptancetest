<template>
    <div class="search" data-test="search">
        <svg-icon icon-class="搜索" class="icon-search"></svg-icon>
        <input class="input" v-model="search" :placeholder="placeholder">
    </div>
</template>

<script>
    export default {
        name: "index",
        data(){
            return{
                search:''
            }
        },
        watch:{
            'search':{
                handler(newVal){
                    this.$emit('search',newVal)
                }
            }
        },
        props:{
            placeholder:{
                type:String
            }
        }
    }
</script>

<style scoped>
    .search {
        width: 100%;
        position: relative;
    }

    .search .input {
        width: 100%;
        height: 0.1979rem;
        background: rgba(255, 255, 255, 1);
        border: 0.0052rem solid rgba(112, 112, 112, 1);
        opacity: 1;
        border-radius: 0.099rem;
        padding-left: 0.078125rem;
        outline: medium;
    }

    .search .icon-search {
        position: absolute;
        right: 0.0521rem;
        z-index: 1;
        top: 50%; /*偏移*/
        width: 0.1302rem;
        height: 0.1302rem;
        transform: translateY(-50%);
    }
</style>