<template>
    <div class="open-gate-record-container">
        <my-header title="开门记录"></my-header>
        <div class="header">
            <entity-input label="姓名"></entity-input>
        </div>
        <div class="body">
            <define-table :data="list" @changePage="changePage" :pageInfo="paginator">
                <define-column label="操作" v-slot>
                    <span @click="showMonitor">监控</span>
                </define-column>
                <define-column label="操作人员" field="operatorInfo.operator"></define-column>
                <define-column label="开柜时间" field="createTime"></define-column>
            </define-table>
        </div>
    </div>
</template>

<script>
    import myHeader from "../../components/base/header/header"
    import {openGateRecord} from "@/api/openRecord"
    import {listTableMixin} from "../../field/mixins/listMixin";

    export default {
        name: "openGate",
        components: {
            myHeader,
        },
        mixins: [listTableMixin],
        data() {
            return {
                list: [],
                paginator: {page: 1, size: 10, totalPages: 0, totalElements: 0, search: ''},
            }
        },
        methods: {
            fetchData() {
                openGateRecord().then((res) => {
                    this.list = res.content
                    this.paginator.totalPages = res.totalPages
                    this.paginator.totalElements = res.totalElements
                    this.fixData()
                })
            },
            fixData() {
                this.list.forEach(item => {
                    item.createTime = this.$filterTime( item.createTime)
                })
            },
            showMonitor(){

            }
        },
    }
</script>

<style scoped>
    .open-gate-record-container {
        font-size: 16px;
    }

    .header {
        padding: 16px 7px;
    }
</style>