<template>
    <div class="handling-matters">
        <my-header :title="'办结事宜'" :searchFlag="false"></my-header>
        <div class="handling-matters-top" data-test="action_box">
            <define-input label="请求标题" v-model="paginator.search" placeholder="请输入标题"></define-input>
            <base-button label="查询" @click="getList()"></base-button>
        </div>
        <div class="handling-matters-body" data-test="main_box">
             <div class="table_box" data-test="table_box">
                 <define-table :data="list" height="3.6458rem" :pageInfo="paginator" @changePage="changePage">
                     <define-column label="序号" columnType="index" width="65"></define-column> 
                     <define-column label="操作" width="100" v-slot="{ data }">
                        <i class="iconfont iconxiangqing" @click="toDetail(data.row)"></i>
                    </define-column>
                    <define-column label="请求标题" field="name"></define-column>
                    <define-column label="工作流" field="operate"></define-column>
                    <define-column label="申请时间" :filter="(row)=>$filterTime(row.startTime)"></define-column>
                    <define-column label="当前节点" field="currentTask.name"></define-column>
                    <define-column label="未操作者" field="currentTask.assigneeName"></define-column>
                 </define-table>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import defineInput from '@/componentized/textBox/defineInput.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import {doneProcess} from 'api/process'
    export default {
        name: "handlingMatters",
        components:{
            myHeader,defineInput,baseButton
        },
        data(){
            return{
                paginator: {page: 1, size: 10, totalElements: 0, totalPages: 0, search: '', startUserId: JSON.parse(localStorage.getItem('user')).id},
                list: []
            }
        },
        methods:{
           getList() {
               doneProcess(this.paginator).then(res => {
                   this.list = res.content;
                   this.paginator.totalElements = res.totalElements;
                   this.paginator.totalPages = res.totalPages;
               })
           },
           toDetail(data) {
               if(data.processInstanceName.includes("调拨")){
                    console.log("调拨");
                    this.$router.push({
                        name: 'transferDetail',
                        params: {type:'transfer', audit: 'order', info: {processInstanceId: data.processInstanceId, taskId: data.taskId, operate: false}}
                    })
                } else if(data.processInstanceName.includes("报废")){
                    this.$router.push({
                        name: 'applyAudit',
                        params: {type:'apply', audit: 'order', info: {processInstanceId: data.processInstanceId, taskId: data.taskId, operate: false}}
                    })
                }
           },
           changePage(page) {
               this.paginator.page = page;
               this.getList();
           }
        }
    }
</script>

<style lang="scss" scoped>
    .handling-matters{
        width: 100%;
        color:#707070FF;
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