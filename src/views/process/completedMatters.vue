<template>
    <div class="agency-matters">
        <my-header title="已办事宜" :searchFlag="false"></my-header>
        <div class="agency-matters-top" data-test="action_box">
            <text-input label="请求标题" v-model="paginator.search" placeholder="请输入标题"></text-input>
            <base-button label="查询" @click="getList()"></base-button>
        </div>
        <div class="agency-matters-body" data-test="main_box">
            <div class="table_box" data-test="table_box">
                <el-table :data="list" fit height="3.6458rem" border>
                    <el-table-column label="序号" type="index" width="65" align="center"></el-table-column>
                    <define-column label="操作" width="100" v-slot="{ data }">
                        <i class="iconfont iconxiangqing" @click="toDetail(data.row)"></i>
                    </define-column>
                    <define-column label="请求标题" field="processInstanceName"></define-column>
                    <define-column label="任务名称" field="name"></define-column>
                    <define-column label="办理时间" :filter="(row)=>$filterTime(row.endTime)"></define-column>
                    <define-column label="处理时间" :filter="(row)=>minuteFormate(row.endTime)"></define-column>
                </el-table>
                <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"></bos-paginator>
            </div>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import textInput from '@/componentized/textBox/textInput.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import defineColumn from '@/componentized/entity/defineColumn'
    import {doneTask} from 'api/process'
    export default {
        name: "myProcess",
        components:{
            myHeader,textInput,baseButton,defineColumn
        },
        data(){
            return{
                paginator: {page: 1, size: 10, totalElements: 0, totalPages: 0, search: '', assignee: JSON.parse(localStorage.getItem('user')).id},
                list: []
            }
        },
        methods:{
            getList() {
                doneTask(this.paginator).then(res => {
                    this.list = res.content;
                    this.paginator.totalElements = res.totalElements;
                    this.paginator.totalPages = res.totalPages;
                })
            },
            toDetail(data) {
                if(data.processInstanceName.indexOf("调拨")!=-1){
                    console.log("调拨");
                    this.$router.push({
                        name: 'transferDetail',
                        params: {type:'transfer', audit: 'order', info: {processInstanceId: data.processInstanceId, taskId: data.taskId, operate: false}}
                    })
                } else if(data.processInstanceName.indexOf("报废")!=-1){
                    this.$router.push({
                        name: 'applyAudit',
                        params: {type:'apply', audit: 'order', info: {processInstanceId: data.processInstanceId, taskId: data.taskId, operate: false}}
                    })
                }
            },
            changePage(page) {
                this.paginator.page = page;
                this.getList();
            },
            minuteFormate(my_time){
                let days    = my_time / 1000 / 60 / 60 / 24;
                let daysRound = Math.floor(days);
                let hours = my_time / 1000 / 60 / 60 - (24 * daysRound);
                let hoursRound = Math.floor(hours);
                let minutes = my_time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
                let minutesRound = Math.floor(minutes);
                let seconds = my_time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
                console.log('转换时间:', daysRound + '天', hoursRound + '时', minutesRound + '分', seconds + '秒');
                let time = '';
                let h,m,s;
                if(hoursRound===0){
                    h=''
                }else {
                    h=hoursRound+'小时'
                }
                if(minutesRound===0){
                    m=''
                }else {
                    m=minutesRound+'分钟'
                }
                if(seconds===0){
                    s=''
                }else {
                    s=seconds.toFixed(2)+'秒'
                }
                time=h+m+s;
                return time
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
    .agency-matters-top {
        padding: 16px 7px;
        overflow: hidden;
    }
    .agency-matters-body {
        padding: 0 17px;
    }
</style>