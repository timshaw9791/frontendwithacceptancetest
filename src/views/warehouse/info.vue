<template>
    <div>
        <el-card shadow="never" v-if="!equipShow">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <tabs>
                    <!-- <tab-select :options="selectList" indexDefault="全部" @selected="selectValue"></tab-select> -->
                    <div class="_buttons">
                        <BosInput
                                placeholder="大类/小类/名称/型号/供应商"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="true"
                                style=" width:285px;">
                        </BosInput>
                    </div>
                </tabs>
                <el-table :data="list" v-loading.body="false" element-loading-text="Loading"
                          fit>

                    <bos-table-column lable="装备类型" field="category.genre.name"></bos-table-column>
                    <bos-table-column lable="装备小类" field="category.name"></bos-table-column>
                    <bos-table-column lable="装备名称" field="name"></bos-table-column>
                    <bos-table-column lable="装备型号" field="model"></bos-table-column>
                    <bos-table-column lable="供应商" field="supplier.name"></bos-table-column>
                    <el-table-column label="操作" align="center" width="200">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="goInfo(scope.row)">查 看</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <bos-paginator v-if="this.list" :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
            </div>
        </el-card>

        <equip :equipArgId="equipId" :title="title" v-if="equipShow"
               @black="black"></equip>

    </div>
</template>

<script>

    import tabs from 'components/base/tabs/index'
    import {formRulesMixin} from 'field/common/mixinTableRest';
    import api from 'gql/warehouse.gql'
    import { getHouse } from "api/warehouse"
    import {transformMixin} from 'common/js/transformMixin'
    import {retirementApplication} from "api/operation";
    import tabSelect from 'components/base/tabs-select'
    import equip from 'views/equipment/storageInfo'


    export default {

        data() {
            return {
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
                selectList: [{label: '全部', value: '全部'}],
                equipId: '',
                list: [],
                title: '',
                inquire: '',
                equipShow: false,
            }
        },
        methods: {
            getHouseList() {
                let params = {
                    page: this.paginator.page, 
                    size: this.paginator.size,
                    search: this.inquire
                };
                getHouse(params).then(res => {
                    let result = JSON.parse(JSON.stringify(res))
                    this.paginator.totalPages = res.totalPages
                    this.paginator.totalElements = res.totalElements
                    this.list = res.content
                })
            },
            selectValue(data) {
                console.log(data);
            },
            black(data) {
                this.equipShow = false;
                this.refetch();
            },
            goInfo(data) {
                this.equipId = data.id;
                this.title = '装备信息查看';
                this.equipShow = true;
            }
        },
        mixins: [formRulesMixin, transformMixin],

        components: {
            equip,
            tabs,
            tabSelect
        },
        mounted() {
            this.getHouseList()
        },
        watch: {
            inquire(newVal, oldVal) {
                this.getHouseList()
            }
        }

    }
</script>

<style lang="scss" scoped>
    .el-card {
        font-size: 0.0833rem;
        border: none !important;
    }

</style>