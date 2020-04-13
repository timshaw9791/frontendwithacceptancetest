<template>
    <div class="my-process-container">
        <my-header title="我的流程" :haveBlack="false"></my-header>
        <div class="my-process" data-test="action_box">
            <div class="my-process-info">
                <text-input label="请求标题" v-model="requestTitle" placeholder="请输入标题"></text-input>
                <base-select label="流程类型" v-model="select.selected" :selectList="select.processList"></base-select>
                <base-button label="查询" @click="getMyProcess()"></base-button>
            </div>
            <div class="my-process-body">
                <define-table :data="myProcessList" height="3.6458rem" :pageInfo="paginator" @changePage="changePage">
                    <define-column label="序号" columnType="index" width="65"></define-column>
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
    import textInput from '@/componentized/textBox/textInput.vue'
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import entityInput from '@/componentized/entity/entityInput'
    
    import defineTable from '@/componentized/entity/defineTable'
    import defineColumn from '@/componentized/entity/defineColumn'

    import { processDefinitions, myProcess } from 'api/process'
    export default {
        name: "myProcessNew",
        data(){
            return{
                requestTitle: "",
                paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0, direction: 'DESC', startUserId: JSON.parse(localStorage.getItem('user')).id},
                select: {
                    processList: [],
                    selected: "", // 选择结果
                },
                list: [{
                    name: '123',
                    age: '10'
                },{
                    name: '456',
                    age: '11'
                },{
                    name: '789',
                    age: '12'
                }],
                myProcessList: [],
                edit: true
            }
        },
        methods:{
            getProcessDefinitions() {
                processDefinitions().then(res => {
                    this.select.processList = res.map(obj => ({label: obj.name, value: obj.name}));
                })
            },
            getMyProcess() {
                myProcess(Object.assign(this.paginator, {search: this.search})).then(res => {
                    this.myProcessList = res.content;
                    this.paginator.totalElements = res.totalElements;
                    this.paginator.totalPages = res.totalPages;
                })
            },
            changePage(page) {
                this.paginator.page = page;
                this.getMyProcess();
            },
            toDetail(data) {
                this.$router.push({
                    name: 'applyAudit',
                    params: {type:'apply', audit: 'order', info: {processInstanceId: data.processInstanceId, taskId: data.taskId, operate: false}}
                })
            }
        },
        computed: {
            search() {
                return this.requestTitle + this.select.selected
            }
        },
        created() {
            this.getProcessDefinitions();
            this.getMyProcess();
        },
        components:{
            myHeader,
            textInput,
            baseSelect,
            baseButton,
            defineColumn,
            entityInput,
            defineTable
        },
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-table {
        .el-table--enable-row-hover,
        .el-table__body tr:hover > td {
            background-color: white;
        }
    }
    .my-process-container{
        color:#707070FF;
        font-size: 16px;
        .my-process-info {
            padding: 16px 7px;
            overflow: hidden;
        }
        .my-process-body {
            padding: 0 17px;
        }
    }
</style>