<template>
    <div class="safety">
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


                <el-table :data="list" v-loading.body="false" element-loading-text="Loading"
                        fit height="3.75rem">
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
                <bos-paginator v-if="this.list!=''" :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
            </div>
        </el-card>

        <serviceDialog title="提示" ref="dialogButton" @confirm="submit" :secondary="false">
            <div class="_dialogDiv">
                <form-container ref="inlineForm" :model="inlineForm">
                    <field-input v-model="inlineForm.safeStock" label="标准库存" width="5"
                                 :rules="r(true).all(R.integer)" prop="safeStock"></field-input>
                </form-container>
            </div>
        </serviceDialog>
    </div>
</template>

<script>
    import {formRulesMixin} from 'field/common/mixinTableRest';
    import api from 'gql/warehouse.gql'
    import serviceDialog from 'components/base/serviceDialog'
    import { getHouseStocks, setSafeStock } from "api/warehouse"


    export default {
        data() {
            return {
                title: '',
                inlineForm: {},
                inquire: '',
                list: [],
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
            }
        },
        components: {
            serviceDialog
        },
        mixins: [formRulesMixin],
        methods: {
            getHouseStocksList() {
                let params = {page: this.paginator.page, size: this.paginator.size, search: this.inquire};
                getHouseStocks(params).then(res => {
                    let result = JSON.parse(JSON.stringify(res));
                    this.paginator.totalPages = res.totalPages
                    this.paginator.totalElements = res.totalElements
                    this.list = res.content
                })
            },
            changePage(data) {
                this.paginator.page = data;
                this.getHouseStocksList()
            },
            submit() {
                console.log(this.inlineForm.safeStock);
                this.$refs.inlineForm.restValidate(setSafeStock, {
                    safeStock: this.inlineForm.safeStock,
                    equipArgId: this.inlineForm.id,
                }, res => {
                    console.log(res);
                    this.$refs.dialogButton.hide();
                    this.$message.success('修改成功!')
                    this.getHouseStocksList()
                })
            },

            dialogShow(data) {
                console.log(data);
                this.inlineForm.id = data.equipArg.id;
                this.$set(this.inlineForm, 'safeStock', data.safeStock);
                this.$refs.dialogButton.show();
            }
        },
        mounted() {
            this.getHouseStocksList()
        },
        watch: {
            inquire(newVal, oldVal) {
                this.getHouseStocksList()
            }
        }

    }
</script>

<style lang="scss" scoped>
    .safety {
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