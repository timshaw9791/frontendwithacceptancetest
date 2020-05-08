<template>
    <div class="inventory--list-container">
        <my-header title="装备盘点列表"></my-header>
        <div class="header">
            <base-button @click="goto()" label="开始盘点"></base-button>
        </div>
        <div class="body">
            <define-table :data="list" :pageInfo="paginator">
                <define-column label="操作" v-slot="{data}">
                    <span @click="goto(data.row.id)">详情</span>
                </define-column>
                <define-column label="单号"></define-column>
                <define-column label="应盘点总数"></define-column>
                <define-column label="已盘点总数"></define-column>
                <define-column label="未知装备数"></define-column>
                <define-column label="盘点人员"></define-column>
                <define-column label="盘点时间"></define-column>
            </define-table>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import {listTableMixin} from '../../../field/mixins/listMixin.js'
    import {inventoryOrder} from "@/api/inventory"

    export default {
        name: "inventory",
        components: {
            myHeader,
            listTableMixin
        },
        data() {
            return {
                list: [],
                paginator:{page: 1, size: 10, totalElements: 0, totalPages: 0, search: ''}
            }
        },

        mixins:[listTableMixin],

        methods: {
            fetchData(){
                inventoryOrder('get', this.paginator).then(res => {
                    this.list = res.content
                    this.paginator.totalPages = res.totalPages
                    this.paginator.totalElements = res.totalElements
                })
            },
            goto(id){
                let data = {path:'inventoryInfo'}
                if (id){
                    data.id = id
                }
                this.$router.push(data)
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
