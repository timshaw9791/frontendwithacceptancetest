<template>
    <div class="warehousing-box">
       <warehousing-component v-for="item in warehouseList" :equipment="item"></warehousing-component>
    </div>
</template>

<script>
    import warehousingComponent from './reportComponents/warehousingComponents'
    export default {
        name: "warehousing",
        components: {warehousingComponent},
        props:{
            warehouseList:{
                type:Array
            }
        }
    }
</script>

<style scoped>
    .warehousing-box{
        width: 100%;
        padding-left: 67px;
        padding-right: 87px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 59px;
    }
</style>