<template>
    <div class="safety_tree" data-test="tree_box">
        <div class="safety_tree_filter">
            <div style="width: 1.6875rem">
                <s_search @search="getSearch" :placeholder="'小类'"></s_search>
            </div>
        </div>
        <div class="safety_tree_body" data-test="tree_box">
            <el-tree
                    :data="tree.treeData"
                    class="tree_setting"
                    :props="tree.props"
                    :filter-node-method="filterNode"
                    @node-click="handleNodeClick"
                    ref="tree"
            >
                <span class="custom-tree-node" slot-scope="{ node, data }">
        <span style="color: #2F2F76" :class="node.level===1?'firstName':''" :ref="data.id">{{ data.name }}</span>
     </span>
            </el-tree>
        </div>
        <div class="safety_tree_foot">

        </div>
    </div>
</template>

<script>
    import s_search from 'components/base/search'
    import {categoryFindAll} from "api/warehouse"
    export default {
        name: "report_tree",
        components:{
            s_search
        },
        props: {

        },
        data(){
          return{
              filterText: '',
              tree: {
                  treeData: [],
                  copyTreeData:[],
                  currentNode: {},
                  props: {
                      children: 'categorySet',
                      label: 'name'
                  }
              }
          }
        },
        watch:{
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        created() {
            this.getGenreAll()
        },

        methods:{
            getGenreAll() {
                categoryFindAll().then(res => {
                    this.tree.copyTreeData=res;
                    this.tree.treeData = [{name:'全部',id:'All',click:false,categorySet:[]},...res];
                    this.tree.treeData.forEach(item => {
                        item.click = false;
                        item.categorySet.forEach(item => {
                            item.click = false;
                        })
                    })
                })
            },
            getSearch(data) {
                this.filterText = data
            },
            handleNodeClick(data) {
                this.$set(data, 'click', !data.click);
                this.$emit('clickNode',data);
                this.getColor(data);

            },
            getColor(data) {
                this.tree.treeData.forEach(item => {
                    if (item.id === data.id) {
                        if (data.click) {
                            this.$refs[item.id].style.color = "#3F5FE0";
                        } else {
                            this.$refs[item.id].style.color = "#2F2F76";
                        }
                        item.categorySet.forEach(category => {
                            category.click = false;
                            this.$refs[category.id].style.color = "#2F2F76";
                        })
                    } else {
                        item.click = false;
                        this.$refs[item.id].style.color = "#2F2F76";
                        item.categorySet.forEach(category => {
                            if (category.id === data.id) {
                                if (data.click) {
                                    this.$refs[category.id].style.color = "#3F5FE0";
                                } else {
                                    this.$refs[category.id].style.color = "#2F2F76";
                                }
                            } else {
                                category.click = false;
                                this.$refs[category.id].style.color = "#2F2F76";
                            }
                        })
                    }
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .safety_tree {
        width: 1.8854rem;
        height: 4.0833rem;
        border: 0.0052rem solid rgba(236, 236, 236, 1);
        border-radius: 0.0208rem;
    }

    .safety_tree .safety_tree_filter {
        width: 100%;
        height: 0.3073rem;
        border-bottom: 0.0052rem solid rgba(112, 112, 112, 0.13);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .safety_tree .safety_tree_body {
        height: 3.526rem;
        border-bottom: 0.0052rem solid rgba(112, 112, 112, 0.13);
    }

    .safety_tree .safety_tree_foot {
        height: 0.25rem;
        width: 100%;
        background: #F9F9F9;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0px 0.099rem;
        color: #2F2F76;
    }

    .safety_tree_foot .safety_tree_foot_item {
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;

    }

    /deep/ .el-tree-node__expand-icon.expanded {
        /*-webkit-transform: rotate(0deg);*/
        /*transform: rotate(0deg);*/
    }

    /deep/ .el-tree-node__expand-icon {
        color: #2F2F76;
    }

    /deep/ .el-icon-caret-right:before {
        /*content: "\E6D9";*/
        font-size: 0.0833rem;
    }

    /deep/ .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
        /*content: "\E6D8";*/
        font-size: 0.0833rem;
        font-weight: bold;
    }

    /deep/ .firstName {
        font-weight: bold;
    }

    /deep/ .treeColorClick {
        color: #3F5FE0;
    }

    /deep/ .treeColorNoClick {
        color: #2F2F76;
    }

    .safety_tree_body .tree_setting {
        background-color: rgba(255, 255, 255, 0);
        font-size: 0.0833rem;
        color: #2F2F76;
    }
</style>