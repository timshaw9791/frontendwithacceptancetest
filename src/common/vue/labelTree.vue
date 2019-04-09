<template>
    <div class="label-tree">
        <div style="width: 20%">
            <field-tree :treeData="tree.treeData" :defaultProps="tree.defaultProps"
                        @node="selectNode"></field-tree>
        </div>
        <div style="width: 80%">
            <field-table :list="list" :labelList="table.labelList"
                         :haveButton="table.haveButton" :pageInfo="paginator" @tableCurrentPageChanged="changePage" @click="clickTableCloum" style="width: 100%"></field-table>
        </div>
    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinTable';
    export default {
        name: "labelTree",
        data(){
            return{
                param:{
                    [this.tree.nodeKey.key]:''
                }
            }
        },
        mixins: [formRulesMixin],
        props:{
            tree:{
                type:Object
            },
            table:{
                type:Object
            },
        },
        apollo:{
            list() {
                return this.getEntityListWithPagintor(this.table.graphqlTable.graphqlApi);
            },
        },
        created(){
          this.getTreeData();
        },
        watch:{
            'tree.graphqlTree.graphqlKey': {
                deep: true,
                handler(newVal,oldVal){
                    this.getTreeData();
                }
            }
        },
        methods:{
            getTreeData() {
                this.getQuery(this.tree.graphqlTree.graphqlApi,this.tree.graphqlTree.graphqlKey,this.tree.graphqlTree.graphglName).then(data=>{
                    this.tree.treeData = data;
                })
            },
            selectNode(data) {
                this.tree.node = data;
                this.param[this.tree.nodeKey.key]=data[this.tree.nodeKey.key];
            },
            clickTableCloum(data){
                this.$emit('clickTable',data);
            },
            getQuery(api,value,name){
                let promise=new Promise((resolve)=>{
                    this.gqlQuery(api, value, (res) => {
                        if (res.data[name].content.length > 0) {
                            resolve(
                                JSON.parse(JSON.stringify(res.data[name].content))
                            );
                        }
                    });
                });
                return promise
            }
        }
    }
</script>

<style scoped>
    .label-tree{
        display: flex;
        flex-direction: row;
        width: 100%;
    }
</style>