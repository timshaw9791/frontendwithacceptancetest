<template>
    <view-container>
        <define-table :data="myProcessList" height="928px" :pageInfo="paginator" @changePage="changePage">
            <define-column label="操作" width="100" v-slot="{ data }">
                <i class="iconfont iconxiangqing" @click="toDetail(data.row)"></i>
            </define-column>
            <define-column label="请求标题" field="name"></define-column>
            <define-column label="工作流" field="type"></define-column>
            <define-column label="创建时间" :filter="(row)=>$filterTime(row.createTime)"></define-column>
            <define-column label="当前节点" field="taskName"></define-column>
            <define-column label="未操作者" field="userName"></define-column>
        </define-table>
    </view-container>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import {myProcess} from '@/api/process'
    import {listTableMixin} from "@/field/mixins/listMixin";
    import {mapGetters} from "vuex";

    export default {
        name: "myProcess",
        data() {
            return {
                requestTitle: "",
                paginator: {
                    size: 10,
                    page: 1,
                    totalElements: 0,
                    totalPages: 0,
                    direction: 'DESC',
                    startUserId: JSON.parse(localStorage.getItem('user')).id
                },
                select: {
                    processList: [],
                    selected: "", // 选择结果
                },
                myProcessList: [],
                edit: true
            }
        },
        mixins: [listTableMixin],
        methods: {
            fetchData() {
                myProcess(this.paginator).then(res => {
                    this.myProcessList = res.content;
                    this.paginator.totalElements = res.totalElements;
                    this.paginator.totalPages = res.totalPages;
                })
            },
            changePage(page) {
                this.paginator.page = page;
                this.fetchData();
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
            }
        },
        computed: {
            search() {
                return this.requestTitle + this.select.selected
            },
            ...mapGetters(["userId"])
        },
        components: {
            myHeader
        },
    }
</script>

<style lang="scss" scoped>

</style>