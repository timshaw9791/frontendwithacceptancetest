<template>
    <div>
        <tool-bar>
            <base-button label="开始维修" type="text" slot="button" @click="toInHouse"></base-button>
        </tool-bar>
        <div class="data-list">
            <define-table :data="list" @changePage="changePage" :pageInfo="paginator">
                <define-column label="操作" width="100" v-slot="{ data }">
                    <div class="span-box">
                        <span>开柜</span>
                    </div>
                </define-column>
                <define-column label="RFID" v-slot="{ data }">
                    <define-input v-model="data.row.equipRfid" type="String" :tableEdit="false"></define-input>
                </define-column>
                <define-column label="装备序号" v-slot="{ data }">
                    <define-input v-model="data.row.equipSerial" type="Number" :tableEdit="false"></define-input>
                </define-column>
                <define-column label="装备参数" v-slot="{ data }">
                    <entity-input v-model="data.row" :options="{detail:'equipArgsDetail'}" format="{name}({model})"
                                  :tableEdit="false"></entity-input>
                </define-column>
                <define-column label="装备位置" v-slot="{ data }">
                    <define-input v-model="data.row.equipLocation" type="String" :tableEdit="false"></define-input>
                </define-column>

                <define-column label="申请时间" :filter="(row)=>$filterTime(row.createTime)"/>
                <define-column label="申请原因" field="reason" :tableEdit="false"/>
            </define-table>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import textInput from '@/componentized/textBox/textInput.vue'
    import defineInput from '@/componentized/textBox/defineInput.vue'
    import bosTabs from '@/componentized/table/bosTabs.vue'
    import baseButton from "@/componentized/buttonBox/baseButton.vue"
    import baseSelect from '@/componentized/textBox/baseSelect.vue'
    import dateSelect from '@/componentized/textBox/dateSelect.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import divTmp from '@/componentized/divTmp'
    import startService from './startService'
    import {getRepairOrder, RepairOrder} from "api/operation"

    export default {
        components: {
            myHeader,
            textInput,
            defineInput,
            baseButton,
            baseSelect,
            dateSelect,
            entityInput,
            startService,
            divTmp,
            bosTabs,
        },
        data() {
            return {
                list: [],
                paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0, abnormal: false},
                inhouse: false,
                inorder: false,
                params: {size: 10, page: 1, state: "REPAIR_RECEIVE"},
                equipData: ''
            }
        },
        methods: {
            toDetail(data) {
                this.equipData = data
                this.inorder = true
            },
            black() {
                this.inhouse = false
                this.inorder = false
                this.getList()
            },
            getList() {
                RepairOrder(this.params).then(res => {
                    this.list = res.content

                }).catch(err => {
                    this.$message.error(err.response.data.message);
                })
            },
            filterNumber(data) {
                return data.inOutHouseItems.length
            },
            changePage(page) {
                this.paginator.page = page;
                ss
            },
            toInHouse() {
                this.$router.push({path: '/equipmentOperation/startService'});
            }
        },
        created() {
            this.getList()
        }
    }
</script>
<style lang="scss" scoped>
    .opening-box {
        font-size: 16px;
        width: 100%;
        min-height: 4.4323rem;

        .btn_box {
            padding: 16px 7px;
            // border-top:1px solid rgba(112, 112, 112, 0.13);
            // border-bottom:1px solid rgba(112, 112, 112, 0.13);
        }

        .data-list {
            padding: 0 10px;
            margin-top: 30px;
            height: "2.8648rem";
            // border:1px solid rgba(112, 112, 112, 0.13)
        }

        .span-box {
            display: flex;
            justify-content: space-between;
        }
    }

</style>