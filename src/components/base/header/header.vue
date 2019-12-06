<template>
    <div class="header">
        <span class="title" v-text="title"></span>
        <div class="input-box" v-if="searchFlag">
            <svg-icon icon-class="搜索" class="icon-search"></svg-icon>
            <input class="input" v-model="searchHeader" :placeholder="placeholder" ></input>
        </div>
        <div class="black" v-if="haveBlack" @click="h_black" data-test="button">
            <svg-icon icon-class="返回" class="icon-black"></svg-icon>
            <span class="b-span" v-text="'返回'"></span>
        </div>
        <div class="black" v-if="haveBlackTwo" @click="h_black">
            <svg-icon icon-class="关闭" class="icon-black"></svg-icon>
        </div>
    </div>
</template>

<script>
    export default {
        name: "myHeader",
        data(){
            return{
                flag:true,
                searchHeader:''
            }
        },
        watch:{
            'searchHeader':{
                handler(newval){
                    this.$emit('search',newval);
                }
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
            title:{
                type:String
            },
            haveBlack:{
                type:Boolean,
                default:false
            },
            haveBlackTwo:{
                type:Boolean,
                default:false
            }
        },
        methods:{
            h_black(){
                this.$emit('h_black',true);
            }
        }
    }
</script>

<style scoped>
    .header {
        width: 100%;
        padding-left: 18px;
        padding-right: 35px;
        height: 57px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color:rgba(112,112,112,1);
        border-bottom: 1px solid rgba(112,112,112, 0.13);

    }
    .header .input-box{
        width:285px;
        position: relative;
    }
    .header .title{
        font-size: 20px;
    }
    .header .black{
        display: flex;
        align-items:center;
        justify-content: center;
        height: 100%;
        font-size: 20px;
        cursor: pointer;
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
    .black .icon-black{
        width: 20px;
        height: 20px;
    }
    .black .b-span{
        margin-left: 4px;
    }
</style>