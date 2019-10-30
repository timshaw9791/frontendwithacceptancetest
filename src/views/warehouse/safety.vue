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
                                placeholder="名称/型号/大类/小类"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="true"
                                style="width:285px;">
                        </BosInput>
                    </div>
                </div>


                <el-table :data="list" v-loading.body="$apollo.queries.list.loading" element-loading-text="Loading"
                          fit>
                    <bos-table-column lable="装备类型" field="equipArg.category.name"></bos-table-column>
                    <bos-table-column lable="装备小类" field="equipArg.category.genre.name"></bos-table-column>
                    <bos-table-column lable="装备名称" field="equipArg.name"></bos-table-column>
                    <bos-table-column lable="装备型号" field="equipArg.model"></bos-table-column>
                    <bos-table-column lable="供应商" field="equipArg.supplier.name"></bos-table-column>
                    <bos-table-column lable="数量" field="count"></bos-table-column>

                    <el-table-column label="操作" align="center" width="300">
                        <template slot-scope="scope">
                            <el-button type="text" class="_textBt" style="vertical-align: middle;"
                                       @click="dialogShow(scope.row)">
                                <svg-icon icon-class="编辑"/>
                                标准库存 :
                            </el-button>
                            <el-input size="mini" v-model="scope.row.safeStock" :disabled="true"
                                      style="width: 60px"></el-input>
                        </template>
                    </el-table-column>

                </el-table>
                <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
            </div>
        </el-card>

        <serviceDialog title="提示" ref="dialogButton" @confirm="submit" :secondary="false">
            <div class="_dialogDiv">
                <form-container ref="inlineForm" :model="inlineForm">
                    <field-input v-model="inlineForm.safeStock" label="标准库存" width="3"
                                 :rules="r(true).all(R.integer)" prop="safeStock"></field-input>
                </form-container>
            </div>
        </serviceDialog>
    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinComponent';
    import api from 'gql/warehouse.gql'
    import serviceDialog from 'components/base/serviceDialog'


    export default {
        data() {
            return {
                title: '',
                inlineForm: {},
                inquire: '',
                param: {
                    "qfilter": {
                        "key": "equipArg.category.genre.name",
                        "operator": "LIKE",
                        "value": "%%",
                    }
                }
            }
        },
        components: {
            serviceDialog
        },
        mixins: [formRulesMixin],
        apollo: {
            list() {
                console.log("this.getEntityListWithPagintor(api.getHouseStockList)")
                console.log(this.getEntityListWithPagintor(api.getHouseStockList))
                return this.getEntityListWithPagintor(api.getHouseStockList);
            },
        },
        methods: {
            submit() {
                console.log(this.inlineForm.safeStock);
                this.$refs.inlineForm.gqlValidate(api.house_changeSafeSock, {
                    safeSock: this.inlineForm.safeStock,
                    houseEquipArgId: this.inlineForm.id,
                }, (res) => {
                    console.log(res);
                    this.$refs.dialogButton.hide();
                    this.callback('修改成功!');
                })
            },

            dialogShow(data) {
                console.log(data);
                this.inlineForm.id = data.id;
                this.$set(this.inlineForm, 'safeStock', data.safeStock);
                this.$refs.dialogButton.show();
            }
        },

        watch: {
            inquire(newVal, oldVal) {
                this.param.namelike = newVal;
                this.param['qfilter'] = {
                    "combinator": "OR",
                    "key": "equipArg.category.genre.name",
                    "operator": "LIKE",
                    value: newVal,
                    "next": {
                        "combinator": "OR",
                        "key": "equipArg.category.name",
                        "operator": "LIKE",
                        value: newVal,
                        "next": {
                            "combinator": "OR",
                            "key": "equipArg.name",
                            "operator": "LIKE",
                            value: newVal,
                            "next": {
                                "combinator": "OR",
                                "key": "equipArg.model",
                                "operator": "LIKE",
                                value: newVal,
                                "next": {
                                    "combinator": "OR",
                                    "key": "equipArg.supplier.name",
                                    "operator": "LIKE",
                                    value: newVal,
                                }
                            }
                        }
                    }
                }
            }
        }

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