<template>
    <view-container>
        <tool-bar>
            <base-button size="default" align="right" label="新增预案" @click="dialogShow('add','')"></base-button>
        </tool-bar>
        <bos-tabs  :option="['contrast']" :layoutRatio="[75,25]" :contrastKey="['slot1', 'slot2']" :header="false">
            <define-table  slot="slot1" :pageInfo="paginator" @changePage="changePage" :data="order"
                          @changeCurrent="changeCurrent">
                <define-column label="操作" v-slot="{ data }">
                    <i class=" iconfont iconbianji" @click="dialogShow('edit',data.row)" style="margin:8px"></i>
                    <i class=" iconfont iconshanchu" @click="deleteplan(data.row)" style="margin:8px"></i>
                </define-column>
                <define-column label="预案名称" field="name"></define-column>
                <define-column label="预案描述" field="remark"></define-column>
            </define-table>
            <define-table :haveIndex="false"  slot="slot2" :havePage="false" :data="equipArg" height="878px">
                <define-column label="装备参数" field="equipArg" v-slot="{data}">
                    <entity-input v-model="data.row.equipArg" format="{name}({model})" :tableEdit="false"
                                  :options="{}"></entity-input>
                </define-column>
            </define-table>
        </bos-tabs>
    </view-container>
</template>

<script>
    import myHeader from "components/base/header/header";
    import baseButton from "@/componentized/buttonBox/baseButton";
    import entityInput from "@/componentized/entity/entityInput";
    import defineInput from '@/componentized/textBox/defineInput'
    import bosTabs from "@/componentized/table/bosTabs";
    import serviceDialog from "components/base/serviceDialog"
    import {getPlan, addPlan, updatePlan, delectPlan} from "api/plan";

    var _ = require("lodash");
    export default {
        name: "consumable",
        data() {
            return {
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
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
                getPlan(this.paginator).then(res => {
                    this.order = res.content
                    this.paginator.totalPages = res.totalPages;
                    this.paginator.totalElements = res.totalElements;
                    if (this.order.length != 0) {
                        this.equipArg = this.order[0].equipArgItems
                    } else {
                        this.equipArg = []
                    }
                })
            },
            deleteplan(data) {
                delectPlan(data.id).then(res => {
                    this.$message.success("删除成功")
                    this.fetchData()
                }).catch(err => {
                    this.$message.errow(err.message)
                })
            },
            changePage(page) {
                this.paginator.page = page
                this.fetchData()
            },
            changeCurrent(current) {
                this.equipArg = current.current.equipArgItems
            },
            dialogShow(data, item) {
                if (data == "add") {
                    this.editflag = false
                } else if (data == "edit") {
                    this.editflag = true
                }
                this.$router.push({
                    name: 'editplan',
                    query: {type: 'editplan', info: {data: item.id, edit: this.editflag}}
                })
            },
        },
        created() {
            this.fetchData()
        },
        components: {
            myHeader,
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
