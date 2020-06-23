<template>
    <view-container>
        <define-table :data="listData" height="3.64rem" @changePage="changePage" :pageInfo="paginator">
            <define-column label="操作" width="130" v-slot="{ data }">
                <base-button label="详情" size="mini" @click="toDetail(data.row)" type="primary"></base-button>
            </define-column>
            <define-column label="单号" v-slot="{ data }">
                <define-input v-model="data.row.number" type="Number" :tableEdit="false"></define-input>
            </define-column>
            <define-column label="装备参数" v-slot="{ data }">
                <define-input v-model="data.row.equipArgs" type="Number" :tableEdit="false"></define-input>
            </define-column>
            <define-column label="装备数量" :filter="(row)=>filterNumber(row)"></define-column>
            <define-column label="操作人员" v-slot="{ data }">
                <define-input v-model="data.row.operatorInfo.operator" type="String" :tableEdit="false"></define-input>
            </define-column>
            <define-column label="维修结束时间" :filter="(row)=>$filterTime(row.createTime)"/>
        </define-table>
    </view-container>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import defineInput from '@/componentized/textBox/defineInput.vue'
    import bosTabs from '@/componentized/table/bosTabs.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import {serviceOrders} from "api/operation"

    export default {
        components: {
            myHeader,
            defineInput,
            baseButton,
            baseSelect,
            dateSelect,
            entityInput,
            bosTabs,
        },
        data() {
            return {
                listData: [],
                paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0, abnormal: false, category: 5},
            }
        },
        methods: {
            toDetail(data) {
                this.$router.push({name: 'serviceDetails', query: {id: data.id, title: '维修归还单/维修归还单详情'}})
            },
            changePage(page) {
                this.paginator.page = page;
                this.fetchData();
            },
            fetchData() {
                serviceOrders(this.paginator).then(res => {
                    this.listData = res.content
                    this.paginator.totalPages = res.totalPages
                    this.paginator.totalElements = res.totalElements
                    for (let elem of this.listData.values()) {//处理装备参数显示格式
                        elem.equipArgs = elem.equipRepairItems.length == 1 ? `${elem.equipRepairItems[0].equipName}(${elem.equipRepairItems[0].equipModel})` :
                            `${elem.equipRepairItems[0].equipName}(${elem.equipRepairItems[0].equipModel})...`
                    }
                })
            },
            filterNumber(data) {
                return data.equipRepairItems.length
            },
        },
        created() {
            this.fetchData()
        }
    }
</script>
<style lang="scss" scoped>

</style>