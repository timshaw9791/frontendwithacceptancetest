<template>
    <div class="label-tree" :style="cWidth()">
        <div>
            <field-tree :treeData="tree.treeData" :defaultProps="tree.defaultProps"
                        @node="selectNode"></field-tree>
        </div>
        <div style="width: 80%" v-if="tableFlag">
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
                param:this.table.graphqlTable.graphqlKey
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
            tableFlag:{
                type:Boolean,
                default:true
            },
            width:{
                type:Number,
                default:100
            }
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
            cWidth(){
                let width='width:'+this.width+'%';
                return width
            },
            getTreeData() {
                this.getQuery(this.tree.graphqlTree.graphqlApi,this.tree.graphqlTree.graphqlKey,this.tree.graphqlTree.graphglName).then(data=>{
                    this.tree.treeData = data;
                })
            },
            selectNode(data) {
                this.tree.node = data;
                if(this.tree.nodeKey){
                    this.param[this.tree.nodeKey]=data[this.tree.nodeKey];
                }else {
                    this.$emit('treeEmit',true);
                }
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
    }
</style>