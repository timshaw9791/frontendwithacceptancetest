<template>
    <div class="list">
        <div style="width: 20%">
            <el-tree :data="data" default-expand-all :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
        <div style="width: 100%">
            <div style="text-align: center">
                <span>{{tableTitle}}</span>
            </div>

            <el-table :data="list" class="_list" v-loading.body="$apollo.queries.list.loading" element-loading-text="Loading"
                      fit highlight-current-row>
                <bos-table-column lable="id" field="id"></bos-table-column>
                <bos-table-column lable="姓名" field="username"></bos-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
        </div>
    </div>
</template>

<script>
    import api from 'gql/list.gql';

    export default {
        data() {
            return {
                param: {
                    id: '',
                },
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                value: true,
                tableTitle: '',
            }
        },
        props: {
            id: {
                type: String,
                default: null,
            },
        },
        apollo: {
            list() {
                return this.getEntityQuery(api.getUserList);
            },
        },
        mixins: [historyPageMixin],
        mounted() {
            this.getList();
        },
        methods: {
            handleNodeClick(data) {
                console.log(data.id);
                this.param.id = data.id;
                this.tableTitle = data.name;
            },
            loop(list) {
                list.forEach(item => {
                    item['label'] = JSON.parse(JSON.stringify(item.name));
                    if (item.organUnitSet) {
                        item['children'] = JSON.parse(JSON.stringify(item.organUnitSet));
                        this.loop(item.children);
                    }
                    delete item['organUnitSet'];
                })
            },
            getList() {
                this.gqlQuer(api.getOrganUnitListList, {}, (res) => {
                    this.data = JSON.parse(JSON.stringify(res.data.OrganUnitList.content));
                    this.loop(this.data);
                    console.log(this.data);
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .list {
        display: flex;
    }
</style>
