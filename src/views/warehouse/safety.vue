<template>
    <div class="safety_box">
        <div class="safety_head" data-test="title_box">
            大小类与安全库存
        </div>
        <div class="safety_body" data-test="main_box">
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
                    <text-button :buttonName="'添加大类'" @click="addOrModifyGenre('add','tree')"></text-button>
                    <text-button :iconClass="'删除'" :buttonName="'删除大类'" @click="deleteGenre"></text-button>
                    <text-button :iconClass="'修改'" :buttonName="'修改大类'"
                                 @click="addOrModifyGenre('modify','tree')"></text-button>
                </div>
            </div>
            <div class="safety_table" data-test="table_box">
                <div class="safety_table_action">
                    <div class="action_button_box_right">
                        <label v-text="title.tableTitle"></label>
                        <div v-if="table.tableType==='category'" style="margin-left: 0.5208rem"><label v-text="'装备总数：'" ></label><label v-text="table.totalCount"></label></div>
                        <div v-if="table.tableType==='category'" style="margin-left: 0.5208rem"><label v-text="'安全库存：'" ></label><label v-text="table.stock"></label></div>
                    </div>
                    <div style="display: flex;">
                        <div v-if="table.tableType!=='category'" class="action_button_box">
                            <text-button v-if="table.tableType==='genre'" :buttonName="'添加小类'" @click="addOrModifyGenre('add','table')"></text-button>
                            <text-button v-if="table.tableType==='genre'":iconClass="'修改'" :buttonName="'修改小类'"
                                         @click="addOrModifyGenre('modify','table')"></text-button>
                            <text-button v-if="table.tableType==='genre'":iconClass="'编辑'" :buttonName="'编辑库存'"
                                         @click="modifyStock('status')" style="margin-right: 0.0921rem"></text-button>

                        </div>
                        <div style="display: flex;" v-if="table.tableType!=='category'">
                            <text-button v-if="table.tableType==='unallocated'":iconClass="'分配'" :buttonName="'装备分类'"
                                         @click="distributionClick" style="margin-right: 0.0921rem"></text-button>
                            <text-button :iconClass="'取消1'" :dataTest="'disable'" v-if="status.buttonDisable" :havePoint="false"
                                         :buttonName="' '"></text-button>
                            <text-button :iconClass="'确定1'" :dataTest="'disable'" v-if="status.buttonDisable" :havePoint="false"
                                         :buttonName="' '" style="margin-left: 0.0521rem"></text-button>
                            <text-button :iconClass="'取消'" :dataTest="'取消_icon'" v-if="!status.buttonDisable" :buttonName="' '"
                                         @click="modifyStock('result')"></text-button>
                            <text-button :iconClass="'确定'" :dataTest="'确定_icon'" v-if="!status.buttonDisable" :buttonName="' '"
                                         @click="modifyStock('modify')" style="margin-left: 0.0521rem"></text-button>
                        </div>
                    </div>
                </div>
                <div class="safety_table_box" data-test="table_box">
                    <safety-table ref="safetyTable" :currentNode="tree.currentNode" v-if="status.tableFlag" :table="table" :disable="status.buttonDisable" :distribution="status.distribution" @success="successTable"></safety-table>
                </div>
            </div>
        </div>
        <genre-or-category ref="genreOrCategory" :selectData="tree.copyTreeData" :title="title.genreTitle" :genreData="tree.currentNode"
                           @sucess="refetch" @sucessDistribution="successTable" :type="title.titleType" :checkBoxData="table.checkBoxData"></genre-or-category>
        <tips ref="deleteGenre" :contentText="'您确定要删除此条装备大类吗'" @confirm="deleteGenreById"></tips>
    </div>
</template>

