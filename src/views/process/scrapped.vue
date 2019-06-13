<template>
    <div>
        <el-card shadow="never">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <tabs :list="tabsList" :indexDefault="0">
                    <el-button type="text" class="_textBt" @click="scrapped">
                        <svg-icon icon-class="加"/>
                        添加报废
                    </el-button>
                    <div class="_buttons">
                        <BosInput
                                placeholder="id"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="true"
                                style=" width:285px;">
                        </BosInput>
                    </div>
                </tabs>

                <el-table :data="list" v-loading.body="$apollo.queries.list.loading" element-loading-text="Loading"
                          fit highlight-current-row>

                    <bos-table-column lable="申请ID" field="id"></bos-table-column>
                    <bos-table-column lable="申请类型" :filter="(row)=>applicationType(row.scrapType)"></bos-table-column>
                    <bos-table-column lable="申请装备" :filter="(row)=>equipment(row.equipScrapItems)"></bos-table-column>
                    <bos-table-column lable="申请人" field="operator"></bos-table-column>
                    <bos-table-column lable="申请时间" :filter="(row)=>formatTime(row.time)"></bos-table-column>
                    <bos-table-column lable="审批状态" :filter="(row)=>approval(row.scrapType)"></bos-table-column>
                    <el-table-column label="操作" align="center" width="200">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini"
                                       @click="$router.push({path:'/process/bill',query:{id:scope.row.id}})">查 看
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
            </div>
        </el-card>

        <serviceDialog title="报废申请" ref="dialog" width="60%">
            <form-container ref="inlineForm" :model="inlineForm">
                <!--<field-input v-model="inlineForm.username" label="编号" width="2.5"></field-input>-->
                <!--<field-input v-model="inlineForm.username" label="申请人" width="2.5"></field-input>-->
                <!--<field-input v-model="inlineForm.username" label="申请时间" width="2.5"></field-input>-->
                <!--<field-input v-model="inlineForm.username" label="审核人" width="2.5"-->
                <!--:rules="r(true).all(R.require)" prop="username"></field-input>-->

                <field-input v-model="inlineForm.username" label="申请原因" width="10" type="textarea"
                             :rules="r(true).all(R.require)" prop="username"></field-input>

            </form-container>

            <el-table :data="dialogList" class="list">
                <bos-table-column lable="序号" field="id"></bos-table-column>
                <bos-table-column lable="装备名称" field="name"></bos-table-column>
                <bos-table-column lable="装备序号" field="name"></bos-table-column>
                <bos-table-column lable="架体编号" field="name"></bos-table-column>
                <bos-table-column lable="架体AB面" field="name"></bos-table-column>
            </el-table>
        </serviceDialog>


    </div>
</template>

<script>
    import equip from 'components/equipment/addEquipment'
    import tabs from 'components/base/tabs/index'
    import {formRulesMixin} from 'field/common/mixinComponent';
    import {transformMixin} from "common/js/transformMixin";
    import serviceDialog from 'components/base/serviceDialog'
    import api from 'gql/process.gql'

    export default {
        data() {
            return {
                tabsList: [],
                list: [],
                inlineForm: {},
                dialogList: [],
                inquire: '',
                param: {
                    qfilter: {
                        "key": "id",
                        "operator": "LIKE",
                        value: '%%',
                    }
                },
            }
        },
        methods: {
            scrapped() {
                this.$refs.dialog.show();
            },
            approval(data) {
                return '已通过';
            },
            equipment(data) {
                let newData = [];
                newData = data.map(res => {
                    return res.name
                });

                return newData.join(',')
            },
        },
        apollo: {
            list() {
                return this.getEntityListWithPagintor(api.getEquipScrapedRecordList);
            },
        },


        mixins: [formRulesMixin, transformMixin],

        components: {
            equip,
            tabs,
            serviceDialog
        },
        watch: {
            inquire(newVal, oldVal) {
                this.param['qfilter'] = {
                    "key": "id",
                    "operator": "LIKE",
                    value: newVal,
                };
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-card {
        border: none !important;
    }

    .list {
        border: 1px solid #EBEEF5;
        border-bottom: none !important;
        width: 100%;
    }

</style>