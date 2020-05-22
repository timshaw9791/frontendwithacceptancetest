<template>
    <div class="new-proess-container">
        <my-header title="新建流程" :haveBlack="false"></my-header>
        <div class="new-process-body">
            <define-table :data="list" height="600px" :pageInfo="paginator" @changePage="changePage"
                          :highLightCurrent="true">
                <define-column label="操作" v-slot="{ data }">
                    <i class="iconfont iconjiahao" @click="apply(data.row)"></i>
                </define-column>
                <define-column label="工作流名称" field="name"></define-column>
                <define-column label="部署时间" :filter="(row)=>$filterTime(row.deploymentTime)"></define-column>
            </define-table>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import {processDefinitions} from 'api/process'
    import bosTabs from '@/componentized/table/bosTabs'
    import {listTableMixin} from "../../field/mixins/listMixin";

    export default {
        name: 'newProcess',
        mixins: [listTableMixin],
        data() {
            return {
                list: [],
                paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0}
            }
        },
        methods: {
            fetchData() {
                processDefinitions().then(res => {
                    this.list = res
                })
            },
            apply(data) {
                this.$router.push({
                    path: `${data.key}` + 'Apply',
                    query: {
                        name: `${data.name}`,
                        key: `${data.key}`,
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
            listTableMixin
        }
    }
</script>

<style scoped>
    .new-proess-container {
        font-size: 16px;
    }

    .new-process-body {
        padding: 0 17px;
    }
</style>