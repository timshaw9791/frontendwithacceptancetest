<template>
    <div class="warehousing-box">
       <warehousing-component v-for="item in warehouseList" :equipment="item" @handleInventory="handle"></warehousing-component>
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
        },
        methods:{
            handle(data){
                this.$emit('responseInventory',data)
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