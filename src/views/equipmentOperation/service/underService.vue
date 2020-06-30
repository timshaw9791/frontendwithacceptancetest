<template>
    <div>
        <tool-bar>
            <base-button label="结束维修" type="text" slot="button"
                         @click="toInHouse"></base-button>
        </tool-bar>
        <div class="data-list">
            <define-table :data="list"  @changePage="changePage"
                          :pageInfo="paginator">
                <define-column label="操作" width="100" v-slot="{ data }">
                    <div class="span-box">
                        <base-button label="报废" size="mini" @click="toScrap(data.row)" type="primary"></base-button>
                    </div>
                </define-column>
                <define-column label="RFID" v-slot="{ data }">
                    <define-input v-model="data.row.rfid" :tableEdit="false"></define-input>
                </define-column>
                <define-column label="装备序号" v-slot="{ data }">
                    <define-input v-model="data.row.serial" type="Number" :tableEdit="false"></define-input>
                </define-column>
                <define-column label="装备参数" v-slot="{ data }">
                    <entity-input v-model="data.row.equipArg" :detailParam="data.row.equipArg"
                                  :options="{ detail: 'equipArgsDetail' }" format="{name}({model})"
                                  :disabled="true"></entity-input>
                </define-column>
                <define-column label="装备位置" v-slot="{data}">
                    <entity-input v-model="data.row.location" :formatFunc="$formatFuncLoc"
                                  :tableEdit="false"></entity-input>
                </define-column>
                <define-column label="维修时长" v-slot="{data}">
                    <date-input v-model="data.row.createTime" filter="toDay" :tableEdit="false"></date-input>
                </define-column>
            </define-table>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import textInput from '@/componentized/textBox/textInput.vue'
    import entityInput from '@/componentized/entity/entityInput'
    import divTmp from '@/componentized/divTmp'
    import endService from './startService'
    import {rightRepairOrder} from "api/operation"

    export default {
        components: {
            myHeader,
            textInput,
            entityInput,
            endService,
            divTmp,
        },
        data() {
            return {
                list: [],
                paginator: {size: 10, page: 1, totalElements: 0, totalPages: 0, abnormal: false},
                inhouse: false,
                inorder: false,
                params: {size: 10, page: 1},
                equipData: '',
                scrapData: ''
            }
        },
        methods: {
            toDetail(data) {
                this.equipData = data
                this.inorder = true
            },
            toScrap(data) {
                this.$router.push({path: '/warehouse/scrapInfo', query: {category: '0', rfids: data.rfid}})
            },
            milliTime(data) {
                let time = (new Date() - data) / (1000 * 60 * 60 * 24) > 1 ? (new Date() - data) / (1000 * 60 * 60 * 24) : 1
                return time
            },
            black() {
                this.inhouse = false
                this.inorder = false
                this.getList()
            },
            getList() {
                rightRepairOrder(this.params).then(res => {
                    this.list = res.content
                }).catch(err => {
                    this.$message.error(err.response.data.message);
                })
            },
            changePage(page) {
                this.paginator.page = page
            },
            toInHouse() {
                this.$router.push({path: "/equipmentOperation/endService"})
            }
        },
        created() {
            this.getList()
        }
    }
</script>
<style lang="scss" scoped>
    .right-service-container {
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