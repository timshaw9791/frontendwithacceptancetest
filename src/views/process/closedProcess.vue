<template>
    <view-container>
        <define-table :data="list" height="928px" :pageInfo="paginator" @changePage="changePage">
            <define-column label="操作" width="100" v-slot="{ data }">
                <i class="iconfont iconxiangqing" @click="toDetail(data.row)"></i>
            </define-column>
            <define-column label="请求标题" field="name"></define-column>
            <define-column label="工作流" field="type"></define-column>
            <define-column label="申请时间" :filter="(row)=>$filterTime(row.createTime)"></define-column>
        </define-table>
    </view-container>
</template>

<script>
    import myHeader from '@/components/base/header/header'
    import {doneProcess} from '@/api/process'

    export default {
        name: "closedProcess", //办结事宜
        components: {
            myHeader
        },
        data() {
            return {
                paginator: {
                    page: 1,
                    size: 10,
                    totalElements: 0,
                    totalPages: 0,
                    startUserId: JSON.parse(localStorage.getItem('user')).id
                },
                list: []
            }
        },
        methods: {
            getList() {
                doneProcess(this.paginator).then(res => {
                    this.list = res.content;
                    this.paginator.totalElements = res.totalElements;
                    this.paginator.totalPages = res.totalPages;
                })
            },
            toDetail(data) {
                let applyName = data.type.includes('报废') ? 'scrap' : 'allocate'
                this.$router.push({
                    path: `/process/${applyName}Apply`,
                    query: {
                        name: data.type,
                        processInstanceId: data.processInstanceId,
                        taskId: data.taskId
                    }
                })
            },
            changePage(page) {
                this.paginator.page = page;
                this.getList();
            }
        },
        created() {
            this.getList();
        }
    }
</script>

<style lang="scss" scoped>
    .handling-matters {
        width: 100%;
        color: #707070FF;
        font-size: 16px;
    }

    .handling-matters-top {
        padding: 16px 7px;
        overflow: hidden;
    }

    .handling-matters-body {
        padding: 0 17px;
    }
</style>