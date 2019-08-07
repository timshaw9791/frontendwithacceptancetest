<template>
    <div class="tabs-select">
        <el-select v-model="value" placeholder="" @change="indexValue" :size="sizeHeight">
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
                value: this.indexDefault,
            }
        },
        methods: {
            indexValue() {
                this.$emit('selected', this.value);
            }
        },
        created(){

        },
        props: {
            options: {
                type: Array,
                default: [],
            },
            indexDefault: {
                type: String,
            },
            sizeHeight:{
                type:String,
                default:'medium'
            }
        },
        watch: {
            indexDefault(newVal) {
                this.value = newVal;
                this.$emit('selected', newVal);
            }
        }
    }
</script>

<style lang="scss" scoped>

    .tabs-select {
        /deep/ .el-input__inner {
            background: rgb(47, 47, 118) !important;
            color: white !important;
            border-radius: 24px;
            text-align: center;
            font-size: 16px;
        }

        /deep/ .el-select .el-input .el-select__caret {
            color: white !important;

        }
    }


</style>