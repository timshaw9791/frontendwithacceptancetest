<template>
    <view-container>
        <define-table :data="list" height="928px" :pageInfo="paginator" @changePage="changePage"
                      :highLightCurrent="true">
            <define-column label="操作" v-slot="{ data }">
                <i class="iconfont iconjiahao1" @click="toApply(data.row)"></i>
            </define-column>
            <define-column label="工作流名称" field="name"></define-column>
            <define-column label="部署时间" :filter="(row)=>$filterTime(row.deploymentTime)"></define-column>
        </define-table>
    </view-container>
</template>

<script>
    import myHeader from '@/components/base/header/header'
    import {processDefinitions} from '@/api/process'
    import bosTabs from '@/componentized/table/bosTabs'
    import {listTableMixin} from "@/field/mixins/listMixin";

    export default {
        name: 'newProcess',
        mixins: [listTableMixin],
        data() {
            return {
                list: [],
                paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0},
            }
        },
        methods: {
            fetchData() {
                processDefinitions().then(res => {
                    this.list = res
                })
            },
            toApply(data) {
                console.log(data)
                this.$router.push({
                    path: 'allocateApply',
                    query: {
                        name: `${data.name}`, // 流程的名称
                        key: `${data.key}`, // 该值为 processDefinitionKey
                    }
                })
            },
            changePage(page) {
                this.paginator.page = page;
            }
        },
        components: {
            myHeader,
            bosTabs,
            listTableMixin,
        }
    }
</script>

<style scoped>

</style>