<template>
    <div class="receive-order-list-container">
        <my-header title="领取归还单列表"></my-header>
        <div class="header">
            <text-input label="领取单号" placeholder="请输入单号"></text-input>
            <base-button label="查询"></base-button>
        </div>
        <define-table :data="list" @changePage="changePage" :pageInfo="paginator">
            <define-column label="操作" v-slot="{data}">
                <span @click="goto(data.row.openImg)" style="margin:8px">图片</span>
            </define-column>
            <define-column label="单号" field="number"></define-column>
            <define-column label="装备参数" field="allEquipArgs"></define-column>
            <define-column label="装备数量" field="equipCount"></define-column>
            <define-column label="操作人员" field="operatorInfo.operator"></define-column>
            <define-column label="操作时间" field="createTime"></define-column>
            <define-column label="类型" field="category"></define-column>
        </define-table>
    </div>
</template>

<script>
    import myHeader from '@/components/base/header/header'
    import {listMixin} from "../../../field/mixins/listMixin"
    import {getReceiveOrderList} from "@/api/RRO";

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
                paginator: {page: 1, size: 10, totalPages: 1, totalElements: 0, search: ''},
            }
        },
        methods: {
            changePage(page) {
                this.paginator.page = page;
                this.fetchData();
            },
            fetchData() {
                getReceiveOrderList(this.paginator).then(res => {
                    this.fixData(res.content)
                })
            },
            fixData(data) {
                data.forEach(item => {
                    item.category = item.category === 6 ? '领取' : '归还';
                })
                this.list = data;
                //累加装备参数
                this.list.forEach(item => {
                    let equipNameList = []
                    item.receiveReturnItems.forEach(item => {
                        equipNameList.push(item.equipName + "(" + item.equipModel + ")")
                    })
                    //除重
                    equipNameList = this._.union(equipNameList)
                    console.log(equipNameList)
                    // 显示参数名称
                    item.allEquipArgs = equipNameList.length > 1 ? equipNameList[0]+"..." : equipNameList[0]
                    //计算装备数量
                    item.equipCount = item.receiveReturnItems.length
                    //时间戳转日期
                    item.createTime = this.$filterTime(parseInt(item.createTime))
                })
            },
            goto(id) {
                this.$router.push({
                    path: "RROInfo",
                    query: {
                        id: id
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .receive-order-list-container {
        font-size: 16px;
    }

    .header {
        padding: 16px 7px;
    }
</style>