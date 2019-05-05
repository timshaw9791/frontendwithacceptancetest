<template>
    <div>
        <el-table
                :data="list"
                style="width: 100%" id="table" @sort-change="sortChange">
            <bos-table-column  v-for="item in labelList" :lable="item.lable" :sort="item.sort" :field="item.field" :filter="item.filter"></bos-table-column>
            <el-table-column v-if="haveButton" label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button v-for="item in buttonList" type="text" size="mini" @click="someClick(scope.row,item.name)" v-text="item.name"></el-button>
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
            buttonList:{
                type:Array
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
            someClick(row,name) {
                let data ={
                    name:name,
                    row:row
                };
               this.$emit('click',data)
            },
            sortChange(data){
                this.$emit('sortChange',data.order)
            },
            tableChangePage(newPage){
                this.$emit('tableCurrentPageChanged',newPage)
            }
        }
    }
</script>

<style scoped>

</style>