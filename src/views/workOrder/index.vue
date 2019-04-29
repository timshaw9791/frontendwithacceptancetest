<template>
    <div>
        <!--<equip equipId="RFKPlwECEu26SwKatEydJ2Equ"></equip>-->
        <!--<equip commonHouseId='VVNFISXOHOK9KSRt_brNy3Com' equipId='fXzyf6vaFtWQDBh5EGp0n0Equ'></equip>-->

        <!--<el-card shadow="never">-->
            <!--<div slot="header">-->
                <!--<span>{{$route.meta.title}}</span>-->
            <!--</div>-->
            <!--<div>-->
                <!--<tabs :list="tabsList" @selected="selected">-->
                    <!--<div class="_buttons">-->
                        <!--<el-button>取消</el-button>-->
                        <!--<el-button>撤回</el-button>-->
                        <!--<el-button type="primary">批量处理</el-button>-->
                    <!--</div>-->
                <!--</tabs>-->
                <!--<el-table :data="list" fit>-->
                    <!--<el-table-column-->
                            <!--type="selection"-->
                            <!--width="55">-->
                    <!--</el-table-column>-->
                    <!--<bos-table-column lable="id" field="id"></bos-table-column>-->
                    <!--<bos-table-column lable="姓名" field="name"></bos-table-column>-->
                    <!--<el-table-column label="操作" align="center" width="200">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-button type="primary" size="mini" @click="">查 看</el-button>-->
                            <!--<el-button type="danger" size="mini" @click="">重 填</el-button>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                <!--</el-table>-->
                <!--<bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>-->
            <!--</div>-->
        <!--</el-card>-->
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
                list: [{id: 1, name: '恢复上市的风格化'}, {id: 2, name: 'wdnm'}]
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

</style>