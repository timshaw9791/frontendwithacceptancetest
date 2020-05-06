<template>
    <div class="receive-order-list-container">
        <my-header title="领取归还单列表"></my-header>
        <div class="header">
            <text-input label="领取单号" placeholder="请输入单号"></text-input>
            <base-button label="查询"></base-button>
        </div>
        <define-table :data="list" @changePage="changePage" :pageInfo="pageInfo">
            <define-column label="操作" v-slot="{data}">
                <span @click="goto(data.row.id)" style="margin:8px">详情</span>
            </define-column>
            <define-column label="单号" field="number"></define-column>
            <define-column label="装备参数" field="allEquipArgs"></define-column>
            <define-column label="装备数量" field="equipCount"></define-column>
            <define-column label="操作人员" field="operatorInfo.operator"></define-column>
            <define-column label="操作时间" :filter="row=>millToTime(row.createTime)"></define-column>
            <!--<define-column label="领取时间" v-slot="{data}">
                <date-select  v-model="data.row.createTime" :disabled="true" :column="24"></date-select>
            </define-column>-->
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
                pageInfo: {page: 1, size: 10, totalPages: 1, totalElements: 0, search: ''},
            }
        },
        methods: {
            changePage(page) {
                this.pageInfo.page = page;
                this.fetchData();
            },
            fetchData() {
                getReceiveOrderList(this.pageInfo).then(res => {
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
                    item.allEquipArgs = equipNameList.reduce((v, k) => v + k + " ", "")
                    //计算装备数量
                    item.equipCount = item.receiveReturnItems.length
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
            millToTime(mill) {
                var oDate = new Date(mill),
                    oYear = oDate.getFullYear(),
                    oMonth = oDate.getMonth() + 1,
                    oDay = oDate.getDate(),
                    oHour = oDate.getHours(),
                    oMin = oDate.getMinutes(),
                    oSen = oDate.getSeconds();
                return oYear + '-' + this.addZero(oMonth) + '-' + this.addZero(oDay) + ' ' + this.addZero(oHour) + ':' +
                    this.addZero(oMin) + ':' + this.addZero(oSen);
            },
            //补零操作
            addZero(num) {
                if (parseInt(num) < 10) {
                    num = '0' + num;
                }
                return num;
            }
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