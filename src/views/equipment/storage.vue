<template>
    <div>
        <el-card shadow="never" v-if="!storageInfoShow">
            <div slot="header">
                <span class="_card-title">{{$route.meta.title}}</span>
            </div>
            <div>
                <tabs>
                    <el-cascader
                            :options="options"
                            :show-all-levels="false"
                    ></el-cascader>

                    <el-button type="text" class="_textBt" @click="goInfo('add')">
                        <svg-icon icon-class="加"/>
                        新增装备信息
                    </el-button>
                    <el-button type="text" class="_textBt" @click="goInfo('storage')">
                        <svg-icon icon-class="加"/>
                        装备入库
                    </el-button>
                    <div class="_buttons">
                        <BosInput
                                placeholder="装备/序号/编号/AB面"
                                suffix="el-icon-search"
                                v-model="inquire"
                                :wrapforlike="true"
                                style=" width:285px;">
                        </BosInput>
                    </div>
                </tabs>
            </div>

            <el-table :data="list" v-loading.body="$apollo.queries.list.loading" element-loading-text="Loading"
                      fit>
                <bos-table-column lable="RFID" field="rfid"></bos-table-column>
                <bos-table-column lable="装备类型" field="equipArg.category.genre.name"></bos-table-column>
                <bos-table-column lable="装备类别" field="equipArg.category.name"></bos-table-column>
                <bos-table-column lable="装备名称" field="equipArg.name"></bos-table-column>
                <bos-table-column lable="装备型号" field="equipArg.model"></bos-table-column>
                <bos-table-column lable="供应商" field="equipArg.supplier.name"></bos-table-column>
                <el-table-column label="操作" align="supplier" width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="goInfo('look',scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <bos-paginator :pageInfo="paginator" @bosCurrentPageChanged="changePage"/>
        </el-card>

        <storageInfo :equipId="equipId" v-if="storageInfoShow" :title="title" @black="black"></storageInfo>
    </div>
</template>

<script>
    import tabs from 'components/base/tabs/index'
    import storageInfo from 'views/equipment/storageInfo'
    import api from 'gql/eqList.gql'

    import {formRulesMixin} from "../../field/common/mixinTable";

    export default {
        data() {
            return {
                inquire: '',
                options: [],
                commonHouseId: '',
                equipId: '',
                title: '',
                storageInfoShow: false,
                list: [],
            }
        },
        components: {
            tabs,
            storageInfo
        },
        methods: {
            goInfo(data, row) {
                switch (data) {
                    case 'add':
                        this.storageInfoShow = true;
                        this.title = '新增装备信息';
                        this.equipId='';
                        break;
                    case 'storage':
                        this.storageInfoShow = true;
                        this.title = '装备入库';
                        this.equipId='';
                        break;
                    case 'look':
                        this.storageInfoShow = true;
                        this.title = '装备查看';
                        this.equipId = row.id;
                        break;
                }
            },
            black(data) {
                this.storageInfoShow = false;
                this.refetch();
            }
        },
        apollo: {
            list() {
                return this.getEntityListWithPagintor(api.getEquipList);
            },
        },


        mounted() {

        },
        mixins: [formRulesMixin],

    }
</script>

<style lang="scss" scoped>
    .el-card {
        border: none !important;
    }
</style>