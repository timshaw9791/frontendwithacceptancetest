<template>
    <div>
        <el-table :data="list" v-loading.body="$apollo.queries.list.loading" element-loading-text="Loading"
                  fit highlight-current-row>
            <bos-table-column lable="装备名" field="name"></bos-table-column>
            <bos-table-column lable="装备序号" field="serial"></bos-table-column>
            <bos-table-column lable="架体编号" field="location.number"></bos-table-column>
            <bos-table-column lable="架体AB面"
                              :filter="(row)=>surface(row.location?row.location.surface:'暂无')"></bos-table-column>
            <bos-table-column lable="充电周期" field="equipArg.chargeCycle"></bos-table-column>

        </el-table>

        <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
    </div>

</template>

<script>

    import {formRulesMixin} from 'field/common/mixinComponent';
    import api from 'gql/operation.gql'
    import {transformMixin} from 'common/js/transformMixin'

    export default {
        data() {
            return {
                param: {
                    qfilter: {
                        "key": "state",
                        "operator": "EQUEAL",
                        "value": "CHARGE"
                    },
                },
            }
        },
        apollo: {
            list() {
                return this.getEntityListWithPagintor(api.getEquipList);
            },
        },
        mixins: [formRulesMixin, transformMixin],
    }

</script>

<style scoped>

</style>