<template>
    <view-container>
        <define-table :data="list"  :pageInfo="paginator" @changePage="changePage">
            <define-column label="操作" width="100" v-slot="{ data }">
                <i class="iconfont iconxiangqing" @click="toDetail(data.row)"></i>
            </define-column>
            <define-column label="请求标题" field="processInstanceName"></define-column>
            <define-column label="任务名称" field="name"></define-column>
            <define-column label="办理时间" :filter="(row)=>$filterTime(row.endTime)"></define-column>
            <define-column label="处理时间" :filter="(row)=>minuteFormate(row.endTime-row.createTime)"></define-column>
        </define-table>
    </view-container>
</template>

<script>
    import myHeader from 'components/base/header/header'
    import {doneTask} from '@/api/process'

    export default {
        name: "completedMatters", //已办任务
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
                    assignee: JSON.parse(localStorage.getItem('user')).id
                },
                list: []
            }
        },
        methods: {
            getList() {
                doneTask(this.paginator).then(res => {
                    this.list = res.content;
                    this.paginator.totalElements = res.totalElements;
                    this.paginator.totalPages = res.totalPages;
                })
            },
            toDetail(data) {
                console.log(data)
                let applyName = data.processInstanceName.includes('报废') ? 'scrap' : 'allocate'
                this.$router.push({
                    path: `/process/${applyName}Apply`,
                    query: {
                        name: data.processInstanceName,
                        processInstanceId: data.processInstanceId,
                        type: 'done',
                    }
                })
            },
            changePage(page) {
                this.paginator.page = page;
                this.getList();
            },
            minuteFormate(my_time) {
                let days = my_time / 1000 / 60 / 60 / 24;
                let daysRound = Math.floor(days);
                let hours = my_time / 1000 / 60 / 60 - (24 * daysRound);
                let hoursRound = Math.floor(hours);
                let minutes = my_time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
                let minutesRound = Math.floor(minutes);
                let seconds = my_time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
                let time = '';
                let h, m, s;
                if (hoursRound === 0) {
                    h = ''
                } else {
                    h = hoursRound + '小时'
                }
                if (minutesRound === 0) {
                    m = ''
                } else {
                    m = minutesRound + '分钟'
                }
                if (seconds === 0) {
                    s = ''
                } else {
                    s = seconds.toFixed(2) + '秒'
                }
                time = h + m + s;
                return time
            }
        },
        created() {
            this.getList();
        }
    }
</script>

<style lang="scss" scoped>

</style>