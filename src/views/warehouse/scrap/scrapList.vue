<template>
    <div class="scrap-order-container">
        <my-header title="报废单"></my-header>
        <div class="header">
            <base-button label="常规报废" type="primary" @click="toScrap"></base-button>
        </div>
        <div class="data-list">
            <define-table :data="list" height="3.64rem" @changePage="changePage" :pageInfo="paginator">
                <define-column label="操作" width="130" v-slot="{ data }">
                    <div class="span-box">
                        <base-button label="详情" size="mini" @click="toDetail(data.row)" type="primary"></base-button>
                    </div>
                </define-column>
                <define-column label="单号" field="number"></define-column>
                <define-column label="报废类型" field="categoryContent"></define-column>
                <define-column label="装备参数" field="equipArg"></define-column>
                <define-column label="装备数量" field="count"></define-column>
                <define-column label="操作人员" field="operatorInfo.operator"></define-column>
                <define-column label="报废时间" :filter="(row)=>$filterTime(row.createTime)"/>
            </define-table>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import textInput from '@/componentized/textBox/textInput.vue'
    import bosTabs from '@/componentized/table/bosTabs.vue'
    import divTmp from '@/componentized/divTmp'
    import {scarpsOrders} from "api/operation"
    import {transScrapCategory} from '../../../common/js'
    import {listTableMixin} from "../../../field/mixins/listMixin";

    export default {
        name: 'scrapList',
        components: {
            myHeader,
            textInput,
            divTmp,
            bosTabs,
        },
        mixins: [listTableMixin],
        data() {
            return {
                list: [],
                paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0},
            }
        },
        methods: {
            fetchData() {
                scarpsOrders(this.paginator).then(res => {
                    this.list = res.content
                    this.paginator.totalElements = res.totalElements
                    this.paginator.totalPages = res.totalPages
                    this.fixData()
                })
            },
            fixData() {
                this.list.forEach(item => {
                    // 通过 category 转成 enumContent
                    transScrapCategory(item)
                    // 装备数量
                    item.count = item.scrapItems.length
                    if (item.scrapItems.length !== 0) {
                        item.equipArg = item.scrapItems[0].equipName + '(' + item.scrapItems[0].equipModel + ')'
                        item.equipArg = item.scrapItems.length > 1 ? item.equipArg + '...' : item.equipArg
                    }
                })
            },
            changePage(page) {
                this.paginator.page = page;
                this.fetchData()
            },
            toDetail(data) {
                this.$router.push({path: 'scrapInfo', query: {id: data.id}})
            },
            toScrap() {
                this.$router.push({path: 'scrapInfo', query: {category: '3'}})
            }
        },
    }
</script>
<style lang="scss" scoped>
    .scrap-order-container {
        font-size: 16px;
    }

    .header {
        padding: 16px 8px;
    }
</style>