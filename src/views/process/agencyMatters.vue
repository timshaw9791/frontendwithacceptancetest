<template>
    <div class="agency-matters">
        <my-header :title="'待办事宜'" :searchFlag="false"></my-header>
        <div class="agency-metters-top">
            <text-input label="请求标题" v-model="paginator.search" :column="3" placeholder="请输入标题"></text-input>
            <base-button label="查询" @click="getList()"></base-button>
        </div>
        <div class="agency-matters_main_box" data-test="main_box">
            <div class="table_box" data-test="table_box">
                <el-table :data="list" fit height="3.6458rem" border>
                    <el-table-column label="序号" type="index" width="65" align="center"></el-table-column>
                    <define-column label="操作" width="100" v-slot="{ data }">
                        <i class="iconfont iconxiangqing" @click="toDetail(data.row)"></i>
                    </define-column>
                    <define-column label="请求标题" field="processInstanceName"></define-column>
                    <define-column label="任务名称" field="name"></define-column>
                    <define-column label="创建时间" :filter="(row)=>$filterTime(row.createTime)"></define-column>
                </el-table>
                <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"></bos-paginator>
                <!-- <div style="padding: 0px 0.09375rem"><p_table ref="processTable" :table="table" :typeUrl="'process'" :otherParams="true" @clickTable="clickTable" v-show="status.tableOrUniversalFlag"></p_table></div>
                <p_universal @back="black" :url="universal.url" :title="universal.title" :universalObj="universal.universalObj" v-if="!status.tableOrUniversalFlag"></p_universal> -->
            </div>
        </div>
    </div>
</template>

<script>
    import textInput from '@/componentized/textBox/textInput.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import myHeader from 'components/base/header/header'
    import defineColumn from '@/componentized/entity/defineColumn'
    import { todoProcess } from 'api/process'
    export default {
        name: "myProcess",
        components:{
            defineColumn,textInput,baseButton
        },
        data(){
            return{
                list: [],
                paginator: {
                    page: 1,
                    size: 10,
                    totalElements: 0,
                    totalPages: 0,
                    search: '',
                    assignee: JSON.parse(localStorage.getItem('user')).id
                }
            }
        },
        methods:{
            getList() {
                todoProcess(this.paginator).then(res => {
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
                this.$router.push({
                    name: 'applyAudit',
                    params: {type:'apply', audit: 'order', info: {processInstanceId: data.processInstanceId, taskId: data.taskId}}
                })
            }
        },
        created() {
            this.getList();
        }
    }
</script>

<style lang="scss" scoped>
    .agency-matters{
        width: 100%;
        color:#707070FF;
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