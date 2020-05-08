<template>
    <div class="open-cabinet-record-container">
        <my-header title="开柜记录"></my-header>
        <div class="header">
            <entity-input label="警柜"></entity-input>
        </div>
        <div class="body">
            <define-table :data="list" @changePage="changePage">
                <define-column label="图片" v-slot="{ data }" >
                    <img class="img" :src="data.row.openImg" alt="暂无图片"/>
                </define-column>
                <define-column label="操作人员" field="operatorInfo.operator"></define-column>
                <define-column label="开柜时间" field="createTime"></define-column>
                <define-column label="警柜类型" field="policeCabinet.category"></define-column>
                <define-column label="警柜编号" field="policeCabinet.cabinetNumber"></define-column>
            </define-table>
        </div>
    </div>
</template>

<script>
    import myHeader from "../../components/base/header/header"
    import {openCabinetRecord} from "@/api/openrecord"
    import {imgBaseUrl} from "@/api/config"
    import {listTableMixin} from "../../field/mixins/listMixin"

    export default {
        name: "openCabinet",
        components: {
            myHeader,
            listTableMixin
        },
        mixins:[listTableMixin],
        data() {
            return {
                list: [],
                pageInfo: {page: 1, size: 1, totalPages: 1, totalElements: 0, search: ''},
            }
        },
        methods: {
            fetchData() {
                openCabinetRecord().then((res) => {
                    this.list = res.content
                    this.fixData()
                })
            },
            fixData() {
                // COMMON_CABINET(公共柜, 0)  SPARE_CABINET(备用柜, 1) SINGLE_POLICE(单警柜, 2)
                this.list.forEach(item => {
                    item.createTime = this.$filterTime(item.createTime)
                    item.openImg = imgBaseUrl + item.openImg
                    switch (item.policeCabinet.category) {
                        case 0:{
                            item.policeCabinet.category = '公共柜'
                            break
                        }
                        case 1:{
                            item.policeCabinet.category = '备用柜'
                            break
                        }
                        case 2:{
                            item.policeCabinet.category = '单警柜'
                            break
                        }
                    }
                })
            },
        },
        created() {
            this.fetchData()
        }
    }
</script>

<style scoped>

    .open-cabinet-record-container {
        font-size: 16px;
    }

    .header {
        padding: 16px 7px;
    }

    .img{
        width: 30px;
        height: 30px;
    }
</style>