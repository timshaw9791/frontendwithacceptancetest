<template>
    <div class="my-process-container">
        <my-header title="我的流程" :haveBlack="false"></my-header>
        <div class="my-process" data-test="action_box">
            <div class="my-process-info">
                <define-input label="请求标题" v-model="requestTitle" placeholder="请输入标题"></define-input>
                <base-select label="流程类型" v-model="select.selected" :selectList="select.processList"></base-select>
                <base-button label="查询" @click="fetchData()"></base-button>
            </div>
            <div class="my-process-body">
                <define-table :data="myProcessList" height="3.6458rem" :pageInfo="paginator" @changePage="changePage">
                    <define-column label="操作" width="100" v-slot="{ data }">
                        <i class="iconfont iconxiangqing" @click="toDetail(data.row)"></i>
                    </define-column>
                    <define-column label="请求标题" field="name"></define-column>
                    <define-column label="工作流" field="type"></define-column>
                    <define-column label="创建时间" :filter="(row)=>$filterTime(row.createTime)"></define-column>
                    <define-column label="当前节点" field="taskName"></define-column>
                    <define-column label="未操作者" field="userName"></define-column>
                </define-table>
            </div>
        </div>
    </div>
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
                let applyName = data.type.includes('报废') ? 'scrap' : 'transfer'
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
    .my-process-container {
        color: #707070FF;
        font-size: 16px;

        .my-process-info {
            padding: 16px 7px;
        }

        .my-process-body {
            padding: 0 17px;
        }
    }
</style>