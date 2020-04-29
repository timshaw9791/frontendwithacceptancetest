<template>
    <div class="receive-order-list-container">
        <my-header title="领取归还单详情"></my-header>
        <div class="header">
            <text-input label="领取单号" placeholder="请输入单号"></text-input>
            <base-button label="查询"></base-button>
        </div>
        <define-table :data="list" @changePage="changePage" :pageInfo="pageInfo">
            <define-column label="操作" v-slot="{data}">
                <span @click="goto('edit',data.row.id)" style="margin:8px">编辑</span>
            </define-column>
            <define-column label="单号" field="number"></define-column>
            <define-column label="装备参数" field="allArgs"></define-column>
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
                allEquipArgs:""
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
                    this.fixData()
                    console.log(this.list)
                })
            },
            fixData(){
                //累加装备参数
                this.list.forEach(item => {
                    item.allArgs = item.receiveReturnItems.reduce((accumulator, currentValue)=>
                        accumulator+currentValue.equipName+"("+currentValue.equipModel+")"+" "
                    ,"")
                    // TODO 长度过长变成...
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