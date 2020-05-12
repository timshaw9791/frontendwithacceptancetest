<template>
    <div class="scrap-order-container">
        <my-header title="报废单"></my-header>
        <div class="data-list">
            <define-table :data="list" height="3.64rem" @changeCurrent="selRow" @changePage="changePage"
                          :pageInfo="paginator">
                <define-column label="操作" width="130" v-slot="{ data }">
                    <div class="span-box">
                        <base-button label="详情" size="mini" @click="toDetail(data.row)" type="primary"></base-button>
                    </div>
                </define-column>
                <define-column label="单号" field="number"></define-column>
                <define-column label="报废类型" field="number"></define-column>
                <define-column label="装备参数" v-slot="{ data }"></define-column>
                <define-column label="装备数量" :filter="(row)=>filterNumber(row)"></define-column>
                <define-column label="操作人员" field="operatorInfo.operator"></define-column>
                <define-column label="报废时间" :filter="(row)=>$filterTime(row.createTime)"/>
            </define-table>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import textInput from '@/componentized/textBox/textInput.vue'
    import defineInput from '@/componentized/textBox/defineInput.vue'
    import bosTabs from '@/componentized/table/bosTabs.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import divTmp from '@/componentized/divTmp'
    import {scarpsOrders} from "api/operation"

    export default {
        components: {
            myHeader,
            textInput,
            defineInput,
            baseButton,
            baseSelect,
            dateSelect,
            entityInput,
            divTmp,
            bosTabs,
        },
        data() {
            return {
                list: [],
                paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0, abnormal: false},
                params: {size: 10, page: 1, category: 4},
            }
        },
        methods: {
            selRow() {

            },
            toDetail(data) {
                this.$router.push({path: 'scrapOrderDetails', query: {id: data.id}})
            },
            fetchData() {
                scarpsOrders(this.params).then(res => {
                    this.list = res.content
                    this.fixData()
                })
            },
            filterNumber(data) {
                return data.scrapItems.length
            },
            changePage(page) {
                this.paginator.page = page;
                ss
            },
            fixData() {
                this.list.forEach(item => {
                    if (item.category === 0) {
                        item.category = '维修报废'
                    }
                    if (item.category === 1) {
                        item.category = '到期报废'
                    }
                    if (item.category === 2) {
                        item.category = '盘点报废'
                    }
                    if (item.equipItems.length !== 0) {
                        if (item.equipItems.length === 1) {
                            item.equipArgs = item.equipItems[0].equipName + '(' + item.scrapItems[0].equipModel + ')'
                        } else {
                            item.equipArgs = item.equipItems[0].equipName + '(' + item.scrapItems[0].equipModel + ')' + '...'
                        }
                    }
                })
            }
        },
    }
</script>
<style lang="scss" scoped>
    .opening-box {
        font-size: 16px;
        width: 100%;
        min-height: 4.4323rem;

        .btn_box {
            padding: 16px 7px;

        }

        .data-list {
            padding: 0 10px;
            margin-top: 30px;
            height: "2.8648rem";
            // border:1px solid rgba(112, 112, 112, 0.13)
        }

        .span-box {
            display: flex;
            justify-content: space-between;
        }
    }

</style>