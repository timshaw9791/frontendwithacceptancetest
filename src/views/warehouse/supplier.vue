<template>
    <div class="supplier">
        <el-card shadow="never">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <div class="secondaryTitle">
                    <el-button type="text" class="_textBt" @click="addChanger('新增供应商')">
                        <svg-icon icon-class="加"/>
                        新增供应商
                    </el-button>
                    <div class="_buttons">
                        <BosInput
                                placeholder="供应商/联系人/联系方式"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="true"
                                style=" width:285px;">
                        </BosInput>
                    </div>
                </div>


                <el-table :data="list" v-loading.body="loading" element-loading-text="Loading"
                          fit>
                    <bos-table-column lable="供应商" field="name"></bos-table-column>
                    <bos-table-column lable="联系人" field="person"></bos-table-column>
                    <bos-table-column lable="联系方式" field="phone"></bos-table-column>
                    <el-table-column label="操作" align="center" width="200px">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="addChanger('修改供应商',scope.row)">编辑</el-button>
                            <el-button type="danger" size="mini" @click="delList(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <bos-paginator v-if="this.list!=''" :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
            </div>
        </el-card>

        <field-dialog :title="title" ref="dialog" @confirm="dialogConfirm">
            <form-container ref="inlineForm" :model="inlineForm">
                <field-input v-model="inlineForm.name" label="供应商" width="5"
                             :rules="r(true).all(R.require)" prop="name"
                ></field-input>
                <br/>
                <field-input v-model="inlineForm.person" label="联系人" width="5"
                             :rules="r(true).all(R.require)" prop="person"
                ></field-input>
                <br/>
                <field-input v-model="inlineForm.phone" label="联系方式" width="5"
                             :rules="r(true).all(R.mobile)" prop="phone"
                ></field-input>
            </form-container>
        </field-dialog>

        <servicedialog title="提示" ref="dialog1" @confirm="submit1">
            <div class="_dialogDiv">
                您确定要删除此条供应商吗!?
            </div>
        </servicedialog>

    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinTableRest';
    import { getSuppliers, modifySupplier, deleteSupplier } from "api/warehouse"
    import api from 'gql/warehouse.gql'
    import servicedialog from 'components/base/serviceDialog'

    export default {
        data() {
            return {
                title: '',
                inlineForm: {},
                list: [],
                inquire: '',
                delId: '',
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                loading: true
            }
        },
        mixins: [formRulesMixin],
        watch: {
            inquire(newVal, oldVal) {
                this.getSupplierList()
            }
        },
        methods: {
            getSupplierList() {
                let params = {page: this.paginator.page, size: this.paginator.size, search: this.inquire};
                this.loading = true
                getSuppliers(params).then(res => {
                    let result = JSON.parse(JSON.stringify(res))
                    this.loading = false
                    this.list = result.content
                    this.paginator.totalPages = res.totalPages
                    this.paginator.totalElements = res.totalElements
                }).catch(e => {
                    this.loading = false
                })
            },
            changePage(page) {
                this.paginator.page = page
                this.getSupplierList()
            },
            dialogConfirm() {
                let obj = JSON.parse(JSON.stringify(this.inlineForm))
                this.$refs.inlineForm.restValidate(modifySupplier, obj, res => {
                    this.$message.success(`${this.title}成功`)
                    this.$refs.dialog.hide()
                    this.paginator.page = 1
                    this.getSupplierList()
                })

                // this.$refs.inlineForm.gqlValidate(api.suppliers_saveSupplier, {
                //     supplier: this.inlineForm
                // }, (res) => {
                //     console.log(res);
                //     this.callback(`${this.title}成功!`);
                //     this.$refs.dialog.hide();
                // })
            },
            addChanger(title, row) {
                this.title = title;
                if (title.includes('修改')) {
                    this.inlineForm = JSON.parse(JSON.stringify(row));
                } else {
                    this.inlineForm = {};
                }

                this.$refs.dialog.show();
            },
            delList(row) {
                this.$refs.dialog1.show();
                this.delId = row.id;
            },
            submit1() {
                deleteSupplier(this.delId).then(res => {
                    this.$message.success("删除成功");
                    this.$refs.dialog1.hide();
                    this.paginator.page = 1;
                    this.getSupplierList()
                }).catch(err => {
                    this.$message.error(err.response.data.message)
                    this.$refs.dialog1.hide()
                    
                })
                // this.gqlMutate(api.suppliers_deleteSupplier, {supplierId: this.delId}, (res) => {
                //     this.$refs.dialog1.hide();
                //     this.callback(`删除成功!`);
                // })
            }
        },
        components: {
            servicedialog
        },
        created() {
            this.getSupplierList()
        },

    }
</script>

<style lang="scss" scoped>
    .supplier {
        font-size: 0.0833rem;
    }

    .secondaryTitle {
        position: relative;
        border-bottom: 1px solid #EBEEF5;
        display: flex;
        align-items: center;
        padding-bottom: 16px;
        height: 0.2292rem;
    }

    .el-card {
        border: none !important;
    }
</style>