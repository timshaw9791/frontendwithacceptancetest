<template>
    <div class="repair_box">
        <div class="repair_head" data-test="title_box">
            {{$route.meta.title}}
        </div>
        <div class="repair_body" data-test="main_box">
            <report_tree @clickNode="clickNode"></report_tree>
            <report_table ref="table" :table="table" @export="toExport">
                <div class="table_header_box" v-if="table.tableType!=='All'&&table.tableType!==''&&computeTotal.rate!==undefined">
                    <div class="table_header">
                        <div class="table_header_item"><span v-text="`装备总数：${computeTotal.totalCount}`"></span></div>
                        <div class="table_header_item"><span v-text="`装备总价(元)：${computeTotal.totalPrice}`"></span></div>
                        <div class="table_header_item"><span v-text="`维修数量：${computeTotal.count}`"></span></div>
                        <div class="table_header_item"><span v-text="`维修率(%)：${computeTotal.rate}`"></span></div>
                    </div>
                </div>
            </report_table>
        </div>
    </div>
</template>

<script>
    import report_tree from 'components/report/report_tree'
    import report_table from 'components/report/report_table'
    import {repairStatistic} from 'api/report'
    import {
        categoryFindAll,
        deleteGenreById,
        findAllCategoryById,
        repairStock,
        findAllEquipArgs,
        inHouse
    } from "api/warehouse"

    export default {
        name: "repair",
        components: {report_tree, report_table},
        data() {
            return {
                table: {
                    tableType: 'All',
                    list: [],
                    labelList: [],
                    tableTitle: '全部大类',
                    placeholder: '全部大类',
                    height: '3.78125rem',
                    params: {id: '', level: '', search: ''},
                },
                computeTotal:{},
                current: {}
            }
        },
        watch: {
            'table.params.search': {
                deep: true,
                handler() {
                    this.getAmountList()
                }
            }
        },
        created(){
        },
        methods: {
            clickNode(data) {
                if (this.current.id !== data.id) {
                    this.$refs.table.emptySearch()
                }
                this.current = data;
                this.classification(JSON.parse(JSON.stringify(this.current)))
            },
            classification(data) {
                if (data.name === '全部') {
                    this.table.tableType = 'All';
                    this.table.params.level = 'ALL';
                    this.table.params.id = ''
                } else if (data.categorySet) {
                    this.table.tableType = 'Genre';
                    this.table.params.level = 'GENRE';
                    this.table.params.id = data.id
                } else {
                    this.table.tableType = 'Category';
                    this.table.params.level = 'CATEGORY';
                    this.table.params.id = data.id
                }
                this.typeCountermeasure(this.table.tableType)
            },
            typeCountermeasure(data) {
                switch (data) {
                    case 'All':
                        this.table.height = '3.78125rem';
                        this.table.tableTitle = '全部大类';
                        this.table.placeholder = '全部大类';
                        this.$set(this.table, 'labelList', [
                            {lable: '装备大类', field: 'genre'},
                            {lable: '装备总数', field: 'totalCount'},
                            {lable: '装备总价(元)', field: 'totalPrice',filter: this.filterTotalPrice},
                            {lable: '维修数量', field: 'count',},
                            {lable: '维修率(%)',filter: this.filterRate}
                        ]);
                        break;
                    case 'Genre':
                        this.table.height = '3.484375rem';
                        this.table.tableTitle = `装备大类：\xa0\xa0${this.current.name}`;
                        this.table.placeholder = '小类';
                        this.$set(this.table, 'labelList', [
                            {lable: '装备小类', field: 'category'},
                            {lable: '装备总数', field: 'totalCount'},
                            {lable: '装备总价(元)', field: 'totalPrice',filter: this.filterTotalPrice},
                            {lable: '维修数量', field: 'count',},
                            {lable: '维修率(%)', filter: this.filterRate}
                        ]);
                        break;
                    case 'Category':
                        this.table.height = '3.484375rem';
                        this.table.tableTitle = `装备小类：\xa0\xa0${this.current.name}`;
                        this.table.placeholder = '名称/供应商';
                        this.$set(this.table, 'labelList', [
                            {lable: '装备名称', field: 'name'},
                            {lable: '装备型号', field: 'model'},
                            {lable: '装备总数', field: 'totalCount'},
                            {lable: '装备总价(元)', field: 'totalPrice',filter: this.filterTotalPrice},
                            {lable: '维修数量', field: 'count'},
                            {lable: '维修率(%)', filter: this.filterRate},
                            {lable: '供应商', field: 'supplier',width:240}
                        ]);
                        break;
                }
                if (this.table.params.search === '') {
                    this.getAmountList()
                } else {
                    this.$set(this.table.params, 'search', '')
                }

            },
            getAmountList() {
                repairStatistic(this.table.params).then(res => {
                    this.$set(this.table, 'list', res);
                    if(this.table.tableType!=='All'){
                        this.computeFunction(JSON.parse(JSON.stringify(this.table.list)))
                    }

                })
            },
            filterTotalPrice(data) {
                return data.totalPrice/100
            },
            filterTotalLoss(data) {
                return data.totalLoss/100
            },
            filterRate(data){
                if(data.totalCount!==0){
                    return data.count/data.totalCount
                }else {
                    return 0
                }

            },
            computeFunction(data){
                let totalCount = 0;
                let totalPrice = 0;
                let count = 0;
                let rate = 0;
                data.forEach(item=>{
                    totalCount+=item.totalCount;
                    totalPrice+=item.totalPrice;
                    count+=item.count;
                });
                if(totalCount!=0){
                    rate=count/totalCount
                }
                this.computeTotal={
                    totalCount:totalCount,
                    totalPrice:totalPrice/100,
                    count:count,
                    rate:rate
                }
            },
            toExport(){
                console.log('toExport')
            }
            // distributionClick(){
            //     this.status.buttonDisable=!this.status.buttonDisable;
            //     this.status.distribution=!this.status.buttonDisable;
            //     if(!this.status.distribution){
            //         this.$refs.repairTable.resultCheckBox();
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
            //             repairStock(category).then(res => {
            //                 this.$message.success('操作成功');
            //                 this.status.buttonDisable = !this.status.buttonDisable
            //             });
            //         }
            //     } else {
            //         if(this.table.tableType==='unallocated'){
            //             this.$refs.repairTable.resultCheckBox();
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
    .repair_box {
        font-size: 0.0833rem;
        text-align: center;
    }
    .table_header_box{
        height: 0.296875rem;
        width: 100%;
        border-bottom: 1px solid rgba(112, 112, 112, 0.13);
        /*padding-left: 0.1615rem;*/
        /*padding-right: 0.1615rem;*/
        display: flex;
        align-items: center;
    }
    .table_header_box .table_header{
        padding-left:10px;
        padding-right:10px;
        width: 100%;
        color: #707070FF;
        display: flex;
    }
    .table_header .table_header_item{
        margin-right: 0.2604rem;
    }
    .repair_box .repair_head {
        width: 100%;
        height: 0.296875rem;
        display: flex;
        align-items: center;
        justify-content: left;
        padding-left: 0.09375rem;
        border-bottom: 1px solid rgba(112, 112, 112, 0.13);
        color: #707070;
    }

    .repair_box .repair_body {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: center;
        margin-top: 0.276rem;
    }
</style>