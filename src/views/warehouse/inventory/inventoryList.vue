<template>
    <div class="inventory--list-container">
        <my-header title="装备盘点列表"></my-header>
        <div class="header">
            <base-button @click="goto()" label="开始盘点"></base-button>
        </div>
        <div class="body">
            <define-table :data="list" :pageInfo="paginator" @changePage="changePage">
                <define-column label="操作" v-slot="{data}">
                    <span @click="goto(data.row.id)">详情</span>
                </define-column>
                <define-column label="单号" field="number"></define-column>
                <define-column label="应盘点总数" field="inventoryCount"></define-column>
                <define-column label="已盘点总数" field="count"></define-column>
                <define-column label="未知装备数" field="notCount"></define-column>
                <define-column label="盘点人员" field="operatorInfo.operator"></define-column>
                <define-column label="盘点时间" field="startTime"></define-column>
            </define-table>
        </div>
        <service-dialog ref="scrapDialog" title="提示" width="3.3021rem" @confirm="dialogSub" :secondary="false"
                        :is-show="isScrapDialog">
            <div>是否需要盘点报废</div>
        </service-dialog>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import {listTableMixin} from '@/field/mixins/listMixin.js'
    import {inventoryOrder} from "@/api/inventory"
    import serviceDialog from '../../../components/base/serviceDialog'

    export default {
        name: "inventory",
        components: {
            myHeader,
            listTableMixin,
            serviceDialog
        },
        data() {
            return {
                list: [],
                paginator: {page: 1, size: 10, totalElements: 0, totalPages: 0, search: ''},
                rfids: [],
                isScrapDialog: false,
                test: 111
            }
        },

        mixins: [listTableMixin],

        methods: {
            fetchData() {
                inventoryOrder('get', this.paginator).then(res => {
                    this.list = res.content
                    this.paginator.totalPages = res.totalPages
                    this.paginator.totalElements = res.totalElements
                    this.fixData()
                })
            },
            fixData() {
                this.list.forEach(item => {
                    item.startTime = this.$filterTime(item.startTime)
                })
            },
            goto(id) {
                this.$router.push({path: 'inventoryInfo', query: {id}})
            },
            changePage() {
                this.paginator.page = page
                this.fetchData()
            },
            dialogSub() {
                this.$router.push({path: 'scrapInfo', query: {category: '2', rfids: this.rfids}})
            }
        },
        mounted() {
            let rfids = this.$route.params.rfids
            if (rfids) {
                this.rfids = rfids
                this.isScrapDialog = true
            }
        }
    }
</script>

<style scoped>
    .inventory--list-container {
        font-size: 16px;
    }

    .header {
        padding: 16px 8px;
    }

</style>
