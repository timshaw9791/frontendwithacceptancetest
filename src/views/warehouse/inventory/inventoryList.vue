<template>
    <view-container>
        <tool-bar>
            <base-button slot="button" type="text" @click="goto()" label="开始盘点"></base-button>
        </tool-bar>
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
        <service-dialog ref="scrapDialog" title="提示" width="3.3021rem" @confirm="dialogSub" :secondary="false"
                        :is-show="isScrapDialog">
            <div>是否需要盘点报废</div>
        </service-dialog>
    </view-container>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import {listTableMixin} from '@/field/mixins/listMixin.js'
    import {getInventoryOrderList} from "@/api/inventory"
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
                getInventoryOrderList('get', this.paginator).then(res => {
                    if (res.content){
                        this.list = res.content
                        this.paginator.totalPages = res.totalPages
                        this.paginator.totalElements = res.totalElements
                        this.fixData()
                    }
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
        created() {
            // 是否有rfid需要报废
            this.rfids = this.$route.params.rfids
            if (this.rfids) {
                this.isScrapDialog = true
            }
        }
    }
</script>

<style scoped>

</style>
