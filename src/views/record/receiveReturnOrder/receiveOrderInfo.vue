<template>
    <div class="receive-order-info-container">
        <my-header title="领取归还单详情":haveblack="true" @h_black="back" ></my-header>
        <div class="body">
            <define-table :data="list" @changePage="changePage" :pageInfo="pageInfo">
                <define-column label="操作" v-slot="{data}">
                    <span @click="goto(data.row.number)" style="margin:8px">详情</span>
                </define-column>
                <define-column label="装备参数" v-slot="{data}">
                    <entity-input v-model="data.row" form="{equipName}({equipModel})" > </entity-input>
                </define-column>
                <define-column label="供应商" field="supplier.name"></define-column>
                <define-column label="装备名称" field="name"></define-column>
            </define-table>
        </div>
    </div>
</template>

<script>
    import myHeader from '@/components/base/header/header'
    import {listMixin} from "../../../field/mixins/listMixin"
    import {getReceiveOrderList} from "../../../api/RRO";

    export default {
        name: "receiveOrderInfo",
        components: {
            myHeader,
            listMixin
        },
        mixins: [listMixin],
        data() {
            return {
                list: [],
                pageInfo: {},

            }
        },
        methods: {
            changePage(page) {
                this.pageInfo.page = page;
                this.getList();
            },
            fetchData() {
                getReceiveOrderList().then((res)=>{
                    this.list = res
                })
            },
            back(){
                this.$router.back()
            }
        }
    }
</script>

<style scoped>
    .receive-order-container {
        font-size: 16px;
    }
</style>