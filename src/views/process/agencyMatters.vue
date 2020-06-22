<template>
    <view-container>
        <define-table :data="list" height="928px" :pageInfo="paginator" @changePage="changePage">
            <define-column label="操作" width="100" v-slot="{ data }">
                <i class="iconfont iconxiangqing" @click="toDetail(data.row)"></i>
            </define-column>
            <define-column label="请求标题" field="processInstanceName"></define-column>
            <define-column label="任务名称" field="name"></define-column>
            <define-column label="创建时间" :filter="(row)=>$filterTime(row.createTime)"></define-column>
        </define-table>
    </view-container>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import {todoTask} from '@/api/process'

    export default {
        name: "agencyMatters",
        components: {
            myHeader
        },
        data() {
            return {
                list: [],
                paginator: {
                    page: 1,
                    size: 10,
                    totalElements: 0,
                    totalPages: 0,
                    assignee: JSON.parse(localStorage.getItem('user')).id
                }
            }
        },
        methods: {
            getList() {
                todoTask(this.paginator).then(res => {
                    this.list = res.content;
                    this.paginator.totalElements = res.totalElements;
                    this.paginator.totalPages = res.totalPages;
                })
            },
            changePage(page) {
                this.paginator.page = page;
                this.getList();
            },
            toDetail(data) {
                console.log(data)
                let applyName = data.processInstanceName.includes('报废') ? 'scrap' : 'allocate'
                this.$router.push({
                    path: `/process/${applyName}Apply`,
                    query: {
                        name: data.processInstanceName,
                        processInstanceId: data.processInstanceId,
                        type: 'todo',
                    }
                })
            }
        },
        created() {
            this.getList();
        }
    }
</script>

<style lang="scss" scoped>
    .agency-matters {
        width: 100%;
        color: #707070FF;
        font-size: 16px;
    }

    .agency-metters-top {
        padding: 16px 7px;
        overflow: hidden;
    }

    .agency-matters_main_box {
        padding: 0 17px;
    }
</style>