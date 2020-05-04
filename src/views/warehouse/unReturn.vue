<template>
    <div class="un-return-container">
        <my-header title="未归还"></my-header>
        <div class="header">
            <entity-input label="装备名称" ></entity-input>
        </div>
        <div class="body">
            <define-table :data="list">
                <define-column label="装备参数" v-slot="{data}">
                    <entity-input v-model="data.row" format="{equipName}({model})" :disabled="true"></entity-input>
                </define-column>
                <define-column label="RFID" field="rfid"></define-column>
                <define-column label="装备序号" field="serial"></define-column>
                <define-column label="领取人员" field="operator"></define-column>
                <define-column label="领取时间" field="createTime"></define-column>
            </define-table>
        </div>
    </div>
</template>

<script>
    import myHeader from '@/components/base/header/header'
    import {listMixin} from "../../field/mixins/listMixin"
    import BosTabs from "../../componentized/table/bosTabs";
    import {unReturn} from "@/api/unReturnEquips"

    export default {
        name: "receiveOrderInfo",
        components: {
            BosTabs,
            myHeader,
            listMixin
        },
        mixins: [listMixin],
        data() {
            return {
                list:
                    [
                        {
                            createTime: "1",
                            equipName: "警棍",
                            model: "HD-1",
                            operator: "管理员",
                            rfid: "111111",
                            serial: "22234"
                        }
                    ]
            }
        },
        methods: {
            // fetchData() {
            //     unReturn().then(res => {
            //         this.list = res.content
            //     });
            // },
        }
    }
</script>

<style scoped>
    .un-return-container {
        font-size: 16px;
    }

    .header {
        padding: 16px 8px;
    }
</style>