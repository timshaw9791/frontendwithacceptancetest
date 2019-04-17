<template>
    <div>
        <el-table
                :data="list"
                border
                style="width: 100%" id="table">
            <bos-table-column v-for="item in labelList" :lable="item.lable"  :field="item.field" :filter="item.filter"></bos-table-column>
            <el-table-column v-if="haveButton" label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="someClick(scope.row)">操作</el-button>
                </template>
            </el-table-column>
        </el-table>
        <bos-paginator :pageInfo="pageInfo" @bosCurrentPageChanged="tableChangePage"></bos-paginator>
    </div>
</template>

<script>
    export default {
        name: "field-table",
        data() {
            return {
                flag: false
            }
        },
        /*mixins: [formRulesMixin],*/
        props: {
            list: {
                type: Array
            },
            labelList: {
                type: Array,
                required: true
            },
            haveButton: {
                type: Boolean,
                default: false
            },
            pageInfo:{
                type:Object
            }
        },
        created() {
        },
        updated() {
        },
        mounted() {
        },
        methods: {
            someClick(row) {
               this.$emit('click',row)
            },
            tableChangePage(newPage){
                this.$emit('tableCurrentPageChanged',newPage)
            }
        }
    }
</script>

<style scoped>

</style>