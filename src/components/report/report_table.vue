<template>
    <div class="report_table" data-test="table_box">
        <div class="report_table_action">
            <div class="action_button_box_left">
                <label v-text="table.tableTitle"></label>
            </div>
            <div class="action_button_box_right">
                <div class="action_search">
                    <r_search ref="report_search" :width="324" :placeholder="table.placeholder" @search="getSearch"></r_search>
                </div>
                <div class="action_export">
                    <text-button :iconClass="'导出'" :buttonName="'导出'" @click="toExport"></text-button>
                </div>
            </div>
        </div>
        <div class="report_table_box" data-test="table_box">
            <slot></slot>
            <field-table :align="'left'" :list="table.list" :labelList="table.labelList" :havePage="false" :height="table.height" style="width: 100%"></field-table>
        </div>
        <div v-show="false" style="position: absolute;z-index: -2">
            <excel-table ref="table_excel" :fileName="fileName" :list="table.list" :tableHeader="{bigTitle:$route.meta.title,lableList:table.labelList,smallTitle:table.tableTitle,info:table.info}"></excel-table>
        </div>
    </div>
</template>

<script>
    import r_search from 'components/base/search'
    import textButton from 'components/base/textButton'
    import excelTable from 'components/base/excelTable'
    export default {
        name: "report_table",
        components: {
            r_search, textButton,excelTable
        },
        data() {
            return {}
        },
        props: {
            haveTimeSelect: {
                type: Boolean,
                default: false
            },
            table: {
                type: Object
            }
        },
        computed:{
          fileName(){
             let name='',fileName='';
             switch (this.table.tableType) {
                 case 'All':
                     name='(全部)';
                     break;
                 case 'Genre':
                     name='(大类)';
                     break;
                 case 'Category':
                     name='(装备)';
             }
             fileName = this.$route.meta.title+name;
             console.log(fileName);
             return  fileName
          }
        },
        methods: {
            getSearch(data) {
               this.$set(this.table.params,'search',data);
            },
            emptySearch(){
                this.$refs['report_search'].emptySearch();
            },
            toExport(){
                this.$refs['table_excel'].exportExcel();
            }
        }
    }
</script>

<style lang="scss" scoped>
    /*/deep/ .el-table th.is-leaf, .el-table td {*/
        /*padding-left: 0.3021rem;*/
        /*border-bottom: 0.0052rem solid #EBEEF5;*/
    /*}*/
    /*/deep/ .el-table--enable-row-transition .el-table__body td {*/
        /*padding-left: 0.3021rem;*/
    /*}*/

    /*/deep/ .el-input__inner {*/
        /*text-align: center;*/
    /*}*/
    /deep/ .el-table-column--selection{
        margin-left: 1.0417rem;
    }
    .report_table {
        margin-left: 0.15625rem;
        width: 5.8177rem;
        height: 4.0833rem;
        border: 0.0052rem solid rgba(236, 236, 236, 1);
        border-radius: 0.0208rem;

    }

    .report_table .report_table_action {
        width: 100%;
        height: 0.3073rem;
        background: #F9F9F9;
        border-bottom: 0.0052rem solid rgba(112, 112, 112, 0.13);
        display: flex;
        padding-right: 0.1615rem;
        align-items: center;
        justify-content: space-between;
        padding-left: 0.1615rem;
        font-size: 0.0833rem;
        color: rgba(112, 112, 112, 1);
    }

    .report_table_action .action_button_box {
        height: 100%;
        display: flex;
        align-items: center;
        width: 1.6833rem;
        justify-content: space-between;
    }

    .report_table_action .action_button_box_left {
        height: 100%;
        padding-left: 10px;
        display: flex;
        align-items: center;
        font-size: 0.0833rem;
        color:rgba(112,112,112,1);
    }

    .report_table_action .action_button_box_right {
        height: 100%;
        display: flex;
        align-items: center;
    }

    .action_button_box_right .action_search {
        width: 1.6875rem;
        height: 100%;
        display: flex;
        align-items: center;
    }

    .action_button_box_right .action_export {
        margin-left: 0.1042rem;
        height: 100%;
        display: flex;
        align-items: center;
        color: #2F2F76;
    }

    .report_table .report_table_box {
        padding-right: 0.1615rem;
        padding-left: 0.1615rem;
    }
</style>