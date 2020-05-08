<template>
    <div class="receive-order-info-container">
        <my-header title="领取归还单详情" :have-black="true" @h_black=back></my-header>
        <div class="header">
            <entity-input label="单号" v-model="info.number" :disabled="true"></entity-input>
            <entity-input label="操作人员" v-model="info.operatorInfo.operator" :disabled="true"></entity-input>
            <date-select label="操作时间" v-model="info.createTime" :disabled="true" ></date-select>
            <entity-input label="类型" v-model="info.category" :disabled="true"></entity-input>
        </div>
        <div class="body">
            <bos-tabs>
                <template slot="total">
                    <define-table :data="equipArgsItems" @changeCurrent="changeCurrent" :highLightCurrent="true">
                        <define-column label="装备参数" v-slot="{data}">
                            <entity-input v-model="data.row" format="{equipName}({equipModel})" :disabled="true"></entity-input>
                        </define-column>
                        <define-column label="装备数量" v-slot="{data}">
                            <entity-input v-model="data.row" format="{count}" :disabled="true"></entity-input>
                        </define-column>
                    </define-table>
                </template>
                <template slot="detail">
                    <define-table :data="equipItems" >
                        <define-column label="RFID" field="rfid"></define-column>
                        <define-column label="装备序号" field="equipSerial"></define-column>
                    </define-table>
                </template>
            </bos-tabs>
        </div>
    </div>
</template>

<script>
    import myHeader from '@/components/base/header/header'
    import {listMixin} from "../../../field/mixins/listMixin"
    import BosTabs from "../../../componentized/table/bosTabs";
    import {getBosEntity} from "@/api/basic"

    export default {
        name: "receiveOrderInfo",
        components: {
            BosTabs,
            myHeader,
            listMixin,
        },
        mixins: [listMixin],
        data() {
            return {
                info: {
                    operatorInfo: {
                        operator: ""
                    }
                },
                equipArgsItems: [],
                equipItems:[]
            }
        },
        methods: {
            fetchData() {
                if (this.$route.query.id !== "") {
                    getBosEntity(this.$route.query.id).then(res => {
                        this.info = res
                        this.fixData()
                    });
                }
            },
            fixData() {
                let equipItems = this._.groupBy(this.info.receiveReturnItems, item => `${item.equipModel}${item.equipModel}`)
                //类型修改
                this.info.category=this.info.category === 6 ?'领取':'归还'
                //根据
                this.equipArgsItems = this._.map(equipItems, (item) => {
                    console.log("item")
                    console.log(item)
                    return {
                        equipName: item[0].equipName,
                        equipModel: item[0].equipModel,
                        copyItems: item,
                        count: item.length
                    }
                })
            },
            changeCurrent(data){
                this.equipItems = data.current.copyItems
            },
            back() {
                this.$router.back()
            }
        },

    }
</script>

<style scoped>
    .receive-order-info-container {
        font-size: 16px;
    }

    .header {
        padding: 16px 8px;
    }
</style>