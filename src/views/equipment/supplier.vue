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
                                placeholder="供应商"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="true"
                                style=" width:285px;">
                        </BosInput>
                    </div>
                </div>
                <el-table :data="list" v-loading.body="false" element-loading-text="Loading"
                          fit height="3.64rem">
                    <bos-table-column lable="供应商" field="name"></bos-table-column>
                    <bos-table-column lable="联系人" field="person"></bos-table-column>
                    <bos-table-column lable="联系方式" field="phone"></bos-table-column>
                    <el-table-column label="操作" align="center" width="200px">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="addChanger('编辑供应商信息',scope.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <bos-paginator v-if="this.list!=''" :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
            </div>
        </el-card>

        <service-dialog :title="title" ref="dialog" @confirm="dialogConfirm">
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

        <!-- <field-dialog :title="title" ref="dialog" @confirm="dialogConfirm">
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
        </field-dialog> -->
    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinTableRest';
    import serviceDialog from 'components/base/serviceDialog/index'
    import { supplierFindByName, saveSupplier, updateSupplier } from "api/equip"

    export default {
        data() {
            return {
                title: '',
                inlineForm: {},
                list: [],
                inquire: '',
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                loading: true
            }
        },
        mixins: [formRulesMixin],
        components: {
            serviceDialog
        },
        watch: {
            inquire(newVal, oldVal) {
                this.getSupplierList()
            }
        },
        methods: {
            getSupplierList() {
                let params = {page: this.paginator.page, size: this.paginator.size, name: this.inquire, direction: "DESC",properties: "updateTime"};
                this.loading = true
                supplierFindByName(params).then(res => {
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
                this.$refs.inlineForm.restValidate(this.title.includes('编辑')?updateSupplier:saveSupplier, obj, res => {
                    this.$message.success(`${this.title}成功`)
                    this.$refs.dialog.hide()
                    this.paginator.page = 1
                    this.getSupplierList()
                })
            },
            addChanger(title, row) {
                this.title = title;
                if (title.includes('编辑')) {
                    this.inlineForm = JSON.parse(JSON.stringify(row));
                } else {
                    this.inlineForm = {};
                }
                this.$refs.dialog.show();
            }
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