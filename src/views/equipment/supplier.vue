<template>
    <view-container>
        <tool-bar>
            <base-button slot="button" type="text" label="新增供应商" @click="addChanger('新增供应商')"></base-button>
        </tool-bar>
        <define-table :data="list" :pageInfo="paginator">
            <define-column label="操作" v-slot="{data}">
                <i class="iconfont iconbianji" @click="addChanger(data.row)"></i>
            </define-column>
            <define-column label="供应商名称" field="name"></define-column>
            <define-column label="联系人" field="person"></define-column>
            <define-column label="联系方式" field="phone"></define-column>
        </define-table>
        <service-dialog :title="title" ref="dialog" @firstCancel="cancel" @cancel="cancel" @confirm="dialogConfirm"
                        :secondary="scondary">
            <form-container ref="inlineForm" :model="inlineForm">
                <field-input v-model="inlineForm.name" label="供应商" width="8"
                             :rules="r(true).all(R.require)" prop="name"
                ></field-input>
                <br/>
                <field-input v-model="inlineForm.person" label="联系人" width="8"
                             :rules="r(true).all(R.require)" prop="person"
                ></field-input>
                <br/>
                <field-input v-model="inlineForm.phone" label="联系方式" width="8"
                             :rules="r(true).all(R.mobile)" prop="phone"
                ></field-input>
            </form-container>
        </service-dialog>
    </view-container>
</template>

<script>
    import {formRulesMixin} from '../../field/common/mixinTableRest';
    import serviceDialog from '../../components/base/serviceDialog/index'
    import {getSuppliers, addSupplier, updateSupplier} from "@/api/supplier"
    import myHeader from "../../components/base/header/header"
    import textInput from "../../componentized/textBox/textInput";

    export default {
        data() {
            return {
                title: '',
                inlineForm: {},
                scondary: false,
                editInlineForm: false,
                list: [],
                inquire: '',
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                isEdit: false
            }
        },
        mixins: [formRulesMixin],
        components: {
            serviceDialog,
            myHeader,
            textInput
        },
        methods: {
            getSupplierList() {
                let params = {
                    page: this.paginator.page,
                    size: this.paginator.size,
                    name: this.inquire,
                    direction: "DESC",
                    properties: "updateTime"
                };

                getSuppliers(params).then(res => {
                    this.list = res.content
                    this.paginator.totalPages = res.totalPages
                    this.paginator.totalElements = res.totalElements
                }).catch(e => {

                })
            },
            changePage(page) {
                this.paginator.page = page
                this.getSupplierList()
            },
            dialogConfirm() {
                let obj = JSON.parse(JSON.stringify(this.inlineForm))
                let requestApi = this.title.includes('编辑') ? updateSupplier : addSupplier
                requestApi(this.inlineForm).then(() => {
                    this.$refs.dialog.hide()
                    this.paginator.page = 1
                    this.editInlineForm = false
                    this.scondary = false
                    this.getSupplierList()
                })
            },
            addChanger(row) {
                this.inlineForm = this.isEdit ? JSON.parse(JSON.stringify(row)) : {};

                if (title.includes('编辑')) {
                    this.inlineForm = JSON.parse(JSON.stringify(row));
                } else {
                    this.inlineForm = {};
                }
                this.$refs.dialog.show();
            },
            cancel() {
                this.editInlineForm = false
                this.scondary = false
            }
        },
        watch: {
            inlineForm: {
                handler(bal) {
                    if (this.editInlineForm) {
                        this.scondary = true
                    } else {
                        this.editInlineForm = true
                    }
                },
                deep: true
            },
            inquire(newVal, oldVal) {
                this.getSupplierList()
            }
        },
        created() {
            this.getSupplierList()
        },
    }
</script>

<style lang="scss" scoped>

    .supplier-container {
        color: #707070FF;
        font-size: 16px;
    }

    .supplier-info {
        padding: 16px 7px;
        overflow: hidden;
    }

    .supplier-body {
        padding: 0 17px;
    }
</style>