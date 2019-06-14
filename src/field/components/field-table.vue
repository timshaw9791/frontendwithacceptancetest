<template>
    <div>
        <el-table
                :data="list"
                style="width: 100%" id="table" @sort-change="sortChange">
            <bos-table-column  v-for="item in labelList" :lable="item.lable" :sort="item.sort" :field="item.field" :filter="item.filter"></bos-table-column>
            <el-table-column v-if="flag" :label="tableAction.label" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" @click="someClick(scope.row,item)" v-for="item in tableAction.button" v-text="item"></el-button>
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
            /*defaultSort:{
              type:Object,
              default(){
                  return{
                      prop:'',
                      order:''
                  }
              }
            },*/
            haveButton: {
                type: Boolean,
                default: false
            },
            tableAction:{
                type:Object
            },
            pageInfo:{
                type:Object
            }
        },
        created() {
            if(this.tableAction!=undefined){
                this.flag=true
            }
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
               this.$emit('clickTableCloum',data)
            },
            sortChange(data){
                let obj = {
                    order:data.order,
                    name:data.column.label
                };
                this.$emit('sortChange',obj)
            },
            tableChangePage(newPage){
                console.log(this.pageInfo)
                this.$emit('tableCurrentPageChanged',newPage)
            }
        }
    }
</script>

<style scoped>

</style>