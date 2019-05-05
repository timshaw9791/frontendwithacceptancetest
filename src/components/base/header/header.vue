<template>
    <div class="header">
        <span class="title">装备信息</span>
        <div class="input-box" v-if="searchFlag">
            <svg-icon icon-class="搜索" class="icon-search"></svg-icon>
            <input class="input" v-model="search" :placeholder="placeholder" ></input>
        </div>
    </div>
</template>

<script>
    export default {
        name: "myHeader",
        data(){
            return{
                flag:true,
            }
        },
        props:{
            searchFlag:{
                type:Boolean,
                default:false
            },
            placeholder:{
                type:String,
                default:'请输入'
            },
            search:{
                type:String
            }
        }
    }
</script>

<style scoped>
    .header {
        width: 100%;
        padding-left: 18px;
        padding-right: 35px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 33px;
        color:rgba(112,112,112,1);

    }
    .header .input-box{
        width:285px;
        position: relative;
    }
    .header .title{
        font-size: 20px;
    }
    .input-box .input{
        width: 100%;
        height:38px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(112,112,112,1);
        opacity:1;
        border-radius:19px;
        padding-left: 15px;
        outline:medium;
    }
    .input-box .icon-search{
        position: absolute;
        right: 10px;
        z-index: 1;
        top: 50%; /*偏移*/
        width: 25px;
        height: 25px;
        transform: translateY(-50%);
    }

</style>