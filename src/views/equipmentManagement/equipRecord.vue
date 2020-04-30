<template>
    <div>
        <equip equipId="RFKPlwECEu26SwKatEydJ2Equ"></equip>
    </div>
    <!--<div class="app-container">-->
    <!--<form-container :model="param" class="_search">-->
    <!--<field-input class="searchInput" label="搜索关键字" :wrapforlike="true" v-model="param.namelike"></field-input>-->
    <!--<el-button type="primary" style="margin-left: 15px">查询</el-button>-->

    <!--<form-container ref="zbForm" :model="param">-->

    <!--<field-select label="装备状态" v-model="param.reason" width="2.5"-->
    <!--prop="surfaceL"-->
    <!--:list="[{val:'USING',key:'使用中'},{val:'MAINTAIN',key:'装备维修中'},{val:'UPKEEP',key:'装备保养中'},-->
    <!--{val:'SCRAP',key:'装备报废中'},{val:'CHARGE',key:'装备充电中'}]">-->
    <!--</field-select>-->

    <!--</form-container>-->
    <!--</form-container>-->

    <!--<el-table :data="list" class="_list"-->
    <!--fit highlight-current-row>-->
    <!--<bos-table-column lable="编号" field="id"></bos-table-column>-->
    <!--<bos-table-column lable="角色名" field="name"></bos-table-column>-->
    <!--<el-table-column label="操作" align="center" width="200">-->
    <!--<controlComponents slot-scope="scope">-->
    <!--<el-button type="text" size="mini">修改</el-button>-->
    <!--</controlComponents>-->
    <!--</el-table-column>-->
    <!--</el-table>-->

    <!--<bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>-->
    <!--</div>-->

</template>

<script>
    import api from 'gql/equipRecord.gql'
    import {formRulesMixin} from 'field/common/mixinComponent';
    import equip from 'components/equipment/addEquipment'

    export default {
        data() {
            return {
                param: {},
            }
        },
        components: {
            equip
        },
        mixins: [formRulesMixin],
        methods: {}
    }
</script>

<style scoped>

</style>