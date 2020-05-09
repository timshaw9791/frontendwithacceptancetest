<template>
    <div class="frequency_box">
        <div class="frequency_head" data-test="title_box">
            {{$route.meta.title}}
        </div>
        <div class="frequency_body" data-test="main_box">
            <report_tree @clickNode="clickNode"></report_tree>
            <report_table ref="table" :table="table">
                <div class="table_header_box" v-if="table.tableType!=='All'&&table.tableType!==''&&computeTotal.count!==undefined">
                    <div class="table_header">
                        <div class="table_header_item"><span v-text="`装备总数：${computeTotal.totalCount}`"></span></div>
                        <div class="table_header_item"><span v-text="`装备总价(元)：${computeTotal.totalPrice}`"></span></div>
                        <div class="table_header_item"><span v-text="`使用次数：${computeTotal.count}`"></span></div>
                    </div>
                </div>
            </report_table>
        </div>
    </div>
</template>

<script>
    import report_tree from 'components/report/report_tree'
    import report_table from 'components/report/report_table'
    import {frequencyStatistic} from 'api/report'
    import {
        categoryFindAll,
        deleteGenreById,
        findAllCategoryById,
        frequencyStock,
        findAllEquipArgs,
        inHouse
    } from "api/warehouse"

    export default {
        name: "frequency",
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
                    info:'',
                    show:false
                },
                computeTotal:{},
                current: {}
            }
        },
        watch: {
            'table.params.search': {
                deep: true,
                handler() {
                    this.getFrequencyList()
                }
            }
        },
        created(){
        },
        methods: {
            clickNode(data) {
                this.table.show=false;
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
                            {lable: '装备总价(元)', field: 'totalPrice'},
                            {lable: '使用次数', field: 'count'},
                        ]);
                        break;
                    case 'Genre':
                        this.table.height = '3.484375rem';
                        this.table.tableTitle = `装备大类：\xa0\xa0${this.current.name}`;
                        this.table.placeholder = '小类';
                        this.$set(this.table, 'labelList', [
                            {lable: '装备小类', field: 'category'},
                            {lable: '装备总数', field: 'totalCount'},
                            {lable: '装备总价(元)', field: 'totalPrice'},
                            {lable: '使用次数', field: 'count'},
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
                            {lable: '装备总价(元)', field: 'totalPrice'},
                            {lable: '使用次数', field: 'count'},
                            {lable: '供应商', field: 'supplier',width:200}
                        ]);
                        break;
                }
                if (this.table.params.search === '') {
                    this.getFrequencyList()
                } else {
                    this.$set(this.table.params, 'search', '')
                }

            },
            getFrequencyList() {
                frequencyStatistic(this.table.params).then(res => {
                    this.$set(this.table, 'list', res);
                    this.table.list.forEach(item=>{
                        item.totalPrice=item.totalPrice/100;
                    });
                    if(this.table.tableType!=='All'){
                        this.computeFunction(JSON.parse(JSON.stringify(this.table.list)))
                    }else {
                        this.table.info=''
                    }
                    if(!this.table.show){
                        this.table.show=true
                    }
                })
            },
            computeFunction(data){
                let totalCount = 0;
                let totalPrice = 0;
                let count = 0;
                data.forEach(item=>{
                    totalCount+=item.totalCount;
                    totalPrice+=item.totalPrice;
                    count+=item.count;
                });
                this.table.info=`装备总数：${totalCount}装备总价(元)：${totalPrice}使用次数：${count}`;
                this.computeTotal={
                    totalCount:totalCount,
                    totalPrice:totalPrice,
                    count:count,
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .frequency_box {
        font-size: 0.0833rem;
        text-align: center;
        height: 4.6875rem;
        width: 100%;
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
    .frequency_box .frequency_head {
        width: 100%;
        height: 0.296875rem;
        display: flex;
        align-items: center;
        justify-content: left;
        padding-left: 0.09375rem;
        border-bottom: 1px solid rgba(112, 112, 112, 0.13);
        color: #707070;
        font-size: 20px;
    }

    .frequency_box .frequency_body {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: center;
        margin-top: 0.276rem;
    }
</style>