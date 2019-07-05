<template>
    <div id="my-select" class="my-select-box">
        <span v-text="select.title"></span>
        <el-select v-model="select.selectItem" :placeholder="null" class="selectBox">
            <el-option
                    v-for="item in select.list"
                    :key="item.value"
                    :label="item.key"
                    :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: "mySelect",
        data(){
            return{

            }
        },
        created(){
        },
        mounted(){
            this.initFont();
        },
        props:{
            select:{
                type:Object
            },
            size:{
                type:Number,
                default:16
            }
        },
        methods:{
            initFont(){
                let select = document.getElementById('my-select');
                select.style.fontSize = this.size+"px";
            },
        }
    }
</script>

<style scoped>
    .my-select-box{
        color:rgba(112,112,112,1)
    }
   .my-select-box .selectBox{
       margin-left: 15px;
       width: 180px;
   }
   #my-select .el-input__inner {
       height: 30px;
   }
   #my-select .el-input__icon{
       line-height: 30px;
   }
</style>