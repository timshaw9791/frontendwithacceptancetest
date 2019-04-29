<template>
    <div class="label">
        <div v-if="tableFlag">
            <field-table :list="list" :labelList="table.labelList"
                         :haveButton="table.haveButton" :pageInfo="paginator" @tableCurrentPageChanged="changePage" @click="clickTableCloum" style="width: 100%"></field-table>
        </div>
    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinTable';
    export default {
        name: "labels",
        data(){
            return{
                param:this.table.graphqlTable.graphqlKey
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
        apollo:{
            list() {
                return this.getEntityListWithPagintor(this.table.graphqlTable.graphqlApi);
            },
        },
        created(){
            console.log(this.table);
        },
        methods:{
            clickTableCloum(data){
                this.$emit('clickTable',data);
            }
        }
    }
</script>

<style scoped>
    .label{
        width: 100%;
    }
</style>