<script>
    import s_search from 'components/base/search'
    import textButton from 'components/base/textButton'
    import tips from "components/base/tips"
    import serviceDialog from 'components/base/gailiangban'
    import genreOrCategory from 'components/warehouse/safety/genreOrCategory'
    import safetyTable from 'components/warehouse/safety/safetyTable'
    import {categoryFindAll, deleteGenreById, findAllCategoryById, safetyStock, findAllEquipArgs,inHouse} from "api/warehouse"

    export default {
        name: "safety",
        components: {s_search, textButton, serviceDialog, genreOrCategory, safetyTable, tips},
        data() {
            return {
                filterText:'',
                form: {},
                table: {
                    tableType: 'genre',
                    tableData: [],
                    copyTableData: [],
                    totalCount: '',
                    stock: '',
                    checkBoxData:[]
                },
                tree: {
                    treeData: [],
                    copyTreeData:[],
                    currentNode: {},
                    props: {
                        children: 'categorySet',
                        label: 'name'
                    },

                },
                title: {
                    genreTitle: '',
                    tableTitle: '',
                    titleType: ''
                },
                status: {
                    buttonDisable: true,
                    distribution:false,
                    tableFlag:false
                }

            }
        },
        created() {
            this.getGenreAll()
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            },
            'title.tableTitle': {
                deep: true,
                handler(newVal, oldVal) {

                }
            }
        },
        methods: {
            init(){
                this.handleNodeClick(this.tree.treeData[0]);
            },
            distributionClick(){
                this.status.buttonDisable=!this.status.buttonDisable;
                this.status.distribution=!this.status.buttonDisable;
                if(!this.status.distribution){
                    this.$refs.safetyTable.resultCheckBox();
                }
            },
            successTable(data) {
                if (data === 'category') {
                    this.refetch();
                }else if(data !== 'unallocated'){
                    findAllEquipArgs(this.tree.currentNode.id).then(res => {
                        this.table.tableData = res;
                        this.getTotalAndStockCount();
                    });
                    this.$message.success('操作成功');
                }else {
                    findAllEquipArgs('').then(res => {
                        this.table.tableData = res;
                        this.$message.success('操作成功');
                        this.$refs.genreOrCategory.cancelDb()
                    });
                }
            },
            reSultStatus(){
                this.status.distribution=false;
                this.status.buttonDisable=true;
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
            handleNodeClick(data, node) {
                this.$set(data, 'click', !data.click);
                this.tree.currentNode = data;
                this.reSultStatus();
                this.status.tableFlag=false;
                if(data.name!=='未分类装备'){
                    if (data.categorySet) {
                        findAllCategoryById(data.id).then(res => {
                            this.table.tableData = res;
                            this.table.tableType = 'genre';
                            this.status.tableFlag=true;
                            this.title.tableTitle=`装备大类:\xa0\xa0\xa0\xa0${data.name}`
                        });
                    } else {
                        findAllEquipArgs(data.id).then(res => {
                            this.table.tableData = res;
                            this.getTotalAndStockCount();
                            this.table.tableType = 'category';
                            this.status.tableFlag=true;
                            this.title.tableTitle=`装备小类:\xa0\xa0\xa0\xa0${data.name}`
                        })
                    }
                }else {
                    this.title.tableTitle='未分类装备';
                    findAllEquipArgs('').then(res => {
                        this.table.tableType='unallocated';
                        this.table.tableData = res;
                        this.status.tableFlag=true
                    });
                }
                this.getColor(data);
            },
            getTotalAndStockCount() {
                let count = 0;
                this.table.stock = this.tree.currentNode.stock;
                this.table.tableData.forEach(item => {
                    count = count + item.count
                });
                this.table.totalCount = count + '\xa0\xa0(件)'
            },
            refetch() {
                this.getGenreAll();
                if (this.table.tableType === 'genre') {
                    findAllCategoryById(this.tree.currentNode.id).then(res => {
                        this.table.tableData = res;
                    });
                } else {
                    findAllEquipArgs(this.tree.currentNode.id).then(res => {
                        this.table.tableData = res;
                        this.getTotalAndStockCount();
                    })
                }
                this.$message.success('操作成功');
                this.$refs.genreOrCategory.cancelDb()
            },
            modifyStock(type) {
                if (type === 'status') {
                    this.status.buttonDisable = !this.status.buttonDisable;
                    this.table.copyTableData = JSON.parse(JSON.stringify(this.table.tableData));
                } else if (type === 'modify') {
                    if(this.table.tableType==='unallocated'){
                        this.title.titleType = 'unallocated';
                        this.title.genreTitle ='装备分配';
                        this.$refs.genreOrCategory.show()
                    }else{
                        let category = [];
                        this.table.tableData.forEach(item => {
                            category.push(item.category)
                        });
                        safetyStock(category).then(res => {
                            this.$message.success('操作成功');
                            this.status.buttonDisable = !this.status.buttonDisable
                        });
                    }
                } else {
                    if(this.table.tableType==='unallocated'){
                        this.$refs.safetyTable.resultCheckBox();
                        this.status.distribution=false;
                    }else{
                        this.table.tableData = this.table.copyTableData;
                    }
                    this.status.buttonDisable = !this.status.buttonDisable;
                }
            },
            addOrModifyGenre(data, type) {
                if (data === 'add') {
                    this.title.genreTitle = type === 'tree' ? '添加大类' : '添加小类';
                } else {
                    this.title.genreTitle = type === 'tree' ? '修改大类' : '修改小类';
                }
                this.title.titleType = type;
                this.$refs.genreOrCategory.show()
            },
            deleteGenreById() {
                deleteGenreById(this.tree.currentNode.id).then(res => {
                    this.getGenreAll();
                    this.$refs.deleteGenre.hide();
                }).catch(err=>{
                    this.$message.error(err.response.data.message);
                    this.$refs.deleteGenre.hide();
                })
            },
            deleteGenre() {
                this.$refs.deleteGenre.show();
            },
            getGenreAll() {
                categoryFindAll().then(res => {
                    this.tree.copyTreeData=res;
                    this.tree.treeData = [{name:'未分类装备',id:'unallocated',click:false,categorySet:[]},...res];
                    this.tree.treeData.forEach(item => {
                        item.click = false;
                        item.categorySet.forEach(item => {
                            item.click = false;
                        })
                    });
                    setTimeout(()=>{
                        this.init()
                    },50)
                })
            },
            getSearch(data) {
                this.filterText = data
            },
            filterNode(value, data) {
                console.log(value, data)
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            // renderContent(h, {node, data, store}) {
            //     return (
            //         < span
            // class
            //     = "custom-tree-node" >
            //         < span
            // class
            //     = {data.click ? 'treeColorClick' : 'treeColorNoClick'} > {node.label} < /span>
            //         < /span>
            // )
            //     ;
            // },
        }
    }
</script>

<style lang="scss" scoped>
    .safety_box {
        font-size: 0.0833rem;
        text-align: center;
    }

    .safety_box .safety_head {
        width: 100%;
        height: 0.296875rem;
        display: flex;
        align-items: center;
        justify-content: left;
        padding-left: 0.09375rem;
        border-bottom: 1px solid rgba(112, 112, 112, 0.13);
        color: #707070;
    }

    .safety_box .safety_body {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: center;
        margin-top: 0.276rem;
    }

    .safety_body .safety_tree {
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
    /deep/ .el-table-column--selection .cell {
         padding-left: 0.0821rem;
         padding-right: 0rem;
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

    .safety_body .safety_table {
        margin-left: 0.15625rem;
        width: 5.8177rem;
        height: 4.0833rem;
        border: 0.0052rem solid rgba(236, 236, 236, 1);
        border-radius: 0.0208rem;

    }

    .safety_table .safety_table_action {
        width: 100%;
        height: 0.3073rem;
        background: #F9F9F9;
        border-bottom: 0.0052rem solid rgba(112, 112, 112, 0.13);
        display: flex;
        padding-right: 0.1667rem;
        color: #2F2F76FF!important;
        align-items: center;
        justify-content: space-between;
        padding-left: 0.34375rem;
        font-size: 0.0833rem;
        color: rgba(112, 112, 112, 1);
    }

    .safety_table_action .action_button_box {
        height: 100%;
        display: flex;
        align-items: center;
        width: 1.6833rem;
        justify-content: space-between;
    }
    .safety_table_action .action_button_box_right{
        height: 100%;
        display: flex;
        align-items: center;
    }
    .safety_table .safety_table_box {

    }
</style>