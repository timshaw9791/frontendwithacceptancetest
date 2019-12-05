<template>
    <div class="tabs-select">
        <el-select v-model="value" placeholder="" value-key="id" @change="changeValue">
            <el-option
                    style="text-align:center"
                    v-for="item in options"
                    :key="item[prop.key]"
                    :label="item[prop.label]"
                    :value="item">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value: {},
                empty:false
            }
        },
        methods: {
            changeValue(data) {
                console.log('this.empty',this.empty);
                if(!this.empty){
                    this.$emit('selected', data);
                }else {
                    this.empty=false
                }
            },
            toEmpty(){
                this.value='';

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
            },
            prop:{
                type:Object,
                default(){
                    return{
                        key:'id',
                        label:'name',
                    }
                }
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