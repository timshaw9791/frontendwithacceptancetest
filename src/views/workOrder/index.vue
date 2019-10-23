<template>
    <div>
        <!--<equip equipId="RFKPlwECEu26SwKatEydJ2Equ"></equip>-->
        <!--<equip commonHouseId='VVNFISXOHOK9KSRt_brNy3Com' equipId='fXzyf6vaFtWQDBh5EGp0n0Equ'></equip>-->
        <el-card shadow="never">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <tabs :list="tabsList" :indexDefault="1" @selected="selected">
                    <div class="_buttons">
                        <el-input
                                placeholder="请选择日期"
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
                    <bos-table-column lable="id" field="id"></bos-table-column>
                    <bos-table-column lable="姓名" field="name"></bos-table-column>
                    <el-table-column label="操作" align="center" width="200">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="">查 看</el-button>
                            <el-button type="danger" size="mini" @click="">重 填</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
            </div>
        </el-card>

    </div>
</template>

<script>
    import equip from 'components/equipment/addEquipment'
    import tabs from 'components/base/tabs/index'
    import {formRulesMixin} from 'field/common/mixinComponent';

    export default {
        data() {
            return {
                tabsList: ['已提交', '已失效'],
                list: []
            }
        },
        methods: {
            selected(data) {
                console.log(data);
            }
        },

        mixins: [formRulesMixin],

        components: {
            equip,
            tabs
        }
    }
</script>

<style lang="scss" scoped>
    .el-card {
        border: none !important;
    }


</style>