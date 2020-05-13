<template>
    <div class="right-service-container">
        <my-header :title="$route.meta.title"></my-header>
        <div class="maintenance-form-top">
            <base-button label="报废装备" align="right" :width="128" :height="25" :fontSize="20"
                         @click="toScrap"></base-button>
        </div>
        <div class="maintenance-form-body">
            <define-table :data="list" height="3.64rem" @changePage="changePage" :pageInfo="paginator">
                <define-column label="RFID" v-slot="{ data }">
                    <define-input v-model="data.row.rfid" :tableEdit="false"></define-input>
                </define-column>
                <define-column label="装备序号" v-slot="{ data }">
                    <define-input v-model="data.row.serial" type="Number" :tableEdit="false"></define-input>
                </define-column>
                <define-column label="装备参数" v-slot="{ data }" width="400">
                    <entity-input v-model="data.row" :detailParam="data.row.equipArg"
                                  :options="{ detail: 'equipArgsDetail' }" format="{equipName}({model})"
                                  :disabled="true"></entity-input>
                </define-column>
                <define-column label="装备位置" v-slot="{data}">
                    <entity-input v-model="data.row" :formatFunc="$formatFuncLoc" :tableEdit="false"></entity-input>
                </define-column>
                <define-column label="到期时间" field="scarTime" :filter="(row)=>$filterTime(row.scarTime)"/>
                <define-column label="到期倒计时/天" v-slot="{ data }">
                    <date-input v-model="data.row.scarTime" :tableEdit="false" filter="interval"></date-input>
                </define-column>
            </define-table>

        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import divTmp from '@/componentized/divTmp'
    import serviceDialog from 'components/base/serviceDialog'
    import {equipmentScrapped} from "../../api/statistics";


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
                equipmentScrapped(this.paginator).then(res => {
                    this.paginator.totalPages = res.totalPages
                    this.list = res.content
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