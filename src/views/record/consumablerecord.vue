<template>
    <view-container>
        <define-table :pageInfo="paginator" @changePage="changePage" :data="order" height="4rem">
            <define-column label="操作" v-slot="{data}">
                <base-button label="详情" @click="click(data.row)"></base-button>
            </define-column>
            <define-column label="单号" field="number"></define-column>
            <define-column label="耗材名称" field="name"></define-column>
            <define-column label="耗材数量" field="count"></define-column>
            <define-column label="类型" field="category"></define-column>
            <define-column label="操作人员" field="operatorInfo.operator"></define-column>
            <define-column label="操作时间" v-slot="{data}">
                <date-select v-model="data.row.createTime" :disabled="true"></date-select>
            </define-column>
        </define-table>
    </view-container>
</template>

<script>
    import baseButton from "@/componentized/buttonBox/baseButton";
    import {consumableRecordList} from "api/consumable";
    import dateSelect from '@/componentized/textBox/dateSelect.vue'

    var _ = require("lodash");
    export default {
        name: "consumablerecord",
        data() {
            return {
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                order: [],
            };
        },
        methods: {
            fetchData() {
                consumableRecordList(this.paginator).then(res => {
                    this.order = res.content
                    this.paginator.totalPages = res.totalPages;
                    this.paginator.totalElements = res.totalElements;
                    this.order.forEach(item => {
                        if (item.category == 0) {
                            item.category = "领取单"
                        } else if (item.category == 1) {
                            item.category = "补充单"
                        }
                        item.name = item.consumableItems.length == 1 ? item.consumableItems[0].name : item.consumableItems[0].name + '...'
                        item.count = 0
                        item.consumableItems.forEach(it => {
                            item.count += it.count
                        })
                    })
                })
            },
            changePage(page) {
                this.paginator.page = page
                this.fetchData()
            },
            click(data) {
                this.$router.push({
                    name: "consumablerecordInfo",
                    query: {info: data.id}
                })
            }
        },
        created() {
            this.fetchData()
        },
        components: {
            baseButton,
            dateSelect,
        },
    };
</script>

<style lang="scss" scoped>

</style>
