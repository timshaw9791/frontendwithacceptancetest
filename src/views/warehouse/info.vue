<template>
    <div>
        <el-card shadow="never" v-if="!equipShow">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <tabs>
                    <tab-select :options="selectList" indexDefault="全部" @selected="selectValue"></tab-select>
                    <div class="_buttons">
                        <BosInput
                                placeholder="类型/类别/名称/型号/供应商"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="true"
                                style=" width:285px;">
                        </BosInput>
                    </div>
                </tabs>
                <el-table :data="list" v-loading.body="$apollo.queries.list.loading" element-loading-text="Loading"
                          fit>

                    <bos-table-column lable="装备类型" field="category.genre.name"></bos-table-column>
                    <bos-table-column lable="装备类别" field="category.name"></bos-table-column>
                    <bos-table-column lable="装备名称" field="name"></bos-table-column>
                    <bos-table-column lable="装备型号" field="model"></bos-table-column>
                    <bos-table-column lable="供应商" field="supplier.name"></bos-table-column>
                    <el-table-column label="操作" align="center" width="200">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="goInfo(scope.row)">查 看</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
            </div>
        </el-card>

        <equip :equipArgId="equipId" :title="title" v-if="equipShow"
               @black="black"></equip>

    </div>
</template>

<script>

    import tabs from 'components/base/tabs/index'
    import {formRulesMixin} from 'field/common/mixinComponent';
    import api from 'gql/warehouse.gql'
    import {transformMixin} from 'common/js/transformMixin'
    import {retirementApplication} from "api/operation";
    import tabSelect from 'components/base/tabs-select'
    import equip from 'views/equipment/storageInfo'


    export default {

        data() {
            return {
                param: {
                    "qfilter": {
                        "key": "category.genre.name",
                        "operator": "LIKE",
                        "value": "%%",
                    }
                },
                selectList: [{label: '全部', value: '全部'}],
                equipId: '',
                title: '',
                equipShow: false,
                inquire: '%%',
            }
        },
        methods: {
            selectValue(data) {
                console.log(data);
            },
            black(data) {
                this.equipShow = false;
                this.refetch();
            },
            goInfo(data) {
                this.equipId = data.id;
                this.title = '装备信息查看';
                this.equipShow = true;
            }
        },
        apollo: {
            list() {
                return this.getEntityListWithPagintor(api.getEquipArgList);
            },
        },
        mixins: [formRulesMixin, transformMixin],

        components: {
            equip,
            tabs,
            tabSelect
        },
        watch: {
            inquire(newVal, oldVal) {
                this.param['qfilter'] = {
                    "combinator": "OR",
                    "key": "category.genre.name",
                    "operator": "LIKE",
                    value: newVal,
                    "next": {
                        "combinator": "OR",
                        "key": "category.name",
                        "operator": "LIKE",
                        value: newVal,
                        "next": {
                            "combinator": "OR",
                            "key": "name",
                            "operator": "LIKE",
                            value: newVal,
                            "next": {
                                "combinator": "OR",
                                "key": "model",
                                "operator": "LIKE",
                                value: newVal,
                                "next": {
                                    "combinator": "OR",
                                    "key": "supplier.name",
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
    .el-card {
        border: none !important;
    }

</style>