<template>
    <view-container>
        <define-table :data="list"  @changePage="changePage" >
            <define-column label="人员姓名" field="policeName" ></define-column>
            <define-column label="佩戴次数" field="totalCount"></define-column>
            <define-column label="标准次数" field='standCount' width="400"></define-column>
            <define-column label="佩戴率(%)" :filter="(row)=>{return (row.standCount/row.totalCount*100).toFixed(2)}"></define-column>
        </define-table>
    </view-container>
</template>

<script>
    // 佩戴率组件
    import {cabinetWearRate} from "@/api/statistics";
    export default {
        data() {
            return {
                list: [],
            }
        },
        methods: {
            fetchData() {
                cabinetWearRate().then(res => {
                    this.list = res
                })
            },
            changePage(page) {
                this.paginator.page = page;
                this.fetchData()
            },
            toScrap() {
                this.$router.push({path: "scrapInfo", query:{category: '1'}})
            }
        },
        created() {
            this.fetchData()
        }
    }
</script>
<style lang="scss" scoped>

</style>