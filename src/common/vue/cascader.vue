<template>
    <div id="my-cascader">
        <el-cascader
                :placeholder="cascader.title"
                :options="cascader.cascaderData"
                :props="cascader.cascaderProps"
                :show-all-levels="false"
                expand-trigger="hover"
                :change-on-select="true"
                @change="handleChange"  class="cascader"></el-cascader>
    </div>
</template>

<script>
    import {fetchMixin} from 'field/common/mixinFetch';
    export default {
        name: "cascader",
        mixins: [fetchMixin],
        data(){
            return{

            }
        },
        props:{
            cascader:{
                type:Object
            }
        },
        created(){
            this.getCascaderData();
        },
        methods:{
            some(data){
                console.log(data);
            },
            getCascaderData() {
                this.gqlQuery(this.cascader.graphqlCascader.graphqlApi,this.cascader.graphqlCascader.graphqlKey,(data)=>{
                    this.cascader.cascaderData = data;
                },true)
            },
            handleChange(value) {
                this.cascader.selectCascader = value[value.length-1];
            }
        }
    }
</script>

<style scoped>
    #my-cascader .cascader{
        width: 99px;
    }
    #my-cascader .el-cascader {
        line-height: 27px;
        font-size: 14px;
    }
    #my-cascader .el-input__inner {
        height: 27px;
    }
    #my-cascader .el-input__icon{
        line-height: 27px;
    }
</style>