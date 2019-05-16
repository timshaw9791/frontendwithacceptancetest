<template>
    <div class="tabs">
        <el-select v-model="value" placeholder="" @change="indexValue()">
            <el-option
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


        props: {
            options: {
                type: Array,
                default: [],
            },
            indexDefault: {
                type: String,
                default: '',
            }
        }
    }
</script>

<style lang="scss" scoped>

    .tabs {
        /deep/ .el-input__inner {
            background: rgb(47, 47, 118) !important;
            color: white !important;
            border-radius: 24px;
            text-align: center;
            width: 120px;
            font-size: 16px;
        }

        /deep/ .el-select .el-input .el-select__caret {
            color: white !important;
        }
    }


</style>