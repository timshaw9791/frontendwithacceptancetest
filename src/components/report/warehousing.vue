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
            }/*,
            allOutHouseCount:{
                type:Number,
                default:600
            },
            allInHouseCount:{
                type:Number,
                default:1200
            }*/
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
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-top: 0.2083rem;
    }
</style>