<template>
    <div class="define-table-container">
        <el-table :data="data" :height="height" :border="border" fit>
            <slot></slot>
        </el-table>
        <bos-paginator :pageInfo="pageInfo" @bosCurrentPageChanged="changePage"></bos-paginator>
    </div>
</template>

<script>
import defineColumn from './defineColumn'
    export default {
        name: "field-table",
        data() {
            return {
                
            }
        },
        components: {

        },
        /*mixins: [formRulesMixin],*/
        props: {
            data: {
                type: Array,
                default: []
            },
            height: {
                type: String,
                default: '600px'
            },
            border: {
                type: Boolean,
                default: true
            },
            pageInfo: {
                type: Object,
                default() {
                    return {
                        page: 1,
                        size: 10,
                        totalElements: 0,
                        totalPages: 0
                    }
                }
            }
        },
        created() {           
        },
        mounted() {
            
        },
        methods: {
            changePage(page) {
                this.$emit('changePage', page);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .actionButton{
        width:70px;
        height:32px;
        opacity:1;
        color: white;
        border-radius:4px;
    }
    /deep/ .el-table {
        .el-table--enable-row-hover,
        .el-table__body tr:hover > td {
            background-color: white;
        }
    }
</style>