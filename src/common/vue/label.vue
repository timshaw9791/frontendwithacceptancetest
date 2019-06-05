<template>
    <div class="label">
        <div v-if="tableFlag">
            <field-table :list="list" :labelList="table.labelList"
                         :tableAction="table.tableAction" @sortChange="sortChange"  :pageInfo="paginator" @tableCurrentPageChanged="changePage" @click="clickTableCloum" style="width: 100%">
            </field-table>
        </div>
    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinTableRecord';
    export default {
        name: "labels",
        data(){
            return{
                param:this.table.graphqlTable.graphqlKey,
                list:[],
            }
        },
        mixins: [formRulesMixin],
        props:{
            table:{
                type:Object
            },
            tableFlag:{
                type:Boolean,
                default:true
            }
        },
        watch:{
          'table.graphqlTable.graphqlApi':{
              deep:true,
              handler() {
                 this.refetch();
              }
          }
        },
        created(){
            this.refetch()
        },
        methods:{
            sortChange(data){
             this.$emit('sortCondition',data)
            },
            clickTableCloum(data){
                this.$emit('clickTable',data);
            },
            refetch(){
                this.getEntityListWithPagintorTest(this.table.graphqlTable.graphqlApi,(data)=>{
                    this.$set(this,'list',data);
                })
            },
        }
    }
</script>

<style scoped>
    .label{
        width: 100%;
    }
</style>