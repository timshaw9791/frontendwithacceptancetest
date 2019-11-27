<template>
    <div>
        <el-table
                :data="list"
                style="width: 100%;min-height: 490px" id="table" @sort-change="sortChange" :height="height">
            <bos-table-column align="center" v-for="item in labelList" :lable="item.lable" :width="item.width" :sort="item.sort" :field="item.field" :filter="item.filter"></bos-table-column>
            <el-table-column v-if="flag" :label="tableAction.label" align="center">
                <template slot-scope="scope">
                    <el-button :type="item.type" size="mini" class="actionButton" @click="someClick(scope.row,item.name)" v-for="item in tableAction.button" v-text="item.name" data-test="button"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <bos-paginator v-if="list!=''&&havePage"  :pageInfo="pageInfo" @bosCurrentPageChanged="tableChangePage"></bos-paginator>
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
            height:{
                type:String,
                default:'3.45rem'
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
            havePage:{
                type:Boolean,
                default:true
            },
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
                this.$emit('tableCurrentPageChanged',newPage)
            }
        }
    }
</script>

<style scoped>
    .actionButton{
        width:70px;
        height:32px;

        opacity:1;
        color: white;
        border-radius:4px;
    }
</style>