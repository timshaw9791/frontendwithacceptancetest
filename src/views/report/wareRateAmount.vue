<template>
    <view-container>
        <define-table :data="list"  @changePage="changePage" :pageInfo="paginator">
            <define-column label="人员姓名" field="policeName" ></define-column>
            <define-column label="佩戴次数" field="totalCount"></define-column>
            <define-column label="标准次数" field='standCount' width="400"></define-column>
            <define-column label="佩戴率(%)" :filter="(row)=>{return (row.standCount/row.totalCount*100).toFixed(2)}"></define-column>
        </define-table>
    </view-container>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import divTmp from '@/componentized/divTmp'
    import serviceDialog from 'components/base/serviceDialog'
    import {cabinetWearRate} from "../../api/statistics";


    export default {
        components: {
            myHeader,
            divTmp,
            serviceDialog
        },
        data() {
            return {
                list: [],
                paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0},
            }
        },
        methods: {
            fetchData() {
                cabinetWearRate().then(res => {
                    // this.paginator.totalPages = res.totalPages
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
    .right-service-container {
        font-size: 16px;
        width: 100%;
        min-height: 4.4323rem;

        .maintenance-form-top {
            padding: 16px 7px;
        }

        .maintenance-form-body {
            padding: 0 10px;
            margin-top: 30px;
            height: "2.8648rem";
        }
    }
</style>