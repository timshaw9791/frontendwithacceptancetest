<template>
    <view-container>
        <tool-bar>
            <base-button slot="button" type="text" label="新增供应商" @click="edit()"></base-button>
        </tool-bar>
        <define-table :data="list" :pageInfo="paginator">
            <define-column label="操作" v-slot="{data}">
                <i class="iconfont iconbianji" @click="edit(data.row)"></i>
            </define-column>
            <define-column label="供应商名称" field="name"></define-column>
            <define-column label="联系人" field="person"></define-column>
            <define-column label="联系方式" field="phone"></define-column>
        </define-table>
        <service-dialog :title="dialogTitle" ref="dialog" @cancel="cancel" @confirm="dialogConfirm"
                        :secondary="scondary">
            <!-- <form-container ref="inlineForm" :model="inlineForm">
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
            </form-container> -->
            <define-form ref="form" class="form">
                <define-input label="供应商" valid :required="true"  v-model="inlineForm.name" style="width:500px"></define-input><br/>
                <define-input label="联系人" valid :required="true" v-model="inlineForm.person" style="width:500px;margin:10px 0 10px 0"></define-input><br/>
                <define-input label="联系方式" valid :required="true" v-model="inlineForm.phone" style="width:500px"></define-input>
            </define-form>
        </service-dialog>
    </view-container>
</template>

<script>
    import {formRulesMixin} from '@/field/common/mixinTableRest';
    // import serviceDialog from '@/components/base/serviceDialog/index'
    import {getSuppliers, addSupplier, updateSupplier} from "@/api/supplier"
    import myHeader from "@/components/base/header/header"
    import textInput from "@/componentized/textBox/textInput";

    export default {
        data() {
            return {
                dialogTitle: '新增供应商',
                inlineForm: {},
                scondary: false,
                editInlineForm: false,
                list: [],
                inquire: '',
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
            }
        },
        mixins: [formRulesMixin],
        components: {
            // serviceDialog,
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
                })
            },
            changePage(page) {
                this.paginator.page = page
                this.getSupplierList()
            },
            dialogConfirm() {
                this.$refs.form.validate((valid) => {
                    if(valid){
                        let requestApi = this.dialogTitle.includes('编辑') ? updateSupplier : addSupplier
                        requestApi(this.inlineForm).then(() => {
                            this.$refs.dialog.hide()
                            this.paginator.page = 1
                            this.editInlineForm = false
                            this.scondary = false
                            this.getSupplierList()
                        })
                    }
                })
                // let requestApi = this.dialogTitle.includes('编辑') ? updateSupplier : addSupplier
                // requestApi(this.inlineForm).then(() => {
                //     this.$refs.dialog.hide()
                //     this.paginator.page = 1
                //     this.editInlineForm = false
                //     this.scondary = false
                //     this.getSupplierList()
                // })
            },
            edit(row) {
                if (!!row) {
                    this.inlineForm = JSON.parse(JSON.stringify(row));
                    this.dialogTitle = '编辑供应商'
                }
                this.$refs.dialog.show();
            },
            cancel() {
                this.editInlineForm = false
                this.scondary = false
                this.inlineForm = {}
                this.dialogTitle = '新增供应商'
            }
        },
        watch: {
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
    .form {
        text-align: center;
    }
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