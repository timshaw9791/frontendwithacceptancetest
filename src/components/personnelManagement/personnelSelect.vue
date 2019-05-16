<template>
    <div id="personnelSelect">
        <div class="personnel-box">
            <el-select v-model="value" placeholder="请选择" @change="toChange">
                <el-option
                        v-for="item in select"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
    export default {
        name: "personnelSelect",
        props:{
            select:{
                type:Array,
            }
        },
        data(){
            return{
                value:''
            }
        },
        methods:{
            toChange(data){
               this.$emit('selectRole',data);
            }
        }
    }
</script>

<style scoped>
    .personnel-box{
        color:rgba(112,112,112,1)
    }
    .personnel-box .selectBox{
        margin-left: 15px;
        width: 180px;
    }
    #personnelSelect .el-input__inner {
        height: 30px;
    }
    #personnelSelect .el-input__icon{
        line-height: 30px;
    }
</style>