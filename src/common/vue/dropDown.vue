<template>
    <div id="drop-down" class="drop-down">
        <el-dropdown :hide-on-click="false">
            <el-button type="primary">
                {{drop.title}}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" style="width: 100px">
                <el-dropdown-item style="text-align: center; font-size: 16px" v-for="item in drop.list" :click="dropClick(item.value)" v-text="item.key"></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    export default {
        name: "dropDown",
        data(){
          return{

          }
        },
        props:{
            drop:{
                type:Object
            }
        },
        methods:{
           dropClick(value){
               console.log(value)
           }
        }
    }
</script>

<style>
    .drop-down{
        font-size: 16px;
    }
    #drop-down .el-button{
        border-radius: 16px;
        height: 24px;
        font-size: 14px;
        padding: 5px 18px;
    }
</style>