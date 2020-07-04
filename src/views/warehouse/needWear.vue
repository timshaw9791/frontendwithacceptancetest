<template>
    <view-container>
        <tool-bar>
            <base-button type="text" slot="button" label="新增必戴装备" @click="dialogShow('add')"></base-button>
        </tool-bar>
        <bos-tabs  :option="['contrast']" :layoutRatio="[75,25]" :contrastKey="['slot1', 'slot2']" :header="false">
            <define-table  slot="slot1" :pageInfo="paginator" @changePage="changePage" :data="order"
                          @changeCurrent="changeCurrent">
                <define-column label="操作" v-slot="{ data }">
                    <i class=" iconfont iconbianji" @click="dialogShow('edit',data.row)" style="margin:8px"></i>
                    <i class=" iconfont iconshanchu" @click="deletePlan(data.row)" style="margin:8px"></i>
                </define-column>
                <define-column label="必戴装备名称" field="name"></define-column>
            </define-table>
            <define-table :haveIndex="false"  slot="slot2" :havePage="false" :data="equipArg" >
                <define-column label="装备参数" field="describes" v-slot="{data}">
                    <entity-input v-model="data.row" format="{name}({model})" :tableEdit="false"
                                  :options="{}"></entity-input>
                </define-column>
            </define-table>
        </bos-tabs>
    </view-container>
</template>

<script>
    import baseButton from "@/componentized/buttonBox/baseButton";
    import entityInput from "@/componentized/entity/entityInput";
    import defineInput from '@/componentized/textBox/defineInput'
    import bosTabs from "@/componentized/table/bosTabs";
    import serviceDialog from "components/base/serviceDialog"
    import {getWearRates, deleteWearRates} from "api/operation";

    var _ = require("lodash");
    export default {
        name: "consumable",
        data() {
            return {
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5, search: ''},
                order: [],
                equipArg: [],
                plan: {
                    name: "",
                    remark: "",
                    equipArgItems: [],
                },
                editflag: false,
            };
        },
        methods: {
            fetchData() {
                getWearRates(this.paginator).then(res => {
                    this.order = res.content
                    this.paginator.totalPages = res.totalPages;
                    this.paginator.totalElements = res.totalElements;
                    if (this.order.length != 0) {
                        this.equipArg = this.order[0].equipArgs
                    } else {
                        this.equipArg = []
                    }
                })
            },
            deletePlan(data) {
                deleteWearRates(data.id).then(res => {
                    this.$message.success("删除成功")
                    this.equipArg = []
                    this.fetchData()
                })
            },
            changePage(page) {
                this.paginator.page = page
                this.fetchData()
            },
            changeCurrent(current) {
                this.equipArg = current.current.equipArgs
            },
            dialogShow(data, item) {
                if (data === "edit") {
                    this.editflag = true
                    this.plan = item
                }
                this.$router.push({
                    name: 'addneedwear',
                    params: {type: 'addneedwear', info: {data: this.plan, edit: this.editflag}}
                })
            },
        },
        created() {
            this.fetchData()
        },
        components: {
            baseButton,
            entityInput,
            bosTabs,
            defineInput,
            serviceDialog,
        },
    };
</script>

<style lang="scss" scoped>
</style>
