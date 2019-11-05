<template>
    <div>
        <el-table :data="list" v-loading.body="loading" element-loading-text="Loading"
                  fit highlight-current-row>
            <bos-table-column lable="rfid" field="equip.rfid"></bos-table-column>
            <bos-table-column lable="装备名称" field="name"></bos-table-column>
            <bos-table-column lable="装备序号" field="serial"></bos-table-column>
            <bos-table-column lable="架体编号" field="location.number"></bos-table-column>
            <bos-table-column lable="架体AB面"
                              :filter="(row)=>surface(row.location?row.location.surface:'暂无')"></bos-table-column>

            <!--<bos-table-column lable="充电周期" field="equipArg.chargeCycle"></bos-table-column>-->

            <bos-table-column lable="充电周期" :filter="(row)=>milliToDay(row.equipArg.chargeCycle)"></bos-table-column>

        </el-table>

        <bos-paginator v-if="this.list!=''" :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
    </div>

</template>

<script>

    import {formRulesMixin} from 'field/common/mixinComponent';
    import { getEquipsList } from "api/operation"
    import {transformMixin} from 'common/js/transformMixin'

    export default {
        data() {
            return {
                loading: true,
                list: [],
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
            }
        },
        methods: {
            getList() {
                let params = {
                    page: this.paginator.page,
                    size: this.paginator.size,
                    state: "CHARGE"
                };
                this.loading = true
                getEquipsList(params).then(res => {
                    this.list = JSON.parse(JSON.stringify(res.content))  
                    this.paginator.totalPages = res.totalPages
                    this.paginator.totalElements = res.totalElements
                    this.loading = false  
                }).catch(e => {
                    this.loading = false
                })
                
            },
            changePage(page) {
                this.paginator.page = page
                this.getList()
            }
        },
        mounted() {
            this.getList()
        },
        mixins: [formRulesMixin, transformMixin],
    }

</script>

<style scoped>

</style>