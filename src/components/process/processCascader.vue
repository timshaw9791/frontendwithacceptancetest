<template>
    <div class="process-cascader">
        <el-cascader
                :options="cascader.options"
                v-model="value"
                :props="cascader.prop"
                change-on-select
                :show-all-levels="false"
                @change="handleUnitChange">
        </el-cascader>
    </div>
</template>

<script>
    import {getAllUnit} from 'api/process'
    export default {
        name: "processCascader",
        data(){
            return {
                value:[],
                cascader:{
                    options: [],
                    prop:{value: 'id', label: 'name', children: 'lowers'}
                }
            }
        },
        created(){
            this.getUnitList()
        },
        methods:{
            handleUnitChange(data){
                this.$emit('handleUnitChange',data[data.length-1])
            },
            getUnitList(){
                getAllUnit().then(res=>{
                   this.cascader.options=[res]
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .process-cascader{
        /deep/ .el-input__inner {
            height: 0.1667rem;
        }
        /deep/ .el-input__icon {
            width: 0.1302rem;
            line-height: 0.1667rem;
        }
    }
</style>