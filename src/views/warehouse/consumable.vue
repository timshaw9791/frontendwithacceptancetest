<template>
    <view-container>
        <tool-bar>
            <base-button type="text" slot="button" label="领补耗材" @click="receiceShow()"></base-button>
            <base-button type="text" slot="button" label="新增耗材" @click="operating('add',data)"></base-button>
        </tool-bar>
        <define-table :pageInfo="paginator" @changePage="changePage" :data="order">
            <define-column label="操作" v-slot="{ data }">
                <base-button label="编辑" size="mini" @click="operating('edit',data)" type="primary"></base-button>
            </define-column>
            <define-column label="耗材名称" field="name"></define-column>
            <define-column label="耗材数量" field="count"></define-column>
            <define-column label="耗材用途" field="describes"></define-column>
        </define-table>
        <service-dialog :title="title" ref="operating" :button="true" :secondary="false" @confirm="confirm">
            <define-input label="耗材名称" margin="15px 0 0 0" v-model="consumableName" :column="12"></define-input>
            <define-input label="耗材数量" :disabled="title.includes('编辑')" margin="15px 0 0 0"
                          v-model="consumableCount" :column="12"></define-input>
            <define-input label="耗材用途" margin="15px 0 0 0" v-model="consumableDescribes"
                          :column="12"></define-input>
        </service-dialog>
    </view-container>
</template>

<script>
    import baseButton from "@/componentized/buttonBox/baseButton";
    import defineInput from '@/componentized/textBox/defineInput'
    import serviceDialog from "components/base/serviceDialog"
    import {getConsumableList, addConsumable, editConsumable} from "api/consumable";

    var _ = require("lodash");
    export default {
        name: "consumable",
        data() {
            return {
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                order: [],
                consumableName: "",
                consumableCount: "",
                consumableDescribes: "",
                consumableMark: "",
                consumableId: "",
                title: ""
            };
        },
        methods: {
            fetchData() {
                getConsumableList(this.paginator).then(res => {
                    this.order = res.content
                    this.paginator.totalElements = res.totalElements;
                    this.paginator.totalPages = res.totalPages;
                }).catch(err => {
                    this.$message.error(err.message)
                })
            },
            receiceShow() {
                this.$router.push({name: "warehouse/consumableReceive",})
            },
            changePage(page) {
                this.paginator.page = page
                this.fetchData()
            },
            operating(type, count) {
                if (type == 'edit') {
                    this.consumableId = count.row.id
                    this.consumableName = count.row.name
                    this.consumableCount = count.row.count
                    this.consumableDescribes = count.row.describes
                    this.title = "耗材编辑"
                } else if (type == 'add') {
                    this.consumableId = ""
                    this.consumableName = ""
                    this.consumableCount = 0
                    this.consumableDescribes = ""
                    this.title = "耗材新增"
                }
                this.$refs.operating.show()
            },
            confirm() {
                if (this.title.includes('编辑')) {
                    let param = {
                        name: this.consumableName,
                        describes: this.consumableDescribes,
                        id: this.consumableId
                    }
                    editConsumable(this.consumableId, param).then(res => {
                        this.$message.success("编辑成功")
                        this.fetchData()
                    })
                } else if (this.title.includes('新增')) {
                    let param = {
                        name: this.consumableName,
                        describes: this.consumableDescribes,
                        count: this.consumableCount
                    }
                    addConsumable(param).then(res => {
                        this.$message.success("新增成功")
                        this.fetchData()
                    })
                }
                this.$refs.operating.hide()
            }
        },
        created() {
            this.fetchData()
        },
        components: {
            baseButton,
            defineInput,
            serviceDialog,
        },
    };
</script>

<style lang="scss" scoped>

</style>
