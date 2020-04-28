<template>
    <div>
        <div class="receive-order-list-container">
            <text-input label="领取单号" placeholder="请输入单号"></text-input>
            <base-button label="查询"></base-button>
            <base-button label="新增装备参数" @click="goto()"></base-button>
        </div>
        <define-table :data="list" @changePage="changePage" :pageInfo="pageInfo">
            <define-column label="操作" v-slot="{data}">
                <span @click="goto('edit',data.row.id)" style="margin:8px">编辑</span>
            </define-column>
            <define-column label="装备名称" field="name"></define-column>
            <define-column label="装备型号" field="model"></define-column>
            <define-column label="供应商" field="supplier.name"></define-column>
        </define-table>
    </div>
</template>

<script>
    import myHeader from '@/components/base/header/header'
    import {listMixin} from "../../../field/mixins/listMixin"
    import {getReceiveOrderList} from "@/api/RROApi";
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
                pageInfo: {page: 1, size: 10, totalPages: 1, totalElements: 0, search: ''},
            }
        },
        methods: {
            changePage(page) {
                this.pageInfo.page = page;
                this.getList();
            },
            fetchData() {
                getReceiveOrderList(this.pageInfo).then(res=>{
                    this.list = res.content
                })
            },
            goto(id) {
                this.$router.push({
                    path: "equipArgsEdit",
                    query: id
                })
            }
        }
    }
</script>

<style scoped>
    .receive-order-list-container {
        font-size: 16px;
    }
</style>