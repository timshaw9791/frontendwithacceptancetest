<template>
    <div>
        <el-card shadow="never">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <tabs :list="tabsList" :indexDefault="0" @selected="selected">
                    <el-button type="text" class="_textBt" @click="scrapped">
                        <svg-icon icon-class="加"/>
                        添加报废
                    </el-button>
                    <div class="_buttons">
                        <el-input
                                placeholder="装备名"
                                suffix-icon="el-icon-search"
                                style=" width:285px;">
                        </el-input>
                    </div>
                </tabs>
                <el-table :data="list" fit v-loading="loading">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <bos-table-column lable="申请ID" field="id"></bos-table-column>
                    <bos-table-column lable="申请类型" field="name"></bos-table-column>
                    <bos-table-column lable="申请装备" field="name"></bos-table-column>
                    <bos-table-column lable="申请人" field="name"></bos-table-column>
                    <bos-table-column lable="申请时间" field="name"></bos-table-column>
                    <bos-table-column lable="审批状态" field="name"></bos-table-column>
                    <el-table-column label="操作" align="center" width="200">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="$router.push('/process/bill')">查 看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
            </div>
        </el-card>

        <serviceDialog title="报废申请" ref="dialog" width="60%">
            <form-container ref="inlineForm" :model="inlineForm">
                <field-input v-model="inlineForm.username" label="编号" width="2.5"></field-input>
                <field-input v-model="inlineForm.username" label="申请人" width="2.5"></field-input>
                <field-input v-model="inlineForm.username" label="申请时间" width="2.5"></field-input>

                <field-input v-model="inlineForm.username" label="审核人" width="2.5"
                             :rules="r(true).all(R.require)" prop="username"></field-input>
                <field-input v-model="inlineForm.username" label="申请原因" width="10" type="textarea"
                             :rules="r(true).all(R.require)" prop="username"></field-input>

            </form-container>

            <el-table :data="list">
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
    import serviceDialog from 'components/base/serviceDialog'


    export default {
        data() {
            return {
                tabsList: ['全部', '未审批', '已通过', '已驳回'],
                list: [{id: 1, name: '恢复上市的风格化'}, {id: 2, name: 'wdnm'}],
                inlineForm: {},
            }
        },
        methods: {
            selected(data) {
                console.log(data);
            },
            scrapped() {
                this.$refs.dialog.show();
            }
        },

        mixins: [formRulesMixin],

        components: {
            equip,
            tabs,
            serviceDialog
        }
    }
</script>

<style lang="scss" scoped>
    .el-card {
        border: none !important;
    }

</style>