<template>
    <div>
        <el-card shadow="never">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <div class="secondaryTitle">
                    <div class="_buttons">
                        <BosInput
                                placeholder="装备/序号/编号/AB面"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="true"
                                style=" width:285px;">
                        </BosInput>
                    </div>
                </div>


                <el-table :data="list" v-loading.body="$apollo.queries.list.loading" element-loading-text="Loading"
                          fit>
                    <bos-table-column lable="装备类型" field="name"></bos-table-column>
                    <bos-table-column lable="装备类别" field="person"></bos-table-column>
                    <bos-table-column lable="装备名称" field="phone"></bos-table-column>
                    <bos-table-column lable="装备型号" field="phone"></bos-table-column>
                    <bos-table-column lable="供应商" field="phone"></bos-table-column>
                    <bos-table-column lable="数量" field="phone"></bos-table-column>
                    <el-table-column label="操作" align="center" width="200">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="addChanger('修改供应商',scope.row)">编辑</el-button>
                            <el-button type="danger" size="mini">删除</el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
            </div>
        </el-card>

        <field-dialog :title="title" ref="dialog" @confirm="dialogConfirm">
            <form-container ref="inlineForm" :model="inlineForm">
                <field-input v-model="inlineForm.name" label="供应商" width="4"
                             :rules="r(true).all(R.require)" prop="name"
                ></field-input>
                <br/>
                <field-input v-model="inlineForm.person" label="联系人" width="4"
                             :rules="r(true).all(R.require)" prop="person"
                ></field-input>
                <br/>
                <field-input v-model="inlineForm.phone" label="联系方式" width="4"
                             :rules="r(true).all(R.require)" prop="phone"
                ></field-input>
            </form-container>
        </field-dialog>


    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinComponent';
    import api from 'gql/warehouse.gql'


    export default {
        data() {
            return {
                title: '',
                inlineForm: {},
                inquire: '',
                param: {}
            }
        },
        mixins: [formRulesMixin],
        apollo: {
            list() {
                return this.getEntityListWithPagintor(api.getSupplierList);
            },
        },
        methods: {
            dialogConfirm() {
                this.$refs.inlineForm.gqlValidate(api.suppliers_saveSupplier, {
                    supplier: this.inlineForm
                }, (res) => {
                    console.log(res);
                    this.callback(`${this.title}成功!`);
                    this.$refs.dialog.hide();
                })
            },
            addChanger(title, row) {
                this.title = title;
                if (title.includes('修改')) {
                    this.inlineForm = JSON.parse(JSON.stringify(row));
                } else {
                    this.inlineForm = {};
                }

                this.$refs.dialog.show();
            }
        },

    }
</script>

<style lang="scss" scoped>
    .secondaryTitle {
        position: relative;
        border-bottom: 1px solid #EBEEF5;
        display: flex;
        align-items: center;
        padding-bottom: 16px;
        height: 44px;
    }

    .el-card {
        border: none !important;
    }
</style>