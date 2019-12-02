<template>
    <div class="tabs-select">
        <el-select v-model="value" placeholder="" @change="indexValue">
            <el-option
                    style="text-align:center"
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value: '',
            }
        },
        methods: {
            indexValue() {
                this.$emit('selected', this.value);
            }
        },
        mounted(){
            // if(this.indexDefault=='已结束'){
            //     this.indexValue()
            // }
        },
        props: {
            options: {
                type: Array,
                default: [],
            },
            placeholder:{
                type:String
            }
            // indexDefault: {
            //     type: String,
            // },
            // sizeHeight:{
            //     type:String,
            //     default:'medium'
            // }
        },
        watch: {
            // 'indexDefault':{
            //     handler(newVal){
            //         console.log('indexDefaultWatch',newVal);
            //         this.value = newVal;
            //         this.$emit('selected', newVal);
            //     }
            // }
        }
    }
</script>

<style lang="scss" scoped>

    .tabs-select {
        /deep/ .el-select .el-input__inner {
            height: 0.1667rem;
        }
        /deep/ .el-input__icon {
            width: 0.1302rem;
            line-height: 0.1667rem;
        }
    }


</style>