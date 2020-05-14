<template>
    <div class="opening-box">
        <my-header title="装备实体"></my-header>
        <div class="btn_box">
            <base-button label="位置变更" align="right" :width="128" :height="25" :fontSize="20"
                         @click="toAllocation"></base-button>
        </div>
        <div class="data-list">
            <define-table :data="list" height="3.64rem"  :pageInfo="this.paginator"
                          @changePage="changePage" :haveIndex="false" v-if="inList">
                <define-column label="序号" fixed columnType="index" width="65"></define-column>
                <define-column label="操作" width="180" v-slot="{ data }" fixed>
                    <base-button label="编辑" size="mini" @click="edit(data.row)"></base-button>
                    <base-button label="历史" size="mini" @click="show(data.row.id)"></base-button>
                    <base-button label="复制" size="mini" @click="copyRfid(data.row.rfid)"></base-button>
                </define-column>
                <define-column label="图片" width="120" v-slot="{ data }" fixed>
                    <img :src="imgsrc(data.row.equipArg.image)" style="height:100px;width:100px" alt="暂无图片">
                </define-column>
                <define-column label="RFID" fixed width="200" v-slot="{ data }">
                    <define-input v-model="data.row.rfid" type="Number" :tableEdit="false"></define-input>
                </define-column>
                <define-column label="装备序号" field="serial" width="100" fixed/>
                <define-column label="装备名称" width="200" field="equipArg.name" fixed/>
                <define-column label="装备型号" field="equipArg.model" fixed/>
                <define-column label="质保期(天)" :filter="(row)=>milliToDay(row.equipArg.shelfLife)"/>
                <define-column label="充电周期(天)" :filter="(row)=>milliToDay(row.equipArg.chargeCycle)"/>
                <define-column label="保养周期(天)" :filter="(row)=>milliToDay(row.equipArg.upkeepCycle)"/>
                <define-column label="供应商" field="equipArg.supplier.name" width="200"/>
                <define-column label="联系人" width="100" field="equipArg.supplier.person"/>
                <define-column label="联系方式" width="150" field="equipArg.supplier.phone"/>
                <define-column label="生产日期" width="200" :filter="(row)=>$filterTime(row.createTime)"/>
                <define-column label="装备位置" width="200" v-slot="{data}">
                    <entity-input v-model="data.row.location" :formatFunc="$formatFuncLoc"
                                  :tableEdit="false"></entity-input>
                </define-column>
                <define-column label="单价" field="price"/>
            </define-table>
            <equipment-edit v-if="isEdit" @cancel="cancel" :editList="editList"></equipment-edit>
            <copy-rfid :rfid="rfid" :isShow="isShowDialog" @cancel="copyCancel"></copy-rfid>
        </div>
    </div>
</template>

<script>
    import myHeader from 'components/base/header/header';
    import entityInput from '@/componentized/entity/entityInput'
    import imgUp from 'components/base/axiosImgUp';
    import equipAllocation from './equipAllocation'
    import {baseURL} from 'api/config'
    import equipmentEdit from './equipmentEdit'
    import serviceDialog from 'components/base/serviceDialog/index'
    import {equipsAll} from 'api/storage'
    import CopyRfid from "../../components/copyRfid";

    export default {
        components: {
            CopyRfid,
            myHeader,
            entityInput,
            serviceDialog,
            imgUp,
            equipAllocation,
            equipmentEdit
        },
        data() {
            return {
                rfid: '',
                isShowDialog:false,
                list: [],
                newLocation: '',
                editList: {},
                search: '',
                inAllocation: false,
                copyList: '',
                isEdit: false,
                inList: true,
                params: {size: 10, page: 1},
                paginator: {size: 10, page: 1, totalPages: 5, totalElements: 5},
            }
        },
        methods: {
            getList() {
                this.params.page = this.paginator.page
                this.params.size = this.paginator.size
                equipsAll(this.params).then(res => {
                    this.list = res.content;
                    this.paginator.totalPages = res.totalPages
                    this.paginator.totalElements = res.totalElements
                }).catch(err => {
                    this.$message.error(err.response.data.message)
                })
            },
            show(data) {
                this.$router.push({name: 'equiphistoryOrder', query: {id: data}})
                this.$route.meta.title = '装备实体/位置变更'
            },
            changePage(page) {
                this.paginator.page = page
                this.getList()
            },
            edit(data) {
                this.copyList = data
                data.equipArg.shelfLife = this.milliToDay(data.equipArg.shelfLife)
                this.editList = JSON.parse(JSON.stringify(data))
                this.isEdit = true
                this.inList = false
            },
            imgsrc(data) {
                return baseURL + '/images/' + data
            },
            black() {
                this.isEdit = this.isEdit ? !this.isEdit : this.isEdit
                this.inAllocation = this.inAllocation ? !this.inAllocation : this.inAllocation
                this.inList = this.inList ? this.inList : !this.inList
            },
            cancel() {
                this.isEdit = this.isEdit ? !this.isEdit : this.isEdit
                this.inAllocation = this.inAllocation ? !this.inAllocation : this.inAllocation
                this.inList = this.inList ? this.inList : !this.inList
                this.getList()
            },
            confirm() {
                if (this.isEdit) {
                    this.$refs.historyDialog.hide()
                } else {
                    this.editList.location = this.newLocation
                    this.isEdit = !this.isEdit
                }
            },
            current(data) {
                this.newLocation = data.name
            },
            toAllocation() {
                this.$router.push({name: 'equipAllocation'})
            },
            milliToDay(data) {
                let date = JSON.parse(JSON.stringify(data));
                let day = Math.round(date / 24 / 60 / 60 / 1000);
                if (day < 1) {
                    return day = 1;
                } else {
                    return day
                }
            },
            copyRfid(data) {
                this.rfid = data
                this.isShowDialog = true
            },
            copyCancel(){
                this.isShowDialog = false
            }
        },
        created() {
            this.getList();
        }
    }
</script>
<style lang="scss" scoped>
    .opening-box {
        overflow: auto;
        font-size: 16px;
        width: 100%;
        min-height: 4.4323rem;

        .btn_box {
            height: 45px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            border-top: 1px solid rgba(112, 112, 112, 0.13);
            border-bottom: 1px solid rgba(112, 112, 112, 0.13);
        }

        .data-list {
            padding: 0 10px;
            margin-top: 15px;
            height: "2.8648rem";

            // border:1px solid rgba(112, 112, 112, 0.13)
        }
    }

    .edit-equip {
        height: 500px;
        width: 5.625rem;

        .equip-params {
            width: 3.5rem;
            height: 400px;
            float: left;

            .left-param {
                margin-top: 15px;
            }

            .right-param {
                float: right;
                width: 300px;
            }
        }

        .img-box {
            width: 200px;
            float: left;
            margin-left: 30px;
        }
    }

    .btn-box {
        width: 4rem;
        height: 50px;
        margin-left: 20px;
        margin-top: 15px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .location-select {
        height: 500px;
        width: 4.625rem;
        z-index: 1200;

        .select-location {
            width: 3.5rem;
            height: 440px;
            float: left;
            margin-left: auto;
        }
    }

</style>