<template>
    <div class="safety_box">
        <div class="safety_head" data-test="title_box">
            {{$route.meta.title}}
        </div>
        <div class="safety_body" data-test="main_box">
            <report_tree @clickNode="clickNode"></report_tree>
            <report_table :table="table"></report_table>
        </div>
    </div>
</template>

<script>
    import report_tree from 'components/report/report_tree'
    import report_table from 'components/report/report_table'
    import {
        categoryFindAll,
        deleteGenreById,
        findAllCategoryById,
        safetyStock,
        findAllEquipArgs,
        inHouse
    } from "api/warehouse"

    export default {
        name: "amount",
        components: {report_tree, report_table},
        data() {
            return {
                table: {
                    tableType: 'genre',
                    list: [],
                    labelList: [
                        {lable: '装备大类', field: 'action'},
                        {lable: '装备总数', field: 'operator'},
                        {lable: '可用数量', field: 'startTime'},
                        {lable: '领用数量', field: 'action',},
                        {lable: '装备总价(元)', field: 'action', filter: this.filterPrice},
                    ],
                    tableTitle: '全部大类',
                    placeholder: '全部大类',
                    height: '3.78125rem',
                    params: {}
                },
                current: {}
            }
        },
        watch: {
            'current': {
                deep: true,
                handler(newVal) {
                    this.getAmountList(newVal)
                }
            },
            'table.params': {
                deep: true,
                handler(newVal) {
                    console.log('params',newVal)
                    this.getAmountList(newVal)
                }
            }
        },
        methods: {
            clickNode(data) {
                this.current = data;
                this.classification(JSON.parse(JSON.stringify(this.current)))
            },
            classification(data) {
                if (data.name === '全部') {
                    this.table.tableType = 'All';
                } else if (data.categorySet) {
                    this.table.tableType = 'Genre';
                } else {
                    this.table.tableType = 'Category';
                }
                this.typeCountermeasure(this.table.tableType)
            },
            typeCountermeasure(data) {
                switch (data) {
                    case 'All':
                        this.table.height = '3.78125rem';
                        this.table.tableTitle = '全部大类';
                        this.table.placeholder = '全部大类';
                        this.$set(this.table,'params',{});
                        this.$set(this.table, 'labelList', [
                            {lable: '装备大类', field: 'action'},
                            {lable: '装备总数', field: 'operator'},
                            {lable: '可用数量', field: 'startTime'},
                            {lable: '领用数量', field: 'action',},
                            {lable: '装备总价(元)', field: 'action', filter: this.filterPrice},
                        ]);
                        break;
                    case 'Genre':
                        this.table.height = '3.78125rem';
                        this.table.tableTitle = '装备大类：警械';
                        this.table.placeholder = '小类';
                        this.$set(this.table,'params',{});
                        this.$set(this.table, 'labelList', [
                            {lable: '装备小类', field: 'action'},
                            {lable: '装备总数', field: 'operator'},
                            {lable: '可用数量', field: 'startTime'},
                            {lable: '领用数量', field: 'action',},
                            {lable: '装备总价(元)', field: 'action', filter: this.filterPrice},
                        ]);
                        break;
                    case 'Category':
                        this.table.height = '3.78125rem';
                        this.table.tableTitle = '装备小类：警棍';
                        this.table.placeholder = '名称/供应商';
                        this.$set(this.table,'params',{});
                        this.$set(this.table, 'labelList', [
                            {lable: '装备名称', field: 'action'},
                            {lable: '装备型号', field: 'operator'},
                            {lable: '装备总数', field: 'startTime'},
                            {lable: '可用数量', field: 'action',},
                            {lable: '领用数量', field: 'action',},
                            {lable: '装备总价(元)', field: 'action', filter: this.filterPrice},
                            {lable: '供应商', field: 'action',}
                        ]);
                        break;
                }
            },
            getAmountList(data) {

            },
            filterPrice(data) {

            }

            // distributionClick(){
            //     this.status.buttonDisable=!this.status.buttonDisable;
            //     this.status.distribution=!this.status.buttonDisable;
            //     if(!this.status.distribution){
            //         this.$refs.safetyTable.resultCheckBox();
            //     }
            // },
            // getTotalAndStockCount() {
            //     let count = 0;
            //     this.table.stock = this.tree.currentNode.stock;
            //     this.table.tableData.forEach(item => {
            //         count = count + item.count
            //     });
            //     this.table.totalCount = count + '\xa0\xa0{件}'
            // },
            // refetch() {
            //     this.getGenreAll();
            //     if (this.table.tableType === 'genre') {
            //         findAllCategoryById(this.tree.currentNode.id).then(res => {
            //             this.table.tableData = res;
            //         });
            //     } else {
            //         findAllEquipArgs(this.tree.currentNode.id).then(res => {
            //             this.table.tableData = res;
            //             this.getTotalAndStockCount();
            //         })
            //     }
            //     this.$message.success('操作成功');
            //     this.$refs.genreOrCategory.cancelDb()
            // },
            // modifyStock(type) {
            //     if (type === 'status') {
            //         this.status.buttonDisable = !this.status.buttonDisable;
            //         this.table.copyTableData = JSON.parse(JSON.stringify(this.table.tableData));
            //     } else if (type === 'modify') {
            //         if(this.table.tableType==='unallocated'){
            //             this.title.titleType = 'unallocated';
            //             this.title.genreTitle ='装备分配';
            //             this.$refs.genreOrCategory.show()
            //         }else{
            //             let category = [];
            //             this.table.tableData.forEach(item => {
            //                 category.push(item.category)
            //             });
            //             safetyStock(category).then(res => {
            //                 this.$message.success('操作成功');
            //                 this.status.buttonDisable = !this.status.buttonDisable
            //             });
            //         }
            //     } else {
            //         if(this.table.tableType==='unallocated'){
            //             this.$refs.safetyTable.resultCheckBox();
            //             this.status.distribution=false;
            //         }else{
            //             this.table.tableData = this.table.copyTableData;
            //         }
            //         this.status.buttonDisable = !this.status.buttonDisable;
            //     }
            // },
            // addOrModifyGenre(data, type) {
            //     if (data === 'add') {
            //         this.title.genreTitle = type === 'tree' ? '添加大类' : '添加小类';
            //     } else {
            //         this.title.genreTitle = type === 'tree' ? '修改大类' : '修改小类';
            //     }
            //     this.title.titleType = type;
            //     this.$refs.genreOrCategory.show()
            // },
            // deleteGenreById() {
            //     deleteGenreById(this.tree.currentNode.id).then(res => {
            //         this.getGenreAll();
            //         this.$refs.deleteGenre.hide();
            //     })
            // },
            // deleteGenre() {
            //     this.$refs.deleteGenre.show();
            // },
            //

            // filterNode(value, data) {
            //     console.log(value, data)
            //     if (!value) return true;
            //     return data.name.indexOf(value) !== -1;
            // },
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
</style>